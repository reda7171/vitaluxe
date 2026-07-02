import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { auth } from "../../../../../lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

        const body = await req.json();
        const { items, paymentMethod } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Le panier est vide" }, { status: 400 });
        }

        // 1. Calculate total server-side to prevent tampering
        let totalAmount = 0;
        const productsMap = new Map();
        
        for (const item of items) {
            const product = await prisma.product.findUnique({ where: { id: item.id } });
            if (!product) {
                return NextResponse.json({ error: `Produit introuvable: ${item.name}` }, { status: 400 });
            }
            if (product.stock < item.quantity) {
                return NextResponse.json({ error: `Stock insuffisant pour: ${item.name}` }, { status: 400 });
            }
            
            const price = product.salePrice ? product.salePrice : product.price;
            totalAmount += price * item.quantity;
            productsMap.set(item.id, product);
        }

        // 2. Get or Create "Client Comptoir"
        let walkInCustomer = await prisma.user.findUnique({
            where: { email: "comptoir@vitaluxe.ma" }
        });

        if (!walkInCustomer) {
            const hashedPassword = await bcrypt.hash(Math.random().toString(36).slice(-8), 10);
            walkInCustomer = await prisma.user.create({
                data: {
                    name: "Client Comptoir",
                    email: "comptoir@vitaluxe.ma",
                    password: hashedPassword,
                    role: "CUSTOMER",
                    phone: "0000000000"
                }
            });
        }

        // 3. Create Order, OrderItems and update stock in a transaction
        const result = await prisma.$transaction(async (tx) => {
            // Create the order
            const order = await tx.order.create({
                data: {
                    userId: walkInCustomer.id,
                    totalAmount,
                    status: "DELIVERED", // Since it's POS, it's immediately delivered
                    paymentMethod: paymentMethod || "POS_CASH",
                    orderItems: {
                        create: items.map((item: any) => ({
                            productId: item.id,
                            quantity: item.quantity,
                            price: productsMap.get(item.id).salePrice || productsMap.get(item.id).price
                        }))
                    }
                }
            });

            // Update product stock
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.id },
                    data: {
                        stock: {
                            decrement: item.quantity
                        }
                    }
                });
            }

            return order;
        });

        return NextResponse.json({ success: true, order: result });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erreur serveur lors de la validation" }, { status: 500 });
    }
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/email";

export async function POST(req: Request) {
    try {
        const session = await auth();
        const body = await req.json();
        const { items, totalAmount, paymentMethod, firstName, lastName, email: guestEmail } = body;

        let userId: string | undefined;
        let dbUser = null;

        if (session?.user?.email) {
            dbUser = await prisma.user.findUnique({ where: { email: session.user.email } });
        }

        if (dbUser) {
            userId = dbUser.id;
        } else if (guestEmail) {
            const guest = await prisma.user.findUnique({ where: { email: guestEmail } });
            if (guest) {
                userId = guest.id;
            } else {
                const newUser = await prisma.user.create({
                    data: { name: `${firstName || ""} ${lastName || ""}`.trim() || "Guest", email: guestEmail, password: "", role: "CUSTOMER" },
                });
                userId = newUser.id;
            }
        } else {
            return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
        }

        // Créer la commande
        const order = await prisma.order.create({
            data: {
                userId,
                totalAmount,
                paymentMethod,
                status: "PENDING",
                orderItems: {
                    create: items.map((item: { productId: string; quantity: number; price: number }) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: { orderItems: true },
        });

        // ✅ Décrémenter le stock pour chaque produit
        await Promise.all(
            items.map((item: { productId: string; quantity: number }) =>
                prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                })
            )
        );

        // Envoyer email de confirmation (non-bloquant)
        const orderUser = await prisma.user.findUnique({ where: { id: userId }, select: { name: true, email: true } });
        if (orderUser?.email) {
            sendOrderConfirmationEmail({
                to: orderUser.email,
                name: orderUser.name ?? "",
                orderId: order.id,
                items: order.orderItems.map(i => ({ name: (i as { productId: string; quantity: number; price: number }).productId, quantity: i.quantity, price: i.price })),
                total: totalAmount,
                paymentMethod,
            }).catch(console.error);
        }

        return NextResponse.json(order, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function GET() {
    const orders = await prisma.order.findMany({
        include: {
            user: { select: { name: true, email: true } },
            orderItems: { include: { product: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(orders);
}

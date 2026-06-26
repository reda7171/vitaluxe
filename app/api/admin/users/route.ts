import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
            return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
        }

        const customers = await prisma.user.findMany({
            where: { role: "CUSTOMER" },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true,
                orders: {
                    select: {
                        id: true,
                        totalAmount: true,
                        status: true,
                        createdAt: true,
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });

        const formatted = customers.map(user => {
            const deliveredOrders = user.orders.filter(o => o.status === "DELIVERED");
            const totalSpent = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);

            return {
                id: user.id,
                name: user.name,
                email: user.email,
                image: user.image,
                createdAt: user.createdAt,
                orderCount: user.orders.length,
                totalSpent: Math.round(totalSpent),
                orders: user.orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            };
        });

        return NextResponse.json(formatted);
    } catch (error) {
        console.error("Admin Users API Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}


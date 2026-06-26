import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const [totalProducts, totalOrders, totalUsers, revenue, unreadMessages] = await Promise.all([
            prisma.product.count(),
            prisma.order.count(),
            prisma.user.count({ where: { role: "CUSTOMER" } }),
            prisma.order.aggregate({
                _sum: { totalAmount: true },
                where: { status: "DELIVERED" },
            }),
            prisma.contactMessage.count({ where: { status: "UNREAD" } })
        ]);

        const recentOrders = await prisma.order.findMany({
            take: 5,
            orderBy: { createdAt: "desc" },
            include: { user: { select: { name: true, email: true } } },
        });

        const ordersByStatus = await prisma.order.groupBy({
            by: ["status"],
            _count: { id: true },
        });

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

        const monthlyOrders = await prisma.order.findMany({
            where: { createdAt: { gte: sixMonthsAgo }, status: "DELIVERED" },
            select: { createdAt: true, totalAmount: true },
            orderBy: { createdAt: "asc" },
        });

        const salesByCategoryRaw = await prisma.orderItem.findMany({
            where: { order: { status: "DELIVERED" } },
            select: {
                price: true,
                quantity: true,
                product: {
                    select: {
                        category: { select: { name: true } }
                    }
                }
            }
        });

        const salesByCategoryMap: Record<string, number> = {};
        salesByCategoryRaw.forEach(item => {
            const catName = item.product.category.name;
            const total = item.price * item.quantity;
            salesByCategoryMap[catName] = (salesByCategoryMap[catName] || 0) + total;
        });

        const salesByCategory = Object.entries(salesByCategoryMap).map(([name, value]) => ({
            name,
            value: Math.round(value)
        })).sort((a, b) => b.value - a.value);

        return NextResponse.json({
            stats: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue: revenue._sum.totalAmount || 0,
                unreadMessages
            },
            recentOrders,
            ordersByStatus,
            monthlyOrders,
            salesByCategory
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

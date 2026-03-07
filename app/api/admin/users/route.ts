import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            _count: { select: { orders: true } },
            orders: { select: { totalAmount: true } },
        },
    });

    const data = users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        _count: u._count,
        totalSpent: u.orders.reduce((s, o) => s + o.totalAmount, 0),
    }));

    return NextResponse.json(data);
}

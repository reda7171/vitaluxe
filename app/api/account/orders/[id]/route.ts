import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const order = await prisma.order.findFirst({
        where: { id, userId: session.user.id },
        include: {
            orderItems: {
                include: { product: { select: { name: true, brand: true, images: true } } },
            },
        },
    });

    if (!order) return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    return NextResponse.json(order);
}

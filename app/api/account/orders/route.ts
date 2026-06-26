import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

export async function GET() {
    const session = await auth();
    if (!session?.user?.email) {
        return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
        return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    const orders = await prisma.order.findMany({
        where: { userId: user.id },
        include: {
            orderItems: {
                include: { product: { select: { name: true, brand: true, images: true, slug: true } } },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
}

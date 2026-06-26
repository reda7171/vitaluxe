import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import { sendOrderStatusEmail } from "../../../../lib/email";

// PUT /api/orders/[id] — update status or archive
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const { status, archived } = await req.json();
    const data: Record<string, unknown> = {};
    if (status) data.status = status;
    if (archived !== undefined) data.archived = archived;

    const order = await prisma.order.update({
        where: { id },
        data,
        include: { user: { select: { email: true, name: true } } }
    });

    // Envoi de l'email automatique si le statut a changé
    if (status) {
        try {
            await sendOrderStatusEmail({
                to: order.user.email,
                name: order.user.name || "Client",
                orderId: order.id,
                status: status as string
            });
        } catch (e) {
            console.error("Erreur envoi email statut:", e);
        }
    }

    return NextResponse.json(order);
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const order = await prisma.order.findUnique({
        where: { id },
        include: {
            user: { select: { name: true, email: true, phone: true, image: true, addresses: true } },
            orderItems: { include: { product: { select: { name: true, images: true, brand: true } } } },
        },
    });
    if (!order) return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    return NextResponse.json(order);
}

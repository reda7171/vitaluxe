import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth();
    if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const orders = await prisma.order.findMany({
        include: {
            user: { select: { name: true, email: true } },
            orderItems: { include: { product: { select: { name: true } } } },
        },
        orderBy: { createdAt: "desc" },
    });

    const rows = [
        ["ID", "Client", "Email", "Montant (MAD)", "Statut", "Paiement", "Produits", "Date"].join(","),
        ...orders.map(o => [
            o.id,
            `"${o.user.name ?? ""}"`,
            o.user.email,
            o.totalAmount,
            o.status,
            o.paymentMethod,
            `"${o.orderItems.map(i => `${i.product.name} x${i.quantity}`).join(" | ")}"`,
            new Date(o.createdAt).toLocaleDateString("fr-FR"),
        ].join(",")),
    ].join("\n");

    return new Response(rows, {
        headers: {
            "Content-Type": "text/csv; charset=utf-8",
            "Content-Disposition": `attachment; filename="commandes-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
    });
}

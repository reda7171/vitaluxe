import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
        }

        // Supprimer les références avant les produits (contraintes FK)
        // Note: Review et Wishlist ont onDelete: Cascade dans le schema.prisma
        await prisma.orderItem.deleteMany({ where: { productId: { in: ids } } });
        
        // Supprimer les produits
        const result = await prisma.product.deleteMany({
            where: { id: { in: ids } }
        });

        return NextResponse.json({ success: true, count: result.count });
    } catch (error) {
        console.error("BULK DELETE products error:", error);
        return NextResponse.json({ error: "Impossible de supprimer les produits sélectionnés" }, { status: 500 });
    }
}
export async function PATCH(req: Request) {
    try {
        const { ids, discountPercent, clear } = await req.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
        }

        if (clear) {
            await prisma.product.updateMany({
                where: { id: { in: ids } },
                data: { salePrice: null }
            });
            return NextResponse.json({ success: true, message: "Promotions retirées" });
        }

        if (typeof discountPercent !== 'number' || discountPercent <= 0 || discountPercent >= 100) {
            return NextResponse.json({ error: "Pourcentage invalide" }, { status: 400 });
        }

        // Pour un pourcentage, on doit faire une mise à jour par produit car le prix varie
        const products = await prisma.product.findMany({
            where: { id: { in: ids } },
            select: { id: true, price: true }
        });

        const updates = products.map(p => {
            const salePrice = Math.round(p.price * (1 - discountPercent / 100));
            return prisma.product.update({
                where: { id: p.id },
                data: { salePrice }
            });
        });

        await prisma.$transaction(updates);

        return NextResponse.json({ success: true, message: `Promotion de ${discountPercent}% appliquée` });
    } catch (error) {
        console.error("BULK PATCH products error:", error);
        return NextResponse.json({ error: "Impossible de mettre à jour les produits" }, { status: 500 });
    }
}

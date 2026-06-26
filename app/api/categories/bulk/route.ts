import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
        }

        // Récupérer tous les produits de ces catégories
        const products = await prisma.product.findMany({
            where: { categoryId: { in: ids } },
            select: { id: true },
        });
        const productIds = products.map(p => p.id);

        // Supprimer en cascade dans l'ordre des FK
        await prisma.orderItem.deleteMany({ where: { productId: { in: productIds } } });
        await prisma.wishlist.deleteMany({ where: { productId: { in: productIds } } });
        await prisma.review.deleteMany({ where: { productId: { in: productIds } } });
        await prisma.product.deleteMany({ where: { categoryId: { in: ids } } });
        
        // Supprimer les catégories
        const result = await prisma.category.deleteMany({
            where: { id: { in: ids } }
        });

        return NextResponse.json({ 
            success: true, 
            count: result.count, 
            deletedProducts: productIds.length 
        });
    } catch (error) {
        console.error("BULK DELETE categories error:", error);
        return NextResponse.json({ error: "Impossible de supprimer les catégories sélectionnées" }, { status: 500 });
    }
}

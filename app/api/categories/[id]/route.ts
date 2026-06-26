import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// DELETE une catégorie avec suppression en cascade
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Récupérer tous les produits de cette catégorie
    const products = await prisma.product.findMany({
        where: { categoryId: id },
        select: { id: true },
    });
    const productIds = products.map(p => p.id);

    // Supprimer en cascade dans l'ordre des FK
    await prisma.orderItem.deleteMany({ where: { productId: { in: productIds } } });
    await prisma.wishlist.deleteMany({ where: { productId: { in: productIds } } });
    await prisma.review.deleteMany({ where: { productId: { in: productIds } } });
    await prisma.product.deleteMany({ where: { categoryId: id } });
    await prisma.category.delete({ where: { id } });

    return NextResponse.json({ success: true, deletedProducts: productIds.length });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { name, image } = await req.json();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await prisma.category.update({
        where: { id },
        data: { name, slug, image },
    });
    return NextResponse.json(category);
}

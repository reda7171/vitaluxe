import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = await prisma.product.findUnique({
        where: { id },
        include: { category: { select: { name: true } } },
    });
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(product);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        // Supprimer les références avant le produit (contraintes FK)
        await prisma.wishlist.deleteMany({ where: { productId: id } });
        await prisma.orderItem.deleteMany({ where: { productId: id } });
        await prisma.product.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE product error:", error);
        return NextResponse.json({ error: "Impossible de supprimer ce produit" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const body = await req.json();
    const { name, description, price, stock, categoryId, brand, images } = body;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const product = await prisma.product.update({
        where: { id },
        data: { name, slug, description, price, stock, categoryId, brand, images },
    });
    return NextResponse.json(product);
}

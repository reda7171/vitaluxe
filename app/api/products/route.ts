import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    // Optimisation : sélection des champs nécessaires uniquement et tri manuel JS
    const rawProducts = await prisma.product.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            stock: true,
            images: true,
            brand: true,
            categoryId: true,
            category: { select: { name: true } },
            createdAt: true,
        },
        take: 50,
    });

    const sorted = rawProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    return NextResponse.json(sorted);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, description, price, stock, categoryId, brand, images } = body;

        // Générer un slug unique pour éviter les conflits
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4);

        const product = await prisma.product.create({
            data: {
                name,
                slug,
                description,
                price: Number(price) || 0,
                stock: Number(stock) || 0,
                categoryId,
                brand,
                images: JSON.stringify(images || []), // Stocker en string JSON comme dans le seed
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error("Erreur lors de la création du produit:", error);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}

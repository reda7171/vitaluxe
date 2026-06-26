import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    const category = searchParams.get("category") ?? "";

    if (q.length < 2) return NextResponse.json([]);

    const products = await prisma.product.findMany({
        where: {
            AND: [
                {
                    OR: [
                        { name: { contains: q } },
                        { brand: { contains: q } },
                        { description: { contains: q } },
                    ],
                },
                // Filtre catégorie si fourni
                category ? { category: { slug: category } } : {},
            ],
        },
        select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            price: true,
            salePrice: true,
            brand: true,
            category: { select: { name: true } },
        },
        take: 8,
    });

    return NextResponse.json(products);
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") ?? "";
    if (q.length < 2) return NextResponse.json([]);

    const products = await prisma.product.findMany({
        where: {
            OR: [
                { name: { contains: q } },
                { brand: { contains: q } },
                { description: { contains: q } },
            ],
        },
        select: { id: true, name: true, slug: true, images: true, price: true, salePrice: true, brand: true },
        take: 6,
    });

    return NextResponse.json(products);
}

import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET toutes les catégories
export async function GET() {
    const categories = await prisma.category.findMany({
        include: { _count: { select: { products: true } } },
        orderBy: { name: "asc" },
    });
    return NextResponse.json(categories);
}

// POST créer une catégorie
export async function POST(req: Request) {
    const { name, image } = await req.json();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const category = await prisma.category.create({ data: { name, slug, image } });
    return NextResponse.json(category);
}

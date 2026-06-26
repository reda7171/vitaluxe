import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

export async function GET() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

    const brands = await prisma.brand.findMany({
        orderBy: { name: "asc" },
    });
    return NextResponse.json(brands);
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

        const body = await req.json();
        const { name, image } = body;

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const brand = await prisma.brand.create({
            data: { name, slug, image },
        });

        return NextResponse.json(brand);
    } catch (error: any) {
        console.error("POST /api/admin/brands error:", error);
        if (error.code === 'P2002') return NextResponse.json({ error: "Cette marque existe déjà." }, { status: 400 });
        return NextResponse.json({ error: "Erreur lors de la création de la marque." }, { status: 500 });
    }
}

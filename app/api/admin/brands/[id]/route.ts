import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.brand.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la suppression de la marque." }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, image } = body;

        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const brand = await prisma.brand.update({
            where: { id },
            data: { name, slug, image },
        });

        return NextResponse.json(brand);
    } catch (error: any) {
        console.error("PUT /api/admin/brands/[id] error:", error);
        if (error.code === "P2002") return NextResponse.json({ error: "Ce nom de marque est déjà utilisé." }, { status: 400 });
        return NextResponse.json({ error: "Erreur lors de la modification de la marque." }, { status: 500 });
    }
}

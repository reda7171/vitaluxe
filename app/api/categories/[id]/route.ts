import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// DELETE / PUT une catégorie par id
export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
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

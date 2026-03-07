import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    await prisma.address.deleteMany({ where: { id, userId: session.user.id } });
    return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await req.json();

    if (body.isDefault) {
        await prisma.address.updateMany({ where: { userId: session.user.id }, data: { isDefault: false } });
    }

    const updated = await prisma.address.update({
        where: { id },
        data: body,
    });

    return NextResponse.json(updated);
}

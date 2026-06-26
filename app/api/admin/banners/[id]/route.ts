import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../../lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== "ADMIN") return NextResponse.json({}, { status: 403 });

        const { id } = await params;
        const data = await req.json();
        const banner = await prisma.banner.update({ where: { id }, data });
        return NextResponse.json(banner);
    } catch {
        return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== "ADMIN") return NextResponse.json({}, { status: 403 });

        const { id } = await params;
        await prisma.banner.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }
}

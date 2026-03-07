import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promos = await (prisma as any).promoCode.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json(promos);
    } catch {
        return NextResponse.json([]); // Prisma client not yet regenerated
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).promoCode.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
    }
}

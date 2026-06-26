import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promos = await (prisma as any).promoCode.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json(promos);
    } catch {
        return NextResponse.json([]); // Prisma client not yet regenerated
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

        const { id } = await req.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (prisma as any).promoCode.delete({ where: { id } });
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
    }
}

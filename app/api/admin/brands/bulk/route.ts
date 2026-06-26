import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../../lib/auth";

export async function DELETE(req: Request) {
    const session = await auth();
    // @ts-ignore
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    try {
        const { ids } = await req.json();

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
        }

        const result = await prisma.brand.deleteMany({
            where: { id: { in: ids } }
        });

        return NextResponse.json({ success: true, count: result.count });
    } catch (error) {
        console.error("BULK DELETE brands error:", error);
        return NextResponse.json({ error: "Impossible de supprimer les marques sélectionnées" }, { status: 500 });
    }
}

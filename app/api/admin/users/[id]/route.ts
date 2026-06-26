import prisma from "../../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../../lib/auth";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== "ADMIN") return NextResponse.json({}, { status: 403 });

        const { id } = await params;
        const { role } = await req.json();

        if (!["ADMIN", "CUSTOMER"].includes(role)) {
            return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
        }

        const user = await prisma.user.update({
            where: { id },
            data: { role },
        });

        return NextResponse.json({ success: true, role: user.role });
    } catch {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

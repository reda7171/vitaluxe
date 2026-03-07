import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { status } = await req.json();
        const updated = await prisma.prescription.update({
            where: { id },
            data: { status },
        });
        return NextResponse.json(updated);
    } catch (error) {
        console.error("PATCH /api/admin/prescriptions/[id] error:", error);
        return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.prescription.delete({ where: { id } });
        return new NextResponse(null, { status: 204 });
    } catch (error) {
        return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
    }
}

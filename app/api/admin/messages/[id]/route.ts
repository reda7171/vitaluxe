import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await auth();
        // @ts-ignore
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const body = await req.json();
        const { status } = body;

        const msg = await prisma.contactMessage.update({
            where: { id },
            data: { status },
        });

        return NextResponse.json(msg);
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await auth();
        // @ts-ignore
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        await prisma.contactMessage.delete({
            where: { id },
        });

        return NextResponse.json({ message: "Supprimé" });
    } catch (error) {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

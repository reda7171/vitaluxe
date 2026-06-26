import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";

export async function GET() {
    try {
        const session = await auth();
        // @ts-ignore
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
        }

        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email requis" }, { status: 400 });
        }

        const existing = await prisma.newsletterLead.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json({ message: "Déjà inscrit" }, { status: 200 });
        }

        const lead = await prisma.newsletterLead.create({
            data: { email },
        });

        return NextResponse.json({ message: "Inscription confirmée", lead }, { status: 201 });
    } catch (error) {
        console.error("Erreur inscription newsletter:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

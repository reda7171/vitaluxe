import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { name, phone, note, image } = await req.json();
        if (!name || !phone || !image) {
            return NextResponse.json({ error: "Champs requis manquants." }, { status: 400 });
        }

        const prescription = await prisma.prescription.create({
            data: { name, phone, note: note || null, image },
        });

        return NextResponse.json(prescription, { status: 201 });
    } catch (error) {
        console.error("POST /api/ordonnance error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

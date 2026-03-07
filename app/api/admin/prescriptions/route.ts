import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const prescriptions = await prisma.prescription.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(prescriptions);
    } catch (error) {
        console.error("GET /api/admin/prescriptions error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 403 });

        const prescriptions = await prisma.prescription.findMany({
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(prescriptions);
    } catch (error) {
        console.error("GET /api/admin/prescriptions error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

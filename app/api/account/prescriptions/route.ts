import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { getToken } from "next-auth/jwt";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET(req: Request) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET ?? "vitaluxe-secret-dev-2026" });
        if (!token) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const prescriptions = await db.prescription.findMany({
            where: { userId: String(token.id) },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(prescriptions);
    } catch (error) {
        console.error("GET /api/account/prescriptions error:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

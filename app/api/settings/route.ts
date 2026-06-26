import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET() {
    try {
        const settings = await db.storeSettings.findUnique({ where: { id: "1" } });
        return NextResponse.json(settings || {});
    } catch (error) {
        console.error("FAIL-SAFE: Settings API Error:", error);
        // On retourne un objet vide plutot qu'une erreur 500 pour ne pas casser le layout
        return NextResponse.json({}, { status: 200 });
    }
}

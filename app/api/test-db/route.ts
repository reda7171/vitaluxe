import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        // Tentave de lecture d'un produit (ou utilisateur)
        const count = await prisma.user.count();
        return NextResponse.json({ success: true, userCount: count });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message,
            code: error.code
        }, { status: 500 });
    }
}

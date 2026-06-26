import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const revalidate = 3600; // Cache de 1 heure

export async function GET() {
    try {
        // Obtenir des produits récents ou avec un stock important (solution légère pour remplacer groupBy)
        const products = await prisma.product.findMany({
            take: 5,
            select: { name: true },
            orderBy: { createdAt: "desc" },
        });

        if (products.length === 0) {
            return NextResponse.json(["Crème", "Sérum", "Solaire"]);
        }

        return NextResponse.json(products.map(p => p.name));


    } catch (error) {
        console.error("Popular search fetch error:", error);
        return NextResponse.json(["Crème hydratante", "Sérum Anti-Âge", "Écran Solaire"], { status: 200 });
    }
}

import { NextResponse } from "next/server";
import prisma from "../../../../../lib/prisma";
import { auth } from "../../../../../lib/auth";

export async function GET(req: Request) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";

        const products = await prisma.product.findMany({
            where: {
                name: {
                    contains: search,
                },
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 50 // Limit to 50 for performance, real POS would have better pagination/search
        });

        return NextResponse.json(products);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

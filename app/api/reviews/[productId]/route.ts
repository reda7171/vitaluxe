import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { productId: string } }) {
    try {
        const { productId } = params;

        const reviews = await prisma.review.findMany({
            where: {
                productId,
                status: "APPROVED"
            },
            include: { user: { select: { name: true } } },
            orderBy: { createdAt: "desc" }
        });

        return NextResponse.json(reviews);
    } catch {
        return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }
}

import prisma from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

        const reviews = await prisma.review.findMany({
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true, images: true } }
            }
        });

        reviews.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        return NextResponse.json(reviews);
    } catch (error) {
        console.error("ADMIN REVIEWS API ERROR:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

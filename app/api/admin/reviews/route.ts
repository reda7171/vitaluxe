import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

        const reviews = await prisma.review.findMany({
            orderBy: { createdAt: "desc" },
            include: {
                user: { select: { name: true, email: true } },
                product: { select: { name: true, images: true } }
            }
        });

        return NextResponse.json(reviews);
    } catch {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

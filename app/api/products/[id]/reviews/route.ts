import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

// GET /api/products/[id]/reviews
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const reviews = await db.review.findMany({
            where: { productId: id },
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(reviews);
    } catch {
        return NextResponse.json([]);
    }
}

// POST /api/products/[id]/reviews
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

        const { rating, comment, images } = await req.json();
        if (!rating || rating < 1 || rating > 5) return NextResponse.json({ error: "Note invalide (1-5)" }, { status: 400 });

        const review = await db.review.upsert({
            where: { productId_userId: { productId: id, userId: session.user.id } },
            update: { rating, comment, images: images || [] },
            create: { productId: id, userId: session.user.id, rating, comment, images: images || [] },
            include: { user: { select: { name: true, image: true } } },
        });

        return NextResponse.json(review, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erreur serveur (redémarrez le serveur)" }, { status: 500 });
    }
}

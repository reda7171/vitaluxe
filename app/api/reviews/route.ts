import prisma from "../../../lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) return NextResponse.json({}, { status: 401 });

        const { productId, rating, comment, images } = await req.json();

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({}, { status: 401 });

        // Valider l'achat pour laisser un avis (optionnel mais recommandé pour e-commerce)
        const hasOrdered = await (prisma.order as any).findFirst({
            where: {
                userId: user.id,
                orderItems: { some: { productId } }
            }
        });

        if (!hasOrdered) {
            return NextResponse.json({ error: "Vous devez acheter ce produit pour laisser un avis." }, { status: 403 });
        }

        const review = await (prisma.review as any).create({
            data: {
                rating,
                comment,
                images: images || [],
                productId,
                userId: user.id,
                status: "PENDING" // L'admin doit approuver
            }
        });

        return NextResponse.json({ success: true, review });
    } catch (error) {
        console.error("[REVIEW_CREATE_ERROR]", error);
        return NextResponse.json({ error: "Erreur lors de l'ajout de l'avis" }, { status: 500 });
    }
}

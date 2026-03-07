import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

        const rawWishlist = await prisma.wishlist.findMany({
            where: { userId: session.user.id },
            include: {
                product: {
                    include: { category: { select: { name: true } } },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // The product.images field usually requires custom mapping/parsing when returned to client
        const wishlist = rawWishlist.map((item) => {
            let parsedImages = ["/placeholder.jpg"];
            try {
                if (item.product.images) {
                    parsedImages = typeof item.product.images === "string"
                        ? JSON.parse(item.product.images)
                        : item.product.images;
                }
            } catch (e) {
                // Ignore parse errors, fallback applied
            }

            return {
                ...item,
                product: {
                    ...item.product,
                    image: parsedImages[0] || "/placeholder.jpg" // provide the 'image' property the client expects
                }
            };
        });

        return NextResponse.json(wishlist);
    } catch (error) {
        console.error("Wishlist GET Error:", error);
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { productId } = await req.json();

    const existing = await prisma.wishlist.findUnique({
        where: { userId_productId: { userId: session.user.id, productId } },
    });

    if (existing) {
        // Toggle: si déjà présent, on supprime
        await prisma.wishlist.delete({ where: { id: existing.id } });
        return NextResponse.json({ action: "removed" });
    }

    const entry = await prisma.wishlist.create({
        data: { userId: session.user.id, productId },
    });

    return NextResponse.json({ action: "added", id: entry.id }, { status: 201 });
}

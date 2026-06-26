import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

// POST /api/cart/save — Sauvegarde panier côté serveur
export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        
        // Sécurité contre corps vide ou mauvais content-type
        const contentType = req.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return NextResponse.json({ ok: true });
        }

        const body = await req.text();
        if (!body) return NextResponse.json({ ok: true });

        const { items, totalAmount } = JSON.parse(body);

        if (!items || items.length === 0) return NextResponse.json({ ok: true });

        const email = session?.user?.email;
        const name = session?.user?.name;
        const userId = (session?.user as any)?.id;

        if (!email) return NextResponse.json({ ok: true }); // not logged in, skip

        const itemsStr = typeof items === "string" ? items : JSON.stringify(items);

        // Recherche manuelle (plus robuste si pb index unique upsert)
        const existing = await prisma.abandonedCart.findUnique({ where: { email } as any });

        if (existing) {
            await prisma.abandonedCart.update({
                where: { id: existing.id },
                data: {
                    items: itemsStr,
                    totalAmount,
                    updatedAt: new Date(),
                    sentAt: null,
                },
            });
        } else {
            await prisma.abandonedCart.create({
                data: {
                    email,
                    name: name ?? null,
                    userId: userId ?? null,
                    items: itemsStr,
                    totalAmount,
                },
            });
        }

        return NextResponse.json({ ok: true });
    } catch (err) {
        console.error("Save cart error:", err);
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}

// DELETE /api/cart/save — Supprime le panier (après commande passée)
export async function DELETE(req: NextRequest) {
    try {
        const session = await auth();
        const email = session?.user?.email;
        if (!email) return NextResponse.json({ ok: true });

        await prisma.abandonedCart.deleteMany({ where: { email } });
        return NextResponse.json({ ok: true });
    } catch (err) {
        return NextResponse.json({ ok: false }, { status: 500 });
    }
}

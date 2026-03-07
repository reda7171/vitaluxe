import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET - valider un code promo
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code")?.toUpperCase();
    if (!code) return NextResponse.json({ error: "Code requis" }, { status: 400 });

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promo = await (prisma as any).promoCode.findUnique({ where: { code } });
        if (!promo || !promo.active) return NextResponse.json({ valid: false, error: "Code invalide" });
        if (promo.expiresAt && new Date() > new Date(promo.expiresAt)) return NextResponse.json({ valid: false, error: "Code expiré" });
        if (promo.maxUses && promo.uses >= promo.maxUses) return NextResponse.json({ valid: false, error: "Code épuisé" });
        return NextResponse.json({ valid: true, discount: promo.discount, type: promo.type, code: promo.code });
    } catch {
        return NextResponse.json({ valid: false, error: "Service indisponible (redémarrez le serveur)" });
    }
}

// POST - créer un code promo (admin)
export async function POST(req: Request) {
    try {
        const body = await req.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promo = await (prisma as any).promoCode.create({ data: body });
        return NextResponse.json(promo, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Erreur création (redémarrez le serveur)" }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const { id, ...data } = await req.json();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const promo = await (prisma as any).promoCode.update({ where: { id }, data });
        return NextResponse.json(promo);
    } catch {
        return NextResponse.json({ error: "Erreur mise à jour" }, { status: 500 });
    }
}

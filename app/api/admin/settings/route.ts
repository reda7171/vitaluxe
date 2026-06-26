import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { auth } from "../../../../lib/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function GET() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

        const settings = await db.storeSettings.findUnique({ where: { id: "1" } });
        return NextResponse.json(settings || {});
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

        const { boutique, livraison, paiement, notifs, apparence, header, footer } = await req.json();

        const updated = await db.storeSettings.upsert({
            where: { id: "1" },
            update: { boutique, livraison, paiement, notifs, apparence, header, footer },
            create: { id: "1", boutique, livraison, paiement, notifs, apparence, header, footer },
        });

        return NextResponse.json(updated);
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

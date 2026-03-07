import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const banners = await prisma.banner.findMany({ orderBy: { createdAt: "desc" } });
        return NextResponse.json(banners);
    } catch {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user || (session.user as any).role !== "ADMIN") return NextResponse.json({}, { status: 403 });

        const data = await req.json();
        const banner = await prisma.banner.create({ data });
        return NextResponse.json(banner);
    } catch {
        return NextResponse.json({ error: "Erreur création" }, { status: 500 });
    }
}

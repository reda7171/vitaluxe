import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export const revalidate = 86400; // Cache aggressive (24h)

export async function GET() {
    try {
        const settings = await prisma.storeSettings.findUnique({
            where: { id: "1" },
            select: { header: true, footer: true }
        }) || { header: null, footer: null };
        
        const categories = await prisma.category.findMany({
            select: { id: true, name: true, slug: true },
            orderBy: { name: "asc" },
        });

        const brands = await prisma.brand.findMany({
            select: { id: true, name: true, image: true },
            orderBy: { name: "asc" },
        });

        return NextResponse.json({
            header: typeof settings.header === 'string' ? JSON.parse(settings.header) : settings.header,
            footer: typeof settings.footer === 'string' ? JSON.parse(settings.footer) : settings.footer,
            categories,
            brands,
        });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

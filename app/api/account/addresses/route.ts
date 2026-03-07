import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const addresses = await prisma.address.findMany({
        where: { userId: session.user.id },
        orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
    });
    return NextResponse.json(addresses);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const body = await req.json();
    const { type, firstName, lastName, phone, street, city, isDefault } = body;

    // Si isDefault, retirer le défaut des autres
    if (isDefault) {
        await prisma.address.updateMany({
            where: { userId: session.user.id },
            data: { isDefault: false },
        });
    }

    const address = await prisma.address.create({
        data: { userId: session.user.id, type, firstName, lastName, phone, street, city, isDefault: isDefault ?? false },
    });

    return NextResponse.json(address, { status: 201 });
}

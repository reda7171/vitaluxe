import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET() {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true, image: true },
    });
    return NextResponse.json(user);
}

export async function PATCH(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    const { name, phone } = await req.json();

    const updated = await prisma.user.update({
        where: { id: session.user.id },
        data: { name, phone },
        select: { id: true, name: true, email: true, phone: true },
    });

    return NextResponse.json(updated);
}

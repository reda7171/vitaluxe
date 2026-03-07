import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

        const { id } = params;
        const { status } = await req.json();

        const review = await prisma.review.update({
            where: { id },
            data: { status }
        });

        return NextResponse.json(review);
    } catch {
        return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") return NextResponse.json({}, { status: 403 });

        const { id } = params;
        await prisma.review.delete({ where: { id } });

        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: "Erreur" }, { status: 500 });
    }
}

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const carts = await prisma.abandonedCart.findMany({
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json(carts);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch carts" }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { ids } = await req.json();
        
        await prisma.abandonedCart.deleteMany({
            where: { id: { in: ids } }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete carts" }, { status: 500 });
    }
}

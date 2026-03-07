import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const { name, email, password } = await req.json();

        if (!name || !email || !password) {
            return NextResponse.json({ error: "Tous les champs sont requis." }, { status: 400 });
        }

        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            return NextResponse.json({ error: "Cet email est déjà utilisé." }, { status: 409 });
        }

        const hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { name, email, password: hash, role: "CUSTOMER" },
            select: { id: true, name: true, email: true, role: true },
        });

        return NextResponse.json(user, { status: 201 });
    } catch {
        return NextResponse.json({ error: "Erreur serveur." }, { status: 500 });
    }
}

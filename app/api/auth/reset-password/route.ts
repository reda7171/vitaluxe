import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = prisma as any;

export async function POST(req: Request) {
    try {
        const { token, password } = await req.json();

        if (!token || !password || password.length < 8) {
            return NextResponse.json({ error: "Données invalides" }, { status: 400 });
        }

        const resetRecord = await db.passwordResetToken.findUnique({ where: { token } });

        if (!resetRecord || resetRecord.expires < new Date()) {
            return NextResponse.json({ error: "Lien expiré ou invalide" }, { status: 400 });
        }

        const hashed = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: { id: resetRecord.userId },
            data: { password: hashed },
        });

        // Supprimer le token après usage
        await db.passwordResetToken.delete({ where: { token } });

        return NextResponse.json({ message: "Mot de passe réinitialisé avec succès." });
    } catch {
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

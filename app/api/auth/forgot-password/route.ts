const crypto = require("crypto");
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { rateLimit } from "../../../../lib/rate-limit";
import { sendPasswordResetEmail } from "../../../../lib/email";

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") ?? "unknown";
        if (!rateLimit(`forgot-pw:${ip}`, 5, 15 * 60 * 1000)) {
            return NextResponse.json({ error: "Trop de tentatives. Réessayez dans 15 minutes." }, { status: 429 });
        }
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ error: "Email requis." }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            // Sécurité : éviter de révéler si l'email existe ou non
            return NextResponse.json({ message: "Si l'email existe, un lien a été envoyé." });
        }

        const token = crypto.randomUUID();
        const expires = new Date(Date.now() + 3600000); // 1 heure valide

        await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });

        await prisma.passwordResetToken.create({
            data: {
                userId: user.id,
                token,
                expires
            }
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/reset-password?token=${token}`;

        await sendPasswordResetEmail({ to: user.email, name: user.name || "Client", resetUrl });

        return NextResponse.json({ message: "Un lien de réinitialisation a été envoyé à votre adresse email." });
    } catch (error) {
        console.error("Erreur serveur:", error);
        return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
    }
}

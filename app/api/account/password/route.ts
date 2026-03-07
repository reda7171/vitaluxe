import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    try {
        const session = await auth();
        if (!session?.user?.email) {
            return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
        }

        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
        }

        if (newPassword.length < 6) {
            return NextResponse.json({ error: "Le nouveau mot de passe doit contenir au moins 6 caractères" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user || !user.password) {
            return NextResponse.json({ error: "Utilisateur introuvable ou méthode de connexion non supportée" }, { status: 404 });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return NextResponse.json({ error: "Le mot de passe actuel est incorrect" }, { status: 401 });
        }

        // Hash and save new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { email: session.user.email },
            data: { password: hashedPassword },
        });

        return NextResponse.json({ success: true, message: "Mot de passe mis à jour avec succès" });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe:", error);
        return NextResponse.json({ error: "Une erreur est survenue" }, { status: 500 });
    }
}

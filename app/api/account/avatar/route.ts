import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

    try {
        const formData = await req.formData();
        const file = formData.get("avatar") as File | null;

        if (!file) return NextResponse.json({ error: "Fichier manquant" }, { status: 400 });

        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: "Type de fichier non autorisé (jpg, png, webp)" }, { status: 400 });
        }

        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json({ error: "Fichier trop grand (max 2MB)" }, { status: 400 });
        }

        const ext = file.name.split(".").pop();
        const filename = `avatar-${session.user.id}.${ext}`;
        const uploadDir = path.join(process.cwd(), "public", "avatars");

        const buffer = Buffer.from(await file.arrayBuffer());
        await writeFile(path.join(uploadDir, filename), buffer);

        const avatarUrl = `/avatars/${filename}`;

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: avatarUrl },
        });

        return NextResponse.json({ avatarUrl });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
    }
}

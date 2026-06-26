import { NextResponse } from "next/server";
import { auth } from "../../../../lib/auth";
import prisma from "../../../../lib/prisma";
import * as fs from "fs/promises";
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
        
        // On essaie d'écrire dans le dossier public racine ET dans le dossier public du standalone s'il existe
        const rootPublicDir = path.join(process.cwd(), "public", "avatars");
        const standalonePublicDir = path.join(process.cwd(), ".next", "standalone", "public", "avatars");
        
        const uploadDirs = [rootPublicDir];
        // Si on est déjà dans le standalone, on remonte pour trouver la racine ou on cherche localement
        if (process.cwd().includes("standalone")) {
            uploadDirs.push(path.join(process.cwd(), "public", "avatars"));
        } else {
            uploadDirs.push(standalonePublicDir);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        
        for (const dir of uploadDirs) {
            try {
                await fs.mkdir(dir, { recursive: true });
                await writeFile(path.join(dir, filename), buffer);
                console.log(`Avatar saved to: ${dir}`);
            } catch (e) {
                // On ignore si un des dossiers n'est pas accessible
                console.warn(`Could not write to ${dir}:`, e);
            }
        }

        const avatarUrl = `/avatars/${filename}`;

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: avatarUrl },
        });

        return NextResponse.json({ avatarUrl });
    } catch (error) {
        console.error("Avatar upload error:", error);
        return NextResponse.json({ error: "Erreur upload" }, { status: 500 });
    }
}

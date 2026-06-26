import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "../../../../lib/auth";

export async function POST(req: Request) {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "Aucun fichier" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
        const uploadDir = path.join(process.cwd(), "public", "uploads", "categories");

        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, filename);
        await writeFile(filePath, buffer);

        return NextResponse.json({ url: `/uploads/categories/${filename}` });
    } catch (error) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: "Erreur lors de l'upload" }, { status: 500 });
    }
}

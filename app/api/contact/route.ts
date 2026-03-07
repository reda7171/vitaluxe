import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, subject, message } = body;

        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const contactMessage = await prisma.contactMessage.create({
            data: {
                name,
                email,
                phone: phone || null,
                subject,
                message,
                status: "UNREAD",
            },
        });

        return NextResponse.json(contactMessage, { status: 201 });
    } catch (error) {
        console.error("Error saving contact message:", error);
        return NextResponse.json(
            { error: "Error saving contact message" },
            { status: 500 }
        );
    }
}

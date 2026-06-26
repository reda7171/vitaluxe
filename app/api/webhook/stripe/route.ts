import { NextResponse } from "next/server";
import stripe from "../../../../lib/stripe";
import prisma from "../../../../lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const body = await req.text();
    const sig = (await headers()).get("stripe-signature");

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET || !stripe) {
        return NextResponse.json({ error: "Configuration manquante" }, { status: 400 });
    }

    let event;
    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch {
        return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    if (event.type === "payment_intent.succeeded") {
        const pi = event.data.object;
        const userId = pi.metadata?.userId;

        if (userId && userId !== "guest") {
            // Met à jour les commandes PENDING en PROCESSING
            await prisma.order.updateMany({
                where: { userId, status: "PENDING" },
                data: { status: "PROCESSING" },
            });
        }

        console.log("✅ Paiement Stripe confirmé:", pi.id);
    }

    if (event.type === "payment_intent.payment_failed") {
        console.log("❌ Paiement échoué:", event.data.object.id);
    }

    return NextResponse.json({ received: true });
}

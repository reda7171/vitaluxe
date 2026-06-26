import { NextResponse } from "next/server";
import stripe from "../../../../lib/stripe";
import { auth } from "../../../../lib/auth";

export async function POST(req: Request) {
    try {
        const session = await auth();
        const body = await req.json();
        const { items, totalAmount } = body;

        if (!stripe) {
            return NextResponse.json({ error: "Stripe non configuré" }, { status: 500 });
        }

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Panier vide" }, { status: 400 });
        }

        // Crée un PaymentIntent Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(totalAmount * 100), // en centimes (MAD)
            currency: "mad",
            automatic_payment_methods: { enabled: true },
            metadata: {
                userId: session?.user?.id ?? "guest",
                itemCount: items.length,
            },
        });

        return NextResponse.json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Erreur Stripe";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

"use client";

import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { Loader2, Lock } from "lucide-react";
import { Button } from "../ui/button";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

// ─── Inner Form ──────────────────────────────────────────────────────────────
function StripePaymentForm({
    grandTotal,
    onSuccess,
}: {
    grandTotal: number;
    onSuccess: () => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsLoading(true);
        setErrorMsg("");

        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            confirmParams: { return_url: `${window.location.origin}/checkout/success` },
            redirect: "if_required",
        });

        if (error) {
            setErrorMsg(error.message ?? "Erreur de paiement.");
            setIsLoading(false);
            return;
        }

        if (paymentIntent?.status === "succeeded") {
            onSuccess();
        }

        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <PaymentElement
                options={{
                    layout: "tabs",
                    fields: { billingDetails: { name: "auto" } },
                }}
            />

            {errorMsg && (
                <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3 border border-destructive/20">
                    {errorMsg}
                </p>
            )}

            <Button
                type="submit"
                disabled={!stripe || isLoading}
                className="w-full h-12 gap-2 shadow-md shadow-primary/20"
                id="stripe-pay-btn"
            >
                {isLoading ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Traitement...</>
                ) : (
                    <><Lock className="h-4 w-4" /> Payer {grandTotal} Dhs</>
                )}
            </Button>

            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Lock className="h-3 w-3" />
                Paiement sécurisé par Stripe
            </div>
        </form>
    );
}

// ─── Stripe Wrapper ───────────────────────────────────────────────────────────
export function StripeCheckout({
    items,
    grandTotal,
    onSuccess,
}: {
    items: { productId: string; quantity: number; price: number }[];
    grandTotal: number;
    onSuccess: () => void;
}) {
    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const initPayment = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/checkout/stripe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items, totalAmount: grandTotal }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setClientSecret(data.clientSecret);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Erreur initialisation Stripe");
        } finally {
            setLoading(false);
        }
    };

    if (!clientSecret) {
        return (
            <div className="space-y-3">
                {error && (
                    <p className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
                        {error}
                    </p>
                )}
                <Button
                    onClick={initPayment}
                    disabled={loading}
                    className="w-full h-12 gap-2 shadow-md shadow-primary/20"
                    id="stripe-init-btn"
                >
                    {loading ? (
                        <><Loader2 className="h-4 w-4 animate-spin" /> Initialisation...</>
                    ) : (
                        <><Lock className="h-4 w-4" /> Procéder au paiement {grandTotal} Dhs</>
                    )}
                </Button>
            </div>
        );
    }

    return (
        <Elements
            stripe={stripePromise}
            options={{
                clientSecret,
                appearance: {
                    theme: "stripe",
                    variables: {
                        colorPrimary: "#103178",
                        borderRadius: "8px",
                        fontFamily: "Inter, sans-serif",
                    },
                },
            }}
        >
            <StripePaymentForm grandTotal={grandTotal} onSuccess={onSuccess} />
        </Elements>
    );
}

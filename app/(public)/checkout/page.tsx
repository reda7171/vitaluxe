import { Suspense } from "react";
import type { Metadata } from "next";
import { CheckoutView } from "../../../components/checkout/checkout-view";

export const metadata: Metadata = {
    title: "Commande | Vitaluxe",
    description: "Finalisez votre commande en toute sécurité.",
    robots: { index: false }, // Don't index checkout
};

export default function CheckoutPage() {
    return (
        <Suspense>
            <CheckoutView />
        </Suspense>
    );
}

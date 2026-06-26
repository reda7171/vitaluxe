import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2025-02-24.acacia" as any,
    })
    : null;

export default stripe as Stripe; // On cast car l'utilisation réelle échouera proprement via Stripe si utilisé sans clé


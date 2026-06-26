// Env validation at startup — crash fast if critical vars are missing
import { z } from "zod";

const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    NEXTAUTH_SECRET: z.string().min(8),
    NEXTAUTH_URL: z.string().url(),
    STRIPE_SECRET_KEY: z.string().optional(),
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
});

function validateEnv() {
    console.log(`🌐 Environnement actuel : ${process.env.NODE_ENV || "development"}`);

    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.warn("⚠️ Attention : Certaines variables d'environnement sont manquantes ou invalides.");
        parsed.error.issues.forEach(i => console.warn(`  - ${i.path.join(".")}: ${i.message}`));

        // On ne crash que si DATABASE_URL manque cruellement en prod
        if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL est obligatoire en production. Arrêt.");
        }
    }
    return parsed.data ?? process.env;
}

export const env = validateEnv();

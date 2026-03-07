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
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        console.error("❌ Variables d'env manquantes :");
        parsed.error.issues.forEach(i => console.error(`  - ${i.path.join(".")}: ${i.message}`));
        if (process.env.NODE_ENV === "production") {
            throw new Error("Variables d'environnement invalides. Arrêt.");
        }
    }
    return parsed.data ?? process.env;
}

export const env = validateEnv();

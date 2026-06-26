import { Suspense } from "react";
import type { Metadata } from "next";
import { LoginForm } from "../../../../components/auth/login-form";

export const metadata: Metadata = {
    title: "Connexion | Vitaluxe",
    description: "Connectez-vous à votre compte Vitaluxe pour accéder à vos commandes et profil.",
};

export default function LoginPage() {
    return (
        <Suspense>
            <LoginForm />
        </Suspense>
    );
}

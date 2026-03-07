import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
    title: "Créer un compte | Vitaluxe",
    description: "Créez votre compte Vitaluxe et profitez de vos avantages clients.",
};

export default function RegisterPage() {
    return <RegisterForm />;
}

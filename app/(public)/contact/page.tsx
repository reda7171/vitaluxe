import type { Metadata } from "next";
import ContactPageClient from "../../../components/contact/contact-view";

export const metadata: Metadata = {
    title: "Contact | Vitaluxe — Support & Assistance",
    description: "Contactez l'équipe Vitaluxe pour toute question sur vos commandes, produits ou livraison. Réponse garantie sous 24h. Disponible par email, téléphone et WhatsApp.",
    keywords: "contact vitaluxe, support, aide commande, livraison, retour produit",
};

export default function ContactPage() {
    return <ContactPageClient />;
}

import type { Metadata } from "next";
import { AddressesPageClient } from "../../../../components/account/addresses-view";

export const metadata: Metadata = {
    title: "Mes Adresses | Vitaluxe",
    description: "Gérez vos adresses de livraison enregistrées.",
    robots: { index: false },
};

export default function AddressesPage() {
    return <AddressesPageClient />;
}

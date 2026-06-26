import { Metadata } from "next";
import { AccountLayout } from "../../../../components/account/account-layout";
import { PrescriptionsView } from "../../../../components/account/prescriptions-view";

export const metadata: Metadata = {
    title: "Mes Ordonnances | Vitaluxe",
    description: "Gérez vos ordonnances et suivez leur statut de validation.",
};

export default function PrescriptionsPage() {
    return (
        <AccountLayout>
            <PrescriptionsView />
        </AccountLayout>
    );
}

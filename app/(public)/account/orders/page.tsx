import type { Metadata } from "next";
import { AccountLayout } from "@/components/account/account-layout";
import { OrdersView } from "@/components/account/orders-view";

export const metadata: Metadata = {
    title: "Mes Commandes | Vitaluxe",
    description: "Consultez l'historique de vos commandes, suivez vos livraisons et téléchargez vos factures.",
    robots: { index: false },
};

export default function OrdersPage() {
    return (
        <AccountLayout>
            <OrdersView />
        </AccountLayout>
    );
}

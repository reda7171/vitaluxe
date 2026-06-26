import type { Metadata } from "next";
import { AccountLayout } from "../../../components/account/account-layout";
import { ProfileView } from "../../../components/account/profile-view";

export const metadata: Metadata = {
    title: "Mon Profil | Vitaluxe",
    description: "Gérez vos informations personnelles, adresse de livraison et préférences de notification.",
    robots: { index: false },
};

export default function AccountPage() {
    return (
        <AccountLayout>
            <ProfileView />
        </AccountLayout>
    );
}

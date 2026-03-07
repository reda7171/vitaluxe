import type { Metadata } from "next";
import { WishlistPageClient } from "@/components/account/wishlist-view";

export const metadata: Metadata = {
    title: "Ma Liste de Souhaits | Vitaluxe",
    description: "Retrouvez tous vos produits favoris sauvegardés sur Vitaluxe.",
    robots: { index: false },
};

export default function WishlistPage() {
    return <WishlistPageClient />;
}

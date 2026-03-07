import type { Metadata } from "next";
import CategoriesPageClient from "@/components/categories/categories-view";

export const metadata: Metadata = {
    title: "Catégories | Vitaluxe — Parapharmacie en ligne",
    description: "Explorez nos catégories : soins visage, corps, cheveux, compléments alimentaires, solaire et bébé. Trouvez le produit idéal parmi 2000+ références.",
    keywords: "catégories parapharmacie, soin visage, soin corps, vitamines, solaire, cheveux",
};

export default function CategoriesPage() {
    return <CategoriesPageClient />;
}

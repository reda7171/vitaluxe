import type { Metadata } from "next";
import CategoriesPageClient from "../../../components/categories/categories-view";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: "Catégories | Vitaluxe — Parapharmacie en ligne",
    description: "Explorez nos catégories : soins visage, corps, cheveux, compléments alimentaires, solaire et bébé. Trouvez le produit idéal parmi 2000+ références.",
    keywords: "catégories parapharmacie, soin visage, soin corps, vitamines, solaire, cheveux",
};

import prisma from "../../../lib/prisma";

export default async function CategoriesPage() {
    const categories = await prisma.category.findMany({
        include: { 
            _count: { 
                select: { products: true } 
            },
            products: {
                take: 3,
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    brand: true,
                    price: true,
                    salePrice: true,
                    images: true,
                }
            }
        },
        orderBy: { name: "asc" },
    });

    // Format images for the client
    const formattedCategories = categories.map(cat => ({
        ...cat,
        products: cat.products.map(p => {
            let imagesArr: string[] = [];
            if (typeof p.images === "string") {
                try {
                    imagesArr = JSON.parse(p.images);
                } catch (e) {
                    imagesArr = [p.images];
                }
            } else if (Array.isArray(p.images)) {
                imagesArr = p.images;
            }
            return {
                ...p,
                image: imagesArr[0] || "/placeholder.jpg"
            };
        })
    }));

    return <CategoriesPageClient initialCategories={formattedCategories} />;
}

import { Suspense } from "react";
import type { Metadata } from "next";
import prisma from "../../../lib/prisma";
import { ShopView } from "../../../components/shop/shop-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Boutique | Vitaluxe Parapharmacie",
    description: "Explorez notre gamme complète de produits de parapharmacie : soins visage, corps, cheveux, compléments alimentaires et plus encore.",
};

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ badge?: string }> }) {
    const { badge } = await searchParams;
    const isPromo = badge === "Promo";

    // Sérialisation des appels pour préserver la RAM sur Hostinger (évite les pics de processus)
    const rawProducts = await prisma.product.findMany({
        where: isPromo ? { salePrice: { not: null } } : {},
        select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            salePrice: true,
            stock: true,
            images: true,
            brand: true,
            categoryId: true,
            category: { select: { name: true } },
            createdAt: true,
        },
        take: 100,
    });
    
    const categoriesRaw = await prisma.category.findMany({ orderBy: { name: 'asc' } });
    const brandsRaw = await prisma.brand.findMany({ orderBy: { name: 'asc' } });

    const products = rawProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const categories = categoriesRaw;
    const brands = brandsRaw;

    // Sérialiser pour le client
    const serialized = products.map((p: any) => {
        let parsedImages = [];
        try {
            if (typeof p.images === "string") {
                parsedImages = JSON.parse(p.images);
            } else if (Array.isArray(p.images)) {
                parsedImages = p.images;
            }
        } catch (e) {
            parsedImages = [p.images].filter(Boolean);
        }

        return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            price: p.price,
            salePrice: p.salePrice ?? undefined,
            stock: p.stock,
            images: Array.isArray(parsedImages) ? parsedImages : [],
            brand: p.brand ?? "",
            category: p.category.name,
            categoryId: p.categoryId,
        };
    });

    return (
        <Suspense>
            <ShopView products={serialized} categories={categories} dbBrands={brands} />
        </Suspense>
    );
}

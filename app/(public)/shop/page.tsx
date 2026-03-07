import { Suspense } from "react";
import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import { ShopView } from "@/components/shop/shop-view";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
    title: "Boutique | Vitaluxe Parapharmacie",
    description: "Explorez notre gamme complète de produits de parapharmacie : soins visage, corps, cheveux, compléments alimentaires et plus encore.",
};

export default async function ShopPage() {
    const [rawProducts, totalCount] = await Promise.all([
        prisma.product.findMany({
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
            take: 100, // Fetch more since we're sorting locally, or keep at 20 if we want
        }),
        prisma.product.count()
    ]);

    const products = rawProducts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 20);

    const categoriesRaw = await prisma.category.findMany();
    const categories = categoriesRaw.sort((a, b) => a.name.localeCompare(b.name));

    // Sérialiser pour le client
    const serialized = products.map((p: any) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        salePrice: p.salePrice ?? undefined,
        stock: p.stock,
        images: (p.images as string[]) ?? [],
        brand: p.brand ?? "",
        category: p.category.name,
        categoryId: p.categoryId,
    }));

    return (
        <Suspense>
            <ShopView products={serialized} categories={categories} />
        </Suspense>
    );
}

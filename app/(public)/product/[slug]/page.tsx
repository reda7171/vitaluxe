import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailView } from "@/components/product/product-detail-view";
import { ProductReviews } from "@/components/product/product-reviews";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const product = await prisma.product.findUnique({ where: { slug } });
    if (!product) return { title: "Produit introuvable" };
    return {
        title: `${product.name} | Vitaluxe`,
        description: product.description.slice(0, 155),
    };
}

export default async function ProductSlugPage({ params }: Props) {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
        where: { slug },
        include: { category: true },
    });
    if (!product) notFound();

    const related = await prisma.product.findMany({
        where: { categoryId: product.categoryId, NOT: { id: product.id } },
        take: 4,
        include: { category: { select: { name: true } } },
    });

    const serialized = {
        id: product.id,
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        salePrice: product.salePrice ?? undefined,
        stock: product.stock,
        images: (product.images as string[]) ?? [],
        brand: product.brand ?? "",
        category: product.category.name,
    };

    const relatedSerialized = related.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: p.price,
        salePrice: p.salePrice ?? undefined,
        images: (p.images as string[]) ?? [],
        brand: p.brand ?? "",
        category: p.category.name,
    }));

    return (
        <>
            <ProductDetailView product={serialized} related={relatedSerialized} />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
                <ProductReviews productId={product.id} />
            </div>
        </>
    );
}

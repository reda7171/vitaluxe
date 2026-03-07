import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://vitaluxe.ma';

    // Récupérer tous les produits pour construire leurs URLs
    const products = await prisma.product.findMany({
        select: {
            slug: true,
            createdAt: true,
        },
    });

    const productUrls = products.map((product) => ({
        url: `${baseUrl}/product/${product.slug}`,
        lastModified: product.createdAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Les routes statiques de base
    const staticRoutes = [
        '',
        '/shop',
        '/about',
        '/contact',
        '/faq',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    return [...staticRoutes, ...productUrls];
}

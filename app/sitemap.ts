import { MetadataRoute } from 'next';
import prisma from '../lib/prisma';

// Hardcoded blog posts from app/(public)/blog/page.tsx
const BLOG_POST_SLUGS = [
    "soins-visage-routine-quotidienne",
    "complements-alimentaires-guide",
    "protection-solaire-maroc",
    "chute-cheveux-solutions",
    "hydrater-peau-seche-hiver",
    "bebe-soins-naturels",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://vitaluxe.ma';

    // 1. Dynamic Products
    let productUrls: MetadataRoute.Sitemap = [];
    try {
        const products = await prisma.product.findMany({
            select: { slug: true, createdAt: true },
        });

        productUrls = products.map((product) => ({
            url: `${baseUrl}/product/${product.slug}`,
            lastModified: product.createdAt,
            changeFrequency: 'weekly',
            priority: 0.7,
        }));
    } catch (e) {
        console.error("Sitemap: Failed to fetch products");
    }

    // 2. Dynamic Categories
    let categoryUrls: MetadataRoute.Sitemap = [];
    try {
        const categories = await prisma.category.findMany({
            select: { slug: true },
        });

        categoryUrls = categories.map((cat) => ({
            url: `${baseUrl}/shop?category=${cat.slug}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        }));
    } catch (e) {
        console.error("Sitemap: Failed to fetch categories");
    }

    // 3. Blog Posts
    const blogUrls: MetadataRoute.Sitemap = BLOG_POST_SLUGS.map((slug) => ({
        url: `${baseUrl}/blog/${slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.6,
    }));

    // 4. Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        '',
        '/shop',
        '/about',
        '/contact',
        '/faq',
        '/ordonnance',
        '/blog',
        '/terms',
        '/shipping',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'daily' : 'weekly',
        priority: route === '' ? 1.0 : 0.8,
    }));

    return [...staticRoutes, ...productUrls, ...categoryUrls, ...blogUrls];
}


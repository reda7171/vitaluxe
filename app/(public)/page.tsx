import type { Metadata } from "next";
import prisma from "../../lib/prisma";
import dynamic from "next/dynamic";
import { HeroSection } from "../../components/home/hero-section";
import { TrustBar } from "../../components/home/hero-section";
import { InstagramFeed } from "../../components/home/instagram-feed";

import { PromoPopup } from "../../components/home/promo-popup";
import { WhatsAppFloating } from "../../components/home/whatsapp-floating";

const BestSellers = dynamic(() => import("../../components/home/hero-section").then((mod) => mod.BestSellers), { ssr: true });
const FeaturedCategories = dynamic(() => import("../../components/home/hero-section").then((mod) => mod.FeaturedCategories), { ssr: true });
const PromoBanner = dynamic(() => import("../../components/home/hero-section").then((mod) => mod.PromoBanner), { ssr: true });
const BrandLogos = dynamic(() => import("../../components/home/hero-section").then((mod) => mod.BrandLogos), { ssr: true });
const Testimonials = dynamic(() => import("../../components/home/hero-section").then((mod) => mod.Testimonials), { ssr: true });
const Newsletter = dynamic(() => import("../../components/home/hero-section").then((mod) => mod.Newsletter), { ssr: true });

// Cache ISR : Revalide la page toutes les heures (3600s) pour optimiser les perfs
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Parapharmacie en Ligne N°1 au Maroc | Vitaluxe",
  description:
    "Achetez vos produits parapharmaceutiques, soins du visage, compléments alimentaires et dermo-cosmétique au meilleur prix chez Vitaluxe. Livraison en 24h à Casablanca et 48h partout au Maroc.",
  keywords: ["parapharmacie en ligne maroc", "parapharmacie casablanca", "produits beauté maroc", "soins visage dermatologiques", "compléments alimentaires", "la roche posay maroc", "vichy", "cerave"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Vitaluxe | Votre Parapharmacie en Ligne au Maroc",
    description: "Des soins de qualité garantie, livrés rapidement chez vous. Découvrez les meilleures marques de parapharmacie (Vichy, Cerave, Eucerin).",
    url: "https://vitaluxe.ma",
    type: "website",
    locale: "fr_MA",
    siteName: "Vitaluxe",
  },
  alternates: {
    canonical: "https://vitaluxe.ma",
  }
};

export default async function HomePage() {
  let rawProductsUnsorted: any[] = [];
  let brands: any[] = [];
  let banners: any[] = [];
  let categories: any[] = [];

  let bestSellerImage: string | null = null;

  try {
    // Remplacement de Promise.all par des appels séquentiels pour ne pas étouffer la RAM
    rawProductsUnsorted = await prisma.product.findMany({
      take: 20,
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        stock: true,
        images: true,
        brand: true,
        createdAt: true,
        description: true,
        category: { select: { name: true } },
      },
    });

    brands = await prisma.brand.findMany({ orderBy: { name: "asc" } });
    banners = await prisma.banner.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
    
    categories = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    });

    // Remplacement du groupBy trop lourd pour la RAM Hostinger par un produit récent arbitraire (temporaire)
    const topProduct = await prisma.product.findFirst({
        where: { images: { not: null } },
        orderBy: { id: "desc" }
    });

    if (topProduct?.images) {
        try {
          const imgs = JSON.parse(topProduct.images as string);
          bestSellerImage = imgs[0] || null;
        } catch {
          bestSellerImage = topProduct.images as string || null;
        }
    }
  } catch (error) {
    console.error("Home Page: Database connection failed during build, using fallback data.");
  }

  const rawProducts = rawProductsUnsorted
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 24);

  const topProducts = rawProducts.map((p) => {
    let imagesArr: string[] = [];
    if (typeof p.images === "string") {
      try {
        imagesArr = JSON.parse(p.images);
      } catch (e) {
        imagesArr = [p.images]; // Fallback if it's a single string URL
      }
    } else if (Array.isArray(p.images)) {
      imagesArr = p.images;
    }

    return {
      ...p,
      images: imagesArr,
      image: imagesArr[0] ?? null,
      salePrice: p.salePrice ?? undefined,
      category: p.category?.name || "",
    };
  });

  return (
    <div className="flex flex-col gap-20 pb-20">
      <PromoPopup />
      <WhatsAppFloating />
      <HeroSection 
        banner={banners.find(b => b.position === "HERO") || null} 
        floatingProducts={topProducts.slice(0, 3)}
        bestSellerImage={bestSellerImage}
      />
      <TrustBar />
      <BestSellers bestSellers={topProducts} />
      <FeaturedCategories categories={categories} />
      <PromoBanner banner={banners.find(b => b.position === "PROMO") || null} />
      <BrandLogos brands={brands} />
      <Testimonials />
      <InstagramFeed products={topProducts.filter(p => p.image).slice(0, 9).map(p => ({ id: p.id, name: p.name, slug: p.slug, image: p.image!, price: p.price, salePrice: p.salePrice }))} />
      <Newsletter />
    </div>
  );
}

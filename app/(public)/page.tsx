import type { Metadata } from "next";
import prisma from "@/lib/prisma";
import dynamic from "next/dynamic";
import { HeroSection } from "@/components/home/hero-section";
import { TrustBar } from "@/components/home/hero-section";

import { PromoPopup } from "@/components/home/promo-popup";
import { WhatsAppFloating } from "@/components/home/whatsapp-floating";

const BestSellers = dynamic(() => import("@/components/home/hero-section").then((mod) => mod.BestSellers), { ssr: true });
const FeaturedCategories = dynamic(() => import("@/components/home/hero-section").then((mod) => mod.FeaturedCategories), { ssr: true });
const PromoBanner = dynamic(() => import("@/components/home/hero-section").then((mod) => mod.PromoBanner), { ssr: true });
const BrandLogos = dynamic(() => import("@/components/home/hero-section").then((mod) => mod.BrandLogos), { ssr: true });
const Testimonials = dynamic(() => import("@/components/home/hero-section").then((mod) => mod.Testimonials), { ssr: true });
const Newsletter = dynamic(() => import("@/components/home/hero-section").then((mod) => mod.Newsletter), { ssr: true });

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
  const [rawProductsUnsorted, brands, banners] = await Promise.all([
    prisma.product.findMany({
      take: 20, // Fetch a few more for sorting
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
      },
    }),
    prisma.brand.findMany({ take: 10 }),
    prisma.banner.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } }),
  ]);

  const rawProducts = rawProductsUnsorted
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 8);

  const topProducts = rawProducts.map((p) => ({
    ...p,
    images: (p.images as string[]) ?? [],
    image: ((p.images as string[]) ?? [])[0] ?? null,
    salePrice: p.salePrice ?? undefined,
  }));

  return (
    <div className="flex flex-col gap-20 pb-20">
      <PromoPopup />
      <WhatsAppFloating />
      <HeroSection banner={banners.find(b => b.position === "HERO") || null} />
      <TrustBar />
      <BestSellers bestSellers={topProducts} />
      <FeaturedCategories />
      <PromoBanner banner={banners.find(b => b.position === "PROMO") || null} />
      <BrandLogos brands={brands} />
      <Testimonials />
      <Newsletter />
    </div>
  );
}

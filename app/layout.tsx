import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "Vitaluxe | Votre Parapharmacie en ligne de confiance au Maroc",
    template: "%s | Vitaluxe",
  },
  description: "Découvrez notre vaste sélection de produits de santé, beauté, dermo-cosmétique et compléments alimentaires. Vitaluxe, votre parapharmacie experte en ligne.",
  keywords: ["parapharmacie", "maroc", "beauté", "santé", "cosmétique", "soins visage", "vitaluxe", "pharmacie en ligne"],
  authors: [{ name: "Vitaluxe Team" }],
  creator: "Vitaluxe",
  publisher: "Vitaluxe",
  openGraph: {
    type: "website",
    locale: "fr_MA",
    url: "https://vitaluxe.ma",
    siteName: "Vitaluxe Parapharmacie",
    title: "Vitaluxe | Votre Parapharmacie en ligne au Maroc",
    description: "La référence santé et beauté. Produits authentiques, livraison rapide partout au Maroc.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Vitaluxe Parapharmacie" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vitaluxe Parapharmacie",
    description: "Découvrez nos offres exclusives santé & beauté.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans antialiased text-foreground bg-background">
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}

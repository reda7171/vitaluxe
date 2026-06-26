import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { PWAInstaller } from "@/components/PWAInstaller";
import { BackToTop } from "@/components/ui/back-to-top";
import { WindowScrollToTop } from "@/components/layout/scroll-to-top";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const viewport: Viewport = {
  themeColor: "#103178",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://vitaluxe.ma"),
  title: {
    default: "Vitaluxe | Votre Parapharmacie en ligne de confiance au Maroc",
    template: "%s | Vitaluxe",
  },
  description: "Découvrez notre vaste sélection de produits de santé, beauté, dermo-cosmétique et compléments alimentaires. Vitaluxe, votre parapharmacie experte en ligne.",
  keywords: ["parapharmacie", "maroc", "beauté", "santé", "cosmétique", "soins visage", "vitaluxe", "pharmacie en ligne"],
  authors: [{ name: "Vitaluxe Team" }],
  creator: "Vitaluxe",
  publisher: "Vitaluxe",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vitaluxe",
  },
  formatDetection: { telephone: false },
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
      <head>
        <link rel="apple-touch-icon" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased text-foreground bg-background">
        <PWAInstaller />
        <WindowScrollToTop />
        {children}
        <Suspense fallback={null}>
          <BackToTop />
        </Suspense>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}


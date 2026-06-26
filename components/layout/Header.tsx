"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { GlobalSearch } from "./GlobalSearch";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "../../lib/context/cart-context";
import { useWishlist } from "../../lib/context/wishlist-context";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShoppingCart, User, Heart, LogOut, LayoutDashboard,
    Package, X, ChevronDown, Truck, Phone, Menu,
} from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import { useSiteLayout } from "../../lib/hooks/use-site-layout";

/* ─── Category definitions ────────────────────────────────────────── */
const STATIC_CATEGORIES = [
    { label: "VISAGE", href: "/shop?category=Visage" },
    { label: "CORPS", href: "/shop?category=Corps" },
    { label: "CHEVEUX", href: "/shop?category=Cheveux" },
    { label: "COMPLÉMENTS", href: "/shop?category=Compléments" },
    { label: "PROMOTIONS", href: "/shop?badge=Promo", highlight: true },
];

const TOP_LINKS = [
    { label: "Contactez-nous", href: "/contact" },
    { label: "Qui sommes nous?", href: "/about" },
    { label: "FAQs", href: "/faq" },
    { label: "Boutique", href: "/shop" },
    { label: "Blog", href: "/blog" },
    { label: "Envoyer votre ordonnance", href: "/ordonnance" },
];

export function Header() {
    const { totalItems, openCart } = useCart();
    const { items: wishlistItems } = useWishlist();
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [mounted, setMounted] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { settings } = useSiteLayout();
    
    const topBannerText = settings.header?.topBannerText || "Livraison gratuite Rabat à partir de 350 Dh — Autres villes 600 Dh";
    const phoneLabel = settings.header?.phone || "06 66 69 54 86";
    const phoneLink = settings.header?.phoneLink || "tel:+212512345678";

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
        if (session?.user?.email) {
            fetch("/api/account/profile")
                .then(r => r.json())
                .then(data => {
                    if (data.image) setAvatarUrl(data.image);
                })
                .catch(() => { });
        }
    }, [session]);

    const initials = session?.user?.name
        ?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

    const dynamicCategories = settings.categories && settings.categories.length > 0
        ? settings.categories.map((c: any) => ({ label: c.name.toUpperCase(), href: `/shop?category=${c.slug}` }))
        : [];
    
    // Add Promotions at the end if not present
    if (dynamicCategories.length > 0 && !dynamicCategories.find(c => c.label === "PROMOTIONS")) {
        dynamicCategories.push({ label: "PROMOTIONS", href: "/shop?badge=Promo", highlight: true } as any);
    }

    const categoriesToDisplay = dynamicCategories.length > 0 ? dynamicCategories : STATIC_CATEGORIES;

    return (
        <header className="sticky top-0 z-40 w-full shadow-sm">

            {/* ══════════════════════════════════════════════════════════════
          TIER 1 — Top info bar (dark green)
      ══════════════════════════════════════════════════════════════ */}
            <div className="bg-[#2d6a4f] text-white text-xs">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-9 gap-4">
                    {/* Delivery message */}
                    <div className="flex items-center gap-2 font-semibold tracking-wide uppercase shrink-0">
                        <Truck className="h-3.5 w-3.5 shrink-0" />
                        <span className="hidden sm:block">
                            {topBannerText}
                        </span>
                        <span className="sm:hidden">{topBannerText.length > 30 ? topBannerText.slice(0, 30) + "..." : topBannerText}</span>
                    </div>

                    {/* Top nav links */}
                    <nav className="hidden md:flex items-center gap-5">
                        {TOP_LINKS.map(({ label, href }) => (
                            <Link
                                key={href}
                                href={href}
                                className="hover:text-emerald-200 transition-colors whitespace-nowrap"
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
          TIER 2 — Logo · Search · Icons
      ══════════════════════════════════════════════════════════════ */}
            <div className="bg-background border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-[70px] gap-4">

                    {/* Logo */}
                    <Link href="/" className="shrink-0 flex items-center mr-4">
                        <Image src="/VITALUXE.png" alt="Vitaluxe Logo" width={150} height={40} className="h-10 w-auto object-contain" priority />
                    </Link>

                    {/* Search bar — centered, flex-1 */}
                    <div className="hidden md:flex flex-1 items-center justify-center px-4">
                        <GlobalSearch />
                    </div>

                    {/* Right icons */}
                    <div className="flex items-center gap-1 shrink-0 ml-auto">
                        {/* Phone (desktop only) */}
                        <a
                            href={phoneLink}
                            className="hidden xl:flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-[#2d6a4f] transition-colors px-3"
                        >
                            <Phone className="h-4 w-4 text-[#2d6a4f]" />
                            {phoneLabel}
                        </a>

                        {/* User / Account */}
                        <div className="relative">
                            {!mounted || status === "loading" ? (
                                <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
                            ) : session?.user ? (
                                <>
                                    <button
                                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                                        className="flex items-center gap-2 h-10 px-2 rounded-xl hover:bg-muted transition-colors"
                                        aria-label="Mon compte"
                                        id="user-menu-btn"
                                    >
                                        <div className="h-8 w-8 rounded-full bg-[#2d6a4f] text-white flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden">
                                            {avatarUrl ? (
                                                <img
                                                    src={avatarUrl}
                                                    alt="Avatar"
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                        setAvatarUrl(null);
                                                    }}
                                                />
                                            ) : (
                                                initials ?? "U"
                                            )}
                                        </div>
                                        <span className="hidden lg:block text-sm font-medium max-w-[80px] truncate">
                                            {session.user.name?.split(" ")[0]}
                                        </span>
                                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                                    </button>

                                    <AnimatePresence>
                                        {userMenuOpen && (
                                            <>
                                                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                                                <motion.div
                                                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                                                    transition={{ duration: 0.14 }}
                                                    className="absolute right-0 top-12 z-50 w-56 bg-card rounded-xl border shadow-xl overflow-hidden"
                                                >
                                                    <div className="px-4 py-3 border-b bg-muted/30">
                                                        <p className="text-sm font-semibold truncate">{session.user.name}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
                                                        {session.user.role === "ADMIN" && (
                                                            <span className="text-[10px] bg-[#2d6a4f] text-white px-1.5 py-0.5 rounded font-bold mt-1 inline-block">ADMIN</span>
                                                        )}
                                                    </div>
                                                    <div className="p-1">
                                                        {session.user.role === "ADMIN" && (
                                                            <Link href="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                                                                <LayoutDashboard className="h-4 w-4 text-[#2d6a4f]" /> Dashboard Admin
                                                            </Link>
                                                        )}
                                                        <Link href="/account" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                                                            <User className="h-4 w-4" /> Mon profil
                                                        </Link>
                                                        <Link href="/account/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                                                            <Package className="h-4 w-4" /> Mes commandes
                                                        </Link>
                                                        <Link href="/account/addresses" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors">
                                                            <Package className="h-4 w-4" /> Mes adresses
                                                        </Link>
                                                        <button
                                                            onClick={() => { setUserMenuOpen(false); signOut({ callbackUrl: "/" }); }}
                                                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-destructive/10 hover:text-destructive transition-colors text-left"
                                                        >
                                                            <LogOut className="h-4 w-4" /> Se déconnecter
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </>
                                        )}
                                    </AnimatePresence>
                                </>
                            ) : (
                                <Button variant="ghost" size="icon" aria-label="Se connecter" asChild>
                                    <Link href="/auth/login"><User className="h-5 w-5" /></Link>
                                </Button>
                            )}
                        </div>

                        {/* Wishlist */}
                        <Button variant="ghost" size="icon" aria-label="Ma liste de souhaits" className="relative" asChild>
                            <Link href="/account/wishlist">
                                <Heart className="h-5 w-5" />
                                {mounted && (
                                    <AnimatePresence>
                                        {wishlistItems.length > 0 && (
                                            <motion.span
                                                key="wishlist-badge"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white"
                                            >
                                                {wishlistItems.length > 9 ? "9+" : wishlistItems.length}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                )}
                            </Link>
                        </Button>

                        {/* Cart */}
                        <Button
                            variant="ghost"
                            size="icon"
                            aria-label="Panier"
                            className="relative"
                            onClick={openCart}
                            id="open-cart-btn"
                        >
                            <ShoppingCart className="h-5 w-5" />
                            {mounted && (
                                <AnimatePresence>
                                    {totalItems > 0 && (
                                        <motion.span
                                            key="badge"
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#2d6a4f] text-[10px] font-bold text-white flex items-center justify-center"
                                        >
                                            {totalItems > 9 ? "9+" : totalItems}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            )}
                        </Button>

                        {/* Mobile hamburger */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Menu"
                        >
                            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
          TIER 3 — Categories mega nav
      ══════════════════════════════════════════════════════════════ */}
            <div className="hidden md:block bg-background border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex items-center justify-between overflow-x-auto scrollbar-none" aria-label="Catégories">
                        {categoriesToDisplay.map(({ label, href, highlight }: any) => {
                            const urlParams = new URLSearchParams(href.split('?')[1] || "");
                            const categoryVal = urlParams.get('category');
                            const isActive = categoryVal
                                ? searchParams?.get('category') === categoryVal
                                : pathname.startsWith(href.split("?")[0]) && (pathname !== "/" || href === "/");
                            return (
                                <Link
                                    key={label}
                                    href={href}
                                    className={`
                    flex items-center px-4 py-3.5 text-[12px] font-bold tracking-wider whitespace-nowrap
                    border-b-2 transition-all shrink-0
                    ${highlight
                                            ? "text-rose-600 border-rose-500 hover:text-rose-700"
                                            : isActive
                                                ? "text-[#103178] border-[#103178]"
                                                : "text-foreground/80 border-transparent hover:text-[#103178] hover:border-[#103178]/50"
                                        }
                  `}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* ══════════════════════════════════════════════════════════════
          Mobile nav drawer
      ══════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden overflow-hidden border-t bg-background"
                    >
                        <div className="container mx-auto px-4 py-4 space-y-4">
                            {/* Mobile search */}
                            <GlobalSearch />
                            {/* Mobile categories */}
                            <div className="grid grid-cols-3 gap-2">
                                {categoriesToDisplay.map(({ label, href, highlight }: any) => (
                                    <Link
                                        key={label}
                                        href={href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className={`flex items-center justify-center p-3 rounded-xl border text-center text-[11px] font-bold transition-colors ${highlight ? "text-rose-600 border-rose-200 bg-rose-50" : "hover:bg-muted"}`}
                                    >
                                        {label}
                                    </Link>
                                ))}
                            </div>
                            {/* Mobile top links */}
                            <div className="border-t pt-3 flex flex-col gap-1">
                                {TOP_LINKS.map(({ label, href }) => (
                                    <Link key={href} href={href} onClick={() => setMobileMenuOpen(false)} className="text-sm px-2 py-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                                        {label}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

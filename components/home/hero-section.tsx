"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faTruck, faCheck, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowRight, ShieldCheck, Truck, Star, Sparkles, RotateCcw, HeadphonesIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { useCart } from "../../lib/context/cart-context";
import { ALL_PRODUCTS } from "../../lib/data/products";

// ── Hero ─────────────────────────────────────────────────────────────────────
export function HeroSection({ banner, floatingProducts = [], bestSellerImage }: { banner?: any, floatingProducts?: any[], bestSellerImage?: string | null }) {
    const defaultFloating = [
        { href: "/product/1", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop", label: "Sérum Acide Hyaluronique", price: "299" },
        { href: "/product/2", img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=300&auto=format&fit=crop", label: "Crème Anti-Âge Collagène", price: "450" },
        { href: "/product/3", img: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=300&auto=format&fit=crop", label: "Baume Hydratant CeraVe", price: "180" },
    ];

    const displayProducts = floatingProducts.length > 0 
        ? [...floatingProducts.slice(0, 3), ...defaultFloating].slice(0, 3) 
        : defaultFloating;

    const config = [
        { top: "12%", right: "20%", delay: 0 },
        { top: "45%", right: "-5%", delay: 0.15 },
        { top: "75%", right: "15%", delay: 0.3 },
    ];

    const floatingCards = displayProducts.map((p, i) => {
        const finalPrice = p.salePrice ?? p.price;
        return {
            href: p.href || `/product/${p.slug || p.id}`,
            img: p.img || (Array.isArray(p.images) ? p.images[0] : p.image) || "/placeholder.jpg",
            label: p.label || p.name,
            price: finalPrice ? `${finalPrice} Dhs` : "Prix sur demande",
            ...config[i % config.length]
        };
    });

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-white dark:from-blue-950/20 dark:to-background pointer-events-none" />

            {/* Soft Orbs */}
            <div className="absolute top-0 left-1/4 w-[800px] h-[800px] rounded-full bg-[#103178]/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

            {/* Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

            <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">

                    {/* Left Copy */}
                    <div className="space-y-8 max-w-2xl relative z-10">
                        {/* Urgency badge */}
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-semibold text-primary backdrop-blur-md shadow-sm opacity-0 animate-[fadeIn_0.8s_ease-out_forwards]">
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            Parapharmacie N°1 au Maroc
                            <span className="ml-1 w-2 h-2 rounded-full bg-green-500 animate-ping inline-block" />
                        </div>

                        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1] text-foreground opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]">
                            La beauté &amp; <br />la santé,{" "}
                            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#103178] to-[#2d6a4f]">
                                au quotidien.
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                                    <path d="M2 10 Q150 2 298 10" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg text-muted-foreground/90 leading-relaxed sm:text-xl font-medium opacity-0 animate-[fadeInUp_0.6s_ease-out_0.3s_forwards]">
                            Découvrez une sélection exclusive de produits parapharmaceutiques premium. Des soins authentiques pour sublimer votre peau et préserver votre bien-être.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-2 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.4s_forwards]">
                            {/* Primary CTA with pulsing ring */}
                            <div className="relative inline-block">
                                <span className="absolute inset-0 rounded-2xl bg-[#103178]/30 animate-ping opacity-40 pointer-events-none" />
                                <Button size="lg" className="relative h-14 px-8 text-base bg-[#103178] hover:bg-[#0d266b] shadow-2xl shadow-[#103178]/30 transition-all hover:scale-[1.04] hover:shadow-[#103178]/40 gap-2 rounded-2xl font-bold" asChild>
                                    <Link href="/shop">
                                        Explorer la boutique
                                        <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                            </div>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-2 border-slate-200 hover:bg-orange-50 hover:border-orange-300 gap-2 rounded-2xl group font-bold" asChild>
                                <Link href="/shop?badge=Promo">
                                    <FontAwesomeIcon icon={faFire} className="mr-1.5 text-orange-500 group-hover:scale-125 transition-transform" />
                                    <span>Nos promotions</span>
                                    <span className="ml-1.5 text-[10px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-full">-40%</span>
                                </Link>
                            </Button>
                        </div>

                        {/* Social proof + trust tags */}
                        <div className="flex flex-wrap items-center gap-y-3 gap-x-5 pt-4 opacity-0 animate-[fadeIn_0.6s_ease-out_0.6s_forwards]">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {["bg-blue-500","bg-emerald-500","bg-rose-500","bg-amber-500"].map((c,i) => (
                                        <div key={i} className={`w-7 h-7 rounded-full ${c} border-2 border-white flex items-center justify-center text-white text-[9px] font-bold`}>{["S","K","M","N"][i]}</div>
                                    ))}
                                </div>
                                <span className="text-sm font-semibold text-slate-600"><strong className="text-slate-900">+12 000</strong> clients satisfaits</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                                <ShieldCheck className="h-4 w-4 text-[#2d6a4f]" /> 100% Authentique
                            </div>
                            <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                                <Truck className="h-4 w-4 text-[#2d6a4f]" /> Livraison 48h
                            </div>
                        </div>
                    </div>

                    {/* Right Imagery */}
                    <div className="hidden lg:block relative h-[500px] xl:h-[600px] w-full">
                        {/* Blob decorations */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-gradient-to-tr from-[#103178]/20 to-[#2d6a4f]/20 blur-2xl animate-[spin_20s_linear_infinite]" />

                        {/* Main Image */}
                        <div
                            className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 w-[300px] xl:w-[350px] h-[400px] xl:h-[450px] rounded-[2rem] overflow-hidden border-[6px] border-white shadow-2xl rotate-[-2deg] opacity-0 animate-[zoomIn_0.8s_ease-out_0.2s_forwards]"
                        >
                            <Image
                                src={bestSellerImage || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop"}
                                alt="Beauté Naturelle"
                                fill
                                priority
                                className="object-cover"
                            />
                            {/* Inner gradient for text readability if needed */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>

                        {/* Floating Cards */}
                        {floatingCards.map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.8, x: 50 }}
                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                transition={{ duration: 0.6, delay: 0.5 + card.delay, type: "spring" }}
                                style={{ top: card.top, right: card.right }}
                                className="absolute z-20"
                            >
                                <Link href={card.href}>
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i }}
                                        className="bg-white/90 backdrop-blur-xl rounded-2xl border shadow-xl p-3 flex items-center gap-3 w-56 hover:scale-105 hover:bg-white transition-all cursor-pointer"
                                    >
                                        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-slate-100 shadow-sm relative">
                                            <Image src={card.img} alt={card.label} fill className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400 mb-0.5">Top Vente</p>
                                            <p className="text-xs font-bold text-slate-800 truncate">{card.label}</p>
                                            <p className="text-sm font-black text-[#103178]">{card.price}</p>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

// ── Trust Bar ─────────────────────────────────────────────────────────────────
export function TrustBar() {
    const items = [
        { icon: ShieldCheck, title: "Produits 100% authentiques", sub: "Garantis d'origine" },
        { icon: Truck, title: "Livraison 48h", sub: "Partout au Maroc" },
        { icon: RotateCcw, title: "Retour sous 14 jours", sub: "Satisfait ou remboursé" },
        { icon: HeadphonesIcon, title: "Support 7j/7", sub: "Experts en pharmacie" },
    ];

    return (
        <section className="border-y bg-card">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y lg:divide-y-0 divide-border">
                    {items.map(({ icon: Icon, title, sub }) => (
                        <div key={title} className="flex items-center gap-4 px-6 py-5">
                            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">{title}</p>
                                <p className="text-xs text-muted-foreground">{sub}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Featured Categories ───────────────────────────────────────────────────────

export function FeaturedCategories({ categories = [] }: { categories?: any[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ align: "start", dragFree: true });

    const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
    const scrollNext = () => emblaApi && emblaApi.scrollNext();

    if (categories.length === 0) return null;

    const displayCategories = categories;

    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Explorer</span>
                    <h2 className="text-3xl font-extrabold tracking-tight">Nos Catégories</h2>
                    <p className="text-muted-foreground mt-1">Trouvez rapidement ce dont vous avez besoin</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hidden sm:flex" onClick={scrollPrev}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-full hidden sm:flex" onClick={scrollNext}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" asChild className="hidden sm:inline-flex group gap-1 ml-4">
                        <Link href="/categories">Tout voir <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                    </Button>
                </div>
            </div>

            {/* Carousel */}
            <div className="overflow-hidden cursor-grab active:cursor-grabbing" ref={emblaRef}>
                <div className="flex gap-4">
                    {displayCategories.map((cat, i) => {
                        const count = cat._count ? `${cat._count.products} produit${cat._count.products > 1 ? 's' : ''}` : "Produits";
                        const href = `/shop?category=${cat.slug || cat.name}`;
                        const img = cat.image || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop";
                        return (
                            <motion.div
                                key={cat.id || i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.05 }}
                                viewport={{ once: true }}
                                className="flex-[0_0_80%] sm:flex-[0_0_40%] lg:flex-[0_0_22%] min-w-0"
                            >
                                <Link
                                    href={href}
                                    className="group relative rounded-3xl overflow-hidden border bg-card hover:shadow-xl transition-all block aspect-[4/5]"
                                >
                                    <Image
                                        src={img}
                                        alt={cat.name}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        sizes="(max-width: 768px) 80vw, 25vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    <div className="absolute inset-x-0 bottom-0 p-6">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#103178] bg-white border px-2 py-0.5 rounded-full inline-block mb-3 shadow-md">{count}</span>
                                        <h3 className="text-2xl font-black text-white group-hover:-translate-y-1 transition-transform duration-300">{cat.name}</h3>
                                        <p className="text-xs text-white/70 mt-1 line-clamp-1 group-hover:translate-x-1 transition-transform duration-300">
                                            {cat.sub || "Voir la collection"}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>

            <div className="flex justify-center mt-6 sm:hidden gap-4">
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-sm" onClick={scrollPrev}>
                    <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="icon" className="h-12 w-12 rounded-full shadow-sm" onClick={scrollNext}>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        </section>
    );
}

// ── Promo Banner ──────────────────────────────────────────────────────────────
export function PromoBanner({ banner }: { banner?: any }) {
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#103178] to-[#1a4db8] p-10 md:p-14 text-white"
            >
                {/* Background elements */}
                <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute -bottom-16 -left-10 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
                <div className="absolute top-0 right-0 w-1/3 h-full opacity-10">
                    <Image src={banner?.imageUrl || "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=500&auto=format&fit=crop"} alt="" fill className="object-cover" />
                </div>

                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-1.5 text-sm font-bold border border-white/30">
                            <FontAwesomeIcon icon={faFire} className="mr-1.5" />Offre limitée — Jusqu&apos;au vendredi
                        </div>
                        <h2 className="text-4xl font-extrabold leading-tight">
                            {banner?.title ? banner.title : (
                                <>Jusqu&apos;à <span className="text-yellow-300">-40%</span><br />sur la gamme Vichy</>
                            )}
                        </h2>
                        <p className="text-white/75 leading-relaxed">
                            {banner?.subtitle || "Profitez de nos meilleures offres sur une sélection de produits anti-âge, hydratants et solaires. Stock limité !"}
                        </p>
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 gap-2 shadow-xl shadow-black/20 font-bold h-12" asChild>
                            <Link href={banner?.link || "/shop?badge=Promo"}>Voir l'offre <ArrowRight className="h-5 w-5" /></Link>
                        </Button>
                    </div>

                    <div className="hidden md:flex justify-center gap-4">
                        {[
                            { label: "Crème Vichy", old: "450 Dhs", new: "270 Dhs", img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=300&auto=format&fit=crop" },
                            { label: "Sérum La Roche", old: "350 Dhs", new: "299 Dhs", img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop" },
                        ].map((p) => (
                            <div key={p.label} className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20 w-40 text-center">
                                <div className="w-full aspect-square rounded-xl overflow-hidden mb-3 relative">
                                    <Image src={p.img} alt={p.label} fill className="object-cover" />
                                </div>
                                <p className="text-xs font-semibold line-clamp-1">{p.label}</p>
                                <p className="text-xs text-white/50 line-through mt-0.5">{p.old}</p>
                                <p className="text-base font-extrabold text-yellow-300">{p.new}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

// ── Best Sellers ──────────────────────────────────────────────────────────────
export function BestSellers({ bestSellers }: { bestSellers: any[] }) {
    const { addItem } = useCart();
    const [activeFilter, setActiveFilter] = useState("Tous");

    const filters = ["Tous", "Visage", "Corps", "Solaire", "Anti-Âge"];

    const filteredProducts = activeFilter === "Tous"
        ? bestSellers
        : bestSellers.filter(p => {
            const searchStr = activeFilter.toLowerCase();
            return (
                p.category?.toLowerCase() === searchStr ||
                p.category?.toLowerCase().includes(searchStr) ||
                p.name?.toLowerCase().includes(searchStr) ||
                (typeof p.description === 'string' && p.description.toLowerCase().includes(searchStr))
            );
        });

    const displayProducts = filteredProducts;

    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div className="text-center w-full md:w-auto md:text-left">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Tendances</span>
                    <h2 className="text-3xl font-extrabold tracking-tight">Nos Produits</h2>
                    <p className="text-muted-foreground mt-1">Découvrez notre sélection exclusive</p>
                </div>

                {/* Quick Filters */}
                <div className="flex bg-muted/50 p-1 rounded-xl overflow-x-auto hide-scrollbar self-center md:self-end max-w-full">
                    {filters.map(f => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${activeFilter === f
                                ? "bg-white text-primary shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
                {displayProducts.length > 0 ? displayProducts.map((item, index) => {
                    const price = item.salePrice ?? item.price;
                    const image = item.images?.[0] || item.image; // handle both DB struct and old struct
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.06 }}
                            viewport={{ once: true }}
                            className="group flex flex-col h-full rounded-2xl border border-slate-100 bg-white hover:shadow-2xl hover:shadow-slate-200/60 hover:border-slate-200 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >
                            {/* Image zone */}
                            <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100">
                                {/* Badges */}
                                {item.badge && (
                                    <span className={`absolute top-3 left-3 z-10 text-xs font-black px-2.5 py-1 rounded-full shadow-md ${item.badge === "Promo" ? "bg-rose-500 text-white" : item.badge === "Best-seller" ? "bg-amber-500 text-white" : "bg-[#103178] text-white"}`}>
                                        {item.badge}
                                    </span>
                                )}
                                {item.salePrice && (
                                    <span className="absolute top-3 right-3 z-10 text-[10px] font-black bg-rose-500 text-white px-2 py-0.5 rounded-full shadow-md">
                                        -{Math.round(((item.price - item.salePrice) / item.price) * 100)}%
                                    </span>
                                )}

                                <Link href={`/product/${item.slug || item.id}`} className="block w-full h-full relative">
                                    <Image
                                        src={image}
                                        alt={item.name}
                                        fill
                                        unoptimized
                                        className="object-contain mix-blend-multiply transition-all duration-500 group-hover:scale-110 p-3"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                </Link>

                                {/* Hover glass overlay with CTA */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#103178]/80 via-[#103178]/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-3">
                                    <button
                                        onClick={() => addItem(item, 1)}
                                        className="w-full py-2.5 rounded-xl bg-white text-[#103178] font-black text-xs shadow-xl hover:bg-[#103178] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <span>Ajouter au panier</span>
                                        <span className="font-black text-sm">{price} Dhs</span>
                                    </button>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4 flex flex-col gap-1.5 flex-1">
                                <Link href={`/product/${item.slug || item.id}`}>
                                    <span className="text-[9px] font-black text-[#103178]/60 uppercase tracking-[0.15em]">{item.brand || "Vitaluxe"}</span>
                                    <h3 className="font-bold line-clamp-2 leading-snug mt-0.5 text-slate-800 group-hover:text-[#103178] transition-colors text-sm">{item.name}</h3>
                                </Link>

                                {/* Stars */}
                                <div className="flex items-center gap-1 mt-0.5">
                                    <div className="flex gap-px">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`h-3 w-3 ${i < (item.rating || 4) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] text-slate-400">({(item.name.length * 7 + 12) % 80 + 20})</span>
                                </div>

                                {/* Price row */}
                                <div className="mt-auto pt-2 flex items-center justify-between">
                                    <div>
                                        <span className="text-base font-black text-[#103178]">{price} <span className="text-xs font-bold">Dhs</span></span>
                                        {item.salePrice && (
                                            <span className="ml-1.5 text-xs text-slate-400 line-through">{item.price}</span>
                                        )}
                                    </div>
                                    <button
                                        className="md:hidden w-9 h-9 rounded-full bg-[#103178] text-white flex items-center justify-center shadow-md shadow-[#103178]/20 text-lg font-bold hover:bg-[#0d266b] transition-colors"
                                        onClick={() => addItem(item, 1)}
                                    >+</button>
                                </div>
                            </div>
                        </motion.div>
                    );
                }) : (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Sparkles className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                        <p className="text-muted-foreground font-medium italic">
                            Aucun produit ne correspond à ce filtre actuellement.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-center mt-12">
                <Button size="lg" variant="outline" className="gap-2 border-slate-200 hover:border-[#103178] hover:bg-slate-50 px-8 rounded-full shadow-sm text-slate-600 font-bold" asChild>
                    <Link href="/shop">Voir toute la collection <ArrowRight className="h-4 w-4" /></Link>
                </Button>
            </div>
        </section>
    );
}

export function BrandLogos({ brands }: { brands: any[] }) {
    const [emblaRef, emblaApi] = useEmblaCarousel({
        align: "start",
        dragFree: true,
        loop: true,
    });
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(true);

    const scrollPrev = () => emblaApi?.scrollPrev();
    const scrollNext = () => emblaApi?.scrollNext();

    // Fallback logo quand l'image n'est pas disponible
    const FALLBACK_BRANDS = [
        "La Roche-Posay", "Vichy", "CeraVe", "Eucerin", "Avène",
        "Bioderma", "Nuxe", "Mustela", "Garnier", "Nivea",
    ];
    const displayBrands = brands.length > 0 ? brands : FALLBACK_BRANDS.map(n => ({ name: n, image: null }));

    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary mb-1 block">Partenaires</span>
                    <h2 className="text-2xl font-extrabold text-slate-900">Nos marques partenaires</h2>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={scrollPrev}
                        className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center hover:bg-[#103178] hover:text-white hover:border-[#103178] transition-all disabled:opacity-30"
                        aria-label="Précédent"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center hover:bg-[#103178] hover:text-white hover:border-[#103178] transition-all"
                        aria-label="Suivant"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-4">
                    {displayBrands.map(({ name, image }: { name: string; image?: string | null }, i: number) => (
                        <Link
                            key={`${name}-${i}`}
                            href={`/shop?brand=${encodeURIComponent(name)}`}
                            className="flex-[0_0_auto] w-40 h-24 rounded-2xl border border-slate-100 bg-white shadow-sm hover:border-[#103178]/30 hover:shadow-md transition-all cursor-pointer group flex items-center justify-center px-4"
                        >
                            {image ? (
                                <Image
                                    src={image}
                                    alt={`Logo ${name}`}
                                    width={120}
                                    height={60}
                                    unoptimized
                                    className="max-h-12 max-w-full object-contain filter grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
                                />
                            ) : (
                                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-[#103178] transition-colors text-center leading-tight">
                                    {name}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Testimonials ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
    {
        name: "Fatima Z.",
        avatar: "FZ",
        color: "bg-rose-500",
        city: "Casablanca",
        rating: 5,
        text: "Je commande régulièrement sur Vitaluxe. La qualité des produits est impeccable et la livraison est toujours rapide. Je recommande vivement !",
        product: "Sérum La Roche-Posay",
    },
    {
        name: "Youssef A.",
        avatar: "YA",
        color: "bg-primary",
        city: "Rabat",
        rating: 5,
        text: "Excellent service client, j'ai eu un problème avec ma commande et il a été résolu en moins de 24h. Les produits sont originaux à 100%.",
        product: "Crème Vichy Anti-Âge",
    },
    {
        name: "Nadia M.",
        avatar: "NM",
        color: "bg-emerald-500",
        city: "Marrakech",
        rating: 5,
        text: "Les prix sont très compétitifs par rapport aux pharmacies classiques. Je suis une cliente fidèle depuis plus d'un an, jamais déçue !",
        product: "Baume CeraVe",
    },
];

export function Testimonials() {
    return (
        <section className="bg-muted/40 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Avis clients</span>
                    <h2 className="text-3xl font-extrabold tracking-tight">Ce que disent nos clients</h2>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />)}</div>
                        <span className="font-bold text-lg">4.9</span>
                        <span className="text-muted-foreground text-sm">sur 2 847 avis</span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.45, delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="bg-card rounded-2xl border p-6 space-y-4 hover:shadow-lg transition-all"
                        >
                            {/* Stars */}
                            <div className="flex gap-0.5">
                                {Array.from({ length: 5 }).map((_, j) => (
                                    <Star key={j} className={`h-4 w-4 ${j < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">&ldquo;{t.text}&rdquo;</p>
                            <div className="flex items-center justify-between pt-2 border-t">
                                <div className="flex items-center gap-3">
                                    <div className={`w-9 h-9 rounded-full ${t.color} text-white text-xs font-bold flex items-center justify-center`}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold">{t.name}</p>
                                        <p className="text-xs text-muted-foreground">{t.city}</p>
                                    </div>
                                </div>
                                <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium"><FontAwesomeIcon icon={faCheck} className="mr-0.5" />Achat vérifié</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

// ── Newsletter ────────────────────────────────────────────────────────────────
export function Newsletter() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const subscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        if (!email) return;

        setLoading(true);
        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                setMessage(data.message || "Inscription réussie !");
                setEmail("");
            } else {
                setMessage(data.error || "Une erreur est survenue.");
            }
        } catch (error) {
            setMessage("Erreur de connexion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-3xl p-10 md:p-16 text-center"
                style={{ background: "linear-gradient(135deg, #0a1f5c 0%, #103178 40%, #1a4a8a 70%, #0d3d6b 100%)" }}
            >
                {/* Decorative blobs */}
                <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-blue-300/10 blur-2xl pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-white/5 pointer-events-none" />

                {/* Floating dots */}
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="absolute w-1.5 h-1.5 rounded-full bg-white/20" style={{ top: `${15 + i * 12}%`, left: `${5 + i * 15}%` }} />
                ))}

                <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                    {/* Discount badge */}
                    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur border border-white/20 rounded-full px-5 py-2 text-white text-sm font-bold">
                        <span className="text-yellow-300 text-lg">🎁</span>
                        Code de bienvenue : <span className="text-yellow-300 font-black tracking-widest">-15%</span> sur votre 1ère commande
                    </div>

                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                            Ne manquez aucune offre <br />
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #f0c040, #fde68a)" }}>exclusive Vitaluxe</span>
                        </h2>
                        <p className="text-white/70 mt-3 text-base leading-relaxed">
                            Rejoignez <strong className="text-white">+12 000 clients</strong> qui reçoivent en avant-première nos meilleures offres, conseils beauté et nouveautés chaque semaine.
                        </p>
                    </div>

                    <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                        <div className="flex-1 relative">
                            <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="email"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 pl-11 pr-4 text-white placeholder-white/40 text-sm focus:outline-none focus:ring-2 focus:ring-white/30 focus:bg-white/20 transition-all"
                                required
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="h-14 px-8 rounded-2xl font-black text-sm text-[#103178] shadow-xl hover:shadow-2xl hover:scale-[1.03] transition-all disabled:opacity-60 flex items-center gap-2 whitespace-nowrap"
                            style={{ background: "linear-gradient(135deg, #f0c040, #fde68a)" }}
                        >
                            {loading ? "Chargement..." : <><span>S&apos;inscrire gratuitement</span> <ArrowRight className="h-4 w-4" /></>}
                        </button>
                    </form>

                    {message && <p className="text-sm font-bold text-yellow-300">{message}</p>}

                    <p className="text-xs text-white/40 flex items-center justify-center gap-1.5">
                        <FontAwesomeIcon icon={faLock} />Aucun spam. Désabonnement en un clic. Données protégées.
                    </p>

                    {/* Social proof avatars */}
                    <div className="flex items-center justify-center gap-3 pt-2">
                        <div className="flex -space-x-2">
                            {["bg-blue-400","bg-emerald-400","bg-rose-400","bg-amber-400","bg-purple-400"].map((c,i) => (
                                <div key={i} className={`w-8 h-8 rounded-full ${c} border-2 border-[#103178] flex items-center justify-center text-white text-[10px] font-bold`}>{["S","K","N","M","A"][i]}</div>
                            ))}
                        </div>
                        <span className="text-white/60 text-xs">+12 000 abonnés satisfaits</span>
                    </div>
                </div>
            </motion.div>
        </section>
    );
}

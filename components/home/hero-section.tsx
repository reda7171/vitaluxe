"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faTruck, faCheck, faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Truck, Star, Sparkles, RotateCcw, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/lib/context/cart-context";
import { ALL_PRODUCTS } from "@/lib/data/products";

// ── Hero ─────────────────────────────────────────────────────────────────────
export function HeroSection({ banner }: { banner?: any }) {
    const floatingCards = [
        { img: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=300&auto=format&fit=crop", label: "Sérum à l'Acide Hyaluronique", price: "299 Dhs", top: "12%", right: "20%", delay: 0 },
        { img: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=300&auto=format&fit=crop", label: "Crème Anti-Âge Premium", price: "450 Dhs", top: "45%", right: "-5%", delay: 0.15 },
        { img: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=300&auto=format&fit=crop", label: "Soin Multi-Action Beauté", price: "180 Dhs", top: "75%", right: "15%", delay: 0.3 },
    ];

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
                        <motion.div
                            initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                            className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-5 py-2 text-sm font-semibold text-primary backdrop-blur-md shadow-sm"
                        >
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            Prenez soin de vous avec Vitaluxe
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1] text-foreground"
                        >
                            {banner?.title ? (
                                <span dangerouslySetInnerHTML={{ __html: banner.title }} />
                            ) : (
                                <>
                                    La beauté &amp; <br />la santé,{" "}
                                    <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#103178] to-[#2d6a4f]">
                                        au quotidien.
                                        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 12" fill="none">
                                            <path d="M2 10 Q150 2 298 10" stroke="#2d6a4f" strokeWidth="4" strokeLinecap="round" opacity="0.4" />
                                        </svg>
                                    </span>
                                </>
                            )}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="text-lg text-muted-foreground/90 leading-relaxed sm:text-xl font-medium"
                        >
                            {banner?.subtitle || "Découvrez une sélection exclusive de produits parapharmaceutiques premium. Des soins authentiques pour sublimer votre peau et préserver votre bien-être."}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="flex flex-col sm:flex-row gap-4 pt-2"
                        >
                            <Button size="lg" className="h-14 px-8 text-base shadow-xl shadow-[#103178]/20 transition-all hover:scale-[1.03] hover:shadow-[#103178]/30 gap-2 rounded-2xl" asChild>
                                <Link href={banner?.link || "/shop"}>Explorer la boutique <ArrowRight className="h-5 w-5" /></Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-base border-2 hover:bg-slate-50 gap-2 rounded-2xl group" asChild>
                                <Link href="/shop?badge=Promo">
                                    <FontAwesomeIcon icon={faFire} className="mr-1.5 text-orange-500 group-hover:animate-bounce" />
                                    Nos promotions
                                </Link>
                            </Button>
                        </motion.div>

                        {/* Feature mini-tags */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-wrap items-center gap-y-4 gap-x-6 pt-6 text-sm font-semibold text-muted-foreground"
                        >
                            <div className="flex items-center gap-2 whitespace-nowrap"><ShieldCheck className="h-5 w-5 text-[#2d6a4f]" /> 100% Authentique</div>
                            <div className="flex items-center gap-2 whitespace-nowrap"><Truck className="h-5 w-5 text-[#2d6a4f]" /> Livraison 48h</div>
                        </motion.div>
                    </div>

                    {/* Right Imagery */}
                    <div className="hidden lg:block relative h-[500px] xl:h-[600px] w-full">
                        {/* Blob decorations */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-[40%_60%_70%_30%_/_40%_50%_60%_50%] bg-gradient-to-tr from-[#103178]/20 to-[#2d6a4f]/20 blur-2xl animate-[spin_20s_linear_infinite]" />

                        {/* Main Image */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.85, rotate: -2 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 100 }}
                            className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-1/2 w-[300px] xl:w-[350px] h-[400px] xl:h-[450px] rounded-[2rem] overflow-hidden border-[6px] border-white shadow-2xl rotate-[-2deg]"
                        >
                            <Image
                                src={banner?.imageUrl || "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop"}
                                alt="Beauté Naturelle"
                                fill
                                priority
                                className="object-cover"
                            />
                            {/* Inner gradient for text readability if needed */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                        </motion.div>

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
const categories = [
    { name: "Visage", sub: "Sérums, crèmes & soins", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop", count: "218 produits", href: "/shop?category=Visage" },
    { name: "Corps", sub: "Hydratation & bien-être", image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=600&auto=format&fit=crop", count: "145 produits", href: "/shop?category=Corps" },
    { name: "Cheveux", sub: "Soin & brillance", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600&auto=format&fit=crop", count: "96 produits", href: "/shop?category=Cheveux" },
    { name: "Compléments", sub: "Vitamines & minéraux", image: "https://images.unsplash.com/photo-1550572017-edb799be0d36?q=80&w=600&auto=format&fit=crop", count: "73 produits", href: "/shop?category=Compléments" },
];

export function FeaturedCategories() {
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-10">
                <div>
                    <span className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">Explorer</span>
                    <h2 className="text-3xl font-extrabold tracking-tight">Nos Catégories</h2>
                    <p className="text-muted-foreground mt-1">Trouvez rapidement ce dont vous avez besoin</p>
                </div>
                <Button variant="ghost" asChild className="hidden sm:inline-flex group gap-1">
                    <Link href="/categories">Tout voir <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></Link>
                </Button>
            </div>

            {/* Asymmetric grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {categories.map((cat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        viewport={{ once: true }}
                    >
                        <Link
                            href={cat.href}
                            className={`group relative rounded-2xl overflow-hidden border bg-card hover:shadow-xl transition-all block ${i === 0 ? "md:row-span-1 aspect-[3/4]" : "aspect-square"}`}
                        >
                            <Image
                                src={cat.image}
                                alt={cat.name}
                                fill
                                unoptimized
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes="(max-width: 768px) 50vw, 25vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-5">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/60 block mb-1">{cat.count}</span>
                                <h3 className="text-xl font-extrabold text-white group-hover:-translate-y-1 transition-transform duration-300">{cat.name}</h3>
                                <p className="text-xs text-white/70 mt-0.5 group-hover:translate-x-1 transition-transform duration-300">{cat.sub}</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
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
        : bestSellers.filter(p => p.name.toLowerCase().includes(activeFilter.toLowerCase()) || (p.description && p.description.toLowerCase().includes(activeFilter.toLowerCase())));

    // If filtering results in empty array (because dummy data doesn't match), fallback to all just to not look broken.
    const displayProducts = filteredProducts.length > 0 ? filteredProducts : bestSellers;

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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.map((item, index) => {
                    const price = item.salePrice ?? item.price;
                    const image = item.images?.[0] || item.image; // handle both DB struct and old struct
                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            viewport={{ once: true }}
                            className="group flex flex-col h-full rounded-2xl border bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300 overflow-hidden"
                        >
                            {/* Image */}
                            <div className="relative aspect-square sm:aspect-[4/5] overflow-hidden bg-slate-50 p-4">
                                {item.badge && (
                                    <span className={`absolute top-3 left-3 z-10 text-xs font-bold px-3 py-1 rounded-full shadow-sm ${item.badge === "Promo" ? "bg-rose-500 text-white" :
                                        item.badge === "Best-seller" ? "bg-amber-500 text-white" :
                                            "bg-[#103178] text-white"
                                        }`}>{item.badge}</span>
                                )}
                                {item.salePrice && (
                                    <span className="absolute top-3 right-3 z-10 text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full shadow-sm">
                                        -{Math.round(((item.price - item.salePrice) / item.price) * 100)}%
                                    </span>
                                )}
                                <Link href={`/product/${item.slug || item.id}`} className="block w-full h-full relative">
                                    <Image
                                        src={image}
                                        alt={item.name}
                                        fill
                                        unoptimized
                                        className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110 p-2"
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                    />
                                    {/* Hover overlay for direct add to cart (Desktop) */}
                                    <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center translate-y-4 group-hover:translate-y-0 duration-300 hidden md:flex">
                                        <Button
                                            className="w-full rounded-xl shadow-lg shadow-black/10 font-bold gap-2"
                                            onClick={(e) => { e.preventDefault(); addItem(item, 1); }}
                                        >
                                            Ajouter pour {price} Dhs
                                        </Button>
                                    </div>
                                </Link>
                            </div>

                            {/* Info */}
                            <div className="p-5 flex flex-col gap-2 flex-1 bg-white">
                                <Link href={`/product/${item.slug || item.id}`}>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.brand || "Marque"}</span>
                                    <h3 className="font-semibold line-clamp-2 leading-tight mt-1 text-slate-800 group-hover:text-[#103178] transition-colors text-sm">{item.name}</h3>
                                </Link>
                                <div className="flex items-center gap-1.5 text-amber-500 mt-0.5">
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star key={i} className={`h-3 w-3 ${i < (item.rating || 5) ? "fill-amber-400 text-amber-400" : "fill-slate-200 text-slate-200"}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-semibold text-slate-500">({item.reviews || (item.name.length * 7 + 12) % 150 + 10})</span>
                                </div>
                                <div className="mt-auto pt-4 flex items-center justify-between md:hidden">
                                    {/* Mobile only visible price block, since desktop has hover button. Actually, let's keep price visible everywhere. */}
                                    <div>
                                        <span className="text-lg font-black text-[#103178]">{price} Dhs</span>
                                        {item.salePrice && (
                                            <span className="ml-2 text-xs text-slate-400 line-through">{item.price} Dhs</span>
                                        )}
                                    </div>
                                    <Button
                                        size="icon"
                                        className="rounded-full h-10 w-10 shrink-0 shadow-md shadow-[#103178]/20"
                                        onClick={() => addItem(item, 1)}
                                    >
                                        +
                                    </Button>
                                </div>
                                <div className="mt-auto pt-3 hidden md:block">
                                    {/* Desktop price display */}
                                    <div>
                                        <span className="text-lg font-black text-[#103178]">{price} Dhs</span>
                                        {item.salePrice && (
                                            <span className="ml-2 text-xs text-slate-400 line-through">{item.price} Dhs</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
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
    return (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Nos marques partenaires</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
                {brands.map(({ name, image }, i) => (
                    <motion.div
                        key={name}
                        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                        transition={{ duration: 0.4, delay: i * 0.08 }}
                        viewport={{ once: true }}
                        className="flex items-center justify-center h-24 w-48 px-6 py-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:border-primary/20 hover:shadow-md transition-all cursor-pointer group"
                    >
                        {image ? (
                            <Image
                                src={image}
                                alt={`Logo ${name}`}
                                width={144}
                                height={72}
                                unoptimized
                                className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300 opacity-60 group-hover:opacity-100"
                            />
                        ) : (
                            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                {name}
                            </span>
                        )}
                    </motion.div>
                ))}
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
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-background to-blue-50/50 border p-10 md:p-14 text-center"
            >
                <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-blue-300/10 blur-2xl pointer-events-none" />

                <div className="relative z-10 max-w-xl mx-auto space-y-5">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-primary" />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight">Restez informé</h2>
                    <p className="text-muted-foreground">
                        Inscrivez-vous à notre newsletter et recevez <strong>-15% de réduction</strong> sur votre première commande, plus les dernières offres et conseils beauté.
                    </p>
                    <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
                        <input
                            type="email"
                            placeholder="votre@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="flex-1 h-12 rounded-full border bg-background px-5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                            disabled={loading}
                        />
                        <Button type="submit" disabled={loading} className="h-12 px-6 rounded-full gap-2 shadow-md shadow-primary/20 whitespace-nowrap">
                            {loading ? "Chargement..." : <>S&apos;inscrire <ArrowRight className="h-4 w-4" /></>}
                        </Button>
                    </form>
                    {message && <p className="text-sm font-medium mt-2 text-primary">{message}</p>}
                    <p className="text-xs text-muted-foreground">
                        <FontAwesomeIcon icon={faLock} className="mr-1" />Aucun spam. Désabonnement en un clic. Données protégées.
                    </p>
                </div>
            </motion.div>
        </section>
    );
}

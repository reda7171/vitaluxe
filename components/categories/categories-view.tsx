"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Grid3X3, Star, ShoppingBag, Smile, Flower2, Scissors, Pill, Sun, Baby } from "lucide-react";
import { useCart } from "../../lib/context/cart-context";

const CATEGORY_STYLES: Record<string, {
    icon: any;
    gradient: string;
    textColor: string;
    description: string;
}> = {
    Visage: {
        icon: Smile,
        gradient: "from-rose-500/90 to-pink-600/90",
        textColor: "text-rose-400",
        description: "Prenez soin de votre visage avec nos sérums et crèmes.",
    },
    Corps: {
        icon: Flower2,
        gradient: "from-amber-500/90 to-orange-600/90",
        textColor: "text-amber-400",
        description: "Hydratation et bien-être pour tout votre corps.",
    },
    Cheveux: {
        icon: Scissors,
        gradient: "from-purple-500/90 to-violet-600/90",
        textColor: "text-purple-400",
        description: "Soin et brillance pour tous types de cheveux.",
    },
    Compléments: {
        icon: Pill,
        gradient: "from-emerald-500/90 to-teal-600/90",
        textColor: "text-emerald-400",
        description: "Vitamines et minéraux pour votre santé.",
    },
    Solaire: {
        icon: Sun,
        gradient: "from-yellow-500/90 to-orange-500/90",
        textColor: "text-yellow-400",
        description: "Protection solaire maximale pour toute la famille.",
    },
    Bébé: {
        icon: Baby,
        gradient: "from-sky-400/90 to-blue-500/90",
        textColor: "text-sky-400",
        description: "Soins doux pour la peau sensible des tout-petits.",
    },
};

const DEFAULT_STYLE = {
    icon: ShoppingBag,
    gradient: "from-[#103178]/90 to-blue-600/90",
    textColor: "text-[#103178]",
    description: "Découvrez notre sélection de produits.",
};

export default function CategoriesPageClient({ initialCategories }: { initialCategories: any[] }) {
    const { addItem } = useCart();

    if (initialCategories.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
                <ShoppingBag className="h-16 w-16 text-slate-200" />
                <h1 className="text-2xl font-bold text-slate-900">Aucune catégorie trouvée</h1>
                <p className="text-slate-500 max-w-sm">Désolé, nous n'avons pas encore de catégories à afficher. Revenez bientôt !</p>
                <Link href="/" className="text-primary font-bold hover:underline">Retour à l'accueil</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            {/* ── Page Header ─────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-blue-50/30 border-b">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                        className="max-w-2xl"
                    >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                            <span>/</span>
                            <span className="text-foreground font-medium">Catégories</span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Grid3X3 className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Nos Catégories</h1>
                        </div>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Explorez notre large gamme de produits parapharmaceutiques organisés par catégorie.
                            Des soins visage aux compléments alimentaires, trouvez ce qu&apos;il vous faut.
                        </p>
                    </motion.div>

                    {/* Quick stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
                        className="flex flex-wrap gap-4 mt-8"
                    >
                        {[
                            { label: "Catégories", value: initialCategories.length },
                            { label: "Produits en ligne", value: initialCategories.reduce((acc, c) => acc + c._count.products, 0) },
                            { label: "Marques", value: "50+" },
                        ].map(({ label, value }) => (
                            <div key={label} className="bg-background/80 backdrop-blur border rounded-xl px-5 py-2.5 flex items-center gap-3">
                                <span className="text-2xl font-extrabold text-primary">{value}</span>
                                <span className="text-sm text-muted-foreground">{label}</span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* ── Category sections ────────────────────────────────────────────────── */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
                {initialCategories.map((cat, i) => {
                    const style = CATEGORY_STYLES[cat.name] || DEFAULT_STYLE;
                    const Icon = style.icon;
                    const count = cat._count?.products || 0;
                    return (
                    <motion.section
                        key={cat.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Section header */}
                        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#103178]/5 flex items-center justify-center">
                                    <Icon className="h-6 w-6 text-[#103178]" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold tracking-tight">{cat.name}</h2>
                                    <p className="text-muted-foreground text-sm mt-0.5 max-w-md">{style.description}</p>
                                    <span className={`text-sm font-bold mt-1 block ${style.textColor}`}>
                                        {count > 0 ? `${count} produit${count > 1 ? "s" : ""}` : "Bientôt disponible"}
                                    </span>
                                </div>
                            </div>
                            <Link
                                href={`/shop?category=${cat.name}`}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 text-sm font-semibold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shrink-0 group"
                            >
                                Voir tous les produits <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {/* Cards grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 rounded-2xl overflow-hidden border">
                            {/* Hero image */}
                            <Link
                                href={`/shop?category=${cat.name}`}
                                className="relative lg:col-span-1 group overflow-hidden min-h-[220px]"
                            >
                                <img 
                                    src={cat.image && cat.image.trim() !== "" ? cat.image : "/placeholder-category.jpg"} 
                                    alt={cat.name} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />                                <div className={`absolute inset-0 bg-gradient-to-t ${style.gradient}`} />
                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                    <p className="text-white font-extrabold text-xl">{cat.name}</p>
                                    <p className="text-white/80 text-sm">{count} produits →</p>
                                </div>
                            </Link>

                            {/* Product mini-cards */}
                            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 divide-x divide-y sm:divide-y-0 divide-border bg-card">
                                {cat.products.length > 0 ? cat.products.map((p: any) => {
                                    const price = p.salePrice ?? p.price;
                                    return (
                                        <div key={p.id} className="flex flex-col p-5 group hover:bg-muted/40 transition-colors">
                                            <Link href={`/product/${p.slug}`} className="block">
                                                <div className="aspect-square w-full mb-4 rounded-xl overflow-hidden bg-muted/20">
                                                <img 
                                                    src={p.image} 
                                                    alt={p.name} 
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                                                />                                                </div>
                                                <span className="text-xs font-bold text-primary uppercase tracking-wider">{p.brand}</span>
                                                <h3 className="text-sm font-semibold mt-1 line-clamp-2 leading-snug group-hover:text-primary transition-colors">{p.name}</h3>
                                            </Link>
                                            <div className="flex items-center gap-1 text-amber-500 text-xs mt-2">
                                                <Star className="h-3 w-3 fill-amber-500" />
                                                <span className="font-semibold">{p.rating}</span>
                                                <span className="text-muted-foreground">({p.reviews})</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <div>
                                                    <span className="font-extrabold">{price} Dhs</span>
                                                    {p.salePrice && <span className="ml-1.5 text-xs text-muted-foreground line-through">{p.price} Dhs</span>}
                                                </div>
                                                <button
                                                    onClick={() => addItem(p, 1)}
                                                    className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shadow hover:scale-110 transition-transform"
                                                    aria-label={`Ajouter ${p.name}`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    );
                                }) : (
                                    <div className="col-span-3 flex flex-col items-center justify-center py-16 text-muted-foreground">
                                        <ShoppingBag className="h-10 w-10 mb-3 opacity-30" />
                                        <p className="font-medium">Produits bientôt disponibles</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.section>
                    );
                })}
            </div>
            
        </div>
    );
}

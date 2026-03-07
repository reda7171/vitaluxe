"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Grid3X3, Star, ShoppingBag } from "lucide-react";
import { ALL_PRODUCTS, CATEGORIES } from "@/lib/data/products";
import { useCart } from "@/lib/context/cart-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faFaceSmile, faSpa, faScissors, faCapsules, faSun, faBabyCarriage } from "@fortawesome/free-solid-svg-icons";

// ─── Category data enriched with count, image, color, description ─────────────
const CATEGORY_DATA: Record<string, {
    icon: IconDefinition;
    description: string;
    image: string;
    gradient: string;
    textColor: string;
}> = {
    Visage: {
        icon: faFaceSmile,
        description: "Sérums, crèmes hydratantes, soins anti-âge, nettoyants et soins spécifiques pour le visage.",
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
        gradient: "from-rose-500/90 to-pink-600/90",
        textColor: "text-rose-400",
    },
    Corps: {
        icon: faSpa,
        description: "Laits corporels, huiles de soin, gels douche, crèmes amincissantes et produits de bien-être.",
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
        gradient: "from-amber-500/90 to-orange-600/90",
        textColor: "text-amber-400",
    },
    Cheveux: {
        icon: faScissors,
        description: "Shampoings, après-shampoings, masques capillaires et soins pour tous types de cheveux.",
        image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
        gradient: "from-purple-500/90 to-violet-600/90",
        textColor: "text-purple-400",
    },
    Compléments: {
        icon: faCapsules,
        description: "Vitamines, minéraux, probiotiques et compléments alimentaires pour votre santé au quotidien.",
        image: "https://images.unsplash.com/photo-1550572017-edb799be0d36?q=80&w=800&auto=format&fit=crop",
        gradient: "from-emerald-500/90 to-teal-600/90",
        textColor: "text-emerald-400",
    },
    Solaire: {
        icon: faSun,
        description: "Crèmes solaires SPF 30/50+, après-soleil, autobronzants et protections pour enfants.",
        image: "https://images.unsplash.com/photo-1556228720-1c2a4624dc1c?q=80&w=800&auto=format&fit=crop",
        gradient: "from-yellow-500/90 to-orange-500/90",
        textColor: "text-yellow-400",
    },
    Bébé: {
        icon: faBabyCarriage,
        description: "Soins doux pour les peaux sensibles des nourrissons : crèmes, bains moussants et lingettes.",
        image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?q=80&w=800&auto=format&fit=crop",
        gradient: "from-sky-400/90 to-blue-500/90",
        textColor: "text-sky-400",
    },
};

const FEATURED_PRODUCTS_BY_CATEGORY = (cat: string) =>
    ALL_PRODUCTS.filter((p) => p.category === cat).slice(0, 3);

export default function CategoriesPageClient() {
    const { addItem } = useCart();

    const categoriesWithCount = CATEGORIES.map((cat) => ({
        name: cat,
        count: ALL_PRODUCTS.filter((p) => p.category === cat).length,
        ...CATEGORY_DATA[cat],
        products: FEATURED_PRODUCTS_BY_CATEGORY(cat),
    }));

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
                            { label: "Catégories", value: CATEGORIES.length },
                            { label: "Produits en ligne", value: ALL_PRODUCTS.length + "+" },
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
                {categoriesWithCount.map((cat, i) => (
                    <motion.section
                        key={cat.name}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Section header */}
                        <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                    <FontAwesomeIcon icon={cat.icon} className="text-2xl text-foreground" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-extrabold tracking-tight">{cat.name}</h2>
                                    <p className="text-muted-foreground text-sm mt-0.5 max-w-md">{cat.description}</p>
                                    <span className={`text-sm font-bold mt-1 block ${cat.textColor}`}>
                                        {cat.count > 0 ? `${cat.count} produit${cat.count > 1 ? "s" : ""}` : "Bientôt disponible"}
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
                                <img src={cat.image} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className={`absolute inset-0 bg-gradient-to-t ${cat.gradient}`} />
                                <div className="absolute inset-0 flex flex-col justify-end p-6">
                                    <p className="text-white font-extrabold text-xl">{cat.name}</p>
                                    <p className="text-white/80 text-sm">{cat.count} produits →</p>
                                </div>
                            </Link>

                            {/* Product mini-cards */}
                            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 divide-x divide-y sm:divide-y-0 divide-border bg-card">
                                {cat.products.length > 0 ? cat.products.map((p) => {
                                    const price = p.salePrice ?? p.price;
                                    return (
                                        <div key={p.id} className="flex flex-col p-5 group hover:bg-muted/40 transition-colors">
                                            <Link href={`/product/${p.id}`} className="block">
                                                <div className="aspect-square w-full mb-4 rounded-xl overflow-hidden bg-muted/20">
                                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                </div>
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
                ))}
            </div>
        </div>
    );
}

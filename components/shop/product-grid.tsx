"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCheck } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Heart, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/context/cart-context";
import type { Product } from "@/lib/data/products";

const BADGE_STYLES: Record<string, string> = {
    Nouveau: "bg-primary text-primary-foreground",
    Promo: "bg-rose-500 text-white",
    "Best-seller": "bg-amber-500 text-white",
};

type ViewMode = "grid" | "list";

type Props = {
    products: Product[];
    viewMode?: ViewMode;
};

function AddedToast({ show }: { show: boolean }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-3 left-3 right-3 bg-emerald-500 text-white text-xs font-bold py-2 px-3 rounded-lg z-20 text-center shadow-lg"
                >
                    <FontAwesomeIcon icon={faCheck} className="mr-1" />Ajouté au panier !
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function ProductCard({ product, viewMode }: { product: Product; viewMode: ViewMode }) {
    const { addItem } = useCart();
    const [wished, setWished] = useState(false);
    const [added, setAdded] = useState(false);

    const price = product.salePrice ?? product.price;
    const discountPct = product.salePrice
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : null;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!product.inStock) return;
        addItem(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    if (viewMode === "list") {
        return (
            <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="group bg-card rounded-2xl border hover:shadow-lg transition-all duration-300 flex gap-0 overflow-hidden"
            >
                {/* Image */}
                <Link href={`/product/${product.id}`} className="relative w-40 shrink-0 aspect-square overflow-hidden bg-muted/20">
                    {!product.inStock && (
                        <div className="absolute inset-0 bg-background/70 backdrop-blur-[2px] z-10 flex items-center justify-center">
                            <span className="text-xs font-semibold bg-background border rounded-full px-3 py-1">Rupture</span>
                        </div>
                    )}
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </Link>

                {/* Info */}
                <div className="flex flex-col flex-1 p-5 gap-2">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold uppercase tracking-widest text-primary">{product.brand}</span>
                                {product.badge && (
                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${BADGE_STYLES[product.badge]}`}>{product.badge}</span>
                                )}
                            </div>
                            <Link href={`/product/${product.id}`}>
                                <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">{product.name}</h3>
                            </Link>
                            {product.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                            )}
                        </div>
                        <button
                            onClick={() => setWished(!wished)}
                            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shrink-0 ${wished ? "bg-rose-50 border-rose-200 text-rose-500" : "hover:bg-rose-50 hover:text-rose-500"}`}
                        >
                            <Heart className={`h-4 w-4 ${wished ? "fill-rose-500" : ""}`} />
                        </button>
                    </div>

                    <div className="flex items-center gap-1.5 text-amber-500 text-xs">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-amber-400" : "fill-muted"} text-transparent`} />
                        ))}
                        <span className="font-semibold text-foreground">{product.rating}</span>
                        <span className="text-muted-foreground">({product.reviews} avis)</span>
                    </div>

                    <div className="flex items-center justify-between mt-auto pt-2 border-t">
                        <div className="flex items-baseline gap-2">
                            <span className="text-xl font-extrabold">{price} Dhs</span>
                            {product.salePrice && <span className="text-sm line-through text-muted-foreground">{product.price} Dhs</span>}
                            {discountPct && <span className="text-xs font-bold text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-md">-{discountPct}%</span>}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" asChild className="gap-1.5 text-xs">
                                <Link href={`/product/${product.id}`}><Eye className="h-3.5 w-3.5" /> Voir</Link>
                            </Button>
                            <Button
                                size="sm"
                                disabled={!product.inStock}
                                onClick={handleAdd}
                                className="gap-1.5 text-xs shadow-sm shadow-primary/20"
                            >
                                <ShoppingCart className="h-3.5 w-3.5" />
                                {product.inStock ? "Ajouter" : "Indisponible"}
                            </Button>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    }

    // GRID mode
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="group flex flex-col bg-card rounded-2xl border hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
        >
            {/* Image container */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
                <AddedToast show={added} />

                {/* Badges */}
                {product.badge && (
                    <span className={`absolute top-3 left-3 z-10 text-xs font-bold px-2.5 py-1 rounded-md shadow ${BADGE_STYLES[product.badge]}`}>
                        {product.badge}
                    </span>
                )}
                {discountPct && !product.badge && (
                    <span className="absolute top-3 left-3 z-10 text-xs font-bold px-2.5 py-1 rounded-md bg-rose-500 text-white shadow">
                        -{discountPct}%
                    </span>
                )}
                {discountPct && product.badge && (
                    <span className="absolute top-3 right-10 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                        -{discountPct}%
                    </span>
                )}

                {/* Out of stock */}
                {!product.inStock && (
                    <div className="absolute inset-0 bg-background/65 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <span className="text-sm font-semibold bg-background border rounded-full px-4 py-1.5">Rupture de stock</span>
                    </div>
                )}

                {/* Wishlist btn */}
                <button
                    onClick={() => setWished(!wished)}
                    className={`absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full border backdrop-blur-sm transition-all ${wished
                        ? "bg-rose-50 border-rose-300 text-rose-500 opacity-100"
                        : "bg-background/70 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-500"
                        }`}
                    aria-label="Ajouter aux favoris"
                >
                    <Heart className={`h-3.5 w-3.5 ${wished ? "fill-rose-500" : ""}`} />
                </button>

                {/* Hover overlay */}
                <Link href={`/product/${product.id}`} className="absolute inset-0 z-[5]">
                    <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/8 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <div className="bg-background/95 backdrop-blur-sm border rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold shadow-lg">
                            <Eye className="h-4 w-4 text-primary" /> Voir le produit
                        </div>
                    </div>
                    <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </Link>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{product.brand}</span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${product.inStock ? "text-emerald-600 bg-emerald-50" : "text-muted-foreground bg-muted"}`}>
                        {product.inStock ? "● En stock" : "● Épuisé"}
                    </span>
                </div>

                <Link href={`/product/${product.id}`} className="hover:text-primary transition-colors">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2">{product.name}</h3>
                </Link>

                <div className="flex items-center gap-1 text-amber-500 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-amber-400" : "fill-muted"} text-transparent`} />
                    ))}
                    <span className="font-semibold text-foreground text-xs">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews})</span>
                </div>

                <div className="mt-auto pt-3 flex items-center justify-between border-t">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold">{price} Dhs</span>
                        {product.salePrice && (
                            <span className="text-xs line-through text-muted-foreground">{product.price} Dhs</span>
                        )}
                    </div>
                    <Button
                        size="sm"
                        className="rounded-full h-9 px-4 gap-1.5 text-xs shadow-md shadow-primary/20"
                        disabled={!product.inStock}
                        onClick={handleAdd}
                        aria-label={`Ajouter ${product.name} au panier`}
                    >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {product.inStock ? "Ajouter" : "Épuisé"}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

export function ProductGrid({ products, viewMode = "grid" }: Props) {
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
                    <FontAwesomeIcon icon={faMagnifyingGlass} className="text-3xl text-muted-foreground/50" />
                </div>
                <h2 className="text-xl font-bold mb-2">Aucun produit trouvé</h2>
                <p className="text-muted-foreground max-w-xs text-sm">
                    Essayez de modifier ou supprimer certains filtres pour voir plus de produits.
                </p>
            </div>
        );
    }

    if (viewMode === "list") {
        return (
            <div className="flex flex-col gap-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} viewMode="list" />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {products.map((product, i) => (
                <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.4) }}
                >
                    <ProductCard product={product} viewMode="grid" />
                </motion.div>
            ))}
        </div>
    );
}

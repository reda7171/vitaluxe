"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    Heart, ShoppingCart, Trash2, Eye, Star, Share2,
    HeartOff, ArrowRight, Sparkles, Loader2
} from "lucide-react";
import { Button } from "../ui/button";
import { useCart } from "../../lib/context/cart-context";
import { useWishlist } from "../../lib/context/wishlist-context";
import { AccountLayout } from "./account-layout";

/* ── Mock wishlist: seed with 4 products ──────────────────────── */
const INITIAL_IDS = [1, 2, 5, 8];

const BADGE_STYLES: Record<string, string> = {
    Nouveau: "bg-primary text-primary-foreground",
    Promo: "bg-rose-500 text-white",
    "Best-seller": "bg-amber-500 text-white",
};

function WishlistCard({
    product,
    onRemove,
}: {
    product: any;
    onRemove: (id: string) => void;
}) {
    const { addItem } = useCart();
    const [added, setAdded] = useState(false);
    const [removing, setRemoving] = useState(false);

    const price = product.salePrice ?? product.price;
    const discountPct = product.salePrice
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : null;
    const inStock = true; // Vos produits ont tous un stock de 0 en DB, je force en stock temporairement
    const imgList: string[] = Array.isArray(product.images)
        ? product.images
        : typeof product.images === 'string'
            ? (() => { try { return JSON.parse(product.images); } catch { return []; } })()
            : [];
    const imgSrc = imgList[0] || product.image || "";
    const slug = product.slug || product.id;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        if (!inStock) return;
        addItem(product, 1);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    const handleRemove = () => {
        setRemoving(true);
        setTimeout(() => onRemove(String(product.id)), 300);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: removing ? 0 : 1, scale: removing ? 0.95 : 1 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.3 }}
            className="group bg-card rounded-2xl border hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden flex flex-col"
        >
            {/* Image */}
            <div className="relative aspect-[4/3] overflow-hidden bg-muted/20">
                {/* Badges */}
                {product.badge && (
                    <span className={`absolute top-3 left-3 z-10 text-xs font-bold px-2.5 py-1 rounded-md shadow ${BADGE_STYLES[product.badge]}`}>
                        {product.badge}
                    </span>
                )}
                {discountPct && (
                    <span className="absolute top-3 right-10 z-10 text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                        -{discountPct}%
                    </span>
                )}

                {/* Out of stock */}
                {!inStock && (
                    <div className="absolute inset-0 bg-background/65 backdrop-blur-[2px] z-10 flex items-center justify-center">
                        <span className="text-sm font-semibold bg-background border rounded-full px-4 py-1.5">Rupture de stock</span>
                    </div>
                )}

                {/* Added feedback */}
                <AnimatePresence>
                    {added && (
                        <motion.div
                            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            className="absolute inset-x-3 top-3 z-20 bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg text-center shadow"
                        >
                            ✓ Ajouté au panier !
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hover overlay */}
                <Link href={`/product/${slug}`} className="absolute inset-0 z-[5]">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-primary/5">
                        <div className="bg-background/95 backdrop-blur-sm border rounded-full px-4 py-2 flex items-center gap-2 text-sm font-semibold shadow-lg translate-y-2 group-hover:translate-y-0 transition-transform">
                            <Eye className="h-4 w-4 text-primary" /> Voir le produit
                        </div>
                    </div>
                    {imgSrc ? (
                        <img
                            src={imgSrc}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl">💊</div>
                    )}
                </Link>

                {/* Remove from wishlist */}
                <button
                    onClick={handleRemove}
                    className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-rose-50/80 hover:bg-rose-100 border border-rose-200 text-rose-500 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm"
                    title="Retirer des favoris"
                >
                    <HeartOff className="h-3.5 w-3.5" />
                </button>
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-4 gap-2">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">{product.brand}</span>
                    <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${inStock ? "text-emerald-600 bg-emerald-50" : "text-muted-foreground bg-muted"}`}>
                        {inStock ? "● En stock" : "● Épuisé"}
                    </span>
                </div>

                <Link href={`/product/${slug}`} className="hover:text-primary transition-colors">
                    <h3 className="font-semibold text-sm leading-snug line-clamp-2">{product.name}</h3>
                </Link>

                {/* Stars */}
                <div className="flex items-center gap-1 text-amber-400 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                    ))}
                    <span className="font-semibold text-foreground text-xs ml-0.5">{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews})</span>
                </div>

                {/* Price + Actions */}
                <div className="mt-auto pt-3 border-t flex items-center justify-between gap-2">
                    <div className="flex items-baseline gap-1.5">
                        <span className="text-lg font-extrabold">{price} Dhs</span>
                        {product.salePrice && (
                            <span className="text-xs line-through text-muted-foreground">{product.price} Dhs</span>
                        )}
                    </div>
                    <Button
                        size="sm"
                        className="rounded-full h-9 px-4 gap-1.5 text-xs shadow-md shadow-primary/20 shrink-0"
                        disabled={!inStock || added}
                        onClick={handleAdd}
                    >
                        <ShoppingCart className="h-3.5 w-3.5" />
                        {added ? "Ajouté !" : inStock ? "Ajouter" : "Épuisé"}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
}

export function WishlistPageClient() {
    const [wishlist, setWishlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toggleWishlist, clearWishlist: clearCtxWishlist } = useWishlist();

    const fetchWishlist = () => {
        fetch("/api/account/wishlist")
            .then(res => res.json())
            .then(data => {
                setWishlist(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const [dbProducts, setDbProducts] = useState<any[]>([]);

    useEffect(() => {
        fetchWishlist();
        // Charger quelques produits DB pour recommandations
        fetch("/api/products").then(r => r.json()).then(data => {
            if (Array.isArray(data)) setDbProducts(data);
        }).catch(() => {});
    }, []);

    const products = wishlist.map(w => w.product).filter(Boolean);
    const totalValue = products.reduce((sum, p) => sum + (p.salePrice ?? p.price), 0);
    const inStockCount = products.filter((p) => (p.stock ?? 1) > 0).length;

    const remove = async (productId: string) => {
        // Optimistic UI update locally for the page
        const itemToRemove = wishlist.find(w => w.productId === productId);
        if (!itemToRemove) return;
        setWishlist(prev => prev.filter(w => w.productId !== productId));

        // Use the global context to toggle (which updates `localStorage` AND the database correctly keeping navbar badge in sync)
        await toggleWishlist(productId, itemToRemove.product?.name || "Le produit");
    };

    const clearAll = async () => {
        setLoading(true);
        await Promise.all(wishlist.map(w =>
            fetch("/api/account/wishlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId: w.productId }),
            })
        ));
        fetchWishlist();
    };

    const addAllToCart = () => {
        // Géré par chaque carte. Un bouton "Add all" ajouterait tout d'un coup.
        // Optionnel à faire.
    };

    if (loading) return <AccountLayout><div className="py-32 flex justify-center text-muted-foreground"><Loader2 className="animate-spin h-6 w-6" /></div></AccountLayout>;

    return (
        <AccountLayout>
            <div className="space-y-6">
                {/* ── Header ───────────────────────────────── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-extrabold flex items-center gap-2">
                            <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                            Ma liste de souhaits
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {products.length} produit{products.length !== 1 ? "s" : ""} sauvegardé{products.length !== 1 ? "s" : ""}
                            {products.length > 0 && (
                                <span className="ml-1.5">· Valeur totale <strong>{totalValue} Dhs</strong></span>
                            )}
                        </p>
                    </div>

                    {products.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                            <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5"
                                onClick={clearAll}
                            >
                                <Trash2 className="h-3.5 w-3.5" /> Tout supprimer
                            </Button>
                            <Button
                                size="sm"
                                className="gap-1.5 shadow-sm shadow-primary/20"
                                onClick={addAllToCart}
                                disabled={inStockCount === 0}
                            >
                                <ShoppingCart className="h-3.5 w-3.5" />
                                Tout ajouter au panier
                            </Button>
                        </div>
                    )}
                </div>

                {/* ── Stats strip ──────────────────────────── */}
                {products.length > 0 && (
                    <div className="grid grid-cols-3 gap-3">
                        {[
                            { label: "Produits sauvegardés", value: products.length, color: "text-rose-600", bg: "bg-rose-50" },
                            { label: "En stock", value: inStockCount, color: "text-emerald-600", bg: "bg-emerald-50" },
                            { label: "Valeur totale", value: `${totalValue} Dhs`, color: "text-primary", bg: "bg-primary/5" },
                        ].map(({ label, value, color, bg }) => (
                            <div key={label} className={`${bg} rounded-xl px-4 py-3 text-center border`}>
                                <p className={`text-lg font-extrabold ${color}`}>{value}</p>
                                <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Product grid ─────────────────────────── */}
                {products.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        className="bg-card rounded-2xl border p-16 text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-rose-50 border-2 border-rose-100 flex items-center justify-center mx-auto mb-4">
                            <Heart className="h-9 w-9 text-rose-300" />
                        </div>
                        <h3 className="font-bold text-lg mb-1">Votre liste de souhaits est vide</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-6">
                            Ajoutez des produits à votre liste pour les retrouver facilement et passer commande plus tard.
                        </p>
                        <Button asChild className="gap-2 shadow-sm shadow-primary/20">
                            <Link href="/shop">
                                <Sparkles className="h-4 w-4" /> Explorer la boutique
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </motion.div>
                ) : (
                    <motion.div
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                    >
                        <AnimatePresence mode="popLayout">
                            {products.map((product) => (
                                <WishlistCard key={product.id} product={product} onRemove={remove} />
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}

                {/* ── Recommendations ──────────────────────── */}
                {products.length > 0 && dbProducts.length > 0 && (
                    <div className="pt-4 border-t">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Vous pourriez aussi aimer
                            </h3>
                            <Link href="/shop" className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                                Voir tout <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {dbProducts
                                .filter((p) => !wishlist.some(w => w.productId === p.id))
                                .slice(0, 4)
                                .map((product) => {
                                    const imgs = Array.isArray(product.images) ? product.images : (typeof product.images === 'string' ? (() => { try { return JSON.parse(product.images); } catch { return []; } })() : []);
                                    return (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.slug}`}
                                            className="group bg-card rounded-xl border p-3 hover:shadow-md transition-all"
                                        >
                                            <div className="aspect-square overflow-hidden rounded-lg bg-muted/20 mb-2">
                                                {imgs[0] ? (
                                                    <img
                                                        src={imgs[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-3xl">💊</div>
                                                )}
                                            </div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{product.brand}</p>
                                            <p className="text-xs font-semibold line-clamp-2 mt-0.5 leading-snug">{product.name}</p>
                                            <p className="text-sm font-extrabold mt-1">{product.salePrice ?? product.price} MAD</p>
                                        </Link>
                                    );
                                })}
                        </div>
                    </div>
                )}
            </div>
        </AccountLayout>
    );
}

"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ShoppingCart, Heart, Truck, ShieldCheck, RotateCcw, CheckCircle2, Minus, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ProductGallery } from "./product-gallery";
import { useCart } from "../../lib/context/cart-context";
import type { Product } from "../../lib/data/products";

const badgeColors: Record<string, string> = {
    Nouveau: "bg-primary text-primary-foreground",
    Promo: "bg-rose-500 text-white",
    "Best-seller": "bg-amber-500 text-white",
};

type Props = {
    product: Product;
    relatedProducts: Product[];
};

export function ProductView({ product, relatedProducts }: Props) {
    const [qty, setQty] = useState(1);
    const [addedToCart, setAddedToCart] = useState(false);
    const { addItem } = useCart();

    const isInStock = product.inStock !== undefined ? product.inStock : ((product.stock ?? 1) > 0);

    const displayPrice = product.salePrice ?? product.price;
    const discount = product.salePrice
        ? Math.round(((product.price - product.salePrice) / product.price) * 100)
        : null;

    const handleAddToCart = () => {
        addItem(product, qty);
        setAddedToCart(true);
        setTimeout(() => setAddedToCart(false), 2500);
    };

    const allImages: string[] = Array.isArray(product.images)
        ? (product.images.filter(Boolean) as string[])
        : typeof product.images === "string"
            ? [product.images]
            : product.image
                ? [product.image]
                : [];

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
            {/* Breadcrumb */}
            <nav className="text-sm text-muted-foreground mb-6 flex items-center gap-2">
                <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                <span>/</span>
                <Link href="/shop" className="hover:text-primary transition-colors">Boutique</Link>
                <span>/</span>
                <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
            </nav>

            {/* Main product section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
                {/* Gallery */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ProductGallery images={allImages} name={product.name} />
                </motion.div>

                {/* Info Panel */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="flex flex-col gap-5"
                >
                    {/* Brand + Badges */}
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold uppercase tracking-widest text-primary">
                            {product.brand}
                        </span>
                        {product.badge && (
                            <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${badgeColors[product.badge]}`}>
                                {product.badge}
                            </span>
                        )}
                        {discount && (
                            <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-rose-100 text-rose-600">
                                -{discount}%
                            </span>
                        )}
                    </div>

                    {/* Name */}
                    <h1 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight">
                        {product.name}
                    </h1>

                    {/* Rating */}
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                    key={i}
                                    className={`h-5 w-5 ${i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                                />
                            ))}
                        </div>
                        <span className="font-bold text-amber-500">{product.rating}</span>
                        <span className="text-sm text-muted-foreground">({product.reviews} avis)</span>
                    </div>

                    <Separator />

                    {/* Price */}
                    <div className="flex items-baseline gap-4">
                        <span className="text-4xl font-extrabold text-foreground">{displayPrice} Dhs</span>
                        {product.salePrice && (
                            <span className="text-xl line-through text-muted-foreground">{product.price} Dhs</span>
                        )}
                    </div>

                    {/* Description */}
                    {product.description && (
                        <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                    )}

                    {/* Benefits */}
                    {product.benefits && (
                        <ul className="space-y-2">
                            {product.benefits.map((b, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                    <span>{b}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    <Separator />

                    {/* Qty + CTA */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center border rounded-full overflow-hidden">
                                <button
                                    className="px-4 py-2.5 hover:bg-muted transition-colors disabled:opacity-40"
                                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                                    disabled={qty <= 1}
                                    aria-label="Diminuer"
                                >
                                    <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-5 text-base font-bold select-none">{qty}</span>
                                <button
                                    className="px-4 py-2.5 hover:bg-muted transition-colors disabled:opacity-40"
                                    onClick={() => setQty((q) => q + 1)}
                                    disabled={!isInStock}
                                    aria-label="Augmenter"
                                >
                                    <Plus className="h-4 w-4" />
                                </button>
                            </div>
                            <span className="text-sm text-muted-foreground">
                                {isInStock ? (
                                    <span className="text-emerald-600 font-semibold"><FontAwesomeIcon icon={faCheck} className="mr-1" />En stock</span>
                                ) : (
                                    <span className="text-rose-500 font-semibold">Rupture de stock</span>
                                )}
                            </span>
                        </div>

                        <div className="flex gap-3">
                            <Button
                                size="lg"
                                className="flex-1 h-12 text-base gap-2 shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                disabled={!isInStock}
                                onClick={handleAddToCart}
                                id="add-to-cart-btn"
                            >
                                {addedToCart ? (
                                    <><CheckCircle2 className="h-5 w-5" /> Ajouté au panier !</>
                                ) : (
                                    <><ShoppingCart className="h-5 w-5" /> Ajouter au panier</>
                                )}
                            </Button>
                            <Button
                                size="lg"
                                variant="outline"
                                className="h-12 w-12 p-0 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors"
                                aria-label="Ajouter aux favoris"
                            >
                                <Heart className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="grid grid-cols-3 gap-3 pt-2">
                        {[
                            { icon: Truck, text: "Livraison 48h" },
                            { icon: ShieldCheck, text: "Produit authentique" },
                            { icon: RotateCcw, text: "Retour 14 jours" },
                        ].map(({ icon: Icon, text }) => (
                            <div key={text} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/40 text-center">
                                <Icon className="h-5 w-5 text-primary" />
                                <span className="text-xs font-medium leading-tight">{text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Tabs: Description / Ingrédients / Avis */}
            <Tabs defaultValue="howToUse" className="mb-16">
                <TabsList className="w-full justify-start rounded-xl h-12 p-1 bg-muted/40 gap-1">
                    <TabsTrigger value="howToUse" className="rounded-lg">Mode d&apos;emploi</TabsTrigger>
                    <TabsTrigger value="ingredients" className="rounded-lg">Ingrédients</TabsTrigger>
                    <TabsTrigger value="reviews" className="rounded-lg">
                        Avis ({product.reviewList?.length ?? 0})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="howToUse" className="mt-6 bg-card rounded-2xl border p-6 leading-relaxed text-muted-foreground">
                    {product.howToUse ?? "Mode d'emploi non disponible."}
                </TabsContent>

                <TabsContent value="ingredients" className="mt-6 bg-card rounded-2xl border p-6 leading-relaxed text-muted-foreground text-sm">
                    {product.ingredients ?? "Liste des ingrédients non disponible."}
                </TabsContent>

                <TabsContent value="reviews" className="mt-6 space-y-4">
                    {product.reviewList && product.reviewList.length > 0 ? (
                        product.reviewList.map((review) => (
                            <div key={review.id} className="bg-card rounded-2xl border p-6 space-y-3">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={review.avatar}
                                            alt={review.author}
                                            className="h-10 w-10 rounded-full object-cover border"
                                        />
                                        <div>
                                            <div className="font-semibold flex items-center gap-2">
                                                {review.author}
                                                {review.verified && (
                                                    <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-medium">
                                                        ✓ Achat vérifié
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-muted-foreground">{review.date}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-10 text-muted-foreground">
                            Aucun avis pour ce produit pour l&apos;instant.
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold mb-6">Produits similaires</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {relatedProducts.map((p) => (
                            <Link
                                key={p.id}
                                href={`/product/${p.id}`}
                                className="group flex flex-col rounded-2xl border bg-card hover:shadow-lg transition-all overflow-hidden"
                            >
                                <div className="aspect-square overflow-hidden bg-muted/20">
                                    <img
                                        src={p.image}
                                        alt={p.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-3 space-y-1">
                                    <span className="text-xs font-bold text-primary">{p.brand}</span>
                                    <p className="text-sm font-semibold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                        {p.name}
                                    </p>
                                    <p className="font-bold">{p.salePrice ?? p.price} Dhs</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
}

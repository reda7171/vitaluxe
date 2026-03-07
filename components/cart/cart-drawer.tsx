"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShoppingCart, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/lib/context/cart-context";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

export function CartDrawer() {
    const { items, isOpen, closeCart, removeItem, updateQty, totalItems, totalPrice } = useCart();
    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        fetch("/api/settings").then(r => r.json()).then(d => setSettings(d));
    }, []);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [closeCart]);

    const freeAbove = Number(settings?.livraison?.freeAbove ?? 500);
    const standardCost = Number(settings?.livraison?.standardCost ?? 35);
    const shipping = totalPrice >= freeAbove ? 0 : standardCost;
    const grandTotal = totalPrice + shipping;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                        onClick={closeCart}
                        aria-hidden="true"
                    />

                    {/* Drawer */}
                    <motion.aside
                        key="drawer"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed right-0 top-0 z-50 h-full w-full max-w-md flex flex-col bg-background shadow-2xl"
                        aria-label="Panier"
                        role="dialog"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 py-5 border-b">
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="h-5 w-5 text-primary" />
                                <h2 className="text-lg font-bold">Votre Panier</h2>
                                {totalItems > 0 && (
                                    <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                                        {totalItems}
                                    </span>
                                )}
                            </div>
                            <Button variant="ghost" size="icon" onClick={closeCart} aria-label="Fermer le panier">
                                <X className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4 py-16 text-center">
                                    <ShoppingBag className="h-20 w-20 text-muted-foreground/20" />
                                    <h3 className="text-xl font-bold text-muted-foreground">Votre panier est vide</h3>
                                    <p className="text-sm text-muted-foreground/70 max-w-xs">
                                        Explorez notre boutique et ajoutez des produits pour commencer votre commande.
                                    </p>
                                    <Button onClick={closeCart} asChild className="mt-2 gap-2">
                                        <Link href="/shop">
                                            Découvrir la boutique <ArrowRight className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {items.map((item) => {
                                        const price = item.product.salePrice ?? item.product.price;
                                        const imageSrc = item.product.image || (Array.isArray(item.product.images) ? item.product.images[0] : (typeof item.product.images === "string" ? (() => { try { return JSON.parse(item.product.images)[0] || ""; } catch { return ""; } })() : ""));
                                        return (
                                            <motion.div
                                                key={item.product.id}
                                                layout
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.25 }}
                                                className="flex gap-4 py-3 border-b last:border-b-0"
                                            >
                                                {/* Product image */}
                                                <Link
                                                    href={`/product/${item.product.id}`}
                                                    onClick={closeCart}
                                                    className="shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-muted/30 border"
                                                >
                                                    <img
                                                        src={imageSrc}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                                                    />
                                                </Link>

                                                {/* Info */}
                                                <div className="flex flex-col flex-1 min-w-0 gap-1">
                                                    <span className="text-xs font-bold text-primary truncate">
                                                        {item.product.brand}
                                                    </span>
                                                    <Link
                                                        href={`/product/${item.product.id}`}
                                                        onClick={closeCart}
                                                        className="text-sm font-semibold line-clamp-2 leading-snug hover:text-primary transition-colors"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                    <div className="flex items-center justify-between mt-auto pt-2">
                                                        {/* Qty controls */}
                                                        <div className="flex items-center gap-1 border rounded-full text-sm">
                                                            <button
                                                                onClick={() => updateQty(item.product.id, item.quantity - 1)}
                                                                className="px-2.5 py-1 hover:bg-muted rounded-full transition-colors"
                                                                aria-label="Diminuer"
                                                            >
                                                                <Minus className="h-3 w-3" />
                                                            </button>
                                                            <span className="px-2 font-bold">{item.quantity}</span>
                                                            <button
                                                                onClick={() => updateQty(item.product.id, item.quantity + 1)}
                                                                className="px-2.5 py-1 hover:bg-muted rounded-full transition-colors"
                                                                aria-label="Augmenter"
                                                            >
                                                                <Plus className="h-3 w-3" />
                                                            </button>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <span className="font-bold text-base">
                                                                {(price * item.quantity).toFixed(0)} Dhs
                                                            </span>
                                                            <button
                                                                onClick={() => removeItem(item.product.id)}
                                                                className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded-md hover:bg-destructive/10"
                                                                aria-label="Supprimer"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </AnimatePresence>
                            )}
                        </div>

                        {/* Footer (only if items exist) */}
                        {items.length > 0 && (
                            <div className="px-6 py-5 border-t space-y-4 bg-card/50">
                                {/* Shipping progress */}
                                {totalPrice < freeAbove && (
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between text-muted-foreground">
                                            <span>Livraison gratuite à partir de {freeAbove} Dhs</span>
                                            <span className="font-semibold text-foreground">{freeAbove - totalPrice} Dhs restant</span>
                                        </div>
                                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-primary rounded-full"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min((totalPrice / freeAbove) * 100, 100)}%` }}
                                                transition={{ duration: 0.5 }}
                                            />
                                        </div>
                                    </div>
                                )}
                                {totalPrice >= freeAbove && (
                                    <p className="text-sm text-emerald-600 font-semibold text-center">
                                        <FontAwesomeIcon icon={faCircleCheck} className="mr-1.5" />Vous bénéficiez de la livraison gratuite !
                                    </p>
                                )}

                                <Separator />

                                {/* Totals */}
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Sous-total</span>
                                        <span>{totalPrice} Dhs</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Livraison</span>
                                        <span className={shipping === 0 ? "text-emerald-600 font-semibold" : ""}>
                                            {shipping === 0 ? "Gratuite" : `${shipping} Dhs`}
                                        </span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-base pt-1">
                                        <span>Total</span>
                                        <span>{grandTotal} Dhs</span>
                                    </div>
                                </div>

                                {/* CTA */}
                                <Button
                                    size="lg"
                                    className="w-full h-12 text-base gap-2 shadow-lg shadow-primary/20"
                                    asChild
                                >
                                    <Link href="/checkout" onClick={closeCart}>
                                        Passer la commande <ArrowRight className="h-5 w-5" />
                                    </Link>
                                </Button>
                                <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={closeCart} asChild>
                                    <Link href="/shop" onClick={closeCart}>
                                        Continuer mes achats
                                    </Link>
                                </Button>
                            </div>
                        )}
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X, Tag, Sparkles, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROMO_CODE = "VITALUXE20";
const STORAGE_KEY = "vx_promo_dismissed";
const SHOW_DELAY_MS = 1800;

export function PromoPopup() {
    const [visible, setVisible] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        // Afficher seulement si pas déjà fermé dans la session
        const dismissed = sessionStorage.getItem(STORAGE_KEY);
        if (dismissed) return;

        const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
        return () => clearTimeout(timer);
    }, []);

    const dismiss = () => {
        setVisible(false);
        sessionStorage.setItem(STORAGE_KEY, "1");
    };

    const copyCode = () => {
        navigator.clipboard.writeText(PROMO_CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <AnimatePresence>
            {visible && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={dismiss}
                        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
                    />

                    {/* Popup */}
                    <motion.div
                        key="popup"
                        initial={{ opacity: 0, scale: 0.88, y: 40 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: "spring", stiffness: 320, damping: 28 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div className="relative w-full max-w-3xl pointer-events-auto overflow-hidden rounded-3xl shadow-2xl flex flex-col md:flex-row">

                            {/* Close */}
                            <button
                                onClick={dismiss}
                                className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 md:bg-white/20 md:hover:bg-white/30 flex items-center justify-center text-white transition-colors"
                                aria-label="Fermer"
                                id="promo-popup-close"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            {/* Image side */}
                            <div className="hidden sm:block sm:w-2/5 md:w-1/2 relative bg-gray-100 min-h-[400px]">
                                <img
                                    src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=1000&auto=format&fit=crop"
                                    alt="Offre exclusive Vitaluxe"
                                    className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#103178] to-transparent/30 mix-blend-multiply" />
                            </div>

                            {/* Content side */}
                            <div className="bg-gradient-to-br from-[#103178] via-[#1a4fa0] to-[#2d6a4f] px-6 sm:px-8 py-10 text-white text-center w-full sm:w-3/5 md:w-1/2 flex flex-col justify-center">

                                {/* Badge */}
                                <motion.div
                                    initial={{ scale: 0, rotate: -15 }}
                                    animate={{ scale: 1, rotate: 0 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
                                    className="inline-flex mx-auto items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5"
                                >
                                    <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
                                    Offre exclusive
                                </motion.div>

                                {/* Discount circle */}
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
                                    className="mx-auto w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-white/10 border-4 border-white/30 flex flex-col items-center justify-center mb-5"
                                >
                                    <span className="text-4xl sm:text-5xl font-black leading-none tracking-tight">-20%</span>
                                    <span className="text-[10px] sm:text-xs font-semibold opacity-80 mt-0.5">sur tout</span>
                                </motion.div>

                                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-2">
                                    Bienvenue chez Vitaluxe !
                                </h2>
                                <p className="text-sm text-white/75 mb-6 px-4 sm:px-0">
                                    Profitez de <strong className="text-white">20% de réduction</strong> sur votre première commande avec le code ci-dessous.
                                </p>

                                {/* Promo code box */}
                                <div
                                    onClick={copyCode}
                                    className="flex items-center justify-between bg-white/10 border-2 border-dashed border-white/40 rounded-xl px-4 py-3 mb-6 cursor-pointer hover:bg-white/20 transition-colors group"
                                    title="Cliquer pour copier"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <Tag className="h-4 w-4 text-yellow-300 shrink-0" />
                                        <span className="font-black text-lg tracking-widest">{PROMO_CODE}</span>
                                    </div>
                                    <span className={`text-xs font-bold transition-all ${copied ? "text-emerald-300" : "text-white/60 group-hover:text-white"}`}>
                                        {copied ? "✓ Copié !" : "Copier"}
                                    </span>
                                </div>

                                {/* Expiry */}
                                <div className="flex items-center justify-center gap-1.5 text-xs text-white/55 mb-6">
                                    <Clock className="h-3.5 w-3.5" />
                                    Offre valable jusqu&apos;au 31 Mars 2026
                                </div>

                                {/* CTA */}
                                <div className="flex flex-col gap-2">
                                    <Link href="/shop" onClick={dismiss}>
                                        <Button
                                            className="w-full h-11 bg-white text-[#103178] hover:bg-white/90 font-bold text-sm shadow-lg"
                                            id="promo-popup-shop-btn"
                                        >
                                            En profiter maintenant
                                        </Button>
                                    </Link>
                                    <button
                                        onClick={dismiss}
                                        className="text-xs text-white/50 hover:text-white/80 transition-colors py-1 mt-1"
                                    >
                                        Non merci, ignorer l&apos;offre
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

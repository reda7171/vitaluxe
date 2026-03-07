"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";
import { CheckCircle2, Package, ArrowRight, ShoppingBag, Home } from "lucide-react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

function SuccessContent() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const orderId = searchParams.get("orderId");

    useEffect(() => {
        // Clear cart on success
        clearCart();
        // Fire confetti
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.5 }, colors: ["#103178", "#2d6a4f", "#fbbf24", "#ffffff"] });
    }, []);

    return (
        <main className="min-h-screen bg-gradient-to-br from-[#f0f7f4] to-[#e8f4ff] flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}
                    className="w-24 h-24 rounded-full bg-[#2d6a4f] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-[#2d6a4f]/30">
                    <CheckCircle2 size={48} className="text-white" />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                    <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Commande confirmée !</h1>
                    <p className="text-slate-500 mb-2">
                        Merci pour votre confiance. Votre commande a bien été reçue et est en cours de préparation.
                    </p>
                    {orderId && (
                        <p className="text-sm font-mono bg-slate-100 text-slate-600 inline-block px-3 py-1.5 rounded-lg mb-6">
                            #{orderId.slice(0, 8).toUpperCase()}
                        </p>
                    )}

                    {/* Timeline */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 mb-8 text-left">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-4">Ce qui se passe maintenant</p>
                        <div className="space-y-3">
                            {[
                                { icon: "📧", text: "Un email de confirmation vous a été envoyé" },
                                { icon: "📦", text: "Préparation de votre colis sous 24h" },
                                { icon: "🚚", text: "Livraison sous 24-48h à Rabat, 2-4j ailleurs" },
                            ].map((step, i) => (
                                <div key={i} className="flex items-center gap-3 text-sm text-slate-600">
                                    <span className="text-xl">{step.icon}</span>
                                    <span>{step.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        {orderId && (
                            <Link href={`/account/orders/${orderId}`}
                                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#103178] text-white rounded-xl font-semibold text-sm hover:bg-[#0d266b] transition-colors shadow-lg shadow-[#103178]/20">
                                <Package size={16} /> Suivre ma commande
                            </Link>
                        )}
                        <Link href="/shop"
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
                            <ShoppingBag size={16} /> Continuer mes achats
                        </Link>
                        <Link href="/"
                            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold text-sm hover:bg-slate-50 transition-colors">
                            <Home size={16} /> Accueil
                        </Link>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense>
            <SuccessContent />
        </Suspense>
    );
}

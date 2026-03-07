"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import type { Metadata } from "next";

const FAQS = [
    {
        cat: "Commandes & Livraison",
        items: [
            { q: "Quels sont les délais de livraison ?", a: "Livraison sous 24-48h à Rabat-Salé-Kénitra, et 2-4 jours ouvrables pour les autres villes du Maroc." },
            { q: "La livraison est-elle gratuite ?", a: "Livraison gratuite à Rabat à partir de 350 MAD et dans les autres villes à partir de 600 MAD." },
            { q: "Comment suivre ma commande ?", a: "Connectez-vous à votre espace client → Mes Commandes. Vous y trouverez le statut en temps réel et la timeline de livraison." },
            { q: "Puis-je modifier ou annuler ma commande ?", a: "Vous pouvez annuler dans les 2 heures suivant la commande via votre espace client ou en nous contactant par WhatsApp." },
        ],
    },
    {
        cat: "Produits & Authenticité",
        items: [
            { q: "Les produits sont-ils authentiques ?", a: "100% garantis authentiques. Nous nous approvisionnons directement auprès des laboratoires et distributeurs officiels." },
            { q: "Comment vérifier la date de péremption ?", a: "Toutes nos commandes incluent les dates de péremption clairement visibles. Nous ne vendons jamais de produits périmés." },
            { q: "Proposez-vous des conseils pharmaceutiques ?", a: "Oui. Notre équipe de pharmaciens répond à vos questions via le chat ou par email sous 4h en jours ouvrables." },
        ],
    },
    {
        cat: "Paiement & Sécurité",
        items: [
            { q: "Quels modes de paiement acceptez-vous ?", a: "Carte bancaire (Visa, Mastercard via Stripe), PayPal, et paiement à la livraison (espèces)." },
            { q: "Mon paiement est-il sécurisé ?", a: "Oui. Toutes les transactions sont chiffrées SSL et traitées par Stripe (certifié PCI DSS niveau 1)." },
            { q: "Puis-je utiliser un code promo ?", a: "Oui ! Entrez votre code dans le récapitulatif de commande au moment du checkout." },
        ],
    },
    {
        cat: "Retours & Remboursements",
        items: [
            { q: "Quelle est votre politique de retour ?", a: "Retour accepté sous 14 jours si le produit est non-ouvert et dans son emballage d'origine. Contactez-nous pour initier le retour." },
            { q: "Combien de temps pour un remboursement ?", a: "3-5 jours ouvrables après réception du retour. Le remboursement est effectué sur le même moyen de paiement." },
        ],
    },
];

export default function FAQPage() {
    const [open, setOpen] = useState<string | null>(null);

    return (
        <main className="min-h-screen bg-slate-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#103178] to-[#1a4db8] py-20 px-6 text-center text-white">
                <div className="max-w-2xl mx-auto">
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-6">
                        <HelpCircle size={32} />
                    </div>
                    <h1 className="text-4xl font-extrabold mb-4">Questions fréquentes</h1>
                    <p className="text-blue-200 text-lg">Trouvez rapidement les réponses à vos questions</p>
                </div>
            </section>

            <div className="max-w-3xl mx-auto px-4 py-16 space-y-12">
                {FAQS.map((section) => (
                    <div key={section.cat}>
                        <h2 className="text-lg font-bold text-[#103178] mb-4 pb-2 border-b border-[#103178]/20">
                            {section.cat}
                        </h2>
                        <div className="space-y-3">
                            {section.items.map((faq) => {
                                const id = `${section.cat}-${faq.q}`;
                                const isOpen = open === id;
                                return (
                                    <div key={id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                                        <button
                                            onClick={() => setOpen(isOpen ? null : id)}
                                            className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
                                        >
                                            <span className="font-semibold text-slate-800 text-sm pr-4">{faq.q}</span>
                                            <ChevronDown size={18} className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                                        </button>
                                        <AnimatePresence>
                                            {isOpen && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                                                        {faq.a}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* CTA */}
                <div className="bg-gradient-to-br from-[#103178] to-[#1a4db8] rounded-2xl p-8 text-white text-center">
                    <h3 className="text-xl font-bold mb-2">Vous avez d&apos;autres questions ?</h3>
                    <p className="text-blue-200 text-sm mb-5">Notre équipe est disponible du lundi au samedi, 9h-18h</p>
                    <a href="/contact"
                        className="inline-block bg-white text-[#103178] font-bold px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors text-sm">
                        Contacter le support →
                    </a>
                </div>
            </div>
        </main>
    );
}

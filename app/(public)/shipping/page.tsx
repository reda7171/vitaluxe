import type { Metadata } from "next";
import Link from "next/link";
import {
    Truck, RotateCcw, Clock, MapPin, Package, ShieldCheck,
    CheckCircle2, AlertCircle, Phone, Mail
} from "lucide-react";

export const metadata: Metadata = {
    title: "Livraison & Retours | Vitaluxe",
    description: "Tout savoir sur la livraison au Maroc, les délais, les frais et notre politique de retour sous 14 jours.",
    keywords: "livraison maroc, retour produit, remboursement, délais livraison, frais port",
};

const ZONES = [
    { zone: "Casablanca & Rabat", delay: "24h", price: "Gratuite dès 500 Dhs · 25 Dhs sinon", icon: "🏙️" },
    { zone: "Grandes villes (Marrakech, Fès, Tanger...)", delay: "24–48h", price: "Gratuite dès 500 Dhs · 35 Dhs sinon", icon: "🌆" },
    { zone: "Autres villes & régions", delay: "48–72h", price: "Gratuite dès 500 Dhs · 45 Dhs sinon", icon: "📦" },
];

const RETURN_STEPS = [
    { step: "1", title: "Contactez-nous", desc: "Par email ou formulaire de contact dans les 14 jours suivant la réception.", icon: Mail },
    { step: "2", title: "Validation", desc: "Notre équipe valide votre demande sous 24h et vous envoie une étiquette de retour.", icon: CheckCircle2 },
    { step: "3", title: "Expédition", desc: "Renvoyez le produit non ouvert dans son emballage d'origine.", icon: Package },
    { step: "4", title: "Remboursement", desc: "Remboursement complet sous 5–7 jours ouvrés après réception.", icon: ShieldCheck },
];

export default function ShippingPage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-blue-50/30 border-b">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">Livraison & Retours</span>
                    </nav>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                            <Truck className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Livraison & Retours</h1>
                    </div>
                    <p className="text-muted-foreground text-lg max-w-xl">
                        Livraison rapide partout au Maroc et retours simples sous 14 jours.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-14">

                {/* Delivery zones */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-extrabold">Zones & délais de livraison</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {ZONES.map(({ zone, delay, price, icon }) => (
                            <div key={zone} className="bg-card rounded-2xl border p-6 hover:shadow-md transition-shadow space-y-3">
                                <div className="text-3xl">{icon}</div>
                                <h3 className="font-bold">{zone}</h3>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-primary shrink-0" />
                                    <span className="font-semibold text-primary">{delay}</span>
                                </div>
                                <div className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <Truck className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                                    <span>{price}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Free shipping banner */}
                    <div className="mt-5 bg-gradient-to-r from-primary/10 to-blue-500/10 border border-primary/20 rounded-2xl p-5 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                            <ShieldCheck className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="font-bold text-primary">Livraison GRATUITE dès 500 Dhs d'achat</p>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                Valable dans toutes les zones du Maroc. Profitez-en sur toute la boutique !
                            </p>
                        </div>
                    </div>
                </section>

                {/* Order processing */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Clock className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-extrabold">Traitement des commandes</h2>
                    </div>
                    <div className="bg-card rounded-2xl border divide-y">
                        {[
                            { label: "Délai de traitement", value: "Commandes traitées en 2–4h les jours ouvrés" },
                            { label: "Jours ouvrés", value: "Lundi au Samedi (hors jours fériés marocains)" },
                            { label: "Commande avant 12h", value: "Expédition le jour même pour Casa & Rabat" },
                            { label: "Confirmation", value: "Email avec numéro de suivi dès l'expédition" },
                            { label: "Suivi en temps réel", value: "Disponible dans votre espace client" },
                        ].map(({ label, value }) => (
                            <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-0 px-5 py-4">
                                <span className="text-sm font-semibold sm:w-64 shrink-0">{label}</span>
                                <span className="text-sm text-muted-foreground">{value}</span>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Returns */}
                <section>
                    <div className="flex items-center gap-2 mb-2">
                        <RotateCcw className="h-5 w-5 text-primary" />
                        <h2 className="text-2xl font-extrabold">Politique de retour</h2>
                    </div>
                    <p className="text-muted-foreground mb-8">
                        Vous avez <strong>14 jours</strong> après réception pour retourner un produit non ouvert et dans son emballage d'origine.
                    </p>

                    {/* Steps */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                        {RETURN_STEPS.map(({ step, title, desc, icon: Icon }) => (
                            <div key={step} className="bg-card rounded-2xl border p-5 space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-extrabold shrink-0">
                                        {step}
                                    </div>
                                    <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <h3 className="font-bold text-sm">{title}</h3>
                                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Non-returnable */}
                    <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                        <div className="flex items-start gap-3">
                            <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-amber-800 mb-2">Produits non éligibles au retour</p>
                                <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                                    <li>Produits ouverts ou utilisés</li>
                                    <li>Compléments alimentaires (pour des raisons d'hygiène)</li>
                                    <li>Produits personnalisés ou sur commande spéciale</li>
                                    <li>Articles en promotion soldés indiqués "Vente finale"</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact CTA */}
                <section className="bg-gradient-to-br from-primary/8 to-blue-50/40 border rounded-3xl p-8 text-center">
                    <h3 className="text-xl font-extrabold mb-2">Une question sur votre livraison ?</h3>
                    <p className="text-muted-foreground mb-6">Notre équipe est disponible Lun–Sam de 9h à 19h.</p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a href="tel:+212512345678" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
                            <Phone className="h-4 w-4" /> +212 5 12 34 56 78
                        </a>
                        <Link href="/contact" className="flex items-center gap-2 bg-card border px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-muted transition-colors">
                            <Mail className="h-4 w-4" /> Formulaire de contact
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Shield, ShoppingCart, Truck, RefreshCw, Mail } from "lucide-react";

export const metadata: Metadata = {
    title: "Conditions Générales de Vente | Vitaluxe",
    description: "Consultez les conditions générales de vente de Vitaluxe : commandes, paiement, livraison, retours, garanties et protection de vos données.",
    keywords: "CGV, conditions générales, politique vente, Vitaluxe",
};

const SECTIONS = [
    {
        id: "objet",
        icon: FileText,
        title: "1. Objet",
        content: `Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des ventes en ligne réalisées via le site Vitaluxe.ma. En passant une commande, le client accepte sans réserve l'intégralité des présentes conditions. Vitaluxe se réserve le droit de modifier ces CGV à tout moment ; les modifications seront applicables dès leur mise en ligne.`,
    },
    {
        id: "produits",
        icon: ShoppingCart,
        title: "2. Produits & disponibilité",
        content: `Tous les produits proposés sur Vitaluxe sont authentiques et directement approvisionnés auprès de distributeurs officiels ou laboratoires partenaires. Les photos des produits sont fournies à titre indicatif et peuvent légèrement différer du produit réel. Vitaluxe s'engage à mettre à jour les disponibilités en temps réel ; toutefois, en cas d'indisponibilité après validation de commande, le client sera notifié et pourra choisir un produit de remplacement ou obtenir un remboursement complet.`,
    },
    {
        id: "commandes",
        icon: FileText,
        title: "3. Commandes",
        content: `La passation d'une commande est définitive après confirmation par email. Vitaluxe se réserve le droit d'annuler toute commande présentant des signes de fraude ou en cas d'erreur manifeste de prix. Le client peut annuler ou modifier sa commande dans un délai de 2 heures suivant la confirmation, en contactant notre service client. Passé ce délai, la commande est en cours de traitement et ne peut plus être modifiée.`,
    },
    {
        id: "prix",
        icon: ShoppingCart,
        title: "4. Prix & paiement",
        content: `Les prix sont indiqués en Dirhams marocains (MAD / Dhs) taxes comprises. Vitaluxe se réserve le droit de modifier ses prix à tout moment, sans préavis. Les modes de paiement acceptés sont : carte bancaire (Visa, Mastercard), PayPal, et paiement à la livraison (COD) pour les commandes éligibles. Toutes les transactions sont sécurisées par chiffrement SSL 256 bits.`,
    },
    {
        id: "livraison",
        icon: Truck,
        title: "5. Livraison",
        content: `La livraison est effectuée partout au Maroc via nos partenaires logistiques agréés. Les délais sont à titre indicatif : 24h pour Casablanca et Rabat, 24–48h pour les grandes villes, 48–72h pour les autres régions. La livraison est gratuite pour toute commande supérieure ou égale à 500 Dhs. En cas de retard de livraison, le client sera informé et pourra exercer son droit d'annulation si le délai dépasse 7 jours ouvrés.`,
    },
    {
        id: "retours",
        icon: RefreshCw,
        title: "6. Retours & remboursements",
        content: `Conformément à la législation marocaine en vigueur, le client dispose d'un délai de 14 jours à compter de la réception pour retourner tout produit non ouvert et dans son emballage d'origine. Les frais de retour sont pris en charge par Vitaluxe si le retour est dû à une erreur de notre part ou à un produit défectueux. Le remboursement sera effectué dans un délai de 5 à 7 jours ouvrés après réception et inspection du retour.`,
    },
    {
        id: "donnees",
        icon: Shield,
        title: "7. Protection des données",
        content: `Vitaluxe s'engage à protéger vos données personnelles conformément aux lois en vigueur. Les informations collectées (nom, email, adresse, téléphone) sont utilisées exclusivement pour le traitement de vos commandes et l'amélioration de nos services. Vos données ne sont ni vendues ni cédées à des tiers sans votre consentement explicite. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données en contactant privacy@vitaluxe.ma.`,
    },
    {
        id: "litiges",
        icon: Shield,
        title: "8. Litiges",
        content: `En cas de litige, le client est invité à contacter le service client de Vitaluxe en première instance. En l'absence de résolution amiable dans un délai de 30 jours, le litige sera soumis aux tribunaux compétents du ressort de Casablanca, Maroc. Les présentes CGV sont régies par le droit marocain.`,
    },
];

export default function TermsPage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-blue-50/30 border-b">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10">
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                        <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                        <span>/</span>
                        <span className="text-foreground font-medium">Conditions Générales</span>
                    </nav>
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <h1 className="text-4xl font-extrabold tracking-tight">Conditions Générales de Vente</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Dernière mise à jour : <strong>3 Mars 2026</strong>
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col lg:flex-row gap-10">

                    {/* Sticky table of contents */}
                    <aside className="lg:w-56 shrink-0">
                        <div className="lg:sticky lg:top-24 bg-card rounded-2xl border p-5">
                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Sommaire</p>
                            <nav className="space-y-1">
                                {SECTIONS.map(({ id, title }) => (
                                    <a
                                        key={id}
                                        href={`#${id}`}
                                        className="block text-sm text-muted-foreground hover:text-primary hover:bg-muted/50 px-3 py-1.5 rounded-lg transition-colors"
                                    >
                                        {title.split(". ")[1]}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-1 min-w-0 space-y-8">
                        {/* Intro box */}
                        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-start gap-4">
                            <Shield className="h-6 w-6 text-primary shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Ces conditions générales de vente s'appliquent à toutes les commandes passées sur <strong>vitaluxe.ma</strong>. Nous vous invitons à les lire attentivement avant de procéder à tout achat.
                            </p>
                        </div>

                        {SECTIONS.map(({ id, icon: Icon, title, content }) => (
                            <section key={id} id={id} className="bg-card rounded-2xl border p-6 scroll-mt-24">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                        <Icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <h2 className="font-extrabold text-lg">{title}</h2>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{content}</p>
                            </section>
                        ))}

                        {/* Contact */}
                        <div className="bg-card rounded-2xl border p-6 text-center space-y-3">
                            <h3 className="font-bold">Des questions sur nos CGV ?</h3>
                            <p className="text-sm text-muted-foreground">Notre équipe est disponible pour répondre à toutes vos questions juridiques ou commerciales.</p>
                            <Link
                                href="/contact"
                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
                            >
                                <Mail className="h-4 w-4" /> Nous contacter
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

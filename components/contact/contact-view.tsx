"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Phone, Mail, MapPin, Clock, Send, CheckCircle2, Loader2,
    MessageCircle, HelpCircle, Package, RotateCcw, ShieldCheck
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useSiteLayout } from "../../lib/hooks/use-site-layout";

const SUBJECTS = [
    "Ma commande",
    "Retour & Remboursement",
    "Produit / Conseil",
    "Problème de livraison",
    "Compte client",
    "Autre",
];

const FAQ_ITEMS = [
    {
        icon: Package,
        q: "Quels sont les délais de livraison ?",
        a: "Nous livrons en 24-48h en jours ouvrés partout au Maroc. Pour Casablanca et Rabat, une livraison le jour-même est possible pour les commandes passées avant 12h.",
    },
    {
        icon: RotateCcw,
        q: "Comment effectuer un retour ?",
        a: "Vous disposez de 14 jours après réception pour retourner un produit non ouvert. Contactez-nous par email ou via ce formulaire et nous organisons le retour gratuitement.",
    },
    {
        icon: ShieldCheck,
        q: "Les produits sont-ils 100% authentiques ?",
        a: "Oui, tous nos produits sont directement approvisionnés auprès des distributeurs officiels et laboratoires partenaires. Chaque produit est garanti d'origine.",
    },
    {
        icon: HelpCircle,
        q: "Puis-je annuler ou modifier ma commande ?",
        a: "Vous pouvez annuler ou modifier votre commande dans un délai de 2 heures après validation. Passé ce délai, contactez-nous dès que possible.",
    },
];

export default function ContactPageClient() {
    const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
    const [errors, setErrors] = useState<Partial<typeof form>>({});
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const { settings } = useSiteLayout();
    const whatsappNumber = settings.header?.whatsapp || "212512345678";

    const update = (k: keyof typeof form, v: string) => {
        setForm((p) => ({ ...p, [k]: v }));
        setErrors((p) => ({ ...p, [k]: undefined }));
    };

    const validate = () => {
        const e: Partial<typeof form> = {};
        if (!form.name.trim()) e.name = "Nom requis";
        if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide";
        if (!form.subject) e.subject = "Choisissez un sujet";
        if (form.message.trim().length < 20) e.message = "Message trop court (min. 20 caractères)";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (!res.ok) throw new Error("Erreur");
            setSent(true);
        } catch (error) {
            console.error(error);
            // On peut éventuellement afficher une erreur toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen">
            {/* ── Page Header ─────────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-blue-50/30 border-b">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />
                <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                    >
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                            <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
                            <span>/</span>
                            <span className="text-foreground font-medium">Contact</span>
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
                                <MessageCircle className="h-6 w-6 text-primary" />
                            </div>
                            <h1 className="text-4xl font-extrabold tracking-tight">Contactez-nous</h1>
                        </div>
                        <p className="text-muted-foreground text-lg max-w-xl leading-relaxed">
                            Notre équipe de pharmaciens et experts beauté est disponible pour répondre à toutes vos questions.
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* ── Left: Info + FAQ ─────────────────────────────────────────────── */}
                    <div className="space-y-8">
                        {/* Contact cards */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
                            className="space-y-4"
                        >
                            <h2 className="text-lg font-bold">Nos coordonnées</h2>

                            {[
                                {
                                    icon: Phone, label: "Téléphone", value: "+212 5 12 34 56 78",
                                    sub: "Lun–Sam, 9h–19h", href: "tel:+212512345678", color: "bg-blue-500/10 text-blue-600",
                                },
                                {
                                    icon: Mail, label: "Email", value: "contact@vitaluxe.ma",
                                    sub: "Réponse sous 24h", href: "mailto:contact@vitaluxe.ma", color: "bg-emerald-500/10 text-emerald-600",
                                },
                                {
                                    icon: MapPin, label: "Adresse", value: "123 Avenue de la Beauté, Casablanca",
                                    sub: "Maroc 20000", href: "https://maps.google.com", color: "bg-rose-500/10 text-rose-600",
                                },
                                {
                                    icon: Clock, label: "Horaires", value: "Lun–Sam : 9h → 19h",
                                    sub: "Dimanche : Fermé", href: null, color: "bg-amber-500/10 text-amber-600",
                                },
                            ].map(({ icon: Icon, label, value, sub, href, color }) => (
                                <div
                                    key={label}
                                    className="flex items-start gap-4 bg-card rounded-2xl border p-4 hover:shadow-md transition-all group"
                                >
                                    <div className={`w-11 h-11 rounded-xl ${color} flex items-center justify-center shrink-0`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p>
                                        {href ? (
                                            <a href={href} target="_blank" rel="noopener noreferrer"
                                                className="text-sm font-semibold mt-0.5 hover:text-primary transition-colors block truncate">
                                                {value}
                                            </a>
                                        ) : (
                                            <p className="text-sm font-semibold mt-0.5">{value}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* WhatsApp CTA */}
                        <motion.a
                            href={`https://wa.me/${whatsappNumber}?text=Bonjour%20Vitaluxe%2C%20j'ai%20une%20question.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.25 }}
                            className="flex items-center gap-4 bg-emerald-500 text-white rounded-2xl p-5 hover:bg-emerald-600 transition-colors group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                                <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.569-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-bold text-sm">Chat WhatsApp</p>
                                <p className="text-white/80 text-xs">Réponse en quelques minutes</p>
                            </div>
                            <div className="ml-auto text-white/60 group-hover:translate-x-1 transition-transform">→</div>
                        </motion.a>

                        {/* Social media */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
                            className="space-y-3"
                        >
                            <h2 className="text-lg font-bold">Suivez-nous</h2>
                            <div className="flex gap-3">
                                <a
                                    href="https://www.facebook.com/vitaluxema"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 flex-1 bg-card rounded-xl border p-3 hover:shadow-md hover:border-blue-300 transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center shrink-0">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                    </div>
                                    <span className="text-sm font-semibold">Facebook</span>
                                </a>
                                <a
                                    href="https://www.instagram.com/vitaluxema"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 flex-1 bg-card rounded-xl border p-3 hover:shadow-md hover:border-pink-300 transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-pink-500/10 text-pink-600 flex items-center justify-center shrink-0">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                                    </div>
                                    <span className="text-sm font-semibold">Instagram</span>
                                </a>
                                <a
                                    href="https://www.tiktok.com/@vitaluxema"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 flex-1 bg-card rounded-xl border p-3 hover:shadow-md hover:border-slate-400 transition-all group"
                                >
                                    <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z"/></svg>
                                    </div>
                                    <span className="text-sm font-semibold">TikTok</span>
                                </a>
                            </div>
                        </motion.div>

                        {/* FAQ */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.35 }}
                            className="space-y-3"
                        >
                            <h2 className="text-lg font-bold">Questions fréquentes</h2>
                            {FAQ_ITEMS.map(({ icon: Icon, q, a }) => (
                                <details key={q} className="group bg-card rounded-xl border overflow-hidden">
                                    <summary className="flex items-center gap-3 p-4 cursor-pointer list-none font-medium text-sm hover:bg-muted/40 transition-colors">
                                        <Icon className="h-4 w-4 text-primary shrink-0" />
                                        <span className="flex-1">{q}</span>
                                        <span className="text-muted-foreground group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                                    </summary>
                                    <div className="px-4 pb-4 pt-0">
                                        <p className="text-sm text-muted-foreground leading-relaxed pl-7">{a}</p>
                                    </div>
                                </details>
                            ))}
                        </motion.div>
                    </div>

                    {/* ── Right: Contact Form ──────────────────────────────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }}
                        className="lg:col-span-2"
                    >
                        <div className="bg-card rounded-3xl border shadow-lg p-8 md:p-10">
                            {sent ? (
                                /* Success State */
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center text-center py-12 space-y-4"
                                >
                                    <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                                    </div>
                                    <h3 className="text-2xl font-extrabold">Message envoyé !</h3>
                                    <p className="text-muted-foreground max-w-sm leading-relaxed">
                                        Merci pour votre message. Notre équipe vous répondra dans les meilleurs délais, généralement sous 24 heures.
                                    </p>
                                    <div className="bg-muted/50 rounded-2xl border p-4 w-full max-w-sm text-left space-y-1 mt-4">
                                        <p className="text-xs font-bold text-muted-foreground uppercase">Récapitulatif</p>
                                        <p className="text-sm"><span className="font-semibold">Nom :</span> {form.name}</p>
                                        <p className="text-sm"><span className="font-semibold">Email :</span> {form.email}</p>
                                        <p className="text-sm"><span className="font-semibold">Sujet :</span> {form.subject}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={() => { setSent(false); setForm({ name: "", email: "", phone: "", subject: "", message: "" }); }}
                                        className="mt-4"
                                    >
                                        Envoyer un autre message
                                    </Button>
                                </motion.div>
                            ) : (
                                <>
                                    <div className="mb-8">
                                        <h2 className="text-2xl font-extrabold tracking-tight">Envoyez-nous un message</h2>
                                        <p className="text-muted-foreground mt-1">Réponse garantie sous 24h en jours ouvrés</p>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Row 1: Name + Email */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="contact-name">Nom complet *</Label>
                                                <Input
                                                    id="contact-name"
                                                    placeholder="Mohamed Alami"
                                                    value={form.name}
                                                    onChange={(e) => update("name", e.target.value)}
                                                    className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                                                />
                                                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contact-email">Adresse email *</Label>
                                                <Input
                                                    id="contact-email"
                                                    type="email"
                                                    placeholder="exemple@email.com"
                                                    value={form.email}
                                                    onChange={(e) => update("email", e.target.value)}
                                                    className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                                                />
                                                {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                                            </div>
                                        </div>

                                        {/* Row 2: Phone + Subject */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="contact-phone">Téléphone <span className="text-muted-foreground">(optionnel)</span></Label>
                                                <Input
                                                    id="contact-phone"
                                                    type="tel"
                                                    placeholder="06XX XX XX XX"
                                                    value={form.phone}
                                                    onChange={(e) => update("phone", e.target.value)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="contact-subject">Sujet *</Label>
                                                <select
                                                    id="contact-subject"
                                                    value={form.subject}
                                                    onChange={(e) => update("subject", e.target.value)}
                                                    className={`w-full h-10 rounded-md border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring ${errors.subject ? "border-destructive" : ""}`}
                                                >
                                                    <option value="">Choisir un sujet...</option>
                                                    {SUBJECTS.map((s) => (
                                                        <option key={s} value={s}>{s}</option>
                                                    ))}
                                                </select>
                                                {errors.subject && <p className="text-xs text-destructive">{errors.subject}</p>}
                                            </div>
                                        </div>

                                        {/* Message */}
                                        <div className="space-y-2">
                                            <Label htmlFor="contact-message">
                                                Votre message *
                                                <span className="text-muted-foreground font-normal ml-2 text-xs">({form.message.length}/500)</span>
                                            </Label>
                                            <textarea
                                                id="contact-message"
                                                rows={6}
                                                placeholder="Décrivez votre demande en détail..."
                                                value={form.message}
                                                maxLength={500}
                                                onChange={(e) => update("message", e.target.value)}
                                                className={`w-full rounded-md border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none ${errors.message ? "border-destructive focus:ring-destructive" : ""}`}
                                            />
                                            {errors.message && <p className="text-xs text-destructive">{errors.message}</p>}
                                        </div>

                                        {/* Response time info */}
                                        <div className="flex items-start gap-3 bg-primary/5 border border-primary/20 rounded-xl p-4">
                                            <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                            <div className="text-sm">
                                                <p className="font-semibold text-primary">Temps de réponse estimé</p>
                                                <p className="text-muted-foreground mt-0.5">
                                                    Sous 24h en jours ouvrés · Pour les commandes urgentes, appelez-nous ou utilisez WhatsApp.
                                                </p>
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            size="lg"
                                            className="w-full h-12 gap-2 shadow-md shadow-primary/20"
                                            disabled={loading}
                                            id="contact-send-btn"
                                        >
                                            {loading ? (
                                                <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours...</>
                                            ) : (
                                                <><Send className="h-4 w-4" /> Envoyer le message</>
                                            )}
                                        </Button>
                                    </form>
                                </>
                            )}
                        </div>

                        {/* Map embed placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
                            className="mt-6 rounded-2xl overflow-hidden border h-56 relative"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1200&auto=format&fit=crop"
                                alt="Casablanca, Maroc"
                                className="w-full h-full object-cover opacity-60"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            <div className="absolute bottom-0 left-0 p-5 text-white">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    <span className="font-bold text-sm">Notre emplacement</span>
                                </div>
                                <p className="text-white/80 text-sm">123 Avenue de la Beauté, Casablanca, Maroc</p>
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 mt-2 text-xs bg-white/20 hover:bg-white/30 border border-white/30 rounded-full px-3 py-1 transition-colors"
                                >
                                    Voir sur Google Maps →
                                </a>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
    Store, Globe, Truck, Bell, Shield, Palette,
    Save, CheckCircle2, Mail, Phone, MapPin, CreditCard, Package
} from "lucide-react";

type Tab = "boutique" | "livraison" | "paiement" | "notifications" | "securite" | "apparence" | "header" | "footer" | "modules";

const TABS: { id: Tab; label: string; icon: typeof Store }[] = [
    { id: "boutique", label: "Boutique", icon: Store },
    { id: "header", label: "Header", icon: Globe },
    { id: "footer", label: "Footer", icon: Package },
    { id: "livraison", label: "Livraison", icon: Truck },
    { id: "paiement", label: "Paiement", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "securite", label: "Sécurité", icon: Shield },
    { id: "apparence", label: "Apparence", icon: Palette },
    { id: "modules", label: "Modules & Fonctionnalités", icon: Package },
];

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">{label}</label>
            {children}
        </div>
    );
}

function Input({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#103178]/30 focus:border-[#103178] transition-colors"
            {...props}
        />
    );
}

function Textarea({ ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#103178]/30 focus:border-[#103178] transition-colors resize-none"
            {...props}
        />
    );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-sm text-slate-700">{label}</span>
            <button
                type="button"
                onClick={onChange}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? "bg-[#103178]" : "bg-slate-300"}`}
            >
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
            </button>
        </div>
    );
}

function SaveButton({ saving, saved }: { saving: boolean; saved: boolean }) {
    return (
        <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-[#103178] hover:bg-[#0d266b] text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-60"
        >
            {saved ? <CheckCircle2 size={16} /> : <Save size={16} />}
            {saving ? "Enregistrement..." : saved ? "Enregistré !" : "Enregistrer"}
        </button>
    );
}

export default function AdminSettingsPage() {
    const [tab, setTab] = useState<Tab>("boutique");
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // ── Boutique state
    const [boutique, setBoutique] = useState({
        name: "Vitaluxe",
        tagline: "Votre parapharmacie en ligne de confiance",
        email: "contact@vitaluxe.ma",
        phone: "+212 5 22 XX XX XX",
        address: "Casablanca, Maroc",
        currency: "MAD",
        language: "fr",
    });

    // ── Livraison state
    const [livraison, setLivraison] = useState({
        freeAbove: "500",
        standardCost: "35",
        standardDays: "2-4",
        expressCost: "75",
        expressDays: "24h",
        enableExpress: true,
        enableCod: true,
    });

    // ── Paiement state
    const [paiement, setPaiement] = useState({
        enableCard: true,
        enablePaypal: true,
        enableCod: true,
        stripeKey: "",
        paypalClientId: "",
    });

    // ── Notifications state
    const [notifs, setNotifs] = useState({
        orderPlaced: true,
        orderShipped: true,
        orderDelivered: true,
        lowStock: true,
        newUser: false,
        newsletterEnabled: false,
        lowStockThreshold: "5",
    });

    // ── Sécurité state
    const [securite, setSecurite] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        twoFactor: false,
        loginNotif: true,
    });

    // ── Apparence state
    const [apparence, setApparence] = useState({
        primaryColor: "#103178",
        accentColor: "#f97316",
        showBanner: true,
        bannerText: "🚚 Livraison gratuite dès 500 MAD",
        productsPerPage: "12",
    });

    // ── Header state
    const [header, setHeader] = useState({
        topBannerText: "Livraison gratuite Rabat à partir de 350 Dh — Autres villes 600 Dh",
        phone: "06 66 69 54 86",
        phoneLink: "+212512345678",
        whatsapp: "212512345678",
    });

    // ── Footer state
    const [footer, setFooter] = useState({
        description: "Votre parapharmacie en ligne de confiance pour tous vos besoins en santé, beauté et bien-être.",
        facebookUrl: "https://www.facebook.com/vitaluxema",
        instagramUrl: "https://www.instagram.com/vitaluxema",
        tiktokUrl: "https://www.tiktok.com/@vitaluxema",
        address: "123 Avenue de la Beauté, Casablanca, Maroc",
        phone: "+212 5 12 34 56 78",
        email: "contact@vitaluxe.ma",
    });

    // ── Modules state
    const [modules, setModules] = useState({
        enableServices: true,
        enablePOS: true,
    });

    useEffect(() => {
        fetch("/api/admin/settings")
            .then(res => res.json())
            .then(data => {
                const parse = (val: any) => {
                    if (!val) return null;
                    if (typeof val === 'string') {
                        try { return JSON.parse(val); } catch { return val; }
                    }
                    return val;
                };

                if (data.boutique) setBoutique(parse(data.boutique));
                if (data.livraison) setLivraison(parse(data.livraison));
                if (data.paiement) setPaiement(parse(data.paiement));
                if (data.notifs) setNotifs(parse(data.notifs));
                if (data.apparence) setApparence(parse(data.apparence));
                if (data.header) setHeader(parse(data.header));
                if (data.footer) setFooter(parse(data.footer));
                if (data.modules) setModules(parse(data.modules));
            })
            .catch(console.error);
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const payload = {
            boutique: JSON.stringify(boutique),
            livraison: JSON.stringify(livraison),
            paiement: JSON.stringify(paiement),
            notifs: JSON.stringify(notifs),
            apparence: JSON.stringify(apparence),
            header: JSON.stringify(header),
            footer: JSON.stringify(footer),
            modules: JSON.stringify(modules),
        };

        try {
            const res = await fetch("/api/admin/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2500);
            } else {
                toast.error("Erreur d'enregistrement");
            }
        } catch {
            toast.error("Erreur serveur");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Paramètres</h1>
                <p className="text-slate-500 text-sm mt-1">Configurez votre boutique Vitaluxe</p>
            </div>

            <div className="flex gap-6">
                {/* Sidebar navigation */}
                <aside className="w-52 shrink-0">
                    <nav className="space-y-1">
                        {TABS.map((t) => {
                            const Icon = t.icon;
                            return (
                                <button
                                    key={t.id}
                                    onClick={() => setTab(t.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${tab === t.id
                                        ? "bg-[#103178] text-white"
                                        : "text-slate-600 hover:bg-slate-100"
                                        }`}
                                >
                                    <Icon size={18} />
                                    {t.label}
                                </button>
                            );
                        })}
                    </nav>
                </aside>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <form onSubmit={handleSave}>
                        {/* ── Boutique ── */}
                        {tab === "boutique" && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Store size={18} /> Informations générales</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Nom de la boutique">
                                        <Input value={boutique.name} onChange={(e) => setBoutique({ ...boutique, name: e.target.value })} />
                                    </Field>
                                    <Field label="Devise">
                                        <select value={boutique.currency} onChange={(e) => setBoutique({ ...boutique, currency: e.target.value })}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#103178]/30 bg-white">
                                            <option value="MAD">MAD – Dirham marocain</option>
                                            <option value="EUR">EUR – Euro</option>
                                            <option value="USD">USD – Dollar</option>
                                        </select>
                                    </Field>
                                    <div className="col-span-2">
                                        <Field label="Slogan">
                                            <Input value={boutique.tagline} onChange={(e) => setBoutique({ ...boutique, tagline: e.target.value })} />
                                        </Field>
                                    </div>
                                </div>

                                <hr className="border-slate-100" />
                                <h3 className="font-medium text-slate-700 text-sm">Contact</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Email de contact">
                                        <div className="relative">
                                            <Mail size={15} className="absolute left-3 top-2.5 text-slate-400" />
                                            <Input value={boutique.email} onChange={(e) => setBoutique({ ...boutique, email: e.target.value })} className="pl-8" style={{ paddingLeft: "2rem" }} />
                                        </div>
                                    </Field>
                                    <Field label="Téléphone">
                                        <div className="relative">
                                            <Phone size={15} className="absolute left-3 top-2.5 text-slate-400" />
                                            <Input value={boutique.phone} onChange={(e) => setBoutique({ ...boutique, phone: e.target.value })} style={{ paddingLeft: "2rem" }} />
                                        </div>
                                    </Field>
                                    <div className="col-span-2">
                                        <Field label="Adresse">
                                            <div className="relative">
                                                <MapPin size={15} className="absolute left-3 top-2.5 text-slate-400" />
                                                <Input value={boutique.address} onChange={(e) => setBoutique({ ...boutique, address: e.target.value })} style={{ paddingLeft: "2rem" }} />
                                            </div>
                                        </Field>
                                    </div>
                                </div>
                                <div className="flex justify-end"><SaveButton saving={saving} saved={saved} /></div>
                            </div>
                        )}

                        {/* ── Livraison ── */}
                        {tab === "livraison" && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Truck size={18} /> Options de livraison</h2>
                                <Field label="Livraison gratuite dès (MAD)">
                                    <Input type="number" value={livraison.freeAbove} onChange={(e) => setLivraison({ ...livraison, freeAbove: e.target.value })} />
                                </Field>

                                <hr className="border-slate-100" />
                                <h3 className="font-medium text-slate-700 text-sm">Livraison standard</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Coût (MAD)">
                                        <Input type="number" value={livraison.standardCost} onChange={(e) => setLivraison({ ...livraison, standardCost: e.target.value })} />
                                    </Field>
                                    <Field label="Délai">
                                        <Input value={livraison.standardDays} onChange={(e) => setLivraison({ ...livraison, standardDays: e.target.value })} placeholder="ex: 2-4 jours" />
                                    </Field>
                                </div>

                                <hr className="border-slate-100" />
                                <Toggle label="Activer la livraison express" checked={livraison.enableExpress} onChange={() => setLivraison({ ...livraison, enableExpress: !livraison.enableExpress })} />
                                {livraison.enableExpress && (
                                    <div className="grid grid-cols-2 gap-4 pl-2">
                                        <Field label="Coût express (MAD)">
                                            <Input type="number" value={livraison.expressCost} onChange={(e) => setLivraison({ ...livraison, expressCost: e.target.value })} />
                                        </Field>
                                        <Field label="Délai express">
                                            <Input value={livraison.expressDays} onChange={(e) => setLivraison({ ...livraison, expressDays: e.target.value })} />
                                        </Field>
                                    </div>
                                )}
                                <Toggle label="Paiement à la livraison (COD)" checked={livraison.enableCod} onChange={() => setLivraison({ ...livraison, enableCod: !livraison.enableCod })} />
                                <div className="flex justify-end"><SaveButton saving={saving} saved={saved} /></div>
                            </div>
                        )}

                        {/* ── Paiement ── */}
                        {tab === "paiement" && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><CreditCard size={18} /> Modes de paiement</h2>
                                <div className="space-y-3">
                                    <Toggle label="Carte bancaire (Stripe)" checked={paiement.enableCard} onChange={() => setPaiement({ ...paiement, enableCard: !paiement.enableCard })} />
                                    <Toggle label="PayPal" checked={paiement.enablePaypal} onChange={() => setPaiement({ ...paiement, enablePaypal: !paiement.enablePaypal })} />
                                    <Toggle label="Paiement à la livraison" checked={paiement.enableCod} onChange={() => setPaiement({ ...paiement, enableCod: !paiement.enableCod })} />
                                </div>

                                <hr className="border-slate-100" />
                                {paiement.enableCard && (
                                    <Field label="Clé secrète Stripe (sk_...)">
                                        <Input type="password" value={paiement.stripeKey} onChange={(e) => setPaiement({ ...paiement, stripeKey: e.target.value })} placeholder="sk_live_..." />
                                    </Field>
                                )}
                                {paiement.enablePaypal && (
                                    <Field label="PayPal Client ID">
                                        <Input value={paiement.paypalClientId} onChange={(e) => setPaiement({ ...paiement, paypalClientId: e.target.value })} placeholder="AXxx..." />
                                    </Field>
                                )}
                                <div className="flex justify-end"><SaveButton saving={saving} saved={saved} /></div>
                            </div>
                        )}

                        {/* ── Notifications ── */}
                        {tab === "notifications" && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Bell size={18} /> Notifications email</h2>
                                <div className="space-y-3">
                                    <Toggle label="Nouvelle commande reçue" checked={notifs.orderPlaced} onChange={() => setNotifs({ ...notifs, orderPlaced: !notifs.orderPlaced })} />
                                    <Toggle label="Commande expédiée" checked={notifs.orderShipped} onChange={() => setNotifs({ ...notifs, orderShipped: !notifs.orderShipped })} />
                                    <Toggle label="Commande livrée" checked={notifs.orderDelivered} onChange={() => setNotifs({ ...notifs, orderDelivered: !notifs.orderDelivered })} />
                                    <Toggle label="Stock faible" checked={notifs.lowStock} onChange={() => setNotifs({ ...notifs, lowStock: !notifs.lowStock })} />
                                    <Toggle label="Nouveau client inscrit" checked={notifs.newUser} onChange={() => setNotifs({ ...notifs, newUser: !notifs.newUser })} />
                                </div>

                                {notifs.lowStock && (
                                    <>
                                        <hr className="border-slate-100" />
                                        <Field label="Seuil d'alerte stock (quantité)">
                                            <Input type="number" value={notifs.lowStockThreshold} onChange={(e) => setNotifs({ ...notifs, lowStockThreshold: e.target.value })} />
                                        </Field>
                                    </>
                                )}

                                <hr className="border-slate-100" />
                                <Toggle label="Newsletter clients activée" checked={notifs.newsletterEnabled} onChange={() => setNotifs({ ...notifs, newsletterEnabled: !notifs.newsletterEnabled })} />
                                <div className="flex justify-end"><SaveButton saving={saving} saved={saved} /></div>
                            </div>
                        )}

                        {/* ── Sécurité ── */}
                        {tab === "securite" && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Shield size={18} /> Sécurité du compte</h2>
                                <div className="space-y-4">
                                    <Field label="Mot de passe actuel">
                                        <Input type="password" value={securite.currentPassword} onChange={(e) => setSecurite({ ...securite, currentPassword: e.target.value })} placeholder="••••••••" />
                                    </Field>
                                    <Field label="Nouveau mot de passe">
                                        <Input type="password" value={securite.newPassword} onChange={(e) => setSecurite({ ...securite, newPassword: e.target.value })} placeholder="••••••••" />
                                    </Field>
                                    <Field label="Confirmer le nouveau mot de passe">
                                        <Input type="password" value={securite.confirmPassword} onChange={(e) => setSecurite({ ...securite, confirmPassword: e.target.value })} placeholder="••••••••" />
                                    </Field>
                                </div>

                                <hr className="border-slate-100" />
                                <div className="space-y-3">
                                    <Toggle label="Authentification à deux facteurs (2FA)" checked={securite.twoFactor} onChange={() => setSecurite({ ...securite, twoFactor: !securite.twoFactor })} />
                                    <Toggle label="Notification de connexion par email" checked={securite.loginNotif} onChange={() => setSecurite({ ...securite, loginNotif: !securite.loginNotif })} />
                                </div>

                                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-700">
                                    Les sessions admin expirent automatiquement après 24h d'inactivité.
                                </div>
                                <div className="flex justify-end"><SaveButton saving={saving} saved={saved} /></div>
                            </div>
                        )}

                        {/* ── Apparence ── */}
                        {tab === "apparence" && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Palette size={18} /> Apparence de la boutique</h2>

                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Couleur principale">
                                        <div className="flex gap-2 items-center">
                                            <input type="color" value={apparence.primaryColor} onChange={(e) => setApparence({ ...apparence, primaryColor: e.target.value })}
                                                className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer" />
                                            <Input value={apparence.primaryColor} onChange={(e) => setApparence({ ...apparence, primaryColor: e.target.value })} />
                                        </div>
                                    </Field>
                                    <Field label="Couleur d'accent">
                                        <div className="flex gap-2 items-center">
                                            <input type="color" value={apparence.accentColor} onChange={(e) => setApparence({ ...apparence, accentColor: e.target.value })}
                                                className="w-10 h-10 rounded-lg border border-slate-300 cursor-pointer" />
                                            <Input value={apparence.accentColor} onChange={(e) => setApparence({ ...apparence, accentColor: e.target.value })} />
                                        </div>
                                    </Field>
                                </div>

                                <hr className="border-slate-100" />
                                <Toggle label="Afficher la bannière promotionnelle" checked={apparence.showBanner} onChange={() => setApparence({ ...apparence, showBanner: !apparence.showBanner })} />
                                {apparence.showBanner && (
                                    <Field label="Texte de la bannière">
                                        <Input value={apparence.bannerText} onChange={(e) => setApparence({ ...apparence, bannerText: e.target.value })} />
                                    </Field>
                                )}

                                <hr className="border-slate-100" />
                                <Field label="Produits par page (boutique)">
                                    <select value={apparence.productsPerPage} onChange={(e) => setApparence({ ...apparence, productsPerPage: e.target.value })}
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#103178]/30 bg-white">
                                        {["8", "12", "16", "24", "32"].map((n) => (
                                            <option key={n} value={n}>{n} produits</option>
                                        ))}
                                    </select>
                                </Field>

                                {/* Aperçu couleur */}
                                <div className="rounded-xl p-4 border border-slate-100 bg-slate-50">
                                    <p className="text-xs text-slate-500 font-medium uppercase mb-3">Aperçu</p>
                                    <div className="flex gap-3">
                                        <div className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: apparence.primaryColor }}>
                                            Bouton principal
                                        </div>
                                        <div className="px-4 py-2 rounded-lg text-sm font-bold text-white" style={{ backgroundColor: apparence.accentColor }}>
                                            Bouton accent
                                        </div>
                                    </div>
                                    {apparence.showBanner && (
                                        <div className="mt-3 text-xs font-medium text-center py-1.5 rounded-lg text-white" style={{ backgroundColor: apparence.primaryColor }}>
                                            {apparence.bannerText}
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end"><SaveButton saving={saving} saved={saved} /></div>
                            </div>
                        )}

                        {/* ── Header ── */}
                        {tab === "header" && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Globe size={18} /> Configuration du Header</h2>
                                <Field label="Texte de la barre supérieure (Top Banner)">
                                    <Input value={header.topBannerText} onChange={(e) => setHeader({ ...header, topBannerText: e.target.value })} />
                                </Field>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Téléphone affiché">
                                        <Input value={header.phone} onChange={(e) => setHeader({ ...header, phone: e.target.value })} />
                                    </Field>
                                    <Field label="Lien du téléphone (ex: tel:+212...)">
                                        <Input value={header.phoneLink} onChange={(e) => setHeader({ ...header, phoneLink: e.target.value })} />
                                    </Field>
                                    <Field label="Numéro WhatsApp (sans le + ou 00)">
                                        <Input value={header.whatsapp} onChange={(e) => setHeader({ ...header, whatsapp: e.target.value })} placeholder="2126..." />
                                    </Field>
                                </div>
                                <div className="flex justify-end"><SaveButton saving={saving} saved={saved} /></div>
                            </div>
                        )}

                        {/* ── Footer ── */}
                        {tab === "footer" && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Package size={18} /> Configuration du Footer</h2>
                                <Field label="Description du footer">
                                    <Textarea rows={3} value={footer.description} onChange={(e) => setFooter({ ...footer, description: e.target.value })} />
                                </Field>
                                <div className="grid grid-cols-2 gap-4">
                                    <Field label="Facebook URL">
                                        <Input value={footer.facebookUrl} onChange={(e) => setFooter({ ...footer, facebookUrl: e.target.value })} />
                                    </Field>
                                    <Field label="Instagram URL">
                                        <Input value={footer.instagramUrl} onChange={(e) => setFooter({ ...footer, instagramUrl: e.target.value })} />
                                    </Field>
                                    <Field label="TikTok URL">
                                        <Input value={footer.tiktokUrl} onChange={(e) => setFooter({ ...footer, tiktokUrl: e.target.value })} />
                                    </Field>
                                    <Field label="Email de contact">
                                        <Input value={footer.email} onChange={(e) => setFooter({ ...footer, email: e.target.value })} />
                                    </Field>
                                    <Field label="Téléphone">
                                        <Input value={footer.phone} onChange={(e) => setFooter({ ...footer, phone: e.target.value })} />
                                    </Field>
                                    <Field label="Adresse">
                                        <Input value={footer.address} onChange={(e) => setFooter({ ...footer, address: e.target.value })} />
                                    </Field>
                                </div>
                                <div className="flex justify-end"><SaveButton saving={saving} saved={saved} /></div>
                            </div>
                        )}

                        {/* ── Modules ── */}
                        {tab === "modules" && (
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-5">
                                <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Package size={18} /> Modules & Fonctionnalités</h2>
                                <p className="text-sm text-slate-500 mb-4">Activez ou désactivez les fonctionnalités additionnelles de votre parapharmacie.</p>
                                
                                <div className="space-y-4">
                                    <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                                        <Toggle 
                                            label="Activer le module Services et Réservations" 
                                            checked={modules.enableServices} 
                                            onChange={() => setModules({ ...modules, enableServices: !modules.enableServices })} 
                                        />
                                        <p className="text-xs text-slate-500 mt-2 ml-1">
                                            Si activé, vos clients pourront voir et réserver vos services depuis la page publique, et vous pourrez les gérer depuis le menu admin.
                                        </p>
                                    </div>
                                    <div className="p-4 border border-slate-100 rounded-lg bg-slate-50">
                                        <Toggle 
                                            label="Activer le Point de Vente (POS)" 
                                            checked={modules.enablePOS} 
                                            onChange={() => setModules({ ...modules, enablePOS: !modules.enablePOS })} 
                                        />
                                        <p className="text-xs text-slate-500 mt-2 ml-1">
                                            Si activé, vous aurez accès à l'interface de caisse (Point de Vente) pour encaisser les ventes sur place depuis la barre latérale.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end"><SaveButton saving={saving} saved={saved} /></div>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}

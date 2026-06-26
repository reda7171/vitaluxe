"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Save, Loader2, CheckCircle2, User, Mail, Phone, MapPin, Bell, ShieldCheck, Camera, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

const MOROCCAN_CITIES = [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
    "Meknès", "Oujda", "Kenitra", "Tétouan", "Safi", "Mohammedia",
];

export function ProfileView() {
    const { data: session, update: updateSession } = useSession();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "15 Rue Ibn Battouta, Maarif",
        city: "Casablanca",
        newsletter: true,
        orderUpdates: true,
        promos: false,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // ── Password state ───────────────────────────────────────────────────────
    const [pwdForm, setPwdForm] = useState({ current: "", new: "", confirm: "" });
    const [pwdSaving, setPwdSaving] = useState(false);
    const [pwdSaved, setPwdSaved] = useState(false);
    const [pwdError, setPwdError] = useState("");

    // ── Avatar state ─────────────────────────────────────────────────────────
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [avatarError, setAvatarError] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!session?.user) return;
        fetch("/api/account/profile")
            .then(res => res.json())
            .then(data => {
                if (!data || data.error) {
                    setLoading(false);
                    return;
                }
                setForm(prev => ({
                    ...prev,
                    name: data.name ?? "",
                    email: data.email ?? "",
                    phone: data.phone ?? "",
                }));
                if (data.image) setAvatarUrl(data.image);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [session]);

    const [avatarKey, setAvatarKey] = useState(0);

    const handleAvatarChange = async (file: File) => {
        if (!file) return;
        setAvatarError("");
        const previewUrl = URL.createObjectURL(file);
        setAvatarPreview(previewUrl);
        setUploadingAvatar(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);
            const res = await fetch("/api/account/avatar", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            
            // On ajoute un timestamp pour casser le cache browser
            const finalUrl = data.avatarUrl + "?v=" + Date.now();
            setAvatarUrl(finalUrl);
            setAvatarPreview(null);
            setAvatarKey(prev => prev + 1);
            
            await updateSession();
        } catch (e: unknown) {
            setAvatarError(e instanceof Error ? e.message : "Erreur upload");
            setAvatarPreview(null);
        } finally {
            setUploadingAvatar(false);
        }
    };

    const update = (k: keyof typeof form, v: string | boolean) =>
        setForm((p) => ({ ...p, [k]: v }));

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch("/api/account/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, phone: form.phone }),
            });
            if (res.ok) {
                await updateSession(); // Mettre à jour le nom dans la session client si changé
                setSaved(true);
                setTimeout(() => setSaved(false), 3000);
            }
        } catch (error) {
            console.error("Erreur sauvegarde", error);
        } finally {
            setSaving(false);
        }
    };

    const handlePasswordChange = async (e: React.FormEvent | React.MouseEvent) => {
        e.preventDefault();
        setPwdError("");
        if (pwdForm.new !== pwdForm.confirm) {
            return setPwdError("Les nouveaux mots de passe ne correspondent pas");
        }
        setPwdSaving(true);
        try {
            const res = await fetch("/api/account/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword: pwdForm.current, newPassword: pwdForm.new }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur de changement");
            setPwdSaved(true);
            setPwdForm({ current: "", new: "", confirm: "" });
            setTimeout(() => setPwdSaved(false), 3000);
        } catch (e: any) {
            setPwdError(e.message);
        } finally {
            setPwdSaving(false);
        }
    };

    const initials = form.name
        ?.split(" ").filter(Boolean).map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?";

    if (loading) return <div className="py-32 flex justify-center text-muted-foreground"><Loader2 className="animate-spin h-6 w-6" /></div>;

    const currentAvatar = avatarPreview ?? avatarUrl;

    return (
        <div className="space-y-6">
            {/* Avatar section */}
            <div className="bg-card rounded-2xl border p-6">
                <h2 className="text-lg font-bold mb-5">Photo de profil</h2>
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        {/* Hidden file input */}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) handleAvatarChange(file);
                            }}
                        />
                        {/* Avatar display */}
                        <div
                            className="w-20 h-20 rounded-full overflow-hidden bg-primary text-primary-foreground flex items-center justify-center text-2xl font-extrabold cursor-pointer border-2 border-transparent group-hover:border-primary transition-all"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            {uploadingAvatar ? (
                                <Loader2 className="animate-spin h-6 w-6 text-white" />
                            ) : currentAvatar ? (
                                <img
                                    key={avatarKey}
                                    src={currentAvatar}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        if (target.src.includes('?')) {
                                             target.style.display = 'none';
                                        }
                                    }}
                                />
                            ) : (
                                <span>{initials}</span>
                            )}
                        </div>
                        {/* Camera button */}
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary border-2 border-background flex items-center justify-center hover:scale-110 transition-transform"
                        >
                            {uploadingAvatar ? <Loader2 className="h-3 w-3 text-white animate-spin" /> : <Camera className="h-3.5 w-3.5 text-white" />}
                        </button>
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold">{session?.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{session?.user?.email}</p>
                        {session?.user?.role === "ADMIN" && (
                            <span className="inline-flex items-center gap-1 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold mt-1.5">
                                <ShieldCheck className="h-3 w-3" /> Administrateur
                            </span>
                        )}
                        <p className="text-xs text-muted-foreground mt-1.5">JPG, PNG ou WebP · Max 2MB</p>
                        {avatarError && (
                            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                                <X className="h-3 w-3" />{avatarError}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Profile form */}
            <form onSubmit={handleSave} className="space-y-5">
                {/* Personal info */}
                <div className="bg-card rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <User className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold">Informations personnelles</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="profile-name">Nom complet</Label>
                            <Input
                                id="profile-name"
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                placeholder="Votre nom"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profile-email">Adresse email</Label>
                            <div className="relative">
                                <Input
                                    id="profile-email"
                                    type="email"
                                    value={form.email}
                                    onChange={(e) => update("email", e.target.value)}
                                    className="pr-24"
                                />
                                <span className="absolute right-3 top-2.5 text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">
                                    ✓ Vérifié
                                </span>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profile-phone">Téléphone</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="profile-phone"
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) => update("phone", e.target.value)}
                                    className="pl-9"
                                    placeholder="06XX XX XX XX"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="bg-card rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <MapPin className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold">Adresse de livraison par défaut</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2 space-y-2">
                            <Label htmlFor="profile-address">Adresse</Label>
                            <Input
                                id="profile-address"
                                value={form.address}
                                onChange={(e) => update("address", e.target.value)}
                                placeholder="Numéro et nom de rue"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="profile-city">Ville</Label>
                            <select
                                id="profile-city"
                                value={form.city}
                                onChange={(e) => update("city", e.target.value)}
                                className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                            >
                                {MOROCCAN_CITIES.map((c) => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-card rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <Bell className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold">Préférences de notification</h2>
                    </div>

                    <div className="space-y-3">
                        {[
                            { key: "newsletter" as const, label: "Newsletter beauté & santé", sub: "Recevez nos conseils experts chaque semaine" },
                            { key: "orderUpdates" as const, label: "Mises à jour de commandes", sub: "Confirmations, expéditions et livraisons" },
                            { key: "promos" as const, label: "Offres et promotions", sub: "Profitez des meilleures réductions en avant-première" },
                        ].map(({ key, label, sub }) => (
                            <label
                                key={key}
                                className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/30 transition-colors cursor-pointer"
                            >
                                <div>
                                    <p className="text-sm font-medium">{label}</p>
                                    <p className="text-xs text-muted-foreground">{sub}</p>
                                </div>
                                <div
                                    onClick={() => update(key, !form[key])}
                                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${form[key] ? "bg-primary" : "bg-muted border"}`}
                                >
                                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form[key] ? "translate-x-6" : "translate-x-1"}`} />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Security */}
                <div className="bg-card rounded-2xl border p-6">
                    <div className="flex items-center gap-2 mb-5">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-bold">Sécurité - Mot de passe</h2>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="pwd-current">Mot de passe actuel</Label>
                            <Input
                                id="pwd-current"
                                type="password"
                                value={pwdForm.current}
                                onChange={(e) => setPwdForm({ ...pwdForm, current: e.target.value })}
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="pwd-new">Nouveau mot de passe</Label>
                                <Input
                                    id="pwd-new"
                                    type="password"
                                    value={pwdForm.new}
                                    onChange={(e) => setPwdForm({ ...pwdForm, new: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pwd-confirm">Confirmer le mot de passe</Label>
                                <Input
                                    id="pwd-confirm"
                                    type="password"
                                    value={pwdForm.confirm}
                                    onChange={(e) => setPwdForm({ ...pwdForm, confirm: e.target.value })}
                                />
                            </div>
                        </div>
                        {pwdError && <p className="text-sm text-destructive">{pwdError}</p>}
                        {pwdSaved && <p className="text-sm text-emerald-600 font-semibold flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Mot de passe modifié avec succès</p>}
                        <div className="pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePasswordChange}
                                disabled={pwdSaving || !pwdForm.current || !pwdForm.new}
                                className="w-full sm:w-auto gap-2"
                            >
                                {pwdSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                                {pwdSaving ? "Modification..." : "Modifier le mot de passe"}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Save button */}
                <div className="flex items-center justify-between">
                    {saved && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 text-emerald-600 text-sm font-semibold"
                        >
                            <CheckCircle2 className="h-4 w-4" /> Modifications enregistrées !
                        </motion.div>
                    )}
                    <Button
                        type="submit"
                        className="ml-auto gap-2 shadow-md shadow-primary/20"
                        disabled={saving}
                        id="save-profile-btn"
                    >
                        {saving
                            ? <><Loader2 className="h-4 w-4 animate-spin" /> Enregistrement...</>
                            : <><Save className="h-4 w-4" /> Enregistrer les modifications</>
                        }
                    </Button>

                </div>
            </form>
        </div>
    );
}

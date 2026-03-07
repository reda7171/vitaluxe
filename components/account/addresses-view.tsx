"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    MapPin, Plus, Trash2, Edit2, Star, Check, Home, Building2, Briefcase, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AccountLayout } from "@/components/account/account-layout";

type AddressType = "home" | "work" | "other";

interface Address {
    id: string;
    type: AddressType;
    label: string;
    firstName: string;
    lastName: string;
    phone: string;
    street: string;
    city: string;
    isDefault: boolean;
}

const MOROCCAN_CITIES = [
    "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir",
    "Meknès", "Oujda", "Kenitra", "Tétouan", "Safi", "Mohammedia",
];

const TYPE_ICONS: Record<AddressType, typeof Home> = {
    home: Home, work: Briefcase, other: Building2,
};

const TYPE_LABELS: Record<AddressType, string> = {
    home: "Domicile", work: "Bureau", other: "Autre",
};

const INITIAL_ADDRESSES: Address[] = [
    {
        id: "1", type: "home", label: "Domicile",
        firstName: "Ahmed", lastName: "Alami", phone: "0612345678",
        street: "15 Rue Ibn Battouta, Maarif", city: "Casablanca", isDefault: true,
    },
    {
        id: "2", type: "work", label: "Bureau",
        firstName: "Ahmed", lastName: "Alami", phone: "0522987654",
        street: "45 Bd Zerktouni, Gauthier", city: "Casablanca", isDefault: false,
    },
];

const EMPTY_FORM: Omit<Address, "id" | "isDefault"> = {
    type: "home", label: "Domicile",
    firstName: "", lastName: "", phone: "",
    street: "", city: "Casablanca",
};

function AddressForm({
    initial, onSave, onCancel,
}: { initial: typeof EMPTY_FORM; onSave: (d: typeof EMPTY_FORM) => void; onCancel: () => void; }) {
    const [form, setForm] = useState(initial);
    const [saving, setSaving] = useState(false);

    const up = (k: keyof typeof EMPTY_FORM, v: string) =>
        setForm((p) => ({ ...p, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await new Promise((r) => setTimeout(r, 900));
        setSaving(false);
        onSave(form);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            {/* Address type */}
            <div className="space-y-2">
                <Label>Type d'adresse</Label>
                <div className="flex gap-2 flex-wrap">
                    {(["home", "work", "other"] as AddressType[]).map((t) => {
                        const Icon = TYPE_ICONS[t];
                        return (
                            <button
                                key={t}
                                type="button"
                                onClick={() => up("type", t)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${form.type === t ? "bg-primary text-primary-foreground border-primary shadow" : "hover:bg-muted"
                                    }`}
                            >
                                <Icon className="h-4 w-4" />{TYPE_LABELS[t]}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Name row */}
            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <Label htmlFor="addr-first">Prénom *</Label>
                    <Input id="addr-first" value={form.firstName} onChange={(e) => up("firstName", e.target.value)} required placeholder="Prénom" />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="addr-last">Nom *</Label>
                    <Input id="addr-last" value={form.lastName} onChange={(e) => up("lastName", e.target.value)} required placeholder="Nom" />
                </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
                <Label htmlFor="addr-phone">Téléphone *</Label>
                <Input id="addr-phone" type="tel" value={form.phone} onChange={(e) => up("phone", e.target.value)} required placeholder="06XX XX XX XX" />
            </div>

            {/* Street */}
            <div className="space-y-1.5">
                <Label htmlFor="addr-street">Adresse *</Label>
                <Input id="addr-street" value={form.street} onChange={(e) => up("street", e.target.value)} required placeholder="Numéro, nom de rue, quartier" />
            </div>

            {/* City */}
            <div className="space-y-1.5">
                <Label htmlFor="addr-city">Ville *</Label>
                <select
                    id="addr-city"
                    value={form.city}
                    onChange={(e) => up("city", e.target.value)}
                    className="w-full h-10 rounded-md border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    required
                >
                    {MOROCCAN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel}>Annuler</Button>
                <Button type="submit" disabled={saving} className="gap-2">
                    {saving ? <><Loader2 className="h-4 w-4 animate-spin" />Enregistrement...</> : <><Check className="h-4 w-4" />Enregistrer</>}
                </Button>
            </div>
        </form>
    );
}

export function AddressesPageClient() {
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const fetchAddresses = () => {
        fetch("/api/account/addresses")
            .then(res => res.json())
            .then(data => {
                setAddresses(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchAddresses();
    }, []);

    const handleAdd = async (data: typeof EMPTY_FORM) => {
        const isDefault = addresses.length === 0;
        await fetch("/api/account/addresses", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...data, isDefault }),
        });
        setAdding(false);
        fetchAddresses();
    };

    const handleEdit = async (id: string, data: typeof EMPTY_FORM) => {
        await fetch(`/api/account/addresses/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        setEditId(null);
        fetchAddresses();
    };

    const handleDelete = async (id: string) => {
        await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
        setDeleteId(null);
        fetchAddresses();
    };

    const setDefault = async (id: string) => {
        await fetch(`/api/account/addresses/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isDefault: true }),
        });
        fetchAddresses();
    };

    if (loading) return <AccountLayout><div className="py-32 flex justify-center text-muted-foreground"><Loader2 className="animate-spin h-6 w-6" /></div></AccountLayout>;

    return (
        <AccountLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-extrabold flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" /> Mes adresses
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5">
                            {addresses.length} adresse{addresses.length !== 1 ? "s" : ""} enregistrée{addresses.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    {!adding && (
                        <Button onClick={() => setAdding(true)} className="gap-2 shadow-sm shadow-primary/20">
                            <Plus className="h-4 w-4" /> Ajouter une adresse
                        </Button>
                    )}
                </div>

                {/* Add form */}
                <AnimatePresence>
                    {adding && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                            className="bg-card rounded-2xl border p-6"
                        >
                            <h3 className="font-bold text-base mb-0">Nouvelle adresse</h3>
                            <AddressForm
                                initial={EMPTY_FORM}
                                onSave={handleAdd}
                                onCancel={() => setAdding(false)}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Address cards */}
                {addresses.length === 0 ? (
                    <div className="bg-card rounded-2xl border p-12 text-center">
                        <MapPin className="h-10 w-10 mx-auto text-muted-foreground/30 mb-3" />
                        <p className="font-semibold text-muted-foreground">Aucune adresse enregistrée</p>
                        <Button className="mt-4" onClick={() => setAdding(true)}><Plus className="h-4 w-4 mr-2" />Ajouter une adresse</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => {
                            const Icon = TYPE_ICONS[addr.type];
                            const isEditing = editId === addr.id;
                            const isDeleting = deleteId === addr.id;

                            return (
                                <motion.div
                                    key={addr.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.97 }}
                                    className={`bg-card rounded-2xl border overflow-hidden transition-shadow hover:shadow-md ${addr.isDefault ? "border-primary/30 shadow-sm shadow-primary/10" : ""}`}
                                >
                                    {/* Card header */}
                                    <div className={`flex items-center justify-between px-5 pt-5 pb-3 ${addr.isDefault ? "bg-primary/4" : ""}`}>
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${addr.isDefault ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <span className="font-bold text-sm">{TYPE_LABELS[addr.type]}</span>
                                                {addr.isDefault && (
                                                    <span className="ml-2 text-[10px] bg-primary/12 text-primary font-bold px-2 py-0.5 rounded-full">
                                                        ★ Défaut
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        {/* Actions */}
                                        {!isEditing && !isDeleting && (
                                            <div className="flex gap-1">
                                                <button onClick={() => setEditId(addr.id)} className="w-8 h-8 rounded-lg hover:bg-muted flex items-center justify-center transition-colors" aria-label="Modifier">
                                                    <Edit2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                </button>
                                                <button onClick={() => setDeleteId(addr.id)} className="w-8 h-8 rounded-lg hover:bg-destructive/10 hover:text-destructive flex items-center justify-center transition-colors" aria-label="Supprimer">
                                                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground" />
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Card body */}
                                    <div className="px-5 pb-5">
                                        {isEditing ? (
                                            <AddressForm
                                                initial={{ type: addr.type, label: addr.label, firstName: addr.firstName, lastName: addr.lastName, phone: addr.phone, street: addr.street, city: addr.city }}
                                                onSave={(d) => handleEdit(addr.id, d)}
                                                onCancel={() => setEditId(null)}
                                            />
                                        ) : isDeleting ? (
                                            <div className="mt-3 p-4 bg-destructive/5 border border-destructive/20 rounded-xl text-sm">
                                                <p className="font-semibold text-destructive mb-3">Supprimer cette adresse ?</p>
                                                <div className="flex gap-2">
                                                    <Button size="sm" variant="destructive" onClick={() => handleDelete(addr.id)}>Supprimer</Button>
                                                    <Button size="sm" variant="outline" onClick={() => setDeleteId(null)}>Annuler</Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-1.5 mt-1">
                                                <p className="font-semibold text-sm">{addr.firstName} {addr.lastName}</p>
                                                <p className="text-sm text-muted-foreground leading-relaxed">{addr.street}</p>
                                                <p className="text-sm text-muted-foreground">{addr.city}, Maroc</p>
                                                <p className="text-sm text-muted-foreground">{addr.phone}</p>
                                                {!addr.isDefault && (
                                                    <button
                                                        onClick={() => setDefault(addr.id)}
                                                        className="flex items-center gap-1.5 text-xs text-primary hover:underline mt-2 font-medium"
                                                    >
                                                        <Star className="h-3 w-3" /> Définir par défaut
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AccountLayout>
    );
}

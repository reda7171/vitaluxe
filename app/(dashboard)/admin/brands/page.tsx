"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Edit, Trash2, Search, Loader2, Tag, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Brand {
    id: string;
    name: string;
    slug: string;
    image: string | null;
}

export default function AdminBrandsPage() {
    const [brands, setBrands] = useState<Brand[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    // Modal
    const [isOpen, setIsOpen] = useState(false);
    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState({ name: "", image: "" });
    const [submitting, setSubmitting] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        fetch("/api/admin/brands")
            .then(r => r.json())
            .then(data => { setBrands(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = brands.filter(b => b.name.toLowerCase().includes(search.toLowerCase()));

    const openModal = (brand?: Brand) => {
        if (brand) {
            setEditId(brand.id);
            setForm({ name: brand.name, image: brand.image || "" });
        } else {
            setEditId(null);
            setForm({ name: "", image: "" });
        }
        setIsOpen(true);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setForm(prev => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const url = editId ? `/api/admin/brands/${editId}` : "/api/admin/brands";
        const method = editId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                toast.success(`Marque ${editId ? "modifiée" : "créée"} avec succès`);
                setIsOpen(false);
                load();
            } else {
                const err = await res.json();
                toast.error(err.error || "Une erreur est survenue");
            }
        } catch {
            toast.error("Erreur réseau");
        } finally {
            setSubmitting(false);
        }
    };

    const remove = async (id: string, name: string) => {
        if (!confirm(`Supprimer la marque "${name}" ? (Cela ne supprimera pas les produits associés)`)) return;
        const toastId = toast.loading("Suppression...");
        const res = await fetch(`/api/admin/brands/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Marque supprimée", { id: toastId });
            load();
        } else {
            toast.error("Erreur lors de la suppression", { id: toastId });
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Marques</h1>
                    <p className="text-sm text-slate-500 mt-1">{brands.length} marque{brands.length !== 1 ? "s" : ""} gérée{brands.length !== 1 ? "s" : ""}</p>
                </div>
                <Button onClick={() => openModal()} className="gap-2 bg-[#103178] hover:bg-[#0d266b]">
                    <Plus size={18} /> Nouvelle marque
                </Button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Rechercher une marque..."
                    className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#103178]/20 bg-white"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                            <th className="px-5 py-3 w-20">Logo</th>
                            <th className="px-5 py-3">Nom</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={3} className="py-16 text-center text-slate-400">
                                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                            </td></tr>
                        ) : filtered.length === 0 ? (
                            <tr><td colSpan={3} className="py-12 text-center text-slate-400 text-sm">
                                {search ? "Aucun résultat." : "Aucune marque ajoutée."}
                            </td></tr>
                        ) : filtered.map(b => (
                            <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-3">
                                    <div className="w-10 h-10 rounded bg-white shadow-sm border border-slate-100 flex items-center justify-center p-1 overflow-hidden">
                                        {b.image ? (
                                            <img src={b.image} alt={b.name} className="w-full h-full object-contain" />
                                        ) : (
                                            <Tag className="w-4 h-4 text-slate-300" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-5 py-3 font-medium text-slate-900">{b.name}</td>
                                <td className="px-5 py-3">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openModal(b)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => remove(b.id, b.name)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                            <h3 className="font-bold text-lg">{editId ? "Modifier" : "Ajouter"} une marque</h3>
                            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Nom de la marque</label>
                                <input
                                    required
                                    value={form.name}
                                    onChange={e => setForm({ ...form, name: e.target.value })}
                                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#103178]/20 focus:border-[#103178] outline-none transition-all"
                                    placeholder="Ex: La Roche-Posay"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-slate-700">Logo (Optionnel)</label>
                                <div className="flex items-center gap-4">
                                    {form.image && (
                                        <div className="w-16 h-16 rounded-lg border border-slate-200 p-1 flex shrink-0 items-center justify-center bg-slate-50 relative group overflow-hidden">
                                            <img src={form.image} alt="Aperçu" className="w-full h-full object-contain" />
                                            <button
                                                type="button"
                                                onClick={() => setForm({ ...form, image: "" })}
                                                className="absolute inset-0 bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="w-full h-10 px-3 py-1.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-[#103178]/20 focus:border-[#103178] outline-none transition-all file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#103178]/10 file:text-[#103178] hover:file:bg-[#103178]/20"
                                    />
                                </div>
                            </div>
                            <div className="pt-4 flex gap-3">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => setIsOpen(false)}>Annuler</Button>
                                <Button type="submit" disabled={submitting} className="flex-1 bg-[#103178] hover:bg-[#0d266b]">
                                    {submitting ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

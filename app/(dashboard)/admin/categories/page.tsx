"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X, Image as ImageIcon, Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    _count: { products: number };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [newImage, setNewImage] = useState<string>("");
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editImage, setEditImage] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, setImage: (val: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("/api/categories/upload", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Erreur upload");
            setImage(data.url);
            toast.success("Image téléchargée");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setUploading(false);
        }
    };

    const load = () => {
        setLoading(true);
        fetch("/api/categories")
            .then((r) => r.json())
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const create = async () => {
        if (!newName.trim()) return;
        setLoading(true);
        try {
            const res = await fetch("/api/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, image: newImage }),
            });
            if (res.ok) {
                toast.success("Catégorie créée");
                setNewName("");
                setNewImage("");
                load();
            } else {
                const data = await res.json();
                toast.error(data.error || "Erreur création");
            }
        } catch {
            toast.error("Erreur réseau");
        } finally {
            setLoading(false);
        }
    };

    const remove = async (id: string, name: string, productCount: number) => {
        const msg = productCount > 0
            ? `Supprimer la catégorie "${name}" ?\n\n⚠️ Cette action supprimera aussi ${productCount} produit(s) associé(s) et leurs données (commandes, avis, wishlist).\n\nCette action est irréversible.`
            : `Supprimer la catégorie "${name}" ?\n\nAucun produit ne sera affecté.`;

        if (!confirm(msg)) return;

        try {
            const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                if (data.deletedProducts > 0) {
                    toast.success(`Catégorie supprimée avec ${data.deletedProducts} produit(s)`);
                } else {
                    toast.success("Catégorie supprimée");
                }
                setSelectedIds(prev => prev.filter(i => i !== id));
                load();
            } else {
                toast.error(data.error || "Erreur suppression");
            }
        } catch {
            toast.error("Erreur réseau");
        }
    };

    const removeMultiple = async () => {
        const productCount = categories
            .filter(cat => selectedIds.includes(cat.id))
            .reduce((acc, cat) => acc + cat._count.products, 0);

        const msg = productCount > 0
            ? `Supprimer les ${selectedIds.length} catégories sélectionnées ?\n\n⚠️ Cette action supprimera aussi ${productCount} produit(s) associé(s) et leurs données.\n\nCette action est irréversible.`
            : `Supprimer les ${selectedIds.length} catégories sélectionnées ?`;

        if (!confirm(msg)) return;

        const toastId = toast.loading("Suppression multiple...");
        try {
            const res = await fetch("/api/categories/bulk", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Catégories supprimées. ${data.deletedProducts} produit(s) retiré(s).`, { id: toastId });
                setSelectedIds([]);
                load();
            } else {
                toast.error(data.error || "Erreur suppression multiple", { id: toastId });
            }
        } catch {
            toast.error("Erreur réseau", { id: toastId });
        }
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === categories.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(categories.map(c => c.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const update = async (id: string) => {
        if (!editName.trim()) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/categories/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName, image: editImage }),
            });
            if (res.ok) {
                toast.success("Catégorie mise à jour");
                setEditId(null);
                setEditImage("");
                load();
            } else {
                toast.error("Erreur mise à jour");
            }
        } catch {
            toast.error("Erreur réseau");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Catégories</h1>
                {selectedIds.length > 0 && (
                    <button onClick={removeMultiple}
                        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md shadow-red-600/20">
                        <Trash2 size={18} /> Supprimer ({selectedIds.length})
                    </button>
                )}
            </div>

            {/* Formulaire d'ajout */}
            <div className="flex gap-3 items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                <div className="relative group shrink-0">
                    <label className="cursor-pointer w-12 h-12 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden hover:border-blue-500 transition-colors relative">
                        {uploading ? (
                            <Loader2 className="animate-spin text-blue-500" size={20} />
                        ) : newImage ? (
                            <img loading="lazy" src={newImage} alt="" className="w-full h-full object-cover" />
                        ) : (
                            <ImageIcon size={20} className="text-slate-400 group-hover:text-blue-500" />
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setNewImage)} disabled={uploading} />
                    </label>
                </div>
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && create()}
                    placeholder="Nouvelle catégorie..."
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm h-12"
                    disabled={loading}
                />
                <button
                    onClick={create}
                    disabled={loading || !newName.trim()}
                    className="bg-[#103178] hover:bg-[#0d266b] text-white px-6 py-2 rounded-lg flex items-center gap-2 text-sm font-bold transition-all h-12 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                    Ajouter
                </button>
            </div>

            {/* Liste */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-bold uppercase h-12">
                            <th className="px-6 py-3 w-10">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-slate-300 text-[#103178] focus:ring-[#103178]/20 cursor-pointer"
                                    checked={categories.length > 0 && selectedIds.length === categories.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-3 min-w-[300px]">Catégorie</th>
                            <th className="px-6 py-3">Slug</th>
                            <th className="px-6 py-3">Produits</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading && categories.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="py-20 text-center text-slate-400">
                                    <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                                    Chargement...
                                </td>
                            </tr>
                        ) : categories.map((cat) => (
                            <tr key={cat.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors group ${selectedIds.includes(cat.id) ? "bg-[#103178]/5" : ""}`}>
                                <td className="px-6 py-4">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-slate-300 text-[#103178] focus:ring-[#103178]/20 cursor-pointer"
                                        checked={selectedIds.includes(cat.id)}
                                        onChange={() => toggleSelect(cat.id)}
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 rounded-lg bg-slate-100 overflow-hidden border border-slate-200 shrink-0 relative flex items-center justify-center group-hover:border-blue-500/50 transition-colors">
                                            {editId === cat.id ? (
                                                <label className="cursor-pointer w-full h-full bg-black/10 flex items-center justify-center hover:bg-black/40 transition-colors relative z-10 overflow-hidden group/upload">
                                                    {uploading ? (
                                                        <Loader2 className="animate-spin text-white z-20" size={20} />
                                                    ) : (
                                                        <>
                                                            {editImage ? (
                                                                <img loading="lazy" src={editImage} alt="" className="w-full h-full object-cover absolute inset-0" />
                                                            ) : null}
                                                            <Upload size={18} className="text-white opacity-0 group-hover/upload:opacity-100 transition-opacity z-20" />
                                                        </>
                                                    )}
                                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setEditImage)} disabled={uploading} />
                                                </label>
                                            ) : (
                                                cat.image ? (
                                                    <img loading="lazy" src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <ImageIcon size={20} className="text-slate-300" />
                                                )
                                            )}
                                        </div>
                                        {editId === cat.id ? (
                                            <div className="flex-1 space-y-1">
                                                <input
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full px-3 py-1.5 border border-blue-400 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-100 outline-none"
                                                    autoFocus
                                                />
                                                <p className="text-[10px] text-blue-500 font-medium">Appuyez sur Entrée pour valider</p>
                                            </div>
                                        ) : (
                                            <div>
                                                <span className="font-bold text-slate-900 block">{cat.name}</span>
                                                <span className="text-[10px] text-slate-400 uppercase font-medium">#{cat.id.slice(-6)}</span>
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm font-medium">{cat.slug}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2.5 py-1 bg-[#103178]/5 text-[#103178] rounded-full text-xs font-bold">
                                        {cat._count.products}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        {editId === cat.id ? (
                                            <>
                                                <button onClick={() => update(cat.id)} className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title="Valider">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={() => setEditId(null)} className="p-2 rounded-lg bg-slate-50 text-slate-400 hover:bg-slate-100 transition-colors" title="Annuler">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => { setEditId(cat.id); setEditName(cat.name); setEditImage(cat.image || ""); }} className="p-2 rounded-lg text-slate-400 hover:text-[#103178] hover:bg-[#103178]/5 transition-colors" title="Modifier">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => remove(cat.id, cat.name, cat._count.products)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Supprimer">
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && !loading && (
                            <tr>
                                <td colSpan={4} className="py-20 text-center text-slate-400 text-sm">Aucune catégorie.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

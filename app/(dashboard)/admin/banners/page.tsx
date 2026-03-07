"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Eye, EyeOff, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Banner {
    id: string;
    title: string;
    subtitle: string | null;
    imageUrl: string;
    link: string | null;
    active: boolean;
    position: string;
    createdAt: string;
}

export default function AdminBannersPage() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [title, setTitle] = useState("");
    const [subtitle, setSubtitle] = useState("");
    const [link, setLink] = useState("/");
    const [imageUrl, setImageUrl] = useState("");
    const [saving, setSaving] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/banners");
            if (res.ok) setBanners(await res.json());
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => setImageUrl(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !imageUrl) {
            toast.error("Titre et image requis");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/admin/banners", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, subtitle, imageUrl, link }),
            });
            if (res.ok) {
                toast.success("Bannière créée");
                setIsDialogOpen(false);
                setTitle(""); setSubtitle(""); setLink("/"); setImageUrl("");
                load();
            } else {
                toast.error("Erreur de création");
            }
        } finally {
            setSaving(false);
        }
    };

    const toggleStatus = async (id: string, current: boolean) => {
        try {
            await fetch(`/api/admin/banners/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ active: !current }),
            });
            toast.success("Statut mis à jour");
            load();
        } catch {
            toast.error("Erreur de mise à jour");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Supprimer cette bannière ?")) return;
        try {
            await fetch(`/api/admin/banners/${id}`, { method: "DELETE" });
            toast.success("Bannière supprimée");
            load();
        } catch {
            toast.error("Erreur de suppression");
        }
    };

    return (
        <div className="space-y-6 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Bannières & Pop-ups</h1>
                    <p className="text-sm text-slate-500 mt-1">Gérez le contenu dynamique de l'accueil</p>
                </div>
                <Button onClick={() => setIsDialogOpen(true)} className="bg-[#103178] hover:bg-[#0d266b] gap-2">
                    <Plus className="h-4 w-4" /> Nouvelle Bannière
                </Button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50/50 border-b">
                        <tr className="text-slate-500 text-xs font-semibold uppercase tracking-wide">
                            <th className="px-6 py-4">Bannière</th>
                            <th className="px-6 py-4">Lien</th>
                            <th className="px-6 py-4">Statut</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {loading ? (
                            <tr><td colSpan={4} className="py-12 text-center"><Loader2 className="animate-spin h-6 w-6 text-slate-400 mx-auto" /></td></tr>
                        ) : banners.length === 0 ? (
                            <tr><td colSpan={4} className="py-12 text-center text-slate-400">Aucune bannière trouvée</td></tr>
                        ) : banners.map((banner) => (
                            <tr key={banner.id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <img src={banner.imageUrl} alt={banner.title} className="w-24 h-12 object-cover rounded-lg border shadow-sm" />
                                        <div>
                                            <p className="font-bold text-slate-800 text-sm">{banner.title}</p>
                                            {banner.subtitle && <p className="text-xs text-slate-500">{banner.subtitle}</p>}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-blue-600 hover:underline cursor-pointer">{banner.link}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStatus(banner.id, banner.active)}
                                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${banner.active ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"} transition-colors`}
                                    >
                                        {banner.active ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Masquée</>}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button onClick={() => handleDelete(banner.id)} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Créer une nouvelle bannière</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreate} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Titre (Optionnel / Court)</Label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Summer Sale 2026" required />
                        </div>
                        <div className="space-y-2">
                            <Label>Sous-titre (Optionnel)</Label>
                            <Input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="-20% sur tout le site" />
                        </div>
                        <div className="space-y-2">
                            <Label>Lien de redirection</Label>
                            <Input value={link} onChange={e => setLink(e.target.value)} placeholder="/shop?sale=true" />
                        </div>
                        <div className="space-y-2">
                            <Label>Image de bannière (Paysage, HD)</Label>
                            <label className="flex flex-col flex-1 items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-6 cursor-pointer hover:bg-slate-50 transition-colors">
                                {imageUrl ? (
                                    <img src={imageUrl} alt="Aperçu" className="max-h-32 object-contain rounded-lg shadow-sm" />
                                ) : (
                                    <div className="text-center">
                                        <ImageIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                                        <span className="text-xs text-slate-500 font-medium bg-[#103178]/10 text-[#103178] px-3 py-1.5 rounded-lg">Sélectionner une image</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                            <Button type="submit" disabled={saving} className="bg-[#103178] hover:bg-[#0d266b]">
                                {saving ? <Loader2 className="animate-spin h-4 w-4" /> : "Enregistrer"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

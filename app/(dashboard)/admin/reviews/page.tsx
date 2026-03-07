"use client";

import { useState, useEffect } from "react";
import { Loader2, Trash2, CheckCircle, XCircle, Star, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";

type Review = {
    id: string;
    rating: number;
    comment: string | null;
    images: string[] | null;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
    product: { name: string; images: string[] };
};

export default function AdminReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/admin/reviews");
            const data = await res.json();
            setReviews(data);
        } catch {
            toast.error("Erreur lors du chargement des avis");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                setReviews(reviews.map(r => r.id === id ? { ...r, status } : r));
                toast.success(`Avis ${status === "APPROVED" ? "approuvé" : "rejeté"}`);
            }
        } catch {
            toast.error("Erreur lors de la mise à jour");
        }
    };

    const deleteReview = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer cet avis ?")) return;
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
            if (res.ok) {
                setReviews(reviews.filter(r => r.id !== id));
                toast.success("Avis supprimé");
            }
        } catch {
            toast.error("Erreur de suppression");
        }
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Avis Clients</h1>
                <p className="text-sm text-slate-500">Gérez les avis laissés par vos clients sur les produits.</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                            <th className="px-5 py-3">Produit</th>
                            <th className="px-5 py-3">Client</th>
                            <th className="px-5 py-3">Note & Commentaire</th>
                            <th className="px-5 py-3">Photos</th>
                            <th className="px-5 py-3">Statut</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="py-16 text-center"><Loader2 className="animate-spin h-5 w-5 mx-auto text-slate-400" /></td></tr>
                        ) : reviews.length === 0 ? (
                            <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-sm">Aucun avis trouvé.</td></tr>
                        ) : reviews.map(r => (
                            <tr key={r.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-4 w-48">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                                            {r.product.images?.length > 0 && <img src={r.product.images[0]} alt="" className="w-full h-full object-cover" />}
                                        </div>
                                        <p className="text-sm font-semibold text-slate-800 line-clamp-2">{r.product.name}</p>
                                    </div>
                                </td>
                                <td className="px-5 py-4">
                                    <p className="text-sm font-semibold text-slate-800">{r.user.name}</p>
                                    <p className="text-xs text-slate-500">{r.user.email}</p>
                                    <p className="text-[10px] text-slate-400 mt-0.5">{new Date(r.createdAt).toLocaleDateString("fr-FR")}</p>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex gap-0.5 mb-1.5">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={12} className={r.rating >= s ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-600 line-clamp-2 max-w-xs">{r.comment || <span className="italic text-slate-400">Aucun commentaire</span>}</p>
                                </td>
                                <td className="px-5 py-4">
                                    {r.images && Array.isArray(r.images) && r.images.length > 0 ? (
                                        <div className="flex -space-x-2">
                                            {r.images.map((img, i) => (
                                                <a key={i} href={img} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-md border-2 border-white shadow-sm overflow-hidden z-10 hover:z-20 hover:scale-110 transition-transform">
                                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                                </a>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-slate-300"><ImageIcon size={18} /></div>
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${r.status === "APPROVED" ? "bg-emerald-100 text-emerald-700" : r.status === "REJECTED" ? "bg-red-100 text-red-700" : "bg-yellow-100 text-yellow-700"}`}>
                                        {r.status === "APPROVED" ? "Approuvé" : r.status === "REJECTED" ? "Rejeté" : "En attente"}
                                    </span>
                                </td>
                                <td className="px-5 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        {r.status !== "APPROVED" && (
                                            <button onClick={() => updateStatus(r.id, "APPROVED")} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Approuver">
                                                <CheckCircle size={16} />
                                            </button>
                                        )}
                                        {r.status !== "REJECTED" && (
                                            <button onClick={() => updateStatus(r.id, "REJECTED")} className="p-1.5 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Rejeter">
                                                <XCircle size={16} />
                                            </button>
                                        )}
                                        <button onClick={() => deleteReview(r.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-1" title="Supprimer">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

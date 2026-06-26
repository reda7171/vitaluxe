"use client";

import { useState, useEffect } from "react";
import { 
    ShoppingCart, 
    Trash2, 
    Calendar, 
    User, 
    Mail, 
    DollarSign,
    ExternalLink,
    AlertCircle,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface AbandonedCart {
    id: string;
    email: string;
    name: string | null;
    items: string;
    totalAmount: number;
    updatedAt: string;
    createdAt: string;
}

export default function AbandonedCartsPage() {
    const [carts, setCarts] = useState<AbandonedCart[]>([]);
    const [loading, setLoading] = useState(true);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchCarts();
    }, []);

    const fetchCarts = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/abandoned-carts");
            const data = await res.json();
            if (Array.isArray(data)) {
                setCarts(data);
            } else {
                setCarts([]);
            }
        } catch (error) {
            toast.error("Erreur lors du chargement des paniers");
            setCarts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (ids: string[]) => {
        if (!confirm(`Voulez-vous supprimer ${ids.length} panier(s) abandonné(s) ?`)) return;

        try {
            const res = await fetch("/api/admin/abandoned-carts", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids }),
            });
            if (res.ok) {
                toast.success("Suppression réussie");
                setCarts(prev => prev.filter(c => !ids.includes(c.id)));
                setSelected(new Set());
            }
        } catch (error) {
            toast.error("Erreur de suppression");
        }
    };

    const toggleSelect = (id: string) => {
        setSelected(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const parseItems = (itemsStr: string) => {
        try {
            return JSON.parse(itemsStr);
        } catch (e) {
            return [];
        }
    };

    const getImg = (imagesArr: any) => {
        if (Array.isArray(imagesArr) && imagesArr.length > 0) return imagesArr[0];
        if (typeof imagesArr === "string") {
            try { return JSON.parse(imagesArr)[0]; } catch { return imagesArr; }
        }
        return null;
    };

    return (
        <div className="p-6 max-w-[1600px] mx-auto space-y-8 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-lg text-white">
                            <ShoppingCart size={24} />
                        </div>
                        <h1 className="text-2xl font-black text-slate-900">
                             Paniers Abandonnés
                        </h1>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">Suivez les clients qui n&apos;ont pas terminé leur commande.</p>
                </div>

                {selected.size > 0 && (
                    <button 
                        onClick={() => handleDelete(Array.from(selected))}
                        className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg shadow-rose-500/20"
                    >
                        <Trash2 size={18} />
                        Supprimer ({selected.size})
                    </button>
                )}
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200">
                    <Loader2 className="h-10 w-10 animate-spin text-slate-200" />
                    <p className="mt-4 text-slate-400 font-medium">Chargement des données...</p>
                </div>
            ) : carts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 text-center p-8">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <ShoppingCart className="text-slate-300" size={40} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Aucun panier abandonné</h3>
                    <p className="text-slate-500 max-w-md mt-1">Tous vos clients finissent leurs achats ou aucun panier n&apos;a encore été enregistré.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden border-t-0">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-left">
                                    <th className="px-6 py-4">
                                        <input 
                                            type="checkbox" 
                                            onChange={(e) => {
                                                if (e.target.checked) setSelected(new Set(carts.map(c => c.id)));
                                                else setSelected(new Set());
                                            }}
                                            checked={selected.size === carts.length && carts.length > 0}
                                            className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                        />
                                    </th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Client</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Contenu</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Total</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400">Dernière activité</th>
                                    <th className="px-6 py-4 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {carts.map((cart) => {
                                    const items = parseItems(cart.items);
                                    return (
                                        <tr key={cart.id} className={`hover:bg-slate-50/50 transition-colors ${selected.has(cart.id) ? 'bg-slate-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <input 
                                                    type="checkbox" 
                                                    checked={selected.has(cart.id)}
                                                    onChange={() => toggleSelect(cart.id)}
                                                    className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 border border-slate-200 font-bold uppercase shrink-0">
                                                        {(cart.name || cart.email)[0]}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-bold text-slate-900 truncate">{cart.name || "Client"}</p>
                                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                                            <Mail size={12} /> {cart.email}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex -space-x-2 overflow-hidden">
                                                    {items.slice(0, 3).map((cartItem: any, idx: number) => {
                                                        const product = cartItem.product || cartItem;
                                                        return (
                                                            <div key={idx} className="w-8 h-8 rounded-lg border-2 border-white bg-white shadow-sm flex items-center justify-center overflow-hidden" title={product.name}>
                                                                <img src={getImg(product.images) || "/placeholder.jpg"} alt={product.name} className="w-full h-full object-contain p-0.5" />
                                                            </div>
                                                        );
                                                    })}
                                                    {items.length > 3 && (
                                                        <div className="w-8 h-8 rounded-lg border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-500 flex items-center justify-center shadow-sm">
                                                            +{items.length - 3}
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-[10px] text-slate-400 mt-1 font-medium">{items.length} article(s)</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-1 text-slate-900 font-black">
                                                    <span>{cart.totalAmount}</span>
                                                    <span className="text-[10px]">MAD</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                    <Calendar size={14} />
                                                    {new Date(cart.updatedAt).toLocaleDateString("fr-FR", { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button 
                                                    onClick={() => handleDelete([cart.id])}
                                                    className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}

"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 10;

interface Product {
    id: string;
    name: string;
    brand?: string;
    price: number;
    salePrice?: number;
    stock: number;
    category: { name: string };
    images: any;
}

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const load = useCallback(() => {
        setLoading(true);
        fetch("/api/products")
            .then(r => r.json())
            .then(data => { setProducts(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.brand ?? "").toLowerCase().includes(search.toLowerCase()) ||
        p.category.name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const remove = async (id: string, name: string) => {
        if (!confirm(`Supprimer "${name}" ?`)) return;
        const toastId = toast.loading("Suppression...");
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Produit supprimé", { id: toastId });
            load();
        } else {
            toast.error("Erreur lors de la suppression", { id: toastId });
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Produits</h1>
                    <p className="text-sm text-slate-400 mt-0.5">{products.length} produit{products.length !== 1 ? "s" : ""} en catalogue</p>
                </div>
                <Link href="/admin/products/new"
                    className="flex items-center gap-2 bg-[#2d6a4f] hover:bg-[#245c43] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-[#2d6a4f]/20">
                    <Plus size={18} /> Nouveau produit
                </Link>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input
                    value={search}
                    onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Rechercher par nom, marque ou catégorie..."
                    className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 bg-white"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                            <th className="px-5 py-3 w-16">Image</th>
                            <th className="px-5 py-3">Produit</th>
                            <th className="px-5 py-3">Catégorie</th>
                            <th className="px-5 py-3">Prix</th>
                            <th className="px-5 py-3">Stock</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="py-16 text-center text-slate-400">
                                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                            </td></tr>
                        ) : paginated.length === 0 ? (
                            <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-sm">
                                {search ? "Aucun résultat." : "Aucun produit."}
                            </td></tr>
                        ) : (
                            paginated.map(p => {
                                let img = "";
                                try {
                                    const raw = p.images;
                                    let parsed = raw;

                                    if (typeof raw === "string") {
                                        try {
                                            parsed = JSON.parse(raw);
                                        } catch {
                                            parsed = raw;
                                        }
                                    }

                                    if (Array.isArray(parsed) && parsed.length > 0) {
                                        img = parsed[0];
                                    } else if (typeof parsed === "string" && parsed.length > 5) {
                                        img = parsed;
                                    }
                                } catch (e) { }

                                return (
                                    <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="w-12 h-12 rounded-lg border bg-slate-50 overflow-hidden flex items-center justify-center relative">
                                                {img ? (
                                                    <img src={img} alt={p.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <span className="text-xl">💊</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <p className="font-semibold text-sm text-slate-900 line-clamp-1">{p.name}</p>
                                            <p className="text-xs text-slate-400">{p.brand}</p>
                                        </td>
                                        <td className="px-5 py-3.5 text-sm text-slate-600">{p.category.name}</td>
                                        <td className="px-5 py-3.5">
                                            <span className="font-semibold text-sm">{p.salePrice ?? p.price} MAD</span>
                                            {p.salePrice && <span className="text-xs text-slate-400 line-through ml-1">{p.price}</span>}
                                        </td>
                                        <td className="px-5 py-3.5">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.stock > 10 ? "bg-green-100 text-green-700"
                                                : p.stock > 0 ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-red-100 text-red-700"
                                                }`}>
                                                {p.stock === 0 ? "Rupture" : p.stock}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3.5 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/products/${p.id}/edit`}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-[#2d6a4f] hover:bg-emerald-50 transition-colors">
                                                    <Edit size={16} />
                                                </Link>
                                                <button onClick={() => remove(p.id, p.name)}
                                                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
                        <span className="text-xs text-slate-400">
                            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 transition-colors">
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                <button key={n} onClick={() => setPage(n)}
                                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${n === page ? "bg-[#2d6a4f] text-white" : "border border-slate-200 text-slate-500 hover:bg-white"}`}>
                                    {n}
                                </button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40 transition-colors">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

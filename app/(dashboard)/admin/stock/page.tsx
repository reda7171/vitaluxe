"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Package, AlertTriangle, Search, ChevronLeft, ChevronRight, TrendingDown, RefreshCw } from "lucide-react";
import { toast } from "sonner";

interface Product {
    id: string;
    name: string;
    brand: string | null;
    stock: number;
    category: { name: string };
}

export default function AdminStockPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<"all" | "low" | "out">("all");
    const [page, setPage] = useState(1);
    const PAGE = 15;

    const load = () => {
        setLoading(true);
        fetch("/api/products")
            .then(r => r.json())
            .then(d => { setProducts(d); setLoading(false); });
    };
    useEffect(() => { load(); }, []);

    const updateStock = async (id: string, stock: number) => {
        if (isNaN(stock) || stock < 0) return;
        await fetch(`/api/products/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ stock }),
        });
        toast.success("Stock mis à jour");
        load();
    };

    const filtered = products.filter(p => {
        const matchSearch = (p.name + (p.brand ?? "") + p.category.name).toLowerCase().includes(search.toLowerCase());
        const matchFilter = filter === "all" ? true : filter === "out" ? p.stock === 0 : p.stock > 0 && p.stock <= 10;
        return matchSearch && matchFilter;
    });

    const outOfStock = products.filter(p => p.stock === 0).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
    const paginated = filtered.slice((page - 1) * PAGE, page * PAGE);

    return (
        <div className="space-y-5">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Gestion du Stock</h1>
                <p className="text-sm text-slate-400 mt-0.5">{products.length} produits en catalogue</p>
            </div>

            {/* KPIs stock */}
            <div className="grid grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                    <p className="text-xs text-slate-500">Total produits</p>
                    <p className="text-2xl font-black text-slate-900">{products.length}</p>
                </div>
                <div className={`rounded-2xl border p-4 shadow-sm ${outOfStock > 0 ? "bg-red-50 border-red-200" : "bg-white border-slate-200"}`}>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <AlertTriangle size={12} className={outOfStock > 0 ? "text-red-500" : ""} /> Ruptures
                    </p>
                    <p className={`text-2xl font-black ${outOfStock > 0 ? "text-red-600" : "text-slate-900"}`}>{outOfStock}</p>
                </div>
                <div className={`rounded-2xl border p-4 shadow-sm ${lowStock > 0 ? "bg-orange-50 border-orange-200" : "bg-white border-slate-200"}`}>
                    <p className="text-xs text-slate-500 flex items-center gap-1">
                        <TrendingDown size={12} className={lowStock > 0 ? "text-orange-500" : ""} /> Stock bas (≤10)
                    </p>
                    <p className={`text-2xl font-black ${lowStock > 0 ? "text-orange-600" : "text-slate-900"}`}>{lowStock}</p>
                </div>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Rechercher..."
                        className="w-full pl-9 h-9 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20" />
                </div>
                <div className="flex gap-1">
                    {(["all", "low", "out"] as const).map(f => (
                        <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                            className={`px-3 h-9 rounded-xl text-xs font-semibold transition-colors ${filter === f ? "bg-[#2d6a4f] text-white" : "border border-slate-200 text-slate-500 hover:bg-slate-50"}`}>
                            {f === "all" ? "Tous" : f === "low" ? "Stock bas" : "Rupture"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                            <th className="px-5 py-3">Produit</th>
                            <th className="px-5 py-3">Catégorie</th>
                            <th className="px-5 py-3">Stock actuel</th>
                            <th className="px-5 py-3">Ajuster</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="py-12 text-center text-slate-400 text-sm">Chargement...</td></tr>
                        ) : paginated.map(p => {
                            const isOut = p.stock === 0;
                            const isLow = p.stock > 0 && p.stock <= 10;
                            return (
                                <tr key={p.id} className={`border-b border-slate-100 transition-colors ${isOut ? "bg-red-50/50 hover:bg-red-50" : isLow ? "bg-orange-50/50 hover:bg-orange-50" : "hover:bg-slate-50"}`}>
                                    <td className="px-5 py-3.5">
                                        <p className="font-semibold text-sm text-slate-900">{p.name}</p>
                                        <p className="text-xs text-slate-400">{p.brand}</p>
                                    </td>
                                    <td className="px-5 py-3.5 text-sm text-slate-500">{p.category.name}</td>
                                    <td className="px-5 py-3.5">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isOut ? "bg-red-100 text-red-700" : isLow ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"}`}>
                                            {isOut ? "Rupture" : p.stock}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <QuickStockInput id={p.id} current={p.stock} onSave={updateStock} />
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
                        <span className="text-xs text-slate-400">{filtered.length} produits</span>
                        <div className="flex gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-white">
                                <ChevronLeft size={14} />
                            </button>
                            <span className="px-3 py-1 text-xs text-slate-600">{page}/{totalPages}</span>
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="p-1.5 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-white">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function QuickStockInput({ id, current, onSave }: { id: string; current: number; onSave: (id: string, v: number) => void }) {
    const [val, setVal] = useState(current);
    useEffect(() => { setVal(current); }, [current]);
    return (
        <div className="flex items-center gap-1.5">
            <input type="number" value={val} min={0} onChange={e => setVal(Number(e.target.value))}
                className="w-20 h-8 px-2 rounded-lg border border-slate-200 text-sm text-center focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20" />
            {val !== current && (
                <button onClick={() => onSave(id, val)}
                    className="p-1.5 rounded-lg bg-[#2d6a4f] text-white hover:bg-[#245c43] transition-colors">
                    <RefreshCw size={12} />
                </button>
            )}
        </div>
    );
}

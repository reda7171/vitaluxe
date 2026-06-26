"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Loader2, Percent, X } from "lucide-react";
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
    const [categories, setCategories] = useState<{ id: string, name: string }[]>([]);
    const [availableBrands, setAvailableBrands] = useState<{ id: string, name: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedBrand, setSelectedBrand] = useState("all");
    const [stockFilter, setStockFilter] = useState("all");
    const [promoFilter, setPromoFilter] = useState("all");
    const [updatingPromo, setUpdatingPromo] = useState(false);

    const load = useCallback(() => {
        setLoading(true);
        Promise.all([
            fetch("/api/products").then(r => r.json()),
            fetch("/api/categories").then(r => r.json()),
            fetch("/api/admin/brands").then(r => r.json())
        ])
        .then(([productsData, categoriesData, brandsData]) => {
            setProducts(productsData);
            setCategories(categoriesData);
            setAvailableBrands(brandsData);
            setLoading(false);
        })
        .catch(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const filtered = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
            (p.brand ?? "").toLowerCase().includes(search.toLowerCase()) ||
            p.category.name.toLowerCase().includes(search.toLowerCase());
        
        const matchesCategory = selectedCategory === "all" || p.category.name === selectedCategory;
        const matchesBrand = selectedBrand === "all" || (p.brand || "") === selectedBrand;
        
        const matchesStock = stockFilter === "all" || (
            stockFilter === "in_stock" ? p.stock > 10 :
            stockFilter === "low_stock" ? (p.stock > 0 && p.stock <= 10) :
            stockFilter === "out_of_stock" ? p.stock === 0 : true
        );

        const matchesPromo = promoFilter === "all" || (
            promoFilter === "on_sale" ? (!!p.salePrice && p.salePrice < p.price) :
            promoFilter === "no_sale" ? !p.salePrice : true
        );

        return matchesSearch && matchesCategory && matchesBrand && matchesStock && matchesPromo;
    });

    const brands = Array.from(new Set([
        ...availableBrands.map(b => b.name),
        ...products.map(p => p.brand).filter(Boolean)
    ])) as string[];

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const remove = async (id: string, name: string) => {
        if (!confirm(`Supprimer "${name}" ?`)) return;
        const toastId = toast.loading("Suppression...");
        const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Produit supprimé", { id: toastId });
            setSelectedIds(prev => prev.filter(i => i !== id));
            load();
        } else {
            toast.error("Erreur lors de la suppression", { id: toastId });
        }
    };

    const removeMultiple = async () => {
        if (!confirm(`Supprimer les ${selectedIds.length} produits sélectionnés ?`)) return;
        const toastId = toast.loading("Suppression multiple...");
        try {
            const res = await fetch("/api/products/bulk", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds })
            });
            if (res.ok) {
                toast.success("Produits supprimés", { id: toastId });
                setSelectedIds([]);
                load();
            } else {
                toast.error("Erreur lors de la suppression multiple", { id: toastId });
            }
        } catch (e) {
            toast.error("Une erreur est survenue", { id: toastId });
        }
    };

    const toggleSelectAll = () => {
        const allOnPageSelected = paginated.length > 0 && paginated.every(p => selectedIds.includes(p.id));
        if (allOnPageSelected) {
            setSelectedIds(prev => prev.filter(id => !paginated.some(p => p.id === id)));
        } else {
            const newIds = paginated.filter(p => !selectedIds.includes(p.id)).map(p => p.id);
            setSelectedIds(prev => [...prev, ...newIds]);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const applyBulkPromo = async () => {
        const pct = prompt("Pourcentage de réduction à appliquer (ex: 20) :", "20");
        if (!pct || isNaN(Number(pct))) return;
        
        setUpdatingPromo(true);
        const toastId = toast.loading("Application de la promotion...");
        try {
            const res = await fetch("/api/products/bulk", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds, discountPercent: Number(pct) })
            });
            if (res.ok) {
                toast.success(`Promotion de ${pct}% appliquée`, { id: toastId });
                setSelectedIds([]);
                load();
            } else {
                toast.error("Erreur lors de l'application", { id: toastId });
            }
        } catch (e) {
            toast.error("Une erreur est survenue", { id: toastId });
        } finally {
            setUpdatingPromo(false);
        }
    };

    const clearBulkPromo = async () => {
        if (!confirm(`Retirer les promotions des ${selectedIds.length} produits ?`)) return;
        
        setUpdatingPromo(true);
        const toastId = toast.loading("Retrait des promotions...");
        try {
            const res = await fetch("/api/products/bulk", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds, clear: true })
            });
            if (res.ok) {
                toast.success("Promotions retirées", { id: toastId });
                setSelectedIds([]);
                load();
            } else {
                toast.error("Erreur lors du retrait", { id: toastId });
            }
        } catch (e) {
            toast.error("Une erreur est survenue", { id: toastId });
        } finally {
            setUpdatingPromo(false);
        }
    };

    return (
        <div className="space-y-5">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Produits</h1>
                    <p className="text-sm text-slate-400 mt-0.5">
                        {filtered.length === products.length 
                            ? `${products.length} produit${products.length !== 1 ? "s" : ""} en catalogue`
                            : `${filtered.length} produit${filtered.length !== 1 ? "s" : ""} trouvé${filtered.length !== 1 ? "s" : ""} (sur ${products.length})`
                        }
                    </p>
                </div>
                <div className="flex items-center flex-wrap gap-3 w-full sm:w-auto">
                    {selectedIds.length > 0 && (
                        <>
                            <button onClick={applyBulkPromo} disabled={updatingPromo}
                                className="flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-amber-500/20">
                                <Percent size={18} /> Promo
                            </button>
                            <button onClick={clearBulkPromo} disabled={updatingPromo}
                                className="flex justify-center items-center gap-2 bg-slate-600 hover:bg-slate-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-slate-600/20">
                                <X size={18} /> RAZ Promo
                            </button>
                            <button onClick={removeMultiple} disabled={updatingPromo}
                                className="flex justify-center items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-red-600/20">
                                <Trash2 size={18} /> Suppr. ({selectedIds.length})
                            </button>
                        </>
                    )}
                    <Link href="/admin/products/new"
                        className="flex justify-center items-center gap-2 bg-[#2d6a4f] hover:bg-[#245c43] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors shadow-md shadow-[#2d6a4f]/20 w-full sm:w-auto">
                        <Plus size={18} /> Nouveau produit
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <input
                        value={search}
                        onChange={e => { setSearch(e.target.value); setPage(1); }}
                        placeholder="Rechercher par nom, marque ou catégorie..."
                        className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 bg-white"
                    />
                </div>
                <div className="flex flex-wrap gap-3">
                    <select
                        value={selectedCategory}
                        onChange={e => { setSelectedCategory(e.target.value); setPage(1); }}
                        className="h-10 px-3 pr-8 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 bg-white cursor-pointer"
                    >
                        <option value="all">Toutes les catégories</option>
                        {categories.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                        ))}
                    </select>
                    <select
                        value={selectedBrand}
                        onChange={e => { setSelectedBrand(e.target.value); setPage(1); }}
                        className="h-10 px-3 pr-8 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 bg-white cursor-pointer"
                    >
                        <option value="all">Toutes les marques</option>
                        {brands.sort().map(b => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                    <select
                        value={stockFilter}
                        onChange={e => { setStockFilter(e.target.value); setPage(1); }}
                        className="h-10 px-3 pr-8 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 bg-white cursor-pointer"
                    >
                        <option value="all">Tous les stocks</option>
                        <option value="in_stock">En stock</option>
                        <option value="low_stock">Stock bas (≤10)</option>
                        <option value="out_of_stock">En rupture</option>
                    </select>
                    <select
                        value={promoFilter}
                        onChange={e => { setPromoFilter(e.target.value); setPage(1); }}
                        className="h-10 px-3 pr-8 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 bg-white cursor-pointer"
                    >
                        <option value="all">Toutes offres</option>
                        <option value="on_sale">En promotion</option>
                        <option value="no_sale">Prix normal</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto hide-scrollbar">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                                <th className="px-5 py-3 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-slate-300 text-[#2d6a4f] focus:ring-[#2d6a4f]/20 cursor-pointer"
                                        checked={paginated.length > 0 && paginated.every(p => selectedIds.includes(p.id))}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
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
                                        <tr key={p.id} className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${selectedIds.includes(p.id) ? "bg-emerald-50/30" : p.salePrice ? "bg-amber-50/20" : ""}`}>
                                            <td className="px-5 py-3">
                                                <input 
                                                    type="checkbox" 
                                                    className="w-4 h-4 rounded border-slate-300 text-[#2d6a4f] focus:ring-[#2d6a4f]/20 cursor-pointer"
                                                    checked={selectedIds.includes(p.id)}
                                                    onChange={() => toggleSelect(p.id)}
                                                />
                                            </td>
                                            <td className="px-5 py-3">
                                                <div className="w-12 h-12 rounded-lg border bg-slate-50 overflow-hidden flex items-center justify-center relative">
                                                    {img ? (
                                                        <img 
                                                            src={img} 
                                                            alt={p.name} 
                                                            className="w-full h-full object-cover" 
                                                        />
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
                                                <span className={`font-semibold text-sm ${p.salePrice ? "text-amber-600" : ""}`}>{p.salePrice ?? p.price} MAD</span>
                                                {p.salePrice && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[10px] text-slate-400 line-through">{p.price}</span>
                                                        <span className="text-[10px] font-bold text-amber-500">-{Math.round((1 - p.salePrice/p.price) * 100)}%</span>
                                                    </div>
                                                )}
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
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 sm:py-3 border-t border-slate-100 bg-slate-50 gap-4 sm:gap-0">
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

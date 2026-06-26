"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    images?: string[];
    brand?: string;
    category: { name: string };
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

function useDebounce<T>(value: T, delay: number): T {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timer);
    }, [value, delay]);
    return debounced;
}

export function SearchBar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCat, setSelectedCat] = useState("");
    const [catOpen, setCatOpen] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const catRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const debouncedQuery = useDebounce(query, 300);

    // Charger les catégories une seule fois
    useEffect(() => {
        fetch("/api/categories")
            .then((r) => r.json())
            .then((data: Category[]) => setCategories(data))
            .catch(() => {});
    }, []);

    // Fermer dropdown catégorie si clic extérieur
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (catRef.current && !catRef.current.contains(e.target as Node)) {
                setCatOpen(false);
            }
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }
        setLoading(true);
        const params = new URLSearchParams({ q: debouncedQuery });
        if (selectedCat) params.set("category", selectedCat);
        fetch(`/api/search?${params}`)
            .then((r) => r.json())
            .then((data) => {
                setResults(data);
                setOpen(true);
                setActiveIndex(-1);
            })
            .finally(() => setLoading(false));
    }, [debouncedQuery, selectedCat]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;
        if (e.key === "ArrowDown") {
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            setActiveIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === "Enter") {
            if (activeIndex >= 0 && results[activeIndex]) {
                router.push(`/product/${results[activeIndex].slug}`);
                setOpen(false); setQuery("");
            } else if (query.trim()) {
                const url = selectedCat
                    ? `/shop?search=${encodeURIComponent(query)}&category=${selectedCat}`
                    : `/shop?search=${encodeURIComponent(query)}`;
                router.push(url);
                setOpen(false);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    const clear = () => {
        setQuery(""); setResults([]); setOpen(false);
        inputRef.current?.focus();
    };

    const selectedLabel = categories.find(c => c.slug === selectedCat)?.name || "Toutes";

    return (
        <div ref={containerRef} className="relative w-full max-w-2xl">
            {/* Input row */}
            <div className="flex items-center bg-white border border-slate-200 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-[#103178]/30 transition-all overflow-hidden">

                {/* ── Catégorie dropdown ── */}
                <div ref={catRef} className="relative shrink-0">
                    <button
                        type="button"
                        onClick={() => setCatOpen((v) => !v)}
                        className="flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold text-slate-700 border-r border-slate-200 hover:bg-slate-50 transition-colors whitespace-nowrap h-full"
                        aria-haspopup="listbox"
                    >
                        <span className="max-w-[90px] truncate">{selectedLabel}</span>
                        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`} />
                    </button>

                    {catOpen && (
                        <div className="absolute left-0 top-full mt-2 w-52 bg-white border border-slate-100 rounded-2xl shadow-xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                            <ul className="max-h-72 overflow-y-auto py-1">
                                <li>
                                    <button
                                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${selectedCat === "" ? "text-[#103178] font-bold" : "text-slate-700"}`}
                                        onClick={() => { setSelectedCat(""); setCatOpen(false); }}
                                    >
                                        Toutes les catégories
                                    </button>
                                </li>
                                {categories.map((cat) => (
                                    <li key={cat.id}>
                                        <button
                                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-blue-50 transition-colors ${selectedCat === cat.slug ? "text-[#103178] font-bold bg-blue-50" : "text-slate-700"}`}
                                            onClick={() => { setSelectedCat(cat.slug); setCatOpen(false); }}
                                        >
                                            {cat.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* ── Icône recherche ── */}
                <div className="pl-4 shrink-0">
                    {loading ? (
                        <Loader2 size={17} className="text-slate-400 animate-spin" />
                    ) : (
                        <Search size={17} className="text-slate-400" />
                    )}
                </div>

                {/* ── Input ── */}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => results.length > 0 && setOpen(true)}
                    placeholder="Rechercher un produit, une marque..."
                    className="flex-1 px-3 py-2.5 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                />

                {query && (
                    <button onClick={clear} className="pr-4 text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* ── Résultats dropdown ── */}
            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {results.length === 0 ? (
                        <div className="px-6 py-8 text-center text-slate-400 text-sm">
                            Aucun résultat pour &quot;<strong>{query}</strong>&quot;
                            {selectedCat && <span className="block mt-1 text-xs">dans la catégorie <strong>{selectedLabel}</strong></span>}
                        </div>
                    ) : (
                        <>
                            {selectedCat && (
                                <div className="px-4 py-2 bg-blue-50 border-b border-blue-100">
                                    <span className="text-xs font-semibold text-[#103178]">Catégorie : {selectedLabel}</span>
                                </div>
                            )}
                            <ul>
                                {results.map((product, i) => {
                                    const image = Array.isArray(product.images) && product.images[0];
                                    return (
                                        <li key={product.id}>
                                            <Link
                                                href={`/product/${product.slug}`}
                                                onClick={() => { setOpen(false); setQuery(""); }}
                                                className={`flex items-center gap-4 px-4 py-3 hover:bg-blue-50 transition-colors ${i === activeIndex ? "bg-blue-50" : ""}`}
                                            >
                                                <div className="w-12 h-12 rounded-lg bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                                                    {image ? (
                                                        <img src={image} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <span className="text-2xl">💊</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
                                                    <p className="text-xs text-slate-400">{product.brand || product.category.name}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    {product.salePrice ? (
                                                        <>
                                                            <p className="text-sm font-bold text-red-500">{product.salePrice} MAD</p>
                                                            <p className="text-xs text-slate-400 line-through">{product.price} MAD</p>
                                                        </>
                                                    ) : (
                                                        <p className="text-sm font-bold text-[#103178]">{product.price} MAD</p>
                                                    )}
                                                </div>
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                            <div className="border-t border-slate-100 px-4 py-2">
                                <Link
                                    href={selectedCat
                                        ? `/shop?search=${encodeURIComponent(query)}&category=${selectedCat}`
                                        : `/shop?search=${encodeURIComponent(query)}`}
                                    onClick={() => setOpen(false)}
                                    className="block text-center text-sm text-[#103178] font-semibold hover:underline py-1"
                                >
                                    Voir tous les résultats pour &quot;{query}&quot;
                                </Link>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}

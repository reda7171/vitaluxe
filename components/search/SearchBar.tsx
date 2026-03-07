"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2, X } from "lucide-react";
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
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const debouncedQuery = useDebounce(query, 300);

    useEffect(() => {
        if (debouncedQuery.length < 2) {
            setResults([]);
            setOpen(false);
            return;
        }
        setLoading(true);
        fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
            .then((r) => r.json())
            .then((data) => {
                setResults(data);
                setOpen(true);
                setActiveIndex(-1);
            })
            .finally(() => setLoading(false));
    }, [debouncedQuery]);

    // Fermer si clic extérieur
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;
        if (e.key === "ArrowDown") {
            setActiveIndex((i) => Math.min(i + 1, results.length - 1));
        } else if (e.key === "ArrowUp") {
            setActiveIndex((i) => Math.max(i - 1, -1));
        } else if (e.key === "Enter") {
            if (activeIndex >= 0 && results[activeIndex]) {
                router.push(`/product/${results[activeIndex].slug}`);
                setOpen(false);
                setQuery("");
            } else if (query.trim()) {
                router.push(`/shop?search=${encodeURIComponent(query)}`);
                setOpen(false);
            }
        } else if (e.key === "Escape") {
            setOpen(false);
        }
    };

    const clear = () => {
        setQuery("");
        setResults([]);
        setOpen(false);
        inputRef.current?.focus();
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-xl">
            {/* Input */}
            <div className="flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm focus-within:ring-2 focus-within:ring-[#103178]/30 transition-all">
                {loading ? (
                    <Loader2 size={18} className="text-slate-400 animate-spin shrink-0" />
                ) : (
                    <Search size={18} className="text-slate-400 shrink-0" />
                )}
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => results.length > 0 && setOpen(true)}
                    placeholder="Rechercher un produit, une marque..."
                    className="flex-1 ml-3 bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400"
                />
                {query && (
                    <button onClick={clear} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Dropdown */}
            {open && (
                <div className="absolute z-50 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                    {results.length === 0 ? (
                        <div className="px-6 py-8 text-center text-slate-400 text-sm">
                            Aucun résultat pour &quot;<strong>{query}</strong>&quot;
                        </div>
                    ) : (
                        <>
                            <ul>
                                {results.map((product, i) => {
                                    const image = Array.isArray(product.images) && product.images[0];
                                    return (
                                        <li key={product.id}>
                                            <Link
                                                href={`/product/${product.slug}`}
                                                onClick={() => { setOpen(false); setQuery(""); }}
                                                className={`flex items-center gap-4 px-4 py-3 hover:bg-blue-50 transition-colors ${i === activeIndex ? "bg-blue-50" : ""
                                                    }`}
                                            >
                                                {/* Image ou placeholder */}
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
                            {/* Voir tous */}
                            <div className="border-t border-slate-100 px-4 py-2">
                                <Link
                                    href={`/shop?search=${encodeURIComponent(query)}`}
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

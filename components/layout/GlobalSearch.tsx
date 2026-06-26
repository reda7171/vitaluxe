"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2, ChevronDown, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Suggestion {
    id: string;
    name: string;
    slug: string;
    images: unknown;
    price: number;
    salePrice: number | null;
    brand: string | null;
}

const CATEGORIES = ["Toutes", "Visage", "Corps", "Cheveux", "Solaire", "Anti-Âge"];

export function GlobalSearch() {
    const [popularSearches, setPopularSearches] = useState<string[]>([]);
    
    useEffect(() => {
        fetch("/api/products/popular")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setPopularSearches(data);
                }
            })
            .catch(() => {});
    }, []);

    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("Toutes");
    const [results, setResults] = useState<Suggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (query.length < 2) { setResults([]); return; }
        const t = setTimeout(async () => {
            setLoading(true);
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}${category !== 'Toutes' ? `&cat=${encodeURIComponent(category)}` : ''}`);
            const data = await res.json();
            setResults(data);
            setLoading(false);
        }, 300);
        return () => clearTimeout(t);
    }, [query, category]);

    const getImage = (images: unknown): string | null => {
        if (Array.isArray(images) && images.length > 0) return images[0] as string;
        if (typeof images === "string") { try { const p = JSON.parse(images) as string[]; return p[0] ?? null; } catch { return null; } }
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim() || category !== "Toutes") {
            const url = `/shop?`;
            const params = new URLSearchParams();
            if (query.trim()) params.append("search", query);
            if (category !== "Toutes") params.append("cat", category);
            router.push(url + params.toString());
            setOpen(false);
        }
    };

    const handleFocus = () => {
        setOpen(true);
    };

    return (
        <div ref={ref} className="relative w-full max-w-2xl">
            <form onSubmit={handleSubmit} className="flex relative items-center rounded-2xl border-2 border-slate-200 bg-white shadow-sm focus-within:border-[#103178]/40 focus-within:ring-4 focus-within:ring-[#103178]/10 transition-all h-12">

                {/* Category Dropdown (Desktop) */}
                <div className="relative hidden sm:flex items-center h-full border-r border-slate-200">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="h-full pl-4 pr-8 bg-slate-50 text-slate-600 text-sm font-semibold rounded-l-2xl appearance-none outline-none cursor-pointer hover:bg-slate-100 transition-colors"
                    >
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>

                {/* Input Field */}
                <div className="relative flex-1 h-full">
                    <input
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        onFocus={handleFocus}
                        placeholder={category === "Toutes" ? "Chercher un produit, une marque..." : `Rechercher dans ${category}...`}
                        className="w-full h-full px-4 text-sm bg-transparent outline-none disabled:opacity-50"
                    />
                    {query && (
                        <button type="button" onClick={() => { setQuery(""); setResults([]); }}
                            className="absolute right-0 top-0 h-full px-3 text-slate-400 hover:text-slate-600 bg-white">
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Submit Button */}
                <button type="submit" disabled={loading} className="h-full px-6 bg-[#103178] text-white rounded-r-[14px] flex items-center justify-center hover:bg-[#1a4db8] transition-colors">
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                </button>
            </form>

            {/* Dropdown Results & Suggestions */}
            {open && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-2xl border border-slate-200 shadow-xl z-50 overflow-hidden">

                    {/* Empty State: Popular Searches */}
                    {query.length < 2 && (
                        <div className="p-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-3">
                                <TrendingUp size={14} /> Recherches populaires
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {popularSearches.map((term: string) => (
                                    <button
                                        key={term}
                                        onClick={() => { setQuery(term); document.querySelector('form')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true })); }}
                                        className="text-xs font-semibold px-3 py-1.5 bg-slate-50 text-slate-600 rounded-full border hover:border-[#103178]/30 hover:bg-[#103178]/5 transition-colors"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Results Box */}
                    {query.length >= 2 && results.length > 0 && (
                        <div className="py-2">
                            {results.map(p => {
                                const img = getImage(p.images);
                                return (
                                    <Link key={p.id} href={`/product/${p.slug}`}
                                        onClick={() => { setOpen(false); setQuery(""); }}
                                        className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors group">
                                        <div className="w-12 h-12 rounded-xl border bg-slate-100 shrink-0 overflow-hidden relative">
                                            {img ? (
                                                <img 
                                                    src={img} 
                                                    alt={p.name} 
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                                                />
                                            ) : (
                                                <span className="text-xl flex items-center justify-center h-full">💊</span>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-slate-800 truncate group-hover:text-[#103178] transition-colors">{p.name}</p>
                                            <p className="text-[11px] font-bold tracking-widest uppercase text-slate-400 mt-0.5">{p.brand}</p>
                                        </div>
                                        <span className="text-sm font-black text-[#103178] shrink-0 bg-blue-50 px-2 py-1 rounded-lg">
                                            {p.salePrice ?? p.price} MAD
                                        </span>
                                    </Link>
                                );
                            })}
                            <div className="px-4 py-3 border-t bg-slate-50 mt-2">
                                <Link href={`/shop?search=${encodeURIComponent(query)}${category !== "Toutes" ? `&cat=${encodeURIComponent(category)}` : ""}`}
                                    onClick={() => setOpen(false)}
                                    className="flex items-center justify-center w-full bg-white border border-slate-200 shadow-sm rounded-xl py-2.5 text-sm font-bold text-[#103178] hover:border-[#103178]/20 transition-colors">
                                    Voir tous les résultats pour &ldquo;{query}&rdquo; →
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* No Results */}
                    {query.length >= 2 && !loading && results.length === 0 && (
                        <div className="px-4 py-8 text-center flex flex-col items-center justify-center opacity-80">
                            <Search className="h-10 w-10 text-slate-200 mb-3" />
                            <p className="text-sm font-semibold text-slate-800">Aucun produit trouvé</p>
                            <p className="text-xs text-slate-400 mt-1">Essayez peut-être d&apos;autres mots-clés ou vérifiez l&apos;orthographe.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

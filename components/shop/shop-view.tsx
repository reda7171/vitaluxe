"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, Grid3X3, List, ShoppingCart, Heart, Sparkles, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import { useWishlist } from "@/lib/context/wishlist-context";
import { toast } from "sonner";
import type { Product } from "@/lib/data/products";

interface DbProduct {
    id: string;
    name: string;
    slug: string;
    description?: string;
    price: number;
    salePrice?: number;
    stock: number;
    images: string[];
    brand: string;
    category: string;
    categoryId: string;
}

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface ShopViewProps {
    products: DbProduct[];
    categories: Category[];
}

// Adapter DB product -> CartContext Product type
function toCartProduct(p: DbProduct): Product {
    return {
        id: p.id as unknown as number,
        name: p.name,
        slug: p.slug,
        description: p.description ?? "",
        price: p.price,
        salePrice: p.salePrice ?? null,
        images: p.images,
        brand: p.brand,
        category: p.category,
        inStock: p.stock > 0,
        stock: p.stock,
        badge: undefined,
        rating: 0,
        reviewCount: 0,
    } as unknown as Product;
}

export function ShopView({ products, categories }: ShopViewProps) {
    const searchParams = useSearchParams();
    const { addItem } = useCart();
    const { items: wishlist, toggleWishlist } = useWishlist();

    const [search, setSearch] = useState(searchParams.get("search") ?? "");
    const initCat = searchParams.get("cat");
    const [selectedCats, setSelectedCats] = useState<string[]>(initCat ? [initCat] : []);
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("newest");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [maxPrice, setMaxPrice] = useState(10000);

    // Unique brands
    const brands = useMemo(() => Array.from(new Set(products.map(p => p.brand).filter(Boolean))).sort(), [products]);

    const filtered = useMemo(() => {
        let list = products;
        if (search) list = list.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand?.toLowerCase().includes(search.toLowerCase()));
        if (selectedCats.length > 0) list = list.filter((p) => selectedCats.includes(p.category));
        if (selectedBrands.length > 0) list = list.filter((p) => selectedBrands.includes(p.brand));
        list = list.filter((p) => (p.salePrice ?? p.price) <= maxPrice);
        switch (sortBy) {
            case "price-asc": return [...list].sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
            case "price-desc": return [...list].sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
            case "instock": return list.filter((p) => p.stock > 0);
            default: return list;
        }
    }, [products, search, selectedCats, selectedBrands, sortBy, maxPrice]);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#103178] to-[#1a4db8] text-white py-12 px-6">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-extrabold mb-2">Notre Boutique</h1>
                    <p className="text-blue-200">{products.length} produits parapharmaceutiques authentiques · Livraison 48h</p>
                </div>
            </section>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 flex gap-8">
                {/* Sidebar filtres */}
                <aside className="w-64 shrink-0 space-y-6 hidden lg:block">
                    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
                        <h2 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <SlidersHorizontal size={18} /> Filtres
                        </h2>

                        <div className="mb-4">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2 block">Recherche</label>
                            <div className="relative">
                                <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Nom, marque..."
                                    className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#103178]/30"
                                />
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 block">Catégories</label>
                            <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                {categories.map((cat) => (
                                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedCats.includes(cat.name) ? "bg-[#103178] border-[#103178]" : "border-slate-300 group-hover:border-[#103178]"}`}>
                                            {selectedCats.includes(cat.name) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                        </div>
                                        <input type="checkbox" className="hidden" checked={selectedCats.includes(cat.name)} onChange={() => setSelectedCats(prev => prev.includes(cat.name) ? prev.filter(c => c !== cat.name) : [...prev, cat.name])} />
                                        <span className={`text-sm ${selectedCats.includes(cat.name) ? "text-[#103178] font-medium" : "text-slate-600"}`}>{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Marques */}
                        {brands.length > 0 && (
                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 block">Marques</label>
                                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                                    {brands.map((brand) => (
                                        <label key={brand} className="flex items-center gap-2 cursor-pointer group">
                                            <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedBrands.includes(brand!) ? "bg-[#103178] border-[#103178]" : "border-slate-300 group-hover:border-[#103178]"}`}>
                                                {selectedBrands.includes(brand!) && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                                            </div>
                                            <input type="checkbox" className="hidden" checked={selectedBrands.includes(brand!)} onChange={() => setSelectedBrands(prev => prev.includes(brand!) ? prev.filter(b => b !== brand!) : [...prev, brand!])} />
                                            <span className={`text-sm ${selectedBrands.includes(brand!) ? "text-[#103178] font-medium" : "text-slate-600 truncate"}`}>{brand}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mb-6">
                            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 flex justify-between">
                                <span>Prix max :</span>
                                <span className="text-[#103178]">{maxPrice === 10000 ? "Illimité" : `${maxPrice} Dhs`}</span>
                            </label>
                            <input
                                type="range" min={0} max={10000} step={50} value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#103178]"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-2">
                                <span>0 Dhs</span>
                                <span>10 000 Dhs</span>
                            </div>
                        </div>

                        {/* Reset */}
                        {(selectedCats.length > 0 || selectedBrands.length > 0 || maxPrice < 10000 || search) && (
                            <button
                                onClick={() => { setSearch(""); setSelectedCats([]); setSelectedBrands([]); setMaxPrice(10000); }}
                                className="w-full text-sm font-semibold text-rose-500 hover:text-white border border-rose-200 hover:bg-rose-500 rounded-lg py-2.5 transition-colors mt-4 shadow-sm"
                            >
                                ✕ Réinitialiser les filtres
                            </button>
                        )}
                    </div>
                </aside>

                {/* Produits */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-slate-200 px-4 py-3 shadow-sm">
                        <span className="text-sm text-slate-500">{filtered.length} résultat{filtered.length !== 1 ? "s" : ""}</span>
                        <div className="flex items-center gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none"
                            >
                                <option value="newest">Plus récents</option>
                                <option value="price-asc">Prix croissant</option>
                                <option value="price-desc">Prix décroissant</option>
                                <option value="instock">En stock</option>
                            </select>
                            <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded ${viewMode === "grid" ? "bg-slate-100" : ""}`}>
                                <Grid3X3 size={18} className="text-slate-600" />
                            </button>
                            <button onClick={() => setViewMode("list")} className={`p-1.5 rounded ${viewMode === "list" ? "bg-slate-100" : ""}`}>
                                <List size={18} className="text-slate-600" />
                            </button>
                        </div>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="space-y-12">
                            {/* Empty State Message */}
                            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                                <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search size={24} className="text-slate-300" />
                                </div>
                                <p className="text-lg font-bold text-slate-800">Aucun produit trouvé</p>
                                <p className="text-sm text-slate-500 mt-1 mb-6">Essayez de modifier vos filtres ou d&apos;élargir votre recherche.</p>
                                <button
                                    onClick={() => { setSearch(""); setSelectedCats([]); setSelectedBrands([]); setMaxPrice(10000); }}
                                    className="px-6 py-2.5 bg-[#103178] text-white font-semibold rounded-xl hover:bg-[#1a4fa0] transition-colors"
                                >
                                    Réinitialiser les filtres
                                </button>
                            </div>

                            {/* Recommendations */}
                            {products.length > 0 && (
                                <div className="pt-8 border-t border-slate-200">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-bold flex items-center gap-2 text-slate-900 text-lg">
                                            <Sparkles className="h-5 w-5 text-[#103178]" />
                                            Vous pourriez aussi aimer
                                        </h3>
                                        <button onClick={() => { setSearch(""); setSelectedCats([]); setSelectedBrands([]); setMaxPrice(10000); }} className="text-sm text-[#103178] font-semibold flex items-center gap-1 hover:underline">
                                            Voir tout <ArrowRight className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {products.slice(0, 4).map((product) => {
                                            const image = product.images?.[0];
                                            const inWishlist = wishlist.includes(product.id);
                                            return (
                                                <div key={product.id} className="group bg-white rounded-2xl border border-slate-200 p-3 hover:shadow-lg transition-all flex flex-col justify-between h-full">
                                                    <div>
                                                        <Link href={`/product/${product.slug}`} className="block aspect-square overflow-hidden rounded-xl bg-slate-50 mb-3 relative">
                                                            {image ? (
                                                                <Image src={image} alt={product.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 50vw, 25vw" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-4xl">💊</div>
                                                            )}
                                                        </Link>
                                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#103178]">{product.brand}</p>
                                                        <Link href={`/product/${product.slug}`}>
                                                            <p className="text-sm font-semibold text-slate-900 line-clamp-2 mt-1 leading-snug hover:text-[#103178] transition-colors">{product.name}</p>
                                                        </Link>
                                                        <p className="text-sm font-extrabold mt-2 text-slate-900">{product.salePrice ?? product.price} Dhs</p>
                                                    </div>
                                                    <button
                                                        onClick={() => toggleWishlist(product.id, product.name)}
                                                        className={`mt-4 w-full flex items-center justify-center gap-2 text-sm font-semibold rounded-xl py-2.5 transition-all border ${inWishlist ? "border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"}`}
                                                    >
                                                        <Heart size={16} className={inWishlist ? "fill-current" : ""} />
                                                        {inWishlist ? "Retirer des favoris" : "Ajouter aux favoris"}
                                                    </button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={viewMode === "grid" ? "grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4" : "space-y-3"}>
                            {filtered.map((product) => {
                                const image = product.images?.[0];
                                const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;
                                const inWishlist = wishlist.includes(product.id);
                                const lowStock = product.stock > 0 && product.stock <= 5;
                                return (
                                    <div key={product.id} className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group relative ${viewMode === "list" ? "flex gap-4" : "flex flex-col h-full"}`}>
                                        {/* Wishlist button */}
                                        <button
                                            onClick={() => toggleWishlist(product.id, product.name)}
                                            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 backdrop-blur-sm shadow-sm hover:scale-110 transition-transform"
                                        >
                                            <Heart size={15} className={inWishlist ? "fill-red-500 text-red-500" : "text-slate-400"} />
                                        </button>

                                        <Link href={`/product/${product.slug}`} className={viewMode === "list" ? "shrink-0 w-32 h-32 relative" : "block aspect-square relative"}>
                                            {image ? (
                                                <Image src={image} alt={product.name} fill unoptimized className="object-cover group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 768px) 50vw, 25vw" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-4xl">💊</div>
                                            )}
                                        </Link>
                                        <div className="p-4 flex flex-col justify-between flex-1">
                                            <div>
                                                <div className="flex gap-1 mb-1">
                                                    {discount > 0 && (
                                                        <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
                                                    )}
                                                    {lowStock && (
                                                        <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-2 py-0.5 rounded-full">Plus que {product.stock} !</span>
                                                    )}
                                                    {product.stock === 0 && (
                                                        <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">Rupture</span>
                                                    )}
                                                </div>
                                                <Link href={`/product/${product.slug}`}>
                                                    <h3 className="font-semibold text-slate-900 text-sm leading-tight hover:text-[#103178] transition-colors line-clamp-2">{product.name}</h3>
                                                </Link>
                                                <p className="text-xs text-slate-400 mt-0.5">{product.brand}</p>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between">
                                                <div>
                                                    {product.salePrice ? (
                                                        <>
                                                            <span className="font-bold text-red-500">{product.salePrice} MAD</span>
                                                            <span className="text-xs text-slate-400 line-through ml-1">{product.price} MAD</span>
                                                        </>
                                                    ) : (
                                                        <span className="font-bold text-[#103178]">{product.price} MAD</span>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => { addItem(toCartProduct(product)); toast.success(`${product.name} ajouté au panier`); }}
                                                    disabled={product.stock === 0}
                                                    className="p-2 bg-[#103178] text-white rounded-full hover:bg-[#0d266b] transition-colors disabled:opacity-40"
                                                >
                                                    <ShoppingCart size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

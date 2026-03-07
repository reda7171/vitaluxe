"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Package, Tag, ShieldCheck, Truck, CreditCard, CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/context/cart-context";
import type { Product as CartProduct } from "@/lib/data/products";

interface DbProduct {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    salePrice?: number;
    stock: number;
    images: string[];
    brand: string;
    category: string;
}

interface RelatedProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    images: string[];
    brand: string;
    category: string;
}

function toCartProduct(p: DbProduct): CartProduct {
    return {
        id: p.id as unknown as number,
        name: p.name,
        slug: p.slug,
        description: p.description,
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
    } as unknown as CartProduct;
}

export function ProductDetailView({ product, related }: { product: DbProduct; related: RelatedProduct[] }) {
    const { addItem } = useCart();
    const [activeImage, setActiveImage] = useState(0);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState<'desc' | 'info'>('desc');

    const images: string[] = (() => {
        const raw = product.images;
        if (Array.isArray(raw)) return raw as string[];
        if (typeof raw === "string") {
            try { return JSON.parse(raw) as string[]; } catch { return []; }
        }
        return [];
    })();
    const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

    return (
        <main className="min-h-screen bg-slate-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link href="/" className="hover:text-[#103178]">Accueil</Link>
                    <span>/</span>
                    <Link href="/shop" className="hover:text-[#103178]">Boutique</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-medium truncate max-w-xs">{product.name}</span>
                </nav>

                <div className="grid md:grid-cols-2 gap-10">
                    {/* Galerie */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex items-center justify-center relative group p-6">
                            {images[activeImage] ? (
                                <img
                                    src={images[activeImage]}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-150"
                                    style={{ transformOrigin: "center center" }}
                                    onMouseMove={(e) => {
                                        // Simple zoom effect based on mouse position
                                        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                                        const x = ((e.clientX - left) / width) * 100;
                                        const y = ((e.clientY - top) / height) * 100;
                                        e.currentTarget.style.transformOrigin = `${x}% ${y}%`;
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transformOrigin = "center center";
                                    }}
                                />
                            ) : (
                                <div className="text-8xl opacity-10">💊</div>
                            )}
                            {/* Badges sur l'image */}
                            <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none">
                                {discount > 0 && <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">-{discount}% Offre</span>}
                                {product.stock > 0 && product.stock <= 5 && <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">Dernières pièces</span>}
                            </div>
                        </div>

                        {images.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`shrink-0 w-20 h-20 rounded-2xl border-2 overflow-hidden transition-all duration-200 bg-white ${i === activeImage ? "border-[#103178] shadow-md scale-105" : "border-slate-100 hover:border-slate-300 opacity-70 hover:opacity-100"}`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain mix-blend-multiply p-2" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Infos */}
                    <div className="space-y-5">
                        <div>
                            <span className="text-sm text-[#103178] font-semibold">{product.brand}</span>
                            <h1 className="text-3xl font-extrabold text-slate-900 mt-1 leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-1 mt-2">
                                {[1, 2, 3, 4, 5].map((s) => (
                                    <Star key={s} size={14} className={s <= 4 ? "fill-yellow-400 text-yellow-400" : "text-slate-300"} />
                                ))}
                                <span className="text-xs text-slate-500 ml-1">(4.0)</span>
                            </div>
                        </div>

                        {/* Prix */}
                        <div className="flex items-baseline gap-3">
                            {product.salePrice ? (
                                <>
                                    <span className="text-4xl font-extrabold text-red-500">{product.salePrice} MAD</span>
                                    <span className="text-xl text-slate-400 line-through">{product.price} MAD</span>
                                    <span className="bg-red-100 text-red-600 text-sm font-bold px-2 py-0.5 rounded-full">-{discount}%</span>
                                </>
                            ) : (
                                <span className="text-4xl font-extrabold text-[#103178]">{product.price} MAD</span>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Package size={16} className={product.stock > 0 ? "text-green-500" : "text-red-500"} />
                            <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                                {product.stock > 0 ? `En stock (${product.stock} disponibles)` : "Rupture de stock"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Tag size={14} className="text-slate-400" />
                            <span className="text-sm text-slate-500">{product.category}</span>
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">{product.description}</p>

                        {/* Quantité + Panier */}
                        <div className="flex items-center gap-3 pt-2">
                            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden">
                                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-4 py-2 text-slate-600 hover:bg-slate-100 transition-colors font-bold">−</button>
                                <span className="px-4 py-2 font-semibold text-slate-900 min-w-[2.5rem] text-center">{qty}</span>
                                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-4 py-2 text-slate-600 hover:bg-slate-100 transition-colors font-bold">+</button>
                            </div>
                            <button
                                onClick={() => addItem(toCartProduct(product), qty)}
                                disabled={product.stock === 0}
                                className="flex-1 flex items-center justify-center gap-2 bg-[#103178] hover:bg-[#0d266b] text-white font-bold py-3 rounded-xl transition-all disabled:opacity-40 shadow-lg shadow-[#103178]/20"
                            >
                                <ShoppingCart size={20} />
                                Ajouter au panier
                            </button>
                        </div>

                        {/* Réassurance & Paiement */}
                        <div className="pt-8 space-y-6 border-t border-slate-100 mt-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="flex flex-col items-center text-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                                        <Truck size={20} />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Livraison Express</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-[#103178] flex items-center justify-center group-hover:bg-[#103178] group-hover:text-white transition-colors duration-300">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Paiement Sécurisé</span>
                                </div>
                                <div className="flex flex-col items-center text-center gap-2 group">
                                    <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors duration-300">
                                        <CheckCircle2 size={20} />
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">100% Authentique</span>
                                </div>
                            </div>

                            <div className="bg-slate-50 rounded-2xl p-4 flex items-center justify-between border border-slate-100">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Moyens de paiement</span>
                                    <div className="flex gap-2">
                                        <div className="h-6 w-10 bg-white border border-slate-200 rounded flex items-center justify-center font-bold text-[8px] italic text-blue-800 shadow-sm">VISA</div>
                                        <div className="h-6 w-10 bg-white border border-slate-200 rounded flex items-center justify-center font-bold text-[8px] italic text-red-600 shadow-sm">MC</div>
                                        <div className="h-6 px-2 bg-white border border-slate-200 rounded flex items-center justify-center font-bold text-[8px] text-slate-600 shadow-sm">CASH</div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Besoin d'aide ?</span>
                                    <a href="tel:0666695486" className="text-sm font-bold text-[#103178] hover:underline">06 66 69 54 86</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="mt-16 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="flex justify-center border-b border-slate-100 bg-white">
                        <button
                            onClick={() => setActiveTab('desc')}
                            className={`px-8 py-5 text-sm font-bold transition-all relative ${activeTab === 'desc' ? 'text-[#2d6a4f]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Description
                            {activeTab === 'desc' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2d6a4f]" />}
                        </button>
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`px-8 py-5 text-sm font-bold transition-all relative ${activeTab === 'info' ? 'text-[#2d6a4f]' : 'text-slate-400 hover:text-slate-600'}`}
                        >
                            Informations complémentaires
                            {activeTab === 'info' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#2d6a4f]" />}
                        </button>
                    </div>
                    <div className="p-8 md:p-12">
                        {activeTab === 'desc' ? (
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-8 text-sm">
                                <p>{product.description}</p>

                                {product.brand && product.brand.toUpperCase().includes("VICHY") && (
                                    <>
                                        <div className="space-y-3">
                                            <p className="font-bold text-slate-900">Cette formule contient :</p>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li>Acide hyaluronique : Pour hydrater en profondeur la fibre capillaire.</li>
                                                <li>Glycérine + niacinamide : Pour aider à réduire l'inflammation.</li>
                                            </ul>
                                        </div>

                                        <div className="space-y-3">
                                            <p className="font-bold text-slate-900">La formule est :</p>
                                            <ul className="list-disc pl-5 space-y-2">
                                                <li>Testée sous contrôle dermatologique.</li>
                                                <li>Testée sur les cheveux et le cuir chevelu sensibles.</li>
                                                <li>Sécuritaire pour les cheveux colorés.</li>
                                            </ul>
                                        </div>

                                        <div className="pt-8 mt-8 border-t border-slate-100">
                                            <p className="text-slate-500 italic">
                                                Par VICHY LABORATOIRES, une marque recommandée par 70 000 dermatologues dans le monde*.
                                            </p>
                                            <p className="text-[10px] text-slate-400 mt-2 leading-tight">
                                                *Résultats d'une enquête menée sur le marché dermocosmétique par AplusA et d'autres partenaires entre janvier 2023 et mai 2023, impliquant des dermatologues dans 32 pays, représentant plus de 80 % du PIB mondial.
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="max-w-xl space-y-4">
                                <div className="grid grid-cols-2 py-3 border-b border-slate-50">
                                    <span className="text-sm font-bold text-slate-400 tracking-wider">MARQUE</span>
                                    <span className="text-sm text-slate-700 font-medium">{product.brand}</span>
                                </div>
                                <div className="grid grid-cols-2 py-3 border-b border-slate-50">
                                    <span className="text-sm font-bold text-slate-400 tracking-wider">CATÉGORIE</span>
                                    <span className="text-sm text-slate-700 font-medium">{product.category}</span>
                                </div>
                                <div className="grid grid-cols-2 py-3 border-b border-slate-50">
                                    <span className="text-sm font-bold text-slate-400 tracking-wider">RÉFÉRENCE</span>
                                    <span className="text-sm text-slate-700 font-medium">{product.id.slice(0, 8).toUpperCase()}</span>
                                </div>
                                <div className="grid grid-cols-2 py-3">
                                    <span className="text-sm font-bold text-slate-400 tracking-wider">ÉTAT DU STOCK</span>
                                    <span className={`text-sm font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {product.stock > 0 ? 'Disponible immédiatement' : 'En rupture'}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Produits similaires */}
                {related.length > 0 && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Produits similaires</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {related.map((p) => {
                                const relImgs: string[] = Array.isArray(p.images)
                                    ? p.images as string[]
                                    : typeof p.images === "string"
                                        ? (() => { try { return JSON.parse(p.images as unknown as string); } catch { return []; } })()
                                        : [];
                                return (
                                    <Link key={p.id} href={`/product/${p.slug}`} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
                                        <div className="aspect-square shrink-0">
                                            {relImgs[0] ? (
                                                <img src={relImgs[0]} alt={p.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-3xl">💊</div>
                                            )}
                                        </div>
                                        <div className="p-3 flex flex-col justify-between flex-1">
                                            <p className="text-sm font-semibold text-slate-900 line-clamp-2">{p.name}</p>
                                            <p className="text-[#103178] font-bold text-sm mt-1">{p.salePrice ?? p.price} MAD</p>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </section>
                )}
            </div>
        </main>
    );
}

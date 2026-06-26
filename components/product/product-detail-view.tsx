"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, Star, Package, Tag, ShieldCheck, Truck, CheckCircle2, Plus, Zap, Heart } from "lucide-react";
import { useCart } from "../../lib/context/cart-context";
import { useWishlist } from "../../lib/context/wishlist-context";
import { useRecentlyViewed } from "../../lib/hooks/use-recently-viewed";
import { RecentlyViewed } from "./recently-viewed";
import type { Product as CartProduct } from "../../lib/data/products";

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
    brandImage?: string | null;
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
        id: p.id,
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
        reviews: 0,
    };
}

export function ProductDetailView({ product, related }: { product: DbProduct; related: RelatedProduct[] }) {
    const { addItem } = useCart();
    const { addView } = useRecentlyViewed();
    const { isInWishlist, toggleWishlist } = useWishlist();
    const isWishlisted = isInWishlist(product.id);
    const [activeImage, setActiveImage] = useState(0);
    const [qty, setQty] = useState(1);
    const [activeTab, setActiveTab] = useState<'desc' | 'info'>('desc');

    // Forcer le scroll en haut au chargement de la page produit
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [product.id]);

    const handleAdd = () => {
        if (product.id) addView(product.id);
    };

    useEffect(() => {
        handleAdd();
    }, [product.id, addView]);

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
                                {discount > 0 && (
                                    <span className="bg-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">-{discount}% Offre</span>
                                )}
                                {product.stock > 0 && product.stock <= 3 && (
                                    <span className="inline-flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                                        Plus que {product.stock} en stock !
                                    </span>
                                )}
                                {product.stock > 3 && product.stock <= 10 && (
                                    <span className="inline-flex items-center gap-1.5 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-md">
                                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                        Stock limité ({product.stock} restants)
                                    </span>
                                )}
                                {product.stock > 10 && product.stock <= 20 && (
                                    <span className="inline-flex items-center gap-1.5 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                                        Bientôt épuisé
                                    </span>
                                )}
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
                                        <img loading="lazy" src={img} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Infos */}
                    <div className="space-y-5">
                        <div>
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
                            <Package size={16} className={product.stock > 0 ? (product.stock <= 3 ? "text-red-500" : "text-green-500") : "text-red-500"} />
                            {product.stock === 0 ? (
                                <span className="text-sm font-medium text-red-600">Rupture de stock</span>
                            ) : product.stock <= 3 ? (
                                <span className="text-sm font-bold text-red-600 flex items-center gap-1.5">
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
                                    Seulement {product.stock} en stock — dépêchez-vous !
                                </span>
                            ) : product.stock <= 10 ? (
                                <span className="text-sm font-semibold text-amber-600">Stock limité ({product.stock} disponibles)</span>
                            ) : (
                                <span className="text-sm font-medium text-green-600">En stock ({product.stock} disponibles)</span>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 py-2">
                            <div className="flex items-center gap-2">
                                <Tag size={14} className="text-slate-400" />
                                <span className="text-sm text-slate-500">{product.category}</span>
                            </div>

                            {product.brandImage && (
                                <Link href={`/shop?brand=${encodeURIComponent(product.brand)}`} className="group">
                                    <div className="flex items-center gap-4 pt-2 border-t border-slate-50">
                                        <div className="h-16 w-32 relative bg-slate-50 rounded-xl p-2 flex items-center justify-center border border-slate-100 shadow-sm overflow-hidden group-hover:border-[#103178]/30 group-hover:shadow-md transition-all">
                                            <img
                                                src={product.brandImage}
                                                alt={product.brand}
                                                className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                                            />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#2d6a4f]/60 mb-0.5">Marque</p>
                                            <p className="text-sm font-bold text-slate-900 group-hover:text-[#103178] transition-colors">{product.brand}</p>
                                        </div>
                                    </div>
                                </Link>
                            )}
                        </div>

                        <p className="text-slate-600 text-sm leading-relaxed line-clamp-3" dangerouslySetInnerHTML={{ __html: product.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() }} />

                        {/* Quantité + Panier */}
                        <div className="flex flex-col gap-3 pt-2">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white">
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
                                <button
                                    onClick={() => toggleWishlist(product.id, product.name)}
                                    className={`flex items-center justify-center w-12 h-12 rounded-xl shrink-0 transition-all border ${isWishlisted ? 'bg-rose-50 border-rose-200 text-rose-500' : 'bg-white border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-200'}`}
                                    title="Favoris"
                                >
                                    <Heart size={22} className={isWishlisted ? "fill-rose-500" : ""} />
                                </button>
                            </div>

                            <a
                                href={`https://wa.me/212666695486?text=${encodeURIComponent(`Bonjour Vitaluxe, je souhaite commander le produit : ${product.name}`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-[#25D366]/20 transition-all active:scale-[0.98]"
                            >
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.438 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Commander via WhatsApp
                            </a>
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
                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed space-y-4 text-sm [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_li]:text-slate-600 [&_strong]:text-slate-900 [&_strong]:font-semibold">
                                <div dangerouslySetInnerHTML={{ __html: product.description }} />

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

                {/* Achetez-le ensemble (Cross-sell) */}
                {related.length > 0 && <BuyTogetherSection mainProduct={product} related={related} addItem={addItem} />}

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
                                                <img loading="lazy" src={relImgs[0]} alt={p.name} className="w-full h-full object-cover" />
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

                {/* Produits récemment vus */}
                <RecentlyViewed excludeId={product.id} />
            </div>
        </main>
    );
}

// ─── BuyTogetherSection ─────────────────────────────────────────────────────
function BuyTogetherSection({
    mainProduct,
    related,
    addItem,
}: {
    mainProduct: DbProduct;
    related: RelatedProduct[];
    addItem: (product: CartProduct, qty: number) => void;
}) {
    const crossProducts = related.slice(0, 2);
    const [selected, setSelected] = useState<Set<string>>(() => new Set(crossProducts.map((p) => p.id)));
    const [added, setAdded] = useState(false);

    const toggle = (id: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const mainPrice = mainProduct.salePrice ?? mainProduct.price;
    const extrasTotal = crossProducts
        .filter((p) => selected.has(p.id))
        .reduce((acc, p) => acc + (p.salePrice ?? p.price), 0);
    const total = mainPrice + extrasTotal;
    const count = 1 + selected.size;

    const handleAddAll = () => {
        // main product
        addItem(
            {
                id: mainProduct.id, name: mainProduct.name, slug: mainProduct.slug,
                description: mainProduct.description, price: mainProduct.price,
                salePrice: mainProduct.salePrice ?? null, images: mainProduct.images,
                brand: mainProduct.brand, category: mainProduct.category,
                inStock: mainProduct.stock > 0, stock: mainProduct.stock,
                badge: undefined, rating: 0, reviews: 0,
            },
            1
        );
        // cross-sell selected
        crossProducts.filter((p) => selected.has(p.id)).forEach((p) => {
            const imgs: string[] = Array.isArray(p.images) ? p.images as string[] :
                typeof p.images === "string" ? (() => { try { return JSON.parse(p.images as unknown as string); } catch { return []; } })() : [];
            addItem(
                {
                    id: p.id, name: p.name, slug: p.slug, description: "",
                    price: p.price, salePrice: p.salePrice ?? null, images: imgs,
                    brand: p.brand, category: p.category,
                    inStock: true, stock: 99, badge: undefined, rating: 0, reviews: 0,
                },
                1
            );
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 2500);
    };

    const getImg = (imgs: string[] | unknown): string | null => {
        const arr: string[] = Array.isArray(imgs) ? imgs as string[] :
            typeof imgs === "string" ? (() => { try { return JSON.parse(imgs); } catch { return []; } })() : [];
        return arr[0] ?? null;
    };

    return (
        <section className="mt-16 bg-white rounded-3xl border border-slate-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-6">
                <Zap size={20} className="text-amber-500" />
                <h2 className="text-xl font-bold text-slate-900">Achetez-le ensemble</h2>
                <span className="ml-2 text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full">Économisez plus</span>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                {/* Main product */}
                <div className="flex flex-col items-center gap-2 text-center w-32">
                    <div className="w-24 h-24 rounded-2xl border-2 border-[#103178] bg-slate-50 overflow-hidden flex items-center justify-center">
                        {getImg(mainProduct.images) ? (
                            <img src={getImg(mainProduct.images)!} alt={mainProduct.name} className="w-full h-full object-contain p-1" />
                        ) : <div className="text-3xl">💊</div>}
                    </div>
                    <p className="text-xs font-semibold text-slate-700 line-clamp-2">{mainProduct.name}</p>
                    <p className="text-sm font-bold text-[#103178]">{mainPrice} MAD</p>
                </div>

                {crossProducts.map((p, idx) => (
                    <div key={p.id} className="flex items-center gap-4 md:gap-6">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-bold text-lg shrink-0">
                            <Plus size={16} />
                        </div>
                        <div className="flex flex-col items-center gap-2 text-center w-32">
                            <div className={`w-24 h-24 rounded-2xl border-2 transition-all overflow-hidden flex items-center justify-center bg-slate-50 ${selected.has(p.id) ? "border-[#103178]" : "border-slate-200 opacity-50"
                                }`}>
                                {getImg(p.images) ? (
                                    <img src={getImg(p.images)!} alt={p.name} className="w-full h-full object-contain p-1" />
                                ) : <div className="text-3xl">💊</div>}
                            </div>
                            <p className="text-xs font-semibold text-slate-700 line-clamp-2">{p.name}</p>
                            <p className="text-sm font-bold text-[#103178]">{p.salePrice ?? p.price} MAD</p>
                            <label className="flex items-center gap-1.5 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selected.has(p.id)}
                                    onChange={() => toggle(p.id)}
                                    className="w-4 h-4 accent-[#103178] cursor-pointer"
                                />
                                <span className="text-xs text-slate-500">Inclure</span>
                            </label>
                        </div>
                    </div>
                ))}

                {/* Total + CTA */}
                <div className="flex-1 flex flex-col gap-3 md:ml-4 mt-4 md:mt-0 w-full md:w-auto">
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                        <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">Total pour {count} article{count > 1 ? "s" : ""}</p>
                        <p className="text-3xl font-extrabold text-[#103178]">{total.toFixed(2)} MAD</p>
                    </div>
                    <button
                        onClick={handleAddAll}
                        className="w-full flex items-center justify-center gap-2 bg-[#103178] hover:bg-[#0d266b] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-[#103178]/20 active:scale-95"
                    >
                        {added ? (
                            <><CheckCircle2 size={18} /> Ajouté au panier !</>
                        ) : (
                            <><ShoppingCart size={18} /> Ajouter les {count} au panier</>
                        )}
                    </button>
                </div>
            </div>
        </section>
    );
}

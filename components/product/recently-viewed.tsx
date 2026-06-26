"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRecentlyViewed } from "@/lib/hooks/use-recently-viewed";

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    salePrice?: number;
    images: string | string[];
    brand: string;
}

export function RecentlyViewed({ excludeId }: { excludeId: string }) {
    const { viewedIds } = useRecentlyViewed();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const filteredIds = viewedIds.filter(id => id !== excludeId).slice(0, 4);
        if (filteredIds.length === 0) return;

        setLoading(true);
        fetch(`/api/products?ids=${filteredIds.join(",")}`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch recently viewed products", err);
                setLoading(false);
            });
    }, [viewedIds, excludeId]);

    if (!loading && products.length === 0) return null;

    return (
        <section className="mt-16 pt-16 border-t border-slate-100">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Vous avez récemment consulté</h2>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((p) => {
                    const imagesList: string[] = Array.isArray(p.images)
                        ? p.images
                        : typeof p.images === "string"
                            ? (() => { try { return JSON.parse(p.images); } catch { return []; } })()
                            : [];

                    return (
                        <Link key={p.id} href={`/product/${p.slug}`} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full">
                            <div className="aspect-[4/3] relative overflow-hidden bg-slate-50 flex items-center justify-center p-4">
                                {imagesList[0] ? (
                                    <img
                                        loading="lazy"
                                        src={imagesList[0]}
                                        alt={p.name}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                ) : (
                                    <div className="text-4xl opacity-10">💊</div>
                                )}
                            </div>
                            <div className="p-4 flex flex-col justify-between flex-1">
                                <div>
                                    <p className="text-[10px] font-bold text-[#103178] uppercase tracking-widest mb-1">{p.brand}</p>
                                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#103178] transition-colors">{p.name}</h3>
                                </div>
                                <div className="mt-3 flex items-baseline gap-2">
                                    <span className="text-base font-black text-[#103178]">{p.salePrice ?? p.price} MAD</span>
                                    {p.salePrice && <span className="text-xs text-slate-400 line-through">{p.price} MAD</span>}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

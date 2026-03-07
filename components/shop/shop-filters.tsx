"use client";

import { useCallback, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { CATEGORIES, BRANDS, ALL_PRODUCTS } from "@/lib/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    X, SlidersHorizontal, ChevronDown, ChevronUp,
    Tag, Layers, DollarSign, Package2, Star
} from "lucide-react";

const PRICE_RANGES = [
    { label: "Moins de 150 Dhs", min: 0, max: 150 },
    { label: "150 – 250 Dhs", min: 150, max: 250 },
    { label: "250 – 400 Dhs", min: 250, max: 400 },
    { label: "Plus de 400 Dhs", min: 400, max: 10000 },
];

const RATING_OPTIONS = [
    { label: "4.5 et plus", value: 4.5 },
    { label: "4 et plus", value: 4 },
    { label: "3 et plus", value: 3 },
];

// Count products per category/brand for badges
const countByCategory = Object.fromEntries(
    CATEGORIES.map((c) => [c, ALL_PRODUCTS.filter((p) => p.category === c).length])
);
const countByBrand = Object.fromEntries(
    BRANDS.map((b) => [b, ALL_PRODUCTS.filter((p) => p.brand === b).length])
);

function Section({
    title, icon: Icon, children, defaultOpen = true
}: {
    title: string; icon: React.ElementType; children: React.ReactNode; defaultOpen?: boolean;
}) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b last:border-b-0 pb-4 last:pb-0">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center justify-between w-full py-2 group"
            >
                <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="font-semibold text-sm">{title}</span>
                </div>
                {open
                    ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
                }
            </button>
            {open && <div className="pt-3">{children}</div>}
        </div>
    );
}

export function ShopFilters({ className }: { className?: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const activeCategories = searchParams.getAll("cat");
    const activeBrands = searchParams.getAll("brand");
    const minPrice = Number(searchParams.get("min") ?? 0);
    const maxPrice = Number(searchParams.get("max") ?? 10000);
    const minRating = Number(searchParams.get("rating") ?? 0);
    const inStockOnly = searchParams.get("inStock") === "1";

    const push = (params: URLSearchParams) =>
        router.push(`${pathname}?${params.toString()}`, { scroll: false });

    const toggleParam = useCallback(
        (key: string, value: string, on: boolean) => {
            const p = new URLSearchParams(searchParams.toString());
            const cur = p.getAll(key); p.delete(key); p.delete("page");
            (on ? [...cur, value] : cur.filter((v) => v !== value)).forEach((v) => p.append(key, v));
            push(p);
        },
        [searchParams, pathname]
    );

    const setPriceRange = (min: number, max: number) => {
        const p = new URLSearchParams(searchParams.toString());
        if (minPrice === min && maxPrice === max) { p.delete("min"); p.delete("max"); }
        else { p.set("min", String(min)); p.set("max", String(max)); }
        p.delete("page"); push(p);
    };

    const setRating = (val: number) => {
        const p = new URLSearchParams(searchParams.toString());
        if (minRating === val) p.delete("rating"); else p.set("rating", String(val));
        p.delete("page"); push(p);
    };

    const clearAll = () => router.push(pathname, { scroll: false });

    const activeCount =
        activeCategories.length + activeBrands.length +
        (minPrice > 0 || maxPrice < 10000 ? 1 : 0) +
        (minRating > 0 ? 1 : 0) + (inStockOnly ? 1 : 0);

    return (
        <aside className={`space-y-0 ${className}`}>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b mb-4">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" />
                    <span className="font-bold">Filtres</span>
                    {activeCount > 0 && (
                        <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                            {activeCount}
                        </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <button
                        onClick={clearAll}
                        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive transition-colors"
                    >
                        <X className="h-3 w-3" /> Effacer tout
                    </button>
                )}
            </div>

            {/* Active pills */}
            {activeCount > 0 && (
                <div className="flex flex-wrap gap-1.5 pb-4 border-b mb-4">
                    {activeCategories.map((c) => (
                        <Badge key={c} variant="secondary" className="cursor-pointer gap-1 pr-1.5 hover:bg-destructive/10 hover:text-destructive" onClick={() => toggleParam("cat", c, false)}>
                            {c} <X className="h-2.5 w-2.5" />
                        </Badge>
                    ))}
                    {activeBrands.map((b) => (
                        <Badge key={b} variant="secondary" className="cursor-pointer gap-1 pr-1.5 hover:bg-destructive/10 hover:text-destructive" onClick={() => toggleParam("brand", b, false)}>
                            {b} <X className="h-2.5 w-2.5" />
                        </Badge>
                    ))}
                    {(minPrice > 0 || maxPrice < 10000) && (
                        <Badge variant="secondary" className="cursor-pointer gap-1 pr-1.5 hover:bg-destructive/10 hover:text-destructive" onClick={() => setPriceRange(0, 10000)}>
                            {PRICE_RANGES.find(r => r.min === minPrice && r.max === maxPrice)?.label ?? "Prix"} <X className="h-2.5 w-2.5" />
                        </Badge>
                    )}
                    {minRating > 0 && (
                        <Badge variant="secondary" className="cursor-pointer gap-1 pr-1.5 hover:bg-destructive/10 hover:text-destructive" onClick={() => setRating(0)}>
                            ≥ {minRating}★ <X className="h-2.5 w-2.5" />
                        </Badge>
                    )}
                </div>
            )}

            <div className="space-y-4">
                {/* Categories */}
                <Section title="Catégories" icon={Layers}>
                    <div className="space-y-1.5">
                        {CATEGORIES.map((cat) => {
                            const active = activeCategories.includes(cat);
                            return (
                                <button
                                    key={cat}
                                    onClick={() => toggleParam("cat", cat, !active)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${active
                                            ? "bg-primary text-primary-foreground font-semibold shadow"
                                            : "hover:bg-muted/60 text-foreground"
                                        }`}
                                >
                                    <span>{cat}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>
                                        {countByCategory[cat] ?? 0}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Section>

                {/* Brands */}
                <Section title="Marques" icon={Tag} defaultOpen={false}>
                    <div className="space-y-1.5">
                        {BRANDS.map((brand) => {
                            const active = activeBrands.includes(brand);
                            return (
                                <button
                                    key={brand}
                                    onClick={() => toggleParam("brand", brand, !active)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all ${active
                                            ? "bg-primary text-primary-foreground font-semibold shadow"
                                            : "hover:bg-muted/60 text-foreground"
                                        }`}
                                >
                                    <span>{brand}</span>
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${active ? "bg-white/20" : "bg-muted text-muted-foreground"}`}>
                                        {countByBrand[brand] ?? 0}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Section>

                {/* Price range */}
                <Section title="Fourchette de prix" icon={DollarSign}>
                    <div className="space-y-1.5">
                        {PRICE_RANGES.map((range) => {
                            const active = minPrice === range.min && maxPrice === range.max;
                            return (
                                <button
                                    key={range.label}
                                    onClick={() => setPriceRange(range.min, range.max)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left ${active ? "bg-primary text-primary-foreground font-semibold shadow" : "hover:bg-muted/60"
                                        }`}
                                >
                                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-white" : "border-muted-foreground/40"}`}>
                                        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    {range.label}
                                </button>
                            );
                        })}
                    </div>
                </Section>

                {/* Rating */}
                <Section title="Note minimale" icon={Star} defaultOpen={false}>
                    <div className="space-y-1.5">
                        {RATING_OPTIONS.map(({ label, value }) => {
                            const active = minRating === value;
                            return (
                                <button
                                    key={value}
                                    onClick={() => setRating(value)}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all text-left ${active ? "bg-primary text-primary-foreground font-semibold shadow" : "hover:bg-muted/60"
                                        }`}
                                >
                                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center shrink-0 ${active ? "border-white" : "border-muted-foreground/40"}`}>
                                        {active && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                    </div>
                                    <span className="flex items-center gap-1">
                                        {label}
                                        <span className="text-amber-400">{"★".repeat(Math.floor(value))}</span>
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </Section>

                {/* Stock */}
                <Section title="Disponibilité" icon={Package2}>
                    <button
                        onClick={() => {
                            const p = new URLSearchParams(searchParams.toString());
                            if (inStockOnly) p.delete("inStock"); else p.set("inStock", "1");
                            p.delete("page"); push(p);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm transition-all ${inStockOnly ? "bg-primary text-primary-foreground font-semibold shadow" : "border hover:bg-muted/60"
                            }`}
                    >
                        <span>En stock uniquement</span>
                        <div className={`relative w-9 h-5 rounded-full transition-colors ${inStockOnly ? "bg-white/30" : "bg-muted border"}`}>
                            <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${inStockOnly ? "translate-x-4" : "translate-x-0.5"}`} />
                        </div>
                    </button>
                </Section>
            </div>

            {/* Apply button on mobile */}
            <div className="pt-4 mt-4 border-t lg:hidden">
                <Button className="w-full" onClick={() => { }}>
                    Voir les résultats
                </Button>
            </div>
        </aside>
    );
}

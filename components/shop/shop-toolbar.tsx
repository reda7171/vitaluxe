"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, List, ArrowUpDown } from "lucide-react";

const SORT_OPTIONS = [
    { value: "featured", label: "En vedette" },
    { value: "price-asc", label: "Prix : croissant" },
    { value: "price-desc", label: "Prix : décroissant" },
    { value: "rating", label: "Mieux notés" },
    { value: "newest", label: "Nouveautés" },
];

type Props = {
    total: number;
    viewMode: "grid" | "list";
    onViewChange: (v: "grid" | "list") => void;
};

export function ShopToolbar({ total, viewMode, onViewChange }: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const sort = searchParams.get("sort") ?? "featured";

    const setSort = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("sort", value);
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between py-3 px-4 bg-card rounded-xl border">
            {/* Count */}
            <p className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground text-base">{total}</span>
                {" "}produit{total !== 1 ? "s" : ""} trouvé{total !== 1 ? "s" : ""}
            </p>

            <div className="flex items-center gap-2">
                {/* Sort */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                </div>
                <Select value={sort} onValueChange={setSort}>
                    <SelectTrigger className="w-[190px] bg-background h-9 text-sm" id="shop-sort">
                        <SelectValue placeholder="Trier par..." />
                    </SelectTrigger>
                    <SelectContent>
                        {SORT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value} className="text-sm">
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                {/* View toggle */}
                <div className="flex items-center border rounded-lg overflow-hidden h-9">
                    <button
                        onClick={() => onViewChange("grid")}
                        className={`w-9 h-9 flex items-center justify-center transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                            }`}
                        aria-label="Vue grille"
                        title="Vue grille"
                    >
                        <LayoutGrid className="h-4 w-4" />
                    </button>
                    <button
                        onClick={() => onViewChange("list")}
                        className={`w-9 h-9 flex items-center justify-center transition-colors border-l ${viewMode === "list" ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                            }`}
                        aria-label="Vue liste"
                        title="Vue liste"
                    >
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

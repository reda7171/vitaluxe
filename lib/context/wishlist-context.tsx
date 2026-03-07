"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";

type WishlistContextType = {
    items: string[];
    toggleWishlist: (productId: string, productName: string) => void;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = "vitaluxe_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<string[]>([]);
    const { status } = useSession(); // use session to know when to fetch

    useEffect(() => {
        // Load local storage immediately
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) setItems(JSON.parse(stored));
        } catch (error) {
            console.error(error);
        }
    }, []);

    // Sync with DB if authenticated
    useEffect(() => {
        if (status === "authenticated") {
            fetch("/api/account/wishlist")
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error("Failed");
                })
                .then((data) => {
                    if (Array.isArray(data)) {
                        const dbIds = data.map((d: { productId: string }) => d.productId);
                        setItems(dbIds);
                        localStorage.setItem(STORAGE_KEY, JSON.stringify(dbIds));
                    }
                })
                .catch(() => { });
        }
    }, [status]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }, [items]);

    const toggleWishlist = async (productId: string, productName: string) => {
        setItems((prev) => {
            if (prev.includes(productId)) {
                toast.success(`${productName} retiré de vos favoris`);
                return prev.filter((id) => id !== productId);
            } else {
                toast.success(`${productName} ajouté à vos favoris`);
                return [...prev, productId];
            }
        });

        // Sync to DB
        if (status === "authenticated") {
            try {
                await fetch("/api/account/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId }),
                });
            } catch { }
        }
    };

    const isInWishlist = (productId: string) => items.includes(productId);

    const clearWishlist = () => setItems([]);

    return (
        <WishlistContext.Provider value={{ items, toggleWishlist, isInWishlist, clearWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (!context) throw new Error("useWishlist must be used within WishlistProvider");
    return context;
}

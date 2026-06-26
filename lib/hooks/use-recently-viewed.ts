"use client";

import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "vitaluxe_recently_viewed";
const MAX_ITEMS = 6;

export function useRecentlyViewed() {
    const [viewedIds, setViewedIds] = useState<string[]>([]);

    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                setViewedIds(JSON.parse(stored));
            } catch (e) {
                console.error("Failed to parse recently viewed", e);
            }
        }
    }, []);

    const addView = useCallback((productId: string) => {
        setViewedIds((prev) => {
            const filtered = prev.filter(id => id !== productId);
            const newList = [productId, ...filtered].slice(0, MAX_ITEMS);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
            return newList;
        });
    }, []);

    return { viewedIds, addView };
}

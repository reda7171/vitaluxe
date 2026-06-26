"use client";

import { createContext, useContext, useReducer, useCallback, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import type { Product } from "../data/products";

// ─── Types ───────────────────────────────────────────────────────────────────
export type CartItem = {
    product: Product;
    quantity: number;
};

type CartState = {
    items: CartItem[];
    isOpen: boolean;
};

type CartAction =
    | { type: "ADD_ITEM"; product: Product; quantity?: number }
    | { type: "REMOVE_ITEM"; productId: string }
    | { type: "UPDATE_QTY"; productId: string; quantity: number }
    | { type: "CLEAR_CART" }
    | { type: "OPEN_CART" }
    | { type: "CLOSE_CART" };

// ─── Reducer ─────────────────────────────────────────────────────────────────
function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const qty = action.quantity ?? 1;
            const exists = state.items.find((i) => i.product.id === action.product.id);
            const items = exists
                ? state.items.map((i) =>
                    i.product.id === action.product.id
                        ? { ...i, quantity: i.quantity + qty }
                        : i
                )
                : [...state.items, { product: action.product, quantity: qty }];
            return { ...state, items, isOpen: true };
        }
        case "REMOVE_ITEM":
            return {
                ...state,
                items: state.items.filter((i) => i.product.id !== action.productId),
            };
        case "UPDATE_QTY":
            if (action.quantity < 1) {
                return {
                    ...state,
                    items: state.items.filter((i) => i.product.id !== action.productId),
                };
            }
            return {
                ...state,
                items: state.items.map((i) =>
                    i.product.id === action.productId ? { ...i, quantity: action.quantity } : i
                ),
            };
        case "CLEAR_CART":
            return { ...state, items: [] };
        case "OPEN_CART":
            return { ...state, isOpen: true };
        case "CLOSE_CART":
            return { ...state, isOpen: false };
        default:
            return state;
    }
}

// ─── Context ─────────────────────────────────────────────────────────────────
type CartContextType = {
    items: CartItem[];
    isOpen: boolean;
    totalItems: number;
    totalPrice: number;
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: string) => void;
    updateQty: (productId: string, quantity: number) => void;
    clearCart: () => void;
    openCart: () => void;
    closeCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "vitaluxe_cart";

function loadFromStorage(): CartItem[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function CartProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [state, dispatch] = useReducer(cartReducer, {
        items: loadFromStorage(),
        isOpen: false,
    });

    // Persist cart to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    }, [state.items]);

    // Save cart to server for authenticated users (abandon cart tracking)
    useEffect(() => {
        if (!session?.user) return;
        if (state.items.length === 0) return;

        const totalAmount = state.items.reduce(
            (sum, i) => sum + (i.product.salePrice ?? i.product.price) * i.quantity, 0
        );

        const timer = setTimeout(() => {
            fetch("/api/cart/save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: state.items, totalAmount }),
            }).catch(() => { });
        }, 3000); // debounce 3s

        return () => clearTimeout(timer);
    }, [state.items, session]);

    const addItem = useCallback(
        (product: Product, quantity?: number) =>
            dispatch({ type: "ADD_ITEM", product, quantity }),
        []
    );
    const removeItem = useCallback(
        (productId: string) => dispatch({ type: "REMOVE_ITEM", productId }),
        []
    );
    const updateQty = useCallback(
        (productId: string, quantity: number) =>
            dispatch({ type: "UPDATE_QTY", productId, quantity }),
        []
    );
    const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);
    const openCart = useCallback(() => dispatch({ type: "OPEN_CART" }), []);
    const closeCart = useCallback(() => dispatch({ type: "CLOSE_CART" }), []);

    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const totalPrice = state.items.reduce(
        (sum, i) => sum + (i.product.salePrice ?? i.product.price) * i.quantity,
        0
    );

    return (
        <CartContext.Provider
            value={{
                items: state.items,
                isOpen: state.isOpen,
                totalItems,
                totalPrice,
                addItem,
                removeItem,
                updateQty,
                clearCart,
                openCart,
                closeCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used inside CartProvider");
    return ctx;
}

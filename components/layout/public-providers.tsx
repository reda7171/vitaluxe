"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/context/cart-context";
import { WishlistProvider } from "@/lib/context/wishlist-context";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function PublicProviders({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <WishlistProvider>
                <CartProvider>
                    <div className="flex min-h-screen flex-col">
                        <Header />
                        <main className="flex-1 bg-muted/20">{children}</main>
                        <Footer />
                    </div>
                    <CartDrawer />
                </CartProvider>
            </WishlistProvider>
        </SessionProvider>
    );
}

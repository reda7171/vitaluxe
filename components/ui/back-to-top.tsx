"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

export function BackToTop() {
    const [visible, setVisible] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // Forcer le scroll en haut au changement de page pour contrer les bugs de layout Next.js
    useEffect(() => {
        // Un délai d'une frame (10ms) laisse le temps à la page de se dessiner avant le scroll
        setTimeout(() => window.scrollTo({ top: 0, behavior: "instant" }), 10);
    }, [pathname, searchParams]);

    useEffect(() => {
        const onScroll = () => setVisible(window.scrollY > 300);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

    return (
        <button
            onClick={scrollToTop}
            aria-label="Retour en haut"
            className={`fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-[#103178] text-white shadow-lg shadow-[#103178]/30 flex items-center justify-center transition-all duration-300 hover:bg-[#0d266b] hover:scale-110 hover:shadow-xl hover:shadow-[#103178]/40 active:scale-95 ${
                visible
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 translate-y-4 pointer-events-none"
            }`}
        >
            <ArrowUp size={20} strokeWidth={2.5} />
        </button>
    );
}

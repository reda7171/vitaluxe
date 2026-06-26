"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function WindowScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // Next.js App Router bug : Force absolute top scroll on EACH route change
        // We use requestAnimationFrame to make sure the paint is done before scroll lock
        requestAnimationFrame(() => {
            window.scrollTo(0, 0);
            document.documentElement.scrollTo(0, 0);
            document.body.scrollTo(0, 0);
        });
        
        // Timeout override for slower paints (images loading, etc.)
        const timeout = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 100);

        return () => clearTimeout(timeout);
    }, [pathname]);

    return null;
}

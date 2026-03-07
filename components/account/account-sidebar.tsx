"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Package, Heart, MapPin, LogOut, ChevronRight, ShieldCheck, FileText } from "lucide-react";

const NAV_ITEMS = [
    { href: "/account", label: "Mon profil", icon: User },
    { href: "/account/orders", label: "Mes commandes", icon: Package },
    { href: "/account/wishlist", label: "Ma liste de souhaits", icon: Heart },
    { href: "/account/prescriptions", label: "Mes ordonnances", icon: FileText },
    { href: "/account/addresses", label: "Mes adresses", icon: MapPin },
];

export function AccountSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();
    const [ordersCount, setOrdersCount] = useState<number>(0);
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/account/orders")
            .then(r => r.json())
            .then(data => {
                if (Array.isArray(data)) setOrdersCount(data.length);
            })
            .catch(() => { });

        if (session?.user?.email) {
            fetch("/api/account/profile")
                .then(r => r.json())
                .then(data => {
                    if (data.image) setAvatarUrl(data.image);
                })
                .catch(() => { });
        }
    }, [session]);

    const initials = session?.user?.name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) ?? "U";

    return (
        <aside className="w-full lg:w-64 shrink-0">
            {/* Profile card */}
            <div className="bg-card rounded-2xl border p-5 mb-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-extrabold shrink-0 overflow-hidden">
                        {avatarUrl ? (
                            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="font-bold truncate">{session?.user?.name ?? "Chargement..."}</p>
                        <p className="text-xs text-muted-foreground truncate">{session?.user?.email}</p>
                        {session?.user?.role === "ADMIN" && (
                            <span className="inline-flex items-center gap-1 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold mt-1">
                                <ShieldCheck className="h-3 w-3" /> Admin
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="bg-card rounded-2xl border overflow-hidden">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                    const active = pathname === href;
                    const badge = href === "/account/orders" && ordersCount > 0 ? ordersCount : null;
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-3 px-4 py-3.5 text-sm font-medium transition-all group border-b last:border-b-0 ${active
                                ? "bg-primary/8 text-primary border-l-2 border-l-primary"
                                : "hover:bg-muted/50 text-foreground border-l-2 border-l-transparent"
                                }`}
                        >
                            <Icon className={`h-4 w-4 shrink-0 ${active ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                            <span className="flex-1">{label}</span>
                            {badge && (
                                <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge}</span>
                            )}
                            <ChevronRight className={`h-3.5 w-3.5 text-muted-foreground/50 transition-transform ${active ? "translate-x-0.5" : "group-hover:translate-x-0.5"}`} />
                        </Link>
                    );
                })}
                <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="w-full flex items-center gap-3 px-4 py-3.5 text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors border-l-2 border-l-transparent"
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Se déconnecter
                </button>
            </nav>
        </aside>
    );
}

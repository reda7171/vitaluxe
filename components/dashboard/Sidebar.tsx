"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
    LayoutDashboard, Package, ShoppingCart, MessageSquare, Mail,
    Users, Settings, Tag, LogOut, ChevronRight, BarChart2, Percent, FileText, Star, X, Calendar, Stethoscope
} from "lucide-react";

export function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();
    const { data: session } = useSession();
    const router = useRouter();
    const [pendingCount, setPendingCount] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [pendingPrescriptions, setPendingPrescriptions] = useState(0);
    const [abandonedCartsCount, setAbandonedCartsCount] = useState(0);
    const [enableServices, setEnableServices] = useState(true);
    const [enablePOS, setEnablePOS] = useState(true);

    useEffect(() => {
        fetch("/api/admin/notifications")
            .then(r => r.json())
            .then(d => {
                setPendingCount(d.count ?? 0);
                setUnreadMessages(d.messagesCount ?? 0);
                setPendingPrescriptions(d.prescriptionsCount ?? 0);
                setAbandonedCartsCount(d.abandonedCartsCount ?? 0);
                if (d.modules && typeof d.modules.enableServices === 'boolean') {
                    setEnableServices(d.modules.enableServices);
                }
                if (d.modules && typeof d.modules.enablePOS === 'boolean') {
                    setEnablePOS(d.modules.enablePOS);
                }
            })
            .catch(() => { });
    }, [pathname]);

    const isActive = (href: string, exact = false) =>
        exact ? pathname === href : pathname.startsWith(href);

    const NAV = [
        { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
        { href: "/admin/products", label: "Produits", icon: Package },
        { href: "/admin/categories", label: "Catégories", icon: Tag },
        { href: "/admin/orders", label: "Commandes", icon: ShoppingCart, badge: pendingCount },
        { href: "/admin/messages", label: "Messages", icon: MessageSquare, badge: unreadMessages },
        { href: "/admin/stock", label: "Stock", icon: BarChart2 },
        { href: "/admin/users", label: "Clients", icon: Users },
        { href: "/admin/promos", label: "Codes Promo", icon: Percent },
        { href: "/admin/brands", label: "Marques", icon: Tag },
        { href: "/admin/reviews", label: "Avis Clients", icon: Star },
        { href: "/admin/newsletter", label: "Newsletter", icon: Mail },
        { href: "/admin/prescriptions", label: "Ordonnances", icon: FileText, badge: pendingPrescriptions },
        { href: "/admin/abandoned-carts", label: "Paniers Abandonnés", icon: ShoppingCart, badge: abandonedCartsCount },
    ];

    if (enablePOS) {
        NAV.push({ href: "/admin/pos", label: "Point de Vente (POS)", icon: ShoppingCart });
    }

    if (enableServices) {
        NAV.push(
            { href: "/admin/services", label: "Services", icon: Stethoscope },
            { href: "/admin/reservations", label: "Réservations", icon: Calendar }
        );
    }

    return (
        <aside className={`w-64 bg-[#0f172a] text-white flex flex-col h-full shrink-0 shadow-xl fixed xl:static inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "-translate-x-full xl:translate-x-0"}`}>
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 shrink-0">
                <Link href="/" className="flex items-center" onClick={onClose}>
                    <div className="bg-white/90 p-1.5 rounded-lg">
                        <Image 
                            src="/VITALUXE.png" 
                            alt="Vitaluxe Logo" 
                            width={140} 
                            height={35} 
                            className="h-7 w-auto object-contain" 
                            priority 
                        />
                    </div>
                </Link>
                <button className="xl:hidden p-2 -mr-2 text-slate-400 hover:text-white rounded-lg transition-colors" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV.map(({ href, label, icon: Icon, exact, badge }) => {
                    const active = isActive(href, exact);
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={onClose}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${active
                                ? "bg-[#2d6a4f] text-white shadow-md shadow-[#2d6a4f]/30"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                                }`}
                        >
                            <Icon size={18} className={active ? "text-white" : "text-slate-500 group-hover:text-white"} />
                            <span className="flex-1">{label}</span>
                            {badge != null && badge > 0 && (
                                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                    {badge}
                                </span>
                            )}
                            {active && !(badge && badge > 0) && <ChevronRight size={14} className="opacity-60" />}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-3 py-4 border-t border-white/10 space-y-1 shrink-0">
                <Link
                    href="/admin/settings"
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${pathname === "/admin/settings"
                        ? "bg-white/10 text-white"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                >
                    <Settings size={18} />
                    <span>Paramètres</span>
                </Link>

                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mt-2">
                    <div className="w-8 h-8 rounded-full bg-[#2d6a4f] flex items-center justify-center text-xs font-bold shrink-0">
                        {session?.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) ?? "A"}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-white truncate">{session?.user?.name ?? "Admin"}</p>
                        <p className="text-[10px] text-slate-400 truncate">{session?.user?.email}</p>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="text-slate-500 hover:text-red-400 transition-colors"
                        title="Déconnexion"
                    >
                        <LogOut size={16} />
                    </button>
                </div>
            </div>
        </aside>
    );
}

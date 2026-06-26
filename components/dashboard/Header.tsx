"use client";

import { Bell, Search, Store, Menu, FileText, ShoppingCart, MessageSquare, AlertTriangle, Star } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const { data: session } = useSession();
    const [notifications, setNotifications] = useState<any>(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotifications = () => {
            if (session?.user && (session.user as any).role === "ADMIN") {
                fetch("/api/admin/notifications")
                    .then(r => r.json())
                    .then(setNotifications)
                    .catch(() => { });
            }
        };

        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, [session]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const totalNotifications = notifications ?
        (notifications.count || 0) +
        (notifications.prescriptionsCount || 0) +
        (notifications.reviewsCount || 0) +
        (notifications.messagesCount || 0) +
        (notifications.lowStockCount || 0) : 0;

    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 xl:px-6 shadow-sm shrink-0 gap-4">
            {/* Left: Mobile Toggle & Search */}
            <div className="flex items-center gap-2 lg:gap-4 flex-1 min-w-0">
                <button className="xl:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg shrink-0" onClick={onMenuClick}>
                    <Menu size={20} />
                </button>
                <div className="hidden md:flex flex-1 max-w-sm items-center bg-slate-100 rounded-xl px-3 py-2 gap-2">
                    <Search className="text-slate-400 shrink-0" size={16} />
                    <input
                        type="text"
                        placeholder="Rechercher..."
                        className="bg-transparent border-none outline-none w-full text-sm text-slate-700 placeholder:text-slate-400"
                    />
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                {/* Retour boutique */}
                <Link
                    href="/"
                    className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 hover:text-[#2d6a4f] transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-100"
                >
                    <Store size={14} />
                    <span>Voir la boutique</span>
                </Link>

                {/* Notifications */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setShowNotifications(!showNotifications)}
                        className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors shrink-0"
                    >
                        <Bell size={18} />
                        {totalNotifications > 0 && (
                            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                                {totalNotifications > 0 && (
                                    <span className="bg-red-100 text-red-600 text-[10px] font-black px-2 py-0.5 rounded-full">{totalNotifications}</span>
                                )}
                            </div>
                            <div className="divide-y divide-slate-50 max-h-80 overflow-y-auto">
                                {totalNotifications === 0 ? (
                                    <p className="p-4 text-center text-xs text-slate-400">Aucune nouvelle notification.</p>
                                ) : (
                                    <>
                                        {notifications?.count > 0 && (
                                            <Link href="/admin/orders" onClick={() => setShowNotifications(false)} className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                                                    <ShoppingCart className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">Nouvelle(s) commande(s)</p>
                                                    <p className="text-xs text-slate-500">{notifications.count} commande(s) en attente.</p>
                                                </div>
                                            </Link>
                                        )}
                                        {notifications?.prescriptionsCount > 0 && (
                                            <Link href="/admin/prescriptions" onClick={() => setShowNotifications(false)} className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                                                    <FileText className="h-4 w-4 text-emerald-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">Nouvelle(s) ordonnance(s)</p>
                                                    <p className="text-xs text-slate-500">{notifications.prescriptionsCount} ordonnance(s) reçue(s).</p>
                                                </div>
                                            </Link>
                                        )}
                                        {notifications?.messagesCount > 0 && (
                                            <Link href="/admin/messages" onClick={() => setShowNotifications(false)} className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                                                    <MessageSquare className="h-4 w-4 text-orange-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">Nouveau(x) message(s)</p>
                                                    <p className="text-xs text-slate-500">{notifications.messagesCount} message(s) non lu(s).</p>
                                                </div>
                                            </Link>
                                        )}
                                        {notifications?.reviewsCount > 0 && (
                                            <Link href="/admin/reviews" onClick={() => setShowNotifications(false)} className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center shrink-0">
                                                    <Star className="h-4 w-4 text-amber-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">Avis en attente</p>
                                                    <p className="text-xs text-slate-500">{notifications.reviewsCount} avis à valider.</p>
                                                </div>
                                            </Link>
                                        )}
                                        {notifications?.lowStockCount > 0 && (
                                            <Link href="/admin/products" onClick={() => setShowNotifications(false)} className="flex items-start gap-3 p-4 hover:bg-slate-50 transition-colors">
                                                <div className="w-8 h-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                                                    <AlertTriangle className="h-4 w-4 text-red-600" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">Alertes de stock</p>
                                                    <p className="text-xs text-slate-500">{notifications.lowStockCount} produit(s) en stock critique (&#60;10).</p>
                                                </div>
                                            </Link>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {session?.user?.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) ?? "A"}
                    </div>
                    <div className="hidden md:block">
                        <p className="text-xs font-semibold text-slate-800 leading-none">{session?.user?.name ?? "Admin"}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Administrateur</p>
                    </div>
                </div>
            </div>
        </header>
    );
}

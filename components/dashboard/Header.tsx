"use client";

import { Bell, Search, Store, Menu } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
    const { data: session } = useSession();

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
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors shrink-0">
                    <Bell size={18} />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
                </button>

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

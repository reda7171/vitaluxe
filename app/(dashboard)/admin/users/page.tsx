"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Search, ShoppingBag, ChevronLeft, ChevronRight, Ban, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface UserData {
    id: string;
    name: string | null;
    email: string;
    role: string;
    createdAt: string;
    _count: { orders: number };
    totalSpent: number;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const PAGE = 10;

    const load = () => {
        setLoading(true);
        fetch("/api/admin/users")
            .then(r => r.json())
            .then(d => { setUsers(Array.isArray(d) ? d : []); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const toggleRole = async (id: string, currentRole: string) => {
        const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
        if (!confirm(`Passer cet utilisateur en ${newRole} ?`)) return;

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
            });
            if (res.ok) {
                toast.success(`Rôle mis à jour (${newRole})`);
                load();
            } else {
                toast.error("Erreur de mise à jour");
            }
        } catch {
            toast.error("Erreur serveur");
        }
    };

    const filtered = users.filter(u =>
        (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE));
    const paginated = filtered.slice((page - 1) * PAGE, page * PAGE);

    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
                    <p className="text-sm text-slate-400 mt-0.5">{users.filter(u => u.role === "CUSTOMER").length} clients inscrits</p>
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                    placeholder="Rechercher par nom ou email..."
                    className="w-full pl-10 pr-4 h-10 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 bg-white" />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                            <th className="px-5 py-3">Client</th>
                            <th className="px-5 py-3">Rôle</th>
                            <th className="px-5 py-3">Commandes</th>
                            <th className="px-5 py-3">Total dépensé</th>
                            <th className="px-5 py-3">Inscrit le</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="py-16 text-center"><Loader2 className="animate-spin h-5 w-5 mx-auto text-slate-400" /></td></tr>
                        ) : paginated.length === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-sm">Aucun utilisateur.</td></tr>
                        ) : paginated.map(u => (
                            <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-[#103178] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            {(u.name ?? u.email)[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm text-slate-900">{u.name ?? "—"}</p>
                                            <p className="text-xs text-slate-400">{u.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3.5">
                                    <button
                                        onClick={() => toggleRole(u.id, u.role)}
                                        className={`px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${u.role === "ADMIN" ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : "bg-blue-100 text-blue-700 hover:bg-blue-200"}`}
                                        title={`Changer le rôle vers ${u.role === "ADMIN" ? "CUSTOMER" : "ADMIN"}`}
                                    >
                                        {u.role}
                                    </button>
                                </td>
                                <td className="px-5 py-3.5">
                                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                                        <ShoppingBag size={14} />
                                        {u._count.orders}
                                    </div>
                                </td>
                                <td className="px-5 py-3.5 font-semibold text-sm">{u.totalSpent.toFixed(0)} MAD</td>
                                <td className="px-5 py-3.5 text-sm text-slate-400">
                                    {new Date(u.createdAt).toLocaleDateString("fr-FR")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50">
                        <span className="text-xs text-slate-400">{(page - 1) * PAGE + 1}–{Math.min(page * PAGE, filtered.length)} sur {filtered.length}</span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40">
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                <button key={n} onClick={() => setPage(n)}
                                    className={`w-7 h-7 rounded-lg text-xs font-semibold ${n === page ? "bg-[#2d6a4f] text-white" : "border border-slate-200 text-slate-500 hover:bg-white"}`}>
                                    {n}
                                </button>
                            ))}
                            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40">
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

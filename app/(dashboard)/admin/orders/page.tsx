"use client";

import { useState, useEffect, Fragment } from "react";
import { Download, Search, ChevronDown, ChevronUp, Package, CreditCard, Calendar, User, ChevronLeft, ChevronRight, Filter, RefreshCw, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    PROCESSING: "bg-blue-100 text-blue-800 border-blue-200",
    SHIPPED: "bg-purple-100 text-purple-800 border-purple-200",
    DELIVERED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    CANCELLED: "bg-red-100 text-red-800 border-red-200",
};

const STATUS_LABELS: Record<string, string> = {
    PENDING: "En attente",
    PROCESSING: "En cours",
    SHIPPED: "Expédiée",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
};

const PAYMENT_LABELS: Record<string, string> = {
    CARD: "Carte",
    COD: "Livraison",
    PAYPAL: "PayPal",
    STRIPE: "Stripe",
    POS_CASH: "POS - Espèces",
    POS_CARD: "POS - Carte",
};

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
    user: { name: string; email: string; image?: string | null };
    orderItems: { product: { name: string }; quantity: number; price: number }[];
}

const PAGE_SIZE = 10;

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [paymentFilter, setPaymentFilter] = useState("");
    const [originFilter, setOriginFilter] = useState("");
    const [sortBy, setSortBy] = useState<"date" | "amount">("date");
    const [sortDir, setSortDir] = useState<"desc" | "asc">("desc");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const load = () => {
        setLoading(true);
        fetch("/api/orders")
            .then((r) => r.json())
            .then((data) => { setOrders(data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => { load(); }, []);

    const filtered = orders
        .filter(o =>
            (!statusFilter || o.status === statusFilter) &&
            (!paymentFilter || o.paymentMethod === paymentFilter) &&
            (!originFilter || (originFilter === "POS" ? o.paymentMethod?.startsWith("POS_") : !o.paymentMethod?.startsWith("POS_"))) &&
            (!search || o.user.name?.toLowerCase().includes(search.toLowerCase()) || o.user.email.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())) &&
            (!dateFrom || new Date(o.createdAt) >= new Date(dateFrom)) &&
            (!dateTo || new Date(o.createdAt) <= new Date(dateTo + "T23:59:59"))
        )
        .sort((a, b) => {
            if (sortBy === "date") {
                return sortDir === "desc"
                    ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else {
                return sortDir === "desc" ? b.totalAmount - a.totalAmount : a.totalAmount - b.totalAmount;
            }
        });

    const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const totalRevenue = filtered.reduce((acc, o) => o.status !== "CANCELLED" ? acc + o.totalAmount : acc, 0);

    const updateStatus = async (id: string, status: string) => {
        const toastId = toast.loading("Mise à jour...");
        const res = await fetch(`/api/orders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (res.ok) {
            toast.success("Statut mis à jour", { id: toastId });
            load();
        } else {
            toast.error("Erreur lors de la mise à jour", { id: toastId });
        }
    };

    const removeMultiple = async () => {
        if (!confirm(`Supprimer les ${selectedIds.length} commandes sélectionnées ?`)) return;
        const toastId = toast.loading("Suppression multiple...");
        try {
            const res = await fetch("/api/orders/bulk", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds })
            });
            if (res.ok) {
                toast.success("Commandes supprimées", { id: toastId });
                setSelectedIds([]);
                load();
            } else {
                toast.error("Erreur lors de la suppression multiple", { id: toastId });
            }
        } catch (e) {
            toast.error("Une erreur est survenue", { id: toastId });
        }
    };

    const toggleSelectAll = () => {
        const allOnPageSelected = paginated.length > 0 && paginated.every(o => selectedIds.includes(o.id));
        if (allOnPageSelected) {
            setSelectedIds(prev => prev.filter(id => !paginated.some(o => o.id === id)));
        } else {
            const newIds = paginated.filter(o => !selectedIds.includes(o.id)).map(o => o.id);
            setSelectedIds(prev => [...prev, ...newIds]);
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSort = (field: "date" | "amount") => {
        if (sortBy === field) setSortDir(d => d === "desc" ? "asc" : "desc");
        else { setSortBy(field); setSortDir("desc"); }
        setPage(1);
    };

    const SortIcon = ({ field }: { field: "date" | "amount" }) =>
        sortBy === field
            ? (sortDir === "desc" ? <ChevronDown size={14} className="inline ml-1" /> : <ChevronUp size={14} className="inline ml-1" />)
            : null;

    // Stats rapides
    const statsByStatus = Object.keys(STATUS_LABELS).map(s => ({
        label: STATUS_LABELS[s],
        count: orders.filter(o => o.status === s).length,
        color: STATUS_COLORS[s],
    }));

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Commandes</h1>
                    <p className="text-sm text-slate-400 mt-0.5">{orders.length} commande{orders.length !== 1 ? "s" : ""} au total</p>
                </div>
                <div className="flex gap-2">
                    {selectedIds.length > 0 && (
                        <button onClick={removeMultiple}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors shadow-sm">
                            <Trash2 size={16} /> Supprimer ({selectedIds.length})
                        </button>
                    )}
                    <button onClick={load} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-medium hover:bg-slate-50 transition-colors">
                        <RefreshCw size={15} /> Rafraîchir
                    </button>
                    <a href="/api/admin/export/orders"
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245c43] transition-colors shadow-sm">
                        <Download size={16} /> Exporter CSV
                    </a>
                </div>
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {statsByStatus.map(s => (
                    <button key={s.label}
                        onClick={() => { setStatusFilter(orders.find(o => STATUS_LABELS[o.status] === s.label)?.status || ""); setPage(1); }}
                        className={`rounded-xl border px-3 py-3 text-left transition-all hover:shadow-sm ${s.color}`}>
                        <p className="text-2xl font-black">{s.count}</p>
                        <p className="text-xs font-medium mt-0.5 opacity-80">{s.label}</p>
                    </button>
                ))}
            </div>

            {/* Revenu filtré */}
            <div className="bg-gradient-to-r from-[#2d6a4f] to-[#1b4332] text-white rounded-2xl px-6 py-4 flex items-center justify-between shadow-md">
                <div>
                    <p className="text-xs font-semibold opacity-70 uppercase tracking-widest">Revenus (filtrés)</p>
                    <p className="text-3xl font-black mt-0.5">{totalRevenue.toFixed(0)} MAD</p>
                </div>
                <div className="text-right">
                    <p className="text-xs opacity-70">{filtered.filter(o => o.status !== "CANCELLED").length} commandes valides</p>
                    <p className="text-xs opacity-70 mt-0.5">sur {filtered.length} affichées</p>
                </div>
            </div>

            {/* Filtres */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                    <Filter size={15} className="text-slate-400" />
                    <span className="text-sm font-semibold text-slate-600">Filtres</span>
                    {(search || statusFilter || paymentFilter || originFilter || dateFrom || dateTo) && (
                        <button onClick={() => { setSearch(""); setStatusFilter(""); setPaymentFilter(""); setOriginFilter(""); setDateFrom(""); setDateTo(""); setPage(1); }}
                            className="ml-auto text-xs text-red-500 hover:underline">Réinitialiser</button>
                    )}
                </div>
                <div className="flex flex-wrap gap-3">
                    <div className="relative flex-1 min-w-[180px]">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                            placeholder="Client, email ou ID..."
                            className="w-full pl-9 h-9 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 bg-white" />
                    </div>
                    <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                        className="h-9 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none min-w-[130px]">
                        <option value="">Tous les statuts</option>
                        {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <select value={originFilter} onChange={e => { setOriginFilter(e.target.value); setPage(1); }}
                        className="h-9 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none min-w-[130px]">
                        <option value="">Toutes origines</option>
                        <option value="ONLINE">Boutique en ligne</option>
                        <option value="POS">Point de Vente (POS)</option>
                    </select>
                    <select value={paymentFilter} onChange={e => { setPaymentFilter(e.target.value); setPage(1); }}
                        className="h-9 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none min-w-[130px]">
                        <option value="">Tous paiements</option>
                        {Object.entries(PAYMENT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                    <div className="flex items-center gap-2">
                        <input type="date" value={dateFrom} onChange={e => { setDateFrom(e.target.value); setPage(1); }}
                            className="h-9 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none" />
                        <span className="text-slate-400 text-xs">→</span>
                        <input type="date" value={dateTo} onChange={e => { setDateTo(e.target.value); setPage(1); }}
                            className="h-9 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto hide-scrollbar">
                    <table className="w-full text-left min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wide">
                                <th className="px-5 py-3 w-10">
                                    <input 
                                        type="checkbox" 
                                        className="w-4 h-4 rounded border-slate-300 text-[#2d6a4f] focus:ring-[#2d6a4f]/20 cursor-pointer"
                                        checked={paginated.length > 0 && paginated.every(o => selectedIds.includes(o.id))}
                                        onChange={toggleSelectAll}
                                    />
                                </th>
                                <th className="px-5 py-3 flex items-center gap-1"><User size={13} /> Client</th>
                                <th className="px-5 py-3 cursor-pointer select-none hover:text-slate-900" onClick={() => toggleSort("amount")}>
                                    <CreditCard size={13} className="inline mr-1" />Total <SortIcon field="amount" />
                                </th>
                                <th className="px-5 py-3">Paiement</th>
                                <th className="px-5 py-3 cursor-pointer select-none hover:text-slate-900" onClick={() => toggleSort("date")}>
                                    <Calendar size={13} className="inline mr-1" />Date <SortIcon field="date" />
                                </th>
                                <th className="px-5 py-3">Statut</th>
                                <th className="px-5 py-3"><Package size={13} className="inline mr-1" />Détails</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-sm">Chargement...</td></tr>
                            ) : paginated.length === 0 ? (
                                <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-sm">Aucune commande trouvée.</td></tr>
                            ) : paginated.map((order) => (
                                <Fragment key={order.id}>
                                    <tr className={`border-b border-slate-100 hover:bg-slate-50 transition-colors ${selectedIds.includes(order.id) ? "bg-emerald-50/30" : ""}`}>
                                        <td className="px-5 py-4">
                                            <input 
                                                type="checkbox" 
                                                className="w-4 h-4 rounded border-slate-300 text-[#2d6a4f] focus:ring-[#2d6a4f]/20 cursor-pointer"
                                                checked={selectedIds.includes(order.id)}
                                                onChange={() => toggleSelect(order.id)}
                                            />
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-9 w-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                                    <img 
                                                        src={order.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user.name || "C")}&background=random&color=fff`} 
                                                        alt={order.user.name} 
                                                        className="w-full h-full object-cover"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-slate-900 text-sm truncate">{order.user.name}</div>
                                                    <div className="text-xs text-slate-400 truncate">{order.user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-5 py-4 font-semibold text-sm text-slate-900">{order.totalAmount} MAD</td>
                                        <td className="px-5 py-4 text-sm text-slate-600">{PAYMENT_LABELS[order.paymentMethod] ?? order.paymentMethod}</td>
                                        <td className="px-5 py-4 text-sm text-slate-500">
                                            {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                                        </td>
                                        <td className="px-5 py-4">
                                            <select
                                                value={order.status}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                                className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer outline-none ${STATUS_COLORS[order.status]}`}
                                            >
                                                {Object.keys(STATUS_LABELS).map((s) => (
                                                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                                    className="flex items-center gap-1 text-xs text-slate-500 font-semibold hover:text-[#2d6a4f]"
                                                >
                                                    {expanded === order.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                                    {expanded === order.id ? "Masquer" : "Voir"}
                                                </button>
                                                <Link 
                                                    href={`/admin/orders/${order.id}`}
                                                    className="flex items-center gap-1 text-xs text-[#2d6a4f] font-bold hover:underline"
                                                >
                                                    <ExternalLink size={14} /> Ouvrir
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>

                                    {expanded === order.id && (
                                        <tr key={`${order.id}-detail`} className="bg-slate-50">
                                            <td colSpan={7} className="px-8 py-5">
                                                <p className="text-xs text-slate-400 uppercase font-semibold mb-3">
                                                    ID: <span className="font-mono text-slate-600">{order.id}</span>
                                                </p>
                                                <table className="w-full text-sm">
                                                    <thead>
                                                        <tr className="text-slate-500 border-b text-xs uppercase">
                                                            <th className="text-left pb-2">Produit</th>
                                                            <th className="text-left pb-2">Qté</th>
                                                            <th className="text-left pb-2">Prix unitaire</th>
                                                            <th className="text-left pb-2">Sous-total</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {order.orderItems.map((item, i) => (
                                                            <tr key={i} className="border-b border-slate-100">
                                                                <td className="py-2 font-medium text-slate-800">{item.product.name}</td>
                                                                <td className="py-2 text-slate-600">{item.quantity}</td>
                                                                <td className="py-2 text-slate-600">{item.price} MAD</td>
                                                                <td className="py-2 font-semibold text-slate-900">{(item.price * item.quantity).toFixed(2)} MAD</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                    <tfoot>
                                                        <tr>
                                                            <td colSpan={3} className="pt-3 text-right text-sm font-bold text-slate-700">Total :</td>
                                                            <td className="pt-3 font-black text-slate-900">{order.totalAmount} MAD</td>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50 gap-3 sm:gap-0">
                        <span className="text-xs text-slate-400">
                            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} sur {filtered.length}
                        </span>
                        <div className="flex items-center gap-1">
                            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                                className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-white disabled:opacity-40">
                                <ChevronLeft size={16} />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                                <button key={n} onClick={() => setPage(n)}
                                    className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${n === page ? "bg-[#2d6a4f] text-white" : "border border-slate-200 text-slate-500 hover:bg-white"}`}>
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

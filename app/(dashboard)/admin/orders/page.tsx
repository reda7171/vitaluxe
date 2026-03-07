"use client";

import { useState, useEffect, Fragment } from "react";
import { Download, Search } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    PROCESSING: "bg-blue-100 text-blue-800",
    SHIPPED: "bg-purple-100 text-purple-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
    PENDING: "En attente",
    PROCESSING: "En cours",
    SHIPPED: "Expédiée",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
};

interface Order {
    id: string;
    totalAmount: number;
    status: string;
    paymentMethod: string;
    createdAt: string;
    user: { name: string; email: string };
    orderItems: { product: { name: string }; quantity: number; price: number }[];
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const load = () =>
        fetch("/api/orders").then((r) => r.json()).then(setOrders);

    useEffect(() => { load(); }, []);

    const filtered = orders.filter(o =>
        (!statusFilter || o.status === statusFilter) &&
        (!search || o.user.name?.toLowerCase().includes(search.toLowerCase()) || o.user.email.toLowerCase().includes(search.toLowerCase()))
    );

    const updateStatus = async (id: string, status: string) => {
        await fetch(`/api/orders/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        load();
    };

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Commandes</h1>
                    <p className="text-sm text-slate-400 mt-0.5">{orders.length} commande{orders.length !== 1 ? "s" : ""}</p>
                </div>
                <a href="/api/admin/export/orders"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2d6a4f] text-white text-sm font-semibold hover:bg-[#245c43] transition-colors shadow-sm">
                    <Download size={16} /> Exporter CSV
                </a>
            </div>

            {/* Filtres */}
            <div className="flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Rechercher client..."
                        className="w-full pl-9 h-9 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20 bg-white" />
                </div>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="h-9 px-3 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none">
                    <option value="">Tous les statuts</option>
                    {Object.entries(STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-medium">
                            <th className="px-6 py-3">Client</th>
                            <th className="px-6 py-3">Total</th>
                            <th className="px-6 py-3">Paiement</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Statut</th>
                            <th className="px-6 py-3">Détails</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="py-10 text-center text-slate-400 text-sm">
                                    Aucune commande.
                                </td>
                            </tr>
                        ) : filtered.map((order) => (
                            <Fragment key={order.id}>
                                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900 text-sm">{order.user.name}</div>
                                        <div className="text-xs text-slate-400">{order.user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-sm">{order.totalAmount} MAD</td>
                                    <td className="px-6 py-4 text-sm text-slate-600">{order.paymentMethod}</td>
                                    <td className="px-6 py-4 text-sm text-slate-500">
                                        {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => updateStatus(order.id, e.target.value)}
                                            className={`text-xs font-semibold px-2 py-1 rounded-full border-none cursor-pointer ${STATUS_COLORS[order.status]}`}
                                        >
                                            {Object.keys(STATUS_LABELS).map((s) => (
                                                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                            className="text-xs text-blue-600 hover:underline"
                                        >
                                            {expanded === order.id ? "Masquer" : "Voir"}
                                        </button>
                                    </td>
                                </tr>

                                {expanded === order.id && (
                                    <tr key={`${order.id}-detail`} className="bg-slate-50">
                                        <td colSpan={6} className="px-8 py-4">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-slate-500 border-b">
                                                        <th className="text-left pb-2">Produit</th>
                                                        <th className="text-left pb-2">Qté</th>
                                                        <th className="text-left pb-2">Prix</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.orderItems.map((item, i) => (
                                                        <tr key={i} className="border-b border-slate-100">
                                                            <td className="py-2">{item.product.name}</td>
                                                            <td className="py-2">{item.quantity}</td>
                                                            <td className="py-2">{item.price} MAD</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

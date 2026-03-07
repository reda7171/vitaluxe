"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, Search, ChevronDown, Truck, CheckCircle2, Clock, XCircle, Download, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const STATUS_CONFIG: Record<OrderStatus, { icon: typeof Truck; color: string; bg: string; label: string }> = {
    PENDING: { icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", label: "En attente" },
    PROCESSING: { icon: Package, color: "text-blue-600", bg: "bg-blue-50 border-blue-200", label: "En cours" },
    SHIPPED: { icon: Truck, color: "text-purple-600", bg: "bg-purple-50 border-purple-200", label: "Expédiée" },
    DELIVERED: { icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200", label: "Livrée" },
    CANCELLED: { icon: XCircle, color: "text-red-600", bg: "bg-red-50 border-red-200", label: "Annulée" },
};

const STATUS_LABELS: Record<string, string> = {
    Tous: "Tous", PENDING: "En attente", PROCESSING: "En cours",
    SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée",
};

interface OrderItem {
    id: string;
    quantity: number;
    price: number;
    product: { name: string; brand: string; images: string[]; slug: string };
}

interface Order {
    id: string;
    status: OrderStatus;
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
    orderItems: OrderItem[];
}

const ALL_STATUSES = ["Tous", "PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrdersView() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Tous");
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/account/orders")
            .then((r) => r.json())
            .then((data) => {
                setOrders(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = orders.filter((o) => {
        const matchStatus = statusFilter === "Tous" || o.status === statusFilter;
        const matchSearch =
            o.id.toLowerCase().includes(search.toLowerCase()) ||
            o.orderItems.some((i) => i.product.name.toLowerCase().includes(search.toLowerCase()));
        return matchStatus && matchSearch;
    });

    const stats = [
        { label: "Total commandes", value: orders.length, color: "text-primary" },
        { label: "Livrées", value: orders.filter((o) => o.status === "DELIVERED").length, color: "text-emerald-600" },
        { label: "En cours", value: orders.filter((o) => ["PENDING", "PROCESSING", "SHIPPED"].includes(o.status)).length, color: "text-blue-600" },
        { label: "Montant total", value: `${orders.reduce((s, o) => s + o.totalAmount, 0).toFixed(0)} MAD`, color: "text-amber-600" },
    ];

    if (loading) {
        return <div className="flex items-center justify-center py-32 text-slate-400">Chargement...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map(({ label, value, color }) => (
                    <div key={label} className="bg-card rounded-2xl border p-4 text-center">
                        <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* Filtres */}
            <div className="bg-card rounded-2xl border p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Rechercher par numéro ou produit..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-9"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {ALL_STATUSES.map((s) => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${statusFilter === s
                                        ? "bg-primary text-primary-foreground border-primary"
                                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                                    }`}
                            >
                                {STATUS_LABELS[s]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Liste commandes */}
            {filtered.length === 0 ? (
                <div className="bg-card rounded-2xl border p-12 text-center">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                    <p className="font-semibold text-muted-foreground">
                        {orders.length === 0 ? "Aucune commande pour le moment." : "Aucune commande trouvée."}
                    </p>
                    <Button asChild className="mt-4" variant="outline">
                        <Link href="/shop">Commencer mes achats</Link>
                    </Button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filtered.map((order, i) => {
                        const cfg = STATUS_CONFIG[order.status];
                        const StatusIcon = cfg.icon;
                        const isExpanded = expandedId === order.id;
                        const date = new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

                        return (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, delay: i * 0.06 }}
                                className="bg-card rounded-2xl border overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <button
                                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                                    className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 text-left hover:bg-muted/20 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                            <Package className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm font-mono">{order.id.slice(0, 8).toUpperCase()}</p>
                                            <p className="text-xs text-muted-foreground">{date} · {order.orderItems.length} article{order.orderItems.length > 1 ? "s" : ""}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 sm:gap-6">
                                        <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.color}`}>
                                            <StatusIcon className="h-3.5 w-3.5" />{cfg.label}
                                        </span>
                                        <span className="font-extrabold text-lg">{order.totalAmount} MAD</span>
                                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                                    </div>
                                </button>

                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="border-t"
                                    >
                                        <div className="p-5 space-y-5">
                                            {/* Produits */}
                                            <div className="space-y-3">
                                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Produits commandés</p>
                                                {order.orderItems.map((item) => {
                                                    const image = (item.product.images as string[])?.[0];
                                                    return (
                                                        <div key={item.id} className="flex items-center gap-4 bg-muted/30 rounded-xl p-3">
                                                            <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border bg-slate-100 flex items-center justify-center">
                                                                {image ? <img src={image} alt={item.product.name} className="w-full h-full object-cover" /> : <span className="text-2xl">💊</span>}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-bold text-primary">{item.product.brand}</p>
                                                                <p className="text-sm font-semibold line-clamp-1">{item.product.name}</p>
                                                                <p className="text-xs text-muted-foreground mt-0.5">Qté : {item.quantity}</p>
                                                            </div>
                                                            <div className="text-right shrink-0">
                                                                <p className="font-bold">{item.price} MAD</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Résumé */}
                                            <div className="bg-muted/30 rounded-xl p-4 space-y-1.5 text-sm">
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Mode paiement</span><span>{order.paymentMethod}</span>
                                                </div>
                                                <div className="flex justify-between font-extrabold text-base pt-1.5 border-t">
                                                    <span>Total</span><span>{order.totalAmount} MAD</span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex flex-wrap gap-2 justify-end">
                                                <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                                                    <Download className="h-3.5 w-3.5" /> Facture PDF
                                                </Button>
                                                <Button size="sm" className="gap-1.5 text-xs" asChild>
                                                    <Link href="/shop">
                                                        <ChevronRight className="h-3.5 w-3.5" /> Commander à nouveau
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

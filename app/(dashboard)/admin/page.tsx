"use client"

import { useState, useEffect } from "react";
import { Package, ShoppingCart, Users, DollarSign, Mail, Loader2, TrendingUp, ChevronRight, ExternalLink } from "lucide-react";
import { AdminDashboardCharts } from "../../../components/dashboard/AdminDashboardCharts";
import Link from "next/link";

const AnimatedNumber = ({ value, suffix = "", duration = 1200 }: { value: number, suffix?: string, duration?: number }) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime: number | null = null;
        let animationFrame: number;
        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const percentage = Math.min(progress / duration, 1);
            const easeOut = 1 - Math.pow(1 - percentage, 3); // ease-out cubic
            setCount(Math.floor(value * easeOut));
            if (progress < duration) {
                animationFrame = requestAnimationFrame(animate);
            } else {
                setCount(value);
            }
        };
        animationFrame = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrame);
    }, [value, duration]);
    return <>{count}{suffix}</>;
};

export default function AdminDashboard() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const res = await fetch("/api/admin/stats");
                if (!res.ok) throw new Error("Erreur lors de la récupération des statistiques");
                const statsData = await res.json();
                setData(statsData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-slate-500 animate-pulse font-medium tracking-wide">Initialisation du tableau de bord...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-100 max-w-2xl mx-auto shadow-sm">
                <p className="font-black text-lg">Oups ! Une erreur est survenue</p>
                <p className="text-sm mt-1">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg font-bold text-xs"
                >
                    Réessayer
                </button>
            </div>
        );
    }

    const { stats, recentOrders, ordersByStatus, monthlyOrders } = data;

    // Agréger par mois pour le graphique
    const monthlyFormatted: Record<string, number> = {};
    monthlyOrders.forEach(({ createdAt, totalAmount }: any) => {
        const key = new Date(createdAt).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
        monthlyFormatted[key] = (monthlyFormatted[key] ?? 0) + totalAmount;
    });
    const revenueChart = Object.entries(monthlyFormatted).map(([month, total]) => ({ month, total: Math.round(total) }));

    const statusMap: Record<string, string> = {
        PENDING: "Attente",
        PROCESSING: "Traitement",
        SHIPPED: "Expédiée",
        DELIVERED: "Livrée",
        CANCELLED: "Annulée"
    };

    const statusChart = ordersByStatus.map((s: any) => ({
        name: statusMap[s.status as string] ?? s.status,
        value: s._count.id,
    }));

    const kpiStats = [
        { label: "Ventes Totales", value: stats.totalRevenue ?? 0, suffix: " MAD", sub: "Commandes livrées", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        { label: "Commandes", value: stats.totalOrders, suffix: "", sub: "total cumulé", icon: ShoppingCart, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
        { label: "Messages", value: stats.unreadMessages, suffix: "", sub: "demandes non lues", icon: Mail, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
        { label: "Clients", value: stats.totalUsers, suffix: "", sub: "comptes actifs", icon: Users, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
    ];

    const STATUS_COLORS: Record<string, string> = {
        DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
        SHIPPED: "bg-blue-100 text-blue-700 border-blue-200",
        CANCELLED: "bg-rose-100 text-rose-700 border-rose-200",
        PROCESSING: "bg-purple-100 text-purple-700 border-purple-200",
        PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Tableau de bord</h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium italic">Bienvenue sur votre espace d'administration Vitaluxe</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/admin/products/new" className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                        + Nouveau produit
                    </Link>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {kpiStats.map((s) => (
                    <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{s.label}</span>
                            <div className={`p-3 rounded-2xl ${s.bg} group-hover:scale-110 transition-transform`}>
                                <s.icon className={`h-6 w-6 ${s.color}`} />
                            </div>
                        </div>
                        <div className="text-4xl font-black text-slate-900 tracking-tight">
                            <AnimatedNumber value={s.value} suffix={s.suffix} />
                        </div>
                        <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[10px] text-slate-400 font-semibold">{s.sub}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Charts Section */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="font-black text-slate-900 text-xl flex items-center gap-2">
                                <TrendingUp className="h-5 w-5 text-emerald-500" /> Analyse de performance
                            </h2>
                        </div>
                        <AdminDashboardCharts
                            revenueData={revenueChart}
                            statusData={statusChart}
                            categoryData={data.salesByCategory || []}
                        />
                    </div>
                </div>

                {/* Right Column: Recent Activity */}
                <div className="space-y-8">
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="font-black text-slate-800">Commandes</h2>
                            <Link href="/admin/orders" className="text-[10px] uppercase tracking-widest text-[#103178] font-black hover:underline flex items-center gap-1">
                                Voir Tout <ChevronRight size={12} />
                            </Link>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {recentOrders.length === 0 ? (
                                <p className="px-8 py-12 text-center text-slate-400 text-sm italic">Aucune commande récente.</p>
                            ) : (
                                recentOrders.map((order: any) => (
                                    <Link 
                                        key={order.id} 
                                        href={`/admin/orders/${order.id}`}
                                        className="px-8 py-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group"
                                    >
                                        <div className="min-w-0 pr-4">
                                            <p className="text-sm font-black text-slate-900 truncate group-hover:text-[#103178] transition-colors">{order.user.name ?? order.user.email}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 tracking-wider">
                                                {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} · {order.paymentMethod}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border uppercase tracking-tighter ${STATUS_COLORS[order.status as string] ?? "bg-slate-100 text-slate-600"}`}>
                                                {order.status}
                                            </span>
                                            <p className="text-sm font-black text-slate-900 whitespace-nowrap">{order.totalAmount} MAD</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

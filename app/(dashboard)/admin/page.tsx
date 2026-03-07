import prisma from "@/lib/prisma";
import { Package, ShoppingCart, Users, DollarSign, Mail } from "lucide-react";
import { AdminDashboardCharts } from "@/components/dashboard/AdminDashboardCharts";

export default async function AdminDashboard() {
    const [totalProducts, totalOrders, totalUsers, revenue, unreadMessages] = await Promise.all([
        prisma.product.count(),
        prisma.order.count(),
        prisma.user.count({ where: { role: "CUSTOMER" } }),
        prisma.order.aggregate({
            _sum: { totalAmount: true },
            where: { status: "DELIVERED" },
        }),
        prisma.contactMessage.count({ where: { status: "UNREAD" } })
    ]);

    const recentOrders = await prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, email: true } } },
    });

    // Données pour graphique : commandes par statut
    const ordersByStatus = await prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
    });

    // Données pour graphique : revenus 6 derniers mois
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const monthlyOrders = await prisma.order.findMany({
        where: { createdAt: { gte: sixMonthsAgo }, status: "DELIVERED" },
        select: { createdAt: true, totalAmount: true },
        orderBy: { createdAt: "asc" },
    });

    // Agréger par mois
    const monthlyData: Record<string, number> = {};
    monthlyOrders.forEach(({ createdAt, totalAmount }) => {
        const key = new Date(createdAt).toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
        monthlyData[key] = (monthlyData[key] ?? 0) + totalAmount;
    });
    const revenueChart = Object.entries(monthlyData).map(([month, total]) => ({ month, total: Math.round(total) }));

    const statusChart = ordersByStatus.map(s => ({
        name: { PENDING: "Attente", PROCESSING: "Traitement", SHIPPED: "Expédiée", DELIVERED: "Livrée", CANCELLED: "Annulée" }[s.status] ?? s.status,
        value: s._count.id,
    }));

    const stats = [
        { label: "Ventes Totales", value: `${(revenue._sum.totalAmount ?? 0).toFixed(0)} MAD`, sub: "Commandes livrées", icon: DollarSign, color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" },
        { label: "Commandes", value: totalOrders, sub: "total", icon: ShoppingCart, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
        { label: "Messages", value: unreadMessages, sub: "non lus", icon: Mail, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
        { label: "Produits Actifs", value: totalProducts, sub: "en catalogue", icon: Package, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
        { label: "Clients", value: totalUsers, sub: "inscrits", icon: Users, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
    ];

    const STATUS_COLORS: Record<string, string> = {
        DELIVERED: "bg-green-100 text-green-700", SHIPPED: "bg-blue-100 text-blue-700",
        CANCELLED: "bg-red-100 text-red-700", PROCESSING: "bg-purple-100 text-purple-700",
        PENDING: "bg-yellow-100 text-yellow-700",
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tableau de bord</h1>
                <p className="text-slate-500 text-sm mt-1">Vue d&apos;ensemble de votre activité</p>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((s) => (
                    <div key={s.label} className={`bg-white rounded-2xl border ${s.border} p-5 shadow-sm hover:shadow-md transition-shadow`}>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-sm font-medium text-slate-500">{s.label}</span>
                            <div className={`p-2.5 rounded-xl ${s.bg}`}>
                                <s.icon className={`h-5 w-5 ${s.color}`} />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-slate-900">{s.value}</div>
                        <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <AdminDashboardCharts revenueData={revenueChart} statusData={statusChart} />

            {/* Dernières commandes */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="font-bold text-slate-800">Dernières commandes</h2>
                    <a href="/admin/orders" className="text-xs text-[#2d6a4f] font-semibold hover:underline">Voir tout →</a>
                </div>
                <div className="divide-y divide-slate-100">
                    {recentOrders.length === 0 ? (
                        <p className="px-6 py-8 text-center text-slate-400 text-sm">Aucune commande.</p>
                    ) : (
                        recentOrders.map((order) => (
                            <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                <div>
                                    <p className="text-sm font-semibold text-slate-900">{order.user.name ?? order.user.email}</p>
                                    <p className="text-xs text-slate-400">
                                        {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })} · {order.paymentMethod}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${STATUS_COLORS[order.status] ?? "bg-slate-100 text-slate-600"}`}>
                                        {order.status}
                                    </span>
                                    <p className="text-sm font-bold text-slate-800 min-w-[70px] text-right">{order.totalAmount} MAD</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

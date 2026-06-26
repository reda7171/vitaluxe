"use client";

import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell, Legend, ResponsiveContainer,
} from "recharts";

const PIE_COLORS = ["#2d6a4f", "#103178", "#f59e0b", "#ef4444", "#8b5cf6"];

interface Props {
    revenueData: { month: string; total: number }[];
    statusData: { name: string; value: number }[];
    categoryData: { name: string; value: number }[];
}

export function AdminDashboardCharts({ revenueData, statusData, categoryData }: Props) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenus mensuels */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-1">Revenus mensuels</h3>
                    <p className="text-xs text-slate-400 mb-4">Commandes livrées — 6 derniers mois</p>
                    {revenueData.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Pas encore de données</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#103178" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#103178" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} axisLine={false} tickLine={false} tickFormatter={v => `${v} MAD`} />
                                <Tooltip
                                    contentStyle={{ borderRadius: "12px", border: "1px solid #e2e8f0", boxShadow: "0 4px 16px rgba(0,0,0,0.08)" }}
                                    formatter={(v: any) => [`${v} MAD`, "Revenus"]}
                                />
                                <Area type="monotone" dataKey="total" stroke="#103178" strokeWidth={2.5} fill="url(#colorRevenue)" dot={{ r: 4, fill: "#103178" }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Statuts commandes */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                    <h3 className="font-bold text-slate-800 mb-1">Statuts commandes</h3>
                    <p className="text-xs text-slate-400 mb-4">Répartition globale</p>
                    {statusData.length === 0 ? (
                        <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Aucune commande</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={220}>
                            <PieChart>
                                <Pie data={statusData} cx="50%" cy="45%" innerRadius={50} outerRadius={80}
                                    dataKey="value" paddingAngle={3} strokeWidth={0}>
                                    {statusData.map((_, i) => (
                                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(v: any, name: any) => [v, name]} contentStyle={{ borderRadius: "8px" }} />
                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* Sales by Category Row */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-bold text-slate-800 mb-1">Ventes par catégorie</h3>
                <p className="text-xs text-slate-400 mb-6">Répartition du chiffre d'affaires (MAD)</p>
                {categoryData.length === 0 ? (
                    <div className="h-48 flex items-center justify-center text-slate-400 text-sm">Pas encore de ventes</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center gap-8">
                        <div className="lg:col-span-1">
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        dataKey="value"
                                        paddingAngle={5}
                                        strokeWidth={0}
                                    >
                                        {categoryData.map((_, i) => (
                                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={(v: any) => [`${v} MAD`, "Ventes"]}
                                        contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                            {categoryData.slice(0, 6).map((item, i) => (
                                <div key={item.name} className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 bg-slate-50/50">
                                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">{item.name}</p>
                                        <p className="text-sm font-black text-slate-900">{item.value} MAD</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

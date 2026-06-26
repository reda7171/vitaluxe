"use client";

import { useState, useEffect } from "react";
import { Users, Search, ShoppingBag, Calendar, Mail, ChevronRight, X, ExternalLink, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface CustomerOrder {
    id: string;
    totalAmount: number;
    status: string;
    createdAt: string;
}

interface Customer {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    createdAt: string;
    orderCount: number;
    totalSpent: number;
    orders: CustomerOrder[];
}

export default function AdminUsersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    useEffect(() => {
        fetch("/api/admin/users")
            .then(res => res.json())
            .then(data => {
                setCustomers(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const filtered = customers.filter(c =>
    (c.name?.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()))
    );

    const STATUS_MAP: Record<string, { label: string, color: string }> = {
        PENDING: { label: "En attente", color: "bg-amber-100 text-amber-700" },
        PROCESSING: { label: "Traitement", color: "bg-blue-100 text-blue-700" },
        SHIPPED: { label: "Expédiée", color: "bg-purple-100 text-purple-700" },
        DELIVERED: { label: "Livrée", color: "bg-emerald-100 text-emerald-700" },
        CANCELLED: { label: "Annulée", color: "bg-rose-100 text-rose-700" },
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Clients</h1>
                    <p className="text-slate-500 text-sm font-medium italic">Gérez votre base de données clients et suivez leur activité</p>
                </div>
                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Rechercher un client..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all text-sm bg-white shadow-sm"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-48 bg-white rounded-2xl border border-slate-100 animate-pulse shadow-sm"></div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto mt-10 shadow-sm">
                    <Users className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-slate-500 font-medium">Aucun client trouvé pour cette recherche.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filtered.map((customer) => (
                        <motion.button
                            layoutId={customer.id}
                            key={customer.id}
                            onClick={() => setSelectedCustomer(customer)}
                            className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-primary/20 transition-all text-left flex flex-col group shadow-sm overflow-hidden relative"
                        >
                            <div className="flex items-center gap-4 mb-5">
                                 <div className="h-12 w-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                                    <img 
                                        src={customer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer.name || "C")}&background=random&color=fff`} 
                                        alt={customer.name || "Client"} 
                                        className="w-full h-full object-cover"
                                        referrerPolicy="no-referrer"
                                    />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="font-bold text-slate-900 truncate group-hover:text-primary transition-colors">{customer.name || "Client"}</h3>
                                    <p className="text-xs text-slate-500 flex items-center gap-1"><Mail size={12} /> {customer.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-slate-50">
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total dépensé</p>
                                    <p className="text-base font-black text-slate-900">{customer.totalSpent} MAD</p>
                                </div>
                                <div className="space-y-0.5">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Commandes</p>
                                    <p className="text-base font-black text-slate-900">{customer.orderCount} <span className="text-[10px] font-medium text-slate-400 ml-1">achats</span></p>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                                <span className="flex items-center gap-1"><Calendar size={12} /> Inscrit le {new Date(customer.createdAt).toLocaleDateString()}</span>
                                <ChevronRight size={16} className="text-slate-300 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </motion.button>
                    ))}
                </div>
            )}

            {/* Side Sheet Customer Detail */}
            <AnimatePresence>
                {selectedCustomer && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedCustomer(null)}
                            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[110] shadow-2xl flex flex-col"
                        >
                            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                                <h2 className="font-black text-slate-900 uppercase tracking-wider text-sm">Détail du client</h2>
                                <button onClick={() => setSelectedCustomer(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="overflow-y-auto flex-1 p-6 space-y-8">
                                <div className="flex flex-col items-center text-center">
                                     <div className="h-24 w-24 rounded-3xl bg-slate-50 border border-slate-100 shadow-xl flex items-center justify-center mb-4 overflow-hidden">
                                        <img 
                                            src={selectedCustomer.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedCustomer.name || "C")}&background=random&color=fff&size=256`} 
                                            alt={selectedCustomer.name || "Client"} 
                                            className="w-full h-full object-cover"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">{selectedCustomer.name || "Client anonyme"}</h3>
                                    <p className="text-slate-500 font-medium">{selectedCustomer.email}</p>
                                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-slate-200">
                                        ID: {selectedCustomer.id.slice(0, 8)}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Dépenses totales</p>
                                        <p className="text-xl font-black text-slate-900">{selectedCustomer.totalSpent} MAD</p>
                                    </div>
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Commandes</p>
                                        <p className="text-xl font-black text-slate-900">{selectedCustomer.orderCount}</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="font-black text-slate-900 uppercase tracking-widest text-xs flex items-center gap-2">
                                        <ShoppingBag size={14} className="text-primary" /> Historique des commandes
                                    </h4>
                                    <div className="space-y-3">
                                        {selectedCustomer.orders.length === 0 ? (
                                            <p className="text-sm text-slate-400 italic">Aucune commande pour le moment.</p>
                                        ) : (
                                            selectedCustomer.orders.map((order) => {
                                                const status = STATUS_MAP[order.status] || { label: order.status, color: "bg-slate-100" };
                                                return (
                                                    <div key={order.id} className="p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-slate-50/50 transition-all group">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <span className="text-xs font-black font-mono text-slate-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                                                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${status.color}`}>
                                                                {status.label}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center justify-between">
                                                            <p className="text-xs text-slate-400 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                            <p className="font-black text-slate-900">{order.totalAmount} MAD</p>
                                                        </div>
                                                        <Link
                                                            href={`/admin/orders/${order.id}`}
                                                            className="mt-3 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white border border-slate-200 text-[10px] font-black uppercase text-slate-600 hover:text-primary hover:border-primary transition-all shadow-sm"
                                                        >
                                                            Détails <ExternalLink size={10} />
                                                        </Link>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                                <p className="text-[11px] text-slate-400 font-medium text-center italic">
                                    Client enregistré depuis le {new Date(selectedCustomer.createdAt).toLocaleDateString("fr-FR", { day: 'numeric', month: 'long', year: 'numeric' })}
                                </p>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}


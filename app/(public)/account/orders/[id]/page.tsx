"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { AccountLayout } from "../../../../../components/account/account-layout";
import { Package, Truck, CheckCircle2, Clock, XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type Status = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const TIMELINE: { status: Status; label: string; icon: typeof Package; desc: string }[] = [
    { status: "PENDING", label: "Commande reçue", icon: Clock, desc: "Votre commande a été enregistrée" },
    { status: "PROCESSING", label: "En préparation", icon: Package, desc: "Nous préparons vos produits" },
    { status: "SHIPPED", label: "Expédiée", icon: Truck, desc: "Votre colis est en route" },
    { status: "DELIVERED", label: "Livrée", icon: CheckCircle2, desc: "Commande reçue avec succès" },
];

const ORDER_INDEX: Record<Status, number> = {
    PENDING: 0, PROCESSING: 1, SHIPPED: 2, DELIVERED: 3, CANCELLED: -1,
};

interface Order {
    id: string;
    status: Status;
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
    orderItems: { id: string; quantity: number; price: number; product: { name: string; brand: string; images: unknown } }[];
}

export default function OrderDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/account/orders/${id}`)
            .then(r => r.json())
            .then(data => { setOrder(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, [id]);

    const currentStep = order ? ORDER_INDEX[order.status] : 0;
    const isCancelled = order?.status === "CANCELLED";

    return (
        <AccountLayout>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Link href="/account/orders" className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-600">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Commande #{id?.slice(0, 8).toUpperCase()}</h1>
                        {order && <p className="text-sm text-slate-400">{new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</p>}
                    </div>
                </div>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" />)}
                    </div>
                ) : !order ? (
                    <div className="text-center py-16 text-slate-400">Commande introuvable.</div>
                ) : (
                    <>
                        {/* Timeline */}
                        {!isCancelled ? (
                            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                                <h2 className="font-bold text-slate-800 mb-6">Suivi de commande</h2>
                                <div className="relative">
                                    {/* Progress bar */}
                                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-200">
                                        <motion.div
                                            className="h-full bg-[#2d6a4f]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(currentStep / (TIMELINE.length - 1)) * 100}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                        />
                                    </div>
                                    <div className="relative flex justify-between">
                                        {TIMELINE.map((step, i) => {
                                            const done = i <= currentStep;
                                            const Icon = step.icon;
                                            return (
                                                <div key={step.status} className="flex flex-col items-center gap-2 w-1/4">
                                                    <motion.div
                                                        initial={{ scale: 0.8 }}
                                                        animate={{ scale: done ? 1 : 0.85 }}
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors z-10 ${done ? "bg-[#2d6a4f] border-[#2d6a4f] text-white" : "bg-white border-slate-200 text-slate-300"}`}
                                                    >
                                                        <Icon size={18} />
                                                    </motion.div>
                                                    <div className="text-center">
                                                        <p className={`text-xs font-bold ${done ? "text-[#2d6a4f]" : "text-slate-400"}`}>{step.label}</p>
                                                        <p className="text-[10px] text-slate-400 hidden sm:block">{step.desc}</p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-5 text-red-700">
                                <XCircle size={24} />
                                <div>
                                    <p className="font-bold">Commande annulée</p>
                                    <p className="text-sm">Cette commande a été annulée.</p>
                                </div>
                            </div>
                        )}

                        {/* Produits */}
                        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="font-bold text-slate-800">Articles commandés</h2>
                            </div>
                            <div className="divide-y divide-slate-100">
                                {order.orderItems.map(item => {
                                    const imgs = Array.isArray(item.product.images) ? item.product.images as string[]
                                        : typeof item.product.images === "string" ? (() => { try { return JSON.parse(item.product.images as string) as string[]; } catch { return []; } })() : [];
                                    return (
                                        <div key={item.id} className="flex items-center gap-4 p-5">
                                            <div className="w-14 h-14 rounded-xl border bg-slate-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                {imgs[0] ? <img loading="lazy" src={imgs[0]} alt={item.product.name} className="w-full h-full object-cover" /> : <span className="text-2xl">💊</span>}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-[#103178]">{item.product.brand}</p>
                                                <p className="text-sm font-semibold text-slate-900">{item.product.name}</p>
                                                <p className="text-xs text-slate-400">Qté : {item.quantity}</p>
                                            </div>
                                            <p className="font-bold text-slate-800">{item.price} MAD</p>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="px-5 py-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex items-center justify-between">
                                <span className="text-sm text-slate-500">Mode de paiement : <strong>{order.paymentMethod}</strong></span>
                                <span className="text-lg font-black text-slate-900">{order.totalAmount} MAD</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AccountLayout>
    );
}

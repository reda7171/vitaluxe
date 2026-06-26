"use client";

import { useEffect, useState, use } from "react";
import { 
    Package, Truck, CheckCircle2, Clock, XCircle, ArrowLeft, 
    User, Mail, Phone, MapPin, CreditCard, Calendar, RefreshCw, 
    Printer, ExternalLink, ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { toast } from "sonner";

type Status = "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const STATUS_CONFIG: Record<Status, { label: string; icon: any; color: string; bg: string }> = {
    PENDING: { label: "En attente", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
    PROCESSING: { label: "En préparation", icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    SHIPPED: { label: "Expédiée", icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
    DELIVERED: { label: "Livrée", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    CANCELLED: { label: "Annulée", icon: XCircle, color: "text-rose-600", bg: "bg-rose-50" },
};

interface Order {
    id: string;
    status: Status;
    totalAmount: number;
    paymentMethod: string;
    createdAt: string;
    user: { 
        name: string; 
        email: string; 
        phone?: string;
        image?: string | null;
        addresses?: { street: string; city: string; zip: string | null; isDefault: boolean }[];
    };
    orderItems: { 
        id: string; 
        quantity: number; 
        price: number; 
        product: { name: string; brand: string; images: string } 
    }[];
}

export default function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);

    const loadOrder = () => {
        setLoading(true);
        fetch(`/api/orders/${id}`)
            .then(r => r.json())
            .then(data => { setOrder(data); setLoading(false); })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        loadOrder();
    }, [id]);

    const updateStatus = async (newStatus: Status) => {
        setIsUpdating(true);
        const toastId = toast.loading("Mise à jour du statut...");
        try {
            const res = await fetch(`/api/orders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                toast.success("Statut mis à jour", { id: toastId });
                loadOrder();
            } else {
                toast.error("Erreur lors de la mise à jour", { id: toastId });
            }
        } catch (e) {
            toast.error("Erreur réseau", { id: toastId });
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <RefreshCw className="h-8 w-8 text-primary animate-spin" />
                <p className="text-slate-500 font-medium">Chargement de la commande...</p>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200">
                <XCircle className="h-12 w-12 text-rose-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-slate-900">Commande introuvable</h2>
                <p className="text-slate-500 mt-2 mb-6">L'ID spécifié ne correspond à aucune commande existante.</p>
                <Link href="/admin/orders" className="text-primary font-bold flex items-center justify-center gap-2 hover:underline">
                    <ArrowLeft size={16} /> Retour à la liste
                </Link>
            </div>
        );
    }

    const status = STATUS_CONFIG[order.status];

    return (
        <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Actions bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-all shadow-sm">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Commande #{order.id.slice(-8).toUpperCase()}</h1>
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${status.bg} ${status.color} border-current/20`}>
                                {status.label}
                            </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium mt-1">Passée le {new Date(order.createdAt).toLocaleString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => window.print()} className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 text-sm font-bold hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                        <Printer size={16} /> Imprimer
                    </button>
                    <select 
                        value={order.status}
                        onChange={(e) => updateStatus(e.target.value as Status)}
                        disabled={isUpdating}
                        className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-lg shadow-slate-200 cursor-pointer outline-none hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                        {Object.entries(STATUS_CONFIG).map(([val, cfg]) => (
                            <option key={val} value={val} className="text-slate-900 bg-white">{cfg.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Products List */}
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="font-black text-slate-900 flex items-center gap-2">
                                <Package className="h-5 w-5 text-primary" /> Articles
                            </h2>
                            <span className="text-xs font-bold text-slate-400">{order.orderItems.length} article(s)</span>
                        </div>
                        <div className="divide-y divide-slate-100">
                            {order.orderItems.map((item) => {
                                let image = "/placeholder.jpg";
                                try {
                                    if (item.product.images) {
                                        let current = item.product.images;
                                        // On désérialise tant que c'est une chaîne JSON
                                        for (let i = 0; i < 3; i++) {
                                            if (typeof current !== "string") break;
                                            try {
                                                const next = JSON.parse(current);
                                                current = next;
                                            } catch { break; }
                                        }
                                        const first = Array.isArray(current) ? current[0] : current;
                                        if (typeof first === "string" && first.length > 5) {
                                            image = first;
                                        }
                                    }
                                } catch (e) {
                                    console.error("Image error:", e);
                                }

                                return (
                                    <div key={item.id} className="p-6 flex items-center gap-6 group hover:bg-slate-50/50 transition-colors">
                                        <div className="h-20 w-20 rounded-2xl border border-slate-100 bg-slate-50 flex items-center justify-center overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                                            <img src={image} alt={item.product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest">{item.product.brand}</p>
                                            <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors truncate">{item.product.name}</h3>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">Prix unitaire: {item.price} MAD · Quantité: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-slate-900">{(item.price * item.quantity).toFixed(0)} MAD</p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="bg-slate-50 p-8 flex flex-col items-end gap-2 border-t border-slate-100">
                            <div className="flex justify-between w-full max-w-xs text-sm">
                                <span className="text-slate-500 font-medium">Sous-total :</span>
                                <span className="text-slate-900 font-bold">{order.totalAmount} MAD</span>
                            </div>
                            <div className="flex justify-between w-full max-w-xs text-sm">
                                <span className="text-slate-500 font-medium">Livraison :</span>
                                <span className="text-emerald-600 font-bold">Gratuit</span>
                            </div>
                            <div className="flex justify-between w-full max-w-xs pt-4 border-t border-slate-200 mt-2">
                                <span className="text-lg font-black text-slate-900">Total :</span>
                                <span className="text-2xl font-black text-primary">{order.totalAmount} MAD</span>
                            </div>
                        </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <h2 className="font-black text-slate-900 mb-8 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-primary" /> État de la commande
                        </h2>
                        <div className="relative pl-8 border-l-2 border-slate-100 space-y-10">
                            {[
                                { status: "PENDING", date: order.createdAt, label: "Commande enregistrée", desc: "La commande a été réceptionnée par le système." },
                                { status: "PROCESSING", date: order.status === "PROCESSING" ? new Date().toISOString() : null, label: "En cours de préparation", desc: "Les produits sont en cours de vérification et d'emballage." },
                                { status: "SHIPPED", date: order.status === "SHIPPED" ? new Date().toISOString() : null, label: "Expédiée", desc: "Le colis a été remis au transporteur." },
                                { status: "DELIVERED", date: order.status === "DELIVERED" ? new Date().toISOString() : null, label: "Livraison effectuée", desc: "La commande a été remise au client." }
                            ].map((step, i) => {
                                const isDone = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].indexOf(order.status) >= ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED"].indexOf(step.status as Status);
                                const StepIcon = STATUS_CONFIG[step.status as Status].icon;
                                return (
                                    <div key={i} className="relative">
                                        <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full border-4 border-white shadow-sm transition-colors ${isDone ? "bg-primary" : "bg-slate-200"}`} />
                                        <div>
                                            <p className={`text-sm font-black ${isDone ? "text-slate-900" : "text-slate-400"}`}>{step.label}</p>
                                            <p className="text-xs text-slate-500 mt-1 max-w-md leading-relaxed">{step.desc}</p>
                                            {isDone && step.date && (
                                                <p className="text-[10px] font-bold text-primary/60 mt-2 uppercase tracking-tighter">Confirmé le {new Date(step.date).toLocaleDateString()}</p>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Client Info */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <h2 className="font-black text-slate-900 mb-6 flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" /> Informations Client
                        </h2>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-16 w-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden shrink-0">
                                <img 
                                    src={order.user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(order.user.name)}&background=random&color=fff`} 
                                    alt={order.user.name} 
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="min-w-0">
                                <p className="font-black text-slate-900 truncate">{order.user.name}</p>
                                <p className="text-xs text-slate-500 font-medium truncate">{order.user.email}</p>
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-50 text-[10px] font-bold text-blue-600 border border-blue-100 mt-2">
                                    <ShieldCheck size={10} /> Client régulier
                                </span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-sm">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600 font-medium truncate">{order.user.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-sm">
                                <Phone className="h-4 w-4 text-slate-400" />
                                <span className="text-slate-600 font-medium">{order.user.phone || "Non renseigné"}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment & Shipping */}
                    <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                        <div className="space-y-8">
                            <div>
                                <h3 className="font-black text-slate-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                                    <CreditCard className="h-4 w-4 text-primary" /> Paiement
                                </h3>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    <p className="text-sm font-bold text-slate-900">{order.paymentMethod === "COD" ? "Paiement à la livraison" : order.paymentMethod}</p>
                                    <p className="text-xs text-slate-500 mt-1">Montant total: {order.totalAmount} MAD</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-black text-slate-900 flex items-center gap-2 mb-4 text-sm uppercase tracking-wider">
                                    <MapPin className="h-4 w-4 text-primary" /> Livraison
                                </h3>
                                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                                    {order.user.addresses && order.user.addresses.length > 0 ? (
                                        (() => {
                                            const addr = order.user.addresses.find(a => a.isDefault) || order.user.addresses[0];
                                            return (
                                                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                                                    {addr.street}<br />
                                                    {addr.city}, {addr.zip || ""}<br />
                                                    Maroc
                                                </p>
                                            );
                                        })()
                                    ) : (
                                        <p className="text-sm text-slate-400 italic">Adresse non renseignée</p>
                                    )}
                                    {order.user.addresses && order.user.addresses.length > 0 && (
                                        <button className="mt-4 text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline">
                                            Voir sur Google Maps <ExternalLink size={10} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

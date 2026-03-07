"use client";

import { useEffect, useState, useCallback } from "react";
import { FileText, Loader2, Eye, Trash2, CheckCircle2, Clock, Phone, User } from "lucide-react";
import { toast } from "sonner";

interface Prescription {
    id: string;
    name: string;
    phone: string;
    note: string | null;
    image: string;
    status: string;
    createdAt: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
    PENDING: { label: "En attente", color: "text-amber-700", bg: "bg-amber-50 border-amber-200", icon: Clock },
    CONTACTED: { label: "Contacté", color: "text-blue-700", bg: "bg-blue-50 border-blue-200", icon: Phone },
    COMPLETED: { label: "Traité", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200", icon: CheckCircle2 },
};

export default function AdminPrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);
    const [preview, setPreview] = useState<Prescription | null>(null);

    const load = useCallback(() => {
        setLoading(true);
        fetch("/api/admin/prescriptions")
            .then(r => r.json())
            .then(data => { setPrescriptions(Array.isArray(data) ? data : []); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => { load(); }, [load]);

    const updateStatus = async (id: string, status: string) => {
        const res = await fetch(`/api/admin/prescriptions/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        });
        if (res.ok) { toast.success("Statut mis à jour"); load(); }
        else toast.error("Erreur lors de la mise à jour");
    };

    const remove = async (id: string) => {
        if (!confirm("Supprimer cette ordonnance ?")) return;
        const res = await fetch(`/api/admin/prescriptions/${id}`, { method: "DELETE" });
        if (res.ok) { toast.success("Ordonnance supprimée"); load(); }
        else toast.error("Erreur lors de la suppression");
    };

    const counts = {
        PENDING: prescriptions.filter(p => p.status === "PENDING").length,
        CONTACTED: prescriptions.filter(p => p.status === "CONTACTED").length,
        COMPLETED: prescriptions.filter(p => p.status === "COMPLETED").length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Ordonnances</h1>
                    <p className="text-sm text-slate-500 mt-1">{prescriptions.length} ordonnance{prescriptions.length !== 1 ? "s" : ""} reçue{prescriptions.length !== 1 ? "s" : ""}</p>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {Object.entries(counts).map(([key, count]) => {
                    const cfg = STATUS_CONFIG[key];
                    const Icon = cfg.icon;
                    return (
                        <div key={key} className={`rounded-2xl border px-5 py-4 flex items-center gap-3 ${cfg.bg}`}>
                            <Icon className={`h-5 w-5 ${cfg.color}`} />
                            <div>
                                <p className={`text-2xl font-extrabold ${cfg.color}`}>{count}</p>
                                <p className="text-xs text-slate-500">{cfg.label}</p>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                            <th className="px-5 py-3">Patient</th>
                            <th className="px-5 py-3">Téléphone</th>
                            <th className="px-5 py-3">Date</th>
                            <th className="px-5 py-3">Statut</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="py-16 text-center text-slate-400">
                                <Loader2 className="animate-spin h-5 w-5 mx-auto" />
                            </td></tr>
                        ) : prescriptions.length === 0 ? (
                            <tr><td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                                <FileText className="h-10 w-10 mx-auto mb-2 opacity-30" />
                                Aucune ordonnance reçue.
                            </td></tr>
                        ) : prescriptions.map(p => {
                            const cfg = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.PENDING;
                            const StatusIcon = cfg.icon;
                            const date = new Date(p.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
                            return (
                                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-[#103178]/10 flex items-center justify-center">
                                                <User className="h-4 w-4 text-[#103178]" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm text-slate-900">{p.name}</p>
                                                {p.note && <p className="text-xs text-slate-400 line-clamp-1">{p.note}</p>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-sm text-slate-700 font-mono">{p.phone}</td>
                                    <td className="px-5 py-3 text-sm text-slate-500">{date}</td>
                                    <td className="px-5 py-3">
                                        <select
                                            value={p.status}
                                            onChange={e => updateStatus(p.id, e.target.value)}
                                            className={`text-xs font-semibold px-2 py-1 rounded-full border outline-none cursor-pointer ${cfg.bg} ${cfg.color}`}
                                        >
                                            <option value="PENDING">En attente</option>
                                            <option value="CONTACTED">Contacté</option>
                                            <option value="COMPLETED">Traité</option>
                                        </select>
                                    </td>
                                    <td className="px-5 py-3">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => setPreview(p)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-[#103178] hover:bg-blue-50 transition-colors"
                                                title="Voir l'ordonnance"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => remove(p.id)}
                                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Modal aperçu ordonnance */}
            {preview && (
                <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
                    <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden" onClick={e => e.stopPropagation()}>
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg">{preview.name}</h3>
                                <p className="text-sm text-slate-500">{preview.phone}</p>
                            </div>
                            <button onClick={() => setPreview(null)} className="text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</button>
                        </div>
                        <div className="p-6 space-y-4">
                            {preview.note && (
                                <div className="bg-slate-50 rounded-xl p-3 text-sm text-slate-700">
                                    <span className="font-semibold text-xs text-slate-400 uppercase">Note : </span>{preview.note}
                                </div>
                            )}
                            <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 flex items-center justify-center">
                                {preview.image.startsWith("data:image") ? (
                                    <img src={preview.image} alt="Ordonnance" className="max-h-96 object-contain w-full" />
                                ) : (
                                    <div className="py-8 text-slate-400 text-sm text-center">
                                        <FileText className="h-10 w-10 mx-auto mb-2" />
                                        Fichier PDF — non prévisualisable
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

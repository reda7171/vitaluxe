"use client"

import { useState, useEffect } from "react";
import { Mail, Calendar, Loader2 } from "lucide-react";

export default function NewsletterAdminPage() {
    const [leads, setLeads] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchLeads() {
            try {
                const res = await fetch("/api/admin/newsletter");
                if (!res.ok) throw new Error("Erreur lors de la récupération des abonnés");
                const data = await res.json();
                setLeads(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchLeads();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-slate-500 animate-pulse font-medium">Récupération de la liste des abonnés...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-rose-50 text-rose-600 rounded-2xl border border-rose-100 max-w-2xl mx-auto">
                <p className="font-bold">Une erreur est survenue</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Newsletter</h1>
                    <p className="text-slate-500 text-sm mt-1">Gérez vos abonnés Newsletter ({leads.length} inscrits)</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
                    <span className="text-sm font-semibold flex-1">Email Abonné</span>
                    <span className="text-sm font-semibold w-32 text-center">Statut</span>
                    <span className="text-sm font-semibold w-40 text-right">Date d'inscription</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {leads.length === 0 ? (
                        <p className="p-8 text-center text-slate-500 font-medium">Aucun abonné pour le moment.</p>
                    ) : (
                        leads.map((lead: any) => (
                            <div key={lead.id} className="p-4 flex gap-4 items-center hover:bg-slate-50 transition-colors group">
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-xl bg-primary/5 flex items-center justify-center shrink-0 group-hover:bg-primary/10 transition-colors">
                                        <Mail className="h-4 w-4 text-primary" />
                                    </div>
                                    <p className="font-bold text-sm text-slate-900">{lead.email}</p>
                                </div>
                                <div className="w-32 flex justify-center">
                                    <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full border ${lead.isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-rose-50 text-rose-700 border-rose-100'}`}>
                                        {lead.isActive ? 'Actif' : 'Désinscrit'}
                                    </span>
                                </div>
                                <div className="w-40 text-right text-xs text-slate-400 flex items-center justify-end gap-1.5 font-medium">
                                    <Calendar className="h-3.5 w-3.5" />
                                    {new Date(lead.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

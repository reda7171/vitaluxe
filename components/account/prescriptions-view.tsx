"use client";

import { useEffect, useState } from "react";
import { Loader2, FileText, BadgeInfo, CheckCircle2, AlertCircle } from "lucide-react";

interface Prescription {
    id: string;
    name: string;
    note: string | null;
    status: string;
    createdAt: string;
}

export function PrescriptionsView() {
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/account/prescriptions")
            .then(res => res.json())
            .then(data => {
                setPrescriptions(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getStatusInfo = (status: string) => {
        switch (status) {
            case "PENDING":
                return { label: "En cours d'étude", color: "text-amber-600 bg-amber-50 border-amber-200", icon: BadgeInfo };
            case "ACCEPTED":
                return { label: "Validée", color: "text-emerald-600 bg-emerald-50 border-emerald-200", icon: CheckCircle2 };
            case "REJECTED":
                return { label: "Refusée", color: "text-rose-600 bg-rose-50 border-rose-200", icon: AlertCircle };
            default:
                return { label: status, color: "text-slate-600 bg-slate-50 border-slate-200", icon: BadgeInfo };
        }
    };

    if (loading) {
        return (
            <div className="bg-card rounded-2xl border min-h-[400px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (prescriptions.length === 0) {
        return (
            <div className="bg-card rounded-2xl border min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                    <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Aucune ordonnance</h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                    Vous n'avez pas encore envoyé d'ordonnance.
                </p>
                <a href="/ordonnance" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Envoyer une ordonnance
                </a>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl border overflow-hidden">
            <div className="p-6 border-b">
                <h2 className="text-lg font-bold">Mes Ordonnances</h2>
            </div>
            <div className="divide-y">
                {prescriptions.map((p) => {
                    const status = getStatusInfo(p.status);
                    const Icon = status.icon;
                    return (
                        <div key={p.id} className="p-6 hover:bg-slate-50 transition-colors">
                            <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                                <div>
                                    <h3 className="font-semibold">{p.name}</h3>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Envoyée le {new Date(p.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                                    </p>
                                    {p.note && (
                                        <p className="text-sm mt-3 text-slate-600 bg-slate-50 p-3 rounded-xl border italic">"{p.note}"</p>
                                    )}
                                </div>
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold w-fit ${status.color}`}>
                                    <Icon className="h-3.5 w-3.5" />
                                    {status.label}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

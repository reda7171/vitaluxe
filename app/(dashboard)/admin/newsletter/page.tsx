import prisma from "@/lib/prisma";
import { Mail, Calendar } from "lucide-react";

export default async function NewsletterAdminPage() {
    const leads = await prisma.newsletterLead.findMany({
        orderBy: { createdAt: "desc" }
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Newsletter</h1>
                    <p className="text-slate-500 text-sm mt-1">Gérez vos abonnés Newsletter ({leads.length} inscrits)</p>
                </div>
                {/* 
                    L'export CSV d'ici demanderait une logique côté client ou API Route, 
                    mais on peut l'intégrer avec un simple bouton télécharger.
                */}
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
                    <span className="text-sm font-semibold flex-1">Email Abonné</span>
                    <span className="text-sm font-semibold w-32 text-center">Statut</span>
                    <span className="text-sm font-semibold w-40 text-right">Date d'inscription</span>
                </div>
                <div className="divide-y divide-slate-100">
                    {leads.length === 0 ? (
                        <p className="p-8 text-center text-slate-500">Aucun abonné pour le moment.</p>
                    ) : (
                        leads.map((lead: any) => (
                            <div key={lead.id} className="p-4 flex gap-4 items-center hover:bg-slate-50 transition-colors">
                                <div className="flex-1 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <Mail className="h-4 w-4 text-primary" />
                                    </div>
                                    <p className="font-semibold text-sm text-slate-900">{lead.email}</p>
                                </div>
                                <div className="w-32 flex justify-center">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${lead.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {lead.isActive ? 'Actif' : 'Désinscrit'}
                                    </span>
                                </div>
                                <div className="w-40 text-right text-xs text-slate-500 flex items-center justify-end gap-1.5">
                                    <Calendar className="h-3 w-3" />
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

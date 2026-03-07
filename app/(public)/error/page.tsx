import Link from "next/link";
import { Home, ArrowLeft, ShieldAlert, AlertTriangle, CloudOff, Search } from "lucide-react";

export default async function ErrorPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
    const code = (await searchParams).code || "500";

    const ERRORS: Record<string, { title: string, desc: string, icon: any, color: string }> = {
        "400": {
            title: "Requête invalide",
            desc: "La syntaxe de la requête est erronée ou impossible à satisfaire.",
            icon: AlertTriangle,
            color: "text-amber-500 bg-amber-50"
        },
        "401": {
            title: "Non autorisé",
            desc: "Vous devez vous connecter pour accéder à cette ressource. Vos identifiants sont manquants ou invalides.",
            icon: ShieldAlert,
            color: "text-rose-500 bg-rose-50"
        },
        "402": {
            title: "Paiement requis",
            desc: "L'accès à cette ressource nécessite un paiement valide.",
            icon: AlertTriangle,
            color: "text-orange-500 bg-orange-50"
        },
        "403": {
            title: "Accès interdit",
            desc: "Vous n'avez pas les droits nécessaires pour afficher cette page. Votre compte n'est peut-être pas autorisé.",
            icon: ShieldAlert,
            color: "text-red-600 bg-red-50"
        },
        "404": {
            title: "Page introuvable",
            desc: "La page que vous recherchez n'existe pas ou a été déplacée.",
            icon: Search,
            color: "text-blue-500 bg-blue-50"
        },
        "500": {
            title: "Erreur serveur",
            desc: "Le serveur a rencontré une condition inattendue. Veuillez réessayer plus tard.",
            icon: CloudOff,
            color: "text-slate-500 bg-slate-100"
        }
    };

    const errorDetails = ERRORS[code] || ERRORS["500"];
    const Icon = errorDetails.icon;

    return (
        <div className="min-h-[80vh] bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-16 text-center">

                {/* Error Graphic */}
                <div className="relative mb-8">
                    <h1 className="text-[8rem] md:text-[12rem] font-black text-slate-100 leading-none select-none tracking-tighter">
                        {code}
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`p-5 rounded-full shadow-xl border-4 border-white ${errorDetails.color}`}>
                            <Icon size={48} />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                    {errorDetails.title}
                </h2>
                <p className="text-slate-500 mb-10 text-lg max-w-md mx-auto leading-relaxed">
                    {errorDetails.desc}
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link
                        href="/"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-[#103178] text-white font-bold rounded-xl hover:bg-[#1a4fa0] transition-colors shadow-lg shadow-[#103178]/20"
                    >
                        <Home size={18} />
                        Retour à l'accueil
                    </Link>
                    <Link
                        href="/auth/login"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                        Se connecter
                    </Link>
                </div>
            </div>
        </div>
    );
}

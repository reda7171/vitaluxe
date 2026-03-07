import type { ReactNode } from "react";
import Link from "next/link";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left: Decorative Panel */}
            <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-primary p-12">
                {/* Background gradient orbs */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
                    <div className="absolute top-1/2 -right-24 w-80 h-80 rounded-full bg-white/5 blur-2xl" />
                    <div className="absolute -bottom-24 left-1/4 w-72 h-72 rounded-full bg-white/10 blur-3xl" />
                </div>

                {/* Logo */}
                <div className="relative z-10">
                    <Link href="/" className="inline-block">
                        <span className="text-3xl font-extrabold text-white tracking-tight">Vitaluxe</span>
                    </Link>
                    <p className="text-white/60 text-sm mt-1">Parapharmacie en ligne</p>
                </div>

                {/* Central illustration & message */}
                <div className="relative z-10 space-y-8">
                    {/* Decorative product cards */}
                    <div className="relative h-56">
                        <div className="absolute left-0 bottom-0 w-40 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl rotate-[-6deg] hover:rotate-[-3deg] transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=400&auto=format&fit=crop"
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute left-24 top-0 w-40 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl rotate-[4deg] hover:rotate-[2deg] transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=400&auto=format&fit=crop"
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute right-0 bottom-4 w-40 h-48 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                            <img
                                src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=400&auto=format&fit=crop"
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-extrabold text-white leading-tight">
                            Votre beauté, <br />notre passion.
                        </h2>
                        <p className="text-white/70 leading-relaxed">
                            Des milliers de produits de parapharmacie authentiques, livrés dans 48h partout au Maroc.
                        </p>
                    </div>

                    {/* Trust stats */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            { num: "50k+", label: "Clients satisfaits" },
                            { num: "2000+", label: "Produits" },
                            { num: "48h", label: "Livraison" },
                        ].map(({ num, label }) => (
                            <div key={label} className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm border border-white/20">
                                <p className="text-xl font-extrabold text-white">{num}</p>
                                <p className="text-xs text-white/60 mt-0.5">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer text */}
                <p className="relative z-10 text-white/40 text-xs">
                    © {new Date().getFullYear()} Vitaluxe. Tous droits réservés.
                </p>
            </div>

            {/* Right: Auth Content */}
            <div className="flex items-center justify-center px-6 py-12 bg-muted/20">
                {children}
            </div>
        </div>
    );
}

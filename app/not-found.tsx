"use client";

import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="max-w-2xl w-full bg-white rounded-[2rem] shadow-xl border border-slate-100 p-8 md:p-16 text-center">
                {/* 404 Graphic */}
                <div className="relative mb-8">
                    <h1 className="text-[8rem] md:text-[12rem] font-black text-slate-100 leading-none select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-[#103178] text-white p-4 rounded-full shadow-lg">
                            <Search size={48} />
                        </div>
                    </div>
                </div>

                {/* Text Content */}
                <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                    Oups ! Page introuvable
                </h2>
                <p className="text-slate-500 mb-10 text-lg max-w-md mx-auto leading-relaxed">
                    Il semblerait que vous vous soyez perdu. La page que vous recherchez n'existe pas ou a été déplacée.
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
                        href="/shop"
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 bg-white text-slate-700 font-bold rounded-xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors"
                    >
                        <ArrowLeft size={18} />
                        Vers la boutique
                    </Link>
                </div>

                {/* Helpful Links */}
                <div className="mt-12 pt-8 border-t border-slate-100">
                    <p className="text-sm font-semibold text-slate-400 mb-4 uppercase tracking-widest">
                        Liens utiles
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm font-semibold">
                        <Link href="/shop" className="text-[#103178] hover:underline">Boutique</Link>
                        <Link href="/categories" className="text-[#103178] hover:underline">Catégories</Link>
                        <Link href="/blog" className="text-[#103178] hover:underline">Blog Santé</Link>
                        <Link href="/contact" className="text-[#103178] hover:underline">Nous contacter</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

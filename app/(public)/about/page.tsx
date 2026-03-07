import type { Metadata } from "next";
import Image from "next/image";
import { Leaf, Microscope, ShieldCheck, Rocket } from "lucide-react";

export const metadata: Metadata = {
    title: "À propos de nous | Vitaluxe",
    description: "Découvrez l'histoire, les valeurs et la mission de Vitaluxe, votre destination parapharmacie de confiance au Maroc.",
};

const stats = [
    { value: "10 000+", label: "Produits référencés" },
    { value: "50 000+", label: "Clients satisfaits" },
    { value: "5 ans", label: "D'expertise" },
    { value: "100%", label: "Produits authentiques" },
];

const values = [
    {
        icon: Leaf,
        title: "Naturalité",
        description: "Nous sélectionnons des produits formulés avec des ingrédients naturels, respectueux de votre corps et de l'environnement.",
    },
    {
        icon: Microscope,
        title: "Expertise",
        description: "Chaque produit est validé par notre équipe de pharmaciens et experts en dermocosmétique.",
    },
    {
        icon: ShieldCheck,
        title: "Authenticité",
        description: "Nous garantissons l'authenticité de 100% de nos produits, directement sourcés auprès des marques et laboratoires.",
    },
    {
        icon: Rocket,
        title: "Innovation",
        description: "Nous restons à la pointe des dernières avancées en matière de soins, de santé et de bien-être.",
    },
];

const team = [
    { name: "Salma Bennani", role: "Co-fondatrice & Pharmacienne", initial: "S" },
    { name: "Karim El Idrissi", role: "Co-fondateur & CEO", initial: "K" },
    { name: "Nadia Chaoui", role: "Responsable Qualité", initial: "N" },
];

export default function AboutPage() {
    return (
        <main className="bg-white text-slate-800">

            {/* HERO */}
            <section className="relative bg-gradient-to-br from-[#103178] to-[#1a4db8] py-28 px-6 text-center text-white overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_#ffffff,_transparent_60%)]" />
                <div className="relative max-w-3xl mx-auto">
                    <span className="inline-block bg-white/20 text-white text-xs font-semibold px-4 py-1 rounded-full mb-4 tracking-widest uppercase">
                        Notre histoire
                    </span>
                    <h1 className="text-5xl font-extrabold leading-tight mb-6">
                        La parapharmacie<br />réinventée pour vous
                    </h1>
                    <p className="text-lg text-blue-100 max-w-xl mx-auto">
                        Vitaluxe est née d&apos;une conviction simple : chaque Marocain mérite d&apos;accéder facilement à des produits de santé et de beauté authentiques, efficaces et abordables.
                    </p>
                </div>
            </section>

            {/* STATS */}
            <section className="bg-[#103178] py-14 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
                    {stats.map((stat) => (
                        <div key={stat.label}>
                            <div className="text-4xl font-extrabold">{stat.value}</div>
                            <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* MISSION */}
            <section className="py-24 px-6 max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                <div>
                    <span className="text-[#103178] font-semibold text-sm uppercase tracking-widest">Notre mission</span>
                    <h2 className="text-4xl font-bold mt-3 mb-6 leading-snug">
                        Santé, beauté & bien-être<br />à portée de clic
                    </h2>
                    <p className="text-slate-600 leading-relaxed mb-4">
                        Fondée en 2020, Vitaluxe est la première destination parapharmacie en ligne au Maroc.
                        Nous réunissons les meilleures marques internationales et locales pour vous offrir une
                        expérience d&apos;achat simple, sécurisée et fiable.
                    </p>
                    <p className="text-slate-600 leading-relaxed">
                        Notre équipe de professionnels de santé sélectionne rigoureusement chaque produit afin
                        de vous garantir qualité, efficacité et traçabilité.
                    </p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-3xl h-80 flex items-center justify-center">
                    <div className="text-8xl">💊</div>
                </div>
            </section>

            {/* VALEURS */}
            <section className="bg-slate-50 py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-[#103178] font-semibold text-sm uppercase tracking-widest">Ce qui nous définit</span>
                        <h2 className="text-4xl font-bold mt-3">Nos valeurs fondamentales</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((v) => (
                            <div key={v.title} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <v.icon className="h-10 w-10 text-[#103178] mb-4" />
                                <h3 className="text-lg font-bold mb-2 text-slate-900">{v.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ÉQUIPE */}
            <section className="py-24 px-6 max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <span className="text-[#103178] font-semibold text-sm uppercase tracking-widest">Les visages derrière Vitaluxe</span>
                    <h2 className="text-4xl font-bold mt-3">Notre équipe</h2>
                </div>
                <div className="flex flex-wrap justify-center gap-10">
                    {team.map((member) => (
                        <div key={member.name} className="text-center group">
                            <div className="w-28 h-28 rounded-full bg-gradient-to-br from-[#103178] to-[#1a4db8] flex items-center justify-center text-white text-4xl font-bold mx-auto mb-4 group-hover:scale-105 transition-transform">
                                {member.initial}
                            </div>
                            <div className="font-semibold text-slate-900">{member.name}</div>
                            <div className="text-slate-500 text-sm">{member.role}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="bg-gradient-to-br from-[#103178] to-[#1a4db8] text-white py-20 px-6 text-center">
                <h2 className="text-4xl font-bold mb-4">Prêt à prendre soin de vous ?</h2>
                <p className="text-blue-200 mb-8 text-lg">Découvrez notre catalogue de plus de 10 000 produits sélectionnés par nos experts.</p>
                <a
                    href="/shop"
                    className="inline-block bg-white text-[#103178] font-bold px-8 py-4 rounded-full hover:bg-blue-50 transition-colors text-lg"
                >
                    Visiter la boutique
                </a>
            </section>

        </main>
    );
}

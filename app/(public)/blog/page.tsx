import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, BookOpen, Clock, Tag, Search, Sparkles } from "lucide-react";

export const metadata: Metadata = {
    title: "Blog Santé & Beauté | Vitaluxe",
    description: "Conseils santé, beauté et bien-être par les experts Vitaluxe. Guides produits, routines de soins, actualités parapharmacie.",
};

const CATEGORIES = ["Toutes", "Soins Visage", "Soins Corps", "Santé", "Solaires", "Cheveux", "Bébé"];

const POSTS = [
    {
        slug: "soins-visage-routine-quotidienne",
        title: "La routine visage idéale selon votre type de peau",
        excerpt: "Découvrez comment adapter votre routine de soins quotidienne à votre type de peau pour des résultats visibles en 4 semaines. Nos dermatologues vous guident pas à pas.",
        category: "Soins Visage",
        date: "28 Fév 2026",
        readTime: "5 min",
        image: "/blog/visage-routine.png",
    },
    {
        slug: "complements-alimentaires-guide",
        title: "Compléments alimentaires : lesquels choisir en 2026 ?",
        excerpt: "Notre pharmacien vous guide à travers les compléments essentiels : vitamines, minéraux, oméga-3. Ce qu'il faut vraiment prendre pour booster votre immunité.",
        category: "Santé",
        date: "20 Fév 2026",
        readTime: "7 min",
        image: "/blog/complements-guide.png",
    },
    {
        slug: "protection-solaire-maroc",
        title: "Protection solaire au Maroc : nos recommandations",
        excerpt: "Avec un ensoleillement exceptionnel, le Maroc exige une protection solaire adaptée. Nos experts sélectionnent les meilleurs écrans solaires SPF 50+.",
        category: "Solaires",
        date: "15 Fév 2026",
        readTime: "4 min",
        image: "/blog/protection-solaire.png",
    },
    {
        slug: "chute-cheveux-solutions",
        title: "Chute de cheveux : causes et solutions efficaces",
        excerpt: "Stress, carences, déréglements hormonaux... On démêle les causes de la chute de cheveux et les traitements qui fonctionnent vraiment en parapharmacie.",
        category: "Cheveux",
        date: "10 Fév 2026",
        readTime: "6 min",
        image: "/blog/chute-cheveux.png",
    },
    {
        slug: "hydrater-peau-seche-hiver",
        title: "Peau sèche en hiver : le guide de l'hydratation",
        excerpt: "Les meilleures crèmes hydratantes, sérums et huiles pour réparer et nourrir la peau sèche et tiraillée pendant les mois les plus froids.",
        category: "Soins Corps",
        date: "5 Fév 2026",
        readTime: "5 min",
        image: "/blog/hydratation-hiver.png",
    },
    {
        slug: "bebe-soins-naturels",
        title: "Soins naturels pour bébé : de la naissance à 2 ans",
        excerpt: "Quels produits utiliser en toute sécurité pour la peau fragile de votre bébé ? Notre pharmacienne vous guide sur les soins doux, bio et naturels.",
        category: "Bébé",
        date: "1 Fév 2026",
        readTime: "8 min",
        image: "/blog/bebe-soins.png",
    },
];

export default function BlogPage() {
    const featured = POSTS[0];
    const rest = POSTS.slice(1);

    return (
        <main className="min-h-screen bg-slate-50/50 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-b from-[#103178] to-[#1a4fa0] py-24 px-6">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative max-w-4xl mx-auto text-center text-white z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm font-semibold mb-6 backdrop-blur-sm">
                        <Sparkles size={16} className="text-yellow-300" /> Le Magazine Vitaluxe
                    </div>
                    <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
                        Expertise & <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-200">Bien-être</span>
                    </h1>
                    <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto font-medium leading-relaxed">
                        Retrouvez chaque semaine les conseils de nos pharmaciens et experts beauté pour prendre soin de vous au naturel.
                    </p>

                    {/* Search Bar - Visual only for aesthetic in this static page */}
                    <div className="max-w-md mx-auto mt-10 relative">
                        <Search className="absolute left-4 top-3.5 text-slate-400" size={18} />
                        <input type="text" placeholder="Rechercher un article..." className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-slate-800 shadow-xl focus:outline-none focus:ring-4 focus:ring-white/20 transition-all" />
                    </div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
                {/* Category Navigation */}
                <div className="flex items-center justify-start bg-white/90 backdrop-blur-md rounded-full shadow-md border border-slate-200/60 p-2 mx-auto max-w-fit overflow-x-auto hide-scrollbar mb-16">
                    {CATEGORIES.map((cat, i) => (
                        <button key={cat} className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${i === 0 ? 'bg-[#103178] text-white shadow-md shadow-[#103178]/20' : 'text-slate-600 hover:text-[#103178] hover:bg-slate-100'}`}>
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Featured Article */}
                <div className="mb-16">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#103178] mb-4 block ml-2">À la une</span>
                    <Link href={`/blog/${featured.slug}`} className="group relative flex flex-col lg:flex-row bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-2xl hover:border-blue-100 transition-all duration-500">
                        <div className="relative lg:w-[55%] h-72 lg:h-auto overflow-hidden">
                            <Image src={featured.image} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
                        </div>
                        <div className="lg:w-[45%] p-8 lg:p-12 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">{featured.category}</span>
                                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400"><Clock size={14} /> {featured.readTime}</span>
                            </div>
                            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 leading-tight group-hover:text-[#103178] transition-colors">
                                {featured.title}
                            </h2>
                            <p className="text-slate-600 leading-relaxed mb-8 text-lg">
                                {featured.excerpt}
                            </p>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#103178]/10 flex items-center justify-center text-[#103178] font-bold text-sm">VX</div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">Dr. Sarah B.</p>
                                        <p className="text-xs text-slate-500">{featured.date}</p>
                                    </div>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#103178] group-hover:text-white transition-colors text-slate-400">
                                    <ArrowRight size={18} />
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Article Grid */}
                <div className="mb-8">
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-6 block ml-2">Dernières publications</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rest.map(post => (
                            <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-100 overflow-hidden transition-all duration-500 hover:-translate-y-2">
                                <div className="relative h-64 w-full overflow-hidden">
                                    <Image src={post.image} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md text-[#103178] text-[10px] font-extrabold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                                        {post.category}
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-4 text-xs font-medium text-slate-400 mb-3">
                                        <span className="flex items-center gap-1.5"><Calendar size={14} /> {post.date}</span>
                                        <span className="flex items-center gap-1.5"><Clock size={14} /> {post.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-[#103178] transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                    <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed mb-6 flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                                        <span className="text-sm font-bold text-[#103178]">Lire la suite</span>
                                        <ArrowRight size={16} className="text-slate-300 group-hover:text-[#103178] transition-colors group-hover:translate-x-1" />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Newsletter Box */}
                <div className="mt-24 mb-10 bg-gradient-to-br from-[#103178] to-[#1e4b9c] rounded-[2.5rem] p-10 md:p-16 text-center text-white relative overflow-hidden shadow-2xl shadow-[#103178]/20">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl"></div>
                    <div className="relative z-10 max-w-2xl mx-auto">
                        <BookOpen className="w-12 h-12 text-blue-200 mx-auto mb-6 opacity-80" />
                        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">Ne manquez aucun conseil</h2>
                        <p className="text-blue-100 mb-10 text-lg">Inscrivez-vous à notre newsletter pour recevoir notre sélection de produits et conseils santé directement dans votre boîte mail.</p>
                        <form className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto bg-white/10 p-2 rounded-2xl backdrop-blur-md border border-white/20">
                            <input type="email" placeholder="Votre adresse email" className="flex-1 px-5 py-3.5 rounded-xl bg-white text-slate-900 outline-none focus:ring-4 focus:ring-white/40 placeholder:text-slate-400 font-medium" />
                            <button type="button" className="px-8 py-3.5 bg-emerald-400 hover:bg-emerald-300 text-[#103178] font-extrabold rounded-xl transition-colors shadow-lg">
                                S'abonner
                            </button>
                        </form>
                        <p className="text-xs text-blue-300/60 mt-4">Nous protégeons vos données. Désinscription à tout moment.</p>
                    </div>
                </div>

            </div>
        </main>
    );
}

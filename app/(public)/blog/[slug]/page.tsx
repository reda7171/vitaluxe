import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";

// Mock des articles (Idéalement stockés en base de données ou CMS)
const BLOG_POSTS: Record<string, any> = {
    "soins-visage-routine-quotidienne": {
        title: "La routine visage idéale selon votre type de peau : Le guide complet",
        category: "Soins Visage",
        date: "28 Fév 2026",
        readTime: "5 min",
        author: {
            name: "Dr. Sarah Benali",
            role: "Dermatologue",
            avatar: "https://ui-avatars.com/api/?name=Sarah+Benali&background=103178&color=fff"
        },
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=1200&auto=format&fit=crop",
        excerpt: "Découvrez comment adapter votre routine de soins quotidienne à votre type de peau pour des résultats visibles en 4 semaines. Nos dermatologues vous guident pas à pas.",
        content: `
            <h2>1. Pourquoi chaque type de peau nécessite une routine spécifique ?</h2>
            <p>On ne le répétera jamais assez : il n'existe pas de produit miracle universel. Ce qui fonctionne pour votre meilleure amie pourrait provoquer des éruptions cutanées chez vous. La première étape d'une peau éclatante est <strong>l'identification correcte de votre type de peau</strong> : normale, sèche, grasse, mixte, ou sensible.</p>
            
            <p>Une bonne routine se compose généralement de trois étapes fondamentales :</p>
            <ul>
                <li><strong>Le nettoyage</strong> : Pour retirer les impuretés, le sébum et les restes de maquillage.</li>
                <li><strong>L'hydratation</strong> : Pour restaurer la barrière cutanée.</li>
                <li><strong>La protection (SPF)</strong> : Indispensable, même par temps nuageux !</li>
            </ul>

            <img src="https://images.unsplash.com/photo-1615397323293-875b2258832c?q=80&w=800&auto=format&fit=crop" alt="Produits de soins alignés" />

            <h2>2. La routine pour les peaux grasses et à tendance acnéique</h2>
            <p>Contrôler l'excès de sébum sans agresser la peau est la clé. L'erreur la plus courante est de vouloir "décaper" la peau, ce qui entraîne une surproduction de sébum en réaction.</p>
            
            <h3>Le matin :</h3>
            <p>Optez pour un nettoyant doux à base d'acide salicylique (BHA) qui va nettoyer les pores en profondeur. Ensuite, appliquez un sérum à la niacinamide (vitamine B3) pour réguler le sébum et apaiser les rougeurs. Terminez par un fluide hydratant matifiant et une protection solaire très légère et non comédogène.</p>
            
            <blockquote>
                "Les peaux grasses ont aussi besoin d'être hydratées. Zapper la crème hydratante est la pire des idées !" - Dr. Sarah B.
            </blockquote>

            <h2>3. La routine pour les peaux sèches et déshydratées</h2>
            <p>L'objectif ici est de retenir l'eau dans les tissus et de réparer le film hydrolipidique de la surface de la peau.</p>
            <p>Préférez les huiles ou baumes démaquillants qui n'assèchent pas. Un sérum à l'acide hyaluronique, appliqué sur peau légèrement humide, fera des miracles. Scellez ensuite cette hydratation avec une crème riche contenant des céramides, du squalane ou du beurre de karité.</p>

            <h2>En conclusion</h2>
            <p>Soyez cohérent et patient. Il faut en moyenne <strong>28 jours</strong> (le cycle de renouvellement cellulaire) pour commencer à voir les véritables effets d'une nouvelle routine de soins. Pensez également à adapter vos produits en fonction des saisons (des textures plus légères en été, plus riches en hiver).</p>
        `
    },
    "complements-alimentaires-guide": {
        title: "Compléments alimentaires : lesquels choisir en 2026 ?",
        category: "Santé",
        date: "20 Fév 2026",
        readTime: "7 min",
        author: {
            name: "Dr. Amine Tazi",
            role: "Pharmacien",
            avatar: "https://ui-avatars.com/api/?name=Amine+Tazi&background=103178&color=fff"
        },
        image: "https://images.unsplash.com/photo-1550572017-edb799be0d36?q=80&w=800&auto=format&fit=crop",
        excerpt: "Notre pharmacien vous guide à travers les compléments essentiels : vitamines, minéraux, oméga-3. Ce qu'il faut vraiment prendre pour booster votre immunité.",
        content: `
            <h2>L'importance d'une supplémentation ciblée</h2>
            <p>Même avec une alimentation équilibrée, il est parfois difficile d'obtenir tous les nutriments dont notre corps a besoin, surtout face au stress quotidien et à la baisse de qualité nutritionnelle de certains aliments modernes.</p>

            <h2>Les 3 indispensables en 2026</h2>
            <ol>
                <li><strong>La Vitamine D3 :</strong> Essentielle pour l'immunité et la santé osseuse.</li>
                <li><strong>Le Magnésium :</strong> Le minéral anti-stress par excellence, particulièrement sous forme bisglycinate.</li>
                <li><strong>Les Oméga-3 :</strong> Cruciaux pour la santé cardiovasculaire et cérébrale.</li>
            </ol>
            
            <p>Consultez toujours un professionnel de santé avant de démarrer une cure prolongée.</p>
        `
    },
    "protection-solaire-maroc": {
        title: "Protection solaire au Maroc : nos recommandations",
        category: "Solaires",
        date: "15 Fév 2026",
        readTime: "4 min",
        author: {
            name: "Dr. Sarah Benali",
            role: "Dermatologue",
            avatar: "https://ui-avatars.com/api/?name=Sarah+Benali&background=103178&color=fff"
        },
        image: "https://images.unsplash.com/photo-1526413232644-8a40f41ce931?q=80&w=800&auto=format&fit=crop",
        excerpt: "Avec un ensoleillement exceptionnel, le Maroc exige une protection solaire adaptée. Nos experts sélectionnent les meilleurs écrans solaires SPF 50+.",
        content: `
             <h2>Le soleil marocain : ami et ennemi de votre peau</h2>
            <p>Le Maroc bénéficie de plus de 300 jours de soleil par an. Si c'est excellent pour le moral et la synthèse de vitamine D, les rayons UV sont la cause numéro 1 du vieillissement cutané prématuré et des taches brunes.</p>

            <h2>Comment bien choisir son écran ?</h2>
            <ul>
                <li><strong>Pour la ville :</strong> Un fluide ultra-léger SPF 50+ invisible (ex: Anthelios de La Roche-Posay ou ISDIN Fusion Water).</li>
                <li><strong>Pour la plage ou le sport :</strong> Une formule très résistante à l'eau et à la transpiration.</li>
            </ul>

            <blockquote>"L'écran solaire est le meilleur anti-rides qui existe sur le marché."</blockquote>
        `
    },
    "chute-cheveux-solutions": {
        title: "Chute de cheveux : causes et solutions efficaces",
        category: "Cheveux",
        date: "10 Fév 2026",
        readTime: "6 min",
        author: {
            name: "Dr. Amine Tazi",
            role: "Pharmacien",
            avatar: "https://ui-avatars.com/api/?name=Amine+Tazi&background=103178&color=fff"
        },
        image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
        excerpt: "Stress, carences, déréglements hormonaux... On démêle les causes de la chute de cheveux et les traitements qui fonctionnent vraiment en parapharmacie.",
        content: `
            <h2>Chute réactionnelle vs Chute chronique</h2>
            <p>Il est normal de perdre entre 50 et 100 cheveux par jour. Au-delà, on parle d'alopécie. La première étape est de distinguer une chute passagère (stress, post-partum, fatigue) d'une chute chronique (hormonale, génétique).</p>

            <h2>Les solutions en parapharmacie</h2>
            <ul>
                <li><strong>Les compléments (Vitamines B, Zinc, Biotine) :</strong> Très efficaces sur les chutes réactionnelles pour relancer la pousse.</li>
                <li><strong>Les lotions anti-chute (Aminexil, Minoxidil sur conseil) :</strong> Permettent d'ancrer le cheveu dans le bulbe.</li>
                <li><strong>Les shampooings fortifiants :</strong> Ils préparent le cuir chevelu, mais ne stoppent pas la chute à eux seuls.</li>
            </ul>
        `
    },
    "hydrater-peau-seche-hiver": {
        title: "Peau sèche en hiver : le guide de l'hydratation",
        category: "Soins Corps",
        date: "5 Fév 2026",
        readTime: "5 min",
        author: {
            name: "Dr. Sarah Benali",
            role: "Dermatologue",
            avatar: "https://ui-avatars.com/api/?name=Sarah+Benali&background=103178&color=fff"
        },
        image: "https://images.unsplash.com/photo-1615397323293-875b2258832c?q=80&w=800&auto=format&fit=crop",
        excerpt: "Les meilleures crèmes hydratantes, sérums et huiles pour réparer et nourrir la peau sèche et tiraillée pendant les mois les plus froids.",
        content: `
             <h2>Pourquoi notre peau tiraille-t-elle en hiver ?</h2>
            <p>Le froid, le vent et surtout le chauffage en intérieur assèchent l'air, ce qui provoque une évaporation de l'eau contenue dans notre peau (la Perte Insensible en Eau).</p>

            <h2>Le plan d'action anti-sécheresse</h2>
            <p>Passez à un nettoyant surgras (huile de douche) et ne prenez pas de douches trop chaudes. En sortant, séchez votre peau en tapotant et appliquez tout de suite un baume relipidant riche en céramides et beurre de karité pour créer un film protecteur.</p>
        `
    },
    "bebe-soins-naturels": {
        title: "Soins naturels pour bébé : de la naissance à 2 ans",
        category: "Bébé",
        date: "1 Fév 2026",
        readTime: "8 min",
        author: {
            name: "Dr. Amine Tazi",
            role: "Pharmacien",
            avatar: "https://ui-avatars.com/api/?name=Amine+Tazi&background=103178&color=fff"
        },
        image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop",
        excerpt: "Quels produits utiliser en toute sécurité pour la peau fragile de votre bébé ? Notre pharmacienne vous guide sur les soins doux, bio et naturels.",
        content: `
            <h2>Moins c'est mieux</h2>
            <p>La peau d'un nourrisson est cinq fois plus fine que celle d'un adulte. Elle absorbe plus facilement les substances chimiques. L'objectif numéro un est donc d'utiliser le minimum de produits possibles.</p>

            <h2>La trousse de toilette idéale</h2>
            <ul>
                <li><strong>Un gel lavant doux sans savon :</strong> À utiliser pour le corps et les cheveux.</li>
                <li><strong>Du liniment oléo-calcaire :</strong> Pour le change, composé d'huile d'olive et d'eau de chaux, il protège des rougeurs.</li>
                <li><strong>Une crème hydratante basique ou de l'huile d'amande douce vierge :</strong> Pour le massage après le bain.</li>
            </ul>
        `
    }
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const post = BLOG_POSTS[slug];

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white">
            {/* Navbar / Back Link */}
            <div className="border-b border-slate-100 bg-white">
                <div className="max-w-4xl mx-auto px-6 py-4">
                    <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#103178] transition-colors">
                        <ArrowLeft size={16} /> Retour au magazine
                    </Link>
                </div>
            </div>

            <article className="max-w-4xl mx-auto px-6 py-12 lg:py-16">

                {/* Header */}
                <header className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">{post.category}</span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight mb-8">
                        {post.title}
                    </h1>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500">
                        <div className="flex items-center gap-3">
                            <img src={post.author.avatar} alt={post.author.name} className="w-10 h-10 rounded-full border border-slate-200" />
                            <div className="text-left">
                                <p className="font-bold text-slate-900">{post.author.name}</p>
                                <p className="text-xs">{post.author.role}</p>
                            </div>
                        </div>
                        <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1.5"><Calendar size={15} /> {post.date}</span>
                            <span className="flex items-center gap-1.5"><Clock size={15} /> {post.readTime}</span>
                        </div>
                    </div>
                </header>

                {/* Cover Image */}
                <div className="w-full h-64 md:h-[450px] rounded-[2rem] overflow-hidden mb-16 shadow-lg border border-slate-100">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                </div>

                {/* Content & Sidebar */}
                <div className="flex flex-col lg:flex-row gap-12 relative">

                    {/* Share Sidebar (Sticky) */}
                    <div className="lg:w-16 order-2 lg:order-1 flex lg:flex-col gap-4 mt-8 lg:mt-0 lg:sticky lg:top-32 lg:h-max">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 lg:mb-2 flex items-center gap-1">
                            <Share2 size={12} /> Partager
                        </span>
                        <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-600 hover:bg-white transition-colors">
                            <Facebook size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-sky-500 hover:border-sky-500 hover:bg-white transition-colors">
                            <Twitter size={18} />
                        </button>
                        <button className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-blue-700 hover:border-blue-700 hover:bg-white transition-colors">
                            <Linkedin size={18} />
                        </button>
                    </div>

                    {/* Article Body */}
                    <div className="lg:flex-1 order-1 lg:order-2 prose prose-lg prose-slate prose-headings:font-extrabold prose-headings:text-slate-900 prose-a:text-[#103178] prose-img:rounded-3xl prose-img:shadow-md prose-blockquote:border-l-[#103178] prose-blockquote:bg-slate-50 prose-blockquote:p-6 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic prose-blockquote:font-semibold max-w-none pb-20 border-b border-slate-100"
                        dangerouslySetInnerHTML={{ __html: post.content }}>
                    </div>
                </div>

                {/* Call to Action Shop */}
                <div className="mt-16 bg-gradient-to-br from-[#103178]/5 to-[#1a4fa0]/10 rounded-[2rem] p-8 md:p-12 text-center border border-[#103178]/10">
                    <h3 className="text-2xl font-extrabold text-[#103178] mb-4">Prêt(e) à commencer votre nouvelle routine ?</h3>
                    <p className="text-slate-600 mb-8 max-w-md mx-auto">
                        Retrouvez tous les produits recommandés par nos experts dans la boutique Vitaluxe.
                    </p>
                    <Link href="/shop" className="inline-flex items-center justify-center px-8 py-3.5 bg-[#103178] hover:bg-[#1a4fa0] text-white font-bold rounded-xl transition-colors shadow-lg shadow-[#103178]/20">
                        Visiter la boutique
                    </Link>
                </div>

            </article>
        </main>
    );
}

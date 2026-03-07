export type Review = {
    id: number;
    author: string;
    avatar: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
};

export type Product = {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    salePrice?: number;
    rating: number;
    reviews: number;
    image: string;
    images?: string[];
    badge?: "Nouveau" | "Promo" | "Best-seller";
    inStock: boolean;
    tags: string[];
    description?: string;
    benefits?: string[];
    ingredients?: string;
    howToUse?: string;
    reviewList?: Review[];
};

export const CATEGORIES = ["Visage", "Corps", "Cheveux", "Compléments", "Solaire", "Bébé"];
export const BRANDS = ["La Roche-Posay", "Vichy", "CeraVe", "Eucerin", "Avène", "Bioderma", "Nuxe"];

export const ALL_PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Sérum Hydratant Intense Acide Hyaluronique",
        brand: "La Roche-Posay",
        category: "Visage",
        price: 350,
        salePrice: 299,
        rating: 4.8,
        reviews: 120,
        image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
        ],
        badge: "Nouveau",
        inStock: true,
        tags: ["hydratation", "anti-âge"],
        description:
            "Une formule révolutionnaire ultra-concentrée en acide hyaluronique pur (1,5%) et en eau thermale Vichy. Ce sérum repulpe intensément la peau, lisse les rides et booste l'hydratation dès la première application. Testé dermatologiquement, idéal pour les peaux sensibles.",
        benefits: [
            "Repulpe et lisse les rides en 10 jours",
            "Boost d'hydratation de +78% (étude clinique)",
            "Texture ultra-légère, absorption immédiate",
            "Non comédogène & testé dermatologiquement",
            "Convient aux peaux sensibles et réactives",
        ],
        ingredients:
            "Aqua, Sodium Hyaluronate (1.5%), Glycerin, Niacinamide, Panthenol, Tocopheryl Acetate, Carbomer, Sodium Hydroxide, Disodium EDTA, Phenoxyethanol, Ethylhexylglycerin.",
        howToUse:
            "Appliquer matin et soir sur une peau propre et sèche. Déposer 2 à 3 gouttes sur le visage et le cou. Masser délicatement jusqu'à absorption complète. Suivre d'une crème hydratante.",
        reviewList: [
            {
                id: 1,
                author: "Fatima Z.",
                avatar: "https://i.pravatar.cc/60?img=1",
                rating: 5,
                date: "15 Fév 2026",
                comment: "Incroyable ! Ma peau est tellement plus hydratée dès la première semaine. Je ne peux plus m'en passer.",
                verified: true,
            },
            {
                id: 2,
                author: "Meryem A.",
                avatar: "https://i.pravatar.cc/60?img=5",
                rating: 5,
                date: "02 Jan 2026",
                comment: "Texture légère, absorption rapide. Mes rides de déshydratation ont vraiment diminué. Je recommande vivement !",
                verified: true,
            },
            {
                id: 3,
                author: "Sara B.",
                avatar: "https://i.pravatar.cc/60?img=9",
                rating: 4,
                date: "20 Déc 2025",
                comment: "Très bon sérum, surtout pour les peaux sensibles comme la mienne. Petit bémol sur le prix, mais la qualité est là.",
                verified: false,
            },
        ],
    },
    {
        id: 2,
        name: "Crème de Jour Anti-Âge Collagène",
        brand: "Vichy",
        category: "Visage",
        price: 450,
        rating: 4.9,
        reviews: 89,
        image: "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1629198725800-410d10b7405e?q=80&w=800&auto=format&fit=crop",
        ],
        badge: "Best-seller",
        inStock: true,
        tags: ["anti-âge", "hydratation"],
        description: "Crème de jour enrichie en collagène natif et eau thermale de Vichy. Raffermit, hydrate et réduit visiblement les rides.",
        benefits: ["Raffermit la peau en 4 semaines", "Texture riche et fondante", "Protection SPF 15 intégrée"],
        ingredients: "Aqua, Glycerin, Collagen, Niacinamide, Hyaluronic Acid, Shea Butter, Vitamin C.",
        howToUse: "Appliquer le matin sur visage et cou en massant délicatement. Éviter le contour des yeux.",
    },
    {
        id: 3,
        name: "Baume Hydratant Peaux Sèches",
        brand: "CeraVe",
        category: "Corps",
        price: 180,
        rating: 4.7,
        reviews: 234,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?q=80&w=800&auto=format&fit=crop",
        ],
        inStock: true,
        tags: ["hydratation", "peaux sèches"],
        description: "Baume ultra-riche formulé avec 3 céramides essentiels et acide hyaluronique. Restaure la barrière cutanée et apporte une hydratation longue durée.",
        benefits: ["Hydratation 24h", "Restaure la barrière cutanée", "Formule non parfumée"],
        ingredients: "Aqua, Glycerin, Ceramide NP, Ceramide AP, Ceramide EOP, Hyaluronic Acid.",
        howToUse: "Appliquer sur corps et mains sèches, matin et soir ou selon les besoins.",
    },
    {
        id: 4,
        name: "Écran Solaire Toucher Sec SPF 50+",
        brand: "Eucerin",
        category: "Solaire",
        price: 210,
        rating: 4.6,
        reviews: 156,
        image: "https://images.unsplash.com/photo-1556228720-1c2a4624dc1c?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1556228720-1c2a4624dc1c?q=80&w=800&auto=format&fit=crop",
        ],
        badge: "Promo",
        inStock: true,
        tags: ["solaire", "spf50"],
        description: "Protection solaire SPF50+ à texture sèche et légère. Non grasse, idéale pour usage quotidien, même sous le maquillage.",
        benefits: ["Protection UVA/UVB maximale", "Toucher sec, non gras", "Convient peaux mixtes à grasses"],
        ingredients: "Aqua, Ethylhexyl Methoxycinnamate, Zinc Oxide, Titanium Dioxide.",
        howToUse: "Appliquer généreusement 20 minutes avant l'exposition au soleil. Renouveler toutes les 2h.",
    },
    {
        id: 5,
        name: "Huile Prodigieuse Florale Multi-Fonctions",
        brand: "Nuxe",
        category: "Corps",
        price: 320,
        salePrice: 280,
        rating: 4.9,
        reviews: 312,
        image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
        images: [
            "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
        ],
        badge: "Best-seller",
        inStock: true,
        tags: ["corps", "nutrition"],
        description: "L'huile sèche multi-usages emblématique de Nuxe, enrichie en extraits floraux précieux. Visage, corps et cheveux sublimés.",
        benefits: ["Multi-usages : visage, corps, cheveux", "Parfum fleuri délicat", "Pénètre en quelques secondes"],
        ingredients: "Macadamia Oil, Hazelnut Oil, Camellia Oil, Sweet Almond Oil, Vitamin E, Rose Extract.",
        howToUse: "Appliquer quelques gouttes sur la peau ou les cheveux. Masser doucement.",
    },
    {
        id: 6,
        name: "Eau Thermale Spray Hydratant",
        brand: "Avène",
        category: "Visage",
        price: 120,
        rating: 4.5,
        reviews: 98,
        image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop"],
        inStock: true,
        tags: ["hydratation", "sensitive"],
        description: "L'eau thermale d'Avène pure à 100%, directement prélevée à la source. Apaise, adoucit et hydrate instantanément.",
        benefits: ["Apaise immédiatement", "Fixe le maquillage", "Convient peaux sensibles"],
        ingredients: "Avène Thermal Spring Water.",
        howToUse: "Vaporiser à 20 cm du visage. Laisser sécher à l'air libre ou tamponner délicatement.",
    },
    {
        id: 7,
        name: "Shampoing Doux Nutriprotein",
        brand: "Vichy",
        category: "Cheveux",
        price: 155,
        rating: 4.4,
        reviews: 67,
        image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800&auto=format&fit=crop"],
        inStock: true,
        tags: ["cheveux", "nutrition"],
        description: "Shampoing enrichi en protéines de soie et en eau thermale de Vichy. Nourrit et fortifie les cheveux fragilisés en profondeur.",
        benefits: ["Nourrit et fortifie", "Cheveux doux et brillants", "Ph équilibré"],
        ingredients: "Aqua, Sodium Laureth Sulfate, Cocamidopropyl Betaine, Silk Proteins, Thermal Water.",
        howToUse: "Appliquer sur cheveux mouillés, masser le cuir chevelu, rincer abondamment. Répéter si nécessaire.",
    },
    {
        id: 8,
        name: "Micellar Water 3-in-1 Sensitive",
        brand: "Bioderma",
        category: "Visage",
        price: 200,
        salePrice: 170,
        rating: 4.8,
        reviews: 445,
        image: "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?q=80&w=800&auto=format&fit=crop"],
        badge: "Best-seller",
        inStock: true,
        tags: ["nettoyage", "démaquillage"],
        description: "L'eau micellaire iconique de Bioderma tolérée par les dermatologues. Démaquille, nettoie et apaise en une seule étape.",
        benefits: ["Démaquille sans frotter", "Apaise les peaux réactives", "Sans rinçage"],
        ingredients: "Aqua, Cucurbita Pepo Seed Oil, Mannitol, Xylitol, Rhamnose, Fructooligosaccharides.",
        howToUse: "Imbiber un coton et appliquer sur le visage (yeux inclus). Ne pas frotter. Pas besoin de rincer.",
    },
    {
        id: 9,
        name: "Complément Alimentaire Cheveux & Ongles",
        brand: "Vichy",
        category: "Compléments",
        price: 280,
        rating: 4.3,
        reviews: 55,
        image: "https://images.unsplash.com/photo-1550572017-edb799be0d36?q=80&w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1550572017-edb799be0d36?q=80&w=800&auto=format&fit=crop"],
        badge: "Nouveau",
        inStock: true,
        tags: ["cheveux", "compléments"],
        description: "Cure de 3 mois enrichie en biotine, zinc et sélénium pour retrouver des cheveux épais et des ongles solides.",
        benefits: ["Réduit la chute en 4-6 semaines", "Ongles renforcés", "1 gélule par jour"],
        ingredients: "Biotin, Zinc, Selenium, Iron, Vitamin B6, Folic Acid.",
        howToUse: "Prendre 1 gélule par jour au cours d'un repas avec un grand verre d'eau.",
    },
    {
        id: 10,
        name: "Crème Apaisante Peaux Réactives",
        brand: "La Roche-Posay",
        category: "Visage",
        price: 390,
        rating: 4.7,
        reviews: 189,
        image: "https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?q=80&w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1611080626919-7cf5a9dbab12?q=80&w=800&auto=format&fit=crop"],
        inStock: false,
        tags: ["sensitive", "apaisante"],
        description: "Crème apaisante ultra-riche conçue pour les peaux les plus réactives. Atténue les rougeurs et restaure le confort cutané.",
        benefits: ["Apaise les rougeurs", "Hydratation longue durée", "Testé sur peaux atopiques"],
        ingredients: "Aqua, Glycerin, Shea Butter, Niacinamide, Thermal Water.",
        howToUse: "Appliquer matin et/ou soir sur visage propre. Éviter les contours des yeux.",
    },
    {
        id: 11,
        name: "Lotion Tonique Régénérante",
        brand: "Avène",
        category: "Visage",
        price: 160,
        rating: 4.5,
        reviews: 78,
        image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=800&auto=format&fit=crop"],
        inStock: true,
        tags: ["toning", "hydratation"],
        description: "Lotion légère qui sublime la fraîcheur du teint. Sans alcool, enrichie en eau thermale pour recalibrer le pH de la peau.",
        benefits: ["Resserre les pores", "Prépare la peau aux soins", "Sans alcool"],
        ingredients: "Avène Thermal Spring Water, Glycerin, Niacinamide.",
        howToUse: "Appliquer sur coton après nettoyage, matin et soir, avant tout soin.",
    },
    {
        id: 12,
        name: "Gel Douche Surgras Nourrissant",
        brand: "CeraVe",
        category: "Corps",
        price: 135,
        rating: 4.6,
        reviews: 201,
        image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop",
        images: ["https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800&auto=format&fit=crop"],
        badge: "Promo",
        inStock: true,
        tags: ["corps", "douche"],
        description: "Gel douche doux surgras enrichi en céramides, acide hyaluronique et niacinamide. Nettoie sans dessécher et laisse la peau douce.",
        benefits: ["Nettoyage doux et efficace", "Hydratation post-douche", "Convient toute la famille"],
        ingredients: "Aqua, Sodium Lauroyl Isethionate, Ceramide NP, Hyaluronic Acid, Niacinamide.",
        howToUse: "Utiliser une dose sur peau mouillée, masser et rincer. Convient à une utilisation quotidienne.",
    },
];

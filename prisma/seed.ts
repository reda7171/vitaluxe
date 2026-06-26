import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding...')

    // Nettoyage de la base
    await prisma.orderItem.deleteMany()
    await prisma.order.deleteMany()
    await prisma.review.deleteMany()
    await prisma.wishlist.deleteMany()
    await prisma.product.deleteMany()
    await prisma.category.deleteMany()

    // 1. Catégories (Menu Principal)
    const categoriesData = [
        { name: 'Visage', slug: 'visage', image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop' },
        { name: 'Corps', slug: 'corps', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600&auto=format&fit=crop' },
        { name: 'Cheveux', slug: 'cheveux', image: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=600&auto=format&fit=crop' },
        { name: 'Bébé', slug: 'bebe', image: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600&auto=format&fit=crop' },
        { name: 'Homme', slug: 'homme', image: 'https://images.unsplash.com/photo-1626379953822-ba31950e2f15?q=80&w=600&auto=format&fit=crop' },
        { name: 'Hygiène', slug: 'hygiene', image: 'https://images.unsplash.com/photo-1570198031538-4e89bbde7c9e?q=80&w=600&auto=format&fit=crop' },
        { name: 'Solaire', slug: 'solaire', image: 'https://images.unsplash.com/photo-1526413232644-8a40f28722bf?q=80&w=600&auto=format&fit=crop' },
        { name: 'Compléments', slug: 'complements', image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop' },
        { name: 'Épicerie', slug: 'epicerie', image: 'https://images.unsplash.com/photo-1606148303038-038c1b9f66bb?q=80&w=600&auto=format&fit=crop' },
        { name: 'Sport', slug: 'sport', image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=600&auto=format&fit=crop' },
    ]

    const createdCategories: Record<string, string> = {}

    for (const cat of categoriesData) {
        const category = await prisma.category.create({
            data: cat
        })
        createdCategories[cat.slug] = category.id
    }

    // 2. Produits
    const productsData = [
        // VISAGE
        {
            name: 'Sérum Hydratant CeraVe',
            slug: 'serum-hydratant-cerave',
            description: 'Sérum hydratant à l\'acide hyaluronique pour le visage. Restaure la barrière cutanée.',
            price: 180,
            salePrice: 150,
            stock: 50,
            images: ['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=800&auto=format&fit=crop'],
            categoryId: createdCategories['visage'],
            brand: 'CeraVe'
        },
        {
            name: 'Gel Nettoyant Moussant La Roche Posay',
            slug: 'gel-nettoyant-moussant-la-roche-posay',
            description: 'Purifie la peau en douceur et élimine les impuretés et l\'excès de sébum.',
            price: 145,
            stock: 120,
            images: ['https://images.unsplash.com/photo-1629198688000-71f23e745b6e?q=80&w=800&auto=format&fit=crop'],
            categoryId: createdCategories['visage'],
            brand: 'La Roche Posay'
        },

        // CORPS
        {
            name: 'Baume Relipidant Lipikar AP+M',
            slug: 'baume-relipidant-lipikar-ap-m',
            description: 'Soin apaisant, anti-grattage pour les peaux sèches et à tendance à l\'eczéma atopique.',
            price: 260,
            salePrice: 220,
            stock: 35,
            images: ['https://images.unsplash.com/photo-1608248593842-8021c6a8eaec?q=80&w=800&auto=format&fit=crop'],
            categoryId: createdCategories['corps'],
            brand: 'La Roche Posay'
        },

        // CHEVEUX
        {
            name: 'Shampooing Kératine Dercos',
            slug: 'shampooing-keratine-dercos',
            description: 'Répare la fibre capillaire et redonne force et brillance aux cheveux abîmés.',
            price: 160,
            stock: 80,
            images: ['https://images.unsplash.com/photo-1626379616459-b2ce1d8decce?q=80&w=800&auto=format&fit=crop'],
            categoryId: createdCategories['cheveux'],
            brand: 'Vichy'
        },

        // SOLAIRES
        {
            name: 'Anthelios UVMune 400 Invisible Fluid',
            slug: 'anthelios-uvmune-400-invisible-fluid',
            description: 'Protection solaire SPF50+ très haute protection pour les peaux sensibles.',
            price: 210,
            salePrice: 190,
            stock: 200,
            images: ['https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800&auto=format&fit=crop'], // placeholder
            categoryId: createdCategories['solaire'],
            brand: 'La Roche Posay'
        },

        // COMPLEMENTS
        {
            name: 'Magnésium Marin B6',
            slug: 'magnesium-marin-b6',
            description: 'Complément alimentaire pour réduire la fatigue et contribuer au fonctionnement normal du système nerveux.',
            price: 120,
            stock: 300,
            images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=800&auto=format&fit=crop'],
            categoryId: createdCategories['complements'],
            brand: 'Arkopharma'
        },

        // BEBE
        {
            name: 'Gel Lavant Doux Mustela',
            slug: 'gel-lavant-doux-mustela',
            description: 'Nettoie en douceur le corps et le cuir chevelu des nourrissons.',
            price: 115,
            stock: 150,
            images: ['https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop'],
            categoryId: createdCategories['bebe'],
            brand: 'Mustela'
        },

        // SPORT
        {
            name: 'Whey Protein Isolate',
            slug: 'whey-protein-isolate',
            description: 'Protéine de lactosérum de haute qualité pour le développement musculaire.',
            price: 650,
            salePrice: 590,
            stock: 40,
            images: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800&auto=format&fit=crop'],
            categoryId: createdCategories['sport'],
            brand: 'Optimum Nutrition'
        }
    ]

    for (const prod of productsData) {
        await prisma.product.create({
            data: {
                ...prod,
                images: JSON.stringify(prod.images)
            }
        })
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

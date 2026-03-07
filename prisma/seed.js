require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });

async function main() {
    // ─── Users ───────────────────────────────────────────────────────────────
    const adminHash = await bcrypt.hash("admin123", 10);
    const userHash = await bcrypt.hash("user123", 10);

    const admin = await prisma.user.upsert({
        where: { email: "admin@vitaluxe.ma" },
        update: {},
        create: { name: "Admin Vitaluxe", email: "admin@vitaluxe.ma", password: adminHash, role: "ADMIN" },
    });

    const customer = await prisma.user.upsert({
        where: { email: "client@vitaluxe.ma" },
        update: {},
        create: { name: "Sara Benali", email: "client@vitaluxe.ma", password: userHash, phone: "0612345678", role: "CUSTOMER" },
    });

    console.log("✅ Users créés");

    // ─── Categories ───────────────────────────────────────────────────────────
    const catData = [
        { name: "Visage", slug: "visage", image: "https://images.unsplash.com/photo-1615397323608-d2ba9cae5436?q=80&w=600" },
        { name: "Corps", slug: "corps", image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=600" },
        { name: "Cheveux", slug: "cheveux", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=600" },
        { name: "Bébé", slug: "bebe", image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=600" },
        { name: "Homme", slug: "homme", image: "https://images.unsplash.com/photo-1621607512214-68297480165e?q=80&w=600" },
        { name: "Hygiène", slug: "hygiene", image: "https://images.unsplash.com/photo-1584949514120-f13e73a696c1?q=80&w=600" },
        { name: "Solaire", slug: "solaire", image: "https://images.unsplash.com/photo-1574621100236-d25b64dfad96?q=80&w=600" },
        { name: "Compléments", slug: "complements", image: "https://images.unsplash.com/photo-1550572017-edb799be0d36?q=80&w=600" },
        { name: "Épicerie", slug: "epicerie", image: "https://images.unsplash.com/photo-1585238218764-839cc609139a?q=80&w=600" },
        { name: "Sport", slug: "sport", image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600" },
    ];

    const cats = {};
    for (const c of catData) {
        cats[c.name] = await prisma.category.upsert({
            where: { slug: c.slug },
            update: {},
            create: c,
        });
    }

    console.log("✅ Catégories créées");

    // ─── Brands ───────────────────────────────────────────────────────────────
    const brandData = [
        { name: "La Roche-Posay", slug: "la-roche-posay", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/La_Roche-Posay_logo.svg/200px-La_Roche-Posay_logo.svg.png" },
        { name: "Vichy", slug: "vichy", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Vichy_Laboratoires_logo.svg/200px-Vichy_Laboratoires_logo.svg.png" },
        { name: "CeraVe", slug: "cerave", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d7/CeraVe_logo.svg/200px-CeraVe_logo.svg.png" },
        { name: "Eucerin", slug: "eucerin", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Eucerin_logo.svg/200px-Eucerin_logo.svg.png" },
        { name: "Avène", slug: "avene", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Eau_thermale_Av%C3%A8ne_logo.svg/200px-Eau_thermale_Av%C3%A8ne_logo.svg.png" },
    ];

    for (const b of brandData) {
        await prisma.brand.upsert({
            where: { slug: b.slug },
            update: {},
            create: b,
        });
    }

    console.log("✅ Marques créées");

    // ─── Products ─────────────────────────────────────────────────────────────
    const products = [
        // Visage
        { name: "Effaclar Gel Purifiant", slug: "effaclar-gel-purifiant", price: 189, salePrice: 149, stock: 50, categoryId: cats["Visage"].id, brand: "La Roche-Posay", description: "Gel nettoyant visage pour peaux grasses et sensibles." },
        { name: "Crème Hydratante Cerave", slug: "creme-hydratante-cerave", price: 150, salePrice: 130, stock: 30, categoryId: cats["Visage"].id, brand: "CeraVe", description: "Crème hydratante visage et corps à l'acide hyaluronique et céramides." },

        // Corps
        { name: "Baume Lipikar AP+M", slug: "baume-lipikar-ap", price: 290, salePrice: null, stock: 45, categoryId: cats["Corps"].id, brand: "La Roche-Posay", description: "Baume relipidant anti-grattage pour les peaux extrêmement sèches." },

        // Cheveux
        { name: "Shampooing Dercos Anti-Pelliculaire", slug: "dercos-anti-pelliculaire", price: 160, salePrice: 135, stock: 60, categoryId: cats["Cheveux"].id, brand: "Vichy", description: "Élimine 100% des pellicules visibles. Pour cheveux normaux à gras." },
        { name: "Huile Lactée Capillaire", slug: "huile-lactee-capillaire", price: 199, salePrice: 179, stock: 25, categoryId: cats["Cheveux"].id, brand: "Nuxe", description: "Soin protecteur hydratant pour cheveux exposés au soleil." },

        // Bébé
        { name: "Gel Lavant Doux Mustela", slug: "gel-lavant-doux-mustela", price: 120, salePrice: 95, stock: 80, categoryId: cats["Bébé"].id, brand: "Mustela", description: "Nettoie en douceur le corps et le cuir chevelu de l'enfant et du nourrisson." },
        { name: "Crème Change 1 2 3", slug: "creme-change-123", price: 85, salePrice: null, stock: 100, categoryId: cats["Bébé"].id, brand: "Mustela", description: "Prévient, soulage et répare les irritations et rougeurs du siège." },

        // Homme
        { name: "Gel de Rasage Anti-Irritations", slug: "gel-rasage-homme", price: 90, salePrice: 75, stock: 40, categoryId: cats["Homme"].id, brand: "Vichy Homme", description: "Gel à raser peaux sensibles. Prévient les rougeurs et tiraillements." },

        // Hygiène
        { name: "Gel Douche Nutritif", slug: "gel-douche-nutritif", price: 65, salePrice: null, stock: 120, categoryId: cats["Hygiène"].id, brand: "Sanex", description: "Gel douche respectueux du microbiome protecteur naturel de la peau." },

        // Solaire
        { name: "Anthelios UVMune 400 Invisible Fluide", slug: "anthelios-uvmune-400", price: 220, salePrice: 190, stock: 55, categoryId: cats["Solaire"].id, brand: "La Roche-Posay", description: "Très haute protection solaire SPF50+. Fini invisible, résistant à l'eau." },
        { name: "Photoderm Max Brume Solaire", slug: "photoderm-max-brume", price: 195, salePrice: 175, stock: 35, categoryId: cats["Solaire"].id, brand: "Bioderma", description: "Brume solaire transparente SPF 50+. Application sans étalement." },

        // Compléments
        { name: "Magnésium B6", slug: "magnesium-b6", price: 110, salePrice: 90, stock: 70, categoryId: cats["Compléments"].id, brand: "Arkopharma", description: "Réduit la fatigue et maintient un fonctionnement normal du système nerveux." },

        // Épicerie
        { name: "Miel de Manuka IAA 10+", slug: "miel-manuka-iaa-10", price: 350, salePrice: null, stock: 15, categoryId: cats["Épicerie"].id, brand: "Comptoirs & Compagnies", description: "Miel d'une qualité exceptionnelle connu pour ses propriétés uniques." },

        // Sport
        { name: "BCAA Acides Aminés", slug: "bcaa-acides-amines", price: 280, salePrice: 240, stock: 25, categoryId: cats["Sport"].id, brand: "EA Fit", description: "Soutien musculaire avant et après l'effort. Ratio 2:1:1." },
    ];

    const createdProducts = [];
    for (const p of products) {
        const prod = await prisma.product.upsert({
            where: { slug: p.slug },
            update: {
                ...p,
                // Assurer des images contextuelles plutôt que l'URL par défaut de l'image cassée
                images: JSON.stringify([cats[Object.keys(cats).find(k => cats[k].id === p.categoryId)].image])
            },
            create: { ...p, images: JSON.stringify([cats[Object.keys(cats).find(k => cats[k].id === p.categoryId)].image]) },
        });
        createdProducts.push(prod);
    }

    console.log("✅ Produits créés avec images contextuelles");

    // ─── Address ──────────────────────────────────────────────────────────────
    await prisma.address.upsert({
        where: { id: "addr-001" },
        update: {},
        create: {
            id: "addr-001", userId: customer.id, type: "home",
            firstName: "Sara", lastName: "Benali", phone: "0612345678",
            street: "12 Rue Hassan II", city: "Casablanca", isDefault: true,
        },
    });

    console.log("✅ Adresse créée");

    // ─── Wishlist ─────────────────────────────────────────────────────────────
    for (const prod of createdProducts.slice(0, 4)) {
        await prisma.wishlist.upsert({
            where: { userId_productId: { userId: customer.id, productId: prod.id } },
            update: {},
            create: { userId: customer.id, productId: prod.id },
        });
    }

    console.log("✅ Wishlist créée");

    // ─── Orders ───────────────────────────────────────────────────────────────
    const ordersData = [
        { status: "DELIVERED", paymentMethod: "CARD", items: [{ prod: createdProducts[0], qty: 2 }, { prod: createdProducts[3], qty: 1 }] },
        { status: "SHIPPED", paymentMethod: "COD", items: [{ prod: createdProducts[6], qty: 1 }] },
        { status: "PENDING", paymentMethod: "PAYPAL", items: [{ prod: createdProducts[10], qty: 1 }, { prod: createdProducts[11], qty: 2 }] },
        { status: "CANCELLED", paymentMethod: "CARD", items: [{ prod: createdProducts[1], qty: 1 }] },
    ];

    for (const o of ordersData) {
        const total = o.items.reduce((acc, i) => acc + (i.prod.salePrice ?? i.prod.price) * i.qty, 0);
        await prisma.order.create({
            data: {
                userId: customer.id,
                totalAmount: total,
                status: o.status,
                paymentMethod: o.paymentMethod,
                orderItems: {
                    create: o.items.map(i => ({
                        productId: i.prod.id,
                        quantity: i.qty,
                        price: i.prod.salePrice ?? i.prod.price,
                    })),
                },
            },
        });
    }

    console.log("✅ Commandes créées");
    console.log("\n🔑 admin@vitaluxe.ma / admin123");
    console.log("🔑 client@vitaluxe.ma / user123");
}

main().catch(console.error).finally(() => prisma.$disconnect());


const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const slugs = [
  "cosrx-low-ph-good-morning-gel-cleanser",
  "beauty-of-joseon-ginseng-cleansing-oil-210ml",
  "bioderma-sensibio-gel-moussant-200-ml",
  "skin1004-madagascar-centella-probio-cica-essence-toner-210-ml",
  "some-by-mi-aha-bha-miracle-toner-150ml",
  "cosrx-the-niacinamide-15-serum-20-ml",
  "beauty-of-joseon-glow-serum-propolis-niacinamide-30ml",
  "the-ordinary-niacinamide-10-zinc",
  "cosrx-advanced-snail-92-cream",
  "cerave-moisturizing-cream",
  "beauty-of-joseon-relief-sun-spf50",
  "la-roche-posay-anthelios-spf50",
  "maybelline-fit-me-foundation-30ml",
  "huda-beauty-liquid-matte-lipstick"
];

function formatName(slug) {
  return slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'soins' },
    update: {},
    create: { name: 'Soins', slug: 'soins' }
  });

  const productsData = slugs.map(slug => ({
    name: formatName(slug),
    slug: slug,
    description: 'Produit de beauté - ' + formatName(slug),
    price: 99.99,
    categoryId: category.id
  }));

  const result = await prisma.product.createMany({
    data: productsData,
    skipDuplicates: true
  });

  console.log(`Produits insérés avec succès. Nombre : ${result.count}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

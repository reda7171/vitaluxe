const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const category = await prisma.category.upsert({
    where: { slug: 'maquillage' },
    update: {},
    create: { name: 'Maquillage', slug: 'maquillage' }
  });

  const product = await prisma.product.create({
    data: {
      name: 'Huda Beauty Liquid Matte / Essence Lash Princess Mascara',
      slug: 'huda-beauty-liquid-matte-lipstickessence-lash-princess-mascara-12ml',
      description: 'Produit de beauté',
      price: 99.99,
      categoryId: category.id
    }
  });
  console.log('Produit inséré avec succès. ID:', product.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.product.updateMany({
    data: {
      stock: 10
    }
  });
  console.log(`Mise à jour réussie. ${result.count} produits modifiés.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

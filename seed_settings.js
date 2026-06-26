const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const defaultHeader = {
    topBannerText: "Livraison gratuite Rabat à partir de 350 Dh — Autres villes 600 Dh",
    phone: "06 66 69 54 86",
    phoneLink: "tel:+212666695486",
    whatsapp: "212666695486"
  };

  const settings = await prisma.storeSettings.upsert({
    where: { id: "1" },
    update: {
      header: JSON.stringify(defaultHeader)
    },
    create: {
      id: "1",
      header: JSON.stringify(defaultHeader)
    }
  });
  console.log("Settings updated successfully");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🛠 Restauration de la bannière Hero...");
  
  await prisma.banner.upsert({
    where: { id: "hero-1" },
    update: {
      title: "La beauté & la santé,<br /> au quotidien.",
      subtitle: "Découvrez une sélection exclusive de produits parapharmaceutiques premium. Des soins authentiques pour sublimer votre peau et préserver votre bien-être.",
      imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800",
      link: "/shop",
      active: true,
      position: "HERO"
    },
    create: {
      id: "hero-1",
      title: "La beauté & la santé,<br /> au quotidien.",
      subtitle: "Découvrez une sélection exclusive de produits parapharmaceutiques premium. Des soins authentiques pour sublimer votre peau et préserver votre bien-être.",
      imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=800",
      link: "/shop",
      active: true,
      position: "HERO"
    }
  });

  console.log("✅ Bannière HERO restaurée.");
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

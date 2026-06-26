import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const usersData = [
  { name: 'Youssef El Fassi', email: 'youssef@gmail.com' },
  { name: 'Sara Bennis', email: 'sara@hotmail.com' },
  { name: 'Mehdi Rharbaoui', email: 'mehdi@gmail.com' },
  { name: 'Amine Benali', email: 'amine@hotmail.com' },
  { name: 'Leïla Tazi', email: 'leila@gmail.com' },
];

const reviewsContent = [
  // Darija mixed with French
  "Produit zwin bezaf, qualité top! La livraison kanet rapide, je recommande sans hésitation.",
  "Top de chez top. Kanjereb chhal men haja mais hada vraiment efficace. Merci likom!",
  "C'est la deuxième fois que je commande, l'emballage mzyan o les résultats kaybanou très vite. Bravo l'équipe.",
  
  // Purely Darija
  "Saraha had lproduit nafa3ni bezaf. Mchit 3and shhal men wahd walo, lhamdoulilah mli lqit hada.",
  "Khedma nqiya w m39oula. Laman w lmsdaqiya. Nseh biha drari w bnat li baghin chi haja mzyana.",
  "Tbarkellah 3likom, produit raw3a, taman mnasb w tawsil flweqt.",
  
  // Purely French
  "Excellent produit, conforme à la description. J'ai remarqué une nette amélioration après quelques jours d'utilisation.",
  "Je suis très satisfait de cet achat. Le service client est très réactif et professionnel.",
  "La texture est parfaite, l'odeur est agréable. C'est devenu mon indispensable de tous les jours."
];

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  console.log('Creating users...');
  const createdUsers = [];
  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        password: hashedPassword,
        name: u.name,
      },
      create: {
        email: u.email,
        name: u.name,
        password: hashedPassword,
        role: 'CUSTOMER',
      },
    });
    createdUsers.push(user);
    console.log(`User ${user.email} created/updated.`);
  }

  const products = await prisma.product.findMany();
  
  if (products.length === 0) {
    console.log('No products found to add reviews to.');
    return;
  }

  console.log('Adding reviews...');
  for (const user of createdUsers) {
    // 2 to 3 reviews per user
    const numReviews = Math.floor(Math.random() * 2) + 2; 
    
    // Pick random products for this user
    const shuffledProducts = [...products].sort(() => 0.5 - Math.random());
    const selectedProducts = shuffledProducts.slice(0, numReviews);

    for (const product of selectedProducts) {
      const content = reviewsContent[Math.floor(Math.random() * reviewsContent.length)];
      const rating = Math.floor(Math.random() * 2) + 4; // 4 or 5 stars

      await prisma.review.create({
        data: {
          productId: product.id,
          userId: user.id,
          rating: rating,
          comment: content,
          status: 'APPROVED',
        }
      });
      console.log(`Added review by ${user.email} for product ${product.name}`);
    }
  }

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

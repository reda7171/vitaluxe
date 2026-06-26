import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const updates = [
    { old: 'youssef@example.com', new: 'youssef@gmail.com' },
    { old: 'sara@example.com', new: 'sara@hotmail.com' },
    { old: 'mehdi@example.com', new: 'mehdi@gmail.com' },
    { old: 'amine@example.com', new: 'amine@hotmail.com' },
    { old: 'leila@example.com', new: 'leila@gmail.com' },
  ];

  for (const u of updates) {
    const user = await prisma.user.findUnique({ where: { email: u.old } });
    if (user) {
      await prisma.user.update({
        where: { email: u.old },
        data: { email: u.new }
      });
      console.log(`Updated ${u.old} to ${u.new}`);
    } else {
      console.log(`User ${u.old} not found.`);
    }
  }
}

main().finally(() => prisma.$disconnect());

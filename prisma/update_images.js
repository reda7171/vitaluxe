const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const productImages = [
  {
    slug: "cosrx-low-ph-good-morning-gel-cleanser",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/cosrx-low-ph-good-morning-gel-cleanser-150ml_12572219_50104127.jpg"
    ]
  },
  {
    slug: "beauty-of-joseon-ginseng-cleansing-oil-210ml",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/beauty-of-joseon-ginseng-cleansing-oil_14490523.jpg"
    ]
  },
  {
    slug: "bioderma-sensibio-gel-moussant-200-ml",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/bioderma-sensibio-foaming-gel-200ml_12575424.jpg"
    ]
  },
  {
    slug: "skin1004-madagascar-centella-probio-cica-essence-toner-210-ml",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/skin1004-madagascar-centella-probio-cica-essence-toner_16302534.jpg"
    ]
  },
  {
    slug: "some-by-mi-aha-bha-miracle-toner-150ml",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/some-by-mi-aha-bha-pha-miracle-toner_12990258.jpg"
    ]
  },
  {
    slug: "cosrx-the-niacinamide-15-serum-20-ml",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/cosrx-the-niacinamide-15-serum_15665600.jpg"
    ]
  },
  {
    slug: "beauty-of-joseon-glow-serum-propolis-niacinamide-30ml",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/beauty-of-joseon-glow-serum-propolis-niacinamide_14490474.jpg"
    ]
  },
  {
    slug: "the-ordinary-niacinamide-10-zinc",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/the-ordinary-niacinamide-10-zinc-1_12611988.jpg"
    ]
  },
  {
    slug: "cosrx-advanced-snail-92-cream",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/cosrx-advanced-snail-92-all-in-one-cream_12572137.jpg"
    ]
  },
  {
    slug: "cerave-moisturizing-cream",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/cerave-moisturising-cream_13134658.jpg"
    ]
  },
  {
    slug: "beauty-of-joseon-relief-sun-spf50",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/beauty-of-joseon-relief-sun-rice-probiotics-spf50_14490484.jpg"
    ]
  },
  {
    slug: "la-roche-posay-anthelios-spf50",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/la-roche-posay-anthelios-uvmune-400-invisible-fluid-spf50_15840254.jpg"
    ]
  },
  {
    slug: "maybelline-fit-me-foundation-30ml",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/maybelline-fit-me-dewy-smooth-foundation_11619479.jpg"
    ]
  },
  {
    slug: "huda-beauty-liquid-matte-lipstick",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/huda-beauty-liquid-matte-lipstick_11984284.jpg"
    ]
  },
  {
    slug: "huda-beauty-liquid-matte-lipstickessence-lash-princess-mascara-12ml",
    images: [
      "https://images.lookfantastic.com/images/th/1200x1200/essence-lash-princess-false-lash-effect-mascara_11982993.jpg"
    ]
  }
];

async function main() {
  let updated = 0;
  for (const item of productImages) {
    const result = await prisma.product.updateMany({
      where: { slug: item.slug },
      data: { images: JSON.stringify(item.images) }
    });
    if (result.count > 0) {
      updated++;
      console.log(`✓ ${item.slug}`);
    } else {
      console.log(`✗ Non trouvé: ${item.slug}`);
    }
  }
  console.log(`\nTotal mis à jour: ${updated}/${productImages.length}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

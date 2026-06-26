import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const descriptions: Record<string, string> = {
  // ── K-Beauty / Skincare ──────────────────────────────────────────────
  "Huda Beauty Liquid Matte / Essence Lash Princess Mascara": `<p>Ce duo iconique réunit deux bestsellers beauté pour un maquillage des yeux et des lèvres absolument irrésistible.</p>
<p>Le <strong>mascara Essence Lash Princess</strong> offre un volume et une longueur spectaculaires grâce à sa formule volumisante à la fibre. Ses cils sont définis, allongés et courbés à la perfection pour un regard dramatique et saisissant, avec une tenue longue durée jusqu'à 12h.</p>
<p>Le <strong>Huda Beauty Liquid Matte</strong> est un rouge à lèvres liquide ultra-pigmenté qui sèche en un fini mat velouté et élégant. Non transférant, longue durée, il offre une couleur intense et homogène en un seul passage.</p>
<ul>
  <li>Volume et longueur exceptionnels pour le mascara</li>
  <li>Fini mat velours ultra-pigmenté pour les lèvres</li>
  <li>Longue tenue jusqu'à 12h</li>
  <li>Non transférant et résistant au sebum</li>
</ul>`,

  "Cosrx Low Ph Good Morning Gel Cleanser": `<p>Le nettoyant visage incontournable de la K-Beauty. La formule à faible pH (5,5) respecte le film hydrolipidique naturel de la peau tout en éliminant efficacement les impuretés, le sébum et les résidus de pollution.</p>
<p>Enrichi en <strong>acide thé-arbre (Tea Tree)</strong> aux propriétés purifiantes et apaisantes, il prépare la peau à absorber parfaitement les soins suivants de votre routine. Sa texture gel légère mousse doucement sans agresser ni dessécher.</p>
<ul>
  <li>pH équilibré à 5,5 — idéal pour peaux sensibles et mixtes</li>
  <li>Nettoie sans décaper ni assécher</li>
  <li>Élimine les impuretés et prépare la peau</li>
  <li>Sans sulfate SLS/SLES, sans parfum artificiel</li>
  <li>Convient aux peaux à tendance acnéique</li>
</ul>`,

  "Beauty Of Joseon Ginseng Cleansing Oil 210ml": `<p>L'huile démaquillante de luxe inspirée des rituels de beauté de la royauté coréenne. Formulée avec de l'huile de <strong>ginseng rouge</strong> et d'autres extraits botaniques précieux, elle fond littéralement les impuretés, le maquillage waterproof et l'excès de sébum sans laisser de film gras.</p>
<p>La technique de la double nettoyage commence ici : cette huile se transforme en émulsion laiteuse au contact de l'eau, rinçant tout sans résidu, en laissant la peau douce, lumineuse et parfaitement préparée pour la suite de la routine.</p>
<ul>
  <li>Dissout maquillage waterproof et SPF efficacement</li>
  <li>Enrichie en ginseng rouge aux propriétés anti-âge</li>
  <li>Se transforme en émulsion au contact de l'eau (rinçage facile)</li>
  <li>Laisse la peau douce, non grasse et lumineuse</li>
  <li>Convient à tous types de peau, y compris sensibles</li>
</ul>`,

  "Bioderma Sensibio Gel Moussant 200 Ml": `<p>Le gel moussant dermatologique de référence pour les peaux sensibles et réactives. Développé par les laboratoires Bioderma, ce soin nettoyant doux purifie la peau en douceur grâce à sa formule hypoallergénique testée sous contrôle dermatologique.</p>
<p>Sa texture gel moussante, non grasse et non parfumée, élimine les impuretés et le sébum sans altérer les défenses naturelles de la peau. Le complexe <strong>SENSIBIO® osmoprotecteur</strong> renforce la tolérance cutanée et apaise les peaux irritées ou fragilisées.</p>
<ul>
  <li>Formulé spécialement pour peaux sensibles et réactives</li>
  <li>pH physiologique respectueux de la barrière cutanée</li>
  <li>Sans parfum, sans savon, testé ophtalmologiquement</li>
  <li>Élimine douceurs, impuretés et traces de maquillage</li>
  <li>Testé sous contrôle dermatologique et pédiatrique</li>
</ul>`,

  "Skin1004 Madagascar Centella Probio Cica Essence Toner 210 Ml": `<p>L'essence-toner multi-fonctionnelle de Skin1004, enrichie en Centella Asiatica de Madagascar et en probiotiques. Cette formule innovante combine les bienfaits du toner et de l'essence en un seul produit pour simplifier et optimiser votre routine skincare.</p>
<p>La <strong>Centella Asiatica</strong> reconnue pour ses propriétés cicatrisantes, calmantes et régénérantes, est associée à un complexe probiotique qui renforce le microbiome cutané. Le résultat : une peau apaisée, plus résistante, repulpée et uniformisée.</p>
<ul>
  <li>97% d'ingrédients d'origine naturelle</li>
  <li>Centella Asiatica de Madagascar — calmant et cicatrisant</li>
  <li>Probiotiques pour renforcer le microbiome cutané</li>
  <li>Double action toner + essence en un seul soin</li>
  <li>Idéal peaux sensibles, rougeurs, post-acné</li>
</ul>`,

  "Some By Mi Aha Bha Miracle Toner 150ml": `<p>Le toner miracle aux 10 000 ppm d'acides exfoliants qui a transformé des millions de peaux à travers le monde. Sa formule tri-acides (AHA, BHA, PHA) offre une exfoliation chimique douce mais puissante pour révéler une peau nette, affinée et lumineuse.</p>
<p>L'<strong>AHA</strong> (acide glycolique) exfolie la surface de la peau et unifie le teint. Le <strong>BHA</strong> (acide salicylique) pénètre dans les pores pour les nettoyer en profondeur. Le <strong>PHA</strong> hydrate tout en exfoliant, idéal pour les peaux sensibles.</p>
<ul>
  <li>Triple exfoliation AHA + BHA + PHA</li>
  <li>Désobstrue les pores et réduit les points noirs</li>
  <li>Uniformise le teint et estompe les taches</li>
  <li>Enrichi en niacinamide et en extrait de thé vert</li>
  <li>Résultats visibles dès 30 jours d'utilisation</li>
</ul>`,

  "Cosrx The Niacinamide 15 Serum 20 Ml": `<p>Le sérum concentré à 15% de niacinamide de COSRX, une formule puissante pour traiter les pores dilatés, les taches pigmentaires et l'éclat terne. Avec l'une des concentrations en niacinamide les plus élevées du marché, ce sérum offre des résultats visibles et durables.</p>
<p>La <strong>niacinamide (Vitamine B3)</strong> est l'une des molécules les plus étudiées en dermatologie : elle régule la production de sébum, réduit l'hyperpigmentation, renforce la barrière cutanée et améliore visiblement la texture de la peau.</p>
<ul>
  <li>15% de niacinamide — concentration haute efficacité</li>
  <li>Resserre les pores dilatés visiblement</li>
  <li>Estompe les taches et unifie le teint</li>
  <li>Régule le sébum — idéal peaux grasses et mixtes</li>
  <li>Renforce la barrière cutanée et l'hydratation</li>
</ul>`,

  "Beauty Of Joseon Glow Serum Propolis Niacinamide 30ml": `<p>Le sérum éclat culte de la marque coréenne Beauty Of Joseon. Alliant la richesse de la <strong>propolis coréenne</strong> aux vertus de la <strong>niacinamide</strong>, ce sérum offre un cocktail anti-taches, anti-imperfections et ultra-nourrissant pour une peau rayonnante de santé.</p>
<p>La propolis, produit naturel des abeilles aux propriétés antibactériennes et apaisantes, hydrate et protège profondément. La niacinamide quant à elle uniformise le teint et resserre les pores. Ensemble, ils créent une synergie parfaite pour une peau visiblement transformée.</p>
<ul>
  <li>Propolis coréenne — antibactérienne, nourrissante, régénérante</li>
  <li>Niacinamide — anti-taches, pores resserrés, teint unifié</li>
  <li>Texture légère qui pénètre rapidement sans film gras</li>
  <li>Adapté peaux normales, mixtes, acnéiques</li>
  <li>Convient à une utilisation matin et soir</li>
</ul>`,

  "The Ordinary Niacinamide 10 Zinc": `<p>Le produit culte de The Ordinary qui a démocratisé la skincare clinique. Cette solution concentrée à <strong>10% de Niacinamide et 1% de Zinc</strong> cible efficacement les imperfections, les pores dilatés et les excès de sebum. Un essentiel indispensable pour les peaux à tendance grasse ou acnéique.</p>
<p>La <strong>niacinamide (Vitamine B3)</strong> régule la production de sébum, réduit l'apparence des pores et estompe les marques post-acné. Le <strong>zinc PCA</strong> complète l'action en réduisant les inflammations et en apportant un fini mat durable.</p>
<ul>
  <li>10% Niacinamide + 1% Zinc PCA — duo star anti-imperfections</li>
  <li>Resserre les pores et contrôle le sébum</li>
  <li>Réduit les rougeurs, marques et taches post-acné</li>
  <li>Formule légère, non comédogène, sans parfum</li>
  <li>Peut s'utiliser matin et soir après le nettoyage</li>
</ul>`,

  "Cosrx Advanced Snail 92 Cream": `<p>La crème nourrissante emblématique de COSRX, formulée avec <strong>92% de filtrat de bave d'escargot</strong>. Plébiscitée dans le monde entier, elle répare, hydrate en profondeur et accélère le renouvellement cellulaire pour une peau régénérée, souple et lumineuse.</p>
<p>La bave d'escargot est l'un des ingrédients anti-âge les plus puissants de la K-Beauty : riche en allantoïne, acide glycolique et collagène naturel, elle stimule la production de collagène, répare les dommages cutanés et offre une hydratation longue durée.</p>
<ul>
  <li>92% de filtrat de bave d'escargot pur</li>
  <li>Répare, hydrate et régénère la peau en profondeur</li>
  <li>Réduit les cicatrices d'acné et les marques</li>
  <li>Texture légère et absorbante, sans résidu poisseux</li>
  <li>Sans parfum, sans colorant — idéal peaux sensibles</li>
</ul>`,

  "Cerave Moisturizing Cream": `<p>La crème hydratante de référence développée avec des dermatologues, utilisée et recommandée dans le monde entier. La formule riche et non comédogène de CeraVe est enrichie en <strong>3 céramides essentiels (1, 3, 6-II)</strong>, en acide hyaluronique et en MVE Technology® pour une hydratation prolongée sur 24 heures.</p>
<p>Les céramides sont des lipides naturellement présents dans la peau et indispensables au maintien de la barrière cutanée. La formule en restaure le taux optimal pour protéger, nourrir et réparer les peaux sèches, très sèches ou fragilisées.</p>
<ul>
  <li>3 céramides essentiels pour restaurer la barrière cutanée</li>
  <li>Acide hyaluronique — hydratation profonde et repulpée</li>
  <li>MVE Technology® — libération progressive des actifs sur 24h</li>
  <li>Sans parfum, non comédogène, testée dermatologiquement</li>
  <li>Convient peaux sèches, sensibles, eczémateuses</li>
</ul>`,

  "Beauty Of Joseon Relief Sun Spf50": `<p>La crème solaire coréenne qui a révolutionné la protection solaire. Le Relief Sun de Beauty Of Joseon est formulé avec <strong>SPF 50+ / PA++++</strong>, la protection solaire maximale, dans une texture incroyablement légère et non grasse qui convient à tous les types de peau, y compris les plus sensibles.</p>
<p>Enrichi en <strong>riz coréen et en graines de sésame</strong> aux propriétés antioxydantes, ce soin protège contre les UVA et UVB tout en hydratant, apaisant et illuminant la peau. Aucun effet blanc, aucun film gras — juste une protection de haut niveau.</p>
<ul>
  <li>SPF 50+ / PA++++ — protection UVA/UVB maximale</li>
  <li>Texture ultra-légère, fini naturel sans effet blanc</li>
  <li>Riz coréen + graines de sésame — antioxydant et apaisant</li>
  <li>Non comédogène, idéal sous le maquillage</li>
  <li>Convient peaux sensibles, réactives, acnéiques</li>
</ul>`,

  "La Roche Posay Anthelios Spf50": `<p>La protection solaire dermatologique de référence mondiale. Anthelios de La Roche-Posay est formulé avec le filtre solaire breveté <strong>Mexoryl SX et XL</strong>, offrant une protection SPF 50+ large spectre contre les UVA courts, UVA longs et UVB, reconnue comme l'une des meilleures protections solaires au monde.</p>
<p>Sa formule hypoallergénique, testée sous contrôle dermatologique, est enrichie en eau thermale de La Roche-Posay aux propriétés apaisantes. Résistante à l'eau et à la transpiration, elle protège tout en prenant soin des peaux les plus sensibles.</p>
<ul>
  <li>SPF 50+ avec filtre breveté Mexoryl SX et XL</li>
  <li>Protection large spectre UVA/UVB — anti-vieillissement</li>
  <li>Eau thermale La Roche-Posay — apaisante et antioxydante</li>
  <li>Résistant à l'eau, testé dermatologiquement</li>
  <li>Formule hypoallergénique pour peaux sensibles</li>
</ul>`,

  "Maybelline Fit Me Foundation 30ml": `<p>Le fond de teint qui s'adapte à votre peau, pas l'inverse. Le <strong>Fit Me! de Maybelline</strong> est disponible en plus de 40 teintes soigneusement sélectionnées pour correspondre à toutes les carnations, des plus claires aux plus profondes, avec des sous-tons chauds, neutres et froids.</p>
<p>Sa formule légère offre une couverture naturelle et modulable — de légère à moyenne — qui laisse la peau respirer tout en unifiant parfaitement le teint. Sans transfert, elle résiste à la transpiration pour une tenue confortable toute la journée.</p>
<ul>
  <li>40+ teintes adaptées à toutes les carnations</li>
  <li>Couverture légère à moyenne, fini naturel</li>
  <li>Sans huile, non comédogène — idéal peaux normales à grasses</li>
  <li>Résistant à la transpiration — tenue jusqu'à 12h</li>
  <li>Enrichi en SPF pour une légère protection quotidienne</li>
</ul>`,

  "Huda Beauty Liquid Matte Lipstick": `<p>Le rouge à lèvres liquide le plus emblématique de Huda Beauty. Le <strong>Liquid Matte</strong> est une véritable référence en matière de lèvres parfaites : sa formule ultra-pigmentée sèche en un fini mat velouté et élégant qui reste en place pendant des heures, sans bavure ni inconfort.</p>
<p>Enrichie en agents hydratants, sa formule légère ne dessèche pas les lèvres malgré son fini mat intense. En un seul passage, les lèvres sont enveloppées d'une couleur vibrante, précise et ultra-longue tenue.</p>
<ul>
  <li>Fini mat velours ultra-pigmenté en un seul passage</li>
  <li>Longue tenue — résistant aux repas et aux baisers</li>
  <li>Non transférant et résistant au sebum</li>
  <li>Enrichi en actifs hydratants — lèvres confortables</li>
  <li>Applicateur précis pour un contour parfait</li>
</ul>`,
};

async function main() {
  const products = await prisma.product.findMany();
  console.log(`Found ${products.length} products to update.\n`);

  let updated = 0;
  let skipped = 0;

  for (const product of products) {
    const newDescription = descriptions[product.name];

    if (!newDescription) {
      console.log(`⚠ No description mapping for: "${product.name}"`);
      skipped++;
      continue;
    }

    await prisma.product.update({
      where: { id: product.id },
      data: { description: newDescription },
    });

    console.log(`✓ Updated: ${product.name}`);
    updated++;
  }

  console.log(`\nDone! Updated: ${updated} / ${products.length} (skipped: ${skipped})`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

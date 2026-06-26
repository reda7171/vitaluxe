import { PrismaClient } from '@prisma/client';
import https from 'https';
import http from 'http';

const prisma = new PrismaClient();

// Map brand name -> best logo URL source
const brandLogos: Record<string, string[]> = {
  'La Roche-Posay': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/La_Roche-Posay_logo.svg/1200px-La_Roche-Posay_logo.svg.png',
    'https://logo.clearbit.com/laroche-posay.fr',
  ],
  'Vichy': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Vichy_logo.svg/1200px-Vichy_logo.svg.png',
    'https://logo.clearbit.com/vichy.fr',
  ],
  'CeraVe': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/CeraVe_logo.svg/1200px-CeraVe_logo.svg.png',
    'https://logo.clearbit.com/cerave.com',
  ],
  'Eucerin': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/Eucerin-Logo.svg/1200px-Eucerin-Logo.svg.png',
    'https://logo.clearbit.com/eucerin.com',
  ],
  'Avène': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Avene-logo.png/640px-Avene-logo.png',
    'https://logo.clearbit.com/avene.com',
  ],
  'Bioderma': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Bioderma_logo.svg/1200px-Bioderma_logo.svg.png',
    'https://logo.clearbit.com/bioderma.com',
  ],
  'Nuxe': [
    'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Nuxe_logo.svg/1200px-Nuxe_logo.svg.png',
    'https://logo.clearbit.com/nuxe.com',
  ],
  'Caudalie': [
    'https://logo.clearbit.com/caudalie.com',
  ],
  'Uriage': [
    'https://logo.clearbit.com/uriage.com',
  ],
  'Neutrogena': [
    'https://logo.clearbit.com/neutrogena.com',
  ],
  'Garnier': [
    'https://logo.clearbit.com/garnier.com',
  ],
  "L'Oréal Paris": [
    'https://logo.clearbit.com/loreal-paris.com',
  ],
  'Nivea': [
    'https://logo.clearbit.com/nivea.com',
  ],
  'Dove': [
    'https://logo.clearbit.com/dove.com',
  ],
  'Weleda': [
    'https://logo.clearbit.com/weleda.com',
  ],
  'SVR': [
    'https://logo.clearbit.com/svr.com',
  ],
  'Filorga': [
    'https://logo.clearbit.com/filorga.com',
  ],
  'Clarins': [
    'https://logo.clearbit.com/clarins.com',
  ],
  'Kérastase': [
    'https://logo.clearbit.com/kerastase.com',
  ],
  "L'Oréal Professionnel": [
    'https://logo.clearbit.com/lorealprofessionnel.com',
  ],
  'Schwarzkopf': [
    'https://logo.clearbit.com/schwarzkopf.com',
  ],
  'Head & Shoulders': [
    'https://logo.clearbit.com/headandshoulders.com',
  ],
  'Elsève': [
    'https://logo.clearbit.com/loreal-paris.fr',
  ],
  'René Furterer': [
    'https://logo.clearbit.com/renefurterer.com',
  ],
  'Mustela': [
    'https://logo.clearbit.com/mustela.com',
  ],
  'Bébé Cadum': [
    'https://logo.clearbit.com/cadum.fr',
  ],
  'Chicco': [
    'https://logo.clearbit.com/chicco.com',
  ],
  'Dodie': [
    'https://logo.clearbit.com/dodie.fr',
  ],
  'Ambre Solaire': [
    'https://logo.clearbit.com/garnier.fr',
  ],
  'Hawaiian Tropic': [
    'https://logo.clearbit.com/hawaiiantropic.com',
  ],
  'Altruist': [
    'https://logo.clearbit.com/altruistuk.com',
  ],
  'Arkopharma': [
    'https://logo.clearbit.com/arkopharma.fr',
  ],
  'Pileje': [
    'https://logo.clearbit.com/pileje.com',
  ],
  'Isostar': [
    'https://logo.clearbit.com/isostar.com',
  ],
  'Omega Pharma': [
    'https://logo.clearbit.com/omegapharma.com',
  ],
  'Boiron': [
    'https://logo.clearbit.com/boiron.fr',
  ],
  'Bulldog': [
    'https://logo.clearbit.com/bulldogskincare.com',
  ],
  'Vichy Homme': [
    'https://logo.clearbit.com/vichy.fr',
  ],
  'Nickel': [
    'https://logo.clearbit.com/nickel.fr',
  ],
  'Optimum Nutrition': [
    'https://logo.clearbit.com/optimumnutrition.com',
  ],
  'EA Fit': [
    'https://logo.clearbit.com/eafit.com',
  ],
  'Decathlon': [
    'https://logo.clearbit.com/decathlon.com',
  ],
  'Sanex': [
    'https://logo.clearbit.com/sanex.eu',
  ],
  'Colgate': [
    'https://logo.clearbit.com/colgate.com',
  ],
  'Oral-B': [
    'https://logo.clearbit.com/oralb.com',
  ],
  'Gillette': [
    'https://logo.clearbit.com/gillette.com',
  ],
  'Cattier': [
    'https://logo.clearbit.com/cattier-paris.com',
  ],
  'Melvita': [
    'https://logo.clearbit.com/melvita.com',
  ],
  'Sanoflore': [
    'https://logo.clearbit.com/sanoflore.net',
  ],
};

function fetchAsBase64(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    protocol.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; VitaluxeBot/1.0)',
      }
    }, (res) => {
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        fetchAsBase64(res.headers.location).then(resolve).catch(reject);
        return;
      }
      if (!res.statusCode || res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode}`));
        return;
      }
      const contentType = res.headers['content-type'] || 'image/png';
      const chunks: Buffer[] = [];
      res.on('data', (chunk: Buffer) => chunks.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        if (buffer.length < 500) {
          reject(new Error('Image too small, probably invalid'));
          return;
        }
        const base64 = buffer.toString('base64');
        resolve(`data:${contentType.split(';')[0]};base64,${base64}`);
      });
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function tryFetchLogo(urls: string[]): Promise<string | null> {
  for (const url of urls) {
    try {
      const b64 = await fetchAsBase64(url);
      return b64;
    } catch (e: any) {
      console.log(`  ✗ Failed ${url}: ${e.message}`);
    }
  }
  return null;
}

async function main() {
  const brands = await prisma.brand.findMany();
  console.log(`Found ${brands.length} brands to update.\n`);

  let updated = 0;
  let failed = 0;

  for (const brand of brands) {
    const urls = brandLogos[brand.name];
    if (!urls) {
      console.log(`⚠ No URL config for: ${brand.name}`);
      continue;
    }

    console.log(`Downloading logo for: ${brand.name}...`);
    const base64 = await tryFetchLogo(urls);

    if (base64) {
      await prisma.brand.update({
        where: { id: brand.id },
        data: { image: base64 },
      });
      console.log(`  ✓ Updated ${brand.name} (${Math.round(base64.length / 1024)}KB)\n`);
      updated++;
    } else {
      console.log(`  ✗ Could not download logo for ${brand.name}\n`);
      failed++;
    }

    // Small delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 300));
  }

  console.log(`\nDone! Updated: ${updated}, Failed: ${failed}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

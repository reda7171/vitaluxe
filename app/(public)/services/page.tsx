import { PrismaClient } from "@prisma/client";
import { ServicesList } from "./ServicesList";

const prisma = new PrismaClient();

// Configuration de la page pour le revalidation
export const revalidate = 60; // Revalidate every 60 seconds

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    prisma.pharmacyService.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.storeSettings.findUnique({ where: { id: "1" } })
  ]);

  let isEnabled = true;
  if (settings?.modules) {
    try {
      const parsed = JSON.parse(settings.modules);
      if (parsed.enableServices === false) {
        isEnabled = false;
      }
    } catch(e) {}
  }

  if (!isEnabled) {
    return (
      <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center py-20 px-4 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-2xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-[#103178] mb-4">Services indisponibles</h1>
          <p className="text-gray-500 text-lg">La réservation de services n'est pas disponible pour le moment. Veuillez réessayer ultérieurement.</p>
        </div>
      </main>
    );
  }


  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[#103178] mb-4">Nos Services en Parapharmacie</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Découvrez nos services spécialisés pour prendre soin de votre santé et de votre bien-être. 
            Réservez votre créneau en ligne et venez profiter de l'expertise de nos professionnels.
          </p>
        </div>

        {services.length > 0 ? (
          <ServicesList initialServices={services} />
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium text-gray-900 mb-2">Bientôt disponible</h3>
            <p className="text-gray-500">Nos services sont en cours de mise en place. Revenez très vite !</p>
          </div>
        )}
      </div>
    </main>
  );
}

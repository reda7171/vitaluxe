"use client";

import { useState } from "react";
import { Clock, Tag, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReservationModal } from "@/components/services/ReservationModal";

type PharmacyService = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
};

export function ServicesList({ initialServices }: { initialServices: PharmacyService[] }) {
  const [selectedService, setSelectedService] = useState<PharmacyService | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {initialServices.map((service) => (
          <div key={service.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
            <div className="p-6 flex-1 flex flex-col">
              <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-[#103178] transition-colors">{service.name}</h3>
              <p className="text-gray-600 mb-6 flex-1 text-sm leading-relaxed">{service.description}</p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                <div className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-full">
                  <Clock className="w-4 h-4 mr-1.5 text-[#103178]" />
                  {service.duration} min
                </div>
                <div className="flex items-center text-lg font-bold text-[#103178]">
                  {service.price} <span className="text-sm font-medium ml-1">MAD</span>
                </div>
              </div>
            </div>
            
            <div className="px-6 pb-6 pt-2">
              <Button 
                onClick={() => setSelectedService(service)}
                className="w-full bg-[#103178] hover:bg-[#0c2459] text-white rounded-xl py-6 flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#103178]/20 transition-all"
              >
                Réserver maintenant <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ReservationModal 
        service={selectedService} 
        isOpen={!!selectedService} 
        onClose={() => setSelectedService(null)} 
      />
    </>
  );
}

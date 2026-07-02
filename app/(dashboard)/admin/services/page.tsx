"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PharmacyService = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  active: boolean;
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<PharmacyService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<PharmacyService>>({});

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = currentService.id ? "PUT" : "POST";
      const url = currentService.id ? `/api/admin/services/${currentService.id}` : "/api/admin/services";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentService),
      });
      
      if (res.ok) {
        fetchServices();
        setIsEditing(false);
        setCurrentService({});
      }
    } catch (error) {
      console.error("Failed to save service:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce service ?")) return;
    try {
      const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      if (res.ok) fetchServices();
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Services</h1>
        <Button onClick={() => { setIsEditing(true); setCurrentService({ active: true }); }}>
          <Plus className="w-4 h-4 mr-2" /> Nouveau Service
        </Button>
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border">
          <h2 className="text-xl mb-4 font-semibold">{currentService.id ? "Modifier le service" : "Nouveau service"}</h2>
          <form onSubmit={handleSave} className="space-y-4 max-w-xl">
            <div>
              <Label>Nom du service</Label>
              <Input 
                value={currentService.name || ""} 
                onChange={(e) => setCurrentService({...currentService, name: e.target.value})} 
                required 
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea 
                className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={currentService.description || ""} 
                onChange={(e) => setCurrentService({...currentService, description: e.target.value})} 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Durée (minutes)</Label>
                <Input 
                  type="number" 
                  value={currentService.duration || ""} 
                  onChange={(e) => setCurrentService({...currentService, duration: parseInt(e.target.value)})} 
                  required 
                />
              </div>
              <div>
                <Label>Prix (MAD)</Label>
                <Input 
                  type="number" 
                  step="0.01" 
                  value={currentService.price || ""} 
                  onChange={(e) => setCurrentService({...currentService, price: parseFloat(e.target.value)})} 
                  required 
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="active" 
                checked={currentService.active || false} 
                onChange={(e) => setCurrentService({...currentService, active: e.target.checked})} 
              />
              <Label htmlFor="active">Actif</Label>
            </div>
            <div className="flex gap-2">
              <Button type="submit">Enregistrer</Button>
              <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Annuler</Button>
            </div>
          </form>
        </div>
      ) : null}

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Nom</th>
              <th className="px-6 py-3">Durée</th>
              <th className="px-6 py-3">Prix</th>
              <th className="px-6 py-3">Statut</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((service) => (
              <tr key={service.id} className="border-b bg-white hover:bg-gray-50">
                <td className="px-6 py-4 font-medium">{service.name}</td>
                <td className="px-6 py-4">{service.duration} min</td>
                <td className="px-6 py-4">{service.price} MAD</td>
                <td className="px-6 py-4">
                  {service.active ? (
                    <span className="flex items-center text-green-600"><CheckCircle className="w-4 h-4 mr-1" /> Actif</span>
                  ) : (
                    <span className="flex items-center text-red-600"><XCircle className="w-4 h-4 mr-1" /> Inactif</span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <Button variant="ghost" size="sm" onClick={() => { setIsEditing(true); setCurrentService(service); }}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(service.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {services.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Aucun service trouvé.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

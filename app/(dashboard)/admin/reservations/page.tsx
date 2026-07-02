
"use client";

import { useState, useEffect } from "react";
import { Check, X, Clock, Trash2, Phone, User, Calendar, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type PharmacyService = {
  id: string;
  name: string;
  duration: number;
  price: number;
};

type Reservation = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  date: string;
  time: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  notes: string | null;
  createdAt: string;
  service: PharmacyService;
};

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [services, setServices] = useState<PharmacyService[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    serviceId: "",
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReservations();
    fetchServices();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await fetch("/api/admin/reservations");
      const data = await res.json();
      setReservations(data);
    } catch (error) {
      console.error("Failed to fetch reservations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchServices = async () => {
    try {
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      // Filter only active services
      setServices(data.filter((s: any) => s.active));
    } catch (error) {
      console.error("Failed to fetch services:", error);
    }
  };

  const updateStatus = async (id: string, status: Reservation["status"]) => {
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        fetchReservations();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        fetchReservations();
        setIsCreating(false);
        setFormData({ serviceId: "", name: "", phone: "", email: "", date: "", time: "", notes: "" });
      }
    } catch (error) {
      console.error("Failed to create reservation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center w-fit"><Clock className="w-3 h-3 mr-1"/> En attente</span>;
      case "CONFIRMED":
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center w-fit"><Check className="w-3 h-3 mr-1"/> Confirmée</span>;
      case "COMPLETED":
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center w-fit"><Check className="w-3 h-3 mr-1"/> Terminée</span>;
      case "CANCELLED":
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center w-fit"><X className="w-3 h-3 mr-1"/> Annulée</span>;
      default:
        return null;
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des Réservations</h1>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="w-4 h-4 mr-2" /> Nouvelle Réservation
        </Button>
      </div>

      {isCreating && (
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6 border">
          <h2 className="text-xl mb-4 font-semibold">Créer une réservation manuellement</h2>
          <form onSubmit={handleCreate} className="space-y-4 max-w-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Service *</label>
                <select 
                  required
                  value={formData.serviceId}
                  onChange={(e) => setFormData({...formData, serviceId: e.target.value})}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="" disabled>Sélectionner un service</option>
                  {services.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.price} MAD)</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Nom du client *</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Téléphone *</label>
                <input 
                  required
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Email</label>
                <input 
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Date *</label>
                <input 
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-700 block mb-1">Heure *</label>
                <input 
                  required
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 block mb-1">Notes</label>
              <textarea 
                value={formData.notes}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Création..." : "Créer la réservation"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                Annuler
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-3">Client</th>
              <th className="px-6 py-3">Service</th>
              <th className="px-6 py-3">Date & Heure</th>
              <th className="px-6 py-3">Statut</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id} className="border-b bg-white hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900 flex items-center"><User className="w-3 h-3 mr-2 text-gray-500" /> {reservation.name}</div>
                  <div className="text-gray-500 flex items-center mt-1"><Phone className="w-3 h-3 mr-2" /> {reservation.phone}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium">{reservation.service.name}</div>
                  <div className="text-gray-500 text-xs">{reservation.service.duration} min • {reservation.service.price} MAD</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center"><Calendar className="w-3 h-3 mr-2 text-gray-500"/> {new Date(reservation.date).toLocaleDateString()}</div>
                  <div className="flex items-center mt-1"><Clock className="w-3 h-3 mr-2 text-gray-500"/> {reservation.time}</div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(reservation.status)}
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  {reservation.status === "PENDING" && (
                    <>
                      <Button variant="outline" size="sm" className="text-blue-600 border-blue-200" onClick={() => updateStatus(reservation.id, "CONFIRMED")}>Confirmer</Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-200" onClick={() => updateStatus(reservation.id, "CANCELLED")}>Annuler</Button>
                    </>
                  )}
                  {reservation.status === "CONFIRMED" && (
                    <Button variant="outline" size="sm" className="text-green-600 border-green-200" onClick={() => updateStatus(reservation.id, "COMPLETED")}>Terminer</Button>
                  )}
                </td>
              </tr>
            ))}
            {reservations.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Aucune réservation trouvée.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

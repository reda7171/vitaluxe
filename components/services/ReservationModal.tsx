"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

type PharmacyService = {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
};

export function ReservationModal({ 
  service, 
  isOpen, 
  onClose 
}: { 
  service: PharmacyService | null, 
  isOpen: boolean, 
  onClose: () => void 
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    notes: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          serviceId: service.id,
        }),
      });

      if (res.ok) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Failed to create reservation:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSuccess(false);
    setFormData({ name: "", phone: "", email: "", date: "", time: "", notes: "" });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Réserver {service.name}</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour réserver votre créneau. Le paiement de {service.price} MAD s'effectuera sur place.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-6 text-center">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Réservation confirmée !</h3>
            <p className="text-sm text-gray-500 mb-6">Nous avons bien reçu votre demande de réservation. Nous vous contacterons rapidement si besoin.</p>
            <Button onClick={handleClose} className="w-full bg-[#103178] hover:bg-[#0c2459]">Fermer</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Nom complet *</Label>
                <Input id="name" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Téléphone *</Label>
                  <Input id="phone" required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Date souhaitée *</Label>
                  <Input id="date" type="date" required value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} min={new Date().toISOString().split('T')[0]} />
                </div>
                <div>
                  <Label htmlFor="time">Heure souhaitée *</Label>
                  <Input id="time" type="time" required value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes complémentaires</Label>
                <textarea 
                  id="notes"
                  className="w-full flex min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.notes} 
                  onChange={(e) => setFormData({...formData, notes: e.target.value})} 
                  placeholder="Informations utiles pour notre équipe..."
                />
              </div>
            </div>
            <div className="pt-4 flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={handleClose}>Annuler</Button>
              <Button type="submit" disabled={isSubmitting} className="bg-[#103178] hover:bg-[#0c2459]">
                {isSubmitting ? "Envoi..." : "Confirmer la réservation"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

"use client"

import { useState, useEffect } from "react";
import MessagesListClient from "../../../../components/dashboard/MessagesListClient";
import { Loader2 } from "lucide-react";

export default function MessagesPage() {
    const [messages, setMessages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchMessages() {
            try {
                const res = await fetch("/api/admin/messages");
                if (!res.ok) throw new Error("Erreur lors de la récupération des messages");
                const data = await res.json();
                setMessages(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchMessages();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-slate-500 animate-pulse">Chargement des messages...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 text-red-600 rounded-xl border border-red-100">
                <p className="font-bold">Une erreur est survenue</p>
                <p className="text-sm">{error}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">Messages de contact</h1>
                <p className="text-slate-500 text-sm mt-1">Gérez les demandes de vos clients depuis le site</p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50">
                    <span className="text-sm font-semibold flex-1">Expéditeur</span>
                    <span className="text-sm font-semibold w-1/4">Sujet</span>
                    <span className="text-sm font-semibold w-32 text-center">Statut</span>
                    <span className="text-sm font-semibold w-32 text-right flex flex-col items-end">Date</span>
                </div>
                <MessagesListClient initialMessages={messages} />
            </div>
        </div>
    );
}

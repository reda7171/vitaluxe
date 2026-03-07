"use client"

import { useState } from "react";
import { Mail, CheckCircle2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type Message = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    createdAt: Date;
};

export default function MessagesListClient({ initialMessages }: { initialMessages: Message[] }) {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const router = useRouter();

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "READ" })
            });
            if (res.ok) {
                setMessages(prev => prev.map(m => m.id === id ? { ...m, status: "READ" } : m));
                toast.success("Message marqué comme lu");
                router.refresh();
            }
        } catch (error) {
            toast.error("Erreur serveur");
        }
    }

    const deleteMessage = async (id: string) => {
        if (!confirm("Voulez-vous vraiment supprimer ce message ?")) return;
        try {
            const res = await fetch(`/api/admin/messages/${id}`, {
                method: "DELETE"
            });
            if (res.ok) {
                setMessages(prev => prev.filter(m => m.id !== id));
                toast.success("Message supprimé");
                router.refresh();
            }
        } catch (error) {
            toast.error("Erreur serveur");
        }
    }

    return (
        <div className="divide-y divide-slate-100">
            {messages.length === 0 ? (
                <p className="p-8 text-center text-slate-500">Aucun message pour le moment.</p>
            ) : (
                messages.map((msg) => (
                    <div key={msg.id} className={`p-4 flex gap-4 items-start transition-colors ${msg.status === 'UNREAD' ? 'bg-white' : 'bg-slate-50/50'}`}>
                        <div className="flex-1">
                            <p className="font-bold text-slate-900">{msg.name}</p>
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                                <Mail size={12} /> {msg.email}
                            </div>
                            <p className="text-sm text-slate-700 mt-2 bg-slate-50 p-3 rounded-lg border">{msg.message}</p>
                        </div>
                        <div className="w-1/4">
                            <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-1 rounded-md border border-blue-100">
                                {msg.subject}
                            </span>
                        </div>
                        <div className="w-32 flex justify-center">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${msg.status === 'UNREAD' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                {msg.status === 'UNREAD' ? 'Non lu' : 'Lu'}
                            </span>
                        </div>
                        <div className="w-32 text-right text-xs text-slate-500 flex flex-col items-end gap-2">
                            <span>{new Date(msg.createdAt).toLocaleDateString('fr-FR')}</span>
                            <div className="flex items-center gap-1 mt-auto">
                                {msg.status === 'UNREAD' && (
                                    <button onClick={() => markAsRead(msg.id)} title="Marquer comme lu" className="p-1.5 rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                                        <CheckCircle2 size={14} />
                                    </button>
                                )}
                                <a href={`mailto:${msg.email}?subject=RE: ${msg.subject}`} title="Répondre" className="p-1.5 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors">
                                    <Mail size={14} />
                                </a>
                                <button onClick={() => deleteMessage(msg.id)} title="Supprimer" className="p-1.5 rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

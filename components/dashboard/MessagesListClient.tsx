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
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
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
                setSelectedIds(prev => prev.filter(i => i !== id));
                toast.success("Message supprimé");
                router.refresh();
            }
        } catch (error) {
            toast.error("Erreur serveur");
        }
    }

    const deleteMultiple = async () => {
        if (!confirm(`Voulez-vous vraiment supprimer les ${selectedIds.length} messages sélectionnés ?`)) return;
        const toastId = toast.loading("Suppression multiple...");
        try {
            const res = await fetch("/api/admin/messages/bulk", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ids: selectedIds })
            });
            if (res.ok) {
                setMessages(prev => prev.filter(m => !selectedIds.includes(m.id)));
                setSelectedIds([]);
                toast.success("Messages supprimés", { id: toastId });
                router.refresh();
            } else {
                toast.error("Erreur lors de la suppression multiple", { id: toastId });
            }
        } catch (error) {
            toast.error("Erreur serveur", { id: toastId });
        }
    }

    const toggleSelectAll = () => {
        if (selectedIds.length === messages.length && messages.length > 0) {
            setSelectedIds([]);
        } else {
            setSelectedIds(messages.map(m => m.id));
        }
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex flex-col">
            {selectedIds.length > 0 && (
                <div className="p-3 bg-red-50 border-b border-red-100 flex items-center justify-between">
                    <span className="text-sm font-medium text-red-700">{selectedIds.length} message(s) sélectionné(s)</span>
                    <button onClick={deleteMultiple} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                        <Trash2 size={14} /> Supprimer la sélection
                    </button>
                </div>
            )}
            
            <div className="p-4 border-b border-slate-100 flex gap-4 bg-slate-50/50 items-center">
                <div className="w-8 shrink-0 flex justify-center">
                    <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-slate-300 text-[#103178] focus:ring-[#103178]/20 cursor-pointer"
                        checked={messages.length > 0 && selectedIds.length === messages.length}
                        onChange={toggleSelectAll}
                    />
                </div>
                <span className="text-sm font-semibold flex-1">Expéditeur</span>
                <span className="text-sm font-semibold w-1/4">Sujet</span>
                <span className="text-sm font-semibold w-32 text-center">Statut</span>
                <span className="text-sm font-semibold w-32 text-right">Date</span>
            </div>

            <div className="divide-y divide-slate-100">
                {messages.length === 0 ? (
                    <p className="p-8 text-center text-slate-500">Aucun message pour le moment.</p>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className={`p-4 flex gap-4 items-start transition-colors ${msg.status === 'UNREAD' ? 'bg-white' : 'bg-slate-50/50'} ${selectedIds.includes(msg.id) ? 'bg-blue-50/30' : ''}`}>
                            <div className="w-8 shrink-0 flex justify-center mt-1">
                                <input 
                                    type="checkbox" 
                                    className="w-4 h-4 rounded border-slate-300 text-[#103178] focus:ring-[#103178]/20 cursor-pointer"
                                    checked={selectedIds.includes(msg.id)}
                                    onChange={() => toggleSelect(msg.id)}
                                />
                            </div>
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
        </div>
    );
}

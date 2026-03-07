"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Tag, ToggleLeft, ToggleRight, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Promo {
    id: string;
    code: string;
    discount: number;
    type: string;
    maxUses: number | null;
    uses: number;
    expiresAt: string | null;
    active: boolean;
    createdAt: string;
}

const INIT = { code: "", discount: 20, type: "percent", maxUses: "", expiresAt: "", active: true };

export default function AdminPromosPage() {
    const [promos, setPromos] = useState<Promo[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(INIT);
    const [creating, setCreating] = useState(false);

    const load = () => {
        fetch("/api/admin/promos").then(r => r.json()).then(d => { setPromos(d); setLoading(false); });
    };
    useEffect(() => { load(); }, []);

    const create = async () => {
        if (!form.code.trim() || !form.discount) { toast.error("Code et réduction requis"); return; }
        setCreating(true);
        const res = await fetch("/api/promo", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code: form.code.toUpperCase(),
                discount: Number(form.discount),
                type: form.type,
                maxUses: form.maxUses ? Number(form.maxUses) : null,
                expiresAt: form.expiresAt ? new Date(form.expiresAt) : null,
                active: form.active,
            }),
        });
        if (res.ok) { toast.success("Code créé !"); setForm(INIT); load(); }
        else toast.error("Erreur");
        setCreating(false);
    };

    const toggle = async (promo: Promo) => {
        await fetch("/api/promo", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: promo.id, active: !promo.active }),
        });
        load();
    };

    const remove = async (id: string) => {
        if (!confirm("Supprimer ce code promo ?")) return;
        await fetch("/api/admin/promos", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
        toast.success("Supprimé");
        load();
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Codes Promo</h1>
                <p className="text-sm text-slate-400 mt-0.5">{promos.length} code{promos.length !== 1 ? "s" : ""}</p>
            </div>

            {/* Formulaire création */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
                <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Tag size={16} /> Nouveau code</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Code *</label>
                        <input value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                            placeholder="VITALUXE20" className="w-full h-9 px-3 rounded-xl border border-slate-200 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Réduction *</label>
                        <div className="flex gap-1">
                            <input type="number" value={form.discount} onChange={e => setForm(p => ({ ...p, discount: Number(e.target.value) }))}
                                className="w-full h-9 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20" />
                            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}
                                className="h-9 px-2 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none">
                                <option value="percent">%</option>
                                <option value="fixed">MAD</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Utilisations max</label>
                        <input type="number" value={form.maxUses} onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))}
                            placeholder="Illimité" className="w-full h-9 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20" />
                    </div>
                    <div>
                        <label className="text-xs font-medium text-slate-500 block mb-1">Expiration</label>
                        <input type="date" value={form.expiresAt} onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))}
                            className="w-full h-9 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/20" />
                    </div>
                </div>
                <button onClick={create} disabled={creating}
                    className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#2d6a4f] text-white rounded-xl text-sm font-semibold hover:bg-[#245c43] transition-colors disabled:opacity-60">
                    {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />} Créer le code
                </button>
            </div>

            {/* Liste */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wide">
                            <th className="px-5 py-3">Code</th>
                            <th className="px-5 py-3">Réduction</th>
                            <th className="px-5 py-3">Utilisations</th>
                            <th className="px-5 py-3">Expiration</th>
                            <th className="px-5 py-3">Statut</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="py-12 text-center"><Loader2 className="animate-spin h-5 w-5 mx-auto text-slate-400" /></td></tr>
                        ) : promos.length === 0 ? (
                            <tr><td colSpan={6} className="py-12 text-center text-slate-400 text-sm">Aucun code promo.</td></tr>
                        ) : promos.map(p => (
                            <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-5 py-3.5">
                                    <span className="font-mono font-bold text-sm bg-slate-100 px-2.5 py-1 rounded-lg">{p.code}</span>
                                </td>
                                <td className="px-5 py-3.5 font-semibold text-sm">
                                    <span className="text-emerald-700">{p.discount}{p.type === "percent" ? "%" : " MAD"}</span>
                                </td>
                                <td className="px-5 py-3.5 text-sm text-slate-600">
                                    {p.uses}{p.maxUses ? ` / ${p.maxUses}` : " / ∞"}
                                </td>
                                <td className="px-5 py-3.5 text-sm text-slate-400">
                                    {p.expiresAt ? new Date(p.expiresAt).toLocaleDateString("fr-FR") : "—"}
                                </td>
                                <td className="px-5 py-3.5">
                                    <button onClick={() => toggle(p)} className="flex items-center gap-1.5 text-sm">
                                        {p.active
                                            ? <><ToggleRight size={20} className="text-emerald-500" /><span className="text-emerald-600 font-semibold">Actif</span></>
                                            : <><ToggleLeft size={20} className="text-slate-400" /><span className="text-slate-400">Inactif</span></>}
                                    </button>
                                </td>
                                <td className="px-5 py-3.5 text-right">
                                    <button onClick={() => remove(p.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
                                        <Trash2 size={15} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

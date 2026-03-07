"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Edit2, Check, X } from "lucide-react";

interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    _count: { products: number };
}

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newName, setNewName] = useState("");
    const [editId, setEditId] = useState<string | null>(null);
    const [editName, setEditName] = useState("");

    const load = () =>
        fetch("/api/categories").then((r) => r.json()).then(setCategories);

    useEffect(() => { load(); }, []);

    const create = async () => {
        if (!newName.trim()) return;
        await fetch("/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName }),
        });
        setNewName("");
        load();
    };

    const remove = async (id: string) => {
        if (!confirm("Supprimer cette catégorie ?")) return;
        await fetch(`/api/categories/${id}`, { method: "DELETE" });
        load();
    };

    const update = async (id: string) => {
        await fetch(`/api/categories/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: editName }),
        });
        setEditId(null);
        load();
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Catégories</h1>

            {/* Formulaire d'ajout */}
            <div className="flex gap-3">
                <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && create()}
                    placeholder="Nouvelle catégorie..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                    onClick={create}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                >
                    <Plus size={18} /> Ajouter
                </button>
            </div>

            {/* Liste */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm font-medium h-12">
                            <th className="px-6 py-3">Nom</th>
                            <th className="px-6 py-3">Slug</th>
                            <th className="px-6 py-3">Produits</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    {editId === cat.id ? (
                                        <input
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            className="px-2 py-1 border border-blue-400 rounded text-sm w-full"
                                            autoFocus
                                        />
                                    ) : (
                                        <span className="font-medium text-slate-900">{cat.name}</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-slate-500 text-sm">{cat.slug}</td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                        {cat._count.products}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        {editId === cat.id ? (
                                            <>
                                                <button onClick={() => update(cat.id)} className="text-green-600 hover:text-green-800 transition-colors">
                                                    <Check size={18} />
                                                </button>
                                                <button onClick={() => setEditId(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                                    <X size={18} />
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => { setEditId(cat.id); setEditName(cat.name); }} className="text-slate-400 hover:text-blue-600 transition-colors">
                                                    <Edit2 size={18} />
                                                </button>
                                                <button onClick={() => remove(cat.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                                                    <Trash2 size={18} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={4} className="py-10 text-center text-slate-400 text-sm">Aucune catégorie.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Package, ImagePlus, X, Tag, BarChart2, Layers,
    DollarSign, ArrowLeft, Save, Star, AlertCircle
} from "lucide-react";

export default function NewProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
    const [brands, setBrands] = useState<{ id: string; name: string }[]>([]);
    const [images, setImages] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        Promise.all([
            fetch("/api/categories").then(r => r.json()),
            fetch("/api/admin/brands").then(r => r.json()),
        ]).then(([cats, brs]) => {
            setCategories(Array.isArray(cats) ? cats : []);
            setBrands(Array.isArray(brs) ? brs : []);
        });
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => setImages(prev => [...prev, reader.result as string]);
            reader.readAsDataURL(file);
        });
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setError("");
        const fd = new FormData(e.currentTarget);
        const data = {
            name: fd.get("name"),
            description: fd.get("description"),
            price: Number(fd.get("price")),
            salePrice: fd.get("salePrice") ? Number(fd.get("salePrice")) : null,
            stock: Number(fd.get("stock")),
            categoryId: fd.get("categoryId"),
            brand: fd.get("brand"),
            images,
        };

        const res = await fetch("/api/products", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        setLoading(false);
        if (res.ok) {
            router.push("/admin/products");
            router.refresh();
        } else {
            const d = await res.json().catch(() => ({}));
            setError(d.error || "Erreur lors de la création du produit.");
        }
    }

    const inputCls = "w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2d6a4f]/40 focus:border-[#2d6a4f] transition";
    const labelCls = "block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5";

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            {/* Header */}
            <div className="mb-6 flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition"
                >
                    <ArrowLeft size={16} /> Retour
                </button>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2d6a4f] flex items-center justify-center shadow">
                        <Package size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 leading-tight">Nouveau Produit</h1>
                        <p className="text-xs text-slate-400">Remplissez les informations ci-dessous</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Error */}
                {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* LEFT — main info */}
                    <div className="xl:col-span-2 space-y-6">

                        {/* Identité */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <Tag size={16} className="text-[#2d6a4f]" />
                                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Identité</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className={labelCls}>Nom du produit *</label>
                                    <input type="text" id="name" name="name" required placeholder="ex: Crème hydratante visage" className={inputCls} />
                                </div>
                                <div>
                                    <label htmlFor="description" className={labelCls}>Description *</label>
                                    <textarea
                                        id="description" name="description" rows={6} required
                                        placeholder="Décrivez le produit en détail : composition, bénéfices, mode d'emploi..."
                                        className={inputCls + " resize-none"}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Images */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <ImagePlus size={16} className="text-[#2d6a4f]" />
                                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Images</h2>
                            </div>

                            <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-[#2d6a4f] hover:bg-[#2d6a4f]/5 transition">
                                <ImagePlus size={28} className="text-slate-300 mb-2" />
                                <span className="text-sm text-slate-400">Cliquez pour ajouter des images</span>
                                <span className="text-xs text-slate-300 mt-1">PNG, JPG, WEBP — plusieurs fichiers acceptés</span>
                                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                            </label>

                            {images.length > 0 && (
                                <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-4">
                                    {images.map((img, i) => (
                                        <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                                            <img src={img} alt={`img-${i}`} className="object-cover w-full h-full" />
                                            {i === 0 && (
                                                <div className="absolute top-1 left-1 bg-[#2d6a4f] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                                                    <Star size={8} /> Principale
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setImages(prev => prev.filter((_, j) => j !== i))}
                                                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* RIGHT — prix, stock, catégorie */}
                    <div className="space-y-6">

                        {/* Prix */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <DollarSign size={16} className="text-[#2d6a4f]" />
                                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Prix</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="price" className={labelCls}>Prix normal (MAD) *</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">MAD</span>
                                        <input type="number" id="price" name="price" step="0.01" min="0" required placeholder="0.00" className={inputCls + " pl-12"} />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="salePrice" className={labelCls}>Prix soldé (MAD)</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">MAD</span>
                                        <input type="number" id="salePrice" name="salePrice" step="0.01" min="0" placeholder="Optionnel" className={inputCls + " pl-12"} />
                                    </div>
                                    <p className="text-[10px] text-slate-400 mt-1">Laissez vide si aucune promotion</p>
                                </div>
                            </div>
                        </section>

                        {/* Stock */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <BarChart2 size={16} className="text-[#2d6a4f]" />
                                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Stock</h2>
                            </div>
                            <div>
                                <label htmlFor="stock" className={labelCls}>Quantité en stock *</label>
                                <input type="number" id="stock" name="stock" min="0" required placeholder="0" className={inputCls} />
                            </div>
                        </section>

                        {/* Classification */}
                        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <Layers size={16} className="text-[#2d6a4f]" />
                                <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Classification</h2>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="categoryId" className={labelCls}>Catégorie *</label>
                                    <select id="categoryId" name="categoryId" required className={inputCls + " bg-white"}>
                                        <option value="">Sélectionnez...</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="brand" className={labelCls}>Marque</label>
                                    <select id="brand" name="brand" className={inputCls + " bg-white"}>
                                        <option value="">Aucune marque</option>
                                        {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
                                    </select>
                                </div>
                            </div>
                        </section>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 bg-[#2d6a4f] hover:bg-[#245a42] disabled:opacity-60 text-white font-semibold py-3 px-6 rounded-xl transition shadow-md shadow-[#2d6a4f]/30"
                        >
                            <Save size={16} />
                            {loading ? "Enregistrement..." : "Enregistrer le produit"}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

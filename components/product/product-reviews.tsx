"use client";

import { useState, useEffect } from "react";
import { Star, Send, Loader2, Camera, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    images?: string[] | null;
    user: { name: string | null; image: string | null };
}

export function ProductReviews({ productId }: { productId: string }) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [hovered, setHovered] = useState(0);
    const [comment, setComment] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const [submitting, setSubmitting] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setImages(prev => [...prev, base64String].slice(0, 3)); // Max 3 images
            };
            reader.readAsDataURL(file);
        });
    };

    const load = () => {
        fetch(`/api/reviews/${productId}`)
            .then(r => r.json())
            .then(data => { setReviews(Array.isArray(data) ? data : []); setLoading(false); });
    };

    useEffect(() => { load(); }, [productId]);

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : "0.0";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session) { toast.error("Connectez-vous pour laisser un avis."); return; }
        if (!rating) { toast.error("Choisissez une note."); return; }
        if (!comment.trim()) { toast.error("Écrivez un commentaire."); return; }

        setSubmitting(true);
        const res = await fetch(`/api/reviews`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, rating, comment, images }),
        });

        if (res.ok) {
            toast.success("Avis publié et en attente d'approbation !");
            setRating(0); setComment(""); setImages([]);
            load();
        } else {
            const errorData = await res.json();
            toast.error(errorData.error || "Erreur lors de la publication.");
        }
        setSubmitting(false);
    };

    return (
        <section className="mt-16 border-t border-slate-200 pt-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-10">Avis clients</h2>

            {/* Formulaire */}
            <div className="bg-[#f8fafc] rounded-[2rem] border border-slate-100 p-8 md:p-12 mb-12 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Laisser un avis</h3>
                {!session ? (
                    <p className="text-sm text-slate-500">
                        <a href="/auth/login" className="text-[#103178] font-semibold hover:underline">Connectez-vous</a> pour laisser un avis et partager votre expérience.
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-3 tracking-wide">Votre note</p>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button key={s} type="button"
                                        onMouseEnter={() => setHovered(s)}
                                        onMouseLeave={() => setHovered(0)}
                                        onClick={() => setRating(s)}
                                        className="transition-all hover:scale-110">
                                        <Star
                                            size={32}
                                            strokeWidth={1.5}
                                            className={`transition-colors ${(hovered || rating) >= s ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <textarea
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                                rows={4}
                                placeholder="Partagez votre expérience avec ce produit..."
                                className="w-full px-5 py-4 rounded-2xl border border-slate-200 text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-[#103178]/5 bg-white transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {/* Images Upload */}
                        <div>
                            <div className="flex items-center gap-4 mb-3">
                                <label className="cursor-pointer flex items-center gap-2 text-sm font-semibold text-[#103178] hover:bg-[#103178]/5 px-4 py-2 rounded-lg transition-colors border border-[#103178]/20 bg-white">
                                    <Camera size={18} />
                                    <span>Ajouter des photos ({images.length}/3)</span>
                                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" disabled={images.length >= 3} />
                                </label>
                            </div>
                            {images.length > 0 && (
                                <div className="flex gap-3 mt-3 flex-wrap">
                                    {images.map((img, idx) => (
                                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border shadow-sm">
                                            <img 
                                                src={img} 
                                                alt={`Avis ${idx}`} 
                                                className="w-full h-full object-cover" 
                                            />
                                            <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}
                                                className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black transition-colors">
                                                <X size={12} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="submit" disabled={submitting}
                            className="flex items-center gap-3 px-8 py-3.5 bg-[#103178] text-white text-sm font-bold rounded-2xl hover:bg-[#0d266b] transition-all disabled:opacity-60 shadow-lg shadow-[#103178]/20 hover:shadow-xl hover:-translate-y-0.5">
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                            Publier mon avis
                        </button>
                    </form>
                )}
            </div>

            {/* Liste avis */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2].map(i => <div key={i} className="h-32 rounded-3xl bg-slate-100 animate-pulse" />)}
                </div>
            ) : reviews.length === 0 ? (
                <div className="py-20 text-center">
                    <p className="text-slate-400 text-sm font-medium">Aucun avis pour l&apos;instant. Soyez le premier !</p>
                </div>
            ) : (
                <AnimatePresence>
                    <div className="space-y-6">
                        {/* Summary Header if reviews exist */}
                        <div className="flex items-center gap-6 mb-10 pb-8 border-b border-slate-100">
                            <span className="text-5xl font-black text-[#103178]">{avgRating}</span>
                            <div>
                                <div className="flex mb-1">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={20} className={parseFloat(avgRating) >= s ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                                    ))}
                                </div>
                                <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{reviews.length} avis clients</span>
                            </div>
                        </div>
                        {reviews.map((r, i) => (
                            <motion.div key={r.id}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-[#103178] flex items-center justify-center text-white text-xs font-bold shrink-0">
                                            {r.user.name?.[0]?.toUpperCase() ?? "?"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-slate-800">{r.user.name ?? "Client"}</p>
                                            <p className="text-xs text-slate-400">
                                                {new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-0.5">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <Star key={s} size={13} className={r.rating >= s ? "fill-yellow-400 text-yellow-400" : "text-slate-200"} />
                                        ))}
                                    </div>
                                </div>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">{r.comment}</p>
                                {r.images && Array.isArray(r.images) && r.images.length > 0 && (
                                    <div className="flex gap-2 flex-wrap">
                                        {r.images.map((img, idx) => (
                                            <a key={idx} href={img} target="_blank" rel="noreferrer" className="block w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:opacity-90 transition-opacity">
                                                <img 
                                                    src={img} 
                                                    alt={`Avis Photo ${idx}`} 
                                                    className="w-full h-full object-cover" 
                                                />
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </AnimatePresence>
            )}
        </section>
    );
}

"use client";

import { useState } from "react";
import { Upload, FileImage, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function OrdonnancePage() {
    const [file, setFile] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string>("");
    const [step, setStep] = useState<"upload" | "preview" | "sent">("upload");
    const [loading, setLoading] = useState(false);
    const [nom, setNom] = useState("");
    const [telephone, setTelephone] = useState("");
    const [note, setNote] = useState("");

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;
        setFileName(f.name);
        const reader = new FileReader();
        reader.onloadend = () => {
            setFile(reader.result as string);
            setStep("preview");
        };
        reader.readAsDataURL(f);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        setLoading(true);
        try {
            const res = await fetch("/api/ordonnance", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: nom, phone: telephone, note, image: file }),
            });
            if (res.ok) {
                setStep("sent");
            } else {
                alert("Erreur lors de l'envoi. Veuillez réessayer.");
            }
        } catch {
            alert("Erreur réseau.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-slate-50 py-16 px-4">
            <div className="max-w-2xl mx-auto">

                {/* Header */}
                <div className="text-center mb-10">
                    <span className="inline-block bg-blue-100 text-[#103178] text-xs font-semibold px-4 py-1 rounded-full mb-3 tracking-widest uppercase">
                        Service ordonnance
                    </span>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-3">
                        Envoyez votre ordonnance
                    </h1>
                    <p className="text-slate-500 text-base">
                        Envoyez une photo de votre ordonnance et notre pharmacien vous prépare votre commande sous 24h.
                    </p>
                </div>

                {/* Étapes */}
                <div className="flex justify-center gap-8 mb-10">
                    {["Télécharger", "Confirmer", "Expédier"].map((s, i) => (
                        <div key={s} className="flex flex-col items-center gap-1">
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${i === 0 && step === "upload" ? "bg-[#103178] text-white" :
                                i === 1 && step === "preview" ? "bg-[#103178] text-white" :
                                    i === 2 && step === "sent" ? "bg-green-500 text-white" :
                                        "bg-slate-200 text-slate-400"
                                }`}>{i + 1}</div>
                            <span className="text-xs text-slate-500">{s}</span>
                        </div>
                    ))}
                </div>

                {/* ÉTAPE 1 : Upload */}
                {step === "upload" && (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-[#103178]/40 rounded-3xl bg-white py-20 px-10 cursor-pointer hover:bg-blue-50 transition-colors text-center">
                        <Upload className="text-[#103178] mb-4" size={48} />
                        <p className="text-slate-700 font-semibold text-lg mb-1">Glissez ou cliquez pour télécharger</p>
                        <p className="text-slate-400 text-sm">JPG, PNG, PDF — max 10 Mo</p>
                        <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleFile} />
                    </label>
                )}

                {/* ÉTAPE 2 : Preview + formulaire */}
                {step === "preview" && file && (
                    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 space-y-6">
                        <div className="flex items-center gap-3 bg-blue-50 rounded-xl px-4 py-3">
                            <FileImage className="text-[#103178]" size={24} />
                            <span className="text-slate-700 font-medium truncate">{fileName}</span>
                            <button type="button" onClick={() => setStep("upload")} className="ml-auto text-slate-400 hover:text-red-500 text-xs underline">
                                Changer
                            </button>
                        </div>

                        {/* Aperçu image */}
                        {file.startsWith("data:image") && (
                            <div className="rounded-xl overflow-hidden border border-slate-200">
                                <img 
                                    src={file} 
                                    alt="Aperçu de l'ordonnance" 
                                    className="w-full h-auto object-contain max-h-[400px]" 
                                />
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700">Nom complet</label>
                                <input
                                    required
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    placeholder="Ex : Mohamed Alami"
                                    className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#103178]/50"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Téléphone</label>
                                <input
                                    required
                                    value={telephone}
                                    onChange={(e) => setTelephone(e.target.value)}
                                    placeholder="Ex : 06 12 34 56 78"
                                    className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#103178]/50"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Note (optionnel)</label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Informations supplémentaires pour le pharmacien..."
                                    rows={3}
                                    className="mt-1 w-full px-4 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#103178]/50"
                                />
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex gap-3">
                            <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} />
                            <p className="text-xs text-amber-700">
                                Votre ordonnance est traitée par un pharmacien diplômé. Un conseiller vous contactera sous 24h pour confirmer votre commande.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#103178] hover:bg-[#0d266b] text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
                        >
                            {loading ? <Loader2 size={20} className="animate-spin" /> : null}
                            {loading ? "Envoi en cours..." : "Envoyer mon ordonnance"}
                        </button>
                    </form>
                )}

                {/* ÉTAPE 3 : Succès */}
                {step === "sent" && (
                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-12 text-center space-y-4">
                        <CheckCircle className="text-green-500 mx-auto" size={64} />
                        <h2 className="text-2xl font-bold text-slate-900">Ordonnance envoyée !</h2>
                        <p className="text-slate-500">
                            Merci <strong>{nom}</strong>. Notre pharmacien va analyser votre ordonnance et vous contactera au <strong>{telephone}</strong> sous 24h.
                        </p>
                        <a
                            href="/"
                            className="inline-block mt-4 bg-[#103178] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#0d266b] transition-colors"
                        >
                            Retour à l&apos;accueil
                        </a>
                    </div>
                )}
            </div>
        </main>
    );
}

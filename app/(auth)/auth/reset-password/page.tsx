"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ResetForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") ?? "";

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState("");

    const passwordStrength = (pwd: string) => {
        let s = 0;
        if (pwd.length >= 8) s++;
        if (/[A-Z]/.test(pwd)) s++;
        if (/[0-9]/.test(pwd)) s++;
        if (/[^A-Za-z0-9]/.test(pwd)) s++;
        return s;
    };
    const strength = passwordStrength(password);
    const strengthColor = ["bg-destructive", "bg-orange-400", "bg-yellow-400", "bg-emerald-400", "bg-emerald-600"];
    const strengthLabel = ["Trop faible", "Faible", "Moyen", "Fort", "Très fort"];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 8) { setError("Minimum 8 caractères"); return; }
        if (password !== confirm) { setError("Les mots de passe ne correspondent pas"); return; }
        if (!token) { setError("Token invalide"); return; }

        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setDone(true);
            setTimeout(() => router.push("/auth/login"), 3000);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div className="text-center space-y-4">
                <p className="text-destructive font-semibold">Lien invalide ou expiré.</p>
                <Link href="/auth/forgot-password">
                    <Button variant="outline">Demander un nouveau lien</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-card rounded-2xl border shadow-lg p-8">
            {done ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h1 className="text-xl font-bold">Mot de passe réinitialisé !</h1>
                    <p className="text-sm text-muted-foreground">Vous allez être redirigé vers la connexion...</p>
                </motion.div>
            ) : (
                <>
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold">Nouveau mot de passe</h1>
                        <p className="text-sm text-muted-foreground mt-1">Choisissez un mot de passe sécurisé.</p>
                    </div>

                    {error && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="mb-4 flex items-center gap-3 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm">
                            <AlertCircle className="h-4 w-4 shrink-0" />{error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-password">Nouveau mot de passe</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="new-password" type={showPwd ? "text" : "password"} placeholder="••••••••"
                                    value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 pr-10" />
                                <button type="button" onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                                    {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {password && (
                                <div className="space-y-1">
                                    <div className="flex gap-1">
                                        {Array.from({ length: 4 }).map((_, i) => (
                                            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColor[strength] : "bg-muted"}`} />
                                        ))}
                                    </div>
                                    <p className={`text-xs font-medium ${strength < 2 ? "text-destructive" : strength < 3 ? "text-yellow-600" : "text-emerald-600"}`}>
                                        {strengthLabel[strength]}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input id="confirm-password" type={showPwd ? "text" : "password"} placeholder="••••••••"
                                    value={confirm} onChange={(e) => setConfirm(e.target.value)} className="pl-9" />
                                {confirm && password === confirm && (
                                    <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
                                )}
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 gap-2 shadow-md shadow-primary/20"
                            disabled={loading} id="reset-pwd-submit">
                            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Réinitialisation...</> : "Réinitialiser le mot de passe"}
                        </Button>
                    </form>
                </>
            )}
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
                <div className="text-center mb-8 flex flex-col items-center">
                    <Link href="/" className="inline-block">
                        <Image src="/VITALUXE.png" alt="Vitaluxe Logo" width={180} height={50} className="h-12 w-auto object-contain" priority />
                    </Link>
                </div>
                <Suspense fallback={<div className="py-10 flex justify-center"><Loader2 className="animate-spin h-6 w-6" /></div>}>
                    <ResetForm />
                </Suspense>
            </motion.div>
        </div>
    );
}

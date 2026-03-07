"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
    const router = useRouter();
    const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [errors, setErrors] = useState<Partial<typeof form>>({});

    const update = (k: keyof typeof form, v: string) => {
        setForm((p) => ({ ...p, [k]: v }));
        setErrors((p) => ({ ...p, [k]: undefined }));
    };

    const passwordStrength = (pwd: string) => {
        let score = 0;
        if (pwd.length >= 8) score++;
        if (/[A-Z]/.test(pwd)) score++;
        if (/[0-9]/.test(pwd)) score++;
        if (/[^A-Za-z0-9]/.test(pwd)) score++;
        return score;
    };

    const strength = passwordStrength(form.password);
    const strengthLabel = ["Trop faible", "Faible", "Moyen", "Fort", "Très fort"];
    const strengthColor = [
        "bg-destructive",
        "bg-orange-400",
        "bg-yellow-400",
        "bg-emerald-400",
        "bg-emerald-600",
    ];

    const validate = (): boolean => {
        const e: Partial<typeof form> = {};
        if (!form.name.trim()) e.name = "Nom complet requis";
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Email invalide";
        if (form.password.length < 8) e.password = "Minimum 8 caractères";
        if (form.password !== form.confirm) e.confirm = "Les mots de passe ne correspondent pas";
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.error ?? "Une erreur est survenue.");
                return;
            }

            router.push("/auth/login?registered=true");
        } catch {
            setError("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
        >
            {/* Logo */}
            <div className="text-center mb-8 flex flex-col items-center">
                <Link href="/" className="inline-block">
                    <Image src="/VITALUXE.png" alt="Vitaluxe Logo" width={180} height={50} className="h-12 w-auto object-contain" priority />
                </Link>
                <h1 className="text-2xl font-bold mt-4">Créer un compte</h1>
                <p className="text-muted-foreground text-sm mt-1">Rejoignez la communauté Vitaluxe</p>
            </div>

            {error && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-4 flex items-center gap-3 rounded-xl bg-destructive/10 border border-destructive/20 p-4 text-destructive text-sm"
                >
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    {error}
                </motion.div>
            )}

            <div className="bg-card rounded-2xl border shadow-lg p-8 space-y-5">
                {/* Google */}
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 gap-3"
                    onClick={() => signIn("google", { callbackUrl: "/" })}
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    S&apos;inscrire avec Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Ou par email</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="reg-name">Nom complet *</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="reg-name"
                                placeholder="Mohamed Alami"
                                value={form.name}
                                onChange={(e) => update("name", e.target.value)}
                                className={`pl-9 ${errors.name ? "border-destructive" : ""}`}
                            />
                        </div>
                        {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="reg-email">Adresse email *</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="reg-email"
                                type="email"
                                placeholder="exemple@email.com"
                                value={form.email}
                                onChange={(e) => update("email", e.target.value)}
                                className={`pl-9 ${errors.email ? "border-destructive" : ""}`}
                            />
                        </div>
                        {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <Label htmlFor="reg-password">Mot de passe *</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="reg-password"
                                type={showPwd ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => update("password", e.target.value)}
                                className={`pl-9 pr-10 ${errors.password ? "border-destructive" : ""}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(!showPwd)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                            >
                                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {/* Strength bar */}
                        {form.password && (
                            <div className="space-y-1">
                                <div className="flex gap-1">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColor[strength] : "bg-muted"}`}
                                        />
                                    ))}
                                </div>
                                <p className={`text-xs font-medium ${strength < 2 ? "text-destructive" : strength < 3 ? "text-yellow-600" : "text-emerald-600"}`}>
                                    {strengthLabel[strength]}
                                </p>
                            </div>
                        )}
                        {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                    </div>

                    {/* Confirm */}
                    <div className="space-y-2">
                        <Label htmlFor="reg-confirm">Confirmer le mot de passe *</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="reg-confirm"
                                type={showPwd ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.confirm}
                                onChange={(e) => update("confirm", e.target.value)}
                                className={`pl-9 ${errors.confirm ? "border-destructive" : ""}`}
                            />
                            {form.confirm && form.password === form.confirm && (
                                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-emerald-500" />
                            )}
                        </div>
                        {errors.confirm && <p className="text-xs text-destructive">{errors.confirm}</p>}
                    </div>

                    <div className="pt-1">
                        <Button
                            type="submit"
                            className="w-full h-11 gap-2 shadow-md shadow-primary/20"
                            disabled={loading}
                            id="register-submit-btn"
                        >
                            {loading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Création du compte...</>
                            ) : (
                                "Créer mon compte"
                            )}
                        </Button>
                    </div>

                    <p className="text-xs text-muted-foreground text-center">
                        En créant un compte, vous acceptez nos{" "}
                        <Link href="/cgv" className="text-primary hover:underline">CGV</Link> et notre{" "}
                        <Link href="/privacy" className="text-primary hover:underline">politique de confidentialité</Link>.
                    </p>
                </form>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
                Déjà un compte ?{" "}
                <Link href="/auth/login" className="text-primary font-semibold hover:underline">
                    Se connecter
                </Link>
            </p>
        </motion.div>
    );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") ?? "/";
    const registered = searchParams.get("registered");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        setLoading(false);

        if (result?.error) {
            setError("Email ou mot de passe incorrect. Veuillez réessayer.");
        } else {
            router.push(callbackUrl);
            router.refresh();
        }
    };

    const handleGoogleSignIn = () => {
        signIn("google", { callbackUrl });
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
                <h1 className="text-2xl font-bold mt-4">Bienvenue !</h1>
                <p className="text-muted-foreground text-sm mt-1">Connectez-vous à votre compte</p>
            </div>

            {/* Success banner (after registration) */}
            {registered && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mb-4 flex items-center gap-3 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-700 text-sm"
                >
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    Compte créé avec succès ! Vous pouvez maintenant vous connecter.
                </motion.div>
            )}

            {/* Error banner */}
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

            {/* Card */}
            <div className="bg-card rounded-2xl border shadow-lg p-8 space-y-5">
                {/* Google Sign-in */}
                <Button
                    type="button"
                    variant="outline"
                    className="w-full h-11 gap-3"
                    onClick={handleGoogleSignIn}
                >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Continuer avec Google
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
                    <div className="space-y-2">
                        <Label htmlFor="email">Adresse email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="email"
                                type="email"
                                placeholder="exemple@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="pl-9"
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Mot de passe</Label>
                            <Link href="/auth/reset-password" className="text-xs text-primary hover:underline">
                                Mot de passe oublié ?
                            </Link>
                        </div>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type={showPwd ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="pl-9 pr-10"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPwd(!showPwd)}
                                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showPwd ? "Masquer" : "Afficher"}
                            >
                                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-1">
                        <Button
                            type="submit"
                            className="w-full h-11 gap-2 shadow-md shadow-primary/20"
                            disabled={loading}
                            id="login-submit-btn"
                        >
                            {loading ? (
                                <><Loader2 className="h-4 w-4 animate-spin" /> Connexion...</>
                            ) : (
                                "Se connecter"
                            )}
                        </Button>
                    </div>

                </form>
            </div>

            <p className="text-center text-sm text-muted-foreground mt-6">
                Pas encore de compte ?{" "}
                <Link href="/auth/register" className="text-primary font-semibold hover:underline">
                    Créer un compte
                </Link>
            </p>
        </motion.div>
    );
}

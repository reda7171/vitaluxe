"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
            setError("Email invalide");
            return;
        }
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setSuccess(true);
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : "Erreur serveur");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20 px-4">
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
                </div>

                <div className="bg-card rounded-2xl border shadow-lg p-8">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-4"
                        >
                            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                            </div>
                            <h1 className="text-xl font-bold">Email envoyé !</h1>
                            <p className="text-sm text-muted-foreground">
                                Si un compte est associé à cet email, vous recevrez un lien de réinitialisation d'ici quelques instants.
                            </p>
                            <Link href="/auth/login">
                                <Button variant="outline" className="w-full gap-2 mt-2">
                                    <ArrowLeft className="h-4 w-4" /> Retour à la connexion
                                </Button>
                            </Link>
                        </motion.div>
                    ) : (
                        <>
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold">Mot de passe oublié ?</h1>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Entrez votre adresse email pour recevoir un lien de réinitialisation.
                                </p>
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

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="forgot-email">Adresse email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="forgot-email"
                                            type="email"
                                            placeholder="exemple@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full h-11 gap-2 shadow-md shadow-primary/20"
                                    disabled={loading}
                                    id="forgot-pwd-submit"
                                >
                                    {loading ? (
                                        <><Loader2 className="h-4 w-4 animate-spin" /> Envoi en cours...</>
                                    ) : (
                                        "Envoyer le lien de réinitialisation"
                                    )}
                                </Button>

                                <Link href="/auth/login">
                                    <Button variant="ghost" className="w-full gap-2 text-muted-foreground" type="button">
                                        <ArrowLeft className="h-4 w-4" /> Retour à la connexion
                                    </Button>
                                </Link>
                            </form>
                        </>
                    )}
                </div>
            </motion.div>
        </div>
    );
}

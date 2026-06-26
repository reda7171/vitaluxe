"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AccountSidebar } from "./account-sidebar";
import { motion } from "framer-motion";

export function AccountLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/auth/login?callbackUrl=/account");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-sm">Chargement de votre espace...</p>
                </div>
            </div>
        );
    }

    if (!session) return null;

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Page header */}
            <div className="border-b bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <p className="text-sm text-muted-foreground mb-1">
                        Bonjour, <span className="font-semibold text-foreground">{session.user?.name?.split(" ")[0]}</span> 👋
                    </p>
                    <h1 className="text-2xl font-extrabold tracking-tight">Mon espace client</h1>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <AccountSidebar />
                    <motion.main
                        key={typeof window !== "undefined" ? window.location.pathname : ""}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="flex-1 min-w-0"
                    >
                        {children}
                    </motion.main>
                </div>
            </div>
        </div>
    );
}

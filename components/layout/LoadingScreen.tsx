"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export function LoadingScreen() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time or wait for window load
        const handleLoad = () => {
            setTimeout(() => setLoading(false), 1000); // Minimum 1s display
        };

        if (document.readyState === "complete") {
            handleLoad();
        } else {
            window.addEventListener("load", handleLoad);
            return () => window.removeEventListener("load", handleLoad);
        }
    }, []);

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[99999] bg-white flex flex-col items-center justify-center"
                >
                    <div className="relative">
                        {/* Logo Animation */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                                duration: 1,
                                ease: "easeOut",
                                repeat: Infinity,
                                repeatType: "reverse"
                            }}
                            className="relative z-10"
                        >
                            <Image
                                src="/VITALUXE.png"
                                alt="Vitaluxe Logo"
                                width={250}
                                height={80}
                                priority
                                className="h-20 w-auto object-contain"
                            />
                        </motion.div>

                        {/* Premium Glow Effect */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.3, 0.6, 0.3],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute inset-0 bg-[#2d6a4f]/10 blur-3xl rounded-full -z-0"
                        />
                    </div>

                    {/* Progress Bar (Subtle) */}
                    <div className="mt-12 w-48 h-1 bg-slate-100 rounded-full overflow-hidden relative">
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-[#2d6a4f] to-transparent"
                        />
                    </div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-[#2d6a4f]/60"
                    >
                        Vitaluxe Excellence
                    </motion.p>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

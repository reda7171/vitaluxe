"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export function WhatsAppFloating() {
    const [showLabel, setShowLabel] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a short delay
        const timer = setTimeout(() => setIsVisible(true), 1500);
        // Periodic label hint
        const labelInterval = setInterval(() => {
            setShowLabel(true);
            setTimeout(() => setShowLabel(false), 5000);
        }, 15000);

        return () => {
            clearTimeout(timer);
            clearInterval(labelInterval);
        };
    }, []);

    const whatsappUrl = "https://wa.me/212666695486?text=Bonjour Vitaluxe, je souhaiterais avoir plus d'informations.";

    return (
        <AnimatePresence>
            {isVisible && (
                <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
                    {/* Pulsing Label Background */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{
                            opacity: showLabel ? 1 : 0,
                            scale: showLabel ? 1 : 0.8,
                            x: showLabel ? 0 : 20
                        }}
                        className="bg-white px-4 py-2 rounded-2xl shadow-xl border border-emerald-50 pointer-events-auto"
                    >
                        <p className="text-xs font-bold text-slate-800 flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                            Besoin d'aide ? Contactez-nous !
                        </p>
                    </motion.div>

                    {/* Floating Button */}
                    <motion.a
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, y: 20, scale: 0.5 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        className="w-16 h-16 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/40 pointer-events-auto relative group transition-transform duration-300"
                        aria-label="Contact WhatsApp"
                    >
                        {/* Status ring */}
                        <div className="absolute inset-0 rounded-full border-4 border-white/20 animate-pulse" />

                        <svg className="w-8 h-8 fill-current drop-shadow-md" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.417-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.305 1.652zm6.599-3.835c1.551.921 3.234 1.408 4.95 1.409 5.4 0 9.794-4.393 9.797-9.793.002-2.618-1.017-5.079-2.872-6.932-1.856-1.853-4.318-2.873-6.939-2.875-5.399 0-9.793 4.394-9.796 9.794-.001 1.73.461 3.418 1.336 4.915l-1.01 3.693 3.784-.992zm11.334-7.58c-.302-.151-1.783-.88-2.057-.98-.275-.1-.475-.151-.675.15s-.777.98-.95 1.18c-.175.2-.35.225-.651.075-.302-.15-1.274-.47-2.427-1.498-.897-.8-1.503-1.787-1.678-2.087-.176-.3-.02-.463.13-.613.135-.134.302-.35.452-.525.15-.175.2-.3.3-.5s.05-.375-.025-.525-.675-1.625-.925-2.225c-.244-.589-.491-.51-.675-.52l-.575-.01c-.2-.008-.525.067-.8.367-.276.3-1.05 1.025-1.05 2.5s1.075 2.9 1.225 3.1c.15.2 2.116 3.23 5.125 4.53.716.31 1.274.495 1.71.635.719.227 1.373.195 1.89.117.576-.088 1.783-.73 2.033-1.432.25-.703.25-1.305.175-1.433-.075-.125-.275-.2-.575-.35z" />
                        </svg>

                        {/* Notification dot */}
                        <div className="absolute top-1 right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full scale-0 group-hover:scale-100 transition-transform duration-300" />
                    </motion.a>
                </div>
            )}
        </AnimatePresence>
    );
}

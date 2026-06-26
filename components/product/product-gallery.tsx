"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ZoomIn } from "lucide-react";

type Props = {
    images: string[];
    name: string;
};

export function ProductGallery({ images, name }: Props) {
    const [selected, setSelected] = useState(0);

    return (
        <div className="flex flex-col gap-4">
            {/* Main image */}
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted/20 border group">
                <AnimatePresence mode="wait">
                    <motion.img
                        key={selected}
                        src={images[selected]}
                        alt={`${name} - image ${selected + 1}`}
                        className="w-full h-full object-cover"
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                </AnimatePresence>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                    <ZoomIn className="text-white h-8 w-8 drop-shadow" />
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setSelected(i)}
                            className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selected === i
                                    ? "border-primary shadow-md scale-105"
                                    : "border-transparent opacity-60 hover:opacity-100"
                                }`}
                            aria-label={`Image ${i + 1}`}
                        >
                            <img 
                                src={img} 
                                alt={`${name} thumbnail ${i + 1}`} 
                                className="w-full h-full object-cover" 
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

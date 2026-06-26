"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Instagram, Heart, ShoppingBag, ExternalLink } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";

interface InstaProduct {
  id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  salePrice?: number;
}

interface InstagramFeedProps {
  products: InstaProduct[];
}

function formatPrice(price: number) {
  return price.toFixed(0) + " MAD";
}

export function InstagramFeed({ products }: InstagramFeedProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  // Show first 9 products in a 3x3 grid
  const gridProducts = products.slice(0, 9);

  return (
    <section ref={sectionRef} className="relative py-4 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-pink-50 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-purple-50 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            {/* Instagram gradient icon */}
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
              }}
            >
              <Instagram size={20} className="text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Suivez-nous sur</p>
              <p className="text-lg font-black text-slate-900 leading-none">@vitaluxe.ma</p>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center leading-tight">
            Notre Galerie{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 bg-clip-text text-transparent">
                Beauté
              </span>
              <span className="absolute -bottom-1 left-0 w-full h-2 bg-gradient-to-r from-pink-200 to-purple-200 rounded-full opacity-60" />
            </span>
          </h2>
          <p className="text-slate-500 text-sm mt-3 max-w-md text-center">
            Découvrez nos produits en situation réelle. Cliquez sur une photo pour commander.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-3 max-w-4xl mx-auto">
          {gridProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="relative aspect-square overflow-hidden rounded-2xl group cursor-pointer shadow-sm"
              onMouseEnter={() => setHoveredId(product.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <Link href={`/product/${product.slug}`} className="block w-full h-full">
                {/* Image */}
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.jpg";
                  }}
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Top right badge */}
                <AnimatePresence>
                  {hoveredId === product.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-3 right-3 flex flex-col gap-2"
                    >
                      <button className="w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-rose-500 hover:text-white transition-colors group/heart">
                        <Heart size={16} className="text-rose-400 group-hover/heart:text-white" />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom info */}
                <AnimatePresence>
                  {hoveredId === product.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.25 }}
                      className="absolute bottom-0 left-0 right-0 p-3"
                    >
                      <p className="text-white text-xs font-bold leading-tight line-clamp-2 mb-2">
                        {product.name}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          {product.salePrice ? (
                            <>
                              <span className="text-white text-sm font-black">{formatPrice(product.salePrice)}</span>
                              <span className="text-white/60 text-xs line-through">{formatPrice(product.price)}</span>
                            </>
                          ) : (
                            <span className="text-white text-sm font-black">{formatPrice(product.price)}</span>
                          )}
                        </div>
                        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow">
                          <ShoppingBag size={13} className="text-slate-800" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Sale badge */}
                {product.salePrice && (
                  <div className="absolute top-3 left-3 bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">
                    -{Math.round(((product.price - product.salePrice) / product.price) * 100)}%
                  </div>
                )}
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a
            href="https://www.instagram.com/vitaluxe.ma"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)"
            }}
          >
            <Instagram size={18} />
            Nous suivre sur Instagram
            <ExternalLink size={14} className="opacity-70" />
          </a>

          <Link
            href="/shop"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-800 font-bold text-sm border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all hover:-translate-y-0.5"
          >
            <ShoppingBag size={18} />
            Voir tous les produits
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

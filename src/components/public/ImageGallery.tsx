"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ImageGallery({ mainImage, gallery, title }: { mainImage: string, gallery: any[], title: string }) {
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    useEffect(() => {
        if (selectedImg) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [selectedImg]);

    return (
        <div className="space-y-8">
            <div
                className="relative aspect-video rounded-3xl overflow-hidden shadow-lg bg-slate-200 cursor-zoom-in group"
                onClick={() => setSelectedImg(mainImage)}
            >
                <Image src={mainImage} alt={title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" priority sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px" unoptimized />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-[10px] md:text-xs font-black bg-black/40 px-4 py-2 rounded-full backdrop-blur-md uppercase tracking-widest">Klik untuk memperbesar</span>
                </div>
            </div>

            {gallery && gallery.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.map((g: any) => (
                        <div
                            key={g.id}
                            className="relative aspect-square rounded-2xl overflow-hidden shadow-md bg-slate-200 group cursor-zoom-in"
                            onClick={() => setSelectedImg(g.imageUrl)}
                        >
                            <Image
                                src={g.imageUrl}
                                alt={`Galeri ${title}`}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                sizes="(max-width: 768px) 50vw, 25vw"
                                unoptimized
                            />
                        </div>
                    ))}
                </div>
            )}

            <AnimatePresence>
                {selectedImg && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[99999] flex items-center justify-center backdrop-blur-2xl"
                        onClick={() => setSelectedImg(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full h-full max-h-[85vh] flex items-center justify-center p-4"
                        >
                            <div className="relative w-full h-full max-w-6xl flex items-center justify-center">
                                <Image
                                    src={selectedImg}
                                    alt={title}
                                    fill
                                    className="object-contain"
                                    quality={95}
                                    priority
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
                                    unoptimized
                                />


                                <div className="absolute inset-0 flex items-center justify-center opacity-[0.4] pointer-events-none select-none">
                                    <div className="relative w-32 h-32 md:w-48 md:h-48">
                                        <Image
                                            src="/PutraJaya_Logo.png"
                                            alt="Watermark Putra Jaya"
                                            fill
                                            className="object-contain grayscale-0 brightness-100"
                                            sizes="(max-width: 768px) 128px, 192px"

                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-[9px] font-black uppercase tracking-[0.4em] pointer-events-none">
                            Ketuk di mana saja untuk kembali
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Calendar, Building, ArrowRight } from "lucide-react";
import { useState, useMemo } from "react";

export default function ProyekClient({ portfolios }: { portfolios: any[] }) {
    const [activeCategory, setActiveCategory] = useState("Semua");

    const categories = useMemo(() => {
        const uniqueCategories = new Set(portfolios.map(item => item.category));
        return ["Semua", ...Array.from(uniqueCategories)];
    }, [portfolios]);

    const filteredPortfolios = useMemo(() => {
        if (activeCategory === "Semua") return portfolios;
        return portfolios.filter(item => item.category === activeCategory);
    }, [activeCategory, portfolios]);

    return (
        <main className="min-h-screen bg-slate-50">

            {/* === SECTION 1: HERO === */}
            <section className="bg-[#0B0C35] text-white pt-40 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#F49414] rounded-full blur-[120px] opacity-10 -mr-20 -mt-20 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-5xl font-black mb-6 tracking-tighter"
                        >
                            Portofolio <span className="text-[#F49414]">Proyek</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-white/80 leading-relaxed font-medium"
                        >
                            Bukti nyata dedikasi dan profesionalisme CV Putra Jaya. Jelajahi berbagai proyek konstruksi, coring, dan instalasi genset yang telah sukses kami selesaikan dengan standar kualitas tinggi.
                        </motion.p>
                    </div>
                </div>
            </section>

            <section className="py-20 -mt-10 relative z-20">
                <div className="container mx-auto px-6">

                    {portfolios.length > 0 && (
                        <div className="relative mb-12">

                            <div className="flex overflow-x-auto md:flex-wrap gap-3 pb-4 md:pb-0 justify-start md:justify-center lg:justify-start snap-x scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] w-full">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => setActiveCategory(category)}
                                        className={`shrink-0 whitespace-nowrap snap-start px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === category
                                            ? "bg-[#F49414] text-white shadow-lg shadow-[#F49414]/30"
                                            : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                                            }`}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>

                            <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none md:hidden"></div>
                        </div>
                    )}

                    {portfolios.length === 0 ? (
                        <div className="text-center bg-white p-10 rounded-2xl shadow-sm border border-slate-100 max-w-2xl mx-auto">
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum ada portofolio</h3>
                            <p className="text-slate-500">Data portofolio sedang dalam proses pembaruan oleh tim kami.</p>
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
                        >
                            <AnimatePresence>
                                {filteredPortfolios.map((project, index) => (
                                    <motion.div
                                        layout
                                        key={project.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="bg-white rounded-3xl shadow-lg shadow-slate-200/50 border border-slate-100 overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col"
                                    >
                                        <Link href={`/proyek/${project.slug}`} className="flex flex-col grow">
                                            {/* Bagian Gambar */}
                                            <div className="relative w-full aspect-video md:aspect-[4/3] overflow-hidden bg-slate-200">
                                                <Image
                                                    src={project.image}
                                                    alt={project.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                    priority={index < 6}
                                                    unoptimized
                                                />
                                                <div className="absolute top-4 left-4 bg-[#F49414] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                                                    {project.category}
                                                </div>
                                                <div className="absolute inset-0 bg-linear-to-t from-[#0B0C35]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            </div>

                                            {/* Bagian Detail Konten */}
                                            <div className="p-8 flex flex-col grow">
                                                <h3 className="text-xl font-black text-[#0B0C35] mb-4 leading-tight group-hover:text-[#277BBE] transition-colors">
                                                    {project.title}
                                                </h3>

                                                <div className="space-y-3 mb-6 mt-auto">
                                                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                                        <Building size={16} className="text-[#F49414]" />
                                                        <span>{project.client}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                                        <MapPin size={16} className="text-[#F49414]" />
                                                        <span>{project.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                                                        <Calendar size={16} className="text-[#F49414]" />
                                                        <span>Tahun {new Date(project.completionDate).getFullYear()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}
                </div>
            </section>

            {/* === SECTION 3: CTA TANYA PROYEK === */}
            <section className="py-16 bg-[#0B0C35] relative overflow-hidden border-t-4 border-[#F49414]">
                {/* <div className="absolute inset-0 opacity-5 bg-[url('/patterns/autocad.svg')] bg-cover mix-blend-overlay"></div> */}
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-3xl font-black text-white mb-6">Proyek Anda Selanjutnya?</h2>
                    <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">
                        Percayakan kebutuhan konstruksi dan operasional teknis Anda kepada tim berpengalaman kami. Mari diskusikan detailnya.
                    </p>
                    <a
                        href="/kontak"
                        className="inline-flex items-center gap-2 bg-white text-[#0B0C35] px-8 py-4 rounded-full font-black uppercase tracking-widest transition-all transform hover:scale-105 hover:bg-slate-100 shadow-xl"
                    >
                        Mulai Konsultasi <ArrowRight size={20} className="text-[#F49414]" />
                    </a>
                </div>
            </section>

        </main>
    );
}
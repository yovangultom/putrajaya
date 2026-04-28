"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, Clock } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0B0C35] pt-32 pb-16">

            <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-3">
                <div className="relative w-full h-full hidden md:block">
                    <Image
                        src="/images/hero-konstruksi.jpg"
                        alt="Konstruksi Umum"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
                <div className="relative w-full h-full ">
                    <Image
                        src="/images/hero-coring.jpg"
                        alt="Jasa Coring"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
                <div className="relative w-full h-full hidden md:block">
                    <Image
                        src="/images/hero-genset.jpg"
                        alt="Jasa Genset"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>
            </div>

            {/* === LAYER 2: OVERLAY WARNA GELAP (z-10) === */}
            <div className="absolute inset-0 z-10 bg-[#0B0C35]/20"></div>
            <div className="absolute inset-0 z-10  from-[#0B0C35]/80 via-[#0B0C35]/40 to-[#0B0C35]/90"></div>

            {/* === LAYER 3: KONTEN TEKS & KARTU (z-20) === */}
            <div className="container mx-auto px-6 relative z-20 pt-10 md:pt-20 flex flex-col justify-between min-h-[calc(100vh-8rem)]">

                {/* Kontainer Teks */}
                <div className="max-w-4xl mx-auto mb-16 flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center"
                    >
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter drop-shadow-lg max-w-4xl">
                            Solusi Teknik <span className="text-[#F49414] text-outline">Terpercaya</span> untuk Konstruksi Modern.
                        </h1>

                        <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
                            Spesialis Konstruksi, Coring, Genset dan Chemical Anchor
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            <Link
                                href="/layanan"
                                className="bg-[#F49414] hover:brightness-110 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-[#F49414]/20"
                            >
                                Layanan Kami
                            </Link>

                            <Link
                                href="https://wa.me/6287888431444"
                                className="bg-[#277BBE]/20 hover:bg-[#277BBE]/40 backdrop-blur-md text-white border border-[#277BBE]/30 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-3"
                            >
                                Hubungi Kami <ArrowRight size={20} />
                            </Link>
                        </div>
                    </motion.div>
                </div>


                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="mt-10 pb-10"
                >
                    <div className="flex flex-col md:flex-row justify-center items-center gap-6 md:gap-4 lg:gap-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2.5rem] py-5 px-6 md:px-10 max-w-5xl mx-auto shadow-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#F49414]/20 flex items-center justify-center text-[#F49414] shrink-0">
                                <ShieldCheck className="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-white font-bold text-sm lg:text-base leading-tight">Terstandarisasi</p>
                                <p className="text-white/60 text-[10px] lg:text-xs font-medium">SOP & Keselamatan K3</p>
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-10 bg-white/10 shrink-0"></div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#277BBE]/20 flex items-center justify-center text-[#277BBE] shrink-0">
                                <Users className="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-white font-bold text-sm lg:text-base leading-tight">Tim Profesional</p>
                                <p className="text-white/60 text-[10px] lg:text-xs font-medium">Teknisi Tersertifikasi</p>
                            </div>
                        </div>

                        <div className="hidden md:block w-px h-10 bg-white/10 shrink-0"></div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-[#F49414]/20 flex items-center justify-center text-[#F49414] shrink-0">
                                <Clock className="w-5 h-5 lg:w-6 lg:h-6" />
                            </div>
                            <div className="flex flex-col">
                                <p className="text-white font-bold text-sm lg:text-base leading-tight">Tepat Waktu</p>
                                <p className="text-white/60 text-[10px] lg:text-xs font-medium">Sesuai Tenggat Proyek</p>
                            </div>
                        </div>

                    </div>
                </motion.div>
            </div>
        </section>
    );
}
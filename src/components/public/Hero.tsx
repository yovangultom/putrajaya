"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CircuitBoard, Target, FlaskConical, Building2 } from "lucide-react";

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0B0C35] pt-32 pb-16">

            {/* === LAYER 1: GAMBAR BACKGROUND (z-0) === */}
            {/* grid-cols-1 di mobile, lalu berubah jadi grid-cols-3 di layar menengah (md) ke atas */}
            <div className="absolute inset-0 z-0 grid grid-cols-1 md:grid-cols-3">

                {/* GAMBAR 1: Tampil di semua perangkat. Di HP jadi full, di Desktop jadi 1/3 */}
                <div className="relative w-full h-full">
                    <Image
                        src="/images/hero-construction.jpg"
                        alt="Tim Konstruksi"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>

                {/* GAMBAR 2: Disembunyikan di HP (hidden), baru muncul di layar menengah (md:block) */}
                <div className="relative w-full h-full hidden md:block">
                    <Image
                        src="/images/hero-coring.jpg"
                        alt="Jasa Coring"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 0vw, 33vw"
                    />
                </div>

                {/* GAMBAR 3: Disembunyikan di HP (hidden), baru muncul di layar menengah (md:block) */}
                <div className="relative w-full h-full hidden md:block">
                    <Image
                        src="/images/hero-genset.jpg"
                        alt="Jasa Genset"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 0vw, 33vw"
                    />
                </div>
            </div>

            {/* === LAYER 2: OVERLAY WARNA GELAP (z-10) === */}
            {/* 1. Base overlay tipis menggunakan Navy Blue */}
            <div className="absolute inset-0 z-10 bg-[#0B0C35]/20"></div>

            {/* 2. Gradien vertikal (Vignette) menggunakan Navy Blue */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-[#0B0C35]/80 via-[#0B0C35]/40 to-[#0B0C35]/90"></div>

            {/* 3. Pola AutoCAD */}
            {/* <div className="absolute inset-x-0 bottom-0 h-1/2 z-10 opacity-10 bg-[url('/patterns/autocad.svg')] bg-cover bg-bottom"></div> */}


            {/* === LAYER 3: KONTEN TEKS & KARTU (z-20) === */}
            <div className="container mx-auto px-6 relative z-20 pt-10 md:pt-20 flex flex-col justify-between min-h-[calc(100vh-8rem)]">

                {/* Kontainer Teks yang di-Center */}
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
                            Spesialis Konstruksi, Coring, Genset dan Solusi Kimia
                        </p>

                        <div className="flex flex-wrap justify-center gap-4">
                            {/* Tombol Utama (Orange) */}
                            <button className="bg-[#F49414] hover:brightness-110 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-[#F49414]/20">
                                Layanan Kami
                            </button>
                            {/* Tombol Sekunder (Ocean Blue) */}
                            <button className="bg-[#277BBE]/20 hover:bg-[#277BBE]/40 backdrop-blur-md text-white border border-[#277BBE]/30 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-3">
                                Hubungi Kami <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Kartu Keahlian di Bawah */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-auto border-t border-white/10 pt-10"
                >
                    <div className="bg-[#0B0C35]/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:bg-[#0B0C35]/80 transition-colors shadow-lg">
                        <div className="p-3 bg-[#F49414]/20 rounded-xl text-[#F49414] mb-4"><CircuitBoard size={28} /></div>
                        <p className="text-white text-sm font-bold uppercase tracking-wider mb-1">POWER</p>
                        <p className="text-white/70 text-xs font-medium">Energi Genset</p>
                    </div>
                    <div className="bg-[#0B0C35]/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:bg-[#0B0C35]/80 transition-colors shadow-lg">
                        <div className="p-3 bg-[#F49414]/20 rounded-xl text-[#F49414] mb-4"><Target size={28} /></div>
                        <p className="text-white text-sm font-bold uppercase tracking-wider mb-1">PRECISION</p>
                        <p className="text-white/70 text-xs font-medium">Coring & Drilling</p>
                    </div>
                    <div className="bg-[#0B0C35]/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:bg-[#0B0C35]/80 transition-colors shadow-lg">
                        <div className="p-3 bg-[#F49414]/20 rounded-xl text-[#F49414] mb-4"><FlaskConical size={28} /></div>
                        <p className="text-white text-sm font-bold uppercase tracking-wider mb-1">SOLUTIONS</p>
                        <p className="text-white/70 text-xs font-medium">Chemical Solutions</p>
                    </div>
                    <div className="bg-[#0B0C35]/60 backdrop-blur-md p-6 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:bg-[#0B0C35]/80 transition-colors shadow-lg">
                        <div className="p-3 bg-[#F49414]/20 rounded-xl text-[#F49414] mb-4"><Building2 size={28} /></div>
                        <p className="text-white text-sm font-bold uppercase tracking-wider mb-1">STRUCTURE</p>
                        <p className="text-white/70 text-xs font-medium">Konstruksi Sipil</p>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
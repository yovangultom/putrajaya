// file: AnimatedHero.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Users, Clock } from "lucide-react";

export function AnimatedParagraph() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col items-center"
        >
            <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
                Spesialis Konstruksi, Coring, Genset dan Chemical Anchor
            </p>

            <div className="flex flex-wrap justify-center gap-4">
                <Link
                    href="/layanan"
                    className="bg-[#F49414] hover:brightness-110 text-[#0B0C35] px-8 py-4 rounded-2xl font-black uppercase tracking-widest flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-[#F49414]/20"
                >
                    Layanan Kami
                </Link>

                <Link
                    href="https://wa.me/6287888431444"
                    className="bg-[#277BBE]/20 hover:bg-[#277BBE]/40 backdrop-blur-md text-white border border-[#277BBE]/30 px-8 py-4 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center gap-3"
                >
                    Hubungi Kami <ArrowRight size={20} aria-hidden="true" />
                </Link>
            </div>
        </motion.div>
    );
}

export function AnimatedStats() {
    return (
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
    );
}
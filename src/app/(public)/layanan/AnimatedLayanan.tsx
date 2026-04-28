// File: app/layanan/AnimatedLayanan.tsx
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert } from "lucide-react";

export function AnimatedHeroText() {
    return (
        <div className="max-w-4xl mx-auto text-center mb-16">
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-black mb-8 tracking-tighter text-white"
            >
                Layanan <span className="text-[#F49414]">Kami</span>
            </motion.h1>

            {/* INI ADALAH ELEMEN LCP KAMU! */}
            {/* Saya MENGHAPUS animasi di elemen ini agar browser bisa langsung menampilkannya (menghilangkan delay 980ms) */}
            <p className="text-lg md:text-xl text-white/80 leading-relaxed font-medium">
                CV Putra Jaya didukung oleh para tenaga ahli yang memiliki pengalaman kerja tinggi di bidangnya. Kami selalu berkomitmen menggunakan material serta alat terbaik dalam setiap pekerjaan.
            </p>
        </div>
    );
}

export function AnimatedStatsBoxes() {
    return (
        <div className="flex flex-col md:flex-row justify-center gap-6 max-w-3xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex items-center gap-4 hover:bg-white/15 transition-colors"
            >
                <div className="w-14 h-14 bg-[#25D366]/20 rounded-2xl flex items-center justify-center text-[#25D366]">
                    <ShieldCheck size={28} />
                </div>
                <div className="text-left">
                    <p className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">Pencapaian K3</p>
                    <p className="text-2xl font-black text-white">Zero Accident</p>
                    <p className="text-white/60 text-xs mt-1">Tanpa Kecelakaan Kerja</p>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex-1 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl flex items-center gap-4 hover:bg-white/15 transition-colors"
            >
                <div className="w-14 h-14 bg-[#F49414]/20 rounded-2xl flex items-center justify-center text-[#F49414]">
                    <ShieldAlert size={28} />
                </div>
                <div className="text-left">
                    <p className="text-white/70 text-sm font-bold uppercase tracking-wider mb-1">Standar Keamanan</p>
                    <p className="text-2xl font-black text-white">Zero Incident</p>
                    <p className="text-white/60 text-xs mt-1">Tanpa Insiden Operasional</p>
                </div>
            </motion.div>
        </div>
    );
}

export function AnimatedServiceCard({ children, delay }: { children: React.ReactNode, delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: delay }}
            className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col h-full"
        >
            {children}
        </motion.div>
    );
}
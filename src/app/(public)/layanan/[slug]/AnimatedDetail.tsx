// File: app/layanan/[slug]/AnimatedDetail.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Phone } from "lucide-react";

export function AnimatedContent({ data }: { data: any }) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            {/* Deskripsi Panjang */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-2"
            >
                <h2 className="text-3xl font-black text-[#0B0C35] mb-6">Deskripsi Pekerjaan</h2>
                <p className="text-slate-600 text-lg leading-relaxed mb-10 whitespace-pre-line">
                    {data.content}
                </p>

                <h3 className="text-2xl font-black text-[#0B0C35] mb-6">Mengapa Memilih Kami?</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data.features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <CheckCircle2 className="text-[#F49414] shrink-0" />
                            <span className="font-bold text-[#0B0C35]">{feature}</span>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Sidebar / CTA */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-1"
            >
                <div className="bg-[#F49414] p-8 rounded-3xl text-white sticky top-32 shadow-xl shadow-[#F49414]/20">
                    <h3 className="text-2xl font-black mb-4">Butuh Penawaran Harga?</h3>
                    <p className="mb-8 opacity-90 leading-relaxed">
                        Dapatkan estimasi biaya dan konsultasi teknis gratis untuk layanan <strong>{data.title}</strong> Anda sekarang.
                    </p>
                    <a
                        href={`https://wa.me/6287888431444?text=Halo Putra Jaya, saya ingin bertanya tentang layanan ${data.title}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#0B0C35] text-white flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all"
                    >
                        <Phone size={20} fill="white" /> Chat Sekarang
                    </a>
                </div>
            </motion.div>
        </div>
    );
}
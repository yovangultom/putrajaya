"use client";

import { motion } from "framer-motion";
import { Target, Flag, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutSection() {
    return (
        <section className="py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
            {/* Elemen Dekoratif */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#F49414]/10 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="container mx-auto px-6 max-w-6xl relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* SISI KIRI: Deskripsi Singkat */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="max-w-xl"
                    >
                        <h2 className="text-[#F49414] font-bold tracking-widest uppercase text-sm mb-2">Tentang Kami</h2>
                        <h3 className="text-3xl md:text-4xl font-black text-[#0B0C35] mb-6 leading-tight">
                            Membangun dengan <span className="text-[#F49414]">Kualitas</span>, Tumbuh dengan <span className="text-[#277BBE]">Kepercayaan</span>.
                        </h3>
                        <p className="text-slate-600 leading-relaxed mb-6 text-lg">
                            CV. Putra Jaya merupakan perusahaan yang bergerak di bidang konstruksi, menyediakan spesialisasi jasa seperti instalasi & service genset, coring beton, hingga chemical anchor dengan standar mutu tinggi.
                        </p>
                        <p className="text-slate-600 leading-relaxed mb-10 text-lg">
                            Dengan dukungan tim profesional, kami senantiasa mengutamakan kualitas, keselamatan kerja, dan kepuasan klien dalam setiap proyek pemerintah maupun swasta.
                        </p>

                        {/* Jika Anda punya halaman detail tentang kami, link ini berguna */}
                        <Link href="/tentang" className="inline-flex items-center gap-2 font-bold text-[#0B0C35] hover:text-[#F49414] transition-colors group">
                            Lebih Lanjut Tentang Kami
                            <span className="bg-white border border-slate-200 group-hover:border-[#F49414] group-hover:bg-[#F49414]/10 p-2 rounded-full transition-all shadow-sm">
                                <ArrowRight size={16} />
                            </span>
                        </Link>
                    </motion.div>

                    {/* SISI KANAN: Visi & Misi */}
                    <div className="space-y-6">
                        {/* Kartu Visi */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex gap-6 items-start"
                        >
                            <div className="w-14 h-14 bg-[#0B0C35] rounded-xl flex items-center justify-center text-[#F49414] shrink-0 shadow-md">
                                <Target size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-[#0B0C35] mb-2">Visi Perusahaan</h4>
                                <p className="text-slate-600 font-medium leading-relaxed">
                                    "Menjadi perusahaan yang unggul, profesional, dan terpercaya di tingkat nasional."
                                </p>
                            </div>
                        </motion.div>

                        {/* Kartu Misi */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ delay: 0.2 }}
                            className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 flex gap-6 items-start"
                        >
                            <div className="w-14 h-14 bg-[#0B0C35] rounded-xl flex items-center justify-center text-[#277BBE] shrink-0 shadow-md">
                                <Flag size={28} />
                            </div>
                            <div>
                                <h4 className="text-xl font-black text-[#0B0C35] mb-4">Misi Perusahaan</h4>
                                <ul className="space-y-3">
                                    {[
                                        "Layanan dengan standar mutu tinggi.",
                                        "Integritas & profesionalisme kerja.",
                                        "Membangun hubungan jangka panjang.",
                                    ].map((misi, index) => (
                                        <li key={index} className="flex items-start gap-3">
                                            <CheckCircle2 size={18} className="text-[#F49414] shrink-0 mt-0.5" />
                                            <span className="text-slate-600 font-medium text-sm leading-snug">{misi}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
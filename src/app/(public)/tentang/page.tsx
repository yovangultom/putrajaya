"use client";

import { motion } from "framer-motion";
import { Target, Flag, ShieldCheck, Award, Building, Users, CheckCircle2 } from "lucide-react";

export default function TentangPage() {
    return (
        <main className="min-h-screen bg-slate-50">

            {/* === SECTION 1: HERO & DESKRIPSI SINGKAT === */}
            {/* Perhatikan: Tidak ada margin, kita pakai pt-40 (padding-top) agar kotak biru mentok ke atas layar */}
            <section className="bg-[#0B0C35] text-white pt-40 pb-20 relative overflow-hidden">
                {/* Elemen Dekoratif */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#277BBE] rounded-full blur-[120px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black mb-8 tracking-tighter"
                        >
                            Tentang <span className="text-[#F49414]">Kami</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-white/80 leading-relaxed font-medium"
                        >
                            CV. Putra Jaya merupakan perusahaan yang bergerak di bidang Konstruksi serta menyediakan berbagai jasa seperti perbaikan atau jual beli genset, coring dan chemical anchor dengan standar mutu tinggi dan ketepatan waktu dalam setiap pengerjaan.
                            <br /><br />
                            Dengan dukungan tim profesional dan pengalaman di berbagai proyek pemerintah maupun swasta, kami senantiasa mengutamakan kualitas, keselamatan kerja, dan kepuasan klien sebagai prioritas utama.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* === SECTION 2: VISI & MISI === */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">

                        {/* Kartu Visi */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F49414]/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                            <div className="w-16 h-16 bg-[#0B0C35] rounded-2xl flex items-center justify-center text-[#F49414] mb-6 relative z-10 shadow-lg">
                                <Target size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-[#0B0C35] mb-4 relative z-10">Visi Kami</h2>
                            <p className="text-slate-600 text-lg leading-relaxed relative z-10 font-medium">
                                "Menjadi Perusahaan yang unggul, profesional, dan terpercaya di tingkat nasional."
                            </p>
                        </motion.div>

                        {/* Kartu Misi */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white p-10 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#277BBE]/10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110"></div>
                            <div className="w-16 h-16 bg-[#0B0C35] rounded-2xl flex items-center justify-center text-[#277BBE] mb-6 relative z-10 shadow-lg">
                                <Flag size={32} />
                            </div>
                            <h2 className="text-3xl font-black text-[#0B0C35] mb-6 relative z-10">Misi Kami</h2>
                            <ul className="space-y-4 relative z-10">
                                {[
                                    "Memberikan layanan dengan standar mutu tinggi.",
                                    "Menjaga integritas dan profesionalisme dalam setiap pekerjaan.",
                                    "Membangun hubungan jangka panjang dengan klien melalui kepercayaan dan hasil terbaik.",
                                    "Mendukung pembangunan berkelanjutan melalui inovasi dan efisiensi kerja."
                                ].map((misi, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <CheckCircle2 size={20} className="text-[#F49414] shrink-0 mt-1" />
                                        <span className="text-slate-600 font-medium">{misi}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* === SECTION 3: STATEMENT KEUNGGULAN (BANNER) === */}
            <section className="bg-gradient-to-r from-[#F49414] to-orange-500 py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/patterns/autocad.svg')] bg-cover mix-blend-overlay"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto text-center text-white"
                    >
                        <Award size={48} className="mx-auto mb-6 opacity-90" />
                        <h2 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
                            Memberikan Keunggulan, Dibangun di Atas Kepercayaan.
                        </h2>
                        <p className="text-xl md:text-2xl font-medium text-white/90">
                            Kami menetapkan standar dalam industri konstruksi dengan menggabungkan keandalan, kualitas, dan inovasi di setiap pembangunan.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* === SECTION 4: KEPEMIMPINAN & TATA KELOLA === */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="max-w-5xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-black text-[#0B0C35] mb-4">
                                Kepemimpinan & <span className="text-[#F49414]">Tata Kelola</span>
                            </h2>
                            <p className="text-slate-600 text-lg">Prinsip dasar yang mengarahkan setiap operasional kami.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#277BBE] mb-6 border border-slate-100">
                                    <Building size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-[#0B0C35] mb-3">Tata Kelola Strategis</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    Kami menempatkan perhatian besar pada kepemimpinan strategis dan tata kelola yang efektif. Dewan direksi dan tim eksekutif kami bekerja sama untuk memastikan penerapan praktik perusahaan yang baik.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.1 }}
                                className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#F49414] mb-6 border border-slate-100">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-[#0B0C35] mb-3">Integritas & Etika</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    Kami berpegang pada prinsip kepemimpinan yang etis, serta menumbuhkan budaya integritas dan pengambilan keputusan yang bertanggung jawab di setiap lini operasional.
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="p-8 bg-slate-50 rounded-3xl border border-slate-100 hover:shadow-lg transition-shadow"
                            >
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-[#0B0C35] mb-6 border border-slate-100">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-xl font-bold text-[#0B0C35] mb-3">Manajemen Risiko & K3</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">
                                    Kebijakan kami dikembangkan dengan fokus pada manajemen risiko dan kepatuhan peraturan, mengutamakan keselamatan dan kesejahteraan karyawan, lingkungan, serta komunitas.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

        </main>
    );
}
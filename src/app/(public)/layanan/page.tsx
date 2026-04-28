"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Building2, PencilRuler, FlaskConical, Target, Wrench, Store, ShieldAlert, ShieldCheck, ArrowRight } from "lucide-react";

export default function LayananPage() {
    const services = [
        {
            title: "Konstruksi Umum",
            slug: "konstruksi-umum",
            description: "Pembangunan, renovasi, dan perbaikan struktur sipil skala kecil sampai menengah dengan kualitas finishing terbaik.",
            icon: <Building2 size={24} />,
            image: "/images/services/Layanan_KonstruksiUmum.jpg",
            delay: 0.1
        },
        {
            title: "Perencanaan Konstruksi",
            slug: "perencanaan-konstruksi",
            description: "Penyusunan desain, analisis teknis, dan strategi pembangunan yang terukur untuk hasil efisien dan berkelanjutan.",
            icon: <PencilRuler size={24} />,
            image: "/images/services/Layanan_PerencanaanKonstruksi.jpg",
            delay: 0.2
        },
        {
            title: "Jasa Coring",
            slug: "jasa-coring",
            description: "Pengeboran beton bertulang presisi untuk pembuatan jalur pipa, kabel, dan ventilasi tanpa merusak struktur utama.",
            icon: <Target size={24} />,
            image: "/images/services/Layanan_JasaCoring.jpg",
            delay: 0.4
        },
        {
            title: "Chemical Anchor",
            slug: "chemical-anchor",
            description: "Pemasangan angkur kimia standar Hilti untuk perkuatan sambungan beton dan struktur baja dengan daya tarik maksimal.",
            icon: <FlaskConical size={24} />,
            image: "/images/services/Layanan_Chemical.jpg",
            delay: 0.3
        },
        {
            title: "Service Genset",
            slug: "service-genset",
            description: "Perawatan berkala, overhaul, dan perbaikan mesin genset untuk memastikan ketersediaan daya cadangan 100%.",
            icon: <Wrench size={24} />,
            image: "/images/services/Layanan_ServiceGenset.jpg",
            delay: 0.5
        },
        {
            title: "Jual Beli dan Sewa Genset",
            slug: "jual-beli-genset",
            description: "Pengadaan unit genset baru dan bekas berkualitas berbagai kapasitas (Perkins, Cummins, dll) sesuai kebutuhan daya.",
            icon: <Store size={24} />,
            image: "/images/services/Layanan_JualBeliGenset.jpg",
            delay: 0.6
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50">
            <section className="bg-[#0B0C35] text-white pt-40 pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#277BBE] rounded-full blur-[120px] opacity-20 -ml-20 -mt-20 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-4xl mx-auto text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-black mb-8 tracking-tighter"
                        >
                            Layanan <span className="text-[#F49414]">Kami</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-white/80 leading-relaxed font-medium"
                        >
                            CV Putra Jaya didukung oleh para tenaga ahli yang memiliki pengalaman kerja tinggi di bidangnya. Kami selalu berkomitmen menggunakan material serta alat terbaik dalam setiap pekerjaan.
                        </motion.p>
                    </div>

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
                </div>
            </section>

            <section className="py-24 -mt-10 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: service.delay }}
                                className="bg-white rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden group hover:-translate-y-2 transition-transform duration-300 flex flex-col"
                            >
                                <div className="relative w-full aspect-video overflow-hidden">
                                    <Image
                                        src={service.image}
                                        alt={`Visualisasi layanan ${service.title} CV Putra Jaya`}
                                        fill
                                        priority={index < 3}
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 to-transparent" />
                                </div>

                                <div className="p-8 flex flex-col grow">
                                    <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-100">
                                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-[#0B0C35] group-hover:bg-[#F49414] group-hover:text-white transition-colors duration-300 shadow-inner border border-slate-200/50">
                                            {service.icon}
                                        </div>
                                        <h3 className="text-2xl font-black text-[#0B0C35] mb-0 leading-tight grow">
                                            {service.title}
                                        </h3>
                                    </div>

                                    <p className="text-slate-600 leading-relaxed font-medium text-sm grow mb-6">
                                        {service.description}
                                    </p>

                                    <Link
                                        href={`/layanan/${service.slug}`}
                                        className="text-[#277BBE] text-sm font-bold flex items-center gap-2 group-hover:text-[#F49414] transition-colors mt-auto w-fit"
                                    >
                                        Detail Layanan <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16  bg-[#0B0C35] relative overflow-hidden border-t-4 border-[#F49414]">
                {/* <div className="absolute inset-0 opacity-10 bg-[url('/patterns/autocad.svg')] bg-cover mix-blend-overlay"></div> */}
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <h2 className="text-3xl font-black text-white mb-6">Butuh Penanganan Proyek Segera?</h2>
                    <p className="text-white/90 mb-8 max-w-2xl mx-auto text-lg">
                        Tim ahli kami siap memberikan konsultasi dan solusi terbaik untuk kebutuhan konstruksi, coring, maupun instalasi genset Anda.
                    </p>
                    <a
                        href="https://wa.me/6287888431444"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-[#F49414] hover:bg-orange-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest transition-all transform hover:scale-105 shadow-xl shadow-[#F49414]/20"
                    >
                        Hubungi Kami Sekarang
                    </a>
                </div>
            </section>

        </main>
    );
}
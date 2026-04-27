"use client"; // INI KUNCINYA! Harus ada di baris paling atas

import Image from "next/image";
import Link from "next/link";
import { Building2, PencilRuler, FlaskConical, Target, Wrench, Store, ShieldAlert, ShieldCheck, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Services() {
    const layananList = [
        {
            title: "Konstruksi Umum",
            slug: "konstruksi-umum",
            icon: <Building2 size={20} />,
            img: "/images/services/Layanan_KonstruksiUmum.jpg",
            desc: "Pembangunan, renovasi, dan perbaikan struktur sipil skala kecil sampai menengah dengan kualitas finishing terbaik."
        },
        {
            title: "Perencanaan Konstruksi",
            slug: "perencanaan-konstruksi",
            icon: <PencilRuler size={20} />,
            img: "/images/services/Layanan_PerencanaanKonstruksi copy.jpg",
            desc: "Penyusunan desain, analisis teknis, dan strategi pembangunan yang terukur untuk hasil efisien dan berkelanjutan."
        },
        {
            title: "Jasa Coring",
            slug: "jasa-coring",
            icon: <Target size={20} />,
            img: "/images/services/Layanan_JasaCoring.jpg",
            desc: "Pengeboran beton bertulang presisi untuk pembuatan jalur pipa, kabel, dan ventilasi tanpa merusak struktur utama."
        },
        {
            title: "Chemical Anchor",
            slug: "chemical-anchor",
            icon: <FlaskConical size={20} />,
            img: "/images/services/Layanan_Chemical.jpg",
            desc: "Pemasangan angkur kimia standar Hilti untuk perkuatan sambungan beton dan struktur baja dengan daya tarik maksimal."
        },
        {
            title: "Service Genset",
            slug: "service-genset",
            icon: <Wrench size={20} />,
            img: "/images/services/Layanan_ServiceGenset.jpg",
            desc: "Perawatan berkala, overhaul, dan perbaikan mesin genset untuk memastikan ketersediaan daya cadangan 100%."
        },
        {
            title: "Jual Beli dan Sewa Genset",
            slug: "jual-beli-genset",
            icon: <Store size={20} />,
            img: "/images/services/Layanan_JualBeliGenset.jpg",
            desc: "Pengadaan unit genset baru dan bekas berkualitas berbagai kapasitas (Perkins, Cummins, dll) sesuai kebutuhan daya."
        },
    ];

    return (
        <section className="py-24 bg-white relative z-20 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] rounded-t-[3rem] -mt-10">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <h2 className="text-[#F49414] font-bold tracking-widest uppercase text-sm mb-2">Layanan Kami</h2>
                    <h3 className="text-3xl md:text-4xl font-black text-[#0B0C35]">Keahlian Utama Tim Kami</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {layananList.map((layanan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.15 }}
                            className="h-full"
                        >
                            <Link
                                href={`/layanan/${layanan.slug}`}
                                className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-slate-200/50 hover:-translate-y-2 transition-all duration-500 group flex flex-col h-full cursor-pointer block"
                            >
                                <div
                                    className="relative w-full overflow-hidden bg-slate-100 shrink-0"
                                    style={{ height: '220px' }}
                                >
                                    <Image
                                        src={layanan.img}
                                        alt={layanan.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                        priority={index < 3}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-[#0B0C35]/60 via-transparent to-transparent opacity-80" />

                                    <div className="absolute top-4 left-4 w-10 h-10 bg-[#F49414] text-white rounded-xl flex items-center justify-center shadow-lg shadow-[#F49414]/40 z-10 border border-white/20 group-hover:rotate-12 transition-transform">
                                        {layanan.icon}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <h4 className="text-xl font-bold text-[#0B0C35] mb-3 group-hover:text-[#F49414] transition-colors tracking-tight leading-tight min-h-12 flex items-center">
                                        {layanan.title}
                                    </h4>
                                    <div className="w-12 h-1 bg-[#F49414]/20 mb-4 group-hover:w-20 transition-all duration-500 rounded-full" />
                                    <p className="text-slate-600 leading-relaxed text-[15px] font-medium opacity-90">
                                        {layanan.desc}
                                    </p>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
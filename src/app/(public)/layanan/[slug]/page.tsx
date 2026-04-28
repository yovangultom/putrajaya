"use client";

import { useParams, notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    CheckCircle2,
    Phone,
    Building2,
    PencilRuler,
    Target,
    FlaskConical,
    Wrench,
    Store
} from "lucide-react";

// Data Detail Layanan (Simulasi Database)
const servicesDetail = {
    "konstruksi-umum": {
        title: "Konstruksi Umum",
        icon: <Building2 size={48} />,
        image: "/images/services/Layanan_KonstruksiUmum.jpg",
        description: "Layanan pembangunan dan renovasi menyeluruh untuk berbagai skala proyek sipil.",
        content: "CV Putra Jaya melayani pengerjaan konstruksi umum mulai dari tahap persiapan lahan hingga penyelesaian akhir (finishing). Kami mengutamakan kekuatan struktur dan estetika hasil akhir.",
        features: ["Pembangunan Ruko & Rumah", "Renovasi Bangunan", "Pekerjaan Infrastruktur Jalan", "Pengecoran & Pembetonan"]
    },
    "perencanaan-konstruksi": {
        title: "Perencanaan Konstruksi",
        icon: <PencilRuler size={48} />,
        image: "/images/services/Layanan_PerencanaanKonstruksi.jpg",
        description: "Solusi desain dan analisis teknis sebelum proyek dimulai.",
        content: "Setiap bangunan yang kokoh dimulai dari perencanaan yang matang. Kami menyediakan jasa desain arsitektur, perhitungan struktur (RAB), hingga analisis dampak lingkungan.",
        features: ["Desain Arsitektur 2D/3D", "Perhitungan RAB", "Analisis Struktur Bangunan", "Konsultasi Teknis Lapangan"]
    },
    "jasa-coring": {
        title: "Jasa Coring",
        icon: <Target size={48} />,
        image: "/images/services/Layanan_JasaCoring.jpg",
        description: "Pengeboran beton presisi menggunakan mesin coring modern.",
        content: "Layanan Core Drilling kami memungkinkan pembuatan lubang pada beton bertulang, keramik, atau marmer tanpa menimbulkan getaran berlebih yang merusak struktur utama.",
        features: ["Lubang Jalur Pipa (Plumbing)", "Jalur Kabel Listrik & Data", "Ventilasi AC", "Pengambilan Sampel Beton"]
    },
    "chemical-anchor": {
        title: "Chemical Anchor",
        icon: <FlaskConical size={48} />,
        image: "/images/services/Layanan_Chemical.jpg",
        description: "Pemasangan anchor dengan perekat kimia untuk kekuatan ekstra.",
        content: "Kami melayani pemasangan stek rebar dan baut anchor menggunakan bahan kimia (epoxy/resin) berkualitas tinggi untuk menambah kekuatan sambungan beton lama dan baru.",
        features: ["Sambungan Beton Lama & Baru", "Pemasangan Base Plate Baja", "Kekuatan Tarik Tinggi", "Material Standar Industri"]
    },
    "service-genset": {
        title: "Service Genset",
        icon: <Wrench size={48} />,
        image: "/images/services/Layanan_ServiceGenset.jpg",
        description: "Perawatan berkala dan perbaikan genset berbagai kapasitas.",
        content: "Pastikan ketersediaan energi cadangan Anda selalu prima. Tim teknisi kami siap melakukan pengecekan mesin, penggantian oli, hingga perbaikan panel kontrol genset.",
        features: ["Maintenance Berkala", "Overhaul Mesin", "Service Panel ATS/AMF", "Penyediaan Suku Cadang Asli"]
    },
    "jual-beli-genset": {
        title: "Jual Beli dan Sewa Genset",
        icon: <Store size={48} />,
        image: "/images/services/Layanan_JualBeliGenset.jpg",
        description: "Penyediaan unit genset baru maupun bekas berkualitas.",
        content: "Kami menyediakan berbagai macam kapasitas genset (kVA) dari merek ternama. Semua unit yang kami jual telah melalui tahap uji beban (load test) yang ketat.",
        features: ["Genset Baru & Bekas Bergaransi", "Berbagai Kapasitas (kVA)", "Layanan Tukar Tambah", "Gratis Konsultasi Kapasitas Daya"]
    }
};

export default function DetailLayanan() {
    const params = useParams();
    const slug = params.slug as string;

    // Ambil data berdasarkan slug, jika tidak ada tampilkan 404
    const data = servicesDetail[slug as keyof typeof servicesDetail];

    if (!data) return notFound();

    return (
        <main className="min-h-screen bg-white">
            {/* Header / Banner Layanan */}
            <section className="bg-[#0B0C35] pt-40 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#277BBE] rounded-full blur-[100px] opacity-20 -mr-10 -mt-10"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <Link
                        href="/layanan"
                        className="inline-flex items-center gap-2 text-[#F49414] font-bold mb-8 hover:translate-x-1 transition-transform"
                    >
                        <ArrowLeft size={20} /> Kembali ke Layanan
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-[#F49414] mb-6 border border-white/20">
                                {data.icon}
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                                {data.title}
                            </h1>
                            <p className="text-xl text-white/70 leading-relaxed">
                                {data.description}
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-video rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl"
                        >
                            <Image
                                src={data.image}
                                alt={data.title}
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Konten Detail */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Deskripsi Panjang */}
                        <div className="lg:col-span-2">
                            <h2 className="text-3xl font-black text-[#0B0C35] mb-6">Deskripsi Pekerjaan</h2>
                            <p className="text-slate-600 text-lg leading-relaxed mb-10 whitespace-pre-line">
                                {data.content}
                            </p>

                            <h3 className="text-2xl font-black text-[#0B0C35] mb-6">Mengapa Memilih Kami?</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <CheckCircle2 className="text-[#F49414] shrink-0" />
                                        <span className="font-bold text-[#0B0C35]">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Sidebar / CTA */}
                        <div className="lg:col-span-1">
                            <div className="bg-[#F49414] p-8 rounded-3xl text-white sticky top-32 shadow-xl shadow-[#F49414]/20">
                                <h3 className="text-2xl font-black mb-4">Butuh Penawaran Harga?</h3>
                                <p className="mb-8 opacity-90 leading-relaxed">
                                    Dapatkan estimasi biaya dan konsultasi teknis gratis untuk layanan <strong>{data.title}</strong> Anda sekarang.
                                </p>
                                <a
                                    href={`https://wa.me/6287888431444?text=Halo Putra Jaya, saya ingin bertanya tentang layanan ${data.title}`}
                                    target="_blank"
                                    className="w-full bg-[#0B0C35] text-white flex items-center justify-center gap-3 py-4 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all"
                                >
                                    <Phone size={20} fill="white" /> Chat Sekarang
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
// File: app/layanan/page.tsx
// TIDAK ADA LAGI "use client" DI SINI!

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Building2, PencilRuler, FlaskConical, Target, Wrench, Store, ArrowRight } from "lucide-react";

// Import komponen animasi secara dinamis agar tidak memblokir render HTML
const AnimatedHeroText = dynamic(() => import("./AnimatedLayanan").then(mod => mod.AnimatedHeroText));
const AnimatedStatsBoxes = dynamic(() => import("./AnimatedLayanan").then(mod => mod.AnimatedStatsBoxes));
const AnimatedServiceCard = dynamic(() => import("./AnimatedLayanan").then(mod => mod.AnimatedServiceCard));

// Pindahkan data ke luar fungsi agar server bisa men-cache-nya secara optimal
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
        description: "Pengeboran beton presisi menggunakan mesin coring modern.",
        icon: <Target size={24} />,
        image: "/images/services/Layanan_JasaCoring.jpg",
        delay: 0.2
    },
    {
        title: "Chemical Anchor",
        slug: "chemical-anchor",
        description: "Pemasangan anchor dengan perekat kimia untuk kekuatan ekstra.",
        icon: <FlaskConical size={24} />,
        image: "/images/services/Layanan_Chemical.jpg",
        delay: 0.3
    },
    {
        title: "Service Genset",
        slug: "service-genset",
        description: "Perawatan berkala dan perbaikan genset berbagai kapasitas.",
        icon: <Wrench size={24} />,
        image: "/images/services/Layanan_ServiceGenset.jpg",
        delay: 0.3
    },
    {
        title: "Jual Beli dan Sewa Genset",
        slug: "jual-beli-genset",
        description: "Penyediaan unit genset baru maupun bekas berkualitas.",
        icon: <Store size={24} />,
        image: "/images/services/Layanan_JualBeliGenset.jpg",
        delay: 0.4
    }
    // ... (Masukkan sisa data services kamu di sini) ...
];

export default function LayananPage() {
    return (
        <main className="min-h-screen bg-slate-50">
            <section className="bg-[#0B0C35] text-white pt-40 pb-24 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-96 h-96 bg-[#277BBE] rounded-full blur-[120px] opacity-20 -ml-20 -mt-20 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    {/* Hero Text dan Elemen LCP langsung dirender via dinamis, tapi kita hilangkan animasinya di dalam file AnimatedLayanan */}
                    <AnimatedHeroText />

                    {/* Stats Boxes (Zero Accident, dll) */}
                    <AnimatedStatsBoxes />
                </div>
            </section>

            <section className="py-24 -mt-10 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            // Pembungkus Animasi
                            <AnimatedServiceCard key={index} delay={service.delay}>
                                {/* Isi Kartu (HTML dan Gambar) dirender secara instan oleh Server */}
                                <div className="relative w-full aspect-video overflow-hidden">
                                    <Image
                                        src={service.image}
                                        alt={`Visualisasi layanan ${service.title} CV Putra Jaya`}
                                        fill
                                        // PENTING: Hanya berikan priority pada 2 gambar pertama di mobile, atau 3 di desktop
                                        priority={index < 2}
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
                            </AnimatedServiceCard>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section Tetap Sama */}
            <section className="py-16 bg-[#0B0C35] relative overflow-hidden border-t-4 border-[#F49414]">
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
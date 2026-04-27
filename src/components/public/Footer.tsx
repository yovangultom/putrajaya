import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Globe, Clock, ChevronRight } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    // 1. Buat array objek khusus untuk layanan beserta slug URL-nya
    const layananUtama = [
        { name: 'Konstruksi Umum', slug: 'konstruksi-umum' },
        { name: 'Perencanaan Konstruksi', slug: 'perencanaan-konstruksi' },
        { name: 'Jasa Coring', slug: 'jasa-coring' },
        { name: 'Chemical Anchor', slug: 'chemical-anchor' },
        { name: 'Service Genset', slug: 'service-genset' },
        { name: 'Jual Beli dan Sewa Genset', slug: 'jual-beli-genset' },
    ];

    return (
        <footer className="bg-[#0B0C35] text-white pt-10 md:pt-16 border-t-[6px] border-t-[#F49414] relative overflow-hidden">
            {/* Elemen Dekoratif Biru Terang */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#277BBE] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-10 md:mb-16 relative z-10">

                    {/* Kolom 1: Profil Perusahaan */}
                    <div className="flex flex-col gap-4 md:gap-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="bg-white p-1.5 rounded-lg">
                                <Image
                                    src="/images/Logo-CV-PutraJaya.png"
                                    alt="Logo CV Putra Jaya"
                                    width={40}
                                    height={40}
                                    className="w-8 h-8 md:w-10 md:h-10 object-contain"
                                />
                            </div>
                            <span className="text-xl md:text-2xl font-black tracking-tighter text-white">
                                PUTRA<span className="text-[#F49414]">JAYA</span>
                            </span>
                        </Link>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Mitra terpercaya Anda untuk solusi konstruksi terintegrasi. Kami menghadirkan standar mutu tinggi, presisi, dan ketepatan waktu dalam setiap proyek sipil dan teknis.
                        </p>
                    </div>

                    {/* Kolom 2: Tautan Cepat */}
                    <div className="hidden md:block">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#F49414] rounded-full"></span> Tautan Cepat
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {['Beranda', 'Tentang Kami', 'Layanan', 'Proyek', 'Kontak'].map((item) => (
                                <li key={item}>
                                    <Link
                                        href={item === 'Beranda' ? '/' : `/${item.toLowerCase().replace(' ', '-')}`}
                                        className="text-white/70 hover:text-[#277BBE] text-sm flex items-center gap-2 transition-colors group"
                                    >
                                        <ChevronRight size={14} className="text-[#F49414] group-hover:translate-x-1 transition-transform" />
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 3: Layanan Kami (SUDAH DIPERBAIKI) */}
                    <div className="hidden md:block">
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#F49414] rounded-full"></span> Layanan Utama
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {/* 2. Mapping menggunakan array layananUtama yang baru */}
                            {layananUtama.map((service) => (
                                <li key={service.slug}>
                                    <Link
                                        href={`/layanan/${service.slug}`}
                                        className="text-white/70 hover:text-[#277BBE] text-sm flex items-center gap-2 transition-colors group"
                                    >
                                        <ChevronRight size={14} className="text-[#F49414] group-hover:translate-x-1 transition-transform" />
                                        {service.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 4: Kontak Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 md:mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#F49414] rounded-full"></span> Hubungi Kami
                        </h3>
                        <ul className="flex flex-col gap-3 md:gap-4 text-sm text-white/70">
                            <li className="flex items-start gap-3">
                                <MapPin size={18} className="text-[#F49414] shrink-0 mt-1" />
                                <span className="leading-relaxed">Jl. KH Mochammad RT 01 RW 02 No. 86<br />Desa Mangun Jaya, Kec. Tambun Selatan<br />Bekasi</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={18} className="text-[#F49414] shrink-0" />
                                <span>0878-8843-1444</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Globe size={18} className="text-[#F49414] shrink-0" />
                                <a href="https://jasacoring.co.id/" target="_blank" rel="noopener noreferrer" className="hover:text-[#F49414] transition-colors">jasacoring.co.id</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Clock size={18} className="text-[#F49414] shrink-0" />
                                <span>Senin - Minggu: 08:00 - 17:00</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-white/10 bg-black/20">
                <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-center md:text-left text-xs text-white/50">
                    <p>&copy; {currentYear} CV. Putra Jaya. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
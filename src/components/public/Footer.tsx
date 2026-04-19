import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Globe, Clock, ChevronRight } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-[#0B0C35] text-white pt-16 border-t-[6px] border-t-[#F49414] relative overflow-hidden">
            {/* Elemen Dekoratif Biru Terang (Ocean Blue) */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#277BBE] rounded-full blur-[100px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16 relative z-10">

                    {/* Kolom 1: Profil Perusahaan */}
                    <div className="flex flex-col gap-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="bg-white p-1.5 rounded-lg">
                                <Image
                                    src="/images/Logo-CV-PutraJaya.png"
                                    alt="Logo CV Putra Jaya"
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 object-contain"
                                />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-white">
                                PUTRA<span className="text-[#F49414]">JAYA</span>
                            </span>
                        </Link>
                        <p className="text-white/70 text-sm leading-relaxed">
                            Mitra terpercaya Anda untuk solusi konstruksi terintegrasi. Kami menghadirkan standar mutu tinggi, presisi, dan ketepatan waktu dalam setiap proyek sipil dan teknis.
                        </p>
                        {/* Social Media (Menggunakan Native SVG agar tidak error di Lucide) */}
                        <div className="flex gap-4 mt-2">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#F49414] hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#F49414] hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-[#F49414] hover:text-white transition-all">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Kolom 2: Tautan Cepat */}
                    <div>
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

                    {/* Kolom 3: Layanan Kami */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#F49414] rounded-full"></span> Layanan Utama
                        </h3>
                        <ul className="flex flex-col gap-3">
                            {['Konstruksi Sipil', 'Coring & Drilling Beton', 'Instalasi & Servis Genset', 'Chemical Anchor'].map((service) => (
                                <li key={service}>
                                    <Link href="/layanan" className="text-white/70 hover:text-[#277BBE] text-sm flex items-center gap-2 transition-colors group">
                                        <ChevronRight size={14} className="text-[#F49414] group-hover:translate-x-1 transition-transform" />
                                        {service}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 4: Kontak Info (Sesuai Kartu Nama) */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                            <span className="w-2 h-2 bg-[#F49414] rounded-full"></span> Hubungi Kami
                        </h3>
                        <ul className="flex flex-col gap-4 text-sm text-white/70">
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
                                <span>Senin - Sabtu: 08:00 - 17:00</span>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>

            {/* Copyright Bar */}
            <div className="border-t border-white/10 bg-black/20">
                <div className="container mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50">
                    <p>&copy; {currentYear} CV. Putra Jaya. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
                        <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
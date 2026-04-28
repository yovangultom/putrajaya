import Link from "next/link";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

export default function ContactAndMap() {
    return (
        <section className="py-24 bg-white relative z-20">
            <div className="container mx-auto px-6 max-w-6xl">

                {/* --- Container Utama dengan Desain Premium --- */}
                <div className="bg-[#0B0C35] rounded-[3rem] p-6 md:p-12 relative overflow-hidden flex flex-col lg:flex-row gap-10 shadow-2xl shadow-slate-200/50 border border-slate-100">

                    {/* --- Dekorasi Background Glow --- */}
                    <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#F49414] rounded-full blur-[150px] opacity-20 -ml-20 -mt-20 pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#277BBE] rounded-full blur-[120px] opacity-20 -mr-20 -mb-20 pointer-events-none" />

                    {/* --- Kolom Kiri: Detail Kontak & CTA --- */}
                    <div className="lg:w-5/12 relative z-10 flex flex-col justify-center">


                        <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                            Konsultasi Proyek <span className="text-[#F49414]">Gratis</span>
                        </h3>

                        <p className="text-white/80 mb-8 leading-relaxed font-medium">
                            Siap memulai proyek konstruksi atau coring Anda? Tim CV Putra Jaya siap memberikan penawaran harga terbaik dan solusi teknis yang efisien.
                        </p>

                        {/* Card Alamat Singkat */}
                        <div className="flex items-start gap-4 text-white/90 mb-8 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <div className="w-10 h-10 bg-[#F49414] rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                                <MapPin size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-white mb-1">Workshop Bekasi</p>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    Jl. KH Mochammad RT 01 RW 02 No. 86<br />
                                    Desa Mangun Jaya, Tambun Selatan, Bekasi
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-4 text-white/90 mb-8 bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <div className="w-10 h-10 bg-[#F49414] rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                                <Phone size={20} className="text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-white mb-1">Telepon / Whatsapp</p>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    0878-8843-1444
                                </p>
                            </div>
                        </div>

                        {/* Tombol Interaksi */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <a
                                href="https://wa.me/6287888431444"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white px-6 py-3.5 rounded-full font-bold hover:bg-[#20ba5a] hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-[#25D366]/30 group"
                            >
                                <Phone size={18} className="fill-white" />
                                Chat WhatsApp
                            </a>

                        </div>
                    </div>

                    {/* --- Kolom Kanan: Google Maps (Pake Iframe yang Anda Berikan) --- */}
                    <div className="lg:w-7/12 relative z-10 h-[400px] lg:h-auto min-h-[400px] rounded-[2.5rem] overflow-hidden border-4 border-white/10 shadow-inner">
                        <iframe
                            src="https://maps.google.com/maps?q=Jasa%20Coring%20dan%20Konstruksi%20-%20CV.%20Putra%20Jaya,%20Tambun%20Selatan&t=&z=15&ie=UTF8&iwloc=&output=embed"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Peta Lokasi CV Putra Jaya"
                            className="grayscale-[0.2] contrast-[1.1]"
                        ></iframe>

                        {/* Overlay Label Lokasi di Atas Map */}
                        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white flex items-center gap-2 pointer-events-none">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-[#0B0C35] uppercase tracking-tighter">Lokasi Workshop Kami</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
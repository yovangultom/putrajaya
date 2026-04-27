"use client";

import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Clock, Globe, ArrowRight } from "lucide-react";

export default function KontakPage() {
    const contactInfo = [
        {
            icon: <Phone className="text-[#F49414]" size={24} />,
            label: "Telepon / WhatsApp",
            value: "0878-8843-1444",
            link: "https://wa.me/6287888431444"
        },
        {
            icon: <Globe className="text-[#F49414]" size={24} />,
            label: "Website Resmi",
            value: "jasacoring.co.id",
            link: "https://jasacoring.co.id"
        },
        {
            icon: <Mail className="text-[#F49414]" size={24} />,
            label: "Email Perusahaan",
            value: "jasakonstruksi.putrajaya@gmail.com",
            link: "mailto:jasakonstruksi.putrajaya@gmail.com"
        },
        {
            icon: <Clock className="text-[#F49414]" size={24} />,
            label: "Jam Operasional",
            value: "Senin - Minggu: 08:00 - 17:00",
            link: "#"
        }
    ];

    return (
        <main className="min-h-screen bg-slate-50">
            {/* === SECTION 1: HERO === */}
            <section className="bg-[#0B0C35] text-white pt-40 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#277BBE] rounded-full blur-[120px] opacity-20 -mr-20 -mt-20 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="max-w-3xl">
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-5xl font-black mb-6 tracking-tighter"
                        >
                            Hubungi <span className="text-[#F49414]">Kami</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-white/80 leading-relaxed font-medium"
                        >
                            Siap memulai proyek Anda? Hubungi tim ahli CV Putra Jaya untuk konsultasi teknis, penawaran harga, atau penjadwalan layanan konstruksi dan coring.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* === SECTION 2: CONTACT INFO & MAPS === */}
            <section className="py-20 -mt-10 relative z-20">
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                        {/* Kolom Kiri: Detail Kontak */}
                        <div className="lg:col-span-5 flex flex-col gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100"
                            >
                                <h2 className="text-2xl font-black text-[#0B0C35] mb-8 flex items-center gap-3">
                                    <span className="w-2 h-8 bg-[#F49414] rounded-full"></span>
                                    Informasi Workshop
                                </h2>

                                <div className="space-y-6">
                                    {/* Alamat Lengkap */}
                                    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                                        <div className="w-12 h-12 bg-[#0B0C35] rounded-xl flex items-center justify-center text-[#F49414] shrink-0">
                                            <MapPin size={24} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Alamat Kantor & Workshop</p>
                                            <p className="text-[#0B0C35] font-bold leading-relaxed">
                                                Jl. KH Mochammad RT 01 RW 02 No. 86<br />
                                                Desa Mangun Jaya, Kec. Tambun Selatan<br />
                                                Bekasi, Jawa Barat
                                            </p>
                                        </div>
                                    </div>

                                    {/* Grid Info Lainnya */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {contactInfo.map((info, index) => (
                                            <a
                                                key={index}
                                                href={info.link}
                                                target={info.link.startsWith('http') ? "_blank" : "_self"}
                                                rel="noopener noreferrer"
                                                className="p-4 rounded-2xl border border-slate-100 hover:border-[#277BBE]/30 hover:bg-[#277BBE]/5 transition-all group"
                                            >
                                                <div className="mb-3">{info.icon}</div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{info.label}</p>
                                                <p className="text-[#0B0C35] font-bold text-sm truncate group-hover:text-[#277BBE]">{info.value}</p>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Banner WhatsApp Cepat */}
                            <motion.a
                                href="https://wa.me/6287888431444"
                                target="_blank"
                                rel="noopener noreferrer"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="bg-[#25D366] p-6 rounded-3xl flex items-center justify-between text-white hover:bg-[#20ba5a] transition-all shadow-lg shadow-[#25D366]/20 group"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                        <Phone size={24} fill="white" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase opacity-80">Respon Cepat</p>
                                        <p className="text-lg font-black">Klik Chat WhatsApp</p>
                                    </div>
                                </div>
                                <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                            </motion.a>
                        </div>

                        {/* Kolom Kanan: Google Maps */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="lg:col-span-7 h-[500px] lg:h-auto min-h-[450px] bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative"
                        >
                            {/* Embed Google Maps - Menggunakan Alamat Tambun Selatan */}
                            <iframe
                                src="https://maps.google.com/maps?q=Jasa%20Coring%20dan%20Konstruksi%20-%20CV.%20Putra%20Jaya,%20Tambun%20Selatan&t=&z=15&ie=UTF8&iwloc=&output=embed"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen={true}
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="grayscale-[0.2] contrast-[1.1]"
                            ></iframe>
                        </motion.div>

                    </div>
                </div>
            </section>
        </main>
    );
}
"use client";

import { motion } from "framer-motion";
import { Star, MessageCircle } from "lucide-react";

// Data ulasan (Bisa Anda ganti teksnya sesuai dengan ulasan asli di Google Maps Anda)
const reviews = [
    {
        name: "Budi Santoso",
        date: "2 bulan lalu",
        text: "Pengerjaan coring beton sangat rapi dan presisi. Timnya profesional, datang tepat waktu, dan yang paling penting safety first (zero accident). Sangat direkomendasikan untuk proyek konstruksi!",
        rating: 5,
        initial: "B"
    },
    {
        name: "PT. Maju Bersama",
        date: "4 bulan lalu",
        text: "Sewa dan service genset di Putra Jaya sangat memuaskan. Responnya cepat saat ada kendala di lapangan, teknisinya handal. Harga juga sangat bersaing. Terima kasih!",
        rating: 5,
        initial: "P"
    },
    {
        name: "Andi Wijaya",
        date: "1 minggu lalu",
        text: "Pemasangan chemical anchor untuk proyek gudang kami berjalan lancar. Material yang digunakan berkualitas dan sesuai standar. Pengerjaannya cepat selesai.",
        rating: 5,
        initial: "A"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-white relative overflow-hidden">
            {/* Elemen Dekoratif */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F49414] rounded-full blur-[100px] opacity-10 -mr-20 -mt-20 pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="text-center mb-16 max-w-2xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="flex justify-center mb-4 text-[#F49414]">
                            <MessageCircle size={32} />
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-[#0B0C35] mb-4">
                            Apa Kata <span className="text-[#F49414]">Klien Kami?</span>
                        </h2>
                        <p className="text-slate-600 text-lg">
                            Kepercayaan klien adalah prioritas kami. Berikut adalah beberapa ulasan asli dari pelanggan yang telah menggunakan jasa CV Putra Jaya.
                        </p>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {reviews.map((review, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-50 p-8 rounded-3xl border border-slate-100 shadow-lg shadow-slate-200/50 hover:-translate-y-2 transition-transform duration-300 flex flex-col"
                        >
                            {/* Header Review (Avatar & Name) */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-[#0B0C35] flex items-center justify-center text-white font-black text-xl shrink-0">
                                    {review.initial}
                                </div>
                                <div>
                                    <h3 className="font-bold text-[#0B0C35]">{review.name}</h3>
                                    <p className="text-xs text-slate-400">{review.date}</p>
                                </div>
                                {/* Icon Google G kecil di kanan (Opsional, untuk kesan otentik) */}
                                <div className="ml-auto w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <span className="text-blue-500 font-black text-xs">G</span>
                                </div>
                            </div>

                            {/* Stars */}
                            <div className="flex gap-1 mb-4">
                                {[...Array(review.rating)].map((_, i) => (
                                    <Star key={i} size={16} className="fill-[#F49414] text-[#F49414]" />
                                ))}
                            </div>

                            {/* Review Text */}
                            <p className="text-slate-600 leading-relaxed text-sm font-medium flex-grow">
                                "{review.text}"
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Tombol ke Google Maps (Opsional) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-12 text-center"
                >
                    <a
                        href="https://maps.app.goo.gl/Nv5RekHxkhJh8DwE7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-[#277BBE] font-bold hover:text-[#F49414] transition-colors"
                    >
                        Lihat lebih banyak ulasan di Google Maps &rarr;
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
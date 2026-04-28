"use client";

import { motion } from "framer-motion";
import { sendGAEvent } from '@next/third-parties/google';

export default function FloatingWhatsApp() {
    const whatsappNumber = "6287888431444";
    const message = "Halo CV Putra Jaya, saya ingin konsultasi mengenai jasa konstruksi.";
    const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    const handleWhatsAppClick = () => {
        console.log("Mengirim data ke GA4...");
        sendGAEvent({ event: 'whatsapp_click', button_location: 'floating_icon' });
        if (typeof window !== "undefined" && typeof window.gtag === "function") {
            window.gtag('event', 'whatsapp_click', {
                'button_location': 'floating_icon',
                'event_callback': () => {
                    console.log("✅ GA Event 'whatsapp_click' BERHASIL terkirim ke server!");
                }
            });
        } else {
            console.log("⚠️ Script GA4 belum siap, tapi klik tetap dilanjutkan.");
        }
    };

    return (
        <motion.a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            aria-label="Chat WhatsApp Langsung (Tombol Mengambang)"
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }} // Skala hover diturunkan sedikit agar tidak mentok pinggir layar
            whileTap={{ scale: 0.95 }}
            // Mengubah bentuk menjadi kapsul/pil (gap-3, px-5, py-3)
            className="fixed bottom-6 right-6 z-[9999] flex items-center justify-center gap-3 px-5 py-3 md:px-6 md:py-3.5 bg-[#25D366] text-white rounded-full shadow-2xl hover:bg-[#20ba5a] transition-colors group"
        >
            {/* Animasi Denyut di Background */}
            <motion.span
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-[#25D366] rounded-full -z-10 opacity-50"
            />

            {/* Tulisan Hubungi Kami */}
            <span className="font-bold text-sm md:text-base whitespace-nowrap">
                Hubungi Kami
            </span>

            {/* Logo WhatsApp */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                className="w-6 h-6 md:w-7 md:h-7 shrink-0"
                fill="currentColor"
            >
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.2 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-5.5-2.8-23.4-8.6-44.5-27.4-16.4-14.6-27.5-32.8-30.7-38.3-3.2-5.5-.3-8.5 2.5-11.2 2.5-2.5 5.5-6.5 8.3-9.7 2.8-3.3 3.7-5.5 5.5-9.3 1.9-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5H154c-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 13.2 5.7 23.5 9.2 31.6 11.8 13.3 4.2 25.4 3.6 35 2.2 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
            </svg>
        </motion.a>
    );
}
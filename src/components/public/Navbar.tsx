"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react"; // Menghapus Phone karena tombol konsultasi dihilangkan
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const navigation = [
    { name: "Beranda", href: "/" },
    { name: "Tentang Kami", href: "/tentang" },
    { name: "Layanan", href: "/layanan" },
    { name: "Proyek", href: "/proyek" },
    { name: "Kontak", href: "/kontak" },
];

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"}`}>
            <nav className="container mx-auto px-6 flex items-center justify-between">
                {/* Logo & Brand Name */}
                <Link href="/" aria-label="Halaman Utama" className="flex items-center gap-3">
                    {/* Logo Container */}
                    <div className={`shrink-0 p-1.5 rounded-xl transition-colors ${isScrolled ? "bg-transparent" : "bg-white/10 backdrop-blur-sm"}`}>
                        <Image
                            src="/images/Logo-CV-PutraJaya.png"
                            alt="Logo PT Putra Jaya Teknik Mandiri"
                            width={45}
                            height={45}
                            className="object-contain md:w-[50px] md:h-[50px]"
                        />
                    </div>

                    {/* Text Container - Typographic Hierarchy */}
                    <div className="flex flex-col justify-center">
                        <span className={`text-sm md:text-lg font-black tracking-tight leading-none ${isScrolled ? "text-[#0B0C35]" : "text-white"}`}>
                            PUTRA JAYA
                        </span>
                        <span className={`text-[10px] md:text-xs font-bold tracking-[0.2em] mt-0.5 ${isScrolled ? "text-[#F49414]" : "text-white/80"}`}>
                            TEKNIK MANDIRI
                        </span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`text-sm font-bold uppercase tracking-widest transition-colors hover:text-[#F49414] ${isScrolled ? "text-[#0B0C35]" : "text-white/90"}`}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Mobile Toggle Button */}
                <button className="md:hidden text-[#F49414] p-2" aria-label="Buka Menu Navigasi" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                    {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
            </nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="absolute top-full left-0 w-full bg-white shadow-2xl border-t border-gray-100 p-6 flex flex-col gap-4 md:hidden"
                    >
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="text-lg font-black text-[#0B0C35] hover:text-[#F49414] uppercase transition-colors border-b border-gray-50 pb-3"
                            >
                                {item.name}
                            </Link>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ScrollToTop() {
    const pathname = usePathname();

    useEffect(() => {
        // 1. Mematikan fitur bawaan browser yang suka mengingat posisi scroll
        if ('scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual';
        }

        // 2. Memaksa layar scroll ke koordinat paling atas (0, 0) secara instan setiap kali refresh / ganti halaman
        window.scrollTo(0, 0);
    }, [pathname]); // Akan berjalan setiap kali refresh atau pindah rute

    return null; // Komponen ini bekerja di balik layar, tidak menampilkan apa-apa
}
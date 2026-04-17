// src/app/(admin)/admin/penggajian/cetak-massal/PrintHandler.tsx
"use client";

import { Printer } from "lucide-react";
import { useEffect } from "react";

export default function PrintHandler({ total }: { total: number }) {
    useEffect(() => {
        // Hilangkan komentar (//) di bawah jika ingin otomatis print saat halaman dibuka
        // window.print();
    }, []);

    return (
        <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 md:gap-2 bg-slate-900 text-white py-2.5 px-4 md:px-5 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-900/20 hover:bg-slate-800 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all"
        >
            <Printer size={16} className="w-4 h-4 md:w-4.5 md:h-4.5" />
            <span className="hidden sm:inline">Cetak {total} Slip</span>
            <span className="sm:hidden">Cetak ({total})</span>
        </button>
    );
}
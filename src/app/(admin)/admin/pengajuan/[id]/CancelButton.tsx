"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react"; // Import ikon dari Lucide

export default function CancelButton({
    projectId,
    action
}: {
    projectId: string;
    action: (id: string) => Promise<void>;
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleConfirm = async () => {
        setIsPending(true); // Mulai loading
        try {
            await action(projectId);
            setIsModalOpen(false); // Tutup modal jika sukses
        } catch (error) {
            console.error("Gagal:", error);
            alert("Terjadi kesalahan sistem saat membatalkan.");
            setIsPending(false); // Matikan loading jika gagal
        }
    };

    return (
        <div className="px-5 md:px-8 pb-5 md:pb-8 pt-0">

            {/* 1. TOMBOL PEMICU UTAMA */}
            <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="w-full font-bold py-3 md:py-3.5 rounded-xl md:rounded-2xl transition-all text-[10px] md:text-xs tracking-widest bg-transparent border border-red-200 text-red-600 hover:bg-red-50"
            >
                BATALKAN PENGAJUAN
            </button>

            {/* 2. OVERLAY & KOTAK MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">

                    {/* BINGKAI MODAL */}
                    <div className="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">

                        {/* BAGIAN ATAS (KONTEN) */}
                        <div className="p-6 md:p-8 text-center relative">
                            {/* Tombol Silang (Close) */}
                            <button
                                onClick={() => !isPending && setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all"
                                disabled={isPending}
                            >
                                <X size={20} />
                            </button>

                            {/* Ikon Alert */}
                            <div className="mx-auto w-16 h-16 bg-red-50 text-red-500 border border-red-100 rounded-full flex items-center justify-center mb-4 md:mb-5">
                                <AlertTriangle size={32} />
                            </div>

                            <h3 className="text-lg md:text-xl font-black text-slate-900 uppercase tracking-tight mb-2">
                                Batalkan Pengajuan?
                            </h3>
                            <p className="text-[11px] md:text-xs text-slate-500 leading-relaxed px-2">
                                Apakah Anda yakin ingin membatalkan pengajuan proyek ini? Data yang sudah dibatalkan <strong className="text-slate-700">tidak dapat dikembalikan</strong>.
                            </p>
                        </div>

                        {/* BAGIAN BAWAH (TOMBOL AKSI) */}
                        <div className="bg-slate-50 p-4 md:p-5 flex flex-col sm:flex-row gap-2 sm:gap-3 border-t border-slate-100">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={isPending}
                                className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all text-[10px] md:text-xs tracking-widest hover:bg-slate-100 disabled:opacity-50"
                            >
                                KEMBALI
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                disabled={isPending}
                                className="flex-1 bg-red-600 text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all text-[10px] md:text-xs tracking-widest shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:bg-red-400 disabled:shadow-none flex items-center justify-center gap-2"
                            >
                                {isPending ? (
                                    <>
                                        {/* Ikon Spinner Loading */}
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        MEMPROSES...
                                    </>
                                ) : (
                                    "YA, BATALKAN"
                                )}
                            </button>
                        </div>
                    </div>

                </div>
            )}
        </div>
    );
}
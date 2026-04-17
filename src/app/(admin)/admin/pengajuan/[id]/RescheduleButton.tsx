"use client";

import { useState } from "react";
import { CalendarClock, X } from "lucide-react";
import { rescheduleProyek } from "./actions";

export default function RescheduleButton({
    projectId,
    currentStart,
    currentEnd
}: {
    projectId: string;
    currentStart: any;
    currentEnd: any;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    // Fungsi untuk mem-parsing tanggal agar aman dari error null
    const defaultStart = currentStart ? new Date(currentStart).toISOString().split('T')[0] : "";
    const defaultEnd = currentEnd ? new Date(currentEnd).toISOString().split('T')[0] : "";

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true); // Nyalakan efek loading
        try {
            await rescheduleProyek(projectId, formData);
            setIsOpen(false); // Tutup modal setelah sukses
        } catch (error) {
            console.error("Gagal mengubah jadwal:", error);
            alert("Terjadi kesalahan sistem saat menyimpan jadwal.");
        } finally {
            setIsPending(false); // Matikan efek loading
        }
    };

    return (
        <>
            {/* TOMBOL PEMICU */}
            <button
                onClick={() => setIsOpen(true)}
                className="flex w-full md:w-auto items-center justify-center md:justify-start gap-2 text-[10px] md:text-xs font-black text-amber-600 bg-amber-50 px-4 py-3 md:py-2.5 rounded-xl border border-amber-200 hover:bg-amber-100 transition-all uppercase tracking-widest"
            >
                <CalendarClock size={16} className="md:w-3.5 md:h-3.5" /> RESCHEDULE JADWAL
            </button>

            {/* OVERLAY & KOTAK MODAL */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">

                    <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                        {/* Garis Aksen */}
                        <div className="bg-amber-500 h-2 w-full"></div>

                        {/* HEADER MODAL */}
                        <div className="p-5 md:p-8 relative">
                            <button
                                onClick={() => !isPending && setIsOpen(false)}
                                disabled={isPending}
                                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-all disabled:opacity-50"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex items-center gap-3 mb-6 md:mb-8">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center border border-amber-100 shrink-0">
                                    <CalendarClock size={20} className="md:w-6 md:h-6" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-black text-slate-900 uppercase tracking-tight">Atur Ulang Jadwal</h3>
                                    <p className="text-[10px] md:text-xs text-slate-500 mt-0.5">Ubah estimasi tanggal proyek.</p>
                                </div>
                            </div>

                            {/* FORM INPUT */}
                            <form action={handleSubmit} className="space-y-4 md:space-y-5">
                                <div>
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1.5 md:mb-2">Tanggal Mulai Baru</label>
                                    <input
                                        name="startDate"
                                        type="date"
                                        required
                                        defaultValue={defaultStart}
                                        disabled={isPending}
                                        className="w-full px-4 py-3 md:py-3.5 text-black bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-sm focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-50 transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1.5 md:mb-2">Estimasi Selesai Baru</label>
                                    <input
                                        name="endDate"
                                        type="date"
                                        required
                                        defaultValue={defaultEnd}
                                        disabled={isPending}
                                        className="w-full px-4 py-3 md:py-3.5 text-black bg-slate-50 border border-slate-200 rounded-xl md:rounded-2xl text-sm focus:ring-2 focus:ring-amber-500 outline-none disabled:opacity-50 transition-all"
                                    />
                                </div>

                                {/* AREA TOMBOL BAWAH */}
                                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 md:pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        disabled={isPending}
                                        className="w-full sm:w-1/3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all text-[10px] md:text-xs tracking-widest hover:bg-slate-100 disabled:opacity-50 order-2 sm:order-1"
                                    >
                                        BATAL
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="w-full sm:w-2/3 bg-slate-900 text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-slate-800 transition-all text-[10px] md:text-xs tracking-widest shadow-lg shadow-slate-900/20 disabled:opacity-70 flex items-center justify-center gap-2 order-1 sm:order-2"
                                    >
                                        {isPending ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                MENYIMPAN...
                                            </>
                                        ) : (
                                            "SIMPAN PERUBAHAN"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
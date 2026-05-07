// src/app/(admin)/admin/pengajuan/DeleteProjectButton.tsx
"use client";

import { Trash2, AlertTriangle } from "lucide-react";
import { useState, useTransition } from "react";
import { hapusPengajuan } from "./[id]/actions"; // Sesuaikan path jika berbeda

export default function DeleteProjectButton({ projectId, projectTitle }: { projectId: string, projectTitle: string }) {
    const [isPending, startTransition] = useTransition();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleConfirmDelete = () => {
        startTransition(async () => {
            const result = await hapusPengajuan(projectId);
            if (!result.success) {
                alert(result.error);
            }
            // Tutup modal setelah proses selesai
            setIsModalOpen(false);
        });
    };

    return (
        <>
            {/* TOMBOL UTAMA (ICONT TRASH) */}
            <button
                onClick={() => setIsModalOpen(true)}
                disabled={isPending}
                title="Hapus Proyek (Permanen)"
                className="p-2 md:p-2.5 bg-red-50 text-red-600 rounded-lg md:rounded-xl hover:bg-red-600 hover:text-white transition-all border border-red-100 disabled:opacity-50 disabled:cursor-wait"
            >
                <Trash2 size={16} className="md:w-[18px] md:h-[18px]" />
            </button>

            {/* POP UP MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 print:hidden transition-opacity">
                    {/* Kotak Modal */}
                    <div className="bg-white w-full max-w-md rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">

                        {/* Konten Atas */}
                        <div className="p-6 sm:p-8 text-center sm:text-left">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
                                {/* Icon Peringatan */}
                                <div className="bg-red-100 text-red-600 p-3 sm:p-4 rounded-full shrink-0">
                                    <AlertTriangle size={28} className="sm:w-8 sm:h-8" />
                                </div>

                                {/* Teks Peringatan */}
                                <div>
                                    <h3 className="text-lg sm:text-xl font-black text-slate-900 mb-2">Hapus Proyek Permanen?</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        Apakah Anda yakin ingin menghapus proyek <strong className="text-slate-900">"{projectTitle}"</strong>?
                                    </p>
                                    <p className="text-xs sm:text-sm text-red-600 font-medium mt-3 bg-red-50 p-3 rounded-lg border border-red-100">
                                        Semua Jadwal, Termin, SPK, BAP, dan Invoice yang terhubung juga akan ikut terhapus selamanya dan tidak bisa dikembalikan.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Konten Bawah (Tombol Aksi) */}
                        <div className="bg-slate-50 p-4 sm:px-8 sm:py-5 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t border-slate-100">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={isPending}
                                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-all disabled:opacity-50"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                disabled={isPending}
                                className="w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isPending ? (
                                    "Menghapus..."
                                ) : (
                                    <>
                                        <Trash2 size={16} /> Ya, Hapus Permanen
                                    </>
                                )}
                            </button>
                        </div>

                    </div>
                </div>
            )}
        </>
    );
}
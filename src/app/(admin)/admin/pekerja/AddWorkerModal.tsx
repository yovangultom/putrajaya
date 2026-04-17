// src/app/(admin)/admin/pekerja/AddWorkerModal.tsx
"use client";

import { useState } from "react";
import { Plus, X, HardHat } from "lucide-react";
import { tambahPekerja } from "./actions";

export default function AddWorkerModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        try {
            const formData = new FormData(e.currentTarget);
            await tambahPekerja(formData);
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan data pekerja.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 md:py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all text-sm uppercase tracking-widest"
            >
                <Plus size={18} /> TAMBAH PEKERJA
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
                        <div className="bg-blue-600 h-2 w-full"></div>
                        <div className="p-6 md:p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-50 text-blue-600 p-2 rounded-xl">
                                        <HardHat size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-black text-slate-900 uppercase tracking-tight">Data Pekerja</h3>
                                        <p className="text-[10px] text-slate-800 mt-0.5">Daftarkan tukang atau kenek baru.</p>
                                    </div>
                                </div>
                                <button onClick={() => !isPending && setIsOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-all">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
                                <div>
                                    <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1.5">Nama Lengkap</label>
                                    <input name="name" required disabled={isPending} placeholder="Contoh: Budi Santoso" className="w-full px-4 py-3 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all disabled:opacity-50" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1.5">Posisi / Peran</label>
                                    <select name="role" required disabled={isPending} className="w-full px-4 py-3 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all disabled:opacity-50 appearance-none font-medium">
                                        <option value="Tukang">Tukang</option>
                                        <option value="Kenek">Kenek</option>
                                        <option value="Mandor">Mandor</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-black uppercase tracking-widest block mb-1.5">Gaji Pokok / Hari (Lembur Otomatis /8)</label>
                                    <input name="dailyWage" type="number" required disabled={isPending} placeholder="150000" className="w-full px-4 py-3 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all disabled:opacity-50" />
                                </div>

                                <button type="submit" disabled={isPending} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl hover:bg-blue-700 transition-all text-xs tracking-widest mt-2 shadow-lg shadow-blue-600/20 disabled:opacity-70">
                                    {isPending ? "MENYIMPAN..." : "SIMPAN PEKERJA"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
"use client";

import { useState } from "react";
import { Plus, X, Trash2 } from "lucide-react";
import { tambahPengeluaran } from "./actions";

export default function AddExpenseModal({ projectId }: { projectId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);

    // State untuk menyimpan daftar pengeluaran (default 1 baris kosong)
    const [items, setItems] = useState([{ description: "", amount: "" }]);

    const handleTambahBaris = () => setItems([...items, { description: "", amount: "" }]);

    const handleHapusBaris = (index: number) => {
        const barisBaru = [...items];
        barisBaru.splice(index, 1);
        setItems(barisBaru);
    };

    const handleUbahItem = (index: number, field: string, value: string) => {
        const barisBaru = [...items] as any;
        barisBaru[index][field] = value;
        setItems(barisBaru);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        try {
            // Konversi amount string ke number sebelum dikirim
            const payload = items.map(item => ({
                description: item.description,
                amount: Number(item.amount) || 0
            }));

            await tambahPengeluaran(projectId, payload);

            // Reset modal setelah sukses
            setItems([{ description: "", amount: "" }]);
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            alert("Gagal mencatat pengeluaran. Pastikan input tidak kosong.");
        } finally {
            setIsPending(false);
        }
    };

    // Hitung total sementara di dalam modal
    const totalSementara = items.reduce((total, item) => total + (Number(item.amount) || 0), 0);
    const formatRp = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center gap-2 text-[10px] md:text-xs font-black text-blue-600 bg-blue-50 border border-blue-200 px-4 py-2.5 rounded-xl hover:bg-blue-100 transition-all uppercase tracking-widest whitespace-nowrap"
            >
                <Plus size={16} /> <span className="hidden sm:inline">Catat Pengeluaran</span><span className="sm:hidden">Catat</span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                        <div className="bg-blue-600 h-2 w-full shrink-0"></div>

                        {/* Header Modal */}
                        <div className="p-5 md:p-6 pb-4 border-b border-slate-100 flex justify-between items-center shrink-0">
                            <div>
                                <h3 className="font-black text-black uppercase tracking-tight">Catat Pengeluaran</h3>
                                <p className="text-[10px] text-slate-800 mt-0.5">Biaya bensin, material, atau konsumsi.</p>
                            </div>
                            <button onClick={() => !isPending && setIsOpen(false)} className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-all">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Body Modal (Scrollable) */}
                        <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden">
                            <div className="p-5 md:p-6 overflow-y-auto space-y-4 flex-1">
                                {items.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 bg-slate-50 p-3 md:p-4 rounded-2xl border border-slate-200 relative">
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Deskripsi</label>
                                                <input
                                                    value={item.description}
                                                    onChange={(e) => handleUbahItem(index, 'description', e.target.value)}
                                                    placeholder="Cth: Bensin Mobil"
                                                    required
                                                    disabled={isPending}
                                                    className="w-full px-3 py-2 md:py-2.5 text-black bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none transition-all disabled:opacity-50"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] md:text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Nominal (Rp)</label>
                                                <input
                                                    value={item.amount}
                                                    onChange={(e) => handleUbahItem(index, 'amount', e.target.value)}
                                                    type="number"
                                                    placeholder="50000"
                                                    required
                                                    disabled={isPending}
                                                    className="w-full px-3 py-2 md:py-2.5 text-black bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none transition-all disabled:opacity-50"
                                                />
                                            </div>
                                        </div>
                                        {/* Tombol Hapus Baris */}
                                        {items.length > 1 && (
                                            <button type="button" onClick={() => handleHapusBaris(index)} disabled={isPending} className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-xl transition-all disabled:opacity-50 mt-5">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                ))}

                                <button type="button" onClick={handleTambahBaris} disabled={isPending} className="w-full py-3 text-[10px] md:text-xs font-bold text-blue-600 bg-blue-50/50 border border-dashed border-blue-200 rounded-xl hover:bg-blue-50 transition-all uppercase tracking-widest disabled:opacity-50">
                                    + Tambah Baris Pengeluaran
                                </button>
                            </div>

                            {/* Footer Modal (Fixed di bawah) */}
                            <div className="p-5 md:p-6 bg-white border-t border-slate-100 shrink-0">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">Total Tambahan</span>
                                    <span className="text-sm md:text-base font-black text-slate-900">{formatRp(totalSementara)}</span>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <button type="button" onClick={() => setIsOpen(false)} disabled={isPending} className="w-full sm:w-1/3 bg-white border border-slate-200 text-slate-700 font-bold py-3.5 rounded-xl transition-all text-[10px] tracking-widest hover:bg-slate-100 disabled:opacity-50 order-2 sm:order-1">
                                        BATAL
                                    </button>
                                    <button type="submit" disabled={isPending} className="w-full sm:w-2/3 bg-blue-600 text-white font-black py-3.5 rounded-xl hover:bg-blue-700 transition-all text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 disabled:opacity-70 order-1 sm:order-2">
                                        {isPending ? "MENYIMPAN..." : "SIMPAN SEMUA"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
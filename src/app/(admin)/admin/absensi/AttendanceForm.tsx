// src/app/(admin)/admin/absensi/AttendanceForm.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Save, Calendar, Clock, CheckSquare, Users, Info, RefreshCw, CheckCircle } from "lucide-react"; // Tambahkan CheckCircle
import { simpanAbsensi } from "./actions";

export default function AttendanceForm({
    workers,
    existingData,
    selectedDate
}: {
    workers: any[],
    existingData: any[],
    selectedDate: string
}) {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);

    // STATE BARU: Untuk mengontrol munculnya Modal Sukses
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const isEditMode = existingData.length > 0;

    const [attendanceState, setAttendanceState] = useState(() => {
        return workers.map(worker => {
            const existing = existingData.find(a => a.workerId === worker.id);
            return {
                workerId: worker.id,
                name: worker.name,
                role: worker.role,
                status: existing ? existing.status : 1.0,
                overtimeHours: existing ? existing.overtimeHours : 0,
            };
        });
    });

    const handleTandaiSemuaHadir = () => {
        const newData = attendanceState.map(item => ({ ...item, status: 1.0 }));
        setAttendanceState(newData);
    };

    const ringkasan = useMemo(() => {
        return attendanceState.reduce((acc, curr) => {
            if (curr.status === 1.0) acc.hadir++;
            else if (curr.status === 0.5) acc.setengah++;
            else acc.libur++;
            return acc;
        }, { hadir: 0, setengah: 0, libur: 0 });
    }, [attendanceState]);

    const handleUbahStatus = (index: number, status: number) => {
        const newData = [...attendanceState];
        newData[index].status = status;

        if (status === 0.0) {
            newData[index].overtimeHours = 0;
        }

        setAttendanceState(newData);
    };

    const handleUbahLembur = (index: number, jam: string) => {
        const newData = [...attendanceState];
        newData[index].overtimeHours = Number(jam);
        setAttendanceState(newData);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        try {
            await simpanAbsensi(selectedDate, attendanceState);
            // HAPUS alert(), ganti dengan memunculkan modal
            setShowSuccessModal(true);
        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan absensi. Periksa koneksi Anda.");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-6">

                <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 p-5 md:p-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
                        <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 hidden sm:block">
                            <Calendar size={24} />
                        </div>
                        <div className="w-full sm:w-auto">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Pilih Tanggal Absensi</label>
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => router.push(`/admin/absensi?date=${e.target.value}`)}
                                className="w-full sm:w-48 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none transition-all cursor-pointer"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 md:gap-6 w-full lg:w-auto bg-slate-50 lg:bg-transparent p-4 lg:p-0 rounded-2xl border border-slate-100 lg:border-none">
                        <div className="text-center flex-1 lg:flex-none">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Hadir</p>
                            <p className="text-xl font-black text-green-600">{ringkasan.hadir}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                        <div className="text-center flex-1 lg:flex-none">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">1/2 Hari</p>
                            <p className="text-xl font-black text-amber-500">{ringkasan.setengah}</p>
                        </div>
                        <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>
                        <div className="text-center flex-1 lg:flex-none">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Libur</p>
                            <p className="text-xl font-black text-red-500">{ringkasan.libur}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-slate-900 px-5 py-4 flex justify-between items-center">
                        <h3 className="font-black text-white uppercase tracking-widest text-xs flex items-center gap-2">
                            <Users size={16} className="text-blue-400" /> Daftar Pekerja
                        </h3>
                        <button
                            type="button"
                            onClick={handleTandaiSemuaHadir}
                            className="flex items-center gap-1.5 text-[9px] md:text-[10px] font-bold text-slate-900 bg-white px-3 py-1.5 rounded-lg hover:bg-slate-200 transition-all uppercase tracking-widest"
                        >
                            <CheckSquare size={14} /> <span className="hidden sm:inline">Set Semua Hadir</span><span className="sm:hidden">Semua Hadir</span>
                        </button>
                    </div>

                    {isEditMode && (
                        <div className="bg-amber-50 border-b border-amber-200 px-5 py-3 md:px-6 md:py-4 flex items-start sm:items-center gap-3">
                            <Info size={20} className="text-amber-500 shrink-0 mt-0.5 sm:mt-0" />
                            <div>
                                <p className="text-xs md:text-sm text-amber-800 font-bold">Data sudah tersimpan sebelumnya.</p>
                                <p className="text-[10px] md:text-xs text-amber-700 mt-0.5">Anda dapat mengubah status kehadiran/lembur di bawah ini, lalu klik tombol Perbarui untuk meralat data.</p>
                            </div>
                        </div>
                    )}

                    <div className="divide-y divide-slate-100">
                        {attendanceState.map((item, index) => (
                            <div key={item.workerId} className="p-4 md:p-5 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 hover:bg-slate-50/50 transition-colors">

                                <div className="w-full xl:w-1/3 flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-black text-sm shrink-0 border border-slate-200">
                                        {item.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-black text-slate-900 text-sm md:text-base leading-tight">{item.name}</p>
                                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mt-0.5">{item.role}</p>
                                    </div>
                                </div>

                                <div className="w-full xl:w-2/3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">

                                    <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto border border-slate-200">
                                        <button type="button" onClick={() => handleUbahStatus(index, 1.0)} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${item.status === 1.0 ? 'bg-white text-green-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                            Hadir
                                        </button>
                                        <button type="button" onClick={() => handleUbahStatus(index, 0.5)} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${item.status === 0.5 ? 'bg-white text-amber-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                            1/2 Hari
                                        </button>
                                        <button type="button" onClick={() => handleUbahStatus(index, 0.0)} className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-[10px] md:text-xs font-black uppercase tracking-widest transition-all ${item.status === 0.0 ? 'bg-white text-red-500 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                                            Libur
                                        </button>
                                    </div>

                                    <div className="w-full sm:w-32 relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                                            <Clock size={14} />
                                        </div>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            placeholder="Lembur (Jam)"
                                            value={item.overtimeHours || ""}
                                            onChange={(e) => handleUbahLembur(index, e.target.value)}
                                            disabled={item.status === 0.0}
                                            className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50 disabled:bg-slate-100 placeholder-slate-400 transition-all"
                                        />
                                    </div>
                                </div>

                            </div>
                        ))}

                        {workers.length === 0 && (
                            <div className="p-10 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                    <Users size={32} />
                                </div>
                                <p className="text-slate-500 font-medium text-sm">Belum ada pekerja terdaftar.</p>
                                <p className="text-xs text-slate-400 mt-1">Silakan tambah pekerja di menu Master Pekerja terlebih dahulu.</p>
                            </div>
                        )}
                    </div>

                    <div className="p-4 md:p-6 bg-slate-50 border-t border-slate-200 flex justify-end sticky bottom-0 z-10 shadow-[0_-4px_6px_-1px_rgb(0,0,0,0.05)]">
                        <button type="submit" disabled={isPending || workers.length === 0} className={`w-full sm:w-auto text-white font-black py-3.5 px-8 rounded-xl md:rounded-2xl transition-all text-xs tracking-widest flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 active:scale-[0.98] ${isEditMode ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'}`}>
                            {isPending ? (
                                "MEMPROSES..."
                            ) : isEditMode ? (
                                <><RefreshCw size={18} /> PERBARUI ABSENSI</>
                            ) : (
                                <><Save size={18} /> SIMPAN ABSENSI HARI INI</>
                            )}
                        </button>
                    </div>
                </div>
            </form>

            {/* MODAL SUKSES */}
            {showSuccessModal && (
                <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] w-full max-w-sm shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 border border-slate-200 relative">

                        {/* Garis Atas Dinamis (Hijau untuk Baru, Kuning untuk Edit) */}
                        <div className={`absolute top-0 left-0 right-0 h-2 w-full ${isEditMode ? 'bg-amber-500' : 'bg-green-500'}`}></div>

                        <div className="p-6 md:p-8 flex flex-col items-center text-center mt-2">
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 border ${isEditMode ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100'}`}>
                                <CheckCircle size={32} className={isEditMode ? 'text-amber-500' : 'text-green-600'} />
                            </div>

                            <h2 className="text-xl font-black text-slate-900 mb-2 uppercase tracking-tight">
                                {isEditMode ? "Berhasil Diperbarui!" : "Berhasil Disimpan!"}
                            </h2>

                            <p className="text-slate-500 text-xs mb-8 leading-relaxed px-2">
                                Data kehadiran untuk tanggal <strong className="text-slate-800">{new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</strong> telah direkam ke dalam sistem.
                            </p>

                            <div className="w-full flex flex-col gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setShowSuccessModal(false)}
                                    className="w-full bg-slate-900 text-white font-black py-3.5 rounded-xl hover:bg-slate-800 transition-all text-[10px] uppercase tracking-widest shadow-lg shadow-slate-900/20 active:scale-[0.98]"
                                >
                                    TUTUP & LANJUTKAN
                                </button>
                                <button
                                    type="button"
                                    onClick={() => router.push('/admin/penggajian')}
                                    className="w-full bg-white text-slate-700 font-bold py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all text-[10px] uppercase tracking-widest active:scale-[0.98]"
                                >
                                    CEK DATA PENGGAJIAN
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
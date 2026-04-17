// src/app/(admin)/admin/pekerja/page.tsx
import { prisma } from "@/lib/prisma";
import { Users, HardHat, Trash2 } from "lucide-react";
import AddWorkerModal from "./AddWorkerModal";
import { hapusPekerja } from "./actions";

export default async function DaftarPekerjaPage() {
    const workers = await prisma.worker.findMany({
        orderBy: { role: "desc" } // Urutkan berdasarkan Peran (Mandor -> Tukang -> Kenek)
    });

    const formatRp = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                        <Users className="text-blue-600 w-8 h-8" /> MASTER PEKERJA
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 mt-1 uppercase tracking-widest font-medium">
                        Kelola data tukang, kenek, dan standar gaji
                    </p>
                </div>
                <AddWorkerModal />
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                {/* TAMPILAN DESKTOP (TABEL) */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-5">Informasi Pekerja</th>
                                <th className="px-6 py-5">Gaji Harian</th>
                                <th className="px-6 py-5">Upah Lembur</th>
                                <th className="px-6 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {workers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-slate-400 italic">Belum ada data pekerja.</td>
                                </tr>
                            ) : (
                                workers.map((worker) => (
                                    <tr key={worker.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 flex items-center gap-3">
                                            <div className="bg-slate-100 p-2.5 rounded-xl text-slate-500">
                                                <HardHat size={20} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900 text-base">{worker.name}</div>
                                                <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5 tracking-widest">{worker.role}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-slate-900">{formatRp(worker.dailyWage)}</div>
                                            <div className="text-[9px] text-slate-400 uppercase tracking-widest">Per Hari Penuh</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-700">{formatRp(worker.overtimeRatePerHour)}</div>
                                            <div className="text-[9px] text-slate-400 uppercase tracking-widest">Per Jam</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <form action={async () => {
                                                "use server";
                                                await hapusPekerja(worker.id);
                                            }}>
                                                <button type="submit" className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-100" title="Hapus Pekerja">
                                                    <Trash2 size={16} />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* TAMPILAN MOBILE (KARTU) */}
                <div className="md:hidden flex flex-col divide-y divide-slate-100">
                    {workers.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 italic text-sm">Belum ada data pekerja.</div>
                    ) : (
                        workers.map((worker) => (
                            <div key={worker.id} className="p-5 bg-white flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-slate-100 p-2 rounded-xl text-slate-500">
                                            <HardHat size={20} />
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-900 text-sm">{worker.name}</div>
                                            <div className="text-[9px] text-slate-500 font-bold uppercase mt-0.5 tracking-widest">{worker.role}</div>
                                        </div>
                                    </div>
                                    <form action={async () => {
                                        "use server";
                                        await hapusPekerja(worker.id);
                                    }}>
                                        <button type="submit" className="text-red-400 hover:text-red-600 p-2 bg-red-50 rounded-lg">
                                            <Trash2 size={16} />
                                        </button>
                                    </form>
                                </div>
                                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100">
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Gaji Pokok / Hari</p>
                                        <p className="font-bold text-slate-900 text-sm">{formatRp(worker.dailyWage)}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Lembur / Jam</p>
                                        <p className="font-bold text-slate-900 text-sm">{formatRp(worker.overtimeRatePerHour)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
// src/app/(admin)/admin/jadwal/page.tsx
import { prisma } from "@/lib/prisma";
import { Calendar, MapPin, User, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function JadwalPage() {
    const projects = await prisma.project.findMany({
        where: {
            status: { in: ["DEAL_SCHEDULED", "IN_PROGRESS", "COMPLETED_INVOICED", "PAID"] },
            startDate: { not: null }
        },
        orderBy: { startDate: "desc" }
    });

    const formatDate = (date: Date) => date.toLocaleDateString("id-ID", {
        day: 'numeric', month: 'short', year: 'numeric'
    });

    return (
        // 1. Hapus 'flex flex-col items-center' agar konten rata kiri (kiri-atas)
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen print:bg-white">
            {/* 2. Ubah 'max-w-4xl' menjadi 'w-full' (atau max-w-7xl jika tidak ingin terlalu mentok layar) */}
            <div className="w-full">
                <div className="mb-8">
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Monitoring Jadwal Lapangan</h1>
                    <p className="text-sm text-slate-500 italic">Daftar rencana kerja dan realisasi di lapangan.</p>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {projects.map((p) => {
                        const isFinished = p.status === "COMPLETED_INVOICED" || p.status === "PAID";
                        const isStarted = p.status === "IN_PROGRESS";
                        const isFinishedEarly = isFinished && p.actualEndDate && p.actualEndDate < p.endDate!;

                        // LOGIKA STATUS DINAMIS
                        let statusLabel = "TERJADWAL";
                        let statusColor = "bg-purple-50 border-purple-200 text-purple-700";
                        let barColor = "bg-purple-500";

                        if (isStarted) {
                            statusLabel = "BERJALAN";
                            statusColor = "bg-blue-50 border-blue-200 text-blue-700";
                            barColor = "bg-blue-600";
                        } else if (isFinished) {
                            statusLabel = "SELESAI";
                            statusColor = "bg-green-50 border-green-200 text-green-700";
                            barColor = "bg-green-500";
                        }

                        return (
                            <div key={p.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row">
                                {/* Bar Status Warna Samping - MENGGUNAKAN barColor */}
                                <div className={`w-full md:w-3 h-3 md:h-auto ${barColor}`}></div>

                                <div className="p-6 flex-1">
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                        <div>
                                            <h2 className="text-xl font-black text-slate-900 uppercase leading-tight">{p.title}</h2>
                                            <div className="flex items-center gap-2 mt-1 text-slate-500">
                                                <User size={14} />
                                                <span className="text-xs font-bold">Klien: {p.clientName}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            {/* Badge Status - MENGGUNAKAN statusColor & statusLabel */}
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${statusColor}`}>
                                                {statusLabel}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4 border-y border-slate-100 mb-4">
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <Clock size={12} /> Jadwal Rencana
                                            </p>
                                            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <p className="text-sm font-bold text-slate-800">
                                                    {formatDate(p.startDate!)} — {formatDate(p.endDate!)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                                <CheckCircle2 size={12} /> Realisasi Lapangan
                                            </p>
                                            <div className={`p-3 rounded-2xl border ${isFinished ? 'bg-green-50 border-green-100' : 'bg-slate-50 border-slate-100'}`}>
                                                <p className="text-sm font-bold text-slate-800">
                                                    {/* Teks Realisasi Dinamis */}
                                                    {isFinished
                                                        ? formatDate(p.actualEndDate!)
                                                        : isStarted
                                                            ? "Sedang Dikerjakan..."
                                                            : "Menunggu Mulai..."
                                                    }
                                                </p>
                                                {isFinishedEarly && (
                                                    <span className="text-[9px] font-black text-green-600 uppercase tracking-tighter block mt-1">
                                                        ⚡ Selesai Lebih Cepat
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-slate-600 mb-6">
                                        <MapPin size={16} className="text-blue-600" />
                                        <p className="text-xs leading-relaxed font-medium">{p.projectLocation}</p>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/admin/pengajuan/${p.id}`} className="w-full md:w-auto px-8 bg-slate-900 text-white text-center py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all">
                                            Detail Proyek
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}
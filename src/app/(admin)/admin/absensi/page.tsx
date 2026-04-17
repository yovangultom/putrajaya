// src/app/(admin)/admin/absensi/page.tsx
import { prisma } from "@/lib/prisma";
import { ClipboardList, CalendarDays, Search, FileSpreadsheet, CheckSquare } from "lucide-react";
import AttendanceForm from "./AttendanceForm";
import Link from "next/link";

export default async function AbsensiPage({ searchParams }: { searchParams: Promise<{ date?: string, view?: string, start?: string, end?: string }> }) {
    const params = await searchParams;
    const view = params.view || 'harian';

    // ==========================================
    // LOGIKA UNTUK TAB "PENCATATAN HARIAN"
    // ==========================================
    const selectedDateStr = params.date || new Date().toISOString().split('T')[0];
    const targetDate = new Date(selectedDateStr);
    targetDate.setHours(0, 0, 0, 0);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const [workersHarian, existingAttendances] = await Promise.all([
        prisma.worker.findMany({ orderBy: { role: 'desc' } }),
        prisma.attendance.findMany({
            where: {
                date: {
                    gte: targetDate,
                    lt: nextDay
                }
            }
        })
    ]);

    // ==========================================
    // LOGIKA UNTUK TAB "REKAPITULASI"
    // ==========================================
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const startRekapStr = params.start || firstDayOfMonth.toISOString().split('T')[0];
    const endRekapStr = params.end || today.toISOString().split('T')[0];

    const startRekapDate = new Date(startRekapStr);
    startRekapDate.setHours(0, 0, 0, 0);
    const endRekapDate = new Date(endRekapStr);
    endRekapDate.setHours(23, 59, 59, 999);

    const workersRekap = await prisma.worker.findMany({
        orderBy: { role: 'desc' },
        include: {
            attendances: {
                where: { date: { gte: startRekapDate, lte: endRekapDate } },
                orderBy: { date: 'asc' }
            }
        }
    });

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            {/* HEADER & TAB NAVIGASI */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-4 md:mb-6">
                    <ClipboardList className="text-blue-600 w-8 h-8" /> ABSENSI KARYAWAN
                </h1>

                {/* Sistem Tab */}
                <div className="flex gap-2 border-b border-slate-200 pb-px overflow-x-auto custom-scrollbar">
                    <Link
                        href="/admin/absensi?view=harian"
                        className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-xs md:text-sm uppercase tracking-widest transition-all shrink-0 ${view !== 'rekap' ? 'bg-blue-600 text-white' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-800'}`}
                    >
                        <CheckSquare size={16} /> Absensi
                    </Link>
                    <Link
                        href="/admin/absensi?view=rekap"
                        className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-xs md:text-sm uppercase tracking-widest transition-all shrink-0 ${view === 'rekap' ? 'bg-blue-600 text-white' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-800'}`}
                    >
                        <FileSpreadsheet size={16} /> Rekapitulasi
                    </Link>
                </div>
            </div>

            {/* KONTEN TAB: PENCATATAN HARIAN */}
            {view !== 'rekap' && (
                <div className="animate-in fade-in duration-300">
                    <p className="text-xs md:text-sm text-slate-500 mb-4 uppercase tracking-widest font-bold">
                        Catat kehadiran dan lembur harian
                    </p>
                    <AttendanceForm
                        workers={workersHarian}
                        existingData={existingAttendances}
                        selectedDate={selectedDateStr}
                    />
                </div>
            )}

            {/* KONTEN TAB: REKAPITULASI */}
            {view === 'rekap' && (
                <div className="animate-in fade-in duration-300">

                    {/* Filter Tanggal Rekap */}
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                        <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-bold">
                            Ringkasan kehadiran karyawan
                        </p>

                        <form className="flex flex-col sm:flex-row w-full xl:w-auto items-start sm:items-center bg-white p-1.5 rounded-2xl md:rounded-full border border-slate-200 shadow-sm gap-2 sm:gap-0">
                            <input type="hidden" name="view" value="rekap" />
                            <div className="hidden sm:flex items-center px-4 text-blue-600">
                                <CalendarDays size={20} />
                            </div>

                            <div className="flex w-full sm:w-auto items-center border-b sm:border-b-0 sm:border-l border-slate-100 px-2 pb-2 sm:pb-0">
                                <div className="flex flex-col flex-1 px-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Dari</span>
                                    <input
                                        type="date"
                                        name="start"
                                        defaultValue={startRekapStr}
                                        className="bg-transparent px-1 py-1 text-sm font-bold text-slate-800 outline-none cursor-pointer w-full"
                                    />
                                </div>
                                <span className="text-slate-300 font-light text-2xl px-2">/</span>
                                <div className="flex flex-col flex-1 px-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Sampai</span>
                                    <input
                                        type="date"
                                        name="end"
                                        defaultValue={endRekapStr}
                                        className="bg-transparent px-1 py-1 text-sm font-bold text-slate-800 outline-none cursor-pointer w-full"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                                <Search size={14} /> Filter
                            </button>
                        </form>
                    </div>

                    {/* ========================================= */}
                    {/* 1. TAMPILAN DESKTOP (TABEL) */}
                    {/* ========================================= */}
                    <div className="hidden md:block bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-widest">
                                    <tr>
                                        <th className="px-6 py-5">Nama Pekerja</th>
                                        <th className="px-6 py-5 text-center bg-green-900/40">Hadir (1)</th>
                                        <th className="px-6 py-5 text-center bg-yellow-900/40">Setengah (0.5)</th>
                                        <th className="px-6 py-5 text-center bg-red-900/40">Alpha (0)</th>
                                        <th className="px-6 py-5 text-center bg-blue-900/40 border-l border-slate-700">Total Lembur</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {workersRekap.map((worker) => {
                                        const hadirPenuh = worker.attendances.filter(a => a.status === 1).length;
                                        const setengahHari = worker.attendances.filter(a => a.status === 0.5).length;
                                        const alpha = worker.attendances.filter(a => a.status === 0).length;
                                        const totalLembur = worker.attendances.reduce((acc, curr) => acc + curr.overtimeHours, 0);

                                        return (
                                            <tr key={`desktop-${worker.id}`} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-900">{worker.name}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{worker.role}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="font-black text-green-600">{hadirPenuh}</span> <span className="text-[10px] text-slate-400">Hari</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="font-black text-yellow-600">{setengahHari}</span> <span className="text-[10px] text-slate-400">Hari</span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <span className="font-black text-red-600">{alpha}</span> <span className="text-[10px] text-slate-400">Hari</span>
                                                </td>
                                                <td className="px-6 py-4 text-center border-l border-slate-100">
                                                    <span className="font-black text-blue-600 text-base">{totalLembur}</span> <span className="text-[10px] text-slate-400">Jam</span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ========================================= */}
                    {/* 2. TAMPILAN MOBILE (KARTU / CARDS) */}
                    {/* ========================================= */}
                    <div className="md:hidden flex flex-col gap-4">
                        {workersRekap.map((worker) => {
                            const hadirPenuh = worker.attendances.filter(a => a.status === 1).length;
                            const setengahHari = worker.attendances.filter(a => a.status === 0.5).length;
                            const alpha = worker.attendances.filter(a => a.status === 0).length;
                            const totalLembur = worker.attendances.reduce((acc, curr) => acc + curr.overtimeHours, 0);

                            return (
                                <div key={`mobile-${worker.id}`} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                                    {/* Header Kartu: Nama & Jabatan */}
                                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-900 text-base">{worker.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{worker.role}</p>
                                        </div>
                                    </div>

                                    {/* Grid Statistik */}
                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <div className="bg-green-50 p-2.5 rounded-xl border border-green-100 flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-green-800 uppercase tracking-widest">Hadir</span>
                                            <span className="font-black text-green-600 text-sm">{hadirPenuh} <span className="text-[9px] font-medium text-green-600/70">Hari</span></span>
                                        </div>
                                        <div className="bg-yellow-50 p-2.5 rounded-xl border border-yellow-100 flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-yellow-800 uppercase tracking-widest">1/2 Hari</span>
                                            <span className="font-black text-yellow-600 text-sm">{setengahHari} <span className="text-[9px] font-medium text-yellow-600/70">Hari</span></span>
                                        </div>
                                        <div className="bg-red-50 p-2.5 rounded-xl border border-red-100 flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-red-800 uppercase tracking-widest">Alpha</span>
                                            <span className="font-black text-red-600 text-sm">{alpha} <span className="text-[9px] font-medium text-red-600/70">Hari</span></span>
                                        </div>
                                        <div className="bg-blue-50 p-2.5 rounded-xl border border-blue-100 flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-blue-800 uppercase tracking-widest">Lembur</span>
                                            <span className="font-black text-blue-600 text-sm">{totalLembur} <span className="text-[9px] font-medium text-blue-600/70">Jam</span></span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {/* End Mobile Cards */}

                </div>
            )}
        </div>
    );
}
// src/app/(admin)/admin/penggajian/page.tsx
import { prisma } from "@/lib/prisma";
import { Banknote, CalendarDays, Search, Printer, FileSpreadsheet, Wallet } from "lucide-react";
import PayrollForm from "./PayrollForm";
import Link from "next/link";

export default async function PenggajianPage({ searchParams }: { searchParams: Promise<{ start?: string, end?: string, view?: string }> }) {
    const params = await searchParams;
    const view = params.view || 'pembayaran'; // Default tab

    const formatRp = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startDateStr = params.start || firstDayOfCurrentMonth.toISOString().split('T')[0];
    const endDateStr = params.end || today.toISOString().split('T')[0];

    let payrollData: any[] = [];

    if (view === 'pembayaran') {
        const startDate = new Date(startDateStr);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(endDateStr);
        endDate.setHours(23, 59, 59, 999);

        const workers = await prisma.worker.findMany({
            orderBy: { role: 'desc' },
            include: {
                attendances: {
                    where: { date: { gte: startDate, lte: endDate } }
                },
                payslips: {
                    where: {
                        periodStart: { lte: endDate },
                        periodEnd: { gte: startDate }
                    }
                }
            }
        });

        payrollData = workers.map(worker => {
            const totalDays = worker.attendances.reduce((acc, curr) => acc + curr.status, 0);
            const totalOvertime = worker.attendances.reduce((acc, curr) => acc + curr.overtimeHours, 0);

            const basePay = totalDays * worker.dailyWage;
            const dynamicOvertimeRate = worker.dailyWage / 8;
            const overtimePay = totalOvertime * dynamicOvertimeRate;

            const alreadyPaid = worker.payslips.length > 0;
            const existingPayslip = worker.payslips[0];

            return {
                workerId: worker.id,
                name: worker.name,
                role: worker.role,
                dailyWage: worker.dailyWage,
                overtimeRatePerHour: dynamicOvertimeRate,
                totalDays,
                totalOvertime,
                basePay,
                overtimePay,
                alreadyPaid: !!existingPayslip,
                payslipId: existingPayslip ? existingPayslip.id : null,
                bonus: existingPayslip ? existingPayslip.bonus : 0,
                kasbonDeduction: existingPayslip ? existingPayslip.kasbonDeduction : 0
            };
        }).filter(data => data.totalDays > 0 || data.totalOvertime > 0);
    }

    // ==========================================
    // LOGIKA TAB 2: REKAPITULASI PENGELUARAN
    // ==========================================
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startRekapStr = params.start || firstDayOfMonth.toISOString().split('T')[0];
    const endRekapStr = params.end || today.toISOString().split('T')[0];

    let aggregatedRekap: any[] = [];
    let grandTotalRekap = 0;

    if (view === 'rekap') {
        const startRekapDate = new Date(startRekapStr);
        startRekapDate.setHours(0, 0, 0, 0);
        const endRekapDate = new Date(endRekapStr);
        endRekapDate.setHours(23, 59, 59, 999);

        // PERBAIKAN: Cari slip gaji berdasarkan PERIODE KERJA (bukan tanggal dibuat)
        const payslipsRekap = await prisma.payslip.findMany({
            where: {
                periodStart: { lte: endRekapDate },
                periodEnd: { gte: startRekapDate }
            },
            include: { worker: true }
        });

        const workerMap = new Map();
        payslipsRekap.forEach(slip => {
            grandTotalRekap += slip.netPay;
            if (!workerMap.has(slip.workerId)) {
                workerMap.set(slip.workerId, {
                    id: slip.worker.id,
                    name: slip.worker.name,
                    role: slip.worker.role,
                    slipCount: 0,
                    totalDays: 0,
                    totalOvertime: 0,
                    totalNetPay: 0
                });
            }
            const stat = workerMap.get(slip.workerId);
            stat.slipCount += 1;
            stat.totalDays += slip.totalDays;
            stat.totalOvertime += slip.totalOvertime;
            stat.totalNetPay += slip.netPay;
        });

        // Ubah Map menjadi Array dan urutkan berdasarkan bayaran tertinggi
        aggregatedRekap = Array.from(workerMap.values()).sort((a, b) => b.totalNetPay - a.totalNetPay);
    }

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            {/* HEADER & TAB NAVIGASI */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 mb-4 md:mb-6">
                    <Banknote className="text-green-600 w-8 h-8" /> PENGGAJIAN TIM
                </h1>

                {/* Sistem Tab */}
                <div className="flex gap-2 border-b border-slate-200 pb-px overflow-x-auto custom-scrollbar">
                    <Link
                        href="/admin/penggajian?view=pembayaran"
                        className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-xs md:text-sm uppercase tracking-widest transition-all shrink-0 ${view !== 'rekap' ? 'bg-blue-600 text-white' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-800'}`}
                    >
                        <Wallet size={16} /> Pembayaran Aktif
                    </Link>
                    <Link
                        href="/admin/penggajian?view=rekap"
                        className={`flex items-center gap-2 px-5 py-3 rounded-t-xl font-bold text-xs md:text-sm uppercase tracking-widest transition-all shrink-0 ${view === 'rekap' ? 'bg-blue-600 text-white' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-800'}`}
                    >
                        <FileSpreadsheet size={16} /> Rekap Pengeluaran
                    </Link>
                </div>
            </div>

            {/* KONTEN TAB 1: PEMBAYARAN AKTIF */}
            {view !== 'rekap' && (
                <div className="animate-in fade-in duration-300">
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                        <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-bold">
                            Rekap otomatis dari absensi & cetak slip gaji
                        </p>

                        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 w-full xl:w-auto">
                            {/* Filter Tanggal */}
                            <form className="flex flex-col sm:flex-row w-full lg:w-auto items-start sm:items-center bg-white p-1.5 rounded-2xl md:rounded-full border border-slate-200 shadow-sm gap-2 sm:gap-0">
                                <input type="hidden" name="view" value="pembayaran" />
                                <div className="hidden sm:flex items-center px-4 text-blue-600">
                                    <CalendarDays size={20} />
                                </div>
                                <div className="flex w-full sm:w-auto items-center border-b sm:border-b-0 sm:border-l border-slate-100 px-2 pb-2 sm:pb-0">
                                    <div className="flex flex-col flex-1 px-2">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Dari</span>
                                        <input type="date" name="start" defaultValue={startDateStr} className="bg-transparent px-1 py-1 text-sm font-bold text-slate-800 outline-none cursor-pointer w-full" />
                                    </div>
                                    <span className="text-slate-300 font-light text-2xl px-2">/</span>
                                    <div className="flex flex-col flex-1 px-2">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Sampai</span>
                                        <input type="date" name="end" defaultValue={endDateStr} className="bg-transparent px-1 py-1 text-sm font-bold text-slate-800 outline-none cursor-pointer w-full" />
                                    </div>
                                </div>
                                <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                                    <Search size={14} /> Terapkan
                                </button>
                            </form>

                            {/* Tombol Cetak Massal */}
                            {payrollData.filter(p => p.alreadyPaid && p.payslipId).length > 0 && (
                                <a
                                    href={`/admin/penggajian/cetak-massal?ids=${payrollData.filter(p => p.alreadyPaid && p.payslipId).map(p => p.payslipId).join(',')}`}
                                    target="_blank"
                                    className="bg-slate-900 text-white px-5 py-3.5 sm:py-3 rounded-xl md:rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-lg flex items-center justify-center gap-2 w-full lg:w-auto shrink-0 transition-all"
                                >
                                    <Printer size={16} /> CETAK SEMUA ({payrollData.filter(p => p.alreadyPaid && p.payslipId).length})
                                </a>
                            )}
                        </div>
                    </div>

                    <PayrollForm payrollData={payrollData} periodStart={startDateStr} periodEnd={endDateStr} />
                </div>
            )}

            {/* KONTEN TAB 2: REKAP PENGELUARAN */}
            {view === 'rekap' && (
                <div className="animate-in fade-in duration-300">
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
                        <p className="text-xs md:text-sm text-slate-500 uppercase tracking-widest font-bold">
                            Total pembayaran gaji pada periode terpilih
                        </p>

                        <form className="flex flex-col sm:flex-row w-full xl:w-auto items-start sm:items-center bg-white p-1.5 rounded-2xl md:rounded-full border border-slate-200 shadow-sm gap-2 sm:gap-0">
                            <input type="hidden" name="view" value="rekap" />
                            <div className="hidden sm:flex items-center px-4 text-blue-600">
                                <CalendarDays size={20} />
                            </div>
                            <div className="flex w-full sm:w-auto items-center border-b sm:border-b-0 sm:border-l border-slate-100 px-2 pb-2 sm:pb-0">
                                <div className="flex flex-col flex-1 px-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Dari</span>
                                    <input type="date" name="start" defaultValue={startRekapStr} className="bg-transparent px-1 py-1 text-sm font-bold text-slate-800 outline-none cursor-pointer w-full" />
                                </div>
                                <span className="text-slate-300 font-light text-2xl px-2">/</span>
                                <div className="flex flex-col flex-1 px-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Sampai</span>
                                    <input type="date" name="end" defaultValue={endRekapStr} className="bg-transparent px-1 py-1 text-sm font-bold text-slate-800 outline-none cursor-pointer w-full" />
                                </div>
                            </div>
                            <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                                <Search size={14} /> Filter
                            </button>
                        </form>
                    </div>

                    {/* Grand Total Widget */}
                    <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl shadow-green-900/20 mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <p className="text-green-100 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1">Total Pengeluaran Gaji</p>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight">{formatRp(grandTotalRekap)}</h2>
                        </div>
                        <div className="bg-white/20 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/10">
                            <p className="text-sm md:text-base font-bold">{aggregatedRekap.length} Pekerja</p>
                        </div>
                    </div>

                    {/* 1. TAMPILAN DESKTOP (TABEL) */}
                    <div className="hidden md:block bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left whitespace-nowrap">
                                <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-widest">
                                    <tr>
                                        <th className="px-6 py-5">Nama Pekerja</th>
                                        <th className="px-6 py-5 text-center">Jml Slip</th>
                                        <th className="px-6 py-5 text-center">Total Hari</th>
                                        <th className="px-6 py-5 text-center">Total Lembur</th>
                                        <th className="px-6 py-5 text-right border-l border-slate-700">Total Dibayarkan</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {aggregatedRekap.length === 0 ? (
                                        <tr><td colSpan={5} className="text-center py-8 text-slate-500">Belum ada data pembayaran di periode ini.</td></tr>
                                    ) : (
                                        aggregatedRekap.map((worker) => (
                                            <tr key={`desktop-${worker.id}`} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <p className="font-bold text-slate-900">{worker.name}</p>
                                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{worker.role}</p>
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-slate-700">{worker.slipCount} <span className="text-[10px] font-normal text-slate-400">x</span></td>
                                                <td className="px-6 py-4 text-center font-bold text-slate-700">{worker.totalDays} <span className="text-[10px] font-normal text-slate-400">Hari</span></td>
                                                <td className="px-6 py-4 text-center font-bold text-slate-700">{worker.totalOvertime} <span className="text-[10px] font-normal text-slate-400">Jam</span></td>
                                                <td className="px-6 py-4 text-right border-l border-slate-100">
                                                    <span className="font-black text-green-600 text-base">{formatRp(worker.totalNetPay)}</span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 2. TAMPILAN MOBILE (KARTU) */}
                    <div className="md:hidden flex flex-col gap-4">
                        {aggregatedRekap.length === 0 ? (
                            <div className="bg-white p-6 rounded-2xl text-center text-sm text-slate-500 border border-slate-200">Belum ada data pembayaran di periode ini.</div>
                        ) : (
                            aggregatedRekap.map((worker) => (
                                <div key={`mobile-${worker.id}`} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3">
                                    <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-900 text-base">{worker.name}</p>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">{worker.role}</p>
                                        </div>
                                        <div className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">
                                            {worker.slipCount} Slip
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 mt-1">
                                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Hari</span>
                                            <span className="font-black text-slate-700 text-sm">{worker.totalDays}</span>
                                        </div>
                                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 flex justify-between items-center">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lembur</span>
                                            <span className="font-black text-slate-700 text-sm">{worker.totalOvertime}</span>
                                        </div>
                                    </div>

                                    <div className="bg-green-50 p-3 rounded-xl border border-green-100 flex justify-between items-center mt-1">
                                        <span className="text-[10px] font-bold text-green-800 uppercase tracking-widest">Total Bayar</span>
                                        <span className="font-black text-green-600 text-base">{formatRp(worker.totalNetPay)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
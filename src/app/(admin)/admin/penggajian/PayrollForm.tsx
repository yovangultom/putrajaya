"use client";

import { useState, useMemo } from "react";
import { Save, FileCheck, Banknote, Printer, Calculator, AlertCircle } from "lucide-react";
import { simpanSlipGaji } from "./actions";
import Link from "next/link";

// DEFINISI TIPE DATA UNTUK STATE INPUT
interface WorkerInput {
    bonus: number;
    kasbon: number;
    isSaved: boolean;
    payslipId?: string | null; // Tambahkan ini agar TS tidak protes
}

export default function PayrollForm({
    payrollData,
    periodStart,
    periodEnd
}: {
    payrollData: any[],
    periodStart: string,
    periodEnd: string
}) {
    const [isPending, setIsPending] = useState(false);

    // PERBAIKAN: Berikan tipe data WorkerInput pada useState
    const [inputs, setInputs] = useState<Record<string, WorkerInput>>(() => {
        const initialState: Record<string, WorkerInput> = {};
        payrollData.forEach(p => {
            initialState[p.workerId] = {
                bonus: p.bonus || 0,
                kasbon: p.kasbonDeduction || 0,
                isSaved: p.alreadyPaid,
                payslipId: p.payslipId || null
            };
        });
        return initialState;
    });

    const handleInputChange = (workerId: string, field: 'bonus' | 'kasbon', value: string) => {
        setInputs(prev => ({
            ...prev,
            [workerId]: { ...prev[workerId], [field]: Number(value) || 0 }
        }));
    };

    const totalRingkasan = useMemo(() => {
        return payrollData.reduce((acc, curr) => {
            const input = inputs[curr.workerId];
            const net = curr.basePay + curr.overtimePay + input.bonus - input.kasbon;
            acc.totalNetPay += net;
            if (input.isSaved) acc.totalSudahDibayar += net;
            else acc.totalBelumDibayar += net;
            return acc;
        }, { totalNetPay: 0, totalSudahDibayar: 0, totalBelumDibayar: 0 });
    }, [payrollData, inputs]);

    const handleSave = async (workerId: string, basePay: number, overtimePay: number, totalDays: number, totalOvertime: number) => {
        const workerInput = inputs[workerId];
        const netPay = basePay + overtimePay + workerInput.bonus - workerInput.kasbon;

        try {
            const newPayslipId = await simpanSlipGaji({
                workerId, periodStart, periodEnd, totalDays, totalOvertime,
                bonus: workerInput.bonus, kasbonDeduction: workerInput.kasbon, netPay
            });

            setInputs(prev => ({
                ...prev,
                [workerId]: {
                    ...prev[workerId],
                    isSaved: true,
                    payslipId: newPayslipId
                }
            }));

        } catch (error) {
            console.error(error);
            alert("Gagal menyimpan slip gaji.");
        }
    };

    const formatRp = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-4">Pekerja</th>
                                <th className="px-6 py-4">Rekap Absensi</th>
                                <th className="px-6 py-4">Bonus (+)</th>
                                <th className="px-6 py-4 text-red-400">Kasbon (-)</th>
                                <th className="px-6 py-4">Total Gaji</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {payrollData.map((data) => {
                                const input = inputs[data.workerId];
                                const netPay = data.basePay + data.overtimePay + input.bonus - input.kasbon;
                                return (
                                    <tr key={data.workerId} className={`${input.isSaved ? 'bg-green-50/50' : 'hover:bg-slate-50'} transition-colors`}>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-slate-900">{data.name}</div>
                                            <div className="text-[10px] text-black font-bold uppercase">{data.role}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-slate-700">{data.totalDays} Hari <span className="text-slate-400">|</span> {data.totalOvertime} Jam</div>
                                            <div className="text-[10px] text-black">Pokok + Lembur</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input type="number" disabled={input.isSaved} value={input.bonus || ""} onChange={(e) => handleInputChange(data.workerId, 'bonus', e.target.value)}
                                                className="w-24 px-2 py-1.5 text-black bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:ring-2 focus:ring-blue-600 outline-none disabled:opacity-50" placeholder="0" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input type="number" disabled={input.isSaved} value={input.kasbon || ""} onChange={(e) => handleInputChange(data.workerId, 'kasbon', e.target.value)}
                                                className="w-24 px-2 py-1.5 bg-red-50 border border-red-100 text-red-600 rounded-lg text-xs font-bold focus:ring-2 focus:ring-red-600 outline-none disabled:opacity-50 placeholder-red-200" placeholder="0" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-black text-slate-900">{formatRp(netPay)}</div>
                                            <div className="text-[9px] text-black uppercase font-bold tracking-tighter">Bersih</div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {input.isSaved ? (
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/admin/penggajian/${input.payslipId || data.payslipId}/cetak`} target="_blank" className="p-2 bg-white text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center" title="Cetak Slip">
                                                        <Printer size={16} />
                                                    </Link>
                                                    <span className="p-2 bg-green-100 text-green-700 rounded-lg border border-green-200" title="Terbayar">
                                                        <FileCheck size={16} />
                                                    </span>
                                                </div>
                                            ) : (
                                                <button onClick={() => handleSave(data.workerId, data.basePay, data.overtimePay, data.totalDays, data.totalOvertime)}
                                                    className="bg-slate-900 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 ml-auto">
                                                    <Save size={14} /> Bayarkan
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Mobile View */}
                <div className="md:hidden divide-y divide-slate-100">
                    {payrollData.map((data) => {
                        const input = inputs[data.workerId];
                        const netPay = data.basePay + data.overtimePay + input.bonus - input.kasbon;
                        return (
                            <div key={data.workerId} className={`p-4 space-y-3 ${input.isSaved ? 'bg-green-50/50' : ''}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-black text-slate-900 text-sm">{data.name}</p>
                                        <p className="text-[9px] text-slate-500 font-bold uppercase">{data.role} • {data.totalDays} Hari</p>
                                    </div>
                                    <p className="font-black text-slate-900 text-sm">{formatRp(netPay)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <input type="number" disabled={input.isSaved} value={input.bonus || ""} onChange={(e) => handleInputChange(data.workerId, 'bonus', e.target.value)} placeholder="Bonus (+)" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 text-black rounded-xl text-[10px] outline-none disabled:opacity-50" />
                                    <input type="number" disabled={input.isSaved} value={input.kasbon || ""} onChange={(e) => handleInputChange(data.workerId, 'kasbon', e.target.value)} placeholder="Kasbon (-)" className="w-full px-3 py-2 bg-red-50 border border-red-100 text-red-600 rounded-xl text-[10px] outline-none placeholder-red-300 disabled:opacity-50" />
                                </div>
                                <div className="flex gap-2">
                                    {input.isSaved ? (
                                        <>
                                            <Link href={`/admin/penggajian/${input.payslipId || data.payslipId}/cetak`} target="_blank" className="flex-1 bg-white border border-slate-200 text-slate-600 py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2">
                                                <Printer size={14} /> Cetak Slip
                                            </Link>
                                            <div className="flex-1 bg-green-100 text-green-700 py-2.5 rounded-xl text-[10px] font-bold flex items-center justify-center gap-2"><FileCheck size={14} /> Terbayar</div>
                                        </>
                                    ) : (
                                        <button onClick={() => handleSave(data.workerId, data.basePay, data.overtimePay, data.totalDays, data.totalOvertime)}
                                            className="w-full bg-slate-900 text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20">
                                            <Save size={14} /> Simpan & Bayarkan
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="sticky bottom-0 z-20 bg-slate-900 text-white rounded-[2rem] p-5 md:p-6 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-4 mt-8">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-white/10 p-3 rounded-2xl">
                        <Banknote className="text-green-400" size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Kas Yang Harus Disiapkan</p>
                        <p className="text-xl md:text-2xl font-black">{formatRp(totalRingkasan.totalNetPay)}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 md:gap-6 w-full md:w-auto pt-4 md:pt-0 border-t border-white/10 md:border-none">
                    <div className="text-center flex-1">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Sudah Disimpan</p>
                        <p className="font-black text-green-400">{formatRp(totalRingkasan.totalSudahDibayar)}</p>
                    </div>
                    <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                    <div className="text-center flex-1">
                        <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-0.5">Masih Draft</p>
                        <p className="font-black text-amber-400">{formatRp(totalRingkasan.totalBelumDibayar)}</p>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-2 text-slate-500 justify-center p-4">
                <AlertCircle size={14} />
                <p className="text-[10px] font-medium italic">Klik tombol "Bayarkan" di tiap baris untuk merekam transaksi ke pembukuan keuangan utama.</p>
            </div>
        </div>
    );
}
// src/app/(admin)/admin/penggajian/[id]/cetak/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Printer } from "lucide-react";

export default async function CetakSlipGajiPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const payslip = await prisma.payslip.findUnique({
        where: { id: id },
        include: { worker: true }
    });

    if (!payslip) notFound();

    const formatRp = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

    // Format Tanggal: "14 Apr 2026"
    const formatDate = (date: Date) => date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    // Kalkulasi Rincian
    const basePay = payslip.totalDays * payslip.worker.dailyWage;
    const overtimePay = payslip.totalOvertime * payslip.worker.overtimeRatePerHour;
    const totalPendapatanKotor = basePay + overtimePay + payslip.bonus;

    return (
        <div className="bg-slate-100 min-h-screen py-8 print:py-0 print:bg-white flex justify-center">

            {/* Tombol Print (Akan hilang saat kertas dicetak) */}
            <div className="fixed top-8 right-8 print:hidden">
                <button
                    id="btn-cetak" // <--- Ganti onClick menjadi id ini
                    className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-full font-bold uppercase tracking-widest shadow-xl hover:bg-slate-800 transition-all"
                >
                    <Printer size={18} /> Cetak Slip
                </button>
            </div>

            {/* KERTAS SLIP GAJI (Ukuran 80mm cocok untuk struk atau A4 setengah) */}
            <div className="bg-white w-full max-w-lg md:max-w-2xl p-8 md:p-12 shadow-2xl print:shadow-none print:p-0 print:max-w-full text-black">

                {/* KOP PERUSAHAAN */}
                <div className="border-b-2 border-black pb-4 mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-2xl font-black uppercase tracking-tighter">CV Putra Jaya</h1>
                        <p className="text-xs font-medium uppercase tracking-widest mt-1 text-gray-600">Konstruksi & Manajemen Proyek</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-lg font-black uppercase tracking-widest bg-black text-white px-3 py-1 inline-block">Slip Gaji</h2>
                        <p className="text-[10px] uppercase font-bold mt-2">ID: {payslip.id.slice(-8).toUpperCase()}</p>
                    </div>
                </div>

                {/* INFO PEKERJA & PERIODE */}
                <div className="grid grid-cols-2 gap-4 mb-8 text-sm">
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Nama Pekerja</p>
                        <p className="font-black text-lg uppercase">{payslip.worker.name}</p>
                        <p className="font-bold text-gray-700 uppercase text-xs mt-0.5">{payslip.worker.role}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase font-bold tracking-widest mb-1">Periode Kerja</p>
                        <p className="font-black">{formatDate(payslip.periodStart)}</p>
                        <p className="text-xs font-bold text-gray-500">s/d</p>
                        <p className="font-black">{formatDate(payslip.periodEnd)}</p>
                    </div>
                </div>

                {/* RINCIAN PENDAPATAN */}
                <div className="mb-6">
                    <h3 className="font-black uppercase tracking-widest text-xs border-b border-black pb-2 mb-3">Rincian Pendapatan</h3>
                    <div className="space-y-2 text-sm font-medium">
                        <div className="flex justify-between">
                            <span>Gaji Pokok ({payslip.totalDays} Hari x {formatRp(payslip.worker.dailyWage)})</span>
                            <span className="font-black">{formatRp(basePay)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Upah Lembur ({payslip.totalOvertime} Jam x {formatRp(payslip.worker.overtimeRatePerHour)})</span>
                            <span className="font-black">{formatRp(overtimePay)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Bonus / Tambahan Lain</span>
                            <span className="font-black">{formatRp(payslip.bonus)}</span>
                        </div>
                    </div>
                </div>

                {/* RINCIAN POTONGAN */}
                <div className="mb-6">
                    <h3 className="font-black uppercase tracking-widest text-xs border-b border-black pb-2 mb-3">Rincian Potongan</h3>
                    <div className="space-y-2 text-sm font-medium">
                        <div className="flex justify-between text-red-600">
                            <span>Potongan Kasbon / Utang</span>
                            <span className="font-black">-{formatRp(payslip.kasbonDeduction)}</span>
                        </div>
                    </div>
                </div>

                {/* TOTAL DITERIMA (TAKE HOME PAY) */}
                <div className="border-t-2 border-black pt-4 mb-12">
                    <div className="flex justify-between items-center">
                        <span className="font-black uppercase tracking-widest text-sm">Penerimaan Bersih</span>
                        <span className="text-2xl font-black bg-black text-white px-4 py-2">{formatRp(payslip.netPay)}</span>
                    </div>
                </div>

                {/* TANDA TANGAN */}
                <div className="grid grid-cols-2 gap-8 text-center text-sm mt-16 pt-8">
                    <div>
                        <p className="mb-16 font-bold uppercase text-xs">Penerima</p>
                        <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
                        <p className="font-black uppercase">{payslip.worker.name}</p>
                    </div>
                    <div>
                        <p className="mb-16 font-bold uppercase text-xs">Bag. Keuangan / Admin</p>
                        <div className="border-b border-black w-3/4 mx-auto mb-1"></div>
                        <p className="font-black uppercase">CV Putra Jaya</p>
                    </div>
                </div>

                {/* Script untuk Print Otomatis */}
                {/* Script untuk Print Otomatis & Tombol Manual */}
                <script dangerouslySetInnerHTML={{
                    __html: `
                    // 1. Fungsi untuk tombol manual
                    document.getElementById('btn-cetak').addEventListener('click', function() {
                        window.print();
                    });

                    // 2. Fungsi otomatis munculkan dialog print saat halaman selesai dimuat
                    window.onload = function() {
                        window.print();
                    }
                `}} />
            </div>
        </div>
    );
}
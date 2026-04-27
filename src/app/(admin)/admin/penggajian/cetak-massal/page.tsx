// src/app/(admin)/admin/penggajian/cetak-massal/page.tsx
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintHandler from "./PrintHandler";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ ids?: string }> }): Promise<Metadata> {
    const params = await searchParams;
    const idsString = params.ids;

    let periodText = "Periode-Tidak-Diketahui";

    if (idsString) {
        const idsArray = idsString.split(",");

        // Ambil satu sampel slip gaji untuk melihat rentang periodenya
        const samplePayslip = await prisma.payslip.findFirst({
            where: { id: { in: idsArray } },
            select: { periodStart: true, periodEnd: true }
        });

        if (samplePayslip) {
            const formatOpts: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
            const startStr = samplePayslip.periodStart.toLocaleDateString('id-ID', formatOpts).replace(/\s/g, '-');
            const endStr = samplePayslip.periodEnd.toLocaleDateString('id-ID', formatOpts).replace(/\s/g, '-');

            // Jika tanggal mulai dan akhir sama, cukup tampilkan satu tanggal saja. Jika beda, gunakan "sd" (sampai dengan).
            periodText = startStr === endStr ? startStr : `${startStr}-sd-${endStr}`;
        }
    }

    return {
        // Hasil akhir misal: Slip-Gaji-CV-Putra-Jaya-Periode-20-Apr-2026-sd-26-Apr-2026.pdf
        title: `Slip-Gaji-CV-Putra-Jaya-Periode-${periodText}`,
    };
}
function terbilang(angka: number): string {
    const bilangan = ['', 'Satu', 'Dua', 'Tiga', 'Empat', 'Lima', 'Enam', 'Tujuh', 'Delapan', 'Sembilan', 'Sepuluh', 'Sebelas'];
    if (angka < 12) return bilangan[angka];
    if (angka < 20) return terbilang(angka - 10) + ' Belas';
    if (angka < 100) return terbilang(Math.floor(angka / 10)) + ' Puluh ' + terbilang(angka % 10);
    if (angka < 200) return 'Seratus ' + terbilang(angka - 100);
    if (angka < 1000) return terbilang(Math.floor(angka / 100)) + ' Ratus ' + terbilang(angka % 100);
    if (angka < 2000) return 'Seribu ' + terbilang(angka - 1000);
    if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + ' Ribu ' + terbilang(angka % 1000);
    if (angka < 1000000000) return terbilang(Math.floor(angka / 1000000)) + ' Juta ' + terbilang(angka % 1000000);
    return '';
}

export default async function CetakMassalSlipPage({ searchParams }: { searchParams: Promise<{ ids?: string }> }) {
    const params = await searchParams;

    const idsString = params.ids;
    if (!idsString) return <div className="p-8 text-center">Tidak ada slip gaji yang dipilih.</div>;

    const idsArray = idsString.split(",");

    const payslips = await prisma.payslip.findMany({
        where: { id: { in: idsArray } },
        include: { worker: true },
        orderBy: { worker: { name: 'asc' } }
    });

    if (payslips.length === 0) notFound();

    const formatRp = (angka: number) => new Intl.NumberFormat("id-ID", { minimumFractionDigits: 0 }).format(angka);
    const formatDate = (date: Date) => date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const chunkedPayslips = [];
    for (let i = 0; i < payslips.length; i += 3) {
        chunkedPayslips.push(payslips.slice(i, i + 3));
    }

    return (
        <div className="bg-slate-50 min-h-screen py-4 md:py-8 px-2 md:px-0 print:py-0 print:px-0 print:bg-white text-black font-['Arial'] print:block">

            <style dangerouslySetInnerHTML={{
                __html: `
                @media print {
                    @page { 
                        size: A4 portrait;
                        margin: 0mm;
                    }
                    body {
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    .kertas-a4 {
                        width: 210mm !important;
                        height: 297mm !important;
                        padding: 10mm !important;
                        margin: 0 !important;
                        box-shadow: none !important;
                        page-break-after: always;
                        page-break-inside: avoid;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    /* Mencegah halaman kosong di bagian paling akhir */
                    .kertas-a4:last-child {
                        page-break-after: auto !important;
                    }
                }
            `}} />

            {/* BUNGKUSAN CETAK TERPUSAT: Menampung Top Bar dan Kertas A4 */}
            <div className="w-full max-w-[21cm] mx-auto flex flex-col px-2 md:px-0">

                {/* TOP BAR: Tombol Kembali & Print */}
                <div className="w-full flex justify-between items-center mb-4 md:mb-6 print:hidden">
                    <Link href="/admin/penggajian" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-[10px] md:text-sm font-bold uppercase tracking-widest transition-colors">
                        <ArrowLeft size={16} className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="hidden sm:inline">Kembali ke Penggajian</span>
                        <span className="sm:hidden">Kembali</span>
                    </Link>

                    <PrintHandler total={payslips.length} />
                </div>

                {/* Wrapper Kertas A4 */}
                <div className="w-full flex flex-col gap-8 print:block print:gap-0">

                    {/* Loop Per Halaman A4 */}
                    {chunkedPayslips.map((pageGroup, pageIndex) => (
                        <div key={pageIndex} className="kertas-a4 bg-white w-full md:w-[21cm] h-auto md:h-[29.7cm] p-4 sm:p-6 md:p-[1cm] shadow-2xl flex flex-col relative box-border mb-6 md:mb-8 print:mb-0 print:shadow-none">

                            {/* Loop Per Slip (Maksimal 3) */}
                            {pageGroup.map((payslip, slipIndex) => {
                                const basePay = payslip.totalDays * payslip.worker.dailyWage;
                                const overtimePay = payslip.totalOvertime * payslip.worker.overtimeRatePerHour;

                                // Garis putus-putus akan selalu muncul KECUALI untuk slip urutan ke-3 (paling bawah)
                                const isThirdSlip = slipIndex === 2;

                                return (
                                    <div key={payslip.id} className={`w-full box-border flex flex-col justify-between py-3 px-1 md:px-2 print:px-2 ${!isThirdSlip ? 'border-b border-dashed border-gray-400 mb-2 md:mb-0 print:mb-0' : ''} md:h-1/3 print:h-1/3 shrink-0 gap-3 md:gap-0 print:gap-0`}>

                                        <div>
                                            {/* HEADER PERUSAHAAN */}
                                            <div className="flex justify-between items-center mb-2 md:mb-3 print:mb-0 border-b border-slate-200 pb-2">
                                                <div className="flex items-center gap-2 md:gap-3 print:gap-3">
                                                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 print:w-12 print:h-12 shrink-0 pt-0.5">
                                                        <img
                                                            src="/PutraJaya_Logo.png"
                                                            alt="Logo CV Putra Jaya"
                                                            className="object-contain w-full h-full"
                                                        />
                                                    </div>
                                                    <div>
                                                        <h1 className="text-sm sm:text-base md:text-lg print:text-[12pt]font-black print:font-bold text-black tracking-tighter uppercase leading-none">CV. PUTRA JAYA</h1>
                                                        <p className="text-[6px] sm:text-[7px] md:text-[8px] print:text-[8px] leading-tight mt-0.5 md:mt-1 print:mt-0.5 text-black uppercase font-bold">
                                                            Alamat: Jl. KH Mochammad RT.01 RW.02 No.86, <br /> Kelurahan Mangunjaya, Kecamatan Tambun Selatan, <br className="md:hidden print:hidden" />Kab. Bekasi 17510<br />
                                                            WhatsApp: 087888431444
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="text-right shrink-0">
                                                    <h2 className="text-[10px] sm:text-xs md:text-sm print:text-sm font-black uppercase text-gray-600 px-2 md:px-3 print:px-3 py-1">Slip Gaji</h2>
                                                </div>
                                            </div>

                                            {/* INFO KARYAWAN */}
                                            <div className="flex justify-between text-[9px] sm:text-[10px] md:text-[11px] print:text-[10pt] mb-2 md:mb-3 print:mb-0 font-medium flex-wrap gap-1 sm:gap-0">
                                                <table className="w-full sm:w-1/2 print:p-0">
                                                    <tbody>
                                                        <tr><td className="w-12 sm:w-16 uppercase">Nama</td><td className="w-2">:</td><td className="font-bold uppercase">{payslip.worker.name}</td></tr>
                                                        <tr><td className="uppercase">Jabatan</td><td>:</td><td className="uppercase">{payslip.worker.role}</td></tr>
                                                    </tbody>
                                                </table>
                                                <table className="w-full sm:w-1/2 mt-1 sm:mt-0">
                                                    <tbody>
                                                        <tr><td className="w-12 sm:w-16 uppercase">Periode</td><td className="w-2">:</td><td className="font-bold">{payslip.periodStart.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })} - {payslip.periodEnd.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td></tr>
                                                        <tr><td className="uppercase">ID Slip</td><td>:</td><td className="uppercase">{payslip.id.slice(-6)}</td></tr>
                                                    </tbody>
                                                </table>
                                            </div>

                                            {/* TABEL RINCIAN (Sistem Array Dinamis untuk Penomoran) */}
                                            <table className="w-full text-[9px] sm:text-[10px] md:text-[11px] print:text-[10pt] border-y-2 border-black mb-1 print:p-0">
                                                <thead>
                                                    <tr className="border-b border-black text-left bg-gray-50 print:bg-white">
                                                        <th className="py-1 print:py-0 w-6 sm:w-8 uppercase">No</th>
                                                        <th className="py-1 print:py-0 uppercase">Keterangan</th>
                                                        <th className="py-1 print:py-0 text-right uppercase">Jumlah</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="font-medium print:text-[10pt] print:p-0">
                                                    {(() => {
                                                        // 1. Buat keranjang rincian (Gaji Pokok selalu ada)
                                                        const rincian = [
                                                            { label: `Gaji Pokok (${payslip.totalDays} Hari)`, value: basePay, isDeduction: false }
                                                        ];

                                                        // 2. Tambahkan Gaji Lembur jika ada
                                                        if (payslip.totalOvertime > 0) {
                                                            rincian.push({ label: `Gaji Lemburan (${payslip.totalOvertime} Jam)`, value: overtimePay, isDeduction: false });
                                                        }

                                                        // 3. Tambahkan Bonus jika ada
                                                        if ((payslip.bonus || 0) > 0) {
                                                            rincian.push({ label: `Bonus / Tambahan`, value: payslip.bonus, isDeduction: false });
                                                        }

                                                        // 4. Tambahkan Potongan Kasbon jika ada
                                                        if ((payslip.kasbonDeduction || 0) > 0) {
                                                            rincian.push({ label: `Potongan Kasbon`, value: payslip.kasbonDeduction, isDeduction: true });
                                                        }

                                                        // 5. Cetak (Render) urutan baris secara berurutan
                                                        return (
                                                            <>
                                                                {rincian.map((item, idx) => (
                                                                    <tr key={idx}>
                                                                        <td className="py-1 print:py-0">{idx + 1}.</td>
                                                                        <td className={`py-1 print:py-0 ${item.isDeduction ? 'text-red-600' : ''}`}>{item.label}</td>
                                                                        <td className={`py-1 text-right print:py-0 ${item.isDeduction ? 'text-red-600' : ''}`}>
                                                                            {item.isDeduction ? `(${formatRp(item.value)})` : formatRp(item.value)}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                                <tr>
                                                                    <td colSpan={2}></td>
                                                                    <td className="py-1 border-t border-black text-right text-[8px] sm:text-[10px] italic">(+)</td>
                                                                </tr>
                                                            </>
                                                        );
                                                    })()}
                                                </tbody>
                                            </table>
                                        </div>

                                        <div>
                                            {/* TOTAL DAN TERBILANG */}
                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-y-2 border-black py-1 mb-2 gap-1 sm:gap-0 bg-slate-50 print:bg-white px-2 rounded-md print:p-0">
                                                <p className="text-[8px] sm:text-[9px] md:text-[10px] print:text-[10px] font-bold italic capitalize w-full sm:w-2/3 pr-2 leading-tight py-1 sm:p-0">{terbilang(payslip.netPay)} Rupiah</p>
                                                <div className="w-1/3 flex justify-between font-black text-[9px] sm:text-[10px] md:text-[11px] print:text-[11px] uppercase mt-1 sm:mt-0 py-1 sm:p-0">
                                                    <span>Total :</span>
                                                    <span>Rp. {formatRp(payslip.netPay)}</span>
                                                </div>
                                            </div>

                                            {/* TANDA TANGAN */}
                                            <div className="flex justify-between text-[9px] sm:text-[10px] md:text-[11px]  text-center px-2 sm:px-4 print:text-[10pt]">
                                                <div>
                                                    <p className="mb-6 sm:mb-8 print:mb-8 print:text-[10pt]">Penerima,</p>
                                                    <p className="font-medium uppercase underline print:text-[10pt]">{payslip.worker.name}</p>
                                                </div>
                                                <div>
                                                    <p className="mb-6 sm:mb-8 print:mb-8 text-right text-[8px] sm:text-[9px] md:text-[10px] print:text-[10pt]">{formatDate(payslip.createdAt)}</p>
                                                    <p className="font-medium uppercase underline print:text-[10pt]">CV PUTRA JAYA</p>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
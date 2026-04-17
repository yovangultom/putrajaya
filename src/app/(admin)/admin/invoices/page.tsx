// src/app/(admin)/admin/invoices/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Receipt, Eye, Printer, CheckCircle, Clock, XCircle } from "lucide-react"; // Tambahkan XCircle

export default async function DaftarInvoicePage() {
    const invoices = await prisma.invoice.findMany({
        orderBy: { date: "desc" },
        include: {
            project: {
                include: { bap: { include: { items: true } } }
            }
        }
    });

    const formatRp = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

    // Fungsi helper untuk merender Badge Status agar konsisten dan berbahasa Indonesia
    const renderStatusBadge = (status: string, isMobile: boolean = false) => {
        const iconSize = isMobile ? 10 : 12;
        const baseClass = `inline-flex items-center gap-1 md:gap-1.5 py-1 font-black uppercase tracking-tighter border ${isMobile ? 'px-2 rounded-md text-[9px]' : 'px-3 rounded-full text-[10px]'}`;

        switch (status) {
            case 'PAID':
                return (
                    <span className={`${baseClass} bg-green-100 text-green-700 border-green-200`}>
                        <CheckCircle size={iconSize} /> LUNAS
                    </span>
                );
            case 'CANCELLED':
                return (
                    <span className={`${baseClass} bg-red-100 text-red-700 border-red-200`}>
                        <XCircle size={iconSize} /> DIBATALKAN
                    </span>
                );
            case 'COMPLETED_INVOICED':
            default:
                return (
                    <span className={`${baseClass} bg-amber-100 text-amber-700 border-amber-200`}>
                        <Clock size={iconSize} /> MENUNGGU PEMBAYARAN
                    </span>
                );
        }
    };

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2 md:gap-3">
                    <Receipt className="text-blue-600 w-6 h-6 md:w-8 md:h-8" /> MONITORING INVOICE
                </h1>
                <p className="text-[10px] md:text-sm text-slate-500 mt-1 uppercase tracking-widest font-medium">Rekapitulasi Tagihan & Status Pembayaran</p>
            </div>

            <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">

                {/* =========================================
                    TAMPILAN DESKTOP (TABEL) 
                    ========================================= */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-[0.2em]">
                            <tr>
                                <th className="px-6 py-5">No. Invoice</th>
                                <th className="px-6 py-5">Klien & Proyek</th>
                                <th className="px-6 py-5">Total Tagihan</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-6 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {invoices.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-20 text-center text-slate-400 italic">Belum ada invoice yang diterbitkan.</td>
                                </tr>
                            ) : (
                                invoices.map((inv) => {
                                    const totalPekerjaan = inv.project.bap?.items.reduce((acc, item) => acc + (item.qty * item.price), 0) || 0;
                                    const sisaTagihan = totalPekerjaan - inv.project.dpAmount;

                                    return (
                                        <tr key={inv.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-black text-blue-600">{inv.invoiceNumber}</div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                                    {new Date(inv.date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{inv.project.clientName}</div>
                                                <div className="text-xs text-slate-500 truncate max-w-50">{inv.project.title}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{formatRp(sisaTagihan)}</div>
                                                <div className="text-[10px] text-slate-400 italic">Nilai Setelah DP</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                {/* Panggil fungsi helper untuk Desktop */}
                                                {renderStatusBadge(inv.project.status, false)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/admin/pengajuan/${inv.project.id}`}
                                                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all"
                                                        title="Detail Proyek"
                                                    >
                                                        <Eye size={16} />
                                                    </Link>
                                                    <Link
                                                        href={`/admin/invoices/${inv.id}`}
                                                        target="_blank"
                                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-100"
                                                        title="Cetak PDF"
                                                    >
                                                        <Printer size={16} />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* =========================================
                    TAMPILAN MOBILE (KARTU) 
                    ========================================= */}
                <div className="md:hidden flex flex-col divide-y divide-slate-100">
                    {invoices.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 italic text-sm">Belum ada invoice yang diterbitkan.</div>
                    ) : (
                        invoices.map((inv) => {
                            const totalPekerjaan = inv.project.bap?.items.reduce((acc, item) => acc + (item.qty * item.price), 0) || 0;
                            const sisaTagihan = totalPekerjaan - inv.project.dpAmount;

                            return (
                                <div key={inv.id} className="p-4 bg-white flex flex-col gap-3 hover:bg-slate-50 transition-colors">

                                    {/* Baris 1: No Invoice & Status */}
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="font-black text-blue-600 text-sm leading-none">{inv.invoiceNumber}</div>
                                            <div className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                                                {new Date(inv.date).toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <div>
                                            {/* Panggil fungsi helper untuk Mobile */}
                                            {renderStatusBadge(inv.project.status, true)}
                                        </div>
                                    </div>

                                    {/* Baris 2: Klien & Proyek */}
                                    <div className="mt-1">
                                        <div className="font-bold text-slate-900 text-sm">{inv.project.clientName}</div>
                                        <div className="text-[11px] text-slate-500 leading-tight mt-0.5">{inv.project.title}</div>
                                    </div>

                                    {/* Baris 3: Total & Aksi (Terpisahkan Garis) */}
                                    <div className="flex justify-between items-end mt-2 pt-3 border-t border-slate-100">
                                        <div>
                                            <div className="font-black text-slate-900 text-base leading-none">{formatRp(sisaTagihan)}</div>
                                            <div className="text-[9px] text-slate-400 italic mt-1">Nilai Setelah DP</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/pengajuan/${inv.project.id}`}
                                                className="p-2.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center"
                                                title="Detail Proyek"
                                            >
                                                <Eye size={16} />
                                            </Link>
                                            <Link
                                                href={`/admin/invoices/${inv.id}`}
                                                target="_blank"
                                                className="p-2.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-100 flex items-center justify-center"
                                                title="Cetak PDF"
                                            >
                                                <Printer size={16} />
                                            </Link>
                                        </div>
                                    </div>

                                </div>
                            );
                        })
                    )}
                </div>

            </div>
        </div>
    );
}
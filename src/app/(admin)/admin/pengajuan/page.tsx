// src/app/(admin)/admin/pengajuan/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Plus, Eye, Printer, FileCheck, Receipt } from "lucide-react";

// 1. Tambahkan Kamus Penerjemah
const statusPenerjemah: Record<string, string> = {
    PENGAJUAN: "Pengajuan",
    DEAL_SCHEDULED: "Terjadwal",
    IN_PROGRESS: "Sedang Dikerjakan",
    COMPLETED_INVOICED: "Menunggu Pembayaran",
    PAID: "Lunas",
    CANCELLED: "Dibatalkan"
};

export default async function DaftarPengajuanPage() {
    const daftarPengajuan = await prisma.project.findMany({
        orderBy: { createdAt: "desc" },
        include: {
            user: true,
            pengajuanItems: true,
            invoice: true,
            bap: true
        }
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'PENGAJUAN': return 'bg-amber-50 text-amber-600 border-amber-200';
            case 'DEAL_SCHEDULED': return 'bg-purple-50 text-purple-600 border-purple-200';
            case 'IN_PROGRESS': return 'bg-blue-50 text-blue-600 border-blue-200';
            case 'COMPLETED_INVOICED': return 'bg-teal-50 text-teal-600 border-teal-200';
            case 'PAID': return 'bg-green-50 text-green-700 border-green-300';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-200'; // 2. Tambahkan style untuk Cancelled
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const formatRupiah = (angka: number) => {
        return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
    };

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            {/* --- HEADER --- */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">Data Pengajuan Proyek</h1>
                    <p className="text-xs md:text-sm text-slate-500 mt-1">Pantau seluruh riwayat pekerjaan dari Penawaran hingga Invoice.</p>
                </div>
                <Link
                    href="/admin/pengajuan/baru"
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 md:py-2.5 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all text-sm"
                >
                    <Plus size={18} />
                    BUAT PENAWARAN BARU
                </Link>
            </div>

            {/* --- TAMPILAN MOBILE (CARD STACK) --- */}
            <div className="md:hidden flex flex-col gap-4">
                {daftarPengajuan.length === 0 ? (
                    <div className="bg-white rounded-2xl p-8 text-center text-slate-500 font-medium border border-slate-200 shadow-sm">
                        Belum ada data proyek.
                    </div>
                ) : (
                    daftarPengajuan.map((item) => {
                        const totalEstimasi = item.pengajuanItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);
                        const hasDocuments = item.status === "COMPLETED_INVOICED" || item.status === "PAID";

                        return (
                            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 flex flex-col gap-4">
                                {/* Baris 1: Judul & Status */}
                                <div className="flex justify-between items-start gap-3">
                                    <div>
                                        <div className="font-bold text-slate-900 text-base">{item.title}</div>
                                        <div className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                                            Dibuat: {new Date(item.createdAt).toLocaleDateString("id-ID")}
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border text-center ${getStatusStyle(item.status)}`}>
                                        {/* 3. Gunakan kamus penerjemah di sini */}
                                        {statusPenerjemah[item.status] || item.status}
                                    </span>
                                </div>

                                {/* Baris 2: Info Klien & Lokasi */}
                                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100">
                                    <div className="font-bold text-slate-800  text-sm">{item.clientName}</div>
                                    <div className="text-slate-500 text-xs mt-1 leading-relaxed">{item.projectLocation}</div>
                                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs font-bold text-slate-700">
                                        Estimasi: <span className="text-blue-600">{formatRupiah(totalEstimasi)}</span>
                                    </div>
                                </div>

                                {/* Baris 3: Tombol Aksi */}
                                <div className="flex items-center justify-end gap-2 pt-1">
                                    <Link href={`/admin/pengajuan/${item.id}/cetak`} target="_blank" className="p-2.5 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-600 hover:text-white transition-all border border-amber-100">
                                        <Printer size={18} />
                                    </Link>
                                    <Link href={`/admin/pengajuan/${item.id}`} className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                                        <Eye size={18} />
                                    </Link>

                                    {hasDocuments && (
                                        <>
                                            <Link href={`/admin/pengajuan/${item.id}/bap/cetak`} target="_blank" className="p-2.5 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition-all border border-teal-100">
                                                <FileCheck size={18} />
                                            </Link>
                                            <Link href={`/admin/invoices/${item.invoice?.id}`} target="_blank" className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all border border-blue-100">
                                                <Receipt size={18} />
                                            </Link>
                                        </>
                                    )}
                                </div>
                            </div>
                        )
                    })
                )}
            </div>

            {/* --- TAMPILAN DESKTOP (TABEL) --- */}
            <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-950 text-white uppercase text-[10px] tracking-widest">
                            <tr>
                                <th className="px-6 py-5">Detail Pekerjaan</th>
                                <th className="px-6 py-5">Klien & Lokasi</th>
                                <th className="px-6 py-5 text-center">Status</th>
                                <th className="px-6 py-5 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {daftarPengajuan.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-slate-500 font-medium">Belum ada data proyek.</td>
                                </tr>
                            ) : (
                                daftarPengajuan.map((item) => {
                                    const totalEstimasi = item.pengajuanItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);
                                    const hasDocuments = item.status === "COMPLETED_INVOICED" || item.status === "PAID";

                                    return (
                                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900 text-base">{item.title}</div>
                                                <div className="text-xs text-slate-500 mt-1 font-semibold">
                                                    Estimasi: <span className="text-blue-600">{formatRupiah(totalEstimasi)}</span>
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-medium uppercase mt-1">
                                                    Dibuat: {new Date(item.createdAt).toLocaleDateString("id-ID")}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-slate-800 italic">"{item.clientName}"</div>
                                                <div className="text-slate-500 text-xs mt-1">{item.projectLocation}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center">
                                                    <span className={`inline-flex items-center justify-center min-w-30 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${getStatusStyle(item.status)}`}>
                                                        {/* 4. Gunakan kamus penerjemah di sini juga */}
                                                        {statusPenerjemah[item.status] || item.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link href={`/admin/pengajuan/${item.id}/cetak`} target="_blank" title="Cetak Penawaran Harga" className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-600 hover:text-white transition-all border border-amber-100">
                                                        <Printer size={16} />
                                                    </Link>
                                                    <Link href={`/admin/pengajuan/${item.id}`} title="Lihat Detail & Progres" className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-900 hover:text-white transition-all">
                                                        <Eye size={16} />
                                                    </Link>

                                                    {hasDocuments && (
                                                        <>
                                                            <Link href={`/admin/pengajuan/${item.id}/bap/cetak`} target="_blank" title="Cetak BAP" className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-600 hover:text-white transition-all border border-teal-100">
                                                                <FileCheck size={16} />
                                                            </Link>
                                                            <Link href={`/admin/invoices/${item.invoice?.id}`} target="_blank" title="Cetak Invoice" className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all border border-blue-100">
                                                                <Receipt size={16} />
                                                            </Link>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
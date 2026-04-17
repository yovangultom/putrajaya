// src/app/(admin)/admin/pengajuan/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Calendar, DollarSign, FileText, PlayCircle, FileCheck2, Printer, XCircle } from "lucide-react";
import { revalidatePath } from "next/cache";
import RescheduleButton from "./RescheduleButton";
import CancelButton from "./CancelButton";
import AddExpenseModal from "./AddExpenseModal";
import { Receipt } from "lucide-react"; // Pastikan Receipt juga di-import jika belum

const statusPenerjemah: Record<string, string> = {
    PENGAJUAN: "Pengajuan",
    DEAL_SCHEDULED: "Terjadwal",
    IN_PROGRESS: "Sedang Dikerjakan",
    COMPLETED_INVOICED: "Menunggu Pembayaran",
    PAID: "Lunas",
    CANCELLED: "Dibatalkan"
};
export default async function DetailProyekPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id: id },
        include: {
            pengajuanItems: true,
            invoice: true,
            bap: true,
            expenses: true // 
        }
    });

    if (!project) notFound();

    async function konfirmasiPelunasan() {
        "use server";
        await prisma.project.update({
            where: { id: id },
            data: { status: "PAID" }
        });
        revalidatePath(`/admin/pengajuan/${id}`);
    }

    const totalEstimasi = project.pengajuanItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);

    // Action Tahap 2 & 3: Deal & Jadwal
    async function terimaDanJadwalkan(formData: FormData) {
        "use server";
        const dpAmount = parseFloat(formData.get("dpAmount") as string) || 0;
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;

        await prisma.project.update({
            where: { id: id },
            data: {
                status: "DEAL_SCHEDULED",
                dpAmount: dpAmount,
                startDate: new Date(startDate),
                endDate: new Date(endDate)
            }
        });
        revalidatePath(`/admin/pengajuan/${id}`);
    }

    // Action Tahap 4: Mulai Pekerjaan Lapangan
    async function mulaiPekerjaan() {
        "use server";
        await prisma.project.update({
            where: { id: id },
            data: { status: "IN_PROGRESS" }
        });
        revalidatePath(`/admin/pengajuan/${id}`);
    }
    // 1. Tambahkan parameter projectId: string
    async function batalkanProyek(idProyek: string) {
        "use server";
        console.log("=== SERVER ACTION TERPANGGIL ===");
        console.log("ID Proyek:", idProyek);

        try {
            await prisma.project.update({
                where: { id: idProyek },
                data: { status: "CANCELLED" }
            });
            console.log("=== BERHASIL UPDATE DATABASE ===");
            revalidatePath(`/admin/pengajuan/${idProyek}`);
        } catch (error) {
            console.log("=== GAGAL UPDATE DATABASE ===", error);
        }
    }
    // Hitung Total Pengeluaran
    const totalPengeluaran = project.expenses.reduce((acc, curr) => acc + curr.amount, 0);

    // Nilai Proyek (Berdasarkan BAP jika sudah ada, atau Estimasi Awal)
    const nilaiKontrak = project.pengajuanItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);

    // Pendapatan Bersih (Laba)
    const labaBersih = nilaiKontrak - totalPengeluaran;

    const formatRupiah = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <Link href="/admin/pengajuan" className="flex items-center gap-2 text-slate-800 hover:text-slate-900 text-sm font-medium transition-colors w-fit">
                    <ArrowLeft size={16} /> <span className="hidden sm:inline">Kembali ke Daftar</span><span className="sm:hidden">Kembali</span>
                </Link>

                <Link href={`/admin/pengajuan/${project.id}/formulir/cetak`} className="flex items-center gap-2 bg-white text-slate-700 border border-slate-300 py-2 px-3 md:px-4 rounded-xl text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-slate-100 hover:text-slate-900 transition-all shadow-sm">
                    <Printer size={16} /> <span className="hidden md:inline">Cetak Formulir Tugas</span><span className="md:hidden">Formulir</span>
                </Link>
            </div>

            <div className="flex flex-col-reverse lg:grid lg:grid-cols-3 gap-6 md:gap-8">

                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 p-5 md:p-8">
                        <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                            <div>
                                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black rounded-full border border-blue-100 uppercase tracking-tighter inline-block mb-2 md:mb-0">
                                    Informasi Proyek
                                </span>
                                <h1 className="text-2xl md:text-3xl font-black text-slate-900 md:mt-2 uppercase tracking-tight leading-tight">{project.title}</h1>
                            </div>
                            <div className={`w-full md:w-auto px-4 py-2 rounded-xl text-xs font-black border uppercase tracking-widest text-center md:text-left ${project.status === 'CANCELLED' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-slate-600'}`}>
                                {statusPenerjemah[project.status] || project.status}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-6 py-5 md:py-6 border-y border-slate-100">

                            {/* Kotak 1: Nama Klien/PIC */}
                            <div className="bg-slate-50 p-3 rounded-xl md:bg-transparent md:p-0 md:rounded-none">
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Nama PIC / Klien</p>
                                <p className="text-slate-900 font-bold text-sm md:text-base">{project.clientName}</p>
                            </div>

                            {/* Kotak 2: Instansi/Perusahaan */}
                            <div className="bg-slate-50 p-3 rounded-xl md:bg-transparent md:p-0 md:rounded-none">
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Perusahaan / Instansi</p>
                                {project.clientCompany ? (
                                    <p className="text-slate-900 font-bold text-sm md:text-base">{project.clientCompany}</p>
                                ) : (
                                    <p className="text-slate-400 italic text-sm">-</p>
                                )}
                            </div>

                            {/* Kotak 3: Nomor Telepon */}
                            <div className="bg-slate-50 p-3 rounded-xl md:bg-transparent md:p-0 md:rounded-none">
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">No. Telepon / WA</p>
                                {project.clientPhone ? (
                                    <p className="text-slate-900 font-bold text-sm md:text-base">{project.clientPhone}</p>
                                ) : (
                                    <p className="text-slate-400 italic text-sm">-</p>
                                )}
                            </div>

                            {/* Kotak 4: Lokasi Proyek */}
                            <div className="bg-slate-50 p-3 rounded-xl md:bg-transparent md:p-0 md:rounded-none">
                                <p className="text-[10px] font-black text-slate-800 uppercase tracking-widest mb-1">Lokasi Proyek</p>
                                <p className="text-slate-900 font-bold text-sm md:text-base leading-relaxed">{project.projectLocation}</p>
                            </div>
                        </div>

                        <div className="mt-6 md:mt-8">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight mb-4 flex items-center gap-2">
                                <FileText size={16} className="text-blue-600" /> Rincian Pengajuan Awal
                            </h3>

                            <div className="hidden md:block border border-slate-200 rounded-xl overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-widest border-b border-slate-200">
                                        <tr>
                                            <th className="px-4 py-2 w-10 text-center">No</th>
                                            <th className="px-4 py-2">Item Pekerjaan</th>
                                            <th className="px-4 py-2 text-center">Vol</th>
                                            <th className="px-4 py-2 text-right">Harga Satuan</th>
                                            <th className="px-4 py-2 text-right">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {project.pengajuanItems.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-slate-50">
                                                <td className="px-4 py-2 font-medium text-black text-center">{index + 1}</td>
                                                <td className="px-4 py-2 font-medium text-black">{item.description}</td>
                                                <td className="px-4 py-2 text-center text-black">{item.qty} {item.unit}</td>
                                                <td className="px-4 py-2 text-right text-black">{formatRupiah(item.price)}</td>
                                                <td className="px-4 py-2 text-right font-bold text-black">{formatRupiah(item.qty * item.price)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* CARD STACK untuk Mobile */}
                            <div className="md:hidden flex flex-col gap-3 border border-slate-200 rounded-xl overflow-hidden bg-slate-50 p-1">
                                {project.pengajuanItems.map((item, index) => (
                                    <div key={item.id} className="bg-white p-3 rounded-lg border border-slate-100 shadow-sm flex flex-col gap-2">
                                        <div className="flex gap-2">
                                            <span className="font-bold text-slate-400 text-xs">{index + 1}.</span>
                                            <span className="font-bold text-black text-sm">{item.description}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xs ml-5 pl-1 border-l-2 border-slate-100">
                                            <span className="text-slate-600">{item.qty} {item.unit} x {formatRupiah(item.price)}</span>
                                            <span className="font-black text-black">{formatRupiah(item.qty * item.price)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* TOTAL - Sama untuk Mobile/Desktop */}
                            <div className="bg-slate-900 text-white p-3 md:p-4 rounded-xl mt-3 md:rounded-t-none md:-mt-1 flex justify-between items-center shadow-md">
                                <span className="text-[10px] md:text-xs font-black uppercase tracking-widest">Total Penawaran</span>
                                <span className="text-base md:text-lg font-black">{formatRupiah(totalEstimasi)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN / ATAS: Panel Aksi Dinamis */}
                <div className="lg:col-span-1">
                    {project.status === "PENGAJUAN" && (
                        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl border border-blue-200 md:border-slate-200 overflow-hidden lg:sticky lg:top-8 relative z-10 -mb-4 md:mb-0">
                            <div className="bg-blue-600 h-2 w-full"></div>
                            <form action={terimaDanJadwalkan} className="p-5 md:p-8 space-y-4 md:space-y-5">
                                <div className="mb-2 md:mb-4">
                                    <h2 className="text-base md:text-lg font-black text-slate-900 uppercase">Jadwalkan Proyek</h2>
                                    <p className="text-[10px] text-slate-500 md:hidden mt-1 leading-tight">Isi form ini untuk menyetujui penawaran dan menetapkan jadwal.</p>
                                </div>
                                <div className="space-y-3 md:space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Uang Muka (DP)</label>
                                        <input name="dpAmount" placeholder="kosongkan jika tidak ada" type="number" className="w-full px-4 py-2.5 md:py-3 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm placeholder-slate-400 focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 md:gap-3">
                                        <div>
                                            <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Mulai</label>
                                            <input name="startDate" type="date" required className="w-full px-3 py-2.5 md:py-3 text-black bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Selesai</label>
                                            <input name="endDate" type="date" required className="w-full px-3 py-2.5 md:py-3 text-black bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none transition-all" />
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-blue-700 transition-all text-[10px] md:text-xs tracking-widest mt-4 md:mt-6 shadow-lg shadow-blue-600/20 active:scale-[0.98]">
                                    DEAL & JADWALKAN
                                </button>
                            </form>
                            {/* 2. Ikat ID proyek secara paksa agar tidak hilang */}
                            <CancelButton projectId={project.id} action={batalkanProyek} />
                        </div>
                    )}

                    {project.status === "CANCELLED" && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl md:rounded-3xl p-5 md:p-8 text-center lg:sticky lg:top-8 -mb-2 md:mb-0 shadow-sm">
                            <XCircle size={40} className="text-red-500 mx-auto mb-3 md:mb-4 md:w-12 md:h-12" />
                            <h3 className="font-bold text-red-900 uppercase tracking-tight text-sm md:text-base">Pengajuan Dibatalkan</h3>
                            <p className="text-[11px] md:text-sm text-red-700 mt-2 mb-2 leading-relaxed">Proyek ini tidak dilanjutkan / tidak mencapai kesepakatan.</p>
                        </div>
                    )}
                    {project.status === "DEAL_SCHEDULED" && (
                        <div className="bg-purple-50 border border-purple-200 rounded-2xl md:rounded-3xl p-5 md:p-8 text-center lg:sticky lg:top-8 -mb-2 md:mb-0 shadow-sm">
                            <Calendar size={40} className="text-purple-500 mx-auto mb-3 md:mb-4 md:w-12 md:h-12" />
                            <h3 className="font-bold text-purple-900 uppercase tracking-tight text-sm md:text-base">Proyek Terjadwal</h3>
                            <p className="text-[11px] md:text-sm text-purple-700 mt-2">Pekerjaan siap dilaksanakan. Klik tombol di bawah jika tim sudah mulai bekerja di lapangan.</p>
                            <div className="mt-4">
                                <RescheduleButton
                                    projectId={project.id}
                                    currentStart={project.startDate}
                                    currentEnd={project.endDate}
                                />
                            </div>
                            <div className="mt-4 mb-5 md:mb-6 p-3 bg-white/60 rounded-xl border border-purple-100 flex justify-between items-center md:block md:space-y-1">
                                <p className="text-[10px] uppercase font-bold text-purple-600">DP Tercatat</p>
                                <p className="font-black text-slate-900 text-sm md:text-base">{formatRupiah(project.dpAmount)}</p>
                            </div>

                            <form action={mulaiPekerjaan}>
                                <button type="submit" className="w-full bg-purple-600 text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-purple-700 transition-all shadow-lg shadow-purple-900/20 flex items-center justify-center gap-2 text-[10px] md:text-xs tracking-widest active:scale-[0.98]">
                                    <PlayCircle size={16} className="md:w-4.5 md:h-4.5" /> MULAI PEKERJAAN
                                </button>
                            </form>
                        </div>
                    )}

                    {project.status === "IN_PROGRESS" && (
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl md:rounded-3xl p-5 md:p-8 text-center lg:sticky lg:top-8 -mb-2 md:mb-0 shadow-sm">
                            <PlayCircle size={40} className="text-blue-500 mx-auto mb-3 md:mb-4 animate-pulse md:w-12 md:h-12" />
                            <h3 className="font-bold text-blue-900 uppercase tracking-tight text-sm md:text-base">Sedang Dikerjakan</h3>
                            <p className="text-[11px] md:text-sm text-blue-700 mt-2 mb-5 md:mb-8">Tim sedang melakukan eksekusi di lapangan. Jika sudah selesai, Anda bisa memproses Berita Acara (BAP).</p>
                            <div className="mb-6 flex justify-center">
                                <RescheduleButton
                                    projectId={project.id}
                                    currentStart={project.startDate}
                                    currentEnd={project.endDate}
                                />
                            </div>

                            <Link href={`/admin/pengajuan/${id}/bap`} className="w-full bg-blue-600 text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 text-[10px] md:text-xs tracking-widest active:scale-[0.98]">
                                <FileCheck2 size={16} className="md:w-4.5 md:h-4.5" /> BUAT BAP & INVOICE
                            </Link>
                        </div>
                    )}

                    {project.status === "COMPLETED_INVOICED" && (
                        <div className="space-y-4 lg:sticky lg:top-8 -mb-2 md:mb-0">
                            <div className="bg-teal-50 border border-teal-200 rounded-2xl md:rounded-3xl p-5 md:p-8 text-center shadow-sm">
                                <FileText size={40} className="text-teal-500 mx-auto mb-3 md:mb-4 md:w-12 md:h-12" />
                                <h3 className="font-bold text-teal-900 uppercase tracking-tight text-sm md:text-base">Menunggu Pembayaran</h3>
                                <p className="text-[11px] md:text-sm text-teal-700 mt-2 mb-5 md:mb-6">BAP & Invoice sudah dikirim ke klien. Tekan tombol di bawah jika pembayaran sudah diterima lunas.</p>

                                <form action={konfirmasiPelunasan}>
                                    <button type="submit" className="w-full bg-teal-600 text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl hover:bg-teal-700 transition-all shadow-lg shadow-teal-900/20 flex items-center justify-center gap-2 text-[10px] md:text-xs tracking-widest mb-4 active:scale-[0.98]">
                                        <CheckCircle size={16} className="md:w-4.5 md:h-4.5" /> KONFIRMASI LUNAS
                                    </button>
                                </form>

                                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                                    <Link href={`/admin/pengajuan/${id}/bap/cetak`} className="text-[9px] md:text-[10px] font-bold text-teal-700 bg-white border border-teal-200 py-2.5 md:py-2 rounded-xl md:rounded-lg hover:bg-teal-100 uppercase transition-all flex items-center justify-center text-center">
                                        Lihat BAP
                                    </Link>
                                    <Link href={`/admin/invoices/${project.invoice?.id}`} className="text-[9px] md:text-[10px] font-bold text-teal-700 bg-white border border-teal-200 py-2.5 md:py-2 rounded-xl md:rounded-lg hover:bg-teal-100 uppercase transition-all flex items-center justify-center text-center">
                                        Lihat Invoice
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* TAMPILKAN HANYA JIKA SUDAH DEAL */}
                    {project.status !== "PENGAJUAN" && project.status !== "CANCELLED" && (
                        <div className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 p-5 md:p-8 shadow-sm lg:sticky lg:top-8 -mb-2 md:mb-0 mt-6 md:mt-0">

                            {/* Header Pengeluaran */}
                            <div className="flex flex-row justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h3 className="text-xs md:text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                                    <span className="bg-blue-50 text-blue-600 p-1.5 rounded-md">
                                        <DollarSign size={16} />
                                    </span>
                                    Pengeluaran Operasional
                                </h3>
                                <AddExpenseModal projectId={project.id} />
                            </div>

                            {/* List Pengeluaran (Bisa di-scroll jika lebih dari 4 item) */}
                            <div className="space-y-2.5 mb-6 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                {project.expenses.length === 0 ? (
                                    <p className="text-[11px] md:text-xs text-slate-400 italic py-4">Belum ada pengeluaran yang dicatat.</p>
                                ) : (
                                    project.expenses.map((exp) => (
                                        <div key={exp.id} className="flex justify-between items-center p-3 md:p-4 bg-slate-50/50 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                                            <div>
                                                <p className="font-bold text-slate-800 text-xs md:text-sm">{exp.description}</p>
                                                <p className="text-[9px] md:text-[10px] text-slate-400 uppercase font-bold mt-0.5">{new Date(exp.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                            </div>
                                            <p className="font-black text-red-500 text-xs md:text-sm">-{formatRupiah(exp.amount)}</p>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Ringkasan Profit */}
                            <div className="pt-5 border-t border-slate-200 space-y-3">
                                <div className="flex justify-between items-center text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-widest">
                                    <span>Total Pemasukan</span>
                                    <span className="text-slate-800">{formatRupiah(nilaiKontrak)}</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] md:text-xs font-bold text-red-500 uppercase tracking-widest">
                                    <span>Total Pengeluaran</span>
                                    <span>({formatRupiah(totalPengeluaran)})</span>
                                </div>

                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 md:p-5 bg-green-600 text-white rounded-xl md:rounded-2xl mt-5 shadow-lg shadow-green-900/10 gap-2">
                                    <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] leading-tight opacity-90">
                                        <span className="hidden sm:block" />Pendapatan Bersih
                                    </span>
                                    <span className="text-lg md:text-xl lg:text-2xl font-black tracking-tight">{formatRupiah(labaBersih)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {project.status === "PAID" && (
                        <div className="bg-green-600 rounded-2xl md:rounded-3xl p-5 mt-5 md:p-8 text-center text-white lg:sticky lg:top-8 shadow-xl shadow-green-900/20  md:mb-0">
                            <div className="bg-white/20 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                                <CheckCircle size={24} className="text-white md:w-8 md:h-8" />
                            </div>
                            <h3 className="font-black uppercase tracking-widest text-base md:text-lg">Proyek Lunas</h3>
                            <p className="text-green-100 text-[11px] md:text-xs mt-1 md:mt-2 mb-5 md:mb-6 leading-relaxed">Seluruh kewajiban pembayaran telah diselesaikan oleh klien.</p>

                            <div className="flex gap-2 lg:block lg:space-y-2">
                                <Link href={`/admin/invoices/${project.invoice?.id}`} className="flex-1 lg:w-full block bg-white text-green-700 font-bold py-3 md:py-3 rounded-xl text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-green-50 transition-all">
                                    Arsip Invoice
                                </Link>
                                <Link href="/admin/pengajuan" className="flex-1 lg:w-full block bg-green-700 text-white border border-green-500 font-bold py-3 md:py-3 rounded-xl text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-green-800 transition-all">
                                    Ke Daftar
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
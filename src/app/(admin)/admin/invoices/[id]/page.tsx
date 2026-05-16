// src/app/(admin)/admin/invoices/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import PrintButton from "./PrintButton";
import Image from "next/image";
import { Metadata } from "next";

// Fungsi untuk mengubah angka menjadi huruf (Terbilang)
function terbilang(angkaUtama: number): string {
    // Pastikan angka selalu bilangan bulat (hilangkan koma/desimal)
    const angka = Math.floor(Math.abs(angkaUtama));

    const huruf = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
    let hasil = "";

    if (angka < 12) hasil = huruf[angka];
    else if (angka < 20) hasil = terbilang(angka - 10) + " Belas";
    else if (angka < 100) hasil = terbilang(Math.floor(angka / 10)) + " Puluh " + terbilang(angka % 10);
    else if (angka < 200) hasil = "Seratus " + terbilang(angka - 100);
    else if (angka < 1000) hasil = terbilang(Math.floor(angka / 100)) + " Ratus " + terbilang(angka % 100);
    else if (angka < 2000) hasil = "Seribu " + terbilang(angka - 1000);
    else if (angka < 1000000) hasil = terbilang(Math.floor(angka / 1000)) + " Ribu " + terbilang(angka % 1000);
    else if (angka < 1000000000) hasil = terbilang(Math.floor(angka / 1000000)) + " Juta " + terbilang(angka % 1000000);
    else if (angka < 1000000000000) hasil = terbilang(Math.floor(angka / 1000000000)) + " Milyar " + terbilang(angka % 1000000000); // Bonus: Support sampai Milyar

    // Fallback jika hasil undefined
    return (hasil || "").trim();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: { project: true, termin: true }
    });

    if (!invoice) return { title: "Invoice" };

    // Logika penamaan dinamis untuk file/metadata
    // Jika ada termin, gunakan nama termin. Jika tidak, gunakan 'Lunas-100' atau '-'
    const terminInfo = invoice.termin
        ? invoice.termin.name.replace(/\s+/g, "-")
        : "Non-Termin";

    const safeInvNumber = invoice.invoiceNumber.replace(/\//g, "-");
    const clientName = invoice.project.clientName.replace(/\s+/g, "-");

    return {
        // Hasil: Invoice-Termin-1-001-INV-PJ-V-2026-Bapak-Dimas
        title: `Invoice-${terminInfo}-${safeInvNumber}-${clientName}`,
    };
}

export default async function InvoicePrintPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ ttd?: string }> }) {
    const { id } = await params;
    const sp = await searchParams;
    const ttd = sp.ttd || "eka";

    // KONFIGURASI NAMA & GAMBAR TTD
    const signeeData = {
        eka: { name: "Eka Aji Saputro", image: "/ttd-eka.png" },
        ratno: { name: "Ratno Palupi", image: "/ttd-ratno.png" }
    };
    const currentSignee = signeeData[ttd as keyof typeof signeeData] || signeeData.eka;

    // UPDATE QUERY: Mengambil Termin dan Rincian Pengajuan Awal
    const invoice = await prisma.invoice.findUnique({
        where: { id: id },
        include: {
            termin: true,
            project: {
                include: {
                    pengajuanItems: true,
                    baps: {
                        include: {
                            items: true
                        }
                    }
                }
            }
        }
    });

    // 1. VALIDASI DIPERBARUI: Izinkan invoice tanpa termin (untuk proyek lunas 100%)
    if (!invoice) notFound();

    const project = invoice.project;
    const termin = invoice.termin;
    const bapItems = project.baps?.[0]?.items;
    const rincianPekerjaan = bapItems && bapItems.length > 0 ? bapItems : (project.pengajuanItems || []);

    // 2. KALKULASI DINAMIS (Bisa Termin, Bisa Non-Termin)
    let grandTotal = 0;
    let titlePenagihan = "";
    let detailPenagihan = "";
    let titleAtas = "";
    let tenggatWaktu = ""; // Variabel baru untuk tenggat waktu

    if (termin) {
        // --- JIKA PROYEK MENGGUNAKAN SISTEM TERMIN ---
        grandTotal = termin.amount;
        titlePenagihan = `Pembayaran ${termin.name} (${termin.percentage}%)`;
        detailPenagihan = "Sesuai dengan kesepakatan Surat Perjanjian Kerja (SPK).";
        titleAtas = `${termin.name} (${termin.percentage}%)`;
        tenggatWaktu = "Segera";
    } else {
        // --- JIKA PROYEK 100% LUNAS (NON-TERMIN) ---
        // Kalkulasi Total Nilai Pekerjaan secara utuh (RAB murni)
        const totalNilaiProyek = rincianPekerjaan.reduce((acc: number, item: any) => acc + (item.qty * item.price), 0);

        // PERBAIKAN: Grand Total menampilkan nilai proyek UTUH (tidak dikurangi DP)
        grandTotal = invoice.amount;

        titlePenagihan = project.dpAmount > 0 ? "Pelunasan Sisa Pembayaran Pekerjaan" : "Pembayaran Penuh (100%) Pekerjaan";
        detailPenagihan = project.dpAmount > 0
            ? `Total Nilai Pekerjaan. DP (Rp ${project.dpAmount.toLocaleString('id-ID')}) sudah dibayarkan.`
            : "Sesuai dengan rincian pengajuan/RAB yang disepakati.";

        titleAtas = "-";
        tenggatWaktu = "Selesai Pekerjaan";
    }

    // Format Rupiah & Tanggal
    const formatRp = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
    const formatDate = (date: Date) => date.toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' });
    const terminInfoStr = termin ? termin.name.replace(/\s+/g, "-") : "Non-Termin";
    const safeInvNumberStr = invoice.invoiceNumber.replace(/\//g, "-");
    const clientNameSafeStr = project.clientName.replace(/\s+/g, "-");
    const pdfFilename = `Invoice-${terminInfoStr}-${safeInvNumberStr}-${clientNameSafeStr}.pdf`;

    return (
        <div className="min-h-screen bg-slate-50 py-4 md:py-8 px-2 md:px-0 print:py-0 print:px-0 print:bg-white text-black print:block print:font-['Arial']">

            <style dangerouslySetInnerHTML={{
                __html: `
                    @media print {
                        html, body, main, div { overflow: visible !important; height: auto !important; }
                        header, nav, aside, [class*="navbar"], [class*="Sidebar"], [class*="nav"] { display: none !important; }
                        @page { size: A4 portrait; margin: 1cm; }
                    }
                `
            }} />

            <div className="w-full max-w-[21cm] mx-auto mb-4 md:mb-6 flex flex-wrap justify-between items-center print:hidden gap-3">
                <Link href={`/admin/pengajuan/${project.id}`} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs md:text-sm font-medium shrink-0 order-1">
                    <ArrowLeft size={16} /> <span className="hidden sm:inline">Kembali</span><span className="sm:hidden">Kembali</span>
                </Link>

                <div className="flex items-center gap-2 shrink-0 order-2 sm:order-3">
                    <PrintButton />

                </div>

                <div className="flex justify-center items-center gap-1 md:gap-2 bg-white p-1.5 md:p-2 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto order-3 sm:order-2">
                    <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mx-1 md:mx-2">Pilih TTD:</span>
                    <Link href={`?ttd=eka`} replace className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors ${ttd === 'eka' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>Eka Aji</Link>
                    <Link href={`?ttd=ratno`} replace className={`px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-colors ${ttd === 'ratno' ? 'bg-blue-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>Ratno Palupi</Link>
                </div>
            </div>

            <div className="bg-white w-full max-w-[21cm] min-h-auto md:min-h-[29.7cm] mx-auto p-4 sm:p-8 md:p-10 shadow-2xl print:shadow-none print:p-0 print:max-w-none print:min-h-0 print:block relative">

                <div className="flex justify-between items-center border-b-2 border-black pb-3 md:pb-4 mb-4 md:mb-6">
                    <div className="flex justify-start w-1/4 sm:w-auto">
                        <Image src="/PutraJaya_Logo.png" alt="Logo" width={64} height={64} className="object-contain w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 print:w-16 print:h-16" />
                    </div>
                    <div className="text-center flex-1 px-2">
                        <h1 className="text-lg sm:text-2xl md:text-3xl print:text-[20pt] font-black text-black tracking-tight leading-none">CV PUTRA JAYA</h1>
                    </div>
                    <div className="text-right w-1/4 sm:w-auto">
                        <h2 className="text-sm sm:text-lg md:text-xl print:text-[14pt] font-black text-gray-400 uppercase tracking-tighter">INVOICE</h2>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-4 md:gap-8 text-[11px] sm:text-xs md:text-sm print:text-[10pt] text-black mb-6 md:mb-8">
                    <div>
                        <p>Jl. KH Mochammad RT.01 RW.02 No.86,</p>
                        <p>Mangunjaya, Tambun Selatan, Bekasi</p>
                        <p>17510</p>
                        <p>Tlp. 087888431444</p>
                        <p><a href="https://www.jasacoring.co.id" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">www.jasacoring.co.id</a></p>
                    </div>
                    <div>
                        <table className="w-full">
                            <tbody>
                                <tr><td className="w-20 sm:w-28 md:w-32 print:w-32 align-top">Tanggal</td><td className="w-2 md:w-4 align-top">:</td><td className="align-top">{formatDate(invoice.date)}</td></tr>
                                <tr><td className="align-top">No. Invoice</td><td className="align-top">:</td><td className=" align-top">{invoice.invoiceNumber}</td></tr>

                                {/* TAMPILAN TERMIN/JENIS DINAMIS */}
                                <tr>
                                    <td className="align-top   print:text-black">Termin</td>
                                    <td className="align-top ">:</td>
                                    <td className="align-top  print:text-black uppercase tracking-wider ">
                                        {titleAtas}
                                    </td>
                                </tr>

                                {/* TAMPILAN TENGGAT WAKTU DINAMIS */}
                                <tr>
                                    <td className="align-top">Tenggat Waktu</td>
                                    <td className="align-top">:</td>
                                    <td className="align-top font-medium outline-none border-2 border-dashed border-amber-300 print:border-none print:outline-none" contentEditable={true} suppressContentEditableWarning={true}  >
                                        {tenggatWaktu}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mb-6 md:mb-8 text-[11px] sm:text-xs md:text-sm print:text-[10pt] print:p-0 print:m-0 text-black">
                    <p className="text-[10px] md:text-[10px] print:text-[10pt]  uppercase tracking-widest mb-1">TAGIHAN KEPADA:</p>
                    <div className="max-w-full sm:max-w-[8cm] print:max-w-[8cm] print:text-[10pt]">
                        {project.clientCompany && <p className="text-sm md:text-base print:text-[10pt] print:p-0 print:m-0 font-black uppercase">{project.clientCompany}</p>}
                        <p className="text-sm md:text-base print:text-[10pt] print:p-0 print:m-0 font-bold">{project.clientName}</p>
                        <p className="leading-relaxed mt-1 print:text-[10pt] print:p-0 print:mb-2">{project.projectLocation}</p>
                    </div>
                </div>

                <p className="text-[11px] sm:text-xs md:text-sm print:text-[10pt] text-black mb-2">Berikut rincian tagihan pekerjaan {project.title}:</p>

                <table className="w-full text-[9px] sm:text-xs md:text-sm print:text-[10pt] text-black border-collapse  border border-black">
                    <thead>
                        <tr className="border-b border-black text-center font-bold print:bg-transparent print:p-0">
                            <th className="border-r border-black py-1.5 md:py-2 w-6 md:w-10 print:w-10 print:p-0">No.</th>

                            {/* UBAH JUDUL KOLOM DINAMIS */}
                            <th className="border-r border-black py-1.5 md:py-2 print:p-0">
                                {termin ? "Deskripsi Penagihan" : "Deskripsi Pekerjaan"}
                            </th>

                            <th className="border-r border-black w-14 md:w-20 print:w-20 p-0 align-middle print:px-1 print:py-0" colSpan={2}>
                                <div className="border-b border-black py-1 md:py-1.5">Volume</div>
                                <div className="flex w-full text-[8px] md:text-xs print:text-xs font-normal">
                                    <div className="w-[42.8%] md:w-1/2 print:w-1/2 border-r border-black border-dashed py-1 flex justify-center items-center">Qty</div>
                                    <div className="flex-1 py-1 flex justify-center items-center">Sat</div>
                                </div>
                            </th>
                            <th className="border-r border-black w-20 md:w-32 print:w-32 print:p-0">Harga Satuan</th>
                            <th className="py-1.5 md:py-2 w-24 md:w-36 print:w-36 print:p-0">Jumlah Harga</th>
                        </tr>
                    </thead>

                    <tbody>
                        {termin ? (
                            /* --- RENDER 1 BARIS JIKA INVOICE TERMIN --- */
                            <tr className="border-b border-black text-slate-900 print:text-black">
                                <td className="border-r border-black py-4 md:py-3 px-1 text-center align-middle print:px-1 print:py-0">1</td>
                                <td className="border-r border-black py-4 md:py-3 px-1.5 md:px-3 align-middle leading-relaxed print:px-1 print:py-0 ">
                                    {titlePenagihan}
                                </td>
                                <td className="border-r border-black border-dashed py-4 md:py-3 text-center w-6 md:w-10 print:w-10 align-middle print:px-1 print:py-0">1</td>
                                <td className="border-r border-black py-4 md:py-3 text-center w-8 md:w-10 print:w-10 align-middle print:px-1 print:py-0">ls</td>
                                <td className="border-r border-black py-4 md:py-3 px-1.5 md:px-3 align-middle print:px-1 print:py-0">
                                    <div className="flex justify-between w-full"><span>Rp</span><span>{grandTotal.toLocaleString('id-ID')}</span></div>
                                </td>
                                <td className="py-4 md:py-3 px-1.5 md:px-3 align-middle print:px-1 print:py-0">
                                    <div className="flex justify-between w-full font-bold"><span>Rp</span><span>{grandTotal.toLocaleString('id-ID')}</span></div>
                                </td>
                            </tr>
                        ) : (
                            /* --- RENDER FULL ITEM RAB JIKA INVOICE NON-TERMIN (LUNAS DI AKHIR) --- */
                            <>
                                {rincianPekerjaan.map((item: any, index: number) => (
                                    <tr key={item.id} className="border-b border-black text-slate-900 print:text-black">
                                        <td className="border-r border-black py-2 md:py-1.5 px-1 text-center  print:px-1 print:py-0">{index + 1}</td>
                                        <td className="border-r border-black py-2 md:py-1.5 px-1.5 md:px-3  leading-relaxed print:px-1 print:py-0">{item.description}</td>
                                        <td className="border-r border-black border-dashed py-2 md:py-1.5 text-center w-6 md:w-10 print:w-10  print:px-1 print:py-0">{item.qty}</td>
                                        <td className="border-r border-black py-2 md:py-1.5 text-center w-8 md:w-10 print:w-10  print:px-1 print:py-0">{item.unit}</td>
                                        <td className="border-r border-black py-2 md:py-1.5 px-1.5 md:px-3  print:px-1 print:py-0">
                                            <div className="flex justify-between w-full"><span>Rp</span><span>{item.price.toLocaleString('id-ID')}</span></div>
                                        </td>
                                        <td className="py-2 md:py-1.5 px-1.5 md:px-3 aprint:px-1 print:py-0">
                                            <div className="flex justify-between w-full font-bold"><span>Rp</span><span>{(item.qty * item.price).toLocaleString('id-ID')}</span></div>
                                        </td>
                                    </tr>
                                ))}

                                {/* JIKA ADA DP, TAMPILKAN BARIS PENGURANGAN DP AGAR JELAS */}
                                {project.dpAmount > 0 && (
                                    <tr className="border-b border-black text-slate-900 print:text-black italic bg-slate-50 print:bg-transparent">
                                        <td className="border-r border-black py-2.5 md:py-2 px-1 text-center print:px-1 print:py-0"></td>
                                        <td colSpan={4} className="border-r border-black py-2.5 md:py-2 px-1.5 md:px-3 text-right print:px-1 print:py-0 text-red-600 print:text-black font-bold">
                                            Dikurangi DP yang telah dibayarkan
                                        </td>
                                        <td className="py-2.5 md:py-2 px-1.5 md:px-3 print:px-1 print:py-0 text-red-600 print:text-black">
                                            <div className="flex justify-between w-full font-bold"><span>- Rp</span><span>{project.dpAmount.toLocaleString('id-ID')}</span></div>
                                        </td>
                                    </tr>
                                )}
                            </>
                        )}

                        {/* TOTAL BAWAH */}
                        <tr className="border-b border-black font-black text-[11px] sm:text-sm md:text-base print:text-base  print:bg-transparent  print:text-black print:text-[10pt] print:px-1 print:py-0">
                            <td colSpan={5} className="border-r border-black py-2.5 md:py-3 px-1.5 md:px-3 text-center sm:text-right print:text-center uppercase tracking-widest print:px-1 print:py-0">
                                {termin ? `TOTAL TAGIHAN ` : 'TOTAL TAGIHAN '}
                            </td>
                            <td className="py-2.5 md:py-3 px-1.5 md:px-3 print:px-1 print:py-0">
                                <div className="flex justify-between w-full"><span>Rp</span><span>{grandTotal.toLocaleString('id-ID')}</span></div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* Terbilang */}
                <div className="flex flex-col sm:flex-row sm:gap-4 text-[11px] sm:text-xs md:text-sm print:text-[10pt] text-black mb-6 md:mb-5 mt-3">
                    <div className="font-bold w-full sm:w-24 print:w-12">Terbilang:</div>
                    <div className="font-bold italic mt-1 sm:mt-0  print:bg-transparent px-2 py-1 sm:p-0 rounded-md sm:rounded-none">{terbilang(grandTotal)} Rupiah</div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between text-[11px] sm:text-xs md:text-sm print:text-[10pt] text-black mt-6 md:mt-8 print:mt-2">
                    <div className="w-full sm:w-auto bg-slate-50 print:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none group">
                        <div className="flex items-center gap-2 mb-1 md:mb-2  border-b sm:border-0 pb-1 sm:pb-0 border-slate-200">
                            <p className="font-bold">Informasi Pembayaran:</p>
                            <span className="text-[10px] border-2 border-dashed border-amber-300 text-blue-500 italic opacity-0 group-hover:opacity-100 transition-opacity print:hidden bg-blue-50 px-2 py-0.5 rounded-full">
                                (Klik teks untuk mengedit)
                            </span>
                        </div>
                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="w-20 sm:w-24 md:w-28 print:w-28 py-0.5">Bank</td>
                                    <td className="w-2 md:w-4">:</td>
                                    <td className="font-semibold print:font-normal outline-none hover:bg-white hover:ring-1 hover:ring-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded px-1 -ml-1 transition-all cursor-text" contentEditable={true} suppressContentEditableWarning={true}>Bank Central Asia</td>
                                </tr>
                                <tr>
                                    <td className="py-0.5">No. Rekening</td>
                                    <td>:</td>
                                    <td className="font-bold tracking-wider print:font-bold print:tracking-normal outline-none hover:bg-white hover:ring-1 hover:ring-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded px-1 -ml-1 transition-all cursor-text" contentEditable={true} suppressContentEditableWarning={true}>8420785578</td>
                                </tr>
                                <tr>
                                    <td className="py-0.5">Atas Nama</td>
                                    <td>:</td>
                                    <td className="font-semibold print:font-normal outline-none hover:bg-white hover:ring-1 hover:ring-blue-200 focus:bg-white focus:ring-2 focus:ring-blue-500 rounded px-1 -ml-1 transition-all cursor-text" contentEditable={true} suppressContentEditableWarning={true}>Eka Aji Saputro</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-center tracking-widest text-[10px] sm:text-xs md:text-sm print:text-[10pt] text-gray-500 print:text-black mt-8 mb-8 print:mt-3 print:mb-3">
                    TERIMAKASIH ATAS KERJASAMA ANDA
                </div>

                <div className="flex justify-between text-[11px] sm:text-xs md:text-sm print:text-[10pt] text-black px-2 sm:px-10 print:px-10 mt-12 md:mt-16 print:mt-12 print:break-inside-avoid">

                    {/* BAGIAN KIRI: TANDA TERIMA */}
                    <div className="text-center w-1/2 flex flex-col items-center justify-between">
                        {/* Jarak print diubah ke print:mb-16 agar sejajar dengan tinggi ttd yang diperkecil */}
                        <p className="mb-16 md:mb-20 print:mb-16">Tanda Terima,</p>
                        <div className="w-28 md:w-40 print:w-32 border-b border-black"></div>
                    </div>

                    {/* BAGIAN KANAN: HORMAT KAMI (TTD) */}
                    <div className="text-center w-1/2 flex flex-col items-center justify-end">
                        <p className="relative z-0">Hormat Kami,</p>

                        {/* CONTAINER TANDA TANGAN 
                            Web: Tetap menggunakan md:w-36 md:h-24
                            Print: Diperkecil drastis menjadi print:w-24 print:h-16
                            Margin print disesuaikan menjadi print:-my-1 agar pas
                        */}
                        <div className="relative w-28 h-18 md:w-36 md:h-24 print:w-24 print:h-16 mx-auto -my-2 md:-my-4 print:-my-1 z-10 pointer-events-none flex items-center justify-center">
                            <img
                                src={currentSignee.image}
                                alt={`Tanda Tangan ${currentSignee.name}`}
                                className="w-full h-full object-contain"
                                style={{ mixBlendMode: 'multiply' }}
                            />
                        </div>

                        <div className="relative z-0 leading-tight">
                            <p className="font-bold underline print:text-[10pt]">{currentSignee.name}</p>
                            <p className="print:text-[10pt]">(CV Putra Jaya)</p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
}
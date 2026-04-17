// src/app/(admin)/admin/pengajuan/[id]/bap/cetak/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import PrintButton from "@/app/(admin)/admin/invoices/[id]/PrintButton";
import Image from "next/image";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id },
        include: { bap: true }
    });

    // Nama file: BAP-008-BAP-PJ-IV-2026-Bapak-Iya.pdf
    const safeBapNumber = project?.bap?.bapNumber.replace(/\//g, "-") || "BAP";
    return {
        title: `BAP-${safeBapNumber}-${project?.clientName}`,
    };
}
export default async function BapPrintPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id: id },
        include: {
            bap: {
                include: { items: true, attachments: true }
            }
        }
    });

    if (!project || !project.bap) notFound();
    const bap = project.bap;

    const formatTanggalLengkap = (date: Date) => {
        return date.toLocaleDateString("id-ID", { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
    };



    return (
        <div className="min-h-screen bg-slate-50 py-4 md:py-8 px-2 md:px-0 print:py-0 print:px-0 print:bg-white text-black font-['Arial'] print:block print:text-black">

            <style dangerouslySetInnerHTML={{
                __html: `
                    @media print {
                        html, body, main, div { overflow: visible !important; height: auto !important; }
                        header, nav, aside, [class*="navbar"], [class*="Sidebar"], [class*="nav"] { display: none !important; }
                        /* Mengatur margin kertas fisik menjadi 1cm di semua sisi */
                        @page { 
                            size: A4 portrait;
                            margin: 1cm; 
                        }
                    }
                `
            }} />

            <div className="w-full max-w-[21cm] mx-auto mb-4 md:mb-6 flex justify-between items-center print:hidden">
                <Link href={`/admin/pengajuan/${project.id}`} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs md:text-sm font-medium">
                    <ArrowLeft size={16} /> Kembali
                </Link>
                <PrintButton />
            </div>

            {/* HALAMAN 1: BERITA ACARA UTAMA */}
            <div className="bg-white w-full max-w-[21cm] min-h-auto md:min-h-[29.7cm] mx-auto p-8 sm:p-10 md:p-12 shadow-2xl print:shadow-none print:p-0 print:max-w-none print:min-h-[27.7cm] relative flex flex-col">

                {/* KONTEN ATAS (Bungkus dengan flex-1 agar memenuhi ruang kosong dan mendorong tanda tangan ke bawah) */}
                <div className="flex-1">
                    {/* Kop Surat */}
                    <div className="flex justify-between items-stretch border-2 border-black mb-8 h-16 md:h-20 print:h-20 print:p-0 print:m-0">
                        <div className="flex justify-start items-center p-2">
                            <Image src="/PutraJaya_Logo.png" alt="Logo" width={64} height={64} className="object-contain w-10 h-10 md:w-16 md:h-16 print:w-16 print:h-16" />
                        </div>
                        <div className="flex-1 flex items-center justify-center font-black text-lg md:text-3xl print:text-[20pt] text-center">
                            CV PUTRA JAYA
                        </div>
                        <div className="border-l-2 border-black w-20 md:w-32 print:w-28 flex items-center justify-center font-bold text-gray-500 text-sm md:text-xl print:text-[14pt] print:text-gray-600">
                            BAPP
                        </div>
                    </div>

                    <div className="text-center mb-8 print:m-0">
                        <h1 className="text-lg md:text-xl font-bold underline mb-1 print:text-[14pt] print:mt-1">BERITA ACARA PENYELESAIAN PEKERJAAN</h1>
                        <p className="text-sm print:text-[10pt] print:m-0">No: {bap.bapNumber}</p>
                    </div>

                    <div className="text-sm text-justify leading-relaxed mb-6 print:text-[11pt] print:my-2">
                        Pada hari <strong>{formatTanggalLengkap(bap.date)}</strong> CV Putra Jaya telah menyelesaikan pekerjaan sesuai dengan perintah yang diberikan oleh <strong>{project.clientName}</strong> pada proyek yang berlokasi di <strong>{project.projectLocation}</strong>.
                    </div>

                    <p className="text-[11px] print:mt-1 sm:text-xs md:text-sm print:text-[10pt] mb-2">Berikut rincian pekerjaan dan material yang sudah diselesaikan:</p>

                    <table className="w-full text-sm border-collapse mb-8 border border-black print:mb-2">
                        <thead className="bg-gray-50 print:bg-transparent print:text-[10pt] print:p-0">
                            <tr className="border-b border-black text-center font-bold">
                                <th className="border-r border-black py-2 w-12 print:py-0" rowSpan={2}>No.</th>
                                <th className="border-r border-black py-2 print:py-0" rowSpan={2}>Item</th>
                                <th className="py-1 border-b border-black print:py-0" colSpan={2}>Volume</th>
                            </tr>
                            <tr className="border-b border-black text-center font-bold">
                                <th className="border-r border-black py-1 w-20 print:py-0">Qty</th>
                                <th className="py-1 w-20 print:py-0">Sat</th>
                            </tr>
                        </thead>
                        <tbody className="print:text-[10pt]">
                            {bap.items.map((item, index) => (
                                <tr key={item.id} className="border-b border-black">
                                    <td className="border-r border-black py-2 text-center print:py-0">{index + 1}</td>
                                    <td className="border-r border-black py-2 px-3 print:py-0">{item.description}</td>
                                    <td className="border-r border-black py-2 text-center print:py-0">{item.qty}</td>
                                    <td className="py-2 text-center print:py-0">{item.unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="text-sm text-justify leading-relaxed print:leading-relaxed mb-8 print:text-[10pt] print:mb-1">
                        <p className="mb-4 print:m-0 print:p-0 print:mb-1">Dokumentasi proses dan hasil pekerjaan terlampir.</p>
                        <p className="print:mb-2 print:p-0">Demikian Berita Acara Penyelesaian Pekerjaan ini kami buat sebagai <strong>pendukung yang sah</strong> karena ditanda tangani oleh pihak berkepentingan dan dapat digunakan dengan baik dikemudian hari. Atas perhatiannya kami ucapkan terima kasih.</p>
                    </div>
                </div>

                {/* PERUBAHAN: Tambahkan mt-auto pada tabel ini agar tertahan di bawah */}
                <table className="w-full text-sm print:text-[10pt] text-center border-collapse border border-black print:break-inside-avoid mt-auto">
                    <thead>
                        <tr>
                            <th className="border border-black py-2 font-bold w-1/2 print:p-0">Dibuat Oleh,</th>
                            <th className="border border-black py-2 font-bold w-1/2 print:p-0">Diketahui dan Disetujui Oleh,</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-r border-black py-1">CV Putra Jaya</td>
                            <td className="py-1">{project.clientName}</td>
                        </tr>
                        <tr>
                            <td className="border-r border-black h-24 relative print:h-18"></td>
                            <td className="h-24 print:h-18"></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* PEMISAH HALAMAN MUTLAK */}
            <div className="hidden print:block w-full h-0" style={{ pageBreakBefore: 'always', clear: 'both' }}></div>

            {/* HALAMAN 2: LAMPIRAN FOTO */}
            <div className="bg-white w-full max-w-[21cm] min-h-auto md:min-h-[29.7cm] mx-auto p-8 sm:p-10 md:p-12 shadow-2xl mt-8 print:shadow-none print:p-0 print:max-w-none print:min-h-0 print:mt-0 relative">
                {/* Kop Surat Lampiran */}
                <div className="flex justify-between items-stretch border-2 border-black mb-8 h-16 md:h-20 print:h-20 print:p-0 print:m-0">
                    <div className="flex justify-start items-center p-2">
                        <Image src="/PutraJaya_Logo.png" alt="Logo" width={64} height={64} className="object-contain w-10 h-10 md:w-16 md:h-16 print:w-16 print:h-16" />
                    </div>
                    <div className="flex-1 flex items-center justify-center font-black text-lg md:text-3xl print:text-[20pt] text-center">
                        CV PUTRA JAYA
                    </div>
                    <div className="border-l-2 border-black w-20 md:w-32 print:w-28 flex items-center justify-center font-bold text-gray-500 text-sm md:text-xl print:text-[14pt] print:text-gray-600">
                        BAPP
                    </div>
                </div>

                <table className="w-full text-sm border-collapse border border-black print:mt-2">
                    <thead>
                        <tr>
                            <th className="border-b border-black py-2 text-center font-bold bg-gray-50 print:bg-transparent" colSpan={3}>
                                <div className="text-sm print:text-[14pt]">LAMPIRAN BERITA ACARA PENYELESAIAN PEKERJAAN</div>
                                <div className="text-xs font-normal print:text-[10pt]">No: {bap.bapNumber}</div>
                            </th>
                        </tr>
                        <tr className="border-b border-black text-center font-bold print:text-[10pt]">
                            <th className="border-r border-black py-2 w-10 print:p-0">No.</th>
                            <th className="border-r border-black py-2 w-1/3 print:p-0">Deskripsi</th>
                            <th className="py-2 print:p-0">Dokumentasi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bap.attachments.map((item, index) => (
                            <tr key={item.id} className="border-b border-black print:break-inside-avoid print:text-[10pt]">
                                {/* MENGGUNAKAN CLASS CUSTOM UNTUK PADDING */}
                                <td className="border-r border-black p-2 text-center align-center lampiran-td">{index + 1}</td>
                                <td className="border-r border-black p-2 align-center leading-relaxed print:text-xs lampiran-td">{item.description}</td>
                                <td className="p-2 flex justify-center lampiran-td">
                                    {/* MENGGUNAKAN CLASS CUSTOM UNTUK GAMBAR */}
                                    <img src={item.imageUrl} alt={item.description} className="max-w-full max-h-48 object-contain lampiran-img" />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
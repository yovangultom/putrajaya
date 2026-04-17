// src/app/(admin)/admin/pengajuan/[id]/formulir/cetak/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import PrintButton from "@/app/(admin)/admin/invoices/[id]/PrintButton";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const project = await prisma.project.findUnique({ where: { id } });
    return { title: `Formulir-Tugas-${project?.clientName || 'Proyek'}` };
}

export default async function FormulirCetakPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id },
        include: { pengajuanItems: true }
    });

    if (!project) notFound();

    // Siapkan baris tabel. Minimal 8 baris sesuai contoh formulir fisik.
    const tableRows = [...project.pengajuanItems];
    const minRows = 8;
    while (tableRows.length < minRows) {
        tableRows.push({ id: `empty-${tableRows.length}`, description: "", qty: "", unit: "" } as any);
    }

    return (
        <div className="min-h-screen bg-slate-50 py-4 md:py-8 px-2 md:px-0 print:py-0 print:px-0 print:bg-white text-black font-['Arial'] print:block print:text-black">

            {/* CSS Khusus Print */}
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

            {/* Header Navigasi */}
            <div className="w-full max-w-[21cm] mx-auto mb-4 md:mb-6 flex justify-between items-center print:hidden px-2 md:px-0">
                <Link href={`/admin/pengajuan/${project.id}`} className="flex items-center gap-2 text-slate-800 hover:text-slate-900 text-xs md:text-sm font-medium">
                    <ArrowLeft size={16} /> <span className="hidden sm:inline">Kembali ke Proyek</span><span className="sm:hidden">Kembali</span>
                </Link>
                <PrintButton />
            </div>

            {/* HALAMAN KERTAS A4 */}
            <div className="bg-white w-full max-w-[21cm] min-h-auto md:min-h-[29.7cm] mx-auto p-4 sm:p-8 md:p-10 shadow-2xl print:shadow-none print:p-0 print:max-w-none print:min-h-0 print:block relative">

                {/* Header Kop Surat */}
                <div className="flex items-center sm:items-start gap-1 md:gap-8 border-b-4 border-black pb-4 md:pb-5 mb-6 md:mb-8 print:pb-1 print:mb-2 print:border-b-2">
                    {/* LOGO */}
                    <div className="shrink-0 pt-1 print:pt-0">
                        <Image
                            src="/PutraJaya_Logo.png"
                            alt="Logo CV Putra Jaya"
                            width={85}
                            height={85}
                            className="object-contain w-12 h-12 sm:w-16 sm:h-16 md:w-21.25 md:h-21.25 print:w-17.5 print:h-17.5"
                        />
                    </div>

                    {/* 2. BAGIAN KANAN: TEKS IDENTITAS */}
                    <div className="flex-1 flex flex-col justify-start text-black">
                        <h1 className="text-lg sm:text-xl md:text-2xl print:text-[14pt] text-center font-black tracking-tighter leading-none mb-1 md:mb-2 print:mb-1">
                            CV PUTRA JAYA
                        </h1>
                        <p className="text-[9px] sm:text-[11px] md:text-[10pt] print:text-[10pt] text-center leading-tight print:leading-none">
                            Jl. KH Mochammad RT.01 RW.02 No.86,
                        </p>
                        <p className="text-[9px] sm:text-[11px] md:text-[10pt] print:text-[10pt] text-center leading-tight print:leading-none">
                            Kelurahan Mangunjaya, Kecamatan Tambun Selatan, Kabupaten Bekasi, Jawa Barat 17510
                        </p>
                        <div className="text-[9px] sm:text-[11px] md:text-[10pt] print:text-[10pt] text-center leading-tight mt-1 print:leading-none print:mt-0">
                            <span className="block sm:inline">Tlp. 087888431444</span>
                            <span className="hidden sm:inline">       </span>
                            <span className="text-blue-700 underline block sm:inline">www.jasacoring.co.id</span>
                        </div>
                    </div>
                </div>

                {/* BINGKAI KONTEN UTAMA */}
                <div className="border border-black p-3 sm:p-5 md:p-6 print:border print:p-2 print:text-[10pt]">

                    <h2 className="text-center text-sm sm:text-lg md:text-xl print:text-[12pt] font-bold  mb-4 sm:mb-6 print:mb-2 uppercase">
                        Formulir Pemberi Tugas Kerja
                    </h2>

                    {/* FIELD ISIAN KOSONG */}
                    <div className="grid grid-cols-[100px_10px_1fr] sm:grid-cols-[140px_10px_1fr] md:grid-cols-[160px_10px_1fr] print:grid-cols-[170px_10px_1fr] gap-y-1.5 sm:gap-y-2 print:gap-y-0 text-[9px] sm:text-xs md:text-sm print:text-[11pt] mb-4 sm:mb-6 print:mb-2 font-medium">
                        <div>Nama Lengkap</div><div>:</div><div className="border-b border-dotted border-gray-400 print:border-gray-600"></div>
                        <div>Handphone</div><div>:</div><div className="border-b border-dotted border-gray-400 print:border-gray-600"></div>
                        <div>Nama Perusahaan</div><div>:</div><div className="border-b border-dotted border-gray-400 print:border-gray-600"></div>
                        <div>Alamat Perusahaan</div><div>:</div><div className="border-b border-dotted border-gray-400 print:border-gray-600"></div>
                        <div className="h-1 sm:h-2 print:h-2 col-span-3"></div>
                        <div>Telephone kantor</div><div>:</div><div className="border-b border-dotted border-gray-400 print:border-gray-600"></div>
                        <div>Nama proyek</div><div>:</div><div className="border-b border-dotted border-gray-400 print:border-gray-600"></div>
                        <div>Alamat proyek</div><div>:</div><div className="border-b border-dotted border-gray-400 print:border-gray-600"></div>
                        <div className="h-1 sm:h-2 print:h-2 col-span-3"></div>
                    </div>

                    {/* TABEL ITEM PEKERJAAN */}
                    <table className="w-full text-[9px] sm:text-xs md:text-sm print:text-[10pt] border-collapse border border-black print:border mb-4 sm:mb-6 print:mb-1">
                        <thead>
                            <tr>
                                <th className="border-r border-b border-black py-1 sm:py-2 print:py-0 w-8 sm:w-10 print:w-12 text-center" rowSpan={2}>No.</th>
                                <th className="border-r border-b border-black py-1 sm:py-2 print:py-0 text-center" rowSpan={2}>Item Pekerjaan</th>
                                <th className="py-1 print:py-0 border-b border-black text-center" colSpan={2}>Volume</th>
                            </tr>
                            <tr>
                                <th className="border-r border-b border-black py-1 print:py-0 w-12 sm:w-16 print:w-20 text-center">Qty</th>
                                <th className="border-b border-black py-1 print:py-0 w-12 sm:w-16 print:w-20 text-center">Sat</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows.map((item, index) => (
                                <tr key={item.id || index} className="border-b border-black h-6 sm:h-8 print:h-7">
                                    <td className="border-r border-black text-center  py-0">{index + 1}</td>
                                    <td className="border-r border-black px-2 sm:px-3 print:px-3 py-0">{item.description}</td>
                                    <td className="border-r border-black text-center py-0">{item.qty || ""}</td>
                                    <td className="text-center py-0">{item.unit || ""}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* SYARAT DAN KETENTUAN */}
                    <div className="text-[9px] sm:text-xs md:text-sm print:text-[11pt] leading-relaxed print:leading-none">
                        <div className="grid grid-cols-[100px_10px_1fr] sm:grid-cols-[120px_10px_1fr] md:grid-cols-[140px_10px_1fr] print:grid-cols-[150px_10px_1fr] mb-3 sm:mb-4 print:mb-4 items-start">
                            <div className="font-bold pt-1.5 print:pt-0">Cara pembayaran</div>
                            <div className="font-bold pt-1.5 print:pt-0">:</div>
                            <div
                                contentEditable
                                suppressContentEditableWarning
                                className="font-bold bg-amber-50 border-2 border-dashed border-amber-300 hover:bg-amber-100 focus:bg-white focus:border-blue-500 focus:border-solid outline-none transition-colors p-1.5 rounded-lg print:bg-transparent print:border-none print:p-0 print:text-[11pt]"
                            >
                                Tunai setelah pekerjaan selesai, sebelum manpower meninggalkan lokasi proyek.
                            </div>
                        </div>

                        <p className="mb-1 sm:mb-2 print:my-2">Berikut syarat dan ketentuan yang disepakati :</p>
                        <ol className="list-decimal pl-4 sm:pl-5 print:pl-6 space-y-1 print:space-y-1 text-[8px] sm:text-[11px] md:text-[13px] print:text-[10.5pt] text-justify pr-1">
                            <li>Jika ketebalan beton lebih dari yang disebutkan diatas, maka harga akan dihitung sesuai aktual di lapangan.</li>
                            <li>Jika pengerjaan coring keliru akibat <strong>kesalahan marking</strong> diluar tanggung jawab kami dan akan tetap kami perhitungkan dengan biaya sebesar tersebut diatas.</li>
                            <li>Apabila bukan karena kesalahan dari pihak kami, terdapat kekosongan hari kerja sehingga pekerjaan pengeboran/coring tidak dapat dilaksanakan dan pihak kami sudah siap di lapangan pada waktu yang bersamaan maka akan dikenakan biaya <strong>stand-by fee</strong> sebesar Rp 300.000,-/hari.</li>
                            <li>Apabila ada <strong>tambahan titik</strong> coring, maka akan dikenakan biaya tersebut diatas.</li>
                            <li>Daya yang dibutuhkan untuk mesin coring 3.850 watt 1 phase.</li>
                            <li>Jika lokasi pekerjaan berada di ketinggian serta berisiko tinggi, pemberi tugas harus menyediakan APD sesuai kebutuhan.</li>
                            <li>Jika dibutuhkan test covid-19, biaya akan ditanggung oleh pemberi tugas.</li>
                        </ol>
                    </div>

                    {/* TANDA TANGAN */}
                    <div className="mt-6 sm:mt-12 print:mt-12 flex justify-end text-[9px] sm:text-xs md:text-sm print:text-[11pt]">
                        <div className="w-40 sm:w-56 md:w-64 print:w-72 text-left">
                            <p className="mb-12 sm:mb-20 print:mb-24">Pemberi tugas, ..........................2026</p>
                            <div className="grid grid-cols-[40px_10px_1fr] sm:grid-cols-[60px_10px_1fr] print:grid-cols-[60px_10px_1fr] gap-y-1 print:gap-y-2">
                                <div>Nama</div><div>:</div><div className="border-b border-dotted border-black"></div>
                                <div>Jabatan</div><div>:</div><div className="border-b border-dotted border-black"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
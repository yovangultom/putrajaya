// src/app/(admin)/admin/pengajuan/[id]/cetak/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import PrintButton from "@/app/(admin)/admin/invoices/[id]/PrintButton";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const project = await prisma.project.findUnique({
        where: { id }
    });

    // Nama file: Penawaran-Pekerjaan-Coring-Bapak-John.pdf
    const safeTitle = project?.title.replace(/\s+/g, "-") || "Penawaran";
    return {
        title: `Penawaran-${safeTitle}-${project?.clientName}`,
    };
}

export default async function PenawaranPrintPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id: id },
        include: { pengajuanItems: true }
    });

    if (!project) notFound();

    const totalEstimasi = project.pengajuanItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);
    const formatRp = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

    function terbilang(angka: number): string {
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
        return hasil.trim();
    }

    return (
        <div className="min-h-screen bg-slate-50 py-4 md:py-8 px-2 md:px-0 print:py-0 print:px-0 print:bg-white text-black font-['Arial'] print:block print:text-black">

            {/* CSS INJEKSI: Menjaga layout print tetap utuh dan membuang menu global */}
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

            <div className="w-full max-w-[21cm] mx-auto mb-4 md:mb-6 flex justify-between items-center print:hidden px-2 md:px-0">
                <Link href={`/admin/pengajuan/${project.id}`} className="flex items-center gap-2 text-slate-800 hover:text-slate-900 text-xs md:text-sm font-medium">
                    <ArrowLeft size={16} /> <span className="hidden sm:inline">Kembali ke Proyek</span><span className="sm:hidden">Kembali</span>
                </Link>
                <PrintButton />
            </div>

            <div className="bg-white w-full max-w-[21cm] min-h-auto md:min-h-[29.7cm] mx-auto p-4 sm:p-8 md:p-10 shadow-2xl print:shadow-none print:p-0 print:max-w-none print:min-h-0 print:block relative">

                {/* Header Kop Surat */}
                <div className="flex items-center sm:items-start gap-1 md:gap-8 border-b-4 border-black pb-4 md:pb-5 mb-6 md:mb-8 print:pb-1 print:mb-1 print:border-b-2">
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

                {/* Info Dokumen */}
                <div className="text-right mb-4 md:mb-0 print:mt-2">
                    <p className="text-[10pt] md:text-[13px] print:text-[10pt]">Bekasi, {new Date(project.createdAt).toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                </div>

                <div className="mb-6 md:mb-8 text-[11px] sm:text-xs md:text-sm print:text-[10pt] flex justify-between">
                    <div className="w-full sm:max-w-[12cm] print:max-w-[12cm]">
                        <p className="text-sm md:text-base text-black mb-1">Kepada Yth,</p>
                        {project.clientCompany && (
                            <p className="text-sm md:text-base font-bold uppercase">{project.clientCompany}</p>
                        )}
                        <p className="text-sm md:text-base font-bold">{project.clientName}</p>
                        <p className="leading-relaxed mt-1">{project.projectLocation}</p>
                    </div>
                </div>

                <p className="text-[11px] sm:text-xs md:text-sm print:text-[10pt] mb-3 md:mb-4 ">Perihal: Penawaran Harga {project.title}</p>
                <p className="text-[11px] sm:text-xs md:text-sm print:text-[10pt] mb-2">Sehubungan dengan hal tersebut, bersama ini kami sampaikan pengajuan harga pekerjaan dengan rincian sebagai berikut:</p>

                {/* Tabel Penawaran */}
                <table className="w-full text-[9px] sm:text-xs md:text-sm print:text-[10pt] border-collapse mb-2 border border-black">
                    <thead>
                        <tr className="border-b border-black text-center font-bold bg-gray-50 print:bg-transparent">
                            <th className="border-r border-black py-1.5 md:py-1 w-6 md:w-10 print:w-10 print:py-0">No.</th>
                            <th className="border-r border-black py-1.5 md:py-1 print:py-0">Deskripsi Pekerjaan</th>
                            <th className="border-r border-black py-1.5 md:py-1  print:py-0 w-14 md:w-24 print:w-24" colSpan={2}>Volume</th>
                            <th className="border-r border-black py-1.5 md:py-1 print:py-0 w-20 md:w-32 print:w-32">Harga Satuan</th>
                            <th className="py-1.5 md:py-1 w-24 md:w-36 print:w-36 print:py-0">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {project.pengajuanItems.map((item, index) => (
                            <tr key={item.id} className="border-b border-black">
                                <td className="border-r border-black text-center print:py-0 py-1.5 md:py-1 px-1 align-top">{index + 1}</td>
                                <td className="border-r border-black px-1.5 md:px-3 py-1.5 md:py-1 print:py-0 align-top leading-relaxed">{item.description}</td>
                                <td className="border-r border-black border-dashed text-center w-6 md:w-10 print:py-0 print:w-10 py-1.5 md:py-1 align-top">{item.qty}</td>
                                <td className="border-r border-black text-center w-8 md:w-12 print:w-12 py-1.5 print:py-0 md:py-1 align-top">{item.unit}</td>
                                <td className="border-r border-black px-1.5 md:px-3 py-1.5 md:py-1 print:py-0 align-top">
                                    <div className="flex justify-between w-full "><span>Rp</span><span>{item.price.toLocaleString('id-ID')}</span></div>
                                </td>
                                <td className="px-1.5 md:px-3 py-1.5 md:py-1 print:py-0 font-bold align-top">
                                    <div className="flex justify-between w-full"><span>Rp</span><span>{(item.qty * item.price).toLocaleString('id-ID')}</span></div>
                                </td>
                            </tr>
                        ))}
                        <tr className="font-bold text-[10px] sm:text-sm md:text-base print:text-[11pt] bg-gray-50 print:bg-transparent">
                            <td colSpan={5} className="border-r border-black py-1.5 md:py-1 px-2 text-center sm:text-right print:text-center print:py-0">TOTAL</td>
                            <td className="py-1.5 md:py-1 px-1.5 md:px-3 print:py-0">
                                <div className="flex justify-between w-full"><span>Rp</span><span>{totalEstimasi.toLocaleString('id-ID')}</span></div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="flex flex-col sm:flex-row sm:gap-4 text-[11px] sm:text-xs md:text-sm print:text-sm text-black mb-8 md:mb-10 mt-3">
                    <div className="font-bold w-full sm:w-24 print:w-24">Terbilang:</div>
                    <div className="font-bold italic mt-1 sm:mt-0 bg-slate-100 print:bg-transparent px-2 py-1 sm:p-0 rounded-md sm:rounded-none">{terbilang(totalEstimasi)} Rupiah</div>
                </div>

                {/* Penutup & TTD */}
                <p className="text-[11px] sm:text-xs md:text-sm print:text-[11pt] mb-10 md:mb-12 print:mb-12  leading-relaxed">Demikian pengajuan harga {project.title} kami sampaikan. Atas perhatian dan kerja sama Bapak/Ibu, kami ucapkan terimakasih. </p>

                <div className="flex justify-end pr-4 md:pr-10 print:pr-10 text-[11px] sm:text-xs md:text-sm print:text-[11pt] print:break-inside-avoid">
                    <div className="text-center">
                        <p className="mb-12 md:mb-16 print:mb-16">Hormat Kami,</p>
                        <p className="font-bold underline">Eka Aji Saputro</p>
                        <p>(CV Putra Jaya)</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import PrintButton from "./PrintButton";

export default async function CetakSPKPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const contract = await prisma.contract.findUnique({
        where: { id: id },
        include: {
            project: {
                include: {
                    pengajuanItems: true,
                    termins: { orderBy: { id: 'asc' } }
                }
            }
        }
    });

    if (!contract || !contract.project) notFound();
    const project = contract.project;

    const totalEstimasi = project.pengajuanItems.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);

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

    const formatDate = (date: Date | null) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });
    };

    const selisihHari = project.startDate && project.endDate
        ? Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 3600 * 24))
        : 0;

    return (
        <div className="min-h-screen bg-slate-50 py-8 text-black font-['Arial'] print:bg-white print:py-0">

            <style dangerouslySetInnerHTML={{
                __html: `
                    @media print {
                        @page { size: A4 portrait; margin: 2cm; }
                        body { 
                            background: white; 
                            counter-reset: page; /* Inisialisasi counter halaman */
                        }
                        nav, aside, header, button, .print-hidden { display: none !important; }
                        
                        print-footer {
                            position: fixed;
                            bottom: -1cm; /* Ditarik masuk ke area margin kosong kertas sejauh 1.5cm */
                            left: 0;
                            right: 0;
                            font-size: 9pt;
                            text-align: right;
                            color: #64748b; /* Warna abu-abu elegan */
                            border-top: 1px solid #cbd5e1; /* Opsional: Garis atas tipis */
                            padding-top: 10px;
                        }
                    }
                `
            }} />

            <div className="max-w-[21cm] mx-auto mb-6 flex justify-between print-hidden px-4 md:px-0">
                <Link href={`/admin/pengajuan/${project.id}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm">
                    <ArrowLeft size={16} /> Kembali ke Proyek
                </Link>
                <PrintButton />
            </div>

            <div className="bg-white max-w-[21cm] mx-auto p-8 md:p-12 shadow-xl print:shadow-none print:p-0 leading-tight print:leading-tight print:pb-24">

                <h1 className="text-center font-bold text-lg md:text-xl uppercase tracking-none mb-4 print:text-[14pt]">
                    SURAT PERJANJIAN KERJA
                </h1>

                <p className="mb-2 text-sm md:text-base text-justify leading-relaxed print:text-[11pt]">
                    Pada hari ini, <strong className="font-bold">{formatDate(contract.createdAt)}</strong>, yang bertanda tangan di bawah ini:
                </p>

                <div className="mb-2 space-y-4 text-sm md:text-base leading-tight print:text-[11pt]">
                    {/* PIHAK PERTAMA */}
                    <div>
                        <div className="flex">
                            <div className="w-6">1.</div>
                            <div className="w-24">Nama</div>
                            <div>: {project.clientName}</div>
                        </div>
                        <div className="flex">
                            <div className="w-6"></div>
                            <div className="w-24">Alamat</div>
                            <div>: {project.clientAddress || "[Alamat Lengkap Pemilik]"}</div>
                        </div>
                        <div className="flex">
                            <div className="w-6"></div>
                            <div className="w-24">No. KTP</div>
                            <div>: {project.clientKtp || "[Nomor KTP]"}</div>
                        </div>
                        <div className="ml-6">Selanjutnya disebut sebagai <strong>PIHAK PERTAMA (Pemilik)</strong>.</div>
                    </div>

                    {/* PIHAK KEDUA */}
                    <div>
                        <div className="flex">
                            <div className="w-6">2.</div>
                            <div className="w-24">Nama</div>
                            <div>: {contract.pihakKeduaNama || "Ratno Palupi"}</div>
                        </div>
                        <div className="flex">
                            <div className="w-6"></div>
                            <div className="w-24">Alamat</div>
                            <div>: {contract.pihakKeduaAlamat || "Kp. Siluman RT.01 RW.02 No.123, Mangunjaya, Tambun Selatan, Bekasi"}</div>
                        </div>
                        <div className="flex ">
                            <div className="w-6"></div>
                            <div className="w-24">No. KTP</div>
                            <div>: {contract.pihakKeduaKtp || "3216061304770020"}</div>
                        </div>
                        <div className="ml-6">Selanjutnya disebut sebagai <strong>PIHAK KEDUA (Pemborong)</strong>.</div>
                    </div>
                </div>

                <p className="mb-2 text-sm md:text-base text-justify leading-tight print:text-[11pt]">
                    Kedua belah pihak telah sepakat untuk mengadakan perjanjian kerja renovasi yang berlokasi di <strong>{project.projectLocation}</strong> dengan ketentuan sebagai berikut:
                </p>

                {/* PASAL 1 */}
                <h2 className="font-bold text-lg md:text-base  print:text-[11pt]">PASAL 1: LINGKUP PEKERJAAN</h2>
                <p className="mb-2 text-sm md:text-base text-justify leading-tight print:text-[11pt]">
                    {contract.scopeOfWork || "PIHAK KEDUA bersedia melaksanakan pekerjaan sesuai dengan desain dan spesifikasi yang telah disepakati bersama (Lampiran Gambar/RAB)."}
                </p>

                {/* PASAL 2 */}
                <h2 className="font-bold text-lg md:text-base  print:text-[11pt]">PASAL 2: JANGKA WAKTU</h2>
                <p className="mb-2 text-sm md:text-base text-justify leading-tight print:text-[11pt]">
                    Pekerjaan akan dimulai pada tanggal <strong>{formatDate(project.startDate)}</strong> dan ditargetkan selesai dalam waktu <strong>{selisihHari} Hari</strong>, atau paling lambat tanggal <strong>{formatDate(project.endDate)}</strong>.
                </p>

                {/* PASAL 3 */}
                <h2 className="font-bold text-lg md:text-base  print:text-[11pt]">PASAL 3: BIAYA DAN SISTEM PEMBAYARAN</h2>
                <ol className="list-decimal pl-8 mb-2 text-sm md:text-base text-justify leading-tight space-y-2 print:text-[11pt]">
                    <li className="mb-0">
                        Total biaya pekerjaan adalah sebesar <strong>Rp{(totalEstimasi).toLocaleString('id-ID')},00</strong> (Terbilang: {terbilang(totalEstimasi)} Rupiah).
                    </li>
                    <li className="mb-1">
                        Sistem pembayaran dilakukan secara bertahap (termin) sebagai berikut:
                        <ul className="list-[lower-alpha] pl-6  space-y-3 my-1">
                            {project.termins.map((termin, index) => (
                                <li key={termin.id} className="pl-2 mb-0">
                                    <strong>{termin.name}</strong>: sebesar <strong>{termin.percentage}%</strong> <strong> (Rp{(termin.amount).toLocaleString('id-ID')},00)</strong>, dibayarkan {index === 0 ? "setelah tanda tangan kontrak." : "setelah menyelesaikan skup pekerjaan termin sebelumnya."}
                                    {termin.description && (
                                        <div className="mb-0">
                                            <span>Dengan skup pekerjaan yang harus diselesaikan untuk menerima Termin selanjutnya sebagai berikut:</span>
                                            <div className="pl-4 whitespace-pre-wrap ">
                                                {termin.description}
                                            </div>
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="mb-0">Apabila pekerjaan telah selesai lebih cepat dari waktu yang ditentukan, PIHAK KEDUA berhak mengajukan pembayaran.</li>
                    <li className="mb-0">Apabila progres pekerjaan lebih lambat dari waktu yang ditentukan, PIHAK PERTAMA akan membayar setelah progress pekerjaan selesai.</li>
                </ol>

                {/* PASAL 4 */}
                <h2 className="font-bold text-sm md:text-base  print:text-[11pt] leading-tight">PASAL 4: KEWAJIBAN PIHAK KEDUA</h2>
                <ol className="list-decimal pl-8 mb-2 text-sm md:text-base text-justify leading-tight">
                    <li>Melaksanakan pekerjaan dengan kualitas yang baik sesuai spesifikasi.</li>
                    <li>Menyediakan tenaga kerja dan peralatan yang diperlukan.</li>
                    <li>Menjaga kebersihan dan keamanan di lokasi proyek.</li>
                </ol>

                {/* PASAL 5 */}
                <h2 className="font-bold text-sm md:text-base print:text[11pt] leading-tight">PASAL 5: PERUBAHAN PEKERJAAN</h2>
                <p className="mb-2 text-sm md:text-base text-justify leading-tight ">
                    {contract.changesPolicy || "Apabila PIHAK PERTAMA meminta perubahan di luar kesepakatan awal (tambah/kurang), maka hal tersebut akan dituangkan dalam kesepakatan tertulis tambahan (Addendum) dan akan diperhitungkan kembali biayanya."}
                </p>

                {/* PASAL 6 */}
                <h2 className="font-bold text-sm md:text-base print:text-[11pt] leading-tight">PASAL 6: PENYELESAIAN PERSELISIHAN</h2>
                <p className="mb-2 text-sm md:text-base text-justify leading-tight">
                    {contract.disputeResolution || "Apabila terjadi perselisihan, kedua belah pihak sepakat untuk menyelesaikannya secara musyawarah mufakat."}
                </p>

                <div className="print:break-inside-avoid mt-8">
                    <p className="mb-5 text-sm md:text-base text-justify leading-tight print:text-[11pt] mt-4">
                        Demikian surat perjanjian ini dibuat dalam dua rangkap bermaterai cukup yang mempunyai kekuatan hukum yang sama.
                    </p>
                    <p className="text-right mb-0 print:text-[11pt]">Bekasi, {formatDate(new Date())}</p>

                    {/* Tanda Tangan */}
                    <div className="flex justify-between items-start text-sm md:text-base mt-0 print:break-inside-avoid print:text-[11pt]">
                        <div className="text-center">
                            <p className="mb-24">PIHAK PERTAMA (Pemilik)</p>
                            <p className="font-bold  uppercase">{project.clientName}</p>
                        </div>
                        <div className="text-center">
                            <p className="mb-24">PIHAK KEDUA (Pemborong)</p>
                            <p className="font-bold  uppercase">{contract.pihakKeduaNama || "RATNO PALUPI"}</p>
                        </div>
                    </div>
                </div>

            </div>
            <div className="hidden print:block print:fixed print:bottom-0 print:left-0 print:right-0 print:px-0 print:pb-0 print:text-right print:text-[9pt] print:text-slate-400">
                Surat Perjanjian Kerja-{project.clientName}-{formatDate(contract.createdAt)}
            </div>
        </div >
    );
}
"use client";

import { useState } from "react";
import { updateSPK } from "./actions";
import { Save, User, FileText, ListChecks, MapPin, Building2 } from "lucide-react";
import { useRouter } from "next/navigation"; // <--- 1. IMPORT USEROUTER

export default function SPKForm({ contract, project, termins }: any) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter(); // <--- 2. INISIALISASI ROUTER
    // State untuk menyimpan inputan deskripsi termin
    const [terminData, setTerminData] = useState(
        termins.map((t: any) => ({ id: t.id, name: t.name, description: t.description || "" }))
    );

    const handleTerminChange = (id: string, value: string) => {
        setTerminData(terminData.map((t: any) => t.id === id ? { ...t, description: value } : t));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            // 3. Panggil Server Action
            await updateSPK(contract.id, project.id, formData, terminData);

            // 4. JIKA BERHASIL, PINDAH HALAMAN DARI CLIENT
            router.push(`/admin/spk/${contract.id}/cetak`);

        } catch (error) {
            console.error(error);
            setIsLoading(false);
            alert("Terjadi kesalahan saat menyimpan SPK.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bagian 1A: Identitas Klien */}
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 text-sm">
                        <User size={18} className="text-blue-600" /> Pihak Pertama (Pemilik)
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Nama Klien</label>
                            <input name="clientName" type="text" required defaultValue={project.clientName} className="text-black w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Nomor KTP</label>
                            <input name="clientKtp" type="text" required defaultValue={project.clientKtp || ""} placeholder="Contoh: 3216061234567890" className="text-black w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Sesuai KTP</label>
                            <textarea name="clientAddress" required defaultValue={project.clientAddress || ""} rows={3} placeholder="Alamat lengkap..." className="text-black w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"></textarea>
                        </div>
                    </div>
                </div>

                {/* Bagian 1B: Identitas Perusahaan */}
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 text-sm">
                        <Building2 size={18} className="text-blue-600" /> Pihak Kedua (Pemborong)
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Nama Wakil Perusahaan</label>
                            <input name="pihakKeduaNama" type="text" required defaultValue={contract.pihakKeduaNama || "Ratno Palupi"} className="text-black w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Nomor KTP</label>
                            <input name="pihakKeduaKtp" type="text" required defaultValue={contract.pihakKeduaKtp || "3216061304770020"} className="text-black w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-slate-700 block mb-1">Alamat Lengkap</label>
                            <textarea name="pihakKeduaAlamat" required defaultValue={contract.pihakKeduaAlamat || "Kp. Siluman RT.01 RW.02 No.123, Mangunjaya, Tambun Selatan, Bekasi"} rows={3} className="text-black w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"></textarea>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bagian Baru: Lokasi Proyek */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 text-sm">
                    <MapPin size={18} className="text-blue-600" /> Alamat Lokasi Pekerjaan / Proyek
                </h3>
                <textarea name="projectLocation" required defaultValue={project.projectLocation} rows={2} className="text-black w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"></textarea>
            </div>

            {/* Bagian 2: Pasal 1 - Lingkup Pekerjaan */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 text-sm">
                    <FileText size={18} className="text-blue-600" /> Pasal 1: Lingkup Pekerjaan
                </h3>
                <textarea name="scopeOfWork" required defaultValue={contract.scopeOfWork || "PIHAK KEDUA bersedia melaksanakan pekerjaan renovasi rumah milik PIHAK PERTAMA sesuai dengan desain dan spesifikasi yang telah disepakati bersama (Lampiran Gambar/RAB)."} rows={3} className="text-black w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"></textarea>
            </div>

            {/* Bagian 3: Skup Pekerjaan per Termin */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2 text-sm">
                    <ListChecks size={18} className="text-blue-600" /> Skup Pekerjaan Per Termin
                </h3>
                <div className="space-y-6">
                    {terminData.map((termin: any, index: number) => (
                        <div key={termin.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                            <div className="flex justify-between items-center mb-2">
                                <p className="font-bold text-sm text-slate-800">{termin.name} {index === 0 ? "(DP)" : ""}</p>
                            </div>

                            {/* Termin 1 sekarang bisa diisi deskripsi */}
                            <div>
                                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                                    {index === 0 ? "Syarat Pekerjaan / Catatan DP (Opsional):" : "Syarat / Rincian Pekerjaan untuk Termin ini:"}
                                </label>
                                <textarea
                                    value={termin.description}
                                    onChange={(e) => handleTerminChange(termin.id, e.target.value)}
                                    rows={4}
                                    placeholder={index === 0 ? "Tulis keterangan jika ada..." : `1) Pemasangan hebel lantai 3...\n2) Pekerjaan plester dan aci...`}
                                    className="text-black w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                                ></textarea>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <button disabled={isLoading} type="submit" className="w-full bg-slate-900 text-white font-black py-4 rounded-xl hover:bg-slate-800 transition-all text-sm tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
                {isLoading ? "MENYIMPAN DOKUMEN..." : <><Save size={18} /> SIMPAN & LANJUT CETAK SPK</>}
            </button>
        </form>
    );
}
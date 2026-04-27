"use client";

import { useRef, useState } from "react";
import { submitPortfolio } from "@/actions/portfolioActions";

export default function FormInput() {
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);

    async function handleAction(formData: FormData) {
        setLoading(true);
        const result = await submitPortfolio(formData);

        if (result.success) {
            alert(result.message);
            formRef.current?.reset();
        } else {
            alert(result.message);
        }
        setLoading(false);
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-8 border border-slate-100 max-w-5xl mx-auto">
            <h2 className="text-2xl font-black text-[#0B0C35] mb-6">Tambah Portofolio Publik</h2>

            <form ref={formRef} action={handleAction} className="space-y-5">
                {/* ... Judul, Klien, Kategori, Lokasi, Tgl, Deskripsi biarkan SAMA seperti sebelumnya ... */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Judul Pengerjaan</label>
                    <input type="text" name="title" required placeholder="Contoh: Instalasi Genset 500kVA" className="w-full border text-black border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-[#F49414] outline-none" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nama Klien</label>
                        <input type="text" name="client" required placeholder="PT. Maju Mundur" className="w-full border text-black border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-[#F49414] outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Layanan</label>
                        <select name="category" className="w-full border text-black border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-[#F49414] outline-none">
                            <option value="Jasa Coring">Jasa Coring</option>
                            <option value="Service Genset">Service Genset</option>
                            <option value="Konstruksi Umum">Konstruksi Umum</option>
                            <option value="Chemical Anchor">Chemical Anchor</option>
                            <option value="Perencanaan Konstruksi">Perencanaan Konstruksi</option>
                            <option value="Jual Beli Genset">Jual Beli Genset</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi Pengerjaan</label>
                        <input type="text" name="location" required placeholder="Tambun, Bekasi" className="w-full border text-black border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-[#F49414] outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Selesai</label>
                        <input type="date" name="completionDate" required className="w-full border text-black border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-[#F49414] outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Detail Proyek</label>
                    <textarea name="description" required rows={5} placeholder="Jelaskan tantangan proyek..." className="w-full border text-black border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-[#F49414] outline-none"></textarea>
                </div>

                {/* --- PERUBAHAN INPUT FOTO --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                        <label className="block text-sm font-black text-[#0B0C35] mb-2">1. Gambar Utama (Wajib)</label>
                        <p className="text-xs text-slate-500 mb-2">Muncul di halaman depan dan thumbnail proyek.</p>
                        <input type="file" name="mainImage" accept="image/*" required className="text-black w-full border border-slate-300 p-2 rounded-lg bg-white cursor-pointer" />
                    </div>
                    <div>
                        <label className="block text-sm font-black text-[#0B0C35] mb-2">2. Foto Tambahan (Opsional)</label>
                        <p className="text-xs text-slate-500 mb-2">Tahan tombol CTRL/Shift untuk memilih maks. 4 foto.</p>
                        {/* Perhatikan atribut 'multiple' di bawah ini */}
                        <input type="file" name="galleryImages" accept="image/*" multiple className="text-black w-full border border-slate-300 p-2 rounded-lg bg-white cursor-pointer" />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#0B0C35] text-white font-black py-4 rounded-lg hover:bg-[#F49414] transition-colors mt-4 disabled:opacity-50">
                    {loading ? "Mungunggah dan Menyimpan Data..." : "Simpan dan Tampilkan di Web"}
                </button>
            </form>
        </div>
    );
}
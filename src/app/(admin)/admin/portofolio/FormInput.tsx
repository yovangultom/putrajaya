"use client";

import { useRef, useState } from "react";
import { submitPortfolio } from "@/actions/portfolioActions";
import imageCompression from "browser-image-compression";

export default function FormInput() {
    const formRef = useRef<HTMLFormElement>(null);
    const [loading, setLoading] = useState(false);
    const [notification, setNotification] = useState<{ isError: boolean; message: string } | null>(null);

    async function handleAction(formData: FormData) {
        setLoading(true);
        setNotification(null);

        try {
            const newFormData = new FormData();
            const options = {
                maxSizeMB: 1,
                maxWidthOrHeight: 1920,
                useWebWorker: true
            };
            for (const [key, value] of formData.entries()) {
                if (value instanceof File && value.size > 0) {
                    if (value.size > 1024 * 1024) {
                        try {
                            const compressedFile = await imageCompression(value, options);
                            newFormData.append(key, compressedFile, compressedFile.name);
                        } catch (compressErr) {
                            console.error("Gagal kompresi file:", compressErr);
                            newFormData.append(key, value);
                        }
                    } else {
                        newFormData.append(key, value);
                    }
                } else {
                    newFormData.append(key, value);
                }
            }
            const result = await submitPortfolio(newFormData);

            if (result.success) {
                setNotification({ isError: false, message: result.message || "Portofolio berhasil ditambahkan!" });
                formRef.current?.reset();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                setNotification({ isError: true, message: result.message || "Gagal menyimpan portofolio." });
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }

        } catch (error) {
            console.error("Submission error:", error);
            setNotification({
                isError: true,
                message: "Terjadi kesalahan sistem atau file terlalu besar. Silakan coba lagi."
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-md p-8 border border-slate-100 max-w-5xl mx-auto">
            <h2 className="text-2xl font-black text-[#0B0C35] mb-6">Tambah Portofolio Publik</h2>

            {notification && (
                <div className={`p-4 mb-6 rounded-lg font-bold border ${notification.isError ? "bg-red-50 text-red-600 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}>
                    {notification.isError ? "❌ " : "✅ "}
                    {notification.message}
                </div>
            )}

            <form ref={formRef} action={handleAction} className="space-y-5">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50 border border-slate-200 rounded-xl">
                    <div>
                        <label className="block text-sm font-black text-[#0B0C35] mb-2">1. Gambar Utama (Wajib)</label>
                        <p className="text-xs text-slate-500 mb-2">Muncul di halaman depan dan thumbnail proyek.</p>
                        <input type="file" name="mainImage" accept="image/*" required className="text-black w-full border border-slate-300 p-2 rounded-lg bg-white cursor-pointer" />
                    </div>
                    <div>
                        <label className="block text-sm font-black text-[#0B0C35] mb-2">2. Foto Tambahan (Opsional)</label>
                        <p className="text-xs text-slate-500 mb-2">Tahan tombol CTRL/Shift untuk memilih maks. 4 foto.</p>
                        <input type="file" name="galleryImages" accept="image/*" multiple className="text-black w-full border border-slate-300 p-2 rounded-lg bg-white cursor-pointer" />
                    </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-[#0B0C35] text-white font-black py-4 rounded-lg hover:bg-[#F49414] transition-colors mt-4 disabled:opacity-50 flex items-center justify-center">
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            Mengompres & Menyimpan Data...
                        </>
                    ) : "Simpan dan Tampilkan di Web"}
                </button>
            </form>
        </div>
    );
}
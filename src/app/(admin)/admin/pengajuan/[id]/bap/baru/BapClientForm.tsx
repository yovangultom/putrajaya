// src/app/(admin)/admin/pengajuan/[id]/bap/baru/BapClientForm.tsx
"use client";

import { useState } from "react";
import { ArrowLeft, Save, Trash2, FileCheck, Camera, ImagePlus } from "lucide-react";
import Link from "next/link";
import { simpanBapTermin } from "./actions";
import imageCompression from 'browser-image-compression';
import { useRouter } from "next/navigation";

export default function BapClientForm({ projectId, terminId, initialItems, projectTitle, terminName }: any) {
    const router = useRouter();
    const [items, setItems] = useState(initialItems);
    const [photos, setPhotos] = useState<{ file: File | null; preview: string; description: string }[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Hapus price dari default value penambahan item
    const handleTambahItem = () => setItems([...items, { description: "", qty: 0, unit: "titik" }]);
    const handleHapusItem = (index: number) => setItems(items.filter((_: any, i: number) => i !== index));
    const handleUbahItem = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index][field] = value;
        setItems(newItems);
    };

    const handleTambahFoto = () => {
        if (photos.length >= 20) {
            alert("Maksimal hanya boleh menambah 20 slot foto!");
            return;
        }
        setPhotos([...photos, { file: null, preview: "", description: "" }]);
    };
    const handleHapusFoto = (index: number) => setPhotos(photos.filter((_, i) => i !== index));

    const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const options = {
            maxSizeMB: 0.8,
            maxWidthOrHeight: 1280,
            useWebWorker: true,
            initialQuality: 0.8
        };

        try {
            setIsLoading(true);
            const compressedFile = await imageCompression(file, options);
            if (compressedFile.size > 1 * 1024 * 1024) {
                alert("Maaf, foto ini terlalu rumit untuk dikompres otomatis. Silakan gunakan foto lain.");
                e.target.value = "";
                return;
            }
            const newPhotos = [...photos];
            newPhotos[index].file = compressedFile;
            newPhotos[index].preview = URL.createObjectURL(compressedFile);
            setPhotos(newPhotos);
        } catch (error) {
            console.error("Gagal kompres gambar:", error);
            alert("Terjadi kesalahan saat memproses gambar.");
        } finally {
            setIsLoading(false);
            e.target.value = "";
        }
    };

    const handleUbahDeskripsiFoto = (index: number, value: string) => {
        const newPhotos = [...photos];
        newPhotos[index].description = value;
        setPhotos(newPhotos);
    };

    const handleSimpan = async () => {
        let totalPayloadSize = 0;
        let isOversize = false;

        photos.forEach(photo => {
            if (photo.file) {
                totalPayloadSize += photo.file.size;
                if (photo.file.size > 1 * 1024 * 1024) isOversize = true;
            }
        });

        if (isOversize) {
            alert("Penyimpanan Dibatalkan: Sistem gagal mengompres beberapa foto.");
            return;
        }

        // PERUBAHAN: BATAS TOTAL MENJADI 50 MB
        if (totalPayloadSize > 50 * 1024 * 1024) {
            alert("Penyimpanan Dibatalkan: Total gabungan seluruh foto terlalu besar (Max 50MB).");
            return;
        }

        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append("projectId", projectId);
            formData.append("terminId", terminId);

            const itemsToSave = items.map((item: any) => ({
                description: item.description,
                qty: Number(item.qty),
                unit: item.unit,
                price: 0
            }));
            formData.append("items", JSON.stringify(itemsToSave));

            photos.forEach((photo, index) => {
                if (photo.file) {
                    formData.append(`photo_${index}`, photo.file);
                    formData.append(`desc_${index}`, photo.description);
                }
            });

            const result = await simpanBapTermin(formData);

            if (result?.success) {
                alert("BAP berhasil dibuat! Anda sekarang bisa menerbitkan Invoice untuk termin ini.");
                router.refresh();
                router.push(`/admin/pengajuan/${projectId}`);
            } else {
                alert("Gagal: " + (result?.error || "Terjadi kesalahan server"));
                setIsLoading(false);
            }
        } catch (error) {
            console.error("Client Error:", error);
            alert("Terjadi kesalahan koneksi atau sistem.");
            setIsLoading(false);
        }
    };

    return (
        <div className="p-0 md:p-8 bg-slate-50 min-h-screen flex flex-col items-center">
            <div className="max-w-5xl w-full">

                <Link href={`/admin/pengajuan/${projectId}`} className="flex items-center gap-2 text-slate-800 hover:text-slate-900 mb-6 text-sm font-medium w-fit">
                    <ArrowLeft size={16} /> <span className="hidden sm:inline">Kembali ke Proyek</span><span className="sm:hidden">Kembali</span>
                </Link>

                <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden mb-8 md:mb-12">
                    <div className="bg-blue-600 h-2 w-full"></div>
                    <div className="p-5 md:p-10">
                        <h1 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight mb-1 md:mb-2 leading-tight">Berita Acara Pekerjaan</h1>
                        <p className="text-xs md:text-sm text-slate-800 mb-6 md:mb-10 font-bold uppercase text-blue-600">Proyek: {projectTitle} <br /><span className="text-slate-500 font-medium normal-case">Pembuatan BAP untuk {terminName}</span></p>

                        <div className="space-y-8 md:space-y-12">
                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                                        <FileCheck size={16} className="text-blue-600" /> <span className="hidden sm:inline">Rekapitulasi Pekerjaan Aktual ({terminName})</span><span className="sm:hidden">Item Aktual</span>
                                    </h3>
                                    <button onClick={handleTambahItem} className="text-[9px] md:text-[10px] font-bold bg-blue-50 text-blue-600 px-3 py-2 md:py-1.5 rounded-lg hover:bg-blue-100 uppercase transition-all">
                                        + Tambah Item
                                    </button>
                                </div>

                                <div className="border border-slate-200 rounded-xl md:rounded-2xl overflow-hidden shadow-sm">

                                    <div className="hidden md:block overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-widest">
                                                <tr>
                                                    <th className="px-4 py-3">Deskripsi Item (Aktual)</th>
                                                    <th className="px-4 py-3 w-32 text-center">Qty</th>
                                                    <th className="px-4 py-3 w-32">Satuan</th>
                                                    <th className="px-4 py-3 w-16 text-center">Aksi</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {items.map((item: any, idx: number) => (
                                                    <tr key={idx} className="hover:bg-slate-50 transition-colors">
                                                        <td className="p-2"><input type="text" value={item.description} onChange={(e) => handleUbahItem(idx, 'description', e.target.value)} className="w-full px-3 py-2 text-black bg-transparent border border-transparent focus:border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all" /></td>
                                                        <td className="p-2"><input type="number" value={item.qty} onChange={(e) => handleUbahItem(idx, 'qty', e.target.value)} className="w-full px-2 py-2 text-black bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg text-sm text-center outline-none transition-all" /></td>
                                                        <td className="p-2"><input type="text" value={item.unit} onChange={(e) => handleUbahItem(idx, 'unit', e.target.value)} className="w-full px-2 py-2 text-black bg-slate-50 border border-slate-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all" /></td>
                                                        <td className="p-2 text-center">
                                                            <button onClick={() => handleHapusItem(idx)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="md:hidden flex flex-col divide-y divide-slate-200 bg-slate-50">
                                        {items.map((item: any, idx: number) => (
                                            <div key={idx} className="p-4 bg-white relative flex flex-col gap-3">
                                                <button onClick={() => handleHapusItem(idx)} className="absolute top-3 right-3 text-red-500 p-2 bg-red-50 rounded-lg">
                                                    <Trash2 size={16} />
                                                </button>
                                                <div className="space-y-1 pr-10">
                                                    <label className="text-[10px] font-bold text-slate-400 uppercase">Deskripsi Item</label>
                                                    <input type="text" value={item.description} onChange={(e) => handleUbahItem(idx, 'description', e.target.value)} className="w-full px-3 py-2 text-black border border-slate-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all" placeholder="Deskripsi..." />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label>
                                                        <input type="number" value={item.qty} onChange={(e) => handleUbahItem(idx, 'qty', e.target.value)} className="w-full px-3 py-2 text-black border border-slate-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all text-center" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[10px] font-bold text-slate-400 uppercase">Satuan</label>
                                                        <input type="text" value={item.unit} onChange={(e) => handleUbahItem(idx, 'unit', e.target.value)} className="w-full px-3 py-2 text-black border border-slate-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Baris Total di bagian paling bawah juga telah dihapus */}
                                </div>
                            </section>

                            <section>
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-[10px] md:text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-1.5 md:gap-2">
                                        <Camera size={16} className="text-blue-600" /> <span className="hidden sm:inline">Dokumentasi Lapangan</span><span className="sm:hidden">Dokumentasi</span>
                                    </h3>
                                    <button onClick={handleTambahFoto} className="text-[9px] md:text-[10px] font-bold bg-amber-50 text-amber-600 px-3 py-2 md:py-1.5 rounded-lg hover:bg-amber-100 uppercase transition-all">
                                        + Tambah Slot
                                    </button>
                                </div>

                                {photos.length === 0 ? (
                                    <div className="text-center p-6 md:p-8 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-xs md:text-sm bg-slate-50/50">
                                        Belum ada foto dokumentasi yang ditambahkan.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        {photos.map((photo, idx) => (
                                            <div key={idx} className="p-3 md:p-4 bg-slate-50 rounded-2xl border border-slate-200 relative group">
                                                <button onClick={() => handleHapusFoto(idx)} className="absolute -top-2 -right-2 md:-top-3 md:-right-3 bg-white text-red-500 p-2 md:p-2.5 rounded-full shadow-md border border-slate-100 hover:bg-red-50 z-10">
                                                    <Trash2 size={16} />
                                                </button>

                                                <div className="mb-3 relative h-40 md:h-48 bg-white border-2 border-dashed border-slate-300 rounded-xl overflow-hidden flex items-center justify-center hover:border-blue-400 transition-colors">
                                                    {photo.preview ? (
                                                        <img src={photo.preview} alt="Preview" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="text-center text-slate-400 pointer-events-none flex flex-col items-center">
                                                            <ImagePlus size={28} className="mb-2 opacity-50 md:w-8 md:h-8" />
                                                            <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest">Pilih Foto</span>
                                                        </div>
                                                    )}
                                                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(idx, e)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                                </div>

                                                <input type="text" placeholder="Deskripsi: (Cth: Proses Coring Lantai)" value={photo.description} onChange={(e) => handleUbahDeskripsiFoto(idx, e.target.value)} className="w-full text-xs text-black md:text-sm px-3 py-2.5 md:py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 transition-colors" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <button onClick={handleSimpan} disabled={isLoading} className="w-full bg-blue-600 text-white font-black py-4 rounded-xl md:rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 md:gap-3 tracking-widest text-[10px] md:text-xs disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.98]">
                                <Save size={18} /> {isLoading ? "MENGUNGGAH DOKUMEN..." : "SIMPAN BERITA ACARA (BAP)"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
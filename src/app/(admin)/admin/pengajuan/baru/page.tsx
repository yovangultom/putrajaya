// src/app/(admin)/admin/pengajuan/baru/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Plus, Trash2, Printer, CheckCircle, ArrowRight, Phone, Building2, MapPin } from "lucide-react";
import { simpanPengajuan } from "./actions";

export default function TambahPengajuanPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newProjectId, setNewProjectId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    clientTitle: "Bapak",
    clientName: "",
    clientCompany: "",
    clientPhone: "",
    projectLocation: "",
  });

  const [items, setItems] = useState([
    { description: "", qty: 1, unit: "titik", price: 0 }
  ]);

  const handleTambahBaris = () => setItems([...items, { description: "", qty: 1, unit: "titik", price: 0 }]);

  const handleHapusBaris = (index: number) => {
    const barisBaru = [...items];
    barisBaru.splice(index, 1);
    setItems(barisBaru);
  };

  const handleUbahItem = (index: number, field: string, value: string | number) => {
    const barisBaru = [...items] as any;
    barisBaru[index][field] = value;
    setItems(barisBaru);
  };

  const totalHarga = items.reduce((total, item) => total + (Number(item.qty) * Number(item.price)), 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payloadData = {
        title: formData.title,
        clientTitle: formData.clientTitle,
        clientName: formData.clientName,
        clientCompany: formData.clientCompany,
        clientPhone: formData.clientPhone,
        projectLocation: formData.projectLocation,
        items: items
      };

      const project = await simpanPengajuan(payloadData);

      if (project?.id) {
        setNewProjectId(project.id);
        setShowSuccessModal(true);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen flex flex-col items-center relative">
      <div className="w-full max-w-7xl mx-auto">
        <Link href="/admin/pengajuan" className="flex items-center gap-2 text-slate-800 hover:text-slate-900 transition-colors mb-6 text-sm font-medium">
          <ArrowLeft size={16} /> <span className="hidden sm:inline">Kembali ke Daftar</span><span className="sm:hidden">Kembali</span>
        </Link>

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden">
          <div className="bg-amber-500 h-2 w-full"></div>
          <form onSubmit={handleSubmit} className="p-5 md:p-10 space-y-6 md:space-y-8">
            <div>
              <h1 className="text-xl md:text-2xl font-black text-black uppercase tracking-tight">Dokumen Penawaran Harga</h1>
              <p className="text-xs md:text-sm text-slate-600">Tahap 1: Inisiasi Proyek & Estimasi Biaya Pekerjaan</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 p-4 md:p-6 bg-slate-50 rounded-2xl border border-slate-100">

              {/* BARIS 1: FULL WIDTH */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Judul Pekerjaan</label>
                <input required type="text" placeholder="Contoh: Pekerjaan Coring Gedung"
                  className="w-full px-4 py-3 text-black bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              </div>

              {/* BARIS 2 KIRI: NAMA KLIEN */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Klien / Penagihan Kepada</label>
                <div className="flex gap-2 w-full">

                  {/* PERUBAHAN 1: Ubah w-28 menjadi w-24 agar tidak terlalu memakan tempat di HP */}
                  <div className="relative w-24 sm:w-32 shrink-0">
                    <select
                      className="w-full px-3 sm:px-4 py-3 text-black bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none appearance-none cursor-pointer font-medium"
                      value={formData.clientTitle}
                      onChange={(e) => setFormData({ ...formData, clientTitle: e.target.value })}
                    >
                      <option value="Bapak">Bapak</option>
                      <option value="Ibu">Ibu</option>

                    </select>
                    <div className="absolute inset-y-0 right-2 sm:right-3 flex items-center pointer-events-none text-slate-400">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>

                  {/* PERUBAHAN 2: Tambahkan 'min-w-0' pada input ini */}
                  <input
                    required
                    type="text"
                    placeholder="Nama Lengkap"
                    className="flex-1 min-w-0 px-4 py-3 text-black bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  />
                </div>
              </div>

              {/* BARIS 2 KANAN: LOKASI PROYEK */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Lokasi Proyek</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <MapPin size={16} />
                  </div>
                  <input required type="text" placeholder="Gedung CIBIS, Jaksel"
                    className="w-full pl-10 pr-4 py-3 text-black bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none transition-all"
                    onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })} />
                </div>
              </div>

              {/* BARIS 3 KIRI: PERUSAHAAN/INSTANSI */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">Perusahaan / Instansi (Opsional)</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Building2 size={16} />
                  </div>
                  <input
                    type="text"
                    placeholder="Nama Perusahaan"
                    className="w-full pl-10 pr-4 py-3 text-black bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    onChange={(e) => setFormData({ ...formData, clientCompany: e.target.value })}
                  />
                </div>
              </div>

              {/* BARIS 3 KANAN: NOMOR TELEPON */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest ml-1">No. Telepon / WA (Opsional)</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone size={16} />
                  </div>
                  <input
                    type="tel"
                    placeholder="0812-XXXX-XXXX"
                    className="w-full pl-10 pr-4 py-3 text-black bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                    onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="text-sm font-black text-slate-900 uppercase tracking-tight">Rincian Item Pekerjaan</label>
                <button type="button" onClick={handleTambahBaris} className="flex items-center gap-1.5 text-[10px] md:text-xs font-bold text-blue-600 bg-blue-50 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors">
                  <Plus size={14} /> TAMBAH BARIS
                </button>
              </div>

              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-900 text-white uppercase text-[10px] tracking-widest">
                      <tr>
                        <th className="px-4 py-3 w-1/2">Deskripsi Item Pekerjaan</th>
                        <th className="px-4 py-3 w-20 text-center">Qty</th>
                        <th className="px-4 py-3 w-24">Satuan</th>
                        <th className="px-4 py-3 text-right">Harga Satuan</th>
                        <th className="px-4 py-3 w-12 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {items.map((item, index) => (
                        <tr key={index} className="bg-white hover:bg-slate-50 transition-colors">
                          <td className="p-2">
                            <input required type="text" value={item.description} placeholder="Coring Lantai 4"
                              className="w-full px-3 py-2 text-black bg-transparent border border-slate-200 rounded-lg text-sm outline-none"
                              onChange={(e) => handleUbahItem(index, 'description', e.target.value)} />
                          </td>
                          <td className="p-2">
                            <input required type="number" step="0.1" value={item.qty}
                              className="w-full px-3 py-2 text-black bg-transparent border border-slate-200 rounded-lg text-sm text-center outline-none"
                              onChange={(e) => handleUbahItem(index, 'qty', e.target.value)} />
                          </td>
                          <td className="p-2">
                            <input required type="text" value={item.unit} placeholder="titik"
                              className="w-full px-3 py-2 text-black bg-transparent border border-slate-200 rounded-lg text-sm outline-none"
                              onChange={(e) => handleUbahItem(index, 'unit', e.target.value)} />
                          </td>
                          <td className="p-2">
                            <input required type="number" value={item.price} placeholder="250000"
                              className="w-full px-3 py-2 text-black bg-transparent border border-slate-200 rounded-lg text-sm text-right outline-none"
                              onChange={(e) => handleUbahItem(index, 'price', e.target.value)} />
                          </td>
                          <td className="p-2 text-center">
                            {items.length > 1 && (
                              <button type="button" onClick={() => handleHapusBaris(index)} className="text-slate-400 hover:text-red-500 transition-colors">
                                <Trash2 size={16} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="md:hidden divide-y divide-slate-200">
                  {items.map((item, index) => (
                    <div key={index} className="p-4 bg-white space-y-3 relative">
                      {items.length > 1 && (
                        <button type="button" onClick={() => handleHapusBaris(index)} className="absolute top-4 right-4 text-red-500 p-2">
                          <Trash2 size={16} />
                        </button>
                      )}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Deskripsi Item</label>
                        <input required type="text" value={item.description} placeholder="Deskripsi..."
                          className="w-full px-3 py-2 text-black border border-slate-200 rounded-lg text-sm outline-none"
                          onChange={(e) => handleUbahItem(index, 'description', e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Qty</label>
                          <input required type="number" step="0.1" value={item.qty}
                            className="w-full px-3 py-2 text-black border border-slate-200 rounded-lg text-sm outline-none"
                            onChange={(e) => handleUbahItem(index, 'qty', e.target.value)} />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-slate-400 uppercase">Satuan</label>
                          <input required type="text" value={item.unit}
                            className="w-full px-3 py-2 text-black border border-slate-200 rounded-lg text-sm outline-none"
                            onChange={(e) => handleUbahItem(index, 'unit', e.target.value)} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase">Harga Satuan (Rp)</label>
                        <input required type="number" value={item.price}
                          className="w-full px-3 py-2 text-black border border-slate-200 rounded-lg text-sm outline-none"
                          onChange={(e) => handleUbahItem(index, 'price', e.target.value)} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-between items-center font-black">
                  <span className="text-[10px] md:text-xs text-slate-800 uppercase tracking-widest">Total</span>
                  <span className="text-lg md:text-xl text-slate-900">Rp {totalHarga.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="w-full bg-slate-950 text-white font-black py-4 rounded-2xl hover:bg-blue-600 transition-all shadow-lg flex items-center justify-center gap-3 tracking-widest text-xs disabled:opacity-70">
              <Save size={18} /> {isLoading ? "MENYIMPAN..." : "SIMPAN PENAWARAN HARGA"}
            </button>
          </form>
        </div>
      </div>

      {/* --- MODAL SUKSES (RESPONSIF & DISEMPURNAKAN) --- */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-sm md:max-w-md shadow-2xl overflow-hidden scale-100 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto relative border border-slate-200">
            <div className="absolute top-0 left-0 right-0 bg-green-500 h-2 w-full"></div>
            <div className="p-6 md:p-8 flex flex-col items-center">
              <div className="bg-green-50 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center mx-auto mb-5 md:mb-6 border border-green-100 mt-2 shrink-0">
                <CheckCircle size={32} className="text-green-600 md:w-10 md:h-10" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-center text-slate-900 mb-2 uppercase tracking-tight">Berhasil Disimpan!</h2>
              {/* 4. MODAL MENGGUNAKAN NAMA PERUSAHAAN JIKA ADA */}
              <p className="text-slate-500 text-center text-[11px] md:text-sm mb-6 md:mb-8 leading-relaxed px-2">
                Penawaran harga untuk <strong className="text-slate-800">{formData.clientName} {formData.clientCompany ? `(${formData.clientCompany})` : ''}</strong> telah siap dicetak dan dikirimkan.
              </p>
              <div className="w-full space-y-2.5 md:space-y-3">
                <Link
                  href={`/admin/pengajuan/${newProjectId}/cetak`}
                  target="_blank"
                  className="w-full bg-blue-600 text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 text-[10px] md:text-xs tracking-widest active:scale-[0.98]"
                >
                  <Printer size={16} className="md:w-4.5 md:h-4.5" /> CETAK PENAWARAN
                </Link>
                <Link
                  href={`/admin/pengajuan/${newProjectId}`}
                  className="w-full bg-slate-50 text-slate-700 font-bold py-3.5 md:py-4 rounded-xl md:rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-100 border border-slate-200 transition-all text-[10px] md:text-xs tracking-widest active:scale-[0.98]"
                >
                  <ArrowRight size={16} className="md:w-4.5 md:h-4.5" /> LIHAT DETAIL PROYEK
                </Link>
                <button
                  onClick={() => window.location.reload()}
                  className="w-full py-3 md:py-4 text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:text-slate-700 transition-all mt-2"
                >
                  + Buat Pengajuan Baru
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
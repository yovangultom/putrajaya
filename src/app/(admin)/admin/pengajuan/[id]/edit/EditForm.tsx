"use client";

import { useState } from "react";
import { PlusCircle, Trash2, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { updatePengajuan } from "./actions";

export default function EditForm({ project }: { project: any }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // State untuk Detail Proyek
    const [formData, setFormData] = useState({
        title: project.title,
        clientName: project.clientName,
        clientCompany: project.clientCompany || "",
        clientPhone: project.clientPhone || "",
        projectLocation: project.projectLocation
    });

    // State untuk Item Pengajuan
    const [items, setItems] = useState(
        project.pengajuanItems.map((item: any) => ({
            id: item.id, // Untuk mapping key (opsional, tidak disimpan ke DB ulang)
            description: item.description,
            qty: item.qty.toString(),
            unit: item.unit,
            price: item.price.toString()
        }))
    );

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleItemChange = (index: number, field: string, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const addItem = () => {
        setItems([...items, { id: Date.now().toString(), description: "", qty: "", unit: "", price: "" }]);
    };

    const removeItem = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        setItems(newItems);
    };

    const totalEstimasi = items.reduce((acc: number, curr: any) => {
        const qty = parseFloat(curr.qty) || 0;
        const price = parseFloat(curr.price) || 0;
        return acc + (qty * price);
    }, 0);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                items: items
            };

            await updatePengajuan(project.id, dataToSubmit);
            router.push(`/admin/pengajuan/${project.id}`);
            router.refresh();
        } catch (error) {
            alert("Terjadi kesalahan saat mengupdate pengajuan.");
            console.error(error);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
            {/* --- SEKSI 1: DETAIL PROYEK --- */}
            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200">
                <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 border-b pb-4">Informasi Utama</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-black">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-black uppercase tracking-widest mb-2">Judul Proyek / Pekerjaan *</label>
                        <input required type="text" name="title" value={formData.title} onChange={handleFormChange} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all " placeholder="Contoh: Pembuatan Kanopi Baja Ringan" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-black uppercase tracking-widest mb-2">Nama Klien / PIC *</label>
                        <input required type="text" name="clientName" value={formData.clientName} onChange={handleFormChange} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-black uppercase tracking-widest mb-2">Perusahaan (Opsional)</label>
                        <input type="text" name="clientCompany" value={formData.clientCompany} onChange={handleFormChange} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-black uppercase tracking-widest mb-2">No. HP / WhatsApp (Opsional)</label>
                        <input type="text" name="clientPhone" value={formData.clientPhone} onChange={handleFormChange} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-bold text-black uppercase tracking-widest mb-2">Lokasi Proyek *</label>
                        <textarea required rows={2} name="projectLocation" value={formData.projectLocation} onChange={handleFormChange} className="w-full p-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"></textarea>
                    </div>
                </div>
            </div>

            {/* --- SEKSI 2: RINCIAN ITEM --- */}
            <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-sm font-black text-black uppercase tracking-widest">Rincian Harga (RAB)</h2>
                    <button type="button" onClick={addItem} className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-100 transition-colors">
                        <PlusCircle size={14} /> Tambah Item
                    </button>
                </div>

                <div className="space-y-4">
                    {items.map((item: any, index: number) => (
                        <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group">
                            <div className="grid grid-cols-12 gap-3 text-black">
                                <div className="col-span-12 lg:col-span-4">
                                    <label className="block text-[10px] font-bold text-black uppercase mb-1">Deskripsi Pekerjaan</label>
                                    <input required type="text" value={item.description} onChange={(e) => handleItemChange(index, "description", e.target.value)} className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white" placeholder="Nama item/pekerjaan" />
                                </div>
                                <div className="col-span-6 lg:col-span-2">
                                    <label className="block text-[10px] font-bold text-black uppercase mb-1">Volume</label>
                                    <input required type="number" step="any" value={item.qty} onChange={(e) => handleItemChange(index, "qty", e.target.value)} className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white" placeholder="0" />
                                </div>
                                <div className="col-span-6 lg:col-span-2">
                                    <label className="block text-[10px] font-bold text-black uppercase mb-1">Satuan</label>
                                    <input required type="text" value={item.unit} onChange={(e) => handleItemChange(index, "unit", e.target.value)} className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white" placeholder="m2, unit, ls" />
                                </div>
                                <div className="col-span-12 lg:col-span-3">
                                    <label className="block text-[10px] font-bold text-black uppercase mb-1">Harga Satuan (Rp)</label>
                                    <input required type="number" value={item.price} onChange={(e) => handleItemChange(index, "price", e.target.value)} onWheel={(e) => (e.target as HTMLElement).blur()} className="w-full p-2.5 text-sm rounded-lg border border-slate-300 bg-white" placeholder="50000" />
                                </div>
                                <div className="col-span-12 lg:col-span-1 flex items-end justify-end">
                                    <button type="button" onClick={() => removeItem(index)} className="w-full lg:w-auto p-2.5 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-500 hover:text-white transition-colors flex justify-center items-center h-[42px]" disabled={items.length === 1}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 bg-slate-900 p-4 rounded-xl flex justify-between items-center text-white shadow-md">
                    <span className="text-xs font-bold uppercase tracking-widest">Total Estimasi Baru</span>
                    <span className="text-xl font-black">
                        {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(totalEstimasi)}
                    </span>
                </div>
            </div>

            {/* --- SEKSI 3: SUBMIT --- */}
            <div className="flex justify-end pt-4 pb-12">
                <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-blue-900/20 hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? (
                        <>Menyimpan...</>
                    ) : (
                        <><Save size={18} /> Simpan Perubahan</>
                    )}
                </button>
            </div>
        </form>
    );
}
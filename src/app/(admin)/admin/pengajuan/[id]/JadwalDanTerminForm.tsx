"use client";

import { useState } from "react";
import { terimaDanJadwalkan } from "./actions"; // Sesuaikan path jika berbeda
import { Calendar, CreditCard, Plus, Trash2 } from "lucide-react";

interface Props {
    projectId: string;
    totalEstimasi: number;
}

export default function JadwalDanTerminForm({ projectId, totalEstimasi }: Props) {
    const [paymentType, setPaymentType] = useState<"SINGLE" | "TERMIN">("SINGLE");
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // State untuk Single Payment
    const [dpAmount, setDpAmount] = useState<string>("");

    // State untuk Termin (Default 2 termin: DP & Pelunasan)
    const [termins, setTermins] = useState([
        { name: "Termin 1 (DP)", percentage: 30 },
        { name: "Termin 2 (Pelunasan)", percentage: 70 },
    ]);

    const formatRupiah = (angka: number) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);

    const totalPercentage = termins.reduce((acc, curr) => acc + (Number(curr.percentage) || 0), 0);

    const addTermin = () => {
        setTermins([...termins, { name: `Termin ${termins.length + 1}`, percentage: 0 }]);
    };

    const removeTermin = (index: number) => {
        setTermins(termins.filter((_, i) => i !== index));
    };

    const handleTerminChange = (index: number, field: "name" | "percentage", value: string | number) => {
        const newTermins = [...termins];
        newTermins[index] = { ...newTermins[index], [field]: value };
        setTermins(newTermins);
    };

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setErrorMsg("");

        const formData = new FormData(e.currentTarget);
        const startDate = formData.get("startDate") as string;
        const endDate = formData.get("endDate") as string;

        if (!startDate || !endDate) {
            setErrorMsg("Tanggal mulai dan selesai wajib diisi!");
            return;
        }

        if (paymentType === "TERMIN" && totalPercentage !== 100) {
            setErrorMsg(`Total persentase termin harus 100%! (Saat ini ${totalPercentage}%)`);
            return;
        }

        setIsLoading(true);

        try {
            // Kita kirim data termin yang sudah dikalkulasi amount-nya
            const calculatedTermins = termins.map(t => ({
                name: t.name,
                percentage: Number(t.percentage),
                amount: (Number(t.percentage) / 100) * totalEstimasi
            }));

            await terimaDanJadwalkan({
                projectId,
                startDate,
                endDate,
                paymentType,
                dpAmount: paymentType === "SINGLE" ? Number(dpAmount) : 0,
                termins: paymentType === "TERMIN" ? calculatedTermins : [],
            });

        } catch (error) {
            setErrorMsg("Terjadi kesalahan saat menyimpan data.");
            setIsLoading(false);
        }
    }

    return (
        <>
            <div className="bg-blue-600 h-2 w-full"></div>
            <form onSubmit={handleSubmit} className="p-5 md:p-8 space-y-4 md:space-y-5">

                <div className="mb-2 md:mb-4">
                    <h2 className="text-base md:text-lg font-black text-slate-900 uppercase">Jadwalkan Proyek</h2>
                    {errorMsg && <p className="text-red-500 text-xs mt-2 font-bold bg-red-50 p-2 rounded">{errorMsg}</p>}
                </div>

                {/* Tanggal */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                    <div>
                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Mulai</label>
                        <input name="startDate" type="date" required className="w-full px-3 py-2 text-black bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Selesai</label>
                        <input name="endDate" type="date" required className="w-full px-3 py-2 text-black bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>
                </div>

                {/* Pemilihan Tipe Pembayaran */}
                <div className="pt-2">
                    <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-2">Tipe Pembayaran</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button type="button" onClick={() => setPaymentType("SINGLE")} className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${paymentType === "SINGLE" ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-slate-200 text-slate-500"}`}>
                            Bayar Sekaligus (1x)
                        </button>
                        <button type="button" onClick={() => setPaymentType("TERMIN")} className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${paymentType === "TERMIN" ? "bg-blue-50 border-blue-500 text-blue-700" : "bg-white border-slate-200 text-slate-500"}`}>
                            Sistem Termin
                        </button>
                    </div>
                </div>

                {/* Form Kondisional */}
                {paymentType === "SINGLE" ? (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Uang Muka (DP) - Opsional</label>
                        <input value={dpAmount} onChange={(e) => setDpAmount(e.target.value)} placeholder="0" type="number" className="w-full px-4 py-2.5 text-black bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                    </div>
                ) : (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-3">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Atur Termin</span>
                            <span className={`text-xs font-black ${totalPercentage === 100 ? "text-green-600" : "text-red-500"}`}>Total: {totalPercentage}%</span>
                        </div>

                        {termins.map((termin, index) => (
                            <div key={index} className="flex gap-2 items-center">
                                <div className="flex-1">
                                    <input type="text" value={termin.name} onChange={(e) => handleTerminChange(index, "name", e.target.value)} className="w-full px-2 py-2 text-black bg-white border border-slate-200 rounded-lg text-xs outline-none" placeholder="Nama Termin" />
                                </div>
                                <div className="w-16 relative">
                                    <input type="number" value={termin.percentage} onChange={(e) => handleTerminChange(index, "percentage", e.target.value)} className="w-full px-2 py-2 text-black bg-white border border-slate-200 rounded-lg text-xs outline-none text-center" />
                                </div>
                                <div className="w-28 text-right text-xs font-bold text-slate-700">
                                    {formatRupiah((Number(termin.percentage) / 100) * totalEstimasi)}
                                </div>
                                {termins.length > 2 && (
                                    <button type="button" onClick={() => removeTermin(index)} className="text-red-400 hover:text-red-600"><Trash2 size={16} /></button>
                                )}
                            </div>
                        ))}

                        <button type="button" onClick={addTermin} className="w-full py-2 border border-dashed border-slate-300 text-slate-500 rounded-lg text-xs font-bold hover:bg-slate-100 flex items-center justify-center gap-1">
                            <Plus size={14} /> Tambah Termin
                        </button>
                    </div>
                )}

                <button
                    disabled={isLoading || (paymentType === "TERMIN" && totalPercentage !== 100)}
                    type="submit"
                    className="w-full text-white font-black py-3.5 md:py-4 rounded-xl md:rounded-2xl transition-all text-[10px] md:text-xs tracking-widest mt-4 md:mt-6 shadow-lg active:scale-[0.98] disabled:active:scale-100 disabled:opacity-80 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none bg-blue-600 hover:bg-blue-700 shadow-blue-600/20"
                >
                    {isLoading
                        ? "MEMPROSES..."
                        : (paymentType === "TERMIN" && totalPercentage !== 100)
                            ? `TOTAL MASIH ${totalPercentage}% (WAJIB 100%)`
                            : "DEAL & JADWALKAN"
                    }
                </button>
            </form>
        </>
    );
}
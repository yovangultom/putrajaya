import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Wallet, TrendingUp, TrendingDown, Landmark, ArrowDownRight, ArrowUpRight, CalendarDays, Search, PieChart, Plus, X, Building2, HandCoins } from "lucide-react";

export default async function KeuanganPage({ searchParams }: { searchParams: Promise<{ start?: string, end?: string, view?: string, modal?: string }> }) {
    const params = await searchParams;
    const view = params.view || 'ringkasan';
    const isRingkasan = view === 'ringkasan';

    // Status Modal
    const showModalPengeluaran = params.modal === 'tambah-pengeluaran';
    const showModalPemasukan = params.modal === 'tambah-pemasukan';

    const today = new Date();
    const formatLocalYYYYMMDD = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const startDateStr = params.start || formatLocalYYYYMMDD(firstDayOfMonth);
    const endDateStr = params.end || formatLocalYYYYMMDD(today);

    const startDate = new Date(startDateStr);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(endDateStr);
    endDate.setHours(23, 59, 59, 999);

    // =========================================================================
    // SERVER ACTION: Fungsi Simpan Pemasukan (Baru) & Pengeluaran
    // =========================================================================
    async function simpanPemasukan(formData: FormData) {
        "use server";
        const date = new Date(formData.get("date") as string);
        const description = formData.get("description") as string;
        const amount = parseFloat(formData.get("amount") as string);
        const start = formData.get("currentStart") as string;
        const end = formData.get("currentEnd") as string;

        if (description && amount) {
            await prisma.companyIncome.create({ data: { date, description, amount } });
        }
        revalidatePath("/admin/keuangan");
        redirect(`/admin/keuangan?view=masuk&start=${start}&end=${end}`);
    }

    async function simpanPengeluaran(formData: FormData) {
        "use server";
        const date = new Date(formData.get("date") as string);
        const description = formData.get("description") as string;
        const amount = parseFloat(formData.get("amount") as string);
        const start = formData.get("currentStart") as string;
        const end = formData.get("currentEnd") as string;

        if (description && amount) {
            await prisma.companyExpense.create({ data: { date, description, amount } });
        }
        revalidatePath("/admin/keuangan");
        redirect(`/admin/keuangan?view=keluar&start=${start}&end=${end}`);
    }

    // =========================================================================
    // 1. DATA KAS MASUK (LABA PROYEK + PEMASUKAN LAINNYA)
    // =========================================================================
    const paidProjects = await prisma.project.findMany({
        where: {
            status: "PAID",
            ...(!isRingkasan ? { updatedAt: { gte: startDate, lte: endDate } } : {})
        },
        include: { pengajuanItems: true, expenses: true }
    });

    // Ambil Data Pemasukan Bebas
    const companyIncomes = await prisma.companyIncome.findMany({
        where: !isRingkasan ? { date: { gte: startDate, lte: endDate } } : {},
    });

    // Gabungkan Keduanya
    const kasMasukData = [
        ...paidProjects.map(proj => {
            const grossTotal = proj.pengajuanItems.reduce((sum, item) => sum + (item.qty * item.price), 0);
            const projectExpenses = proj.expenses.reduce((sum, exp) => sum + exp.amount, 0);
            const netProfit = grossTotal - projectExpenses;
            return {
                id: `proj-${proj.id}`,
                date: proj.updatedAt,
                title: proj.title,
                subtitle: proj.clientName,
                gross: grossTotal,
                expense: projectExpenses,
                amount: netProfit,
                type: 'Laba Proyek',
                badge: 'bg-green-100 text-green-700'
            };
        }),
        ...companyIncomes.map(inc => ({
            id: `inc-${inc.id}`,
            date: inc.date,
            title: inc.description,
            subtitle: 'Pemasukan Lainnya',
            gross: null, // Kosong karena bukan proyek
            expense: null,
            amount: inc.amount,
            type: 'Pemasukan Lain',
            badge: 'bg-emerald-100 text-emerald-800'
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    const totalPemasukan = kasMasukData.reduce((acc, curr) => acc + curr.amount, 0);

    // =========================================================================
    // 2. DATA KAS KELUAR (HANYA OPEX: GAJI & PENGELUARAN PERUSAHAAN)
    // =========================================================================
    const payslips = await prisma.payslip.findMany({
        where: !isRingkasan ? { createdAt: { gte: startDate, lte: endDate } } : {},
        include: { worker: true }
    });
    const totalBebanGaji = payslips.reduce((acc, slip) => acc + slip.netPay, 0);

    const companyExpenses = await prisma.companyExpense.findMany({
        where: !isRingkasan ? { date: { gte: startDate, lte: endDate } } : {},
    });
    const totalBebanPerusahaan = companyExpenses.reduce((acc, exp) => acc + exp.amount, 0);

    const kasKeluarData = [
        ...payslips.map(p => ({
            id: `pay-${p.id}`,
            date: p.createdAt,
            title: `Gaji Karyawan: ${p.worker.name}`,
            subtitle: `Periode: ${p.periodStart.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })} - ${p.periodEnd.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit' })}`,
            amount: p.netPay,
            type: 'OPEX: PAYROLL',
            icon: Wallet,
            color: 'bg-purple-50 text-purple-600',
            badge: 'bg-purple-100 text-purple-700'
        })),
        ...companyExpenses.map(c => ({
            id: `comp-${c.id}`,
            date: c.date,
            title: c.description,
            subtitle: 'Operasional Perusahaan',
            amount: c.amount,
            type: 'OPEX: LAINNYA',
            icon: Building2,
            color: 'bg-blue-50 text-blue-600',
            badge: 'bg-blue-100 text-blue-700'
        }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    const totalPengeluaran = totalBebanGaji + totalBebanPerusahaan;

    // =========================================================================
    // 3. KALKULASI LABA RUGI PERUSAHAAN (Laba Bersih Akhir)
    // =========================================================================
    const labaBersihPerusahaan = totalPemasukan - totalPengeluaran;
    const marginLaba = totalPemasukan > 0 ? ((labaBersihPerusahaan / totalPemasukan) * 100).toFixed(1) : "0.0";
    const formatRp = (angka: number) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(angka);
    const semuaTransaksi = [
        ...kasMasukData.map(t => ({ ...t, isIncome: true, icon: TrendingUp, color: 'bg-green-50 text-green-600' })),
        ...kasKeluarData.map(t => ({ ...t, isIncome: false }))
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen relative">

            {/* HEADER & TAB NAVIGASI */}
            <div className="mb-6 md:mb-8">
                <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-4 md:mb-6 gap-5">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 uppercase">
                            <Landmark className="text-blue-600 w-8 h-8" /> Laporan Keuangan
                        </h1>
                        <p className="text-xs md:text-sm text-slate-500 mt-1 uppercase tracking-widest font-medium">
                            {isRingkasan ? "Ringkasan Laba Bersih Keseluruhan" : "Pemantauan Arus Kas Berdasarkan Tanggal"}
                        </p>
                    </div>

                    {!isRingkasan && (
                        <form className="flex flex-col sm:flex-row w-full xl:w-auto items-start sm:items-center bg-white p-1.5 rounded-2xl md:rounded-full border border-slate-200 shadow-sm gap-2 sm:gap-0">
                            <input type="hidden" name="view" value={view} />
                            <div className="hidden sm:flex items-center px-4 text-blue-600">
                                <CalendarDays size={20} />
                            </div>
                            <div className="flex w-full sm:w-auto items-center border-b sm:border-b-0 sm:border-l border-slate-100 px-2 pb-2 sm:pb-0">
                                <div className="flex flex-col flex-1 px-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Dari Tanggal</span>
                                    <input type="date" name="start" defaultValue={startDateStr} className="bg-transparent px-1 py-1 text-sm font-bold text-slate-800 outline-none cursor-pointer w-full" />
                                </div>
                                <span className="text-slate-300 font-light text-2xl px-2">/</span>
                                <div className="flex flex-col flex-1 px-2">
                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Sampai Tanggal</span>
                                    <input type="date" name="end" defaultValue={endDateStr} className="bg-transparent px-1 py-1 text-sm font-bold text-slate-800 outline-none cursor-pointer w-full" />
                                </div>
                            </div>
                            <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-6 py-3.5 sm:py-3 rounded-xl sm:rounded-full text-[10px] md:text-xs font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all flex items-center justify-center gap-2">
                                <Search size={14} /> Filter
                            </button>
                        </form>
                    )}
                </div>

                <div className="flex w-full gap-1 sm:gap-2 border-b border-slate-200 pb-px">
                    <Link href={`/admin/keuangan?view=ringkasan&start=${startDateStr}&end=${endDateStr}`} className={`flex-1 flex justify-center items-center gap-1 sm:gap-2 px-1 sm:px-5 py-3 rounded-t-xl font-bold text-[9px] sm:text-xs md:text-sm uppercase tracking-tighter sm:tracking-widest transition-all ${view === 'ringkasan' ? 'bg-blue-600 text-white' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-800'}`}>
                        <PieChart className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Ringkasan
                    </Link>
                    <Link href={`/admin/keuangan?view=masuk&start=${startDateStr}&end=${endDateStr}`} className={`flex-1 flex justify-center items-center gap-1 sm:gap-2 px-1 sm:px-5 py-3 rounded-t-xl font-bold text-[9px] sm:text-xs md:text-sm uppercase tracking-tighter sm:tracking-widest transition-all ${view === 'masuk' ? 'bg-green-600 text-white' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-800'}`}>
                        <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Kas Masuk
                    </Link>
                    <Link href={`/admin/keuangan?view=keluar&start=${startDateStr}&end=${endDateStr}`} className={`flex-1 flex justify-center items-center gap-1 sm:gap-2 px-1 sm:px-5 py-3 rounded-t-xl font-bold text-[9px] sm:text-xs md:text-sm uppercase tracking-tighter sm:tracking-widest transition-all ${view === 'keluar' ? 'bg-red-600 text-white' : 'bg-slate-200/50 text-slate-500 hover:bg-slate-200 hover:text-slate-800'}`}>
                        <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Kas Keluar
                    </Link>
                </div>
            </div>

            {/* TAB 1: RINGKASAN */}
            {view === 'ringkasan' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 animate-in fade-in duration-300">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-slate-900 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden text-white">
                            <div className="absolute top-0 right-0 p-6 opacity-10"><TrendingUp size={120} /></div>
                            <p className="text-xs font-black text-blue-400 uppercase tracking-widest mb-2">Laba Bersih Perusahaan (Final)</p>
                            <h2 className={`text-4xl md:text-5xl font-black tracking-tight mb-2 ${labaBersihPerusahaan < 0 ? 'text-red-400' : ''}`}>
                                {formatRp(labaBersihPerusahaan)}
                            </h2>
                            <div className="flex items-center gap-3 mt-4">
                                <span className={`border px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${labaBersihPerusahaan < 0 ? 'bg-red-500/20 text-red-300 border-red-500/30' : 'bg-blue-500/20 text-blue-300 border-blue-500/30'}`}>
                                    {labaBersihPerusahaan < 0 ? <TrendingDown size={14} /> : <TrendingUp size={14} />} Margin: {marginLaba}%
                                </span>
                                <span className="text-[10px] text-slate-400 font-medium">Laba Bersih Keseluruhan</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-green-50 text-green-600 p-3 rounded-2xl"><ArrowUpRight size={24} /></div>
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Kas Masuk</p>
                                    <h3 className="text-2xl font-black text-slate-900">{formatRp(totalPemasukan)}</h3>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-red-50 text-red-600 p-3 rounded-2xl"><ArrowDownRight size={24} /></div>
                                </div>
                                <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1">Total Kas Keluar (OpEx)</p>
                                <h3 className="text-2xl font-black text-red-600">{formatRp(totalPengeluaran)}</h3>

                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs mb-6 flex items-center gap-2">
                                <TrendingDown size={16} className="text-red-500" /> Transaksi Terakhir
                            </h3>
                            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 flex-1" style={{ scrollbarWidth: 'thin' }}>
                                {semuaTransaksi.length === 0 ? (
                                    <p className="text-center text-sm text-black italic py-4">Belum ada transaksi.</p>
                                ) : (
                                    semuaTransaksi.map((tx) => {
                                        const Icon = tx.icon;
                                        return (
                                            <div key={tx.id} className="flex gap-4 items-start p-3 hover:bg-slate-50 rounded-2xl transition-colors">
                                                <div className={`p-2.5 rounded-xl shrink-0 ${tx.color}`}>
                                                    <Icon size={16} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-slate-900 text-xs md:text-sm truncate">{tx.title}</p>
                                                    <p className="text-[9px] text-slate-500 truncate mt-0.5">{tx.subtitle} • {tx.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}</p>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    <p className={`font-black text-xs md:text-sm ${tx.isIncome ? 'text-green-600' : 'text-red-600'}`}>
                                                        {tx.isIncome ? '+' : '-'}{formatRp(tx.amount)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: KAS MASUK (Diperbarui dengan Tombol Tambah Pemasukan) */}
            {view === 'masuk' && (
                <div className="animate-in fade-in duration-300">
                    <div className="bg-green-600 text-white p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl shadow-green-900/20 mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                        <div className="w-full sm:w-auto">
                            <p className="text-green-100 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1">Total Pemasukan Bersih</p>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight">{formatRp(totalPemasukan)}</h2>
                        </div>
                        <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto mt-1 sm:mt-0">
                            <div className="bg-white/20 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl backdrop-blur-sm border border-green-500/30 flex-1 sm:flex-none text-center">
                                <p className="text-[11px] sm:text-sm md:text-base font-bold whitespace-nowrap">{kasMasukData.length} Transaksi</p>
                            </div>
                            <Link
                                href={`/admin/keuangan?view=masuk&start=${startDateStr}&end=${endDateStr}&modal=tambah-pemasukan`}
                                className="bg-slate-900 text-white px-3 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-all flex-1 sm:flex-none whitespace-nowrap"
                            >
                                <Plus size={14} className="sm:w-4 sm:h-4" /> Catat Pemasukan
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:block bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-6 py-5">Tanggal</th>
                                    <th className="px-6 py-5">Kategori</th>
                                    <th className="px-6 py-5">Deskripsi / Proyek</th>
                                    <th className="px-6 py-5">Nilai & Beban Proyek</th>
                                    <th className="px-6 py-5 text-right border-l border-slate-200 text-green-700">Pemasukan Bersih</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {kasMasukData.length === 0 ? <tr><td colSpan={5} className="text-center py-8 text-slate-500">Tidak ada pemasukan di periode ini.</td></tr> : kasMasukData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-black">{item.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${item.badge}`}>{item.type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-black">{item.title}</p>
                                            <p className="text-[10px] text-black">{item.subtitle}</p>
                                        </td>
                                        <td className="px-6 py-4 font-semibold text-black">
                                            {item.gross !== null ? (
                                                <div className="flex flex-col text-[10px] gap-0.5">
                                                    <span>Kotor: {formatRp(item.gross)}</span>
                                                    <span className="text-red-500">Beban: -{formatRp(item.expense!)}</span>
                                                </div>
                                            ) : (
                                                <span className="text-slate-400 italic text-xs">-</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right border-l border-slate-100 font-black text-green-800 text-base">+{formatRp(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="md:hidden flex flex-col gap-4">
                        {kasMasukData.length === 0 ? <div className="bg-white p-6 rounded-2xl text-center text-sm text-slate-500 border">Tidak ada pemasukan di periode ini.</div> : kasMasukData.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                <div className="flex justify-between items-start mb-3 border-b border-slate-100 pb-3">
                                    <div className="flex-1 pr-2">
                                        <p className="font-bold text-slate-900 text-sm leading-tight">{item.title}</p>
                                        <p className="text-[10px] text-black mt-1">{item.subtitle} • {item.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                                        <span className={`inline-block mt-2 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${item.badge}`}>{item.type}</span>
                                    </div>
                                </div>
                                {item.gross !== null && (
                                    <>
                                        <div className="flex justify-between items-center text-[10px] mb-1">
                                            <span className="text-black">Nilai Kotor:</span><span className="font-bold text-black">{formatRp(item.gross)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] mb-2 border-b border-slate-50 pb-2">
                                            <span className="text-red-600">Beban Proyek:</span><span className="font-bold text-red-500">-{formatRp(item.expense!)}</span>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-between items-center pt-1">
                                    <span className="text-[10px] font-black text-green-700 uppercase">Total Masuk</span>
                                    <span className="font-black text-green-600 text-base">+{formatRp(item.amount)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* TAB 3: KAS KELUAR (Hanya OpEx) */}
            {view === 'keluar' && (
                <div className="animate-in fade-in duration-300">
                    <div className="bg-red-600 text-white p-5 sm:p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl shadow-red-900/20 mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                        <div className="w-full sm:w-auto">
                            <p className="text-red-100 text-[10px] md:text-xs font-black uppercase tracking-widest mb-1">Total Pengeluaran Perusahaan (OpEx)</p>
                            <h2 className="text-3xl md:text-5xl font-black tracking-tight">{formatRp(totalPengeluaran)}</h2>
                        </div>
                        <div className="flex flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto mt-1 sm:mt-0">
                            <div className="bg-white/20 px-3 py-2.5 sm:px-4 sm:py-2.5 rounded-xl backdrop-blur-sm border border-red-500/30 flex-1 sm:flex-none text-center">
                                <p className="text-[11px] sm:text-sm md:text-base font-bold whitespace-nowrap">{kasKeluarData.length} Transaksi</p>
                            </div>
                            <Link
                                href={`/admin/keuangan?view=keluar&start=${startDateStr}&end=${endDateStr}&modal=tambah-pengeluaran`}
                                className="bg-slate-900 text-white px-3 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-slate-800 shadow-lg flex items-center justify-center gap-1.5 sm:gap-2 transition-all flex-1 sm:flex-none whitespace-nowrap"
                            >
                                <Plus size={14} className="sm:w-4 sm:h-4" /> Catat Pengeluaran
                            </Link>
                        </div>
                    </div>

                    <div className="hidden md:block bg-white rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-widest">
                                <tr>
                                    <th className="px-6 py-5">Tanggal</th>
                                    <th className="px-6 py-5">Kategori</th>
                                    <th className="px-6 py-5">Keterangan</th>
                                    <th className="px-6 py-5 text-right border-l border-slate-200">Nominal Keluar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {kasKeluarData.length === 0 ? <tr><td colSpan={4} className="text-center py-8 text-slate-500">Tidak ada pengeluaran di periode ini.</td></tr> : kasKeluarData.map((item) => (
                                    <tr key={item.id} className="hover:bg-slate-50">
                                        <td className="px-6 py-4 font-medium text-black">{item.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${item.badge}`}>{item.type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-slate-900">{item.title}</p>
                                            <p className="text-[10px] text-black mt-0.5">{item.subtitle}</p>
                                        </td>
                                        <td className="px-6 py-4 text-right border-l border-slate-100 font-black text-red-600 text-base">-{formatRp(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="md:hidden flex flex-col gap-4">
                        {kasKeluarData.length === 0 ? <div className="bg-white p-6 rounded-2xl text-center text-sm text-slate-500 border">Tidak ada pengeluaran di periode ini.</div> : kasKeluarData.map((item) => {
                            const Icon = item.icon;
                            return (
                                <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                                    <div className="flex gap-3 items-start mb-3 border-b border-slate-100 pb-3">
                                        <div className={`p-2.5 rounded-xl shrink-0 ${item.color}`}><Icon size={18} /></div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <p className="font-bold text-black text-sm leading-tight truncate">{item.title}</p>
                                            <p className="text-[10px] text-black mt-0.5 truncate">{item.subtitle}</p>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-black uppercase">{item.date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        <span className="font-black text-red-600 text-base">-{formatRp(item.amount)}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* MODAL 1: POP-UP TAMBAH PENGELUARAN */}
            {showModalPengeluaran && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
                        <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs md:text-sm flex items-center gap-2">
                                <Building2 size={16} className="text-red-500" /> Catat OpEx Perusahaan
                            </h3>
                            <Link href={`/admin/keuangan?view=keluar&start=${startDateStr}&end=${endDateStr}`} className="text-slate-400 hover:text-red-500 transition-colors bg-white p-1 rounded-full border border-slate-200">
                                <X size={18} />
                            </Link>
                        </div>
                        <form action={simpanPengeluaran} className="p-5 md:p-6 flex flex-col gap-4">
                            <input type="hidden" name="currentStart" value={startDateStr} />
                            <input type="hidden" name="currentEnd" value={endDateStr} />
                            <div>
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Tanggal</label>
                                <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Keterangan / Tujuan</label>
                                <input type="text" name="description" required placeholder="Cth: Iklan Google Ads, Biaya Server, Sewa..." className="w-full px-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Nominal Keluar (Rp)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                                    <input type="number" name="amount" required min="1" placeholder="500000" className="w-full pl-10 pr-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-red-600 outline-none transition-all font-bold" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-red-600 text-white font-black py-3.5 rounded-xl hover:bg-red-700 transition-all text-xs tracking-widest mt-2 shadow-lg shadow-red-600/20">
                                SIMPAN OPEX
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL 2: POP-UP TAMBAH PEMASUKAN */}
            {showModalPemasukan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
                        <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="font-black text-slate-900 uppercase tracking-widest text-xs md:text-sm flex items-center gap-2">
                                <HandCoins size={16} className="text-green-500" /> Catat Pemasukan Bebas
                            </h3>
                            <Link href={`/admin/keuangan?view=masuk&start=${startDateStr}&end=${endDateStr}`} className="text-slate-400 hover:text-red-500 transition-colors bg-white p-1 rounded-full border border-slate-200">
                                <X size={18} />
                            </Link>
                        </div>
                        <form action={simpanPemasukan} className="p-5 md:p-6 flex flex-col gap-4">
                            <input type="hidden" name="currentStart" value={startDateStr} />
                            <input type="hidden" name="currentEnd" value={endDateStr} />
                            <div>
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Tanggal</label>
                                <input type="date" name="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-600 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Sumber Pemasukan / Keterangan</label>
                                <input type="text" name="description" required placeholder="Cth: Pencairan Investasi, Penjualan Scrap Besi..." className="w-full px-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-600 outline-none transition-all" />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-slate-800 uppercase tracking-widest block mb-1">Nominal Masuk (Rp)</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">Rp</span>
                                    <input type="number" name="amount" required min="1" placeholder="1500000" className="w-full pl-10 pr-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-green-600 outline-none transition-all font-bold" />
                                </div>
                            </div>
                            <button type="submit" className="w-full bg-green-600 text-white font-black py-3.5 rounded-xl hover:bg-green-700 transition-all text-xs tracking-widest mt-2 shadow-lg shadow-green-600/20">
                                SIMPAN PEMASUKAN
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
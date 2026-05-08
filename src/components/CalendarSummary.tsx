// src/components/CalendarSummary.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function CalendarSummary({ projects }: { projects: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthName = currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

    const getProjectsForDate = (day: number) => {
        // Buat tanggal kalender dan set waktunya tepat ke 00:00:00
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 0, 0, 0, 0).getTime();

        return projects.filter(p => {
            if (!p.startDate || !p.endDate) return false;

            // Ambil tanggal proyek dan reset waktunya ke 00:00:00 agar perbandingannya setara
            const start = new Date(p.startDate).setHours(0, 0, 0, 0);
            const end = new Date(p.endDate).setHours(0, 0, 0, 0);

            return checkDate >= start && checkDate <= end;
        });
    };

    return (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-black uppercase text-sm tracking-widest text-slate-900">Jadwal Proyek</h3>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronLeft size={18} /></button>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ChevronRight size={18} /></button>
                </div>
            </div>

            <div className="text-center font-bold text-blue-600 mb-4 uppercase text-xs tracking-tighter">{monthName}</div>

            {/* Nama Hari */}
            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(d => (
                    <div key={d} className="text-[10px] font-black text-slate-400 uppercase text-center">{d}</div>
                ))}
            </div>

            {/* Grid Tanggal */}
            <div className="grid grid-cols-7 gap-1">
                {/* Kosongkan awal bulan */}
                {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={i} />)}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    const activeProjects = getProjectsForDate(day);
                    const hasProject = activeProjects.length > 0;

                    // PERUBAHAN DI SINI: Cek semua status proyek di hari tersebut secara independen
                    const hasInProgress = activeProjects.some(p => p.status === "IN_PROGRESS");
                    const hasScheduled = activeProjects.some(p => p.status !== "IN_PROGRESS"); // Tangkap status DEAL_SCHEDULED / dll

                    return (
                        <div key={day} className="relative group flex flex-col items-center py-2 hover:bg-slate-50 rounded-lg transition-colors cursor-default">
                            <span className={`text-xs font-bold ${hasProject ? 'text-slate-900' : 'text-slate-400'}`}>
                                {day}
                            </span>

                            {hasProject && (
                                <>
                                    {/* Wadah titik-titik dibuat flex agar berjejer ke samping */}
                                    <div className="flex gap-1 mt-1 h-1.5 items-center justify-center">
                                        {/* Jika ada proyek terjadwal, tampilkan titik biru */}
                                        {hasScheduled && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-sm shadow-blue-900/40"></div>
                                        )}
                                        {/* Jika ada proyek berjalan, tampilkan titik oranye */}
                                        {hasInProgress && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-900/40"></div>
                                        )}
                                    </div>

                                    {/* Tooltip saat di-hover (Hanya muncul di Desktop) */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-[60] w-48 -ml-20">
                                        <div className="bg-slate-900 text-white text-[10px] p-2.5 rounded-xl shadow-xl border border-slate-700 space-y-1.5">
                                            {activeProjects.map((ap, idx) => (
                                                <div key={idx} className="border-b border-slate-700 last:border-0 pb-1.5 last:pb-0 flex items-start gap-1.5">
                                                    <div className={`mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full ${ap.status === "IN_PROGRESS" ? "bg-amber-500" : "bg-blue-600"}`}></div>
                                                    <span className="font-bold uppercase tracking-tighter leading-tight">
                                                        {ap.title}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Legend / Keterangan Warna */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex gap-4 justify-center">
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Terjadwal</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Berjalan</span>
                </div>
            </div>
        </div>
    );
}
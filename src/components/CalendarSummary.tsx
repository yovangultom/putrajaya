// src/components/CalendarSummary.tsx
"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function CalendarSummary({ projects }: { projects: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthName = currentDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

    // Fungsi cek apakah ada proyek di tanggal tertentu
    const getProjectsForDate = (day: number) => {
        const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return projects.filter(p => {
            const start = new Date(p.startDate);
            const end = new Date(p.endDate);
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

                    // Warna berdasarkan status proyek pertama yang ditemukan
                    const statusColor = activeProjects[0]?.status === "IN_PROGRESS" ? "bg-amber-500" : "bg-blue-600";

                    return (
                        <div key={day} className="relative group flex flex-col items-center py-2">
                            <span className={`text-xs font-bold ${hasProject ? 'text-slate-900' : 'text-slate-400'}`}>
                                {day}
                            </span>

                            {hasProject && (
                                <>
                                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${statusColor} shadow-sm shadow-blue-900/40`}></div>

                                    {/* Tooltip saat di-hover (Hanya muncul di Desktop) */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block z-50 w-40">
                                        <div className="bg-slate-900 text-white text-[9px] p-2 rounded-xl shadow-xl border border-slate-700">
                                            {activeProjects.map((ap, idx) => (
                                                <div key={idx} className="border-b border-slate-700 last:border-0 py-1 font-black uppercase tracking-tighter">
                                                    🏗️ {ap.title}
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
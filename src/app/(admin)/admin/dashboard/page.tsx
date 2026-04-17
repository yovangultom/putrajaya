// src/app/(admin)/admin/dashboard/page.tsx
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import CalendarSummary from "@/components/CalendarSummary";

export default async function DashboardPage() {
  const session = await auth();

  // 1. Ambil Data Statistik Operasional (Fokus pada progres & jadwal)
  const [
    totalPengajuan,
    dealProjects,
    inProgressProjects,
    completedProjects,
    calendarProjects
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "DEAL_SCHEDULED" } }),
    prisma.project.count({ where: { status: "IN_PROGRESS" } }),
    prisma.project.count({
      where: { status: { in: ["COMPLETED_INVOICED", "PAID"] } }
    }),
    prisma.project.findMany({
      where: {
        startDate: { not: null },
        status: { in: ["DEAL_SCHEDULED", "IN_PROGRESS", "COMPLETED_INVOICED"] }
      },
      select: {
        title: true,
        startDate: true,
        endDate: true,
        status: true
      }
    })
  ]);

  return (
    <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Dashboard Admin</h1>
        <p className="text-slate-500 mt-1 text-sm italic">Ringkasan operasional CV Putra Jaya.</p>
      </div>

      {/* PERUBAHAN DI SINI: flex-col-reverse diubah menjadi flex-col */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 md:gap-8">

        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          {/* Kartu Sambutan */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
            <h2 className="text-xl md:text-2xl font-black text-slate-900 uppercase leading-tight">
              Halo, {session?.user?.name?.split(' ')[0] || 'Admin'}! 👋
            </h2>
            <p className="text-slate-600 mt-2 text-sm">
              Anda masuk sebagai <span className="font-bold text-blue-600 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 uppercase text-[10px] tracking-widest">{session?.user?.role || 'ADMIN'}</span>.
              Pantau seluruh progres pekerjaan dan jadwal tim di lapangan hari ini.
            </p>
          </div>

          {/* Grid Statistik Operasional */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 group hover:border-slate-400 transition-colors">
              <h3 className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Total Pengajuan</h3>
              <p className="text-2xl md:text-3xl font-black text-slate-900 mt-2">{totalPengajuan}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 group hover:border-purple-400 transition-colors">
              <h3 className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-tight">Proyek Terjadwal</h3>
              <p className="text-2xl md:text-3xl font-black text-purple-600 mt-2">{dealProjects}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 group hover:border-blue-400 transition-colors">
              <h3 className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest leading-tight">Sedang Dikerjakan</h3>
              <p className="text-2xl md:text-3xl font-black text-blue-600 mt-2">{inProgressProjects}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl md:rounded-3xl shadow-sm border border-slate-200 group hover:border-green-400 transition-colors">
              <h3 className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest">Selesai / Lunas</h3>
              <p className="text-2xl md:text-3xl font-black text-green-600 mt-2">{completedProjects}</p>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (Akan berada di Bawah pada layar HP) */}
        <div className="lg:col-span-1">
          <CalendarSummary projects={calendarProjects} />
        </div>

      </div>
    </div>
  );
}
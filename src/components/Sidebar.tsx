"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, LayoutDashboard, FileText, Receipt, Briefcase, LogOut, CalendarRange, WalletMinimal } from "lucide-react";

export default function Sidebar({ session, signOutAction }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const menuItems = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Pengajuan", href: "/admin/pengajuan", icon: FileText },
        { name: "Jadwal", href: "/admin/jadwal", icon: CalendarRange },
        { name: "Invoice", href: "/admin/invoices", icon: Receipt },
        { name: "Keuangan", href: "/admin/keuangan", icon: WalletMinimal },
        { name: "Absensi", href: "/admin/absensi", icon: WalletMinimal },
        { name: "Pekerja", href: "/admin/pekerja", icon: WalletMinimal },
        { name: "Gaji", href: "/admin/penggajian", icon: WalletMinimal },
        { name: "Portofolio", href: "/admin/projects", icon: Briefcase },

    ];

    return (
        <>
            {/* Tombol Hamburger untuk Mobile (Ditambahkan print:hidden agar tidak muncul di PDF) */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-4 z-50 print:hidden">
                <div className="flex items-center gap-2">
                    <Image src="/PutraJaya_Logo.png" alt="Logo" width={32} height={32} className="object-contain" />
                    <h1 className="text-white font-bold tracking-normal text-sm">CV PUTRA JAYA</h1>
                </div>
                <button onClick={() => setIsOpen(true)} className="text-white p-2">
                    <Menu size={24} />
                </button>
            </div>

            {/* Overlay Gelap */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-60 lg:hidden print:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Kontainer Sidebar (Ditambahkan print:hidden) */}
            <aside className={`
                    fixed inset-y-0 left-0 z-70 w-64 bg-slate-900 text-white flex flex-col transition-transform duration-300 transform print:hidden
                    ${isOpen ? "translate-x-0" : "-translate-x-full"}
                    lg:translate-x-0 lg:sticky lg:inset-y-0 lg:min-h-screen  lg:top-0
                `}>
                {/* Header Sidebar */}
                <div className="p-8 border-b border-slate-900 flex flex-col items-center">
                    <div className="relative w-20 h-20 mb-3">
                        <Image
                            src="/PutraJaya_Logo.png"
                            alt="Logo Putrajaya"
                            fill
                            sizes="80px"
                            className="object-contain"
                            priority
                        />
                    </div>
                    <div className="text-center">
                        <h1 className="text-xl font-black tracking-normal text-white">CV PUTRA JAYA</h1>
                        <p className="text-[12px] text-amber-500 font-bold uppercase tracking-normal mt-1">Konstruksi Umum</p>
                    </div>
                    <button onClick={() => setIsOpen(false)} className="lg:hidden absolute top-4 right-4 text-slate-500">
                        <X size={20} />
                    </button>
                </div>

                {/* Menu Navigasi */}
                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        // Logika isActive agar lebih akurat jika ada sub-path
                        const isActive = pathname.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-all ${isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <item.icon size={18} className={isActive ? "text-amber-400" : ""} />
                                <span className="text-sm font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Profil & Logout */}
                <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                    <div className="mb-4 px-2">
                        <p className="text-sm font-bold text-white truncate">{session.user?.name}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 bg-amber-500/10 text-amber-500 text-[10px] font-bold rounded border border-amber-500/20 uppercase">
                            {session.user?.role}
                        </span>
                    </div>

                    <form action={signOutAction}>
                        <button className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium border border-slate-700 text-slate-400 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all">
                            <LogOut size={16} />
                            Logout
                        </button>
                    </form>
                </div>
            </aside>
        </>
    );
}
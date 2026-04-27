import type { Metadata } from "next"; // 1. Tambahkan import Metadata
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// 2. Tambahkan pengaturan judul dan deskripsi untuk halaman Admin
export const metadata: Metadata = {
    title: "Admin Dashboard | CV Putra Jaya",
    description: "Sistem manajemen konten dan portofolio CV Putra Jaya",
};

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // Cek apakah sesi kosong ATAU ada error UserDeleted dari auth.ts
    if (!session || session.user?.id === "DELETED_USER") {
        redirect("/login?error=account_deleted");
    }

    const signOutAction = async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden print:block print:h-auto print:overflow-visible print:bg-white">

            {/* Bungkus Sidebar dengan print:hidden agar logo ganda hilang sempurna */}
            <div className="print:hidden">
                <Sidebar session={session} signOutAction={signOutAction} />
            </div>

            {/* Bebaskan main dari ikatan scroll dan flex saat dicetak */}
            <main className="flex-1 overflow-y-auto flex flex-col print:block print:overflow-visible print:h-auto">

                {/* Spacer untuk Mobile (Sembunyikan juga saat print) */}
                <div className="h-16 lg:hidden shrink-0 print:hidden" />

                <div className="flex-1 print:block">
                    {children}
                </div>
            </main>
        </div>
    );
}
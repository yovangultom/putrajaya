import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    // PERBAIKAN DI SINI: Cek apakah sesi kosong ATAU ada error UserDeleted dari auth.ts
    if (!session || session.user?.id === "DELETED_USER") {
        redirect("/login?error=account_deleted");
    }

    const signOutAction = async () => {
        "use server";
        await signOut({ redirectTo: "/login" });
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden print:block print:h-auto print:overflow-visible print:bg-white">

            {/* 2. UBAH DI SINI: Bungkus Sidebar dengan print:hidden agar logo ganda hilang sempurna */}
            <div className="print:hidden">
                <Sidebar session={session} signOutAction={signOutAction} />
            </div>

            {/* 3. UBAH DI SINI: Bebaskan main dari ikatan scroll dan flex saat dicetak */}
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
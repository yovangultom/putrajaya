import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import EditForm from "./EditForm";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditPengajuanPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            pengajuanItems: true
        }
    });

    if (!project) notFound();

    // Proteksi keamanan: Tendang user jika status bukan PENGAJUAN
    if (project.status !== "PENGAJUAN") {
        redirect(`/admin/pengajuan/${id}`);
    }

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            <div className="mb-6">
                <Link href={`/admin/pengajuan/${id}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 text-sm font-bold transition-colors w-fit mb-4">
                    <ArrowLeft size={16} /> Batal Edit
                </Link>
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Edit Pengajuan</h1>
                <p className="text-slate-500 text-sm mt-1">Ubah detail proyek atau rincian harga pengajuan.</p>
            </div>

            {/* Render Client Component Form */}
            <EditForm project={project} />
        </div>
    );
}
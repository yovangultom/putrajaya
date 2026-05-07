import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import SPKForm from "./SPKForm";

export default async function EditSPKPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Ambil data Contract beserta Project dan Termins
    const contract = await prisma.contract.findUnique({
        where: { id: id },
        include: {
            project: {
                include: {
                    termins: { orderBy: { id: 'asc' } }
                }
            }
        }
    });

    if (!contract || !contract.project) notFound();

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-3xl mx-auto">

                <div className="mb-6">
                    <Link href={`/admin/pengajuan/${contract.projectId}`} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 font-bold text-sm mb-4 w-fit">
                        <ArrowLeft size={16} /> Kembali ke Detail Proyek
                    </Link>
                    <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Lengkapi Data SPK</h1>
                    <p className="text-sm text-slate-500 mt-1">Isi rincian pekerjaan dan identitas klien sebelum Surat Perjanjian Kerja dicetak.</p>
                </div>

                {/* Panggil Client Component Form */}
                <SPKForm
                    contract={contract}
                    project={contract.project}
                    termins={contract.project.termins}
                />

            </div>
        </div>
    );
}
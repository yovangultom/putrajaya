// src/app/(admin)/admin/pengajuan/[id]/bap/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BapClientForm from "./BapClientForm";

export default async function BapPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // 1. Ambil data proyek dan rincian pengajuan awal
    const project = await prisma.project.findUnique({
        where: { id: id },
        include: {
            pengajuanItems: true,
            bap: { include: { items: true, attachments: true } }
        }
    });

    if (!project) notFound();

    // 2. Siapkan data awal untuk form (Pre-fill dari Pengajuan)
    // Jika BAP belum pernah dibuat, ambil dari pengajuanItems. 
    // Jika sudah ada, ambil dari data BAP yang tersimpan.
    const initialItems = project.bap
        ? project.bap.items
        : project.pengajuanItems.map(item => ({
            description: item.description,
            qty: item.qty,
            unit: item.unit,
            price: item.price
        }));

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <BapClientForm
                projectId={id}
                initialItems={initialItems}
                projectTitle={project.title}
            />
        </div>
    );
}
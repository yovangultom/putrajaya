import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BapClientForm from "./BapClientForm";

export default async function BapPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id: id },
        include: {
            pengajuanItems: true,
            // 1. UBAH 'bap' menjadi 'baps'
            baps: {
                include: { items: true, attachments: true }
            }
        }
    });

    if (!project) notFound();

    // 2. Karena baps sekarang adalah array, kita ambil index ke-0 (BAP pertama) jika ada
    const existingBap = project.baps && project.baps.length > 0 ? project.baps[0] : null;

    // 3. Gunakan existingBap untuk pengecekan
    const initialItems = existingBap
        ? existingBap.items
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
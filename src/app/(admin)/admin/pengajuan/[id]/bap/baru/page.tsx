// src/app/(admin)/admin/pengajuan/[id]/bap/baru/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BapClientForm from "./BapClientForm";

export default async function BapPage({ params, searchParams }: { params: Promise<{ id: string }>, searchParams: Promise<{ terminId?: string }> }) {
    const { id } = await params;
    const sp = await searchParams;
    const terminId = sp.terminId;

    if (!terminId) notFound(); // Tolak jika tidak ada ID termin yang disertakan

    const project = await prisma.project.findUnique({
        where: { id: id },
        include: {
            pengajuanItems: true,
        }
    });

    const termin = await prisma.termin.findUnique({
        where: { id: terminId }
    });

    if (!project || !termin) notFound();

    // PARSING OTOMATIS: 
    // Jika Termin punya deskripsi (dari SPK), kita pecah per baris untuk dimasukkan ke tabel BAP.
    // Jika kosong, kita berikan satu baris kosong sebagai pancingan.
    let initialItems = [];
    if (termin.description) {
        const lines = termin.description.split('\n').filter(line => line.trim() !== '');
        initialItems = lines.map(line => ({
            description: line.trim().replace(/^\d+\)\s*/, ''), // Hapus angka "1) " di depan jika ada
            qty: 1,
            unit: "ls", // lumpsum default
            price: 0
        }));
    } else {
        initialItems = [{
            description: `Penyelesaian pekerjaan untuk ${termin.name}`,
            qty: 1,
            unit: "ls",
            price: termin.amount
        }];
    }

    return (
        <div className="p-0 bg-slate-50 min-h-screen">
            <BapClientForm
                projectId={id}
                terminId={terminId}
                initialItems={initialItems}
                projectTitle={project.title}
                terminName={termin.name}
            />
        </div>
    );
}
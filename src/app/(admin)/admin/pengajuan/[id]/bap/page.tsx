import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BapClientForm from "./BapClientForm";

export default async function BapPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const project = await prisma.project.findUnique({
        where: { id: id },
        include: {
            pengajuanItems: true,
            bap: { include: { items: true, attachments: true } }
        }
    });

    if (!project) notFound();


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
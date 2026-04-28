import { PrismaClient } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { updatePortfolio } from "@/actions/portfolioActions";

export const revalidate = 0;

const prisma = new PrismaClient();

export default async function EditPortofolioPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;

    const project = await prisma.portfolio.findUnique({
        where: { id: resolvedParams.id },
        include: { gallery: true }
    });

    if (!project) notFound();

    const handleUpdate = async (formData: FormData) => {
        "use server";
        await updatePortfolio(project.id, project.image, formData);
        redirect("/admin/portofolio");
    };

    return (
        <div className="p-4 md:p-10 max-w-4xl mx-auto">
            <Link href="/admin/portofolio" className="text-[#F49414] font-bold mb-6 inline-block hover:underline">
                &larr; Batal & Kembali
            </Link>

            <div className="bg-white p-8 rounded-xl shadow-md border border-slate-100">
                <h2 className="text-2xl font-black text-[#0B0C35] mb-6">Edit Portofolio</h2>

                <form action={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Judul Proyek</label>
                            <input type="text" name="title" defaultValue={project.title} required className="text-black w-full border border-slate-300 p-3 rounded-lg outline-none focus:border-[#F49414]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Klien</label>
                            <input type="text" name="client" defaultValue={project.client} required className="text-black w-full border border-slate-300 p-3 rounded-lg outline-none focus:border-[#F49414]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Lokasi Pengerjaan</label>
                            <input type="text" name="location" defaultValue={project.location} required className="text-black w-full border border-slate-300 p-3 rounded-lg outline-none focus:border-[#F49414]" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Kategori Layanan</label>
                            <select name="category" defaultValue={project.category} required className="text-black w-full border border-slate-300 p-3 rounded-lg outline-none focus:border-[#F49414]">
                                <option value="Konstruksi Umum">Konstruksi Umum</option>
                                <option value="Jasa Coring">Jasa Coring</option>
                                <option value="Jual Beli dan Sewa Genset">Jual Beli dan Sewa Genset</option>
                                <option value="Service Genset">Service Genset</option>
                                <option value="Perencanaan Konstruksi">Perencanaan Konstruksi</option>
                                <option value="Chemical Anchor">Chemical Anchor</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Tanggal Selesai</label>
                            <input type="date" name="completionDate" defaultValue={project.completionDate.toISOString().split('T')[0]} required className="text-black w-full border border-slate-300 p-3 rounded-lg outline-none focus:border-[#F49414]" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Deskripsi Detail Proyek</label>
                        <textarea name="description" defaultValue={project.description} required rows={5} className="text-black w-full border border-slate-300 p-3 rounded-lg outline-none focus:border-[#F49414]"></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5 bg-slate-50 border border-slate-200 rounded-xl mt-8">

                        <div>
                            <label className="block text-sm font-black text-[#0B0C35] mb-2">1. Ganti Gambar Utama</label>
                            <p className="text-xs text-slate-500 mb-4">Kosongkan jika tidak ingin mengganti gambar saat ini.</p>

                            <div className="mb-4">
                                <p className="text-xs font-bold text-slate-400 mb-1">Gambar Utama Saat Ini:</p>
                                <div className="relative w-32 h-20 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                    <Image src={project.image} alt="Current Main" fill className="object-cover" sizes="128px" unoptimized />
                                </div>
                            </div>
                            <input type="file" name="mainImage" accept="image/*" className="text-black w-full border border-slate-300 p-2 rounded-lg bg-white cursor-pointer" />
                        </div>
                        <div>
                            <label className="block text-sm font-black text-[#0B0C35] mb-2">2. Ganti Galeri Foto</label>
                            <p className="text-xs text-slate-500 mb-4">Upload baru akan <span className="text-red-500 font-bold">menghapus</span> galeri lama. Maks. 4 foto.</p>

                            <div className="mb-4">
                                <p className="text-xs font-bold text-slate-400 mb-1">Galeri Saat Ini ({project.gallery?.length || 0} Foto):</p>
                                <div className="flex gap-2">
                                    {project.gallery && project.gallery.length > 0 ? (
                                        project.gallery.map((g: any) => (
                                            <div key={g.id} className="relative w-12 h-12 rounded-md overflow-hidden border border-slate-200 shadow-sm">
                                                <Image src={g.imageUrl} alt="Gallery item" fill className="object-cover" sizes="48px" unoptimized />
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">Tidak ada galeri.</span>
                                    )}
                                </div>
                            </div>
                            <input type="file" name="galleryImages" accept="image/*" multiple className="text-black w-full border border-slate-300 p-2 rounded-lg bg-white cursor-pointer" />
                        </div>

                    </div>

                    <button type="submit" className="w-full bg-[#0B0C35] text-white font-bold py-4 rounded-lg hover:bg-[#F49414] transition-colors">
                        Simpan Perubahan
                    </button>
                </form>
            </div>
        </div>
    );
}
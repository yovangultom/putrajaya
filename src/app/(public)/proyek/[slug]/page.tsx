import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Calendar, Building, Tag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import ImageGallery from "@/components/public/ImageGallery";

export const revalidate = 0;
export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const project = await prisma.portfolio.findUnique({ where: { slug: resolvedParams.slug } });
    if (!project) return { title: "Proyek Tidak Ditemukan" };
    return {
        title: `${project.title} | Portofolio CV Putra Jaya`,
        description: project.description.substring(0, 160),
    };
}

export default async function DetailProyekPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;

    const project = await prisma.portfolio.findUnique({
        where: { slug: resolvedParams.slug },
        include: { gallery: true }
    });

    if (!project) notFound();

    return (
        <main className="min-h-screen bg-slate-50">
            <section className="bg-[#0B0C35] text-white pt-30 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-[#F49414] rounded-full blur-[120px] opacity-10 -mr-20 -mt-20 pointer-events-none"></div>
                <div className="container mx-auto px-6 max-w-6xl relative z-10">
                    <Link href="/proyek" className="inline-flex items-center gap-2 text-white/70 hover:text-white mb-10 transition-colors font-bold text-sm uppercase tracking-wider">
                        <ArrowLeft size={18} /> Kembali ke Galeri
                    </Link>
                    <h1 className="text-3xl md:text-5xl lg:text-5xl font-black text-white leading-tight max-w-4xl">
                        {project.title}
                    </h1>
                </div>
            </section>

            <section className="py-16 relative z-20">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">

                        {/* SISI KIRI: GAMBAR & DESKRIPSI */}
                        <div className="lg:col-span-2 space-y-8">

                            {/* PENGGANTI GAMBAR UTAMA & GALERI MANUAL */}
                            <ImageGallery
                                mainImage={project.image}
                                gallery={project.gallery}
                                title={project.title}
                            />

                            <div className="prose prose-lg prose-slate max-w-none text-slate-600 leading-relaxed text-justify bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100">
                                {project.description.split('\n').map((para: string, i: number) => (
                                    <p key={i} className="mb-4 last:mb-0">{para}</p>
                                ))}
                            </div>
                        </div>

                        {/* SISI KANAN: SIDEBAR INFO (TETAP SAMA) */}
                        <div className="lg:col-span-1">
                            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50">
                                <h3 className="text-xl font-black text-[#0B0C35] mb-6 border-b border-slate-100 pb-4">Info Pengerjaan</h3>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                                            <Building className="text-[#F49414]" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Klien</p>
                                            <p className="text-slate-800 font-bold leading-tight">{project.client}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                                            <MapPin className="text-[#F49414]" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Lokasi</p>
                                            <p className="text-slate-800 font-bold leading-tight">{project.location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                                            <Tag className="text-[#F49414]" size={22} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Kategori Layanan</p>
                                            <p className="text-slate-800 font-bold leading-tight">{project.category}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                                            <Calendar className="text-[#F49414]" size={24} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Selesai Pada</p>
                                            <p className="text-slate-800 font-bold leading-tight">
                                                {new Date(project.completionDate).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/kontak" className="flex items-center justify-center gap-2 w-full bg-[#0B0C35] text-white text-center py-4 rounded-xl font-black mt-10 hover:bg-[#F49414] transition-all shadow-lg shadow-[#0B0C35]/20 hover:-translate-y-1">
                                    Konsultasi Sekarang
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </main>
    );
}
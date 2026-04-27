"use client";

import Image from "next/image";
import Link from "next/link";
import { Building2, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function RecentProjectsClient({ projects }: { projects: any[] }) {
    return (
        <section className="py-24 bg-slate-50 border-t border-slate-200">
            <div className="container mx-auto px-6 max-w-6xl">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <h2 className="text-[#F49414] font-bold tracking-widest uppercase text-sm mb-2">Portofolio</h2>
                        <h3 className="text-3xl md:text-4xl font-black text-[#0B0C35]">Proyek Terbaru Kami</h3>
                    </div>
                    <Link href="/proyek" className="inline-flex items-center gap-2 font-bold text-[#0B0C35] hover:text-[#F49414] transition-colors group">
                        Lihat Semua Proyek
                        <span className="bg-slate-200 group-hover:bg-[#F49414]/20 p-2 rounded-full transition-colors">
                            <ArrowRight size={16} />
                        </span>
                    </Link>
                </div>

                {projects.length === 0 ? (
                    <div className="text-center p-10 bg-white rounded-3xl border border-slate-200">
                        <p className="text-slate-500">Belum ada portofolio yang ditambahkan.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project, index) => (
                            <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.6, delay: index * 0.15 }} // Efek muncul bergantian
                            >
                                <Link href={`/proyek/${project.slug}`} className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/40 border border-slate-100 group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full">
                                    <div className="relative w-full aspect-video md:aspect-[4/3] bg-slate-200 overflow-hidden shrink-0">
                                        <Image
                                            src={project.image}
                                            alt={project.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out"
                                            priority={false}
                                        />
                                        <div className="absolute top-4 left-4 bg-[#F49414] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md z-10">
                                            {project.category}
                                        </div>
                                    </div>
                                    <div className="p-8 flex flex-col flex-1">
                                        <h4 className="text-xl font-black text-[#0B0C35] mb-4 leading-tight group-hover:text-[#F49414] transition-colors line-clamp-2 min-h-[3.5rem]">
                                            {project.title}
                                        </h4>
                                        <div className="space-y-2 mt-auto">
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <Building2 size={16} className="text-slate-400 shrink-0" />
                                                <span className="line-clamp-1">{project.client}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <MapPin size={16} className="text-slate-400 shrink-0" />
                                                <span className="line-clamp-1">{project.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
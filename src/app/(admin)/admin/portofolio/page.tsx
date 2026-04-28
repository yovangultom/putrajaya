import FormInput from "./FormInput";
import DeleteButton from "./DeleteButton";
import { PrismaClient } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

const prisma = new PrismaClient();

export default async function AdminPortofolioPage() {
    const portfolios = await prisma.portfolio.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-8 md:space-y-10 p-4">
            <FormInput />
            <div className="bg-white rounded-xl shadow-md p-4 md:p-8 border border-slate-100 max-w-5xl mx-auto">
                <h2 className="text-xl md:text-2xl font-black text-[#0B0C35] mb-6">Daftar Portofolio Saat Ini</h2>

                {portfolios.length === 0 ? (
                    <div className="text-center py-10 text-slate-500 border border-dashed rounded-xl">Belum ada portofolio.</div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-4 md:hidden">
                            {portfolios.map((item) => (
                                <div key={item.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col gap-4 shadow-sm">
                                    <div className="flex gap-4 items-start">
                                        <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-slate-200 border border-slate-200">
                                            <Image src={item.image} alt={item.title} fill className="object-cover" sizes="80px" unoptimized />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#0B0C35] text-sm line-clamp-2 leading-snug mb-2">{item.title}</h3>
                                            <span className="text-[10px] font-bold text-white bg-[#F49414] px-2.5 py-1 rounded-full inline-block">
                                                {item.category}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="bg-white p-3 rounded-lg border border-slate-100 text-xs text-slate-600 space-y-2">
                                        <div className="flex justify-between border-b border-slate-50 pb-1">
                                            <span className="font-bold text-slate-400 uppercase">Klien</span>
                                            <span className="font-medium text-right line-clamp-1 w-2/3">{item.client}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-slate-50 pb-1">
                                            <span className="font-bold text-slate-400 uppercase">Lokasi</span>
                                            <span className="font-medium text-right line-clamp-1 w-2/3">{item.location}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-bold text-slate-400 uppercase">Selesai</span>
                                            <span className="font-medium">{new Date(item.completionDate).toLocaleDateString('id-ID')}</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-1">
                                        <Link href={`/admin/portofolio/${item.id}/edit`} className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-blue-100 transition-colors">
                                            Edit
                                        </Link>
                                        <DeleteButton id={item.id} imagePath={item.image} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-187">
                                <thead>
                                    <tr className="border-b-2 border-slate-100 text-slate-600 text-sm whitespace-nowrap">
                                        <th className="pb-3 pl-2 w-20">Gambar</th>
                                        <th className="pb-3 w-72">Judul Proyek</th>
                                        <th className="pb-3 w-56">Klien & Lokasi</th>
                                        <th className="pb-3 w-36">Tanggal Selesai</th>
                                        <th className="pb-3 w-24">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {portfolios.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                            <td className="py-4 pl-2">
                                                <div className="relative w-16 h-16 rounded-md overflow-hidden bg-slate-200 shadow-sm border border-slate-100">
                                                    <Image src={item.image} alt={item.title} fill className="object-cover" sizes="64px" unoptimized />
                                                </div>
                                            </td>
                                            <td className="py-4 pr-4">
                                                <div className="font-bold text-[#0B0C35] line-clamp-2 leading-snug mb-2">
                                                    {item.title}
                                                </div>
                                                <span className="text-xs font-bold text-white bg-[#F49414] px-2.5 py-1 rounded-full whitespace-nowrap shadow-sm">
                                                    {item.category}
                                                </span>
                                            </td>
                                            <td className="py-4 text-sm text-slate-600 pr-4">
                                                <span className="block mb-1 line-clamp-1" title={item.client}>🏢 <span className="font-medium">{item.client}</span></span>
                                                <span className="block line-clamp-1" title={item.location}>📍 <span className="font-medium">{item.location}</span></span>
                                            </td>
                                            <td className="py-4 text-sm text-slate-600 whitespace-nowrap font-medium">
                                                {new Date(item.completionDate).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="py-4">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/admin/portofolio/${item.id}/edit`} className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-lg font-bold text-xs hover:bg-blue-100 transition-colors">
                                                        Edit
                                                    </Link>
                                                    <DeleteButton id={item.id} imagePath={item.image} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
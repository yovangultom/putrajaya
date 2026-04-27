import { prisma } from "@/lib/prisma";
import { addUser, deleteUser } from "@/actions/userActions";
import { Users, Trash2, ShieldCheck, UserPlus } from "lucide-react";

export default async function ManagementUserPage() {
    const users = await prisma.user.findMany({
        orderBy: { role: 'asc' }
    });

    // Action untuk menghapus (inline)
    const handleDelete = async (formData: FormData) => {
        "use server";
        const id = formData.get("id") as string;
        await deleteUser(id);
    };

    return (
        <div className="p-4 md:p-8 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                    <ShieldCheck className="text-blue-600" size={32} /> MANAJEMEN AKUN KARYAWAN
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* FORM TAMBAH USER */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                            <h3 className="font-bold text-[#0B0C35] mb-6 flex items-center gap-2">
                                <UserPlus size={18} /> Tambah Akun Baru
                            </h3>
                            <form
                                action={async (formData: FormData) => {
                                    "use server";
                                    await addUser(formData);
                                }}
                                className="space-y-4"
                            >
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Nama Lengkap</label>
                                    <input type="text" name="name" required className="w-full px-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Email Login</label>
                                    <input type="email" name="email" required className="w-full px-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Password</label>
                                    <input type="password" name="password" required className="w-full px-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Role / Hak Akses</label>
                                    <select name="role" required className="w-full px-4 py-2.5 text-black bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-600">
                                        <option value="ADMIN">ADMIN (Web Portofolio)</option>
                                        <option value="FINANCE">FINANCE (Keuangan & Operasional)</option>
                                        <option value="SUPER_ADMIN">SUPER ADMIN (Semua Akses)</option>
                                    </select>
                                </div>
                                <button type="submit" className="w-full bg-blue-600 text-white font-black py-3 rounded-xl hover:bg-blue-700 transition-all text-xs tracking-widest shadow-lg shadow-blue-600/20">
                                    DAFTARKAN AKUN
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* DAFTAR USER */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <th className="px-6 py-4">Nama & Email</th>
                                        <th className="px-6 py-4 text-center">Role</th>
                                        <th className="px-6 py-4 text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {users.map((u) => (
                                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-slate-900 text-sm">{u.name}</p>
                                                <p className="text-xs text-slate-500">{u.email}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${u.role === 'SUPER_ADMIN' ? 'bg-red-100 text-red-600' :
                                                    u.role === 'FINANCE' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                                    }`}>
                                                    {u.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <form action={handleDelete}>
                                                    <input type="hidden" name="id" value={u.id} />
                                                    <button className="p-2 text-slate-300 hover:text-red-600 transition-colors">
                                                        <Trash2 size={18} />
                                                    </button>
                                                </form>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
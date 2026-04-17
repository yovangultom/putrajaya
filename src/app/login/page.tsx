// src/app/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // Proses login menggunakan Auth.js
        const res = await signIn("credentials", {
            email,
            password,
            redirect: false, // Kita tangani redirect secara manual agar transisinya mulus
        });

        if (res?.error) {
            setError("Email atau password yang Anda masukkan salah.");
            setIsLoading(false);
        } else {
            // Jika sukses, arahkan ke dashboard admin
            router.push("/admin/dashboard");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-amber-500">
                <div className="p-8">

                    <div className="flex flex-col items-center mb-8">
                        <div className="relative w-24 h-24 mb-4">
                            <Image
                                src="/PutraJaya_Logo.png" // Mengambil file dari folder public
                                alt="Logo Putrajaya"
                                fill
                                sizes="96px"
                                className="object-contain"
                                priority
                            />
                        </div>
                        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Putrajaya Admin
                        </h2>
                        <p className="text-sm text-slate-500">Manajemen Konstruksi & Coring</p>
                    </div>

                    {error && (
                        <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-black">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                                    placeholder="admin@admin.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black">
                                Password
                            </label>
                            <div className="mt-1">
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                            >
                                Masuk ke Sistem
                            </button>
                        </div>
                    </form>
                </div>

                {/* Dekorasi Footer Card */}
                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} CV Putra Jaya. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
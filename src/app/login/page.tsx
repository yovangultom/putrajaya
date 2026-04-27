"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { loginAction } from "@/actions/authActions";

export default function LoginPage() {
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await loginAction(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-amber-500">
                <div className="p-8">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative w-24 h-24 mb-4">
                            <Image
                                src="/PutraJaya_Logo.png"
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
                            <label className="block text-sm font-medium text-black">Email</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                                placeholder="admin@admin.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-black"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isPending}
                            className={`w-full flex justify-center py-3 px-4 rounded-lg text-sm font-semibold text-white transition-all shadow-md ${isPending ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {isPending ? "Memproses..." : "Masuk ke Sistem"}
                        </button>
                    </form>
                </div>

                <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-500">
                        &copy; {new Date().getFullYear()} CV Putra Jaya. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}
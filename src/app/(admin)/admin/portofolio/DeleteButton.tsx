"use client";

import { deletePortfolio } from "@/actions/portfolioActions";
import { useState } from "react";

export default function DeleteButton({ id, imagePath }: { id: string, imagePath: string }) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!confirm("Yakin ingin menghapus proyek ini? Gambar juga akan terhapus permanen dari server.")) return;

        setLoading(true);
        const res = await deletePortfolio(id, imagePath);
        if (res.success) {
            alert(res.message);
        } else {
            alert(res.message);
        }
        setLoading(false);
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-50 text-red-600 px-3 py-2 rounded-md text-sm font-bold hover:bg-red-100 disabled:opacity-50 transition-colors"
        >
            {loading ? "Menghapus..." : "Hapus"}
        </button>
    );
}
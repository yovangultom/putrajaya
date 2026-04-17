// src/app/(admin)/admin/invoices/[id]/PrintButton.tsx
"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
    return (
        <button
            onClick={() => window.print()}
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 flex items-center gap-2 shadow-lg"
        >
            <Printer size={18} /> CETAK PDF / PRINT
        </button>
    );
}
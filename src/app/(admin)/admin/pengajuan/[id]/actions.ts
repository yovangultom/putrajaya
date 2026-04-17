// src/app/(admin)/admin/pengajuan/[id]/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function rescheduleProyek(projectId: string, formData: FormData) {
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  await prisma.project.update({
    where: { id: projectId },
    data: {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      // Opsional: Kamu bisa ubah status kembali ke DEAL_SCHEDULED
      // jika sebelumnya sudah IN_PROGRESS tapi batal jalan.
      status: "DEAL_SCHEDULED",
    },
  });

  revalidatePath(`/admin/pengajuan/${projectId}`);
  revalidatePath(`/admin/jadwal`); // Agar halaman jadwal juga terupdate
}
export async function tambahPengeluaran(
  projectId: string,
  expenses: { description: string; amount: number }[],
) {
  "use server";

  // Filter data yang kosong
  const validExpenses = expenses.filter(
    (e) => e.description.trim() !== "" && e.amount > 0,
  );

  if (validExpenses.length === 0) {
    throw new Error("Tidak ada data pengeluaran yang valid");
  }

  // Siapkan data untuk di-insert sekaligus (Bulk Insert)
  const dataToInsert = validExpenses.map((item) => ({
    projectId: projectId,
    description: item.description,
    amount: Number(item.amount),
  }));

  await prisma.projectExpense.createMany({
    data: dataToInsert,
  });

  revalidatePath(`/admin/pengajuan/${projectId}`);
}

// src/app/(admin)/admin/pekerja/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function tambahPekerja(formData: FormData) {
  const name = formData.get("name") as string;
  const role = formData.get("role") as string;
  const dailyWage = parseFloat(formData.get("dailyWage") as string);

  // PERUBAHAN: Hitung lembur otomatis, tidak perlu ambil dari form lagi
  const overtimeRatePerHour = dailyWage / 8;

  if (!name || !role || isNaN(dailyWage)) {
    throw new Error("Data tidak lengkap");
  }

  await prisma.worker.create({
    data: {
      name,
      role,
      dailyWage,
      overtimeRatePerHour,
    },
  });

  revalidatePath("/admin/pekerja");
}

export async function hapusPekerja(id: string) {
  await prisma.worker.delete({
    where: { id },
  });
  revalidatePath("/admin/pekerja");
}

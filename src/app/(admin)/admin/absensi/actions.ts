// src/app/(admin)/admin/absensi/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function simpanAbsensi(dateStr: string, attendances: any[]) {
  // Pastikan jam di-set ke 00:00:00 agar rapi di database
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(targetDate);
  nextDay.setDate(nextDay.getDate() + 1);

  // Gunakan Transaction agar aman (Hapus data hari itu, lalu masukkan yang baru)
  await prisma.$transaction(async (tx) => {
    // 1. Bersihkan absensi di tanggal tersebut (jika ada) untuk di-update
    await tx.attendance.deleteMany({
      where: {
        date: {
          gte: targetDate,
          lt: nextDay,
        },
      },
    });

    // 2. Masukkan data absensi yang baru
    if (attendances.length > 0) {
      await tx.attendance.createMany({
        data: attendances.map((a: any) => ({
          workerId: a.workerId,
          date: targetDate,
          status: Number(a.status),
          overtimeHours: Number(a.overtimeHours),
          notes: a.notes || null,
        })),
      });
    }
  });

  revalidatePath("/admin/absensi");
  revalidatePath("/admin/keuangan"); // Refresh keuangan juga nantinya
}

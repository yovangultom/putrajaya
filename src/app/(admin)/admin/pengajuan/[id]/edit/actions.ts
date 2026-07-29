"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updatePengajuan(projectId: string, data: any) {
  // 1. Pastikan proyek ada dan statusnya PENGAJUAN
  const project = await prisma.project.findUnique({
    where: { id: projectId },
  });

  if (!project) throw new Error("Proyek tidak ditemukan.");
  if (project.status !== "PENGAJUAN")
    throw new Error("Hanya pengajuan baru yang dapat diedit.");

  // 2. Lakukan Update Data (Gunakan Transaksi Bawaan Prisma)
  // Kita hapus semua pengajuanItems lama (deleteMany), lalu buat ulang (create)
  // Ini cara paling aman dan bersih dibanding melakukan perbandingan ID item satu per satu.
  await prisma.project.update({
    where: { id: projectId },
    data: {
      title: data.title,
      clientName: data.clientName,
      clientCompany: data.clientCompany,
      clientPhone: data.clientPhone,
      projectLocation: data.projectLocation,
      pengajuanItems: {
        deleteMany: {},
        create: data.items.map((item: any) => ({
          description: item.description,
          qty: parseFloat(item.qty),
          unit: item.unit,
          price: parseFloat(item.price),
        })),
      },
    },
  });

  // 3. Revalidate dan kembali ke halaman detail
  revalidatePath(`/admin/pengajuan/${projectId}`);
  revalidatePath(`/admin/pengajuan`);

  return { success: true };
}

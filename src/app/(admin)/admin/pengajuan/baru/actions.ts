// src/app/(admin)/admin/pengajuan/baru/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function simpanPengajuan(payload: any) {
  const session = await auth();
  const user = await prisma.user.findUnique({
    where: { email: session?.user?.email as string },
  });

  if (!user) throw new Error("Akses ditolak.");

  // Mengembalikan hasil create agar kita bisa ambil ID-nya
  const project = await prisma.project.create({
    data: {
      title: payload.title,
      clientName: `${payload.clientTitle} ${payload.clientName}`,
      clientCompany: payload.clientCompany || null,
      clientPhone: payload.clientPhone || null,
      projectLocation: payload.projectLocation,
      status: "PENGAJUAN",
      userId: user.id,
      pengajuanItems: {
        create: payload.items.map((item: any) => ({
          description: item.description,
          qty: parseFloat(item.qty),
          unit: item.unit,
          price: parseFloat(item.price),
        })),
      },
    },
  });

  return project; // Return project object ke client
}

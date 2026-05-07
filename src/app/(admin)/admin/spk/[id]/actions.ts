"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// Hapus import { redirect } dari sini

export async function updateSPK(
  contractId: string,
  projectId: string,
  formData: FormData,
  termins: { id: string; description: string }[],
) {
  const clientName = formData.get("clientName") as string;
  const clientAddress = formData.get("clientAddress") as string;
  const clientKtp = formData.get("clientKtp") as string;
  const projectLocation = formData.get("projectLocation") as string;

  const pihakKeduaNama = formData.get("pihakKeduaNama") as string;
  const pihakKeduaKtp = formData.get("pihakKeduaKtp") as string;
  const pihakKeduaAlamat = formData.get("pihakKeduaAlamat") as string;

  const scopeOfWork = formData.get("scopeOfWork") as string;

  await prisma.project.update({
    where: { id: projectId },
    data: { clientName, clientAddress, clientKtp, projectLocation },
  });

  await prisma.contract.update({
    where: { id: contractId },
    data: { scopeOfWork, pihakKeduaNama, pihakKeduaKtp, pihakKeduaAlamat },
  });

  for (const termin of termins) {
    await prisma.termin.update({
      where: { id: termin.id },
      data: { description: termin.description },
    });
  }

  revalidatePath(`/admin/spk/${contractId}`);

  // KEMBALIKAN STATUS SUKSES, BUKAN REDIRECT
  return { success: true };
}

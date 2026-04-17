// src/app/(admin)/admin/penggajian/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function simpanSlipGaji(data: {
  workerId: string;
  periodStart: string;
  periodEnd: string;
  totalDays: number;
  totalOvertime: number;
  bonus: number;
  kasbonDeduction: number;
  netPay: number;
}) {
  const newPayslip = await prisma.payslip.create({
    data: {
      workerId: data.workerId,
      periodStart: new Date(data.periodStart),
      periodEnd: new Date(data.periodEnd),
      totalDays: data.totalDays,
      totalOvertime: data.totalOvertime,
      bonus: data.bonus,
      kasbonDeduction: data.kasbonDeduction,
      netPay: data.netPay,
    },
  });

  revalidatePath("/admin/penggajian");
  revalidatePath("/admin/keuangan");

  // Kembalikan ID untuk link cetak
  return newPayslip.id;
}

// src/app/(admin)/admin/pengajuan/[id]/actions.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ==========================================
// 1. FUNGSI BARU: TERIMA & JADWALKAN PROYEK
// ==========================================
interface JadwalPayload {
  projectId: string;
  startDate: string;
  endDate: string;
  paymentType: "SINGLE" | "TERMIN";
  dpAmount: number;
  termins: { name: string; percentage: number; amount: number }[];
}

export async function terimaDanJadwalkan(payload: JadwalPayload) {
  const { projectId, startDate, endDate, paymentType, dpAmount, termins } =
    payload;

  // Update status dan data dasar Project
  await prisma.project.update({
    where: { id: projectId },
    data: {
      status: "DEAL_SCHEDULED",
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      paymentType: paymentType,
      dpAmount: paymentType === "SINGLE" ? dpAmount : 0,
    },
  });

  // Jika sistem TERMIN, buat data di tabel Termin dan Draft Contract
  if (paymentType === "TERMIN" && termins.length > 0) {
    // Buat data Termin ke database
    const terminData = termins.map((t) => ({
      projectId: projectId,
      name: t.name,
      percentage: t.percentage,
      amount: t.amount,
      status: "PENDING",
    }));

    await prisma.termin.createMany({
      data: terminData,
    });

    // Generate Nomor Kontrak otomatis (format: SPK/Tahun/001)
    const year = new Date().getFullYear();
    const contractCount = await prisma.contract.count();
    const contractNumber = `SPK/${year}/${(contractCount + 1).toString().padStart(3, "0")}`;

    // Buat Draft Kontrak (SPK) otomatis
    await prisma.contract.create({
      data: {
        projectId: projectId,
        contractNumber: contractNumber,
        paymentTerms: `Pembayaran dilakukan bertahap sesuai termin yang disepakati (${termins.length} tahap).`,
      },
    });
  }

  revalidatePath(`/admin/pengajuan/${projectId}`);
  revalidatePath(`/admin/jadwal`);
}

// ==========================================
// 2. FUNGSI: RESCHEDULE JADWAL (Sudah ada)
// ==========================================
export async function rescheduleProyek(projectId: string, formData: FormData) {
  const startDate = formData.get("startDate") as string;
  const endDate = formData.get("endDate") as string;

  await prisma.project.update({
    where: { id: projectId },
    data: {
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      status: "DEAL_SCHEDULED",
    },
  });

  revalidatePath(`/admin/pengajuan/${projectId}`);
  revalidatePath(`/admin/jadwal`);
}

// ==========================================
// 3. FUNGSI: TAMBAH PENGELUARAN (Sudah ada)
// ==========================================
export async function tambahPengeluaran(
  projectId: string,
  expenses: { description: string; amount: number }[],
) {
  const validExpenses = expenses.filter(
    (e) => e.description.trim() !== "" && e.amount > 0,
  );

  if (validExpenses.length === 0) {
    throw new Error("Tidak ada data pengeluaran yang valid");
  }

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
// ==========================================
// 4. FUNGSI: TERBITKAN INVOICE TERMIN
// ==========================================
export async function terbitkanInvoiceTermin(
  projectId: string,
  terminId: string,
  amount: number,
) {
  // Fungsi terbilang untuk database
  const terbilang = (angkaUtama: number): string => {
    // TAMBAHKAN BARIS INI: Pastikan angka selalu bilangan bulat pembulatan ke bawah/atas
    const angka = Math.floor(Math.abs(angkaUtama));

    const huruf = [
      "",
      "Satu",
      "Dua",
      "Tiga",
      "Empat",
      "Lima",
      "Enam",
      "Tujuh",
      "Delapan",
      "Sembilan",
      "Sepuluh",
      "Sebelas",
    ];
    let hasil = "";
    if (angka < 12) hasil = huruf[angka];
    else if (angka < 20) hasil = terbilang(angka - 10) + " Belas";
    else if (angka < 100)
      hasil =
        terbilang(Math.floor(angka / 10)) + " Puluh " + terbilang(angka % 10);
    else if (angka < 200) hasil = "Seratus " + terbilang(angka - 100);
    else if (angka < 1000)
      hasil =
        terbilang(Math.floor(angka / 100)) + " Ratus " + terbilang(angka % 100);
    else if (angka < 2000) hasil = "Seribu " + terbilang(angka - 1000);
    else if (angka < 1000000)
      hasil =
        terbilang(Math.floor(angka / 1000)) +
        " Ribu " +
        terbilang(angka % 1000);
    else if (angka < 1000000000)
      hasil =
        terbilang(Math.floor(angka / 1000000)) +
        " Juta " +
        terbilang(angka % 1000000);
    return hasil.trim();
  };
  // Generate Nomor Invoice Otomatis
  const year = new Date().getFullYear();
  const invoiceCount = await prisma.invoice.count();
  const invoiceNumber = `INV/${year}/${(invoiceCount + 1).toString().padStart(3, "0")}`;

  // Buat Data Invoice
  await prisma.invoice.create({
    data: {
      invoiceNumber: invoiceNumber,
      amount: amount,
      terbilang: terbilang(amount) + " Rupiah",
      status: "UNPAID",
      projectId: projectId,
      terminId: terminId,
    },
  });

  // Update Status Termin menjadi INVOICED
  await prisma.termin.update({
    where: { id: terminId },
    data: { status: "INVOICED" },
  });

  revalidatePath(`/admin/pengajuan/${projectId}`);
}

// ==========================================
// 5. FUNGSI: TANDAI INVOICE LUNAS & CATAT KAS MASUK
// ==========================================
export async function tandaiInvoiceLunas(
  projectId: string,
  terminId: string,
  invoiceId: string,
) {
  // 1. Ambil data Invoice dan Proyek
  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: { termin: true, project: true },
  });

  if (!invoice) throw new Error("Invoice tidak ditemukan");

  // 2. Update status Invoice dan Termin menjadi Lunas
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status: "PAID" },
  });

  await prisma.termin.update({
    where: { id: terminId },
    data: { status: "PAID" },
  });

  // 3. --- CATAT KE KAS MASUK (COMPANY INCOME) ---
  // Menggabungkan nama termin dan nama klien agar deskripsinya informatif

  // 4. CEK OTOMATIS: Apakah semua termin di proyek ini sudah lunas?
  const semuaTermin = await prisma.termin.findMany({
    where: { projectId: projectId },
  });

  const semuaLunas =
    semuaTermin.length > 0 && semuaTermin.every((t) => t.status === "PAID");

  if (semuaLunas) {
    // Jika ya, ubah status Proyek Induknya menjadi PAID
    await prisma.project.update({
      where: { id: projectId },
      data: { status: "PAID", actualEndDate: new Date() },
    });
  }

  // 5. Refresh Halaman
  revalidatePath(`/admin/pengajuan/${projectId}`);
  revalidatePath(`/admin/invoices`);
  revalidatePath(`/admin/keuangan`);
}

// ==========================================
// 6. FUNGSI BARU: HAPUS PENGAJUAN (CASCADING)
// ==========================================
export async function hapusPengajuan(projectId: string) {
  try {
    // Karena di schema.prisma sudah menggunakan onDelete: Cascade,
    // menghapus Project otomatis menghapus seluruh data anaknya
    await prisma.project.delete({
      where: { id: projectId },
    });

    // Refresh halaman utama pengajuan
    revalidatePath("/admin/pengajuan");

    return { success: true };
  } catch (error) {
    console.error("Gagal menghapus pengajuan:", error);
    return { success: false, error: "Gagal menghapus data dari database." };
  }
}

"use server";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { revalidatePath } from "next/cache";
import { join } from "path";

async function generateDocumentNumber(type: "BAP" | "INVOICE") {
  const date = new Date();
  const year = date.getFullYear();
  const romanMonths = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "VI",
    "VII",
    "VIII",
    "IX",
    "X",
    "XI",
    "XII",
  ];
  const romanMonth = romanMonths[date.getMonth()];

  let counter = await prisma.documentCounter.findFirst({
    where: { year, type },
  });
  if (!counter) {
    counter = await prisma.documentCounter.create({
      data: { year, type, lastNumber: 0 },
    });
  }

  const nextNumber = counter.lastNumber + 1;
  await prisma.documentCounter.update({
    where: { id: counter.id },
    data: { lastNumber: nextNumber },
  });

  const formattedNumber = String(nextNumber).padStart(3, "0");
  return `${formattedNumber}/${type === "BAP" ? "BAP" : "INV"}/PJ/${romanMonth}/${year}`;
}

export async function simpanBapDanInvoice(formData: FormData) {
  try {
    const projectId = formData.get("projectId") as string;

    const cekProyek = await prisma.project.findUnique({
      where: { id: projectId },
      include: { bap: true },
    });

    if (!cekProyek) {
      return { success: false, error: "Proyek tidak ditemukan." };
    }

    if (cekProyek.bap) {
      return {
        success: false,
        error: "BAP untuk proyek ini sudah pernah diterbitkan.",
      };
    }

    const items = JSON.parse(formData.get("items") as string);
    const attachments = [];
    const uploadDir = join(process.cwd(), "public/uploads");

    await mkdir(uploadDir, { recursive: true });

    for (const [key, value] of formData.entries()) {
      if (key.startsWith("photo_") && value instanceof File && value.size > 0) {
        const index = key.split("_")[1];
        const description = formData.get(`desc_${index}`) as string;
        const buffer = Buffer.from(await value.arrayBuffer());
        const fileName = `${Date.now()}-slot${index}-${value.name.replace(/\s/g, "_")}`;
        const filePath = join(uploadDir, fileName);

        await writeFile(filePath, buffer);

        attachments.push({
          imageUrl: `/uploads/${fileName}`,
          description: description || "Dokumentasi Pekerjaan",
        });
      }
    }

    const bapNumber = await generateDocumentNumber("BAP");
    const invoiceNumber = await generateDocumentNumber("INVOICE");

    await prisma.project.update({
      where: { id: projectId },
      data: {
        status: "COMPLETED_INVOICED",
        actualEndDate: new Date(),
        bap: {
          create: {
            bapNumber: bapNumber,
            items: {
              create: items.map((item: any) => ({
                description: item.description,
                qty: Number(item.qty),
                unit: item.unit,
                price: Number(item.price),
              })),
            },
            attachments: { create: attachments },
          },
        },
        invoice: {
          create: {
            invoiceNumber: invoiceNumber,
            terbilang: "Akan dikalkulasi otomatis",
          },
        },
      },
    });

    revalidatePath(`/admin/pengajuan/${projectId}`);
    revalidatePath(`/admin/jadwal`);
    revalidatePath(`/admin/dashboard`);

    return { success: true };
  } catch (error: any) {
    console.error("Critical Error Simpan BAP:", error);
    return {
      success: false,
      error: error.message || "Terjadi kesalahan internal.",
    };
  }
}

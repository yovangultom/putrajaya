"use server";

import { unlink } from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { PrismaClient } from "@prisma/client";
import sharp from "sharp";

const prisma = new PrismaClient();

const slugify = (text: string) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
};

// Fungsi Helper agar tidak mengulang kode optimasi Sharp
async function processImage(file: File) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
  const filename = `${uniqueSuffix}-optimized.webp`;
  const filepath = path.join(
    process.cwd(),
    "public/uploads/projects",
    filename,
  );

  await sharp(buffer)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(filepath);

  return `/uploads/projects/${filename}`;
}

export async function submitPortfolio(formData: FormData) {
  try {
    const title = formData.get("title") as string;
    const client = formData.get("client") as string;
    const location = formData.get("location") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const completionDate = new Date(formData.get("completionDate") as string);
    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;

    // 1. Ambil File
    const mainImageFile = formData.get("mainImage") as File;
    const galleryFiles = formData.getAll("galleryImages") as File[];

    // Validasi maksimal 4 foto tambahan (total 5 dengan main image)
    if (galleryFiles.length > 4) {
      return {
        success: false,
        message: "Maksimal hanya 4 foto tambahan yang diperbolehkan!",
      };
    }

    let mainImagePath = "";
    if (mainImageFile && mainImageFile.size > 0) {
      mainImagePath = await processImage(mainImageFile);
    } else {
      return { success: false, message: "Gambar utama wajib diisi!" };
    }

    // 2. Proses Foto Tambahan (Looping)
    const galleryPaths = [];
    for (const file of galleryFiles) {
      if (file.size > 0) {
        const url = await processImage(file);
        galleryPaths.push({ imageUrl: url });
      }
    }

    // 3. Simpan ke Database (Portfolio + Gallery)
    await prisma.portfolio.create({
      data: {
        title,
        slug,
        description,
        client,
        location,
        category,
        completionDate,
        image: mainImagePath,
        gallery: {
          create: galleryPaths, // Otomatis insert ke tabel PortfolioGallery
        },
      },
    });

    revalidatePath("/proyek");
    revalidatePath(`/proyek/${slug}`, "page");
    revalidatePath("/admin/portofolio");

    return {
      success: true,
      message: "Portofolio beserta galeri berhasil ditambahkan!",
    };
  } catch (error) {
    console.error("Gagal menyimpan portofolio:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menyimpan data.",
    };
  }
}

// ... (biarkan fungsi submitPortfolio di atasnya tetap sama) ...

export async function deletePortfolio(id: string, imagePath: string) {
  try {
    // Ambil data galeri sebelum dihapus
    const portfolio = await prisma.portfolio.findUnique({
      where: { id },
      include: { gallery: true },
    });

    // 1. Hapus Gambar Utama dari VPS
    if (imagePath) {
      try {
        await unlink(path.join(process.cwd(), "public", imagePath));
      } catch (e) {}
    }

    // 2. Hapus Gambar Galeri dari VPS
    if (portfolio?.gallery) {
      for (const img of portfolio.gallery) {
        try {
          await unlink(path.join(process.cwd(), "public", img.imageUrl));
        } catch (e) {}
      }
    }

    // 3. Hapus data dari database (otomatis menghapus baris di PortfolioGallery karena onDelete: Cascade)
    await prisma.portfolio.delete({ where: { id } });

    revalidatePath("/proyek");
    revalidatePath("/admin/portofolio");

    return {
      success: true,
      message: "Portofolio beserta galeri berhasil dihapus!",
    };
  } catch (error) {
    console.error("Gagal menghapus:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat menghapus data.",
    };
  }
}

export async function updatePortfolio(
  id: string,
  oldImagePath: string,
  formData: FormData,
) {
  try {
    const title = formData.get("title") as string;
    const client = formData.get("client") as string;
    const location = formData.get("location") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const completionDate = new Date(formData.get("completionDate") as string);
    const slug = `${slugify(title)}-${Date.now().toString().slice(-4)}`;

    const mainImageFile = formData.get("mainImage") as File;
    const galleryFiles = formData.getAll("galleryImages") as File[];
    const validGalleryFiles = galleryFiles.filter((f) => f.size > 0);

    if (validGalleryFiles.length > 4) {
      return {
        success: false,
        message: "Maksimal hanya 4 foto tambahan yang diperbolehkan!",
      };
    }

    let finalImagePath = oldImagePath;

    // --- 1. UPDATE GAMBAR UTAMA (Jika ada upload baru) ---
    if (mainImageFile && mainImageFile.size > 0) {
      finalImagePath = await processImage(mainImageFile);
      if (oldImagePath) {
        try {
          await unlink(path.join(process.cwd(), "public", oldImagePath));
        } catch (e) {}
      }
    }

    // --- 2. UPDATE DATABASE (Teks & Gambar Utama) ---
    await prisma.portfolio.update({
      where: { id },
      data: {
        title,
        slug,
        description,
        client,
        location,
        category,
        completionDate,
        image: finalImagePath,
      },
    });

    // --- 3. UPDATE GALERI (Jika ada upload foto tambahan baru) ---
    if (validGalleryFiles.length > 0) {
      // Ambil galeri lama untuk dihapus filenya
      const oldGallery = await prisma.portfolioGallery.findMany({
        where: { portfolioId: id },
      });

      // Hapus file fisik galeri lama dari VPS
      for (const img of oldGallery) {
        try {
          await unlink(path.join(process.cwd(), "public", img.imageUrl));
        } catch (e) {}
      }

      // Hapus data galeri lama dari Database
      await prisma.portfolioGallery.deleteMany({ where: { portfolioId: id } });

      // Simpan foto galeri baru
      const galleryPaths = [];
      for (const file of validGalleryFiles) {
        const url = await processImage(file);
        galleryPaths.push({ imageUrl: url, portfolioId: id });
      }

      // Insert galeri baru ke database
      await prisma.portfolioGallery.createMany({ data: galleryPaths });
    }

    revalidatePath("/proyek");
    revalidatePath("/admin/portofolio");

    return { success: true, message: "Portofolio berhasil diupdate!" };
  } catch (error) {
    console.error("Gagal mengupdate portofolio:", error);
    return { success: false, message: "Terjadi kesalahan saat update data." };
  }
}

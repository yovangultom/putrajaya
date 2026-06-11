import { MetadataRoute } from "next";
// PERBAIKAN 1: Menggunakan named import dengan kurung kurawal {}
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://jasacoring.co.id";

  // 1. Rute Statis (Halaman Utama)
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/tentang",
    "/layanan",
    "/proyek",
    "/kontak",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // 2. Rute Layanan (Semi-Dinamis)
  const services = [
    "konstruksi-umum",
    "perencanaan-konstruksi",
    "jasa-coring",
    "chemical-anchor",
    "service-genset",
    "jual-beli-genset",
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((slug) => ({
    url: `${baseUrl}/layanan/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // 3. Rute Proyek Dinamis dari Database
  const portfolios = await prisma.portfolio.findMany({
    select: {
      slug: true,
      // updatedAt: true, // Buka komentar ini jika Anda punya field tanggal update di schema
    },
  });

  // PERBAIKAN 2: Menambahkan tipe data eksplisit pada parameter 'item'
  const projectRoutes: MetadataRoute.Sitemap = portfolios.map(
    (item: { slug: string }) => ({
      url: `${baseUrl}/proyek/${item.slug}`,
      lastModified: new Date(), // Ganti dengan item.updatedAt jika field-nya ada
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }),
  );

  // Gabungkan semua rute
  return [...staticRoutes, ...serviceRoutes, ...projectRoutes];
}

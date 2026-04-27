import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  // Ganti dengan domain asli Anda
  const baseUrl = "https://jasacoring.co.id";

  // 1. Rute Statis (Halaman Utama)
  const staticRoutes = ["", "/tentang", "/layanan", "/proyek", "/kontak"].map(
    (route) => ({
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8, // Prioritas tertinggi untuk beranda
    }),
  );

  // 2. Rute Dinamis (Detail Layanan)
  const services = [
    "konstruksi-umum",
    "perencanaan-konstruksi",
    "jasa-coring",
    "chemical-anchor",
    "service-genset",
    "jual-beli-genset",
  ];

  const dynamicRoutes = services.map((slug) => ({
    url: `${baseUrl}/layanan/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7, // Prioritas menengah untuk halaman detail
  }));

  return [...staticRoutes, ...dynamicRoutes];
}

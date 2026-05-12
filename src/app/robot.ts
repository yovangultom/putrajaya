// src/app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/admin/", // 👈 Tambahkan ini agar Google menjauhi area Admin
    },
    sitemap: "https://jasacoring.co.id/sitemap.xml",
  };
}

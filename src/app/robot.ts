import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*', // Mengizinkan semua bot search engine (Google, Bing, dll)
      allow: '/',     // Mengizinkan bot merayapi seluruh halaman
    },
    sitemap: 'https://jasacoring.co.id/sitemap.xml', // Path ke sitemap Anda
  }
}
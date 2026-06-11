import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
      // Masukkan DOMAIN ASLI atau IP PUBLIK VPS Anda di sini
      allowedOrigins: [
        "localhost:3000", // Biarkan agar tetap bisa di-test di laptop
        "jasacoring.co.id", // CONTOH 1: Jika pakai Domain utama
        "www.jasacoring.co.id", // CONTOH 2: Jika pakai Subdomain WWW
      ],
    },
  },

  // 👇 TAMBAHKAN FUNGSI REDIRECTS DI SINI
  async redirects() {
    return [
      {
        source: "/tentang-kami",
        destination: "/tentang",
        permanent: true, // Status 301 Redirect (Permanen) untuk SEO
      },
      {
        source: "/layanan/jasa-coring-beton",
        destination: "/layanan/jasa-coring",
        permanent: true,
      },
      {
        source: "/layanan/jasa-konstruksi",
        destination: "/layanan/konstruksi-umum",
        permanent: true,
      },
      {
        source: "/layanan/konstruksi",
        destination: "/layanan/konstruksi-umum",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

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
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Config bawaan kamu untuk gambar (biarkan saja)
  images: {
    qualities: [75, 95], // *catatan: Next.js biasanya memakai 'deviceSizes' atau 'imageSizes', tapi jika ini jalan, biarkan saja.
  },

  // PENULISAN YANG BENAR 100% SESUAI TYPESCRIPT:
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
      allowedOrigins: ["192.168.100.44", "localhost:3000"], // Pindahkan ke sini!
    },
  },
};

export default nextConfig;

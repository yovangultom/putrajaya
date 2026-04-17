// next.config.ts atau next.config.js
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PINDAHKAN KE SINI (Top Level)
  allowedDevOrigins: ["192.168.100.44", "localhost:3000"],

  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;

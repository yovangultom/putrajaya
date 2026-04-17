// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

// Konfigurasi Adapter Prisma 7
const connectionString = process.env.DATABASE_URL;

// Masukkan adapter ke dalam Prisma Client
const prisma = new PrismaClient();

async function main() {
  // Hash password "admin123"
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // 1. Buat Akun Super Admin
  const admin = await prisma.user.upsert({
    where: { email: "admin@putrajaya.com" },
    update: {},
    create: {
      name: "Super Admin Putrajaya",
      email: "admin@putrajaya.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
    },
  });

  // 2. Buat Akun Finance
  const finance = await prisma.user.upsert({
    where: { email: "finance@putrajaya.com" },
    update: {},
    create: {
      name: "Tim Keuangan",
      email: "finance@putrajaya.com",
      password: hashedPassword,
      role: "FINANCE",
    },
  });

  console.log("✅ Database berhasil di-seed!");
  console.log({ admin, finance });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect(); // Tutup koneksi pool pg
  });

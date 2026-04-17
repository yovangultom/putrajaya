// src/lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

// Singleton pattern agar tidak terlalu banyak koneksi saat development
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

import 'dotenv/config';
import { defineConfig, env } from '@prisma/config';

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
  migrations: {
    // Kita ganti ts-node menjadi tsx yang jauh lebih pintar
    seed: 'npx tsx prisma/seed.ts',
  },
});
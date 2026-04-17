// src/auth.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" }, // Wajib pakai JWT kalau pakai email/password
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // 1. Cari user di database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) return null;

        // 2. Cocokkan password yang diketik dengan yang di-hash di database
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );

        // 3. Jika cocok, kembalikan data user
        if (passwordsMatch) return user;
        return null;
      },
    }),
  ],
  callbacks: {
    // Memasukkan data awal ke dalam token saat pertama kali login
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id; // Tambahkan ID agar bisa dilacak
        token.role = (user as any).role;
      }
      return token;
    },

    // Mengeluarkan data ke frontend & melakukan pengecekan Database
    async session({ session, token }) {
      if (token?.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { id: true, role: true },
        });

        if (!dbUser) {
          // Manipulasi ID bawaan agar TIDAK disensor oleh NextAuth
          if (session.user) {
            session.user.id = "DELETED_USER";
          }
          return session;
        }

        if (session.user) {
          session.user.id = dbUser.id;
          // Perbaikan: Hapus sisa-sisa string literal yang menggantung
          (session.user as any).role = dbUser.role;
        }
      }
      return session;
    },
  },
});

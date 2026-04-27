"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";

export async function addUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;

  if (!name || !email || !password || !role)
    return { success: false, message: "Data tidak lengkap" };

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
    });
    revalidatePath("/admin/users");
    return { success: true, message: "Akun berhasil dibuat!" };
  } catch (error) {
    return { success: false, message: "Email sudah terdaftar." };
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath("/admin/users");
    return { success: true, message: "Akun berhasil dihapus." };
  } catch (error) {
    return { success: false, message: "Gagal menghapus akun." };
  }
}

import { PrismaClient } from "@prisma/client";
import RecentProjectsClient from "./RecentProjectsClient"; // Kita akan buat file ini di langkah 2

const prisma = new PrismaClient();

export default async function RecentProjects() {
    // Mengambil 3 portofolio terbaru dari database di Server
    const recentProjects = await prisma.portfolio.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' }
    });

    // Melempar data tersebut ke komponen Client untuk dianimasikan
    return <RecentProjectsClient projects={recentProjects} />;
}
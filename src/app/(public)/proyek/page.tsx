import { PrismaClient } from "@prisma/client";
import ProyekClient from "./ProyekClient";

const prisma = new PrismaClient();

// Ini sangat bagus untuk SEO
export const metadata = {
    title: "Portofolio Proyek",
    description: "Galeri hasil pekerjaan dan portofolio layanan dari CV Putra Jaya.",
};

export default async function ProyekPage() {
    // Ambil data portofolio dari database, urutkan dari yang terbaru
    const portfolios = await prisma.portfolio.findMany({
        orderBy: { completionDate: 'desc' }
    });

    // Lempar datanya ke komponen yang ada Framer Motion-nya
    return <ProyekClient portfolios={portfolios} />;
}
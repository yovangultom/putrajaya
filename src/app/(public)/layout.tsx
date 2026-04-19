import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";


// src/app/(public)/layout.tsx
export const metadata = {
    title: {
        default: "Jasa Konstruksi, Coring, Genset, dan Chemical Anchor - CV Putra Jaya",
        template: "%s | CV Putra Jaya"
    },
    description: "Cari Jasa Konstruksi, Coring, Genset, dan Chemical terpercaya? CV Putra Jaya menawarkan solusi teknik terbaik dengan standar mutu tinggi, aman, dan tepat waktu.",
    openGraph: {
        title: "Jasa Konstruksi, Coring, Genset, dan Chemical Anchor - CV Putra Jaya",
        description: "Solusi teknik terbaik dengan standar mutu tinggi, aman, dan tepat waktu.",
        url: 'https://putrajaya.com', // Nanti ganti dengan domain asli
        siteName: 'CV Putra Jaya',
        images: [
            {
                url: '/og-image.jpg', // File ini ditaruh di folder public
                width: 1200,
                height: 630,
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
};
export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
            <FloatingWhatsApp />
        </>
    );
}
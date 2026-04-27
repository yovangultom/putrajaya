import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import ScrollToTop from "@/components/public/ScrollToTop";
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
    title: {
        default: "Jasa Konstruksi, Coring, Genset, dan Chemical Anchor - CV Putra Jaya",
        template: "%s | CV Putra Jaya"
    },
    description: "Cari Jasa Konstruksi, Coring, Genset, dan Chemical terpercaya? CV Putra Jaya menawarkan solusi teknik terbaik dengan standar mutu tinggi, aman, dan tepat waktu.",
    openGraph: {
        title: "Jasa Konstruksi, Coring, Genset, dan Chemical Anchor - CV Putra Jaya",
        description: "Solusi teknik terbaik dengan standar mutu tinggi, aman, dan tepat waktu.",
        url: 'https://jasacoring.co.id',
        siteName: 'CV Putra Jaya',
        images: [
            {
                url: '/og-image.jpg',
                width: 1200,
                height: 630,
            },
        ],
        locale: 'id_ID',
        type: 'website',
    },
    verification: {
        google: "bg2rUu0GRLru_YYsSNQaU2JM-oWUSdrkNzmVckVl5go",
    },
};

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <ScrollToTop />
            <Navbar />
            {children}
            <Footer />
            <FloatingWhatsApp />
            <GoogleAnalytics gaId="G-89JZFL5CCF" />
        </>
    );
}
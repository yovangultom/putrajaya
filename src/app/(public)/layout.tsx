import FloatingWhatsApp from "@/components/public/FloatingWhatsApp";
import Footer from "@/components/public/Footer";
import Navbar from "@/components/public/Navbar";
import ScrollToTop from "@/components/public/ScrollToTop";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from "next/script"; // 1. Tambahkan import ini

export const metadata = {
    title: {
        default: "Jasa Konstruksi, Coring, Genset, dan Chemical Anchor - PT Putra Jaya Teknik Mandiri",
        template: "%s | PT Putra Jaya Teknik Mandiri"
    },
    description: "Cari Jasa Konstruksi, Coring, Genset, dan Chemical terpercaya? PT Putra Jaya Teknik Mandiri menawarkan solusi teknik terbaik dengan standar mutu tinggi, aman, dan tepat waktu.",
    openGraph: {
        title: "Jasa Konstruksi, Coring, Genset, dan Chemical Anchor - PT Putra Jaya Teknik Mandiri",
        description: "Solusi teknik terbaik dengan standar mutu tinggi, aman, dan tepat waktu.",
        url: 'https://jasacoring.co.id',
        siteName: 'PT Putra Jaya Teknik Mandiri',
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
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=AW-17753313226"
                strategy="afterInteractive"
            />
            <Script id="google-ads-init" strategy="afterInteractive">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', 'AW-17753313226');
                `}
            </Script>
            <ScrollToTop />
            <Navbar />
            {children}
            <Footer />
            <FloatingWhatsApp />
            <GoogleAnalytics gaId="G-89JZFL5CCF" />
        </>
    );
}
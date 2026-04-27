import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Konfigurasi Metadata untuk SEO Mantap
export const metadata: Metadata = {
  metadataBase: new URL('https://jasacoring.co.id'), // Menghilangkan warning build tadi
  title: {
    default: "CV Putra Jaya | Jasa Coring & Konstruksi",
    template: "%s | CV Putra Jaya"
  },
  description: "Spesialis jasa coring beton, service genset, chemical anchor, dan konstruksi sipil industri terpercaya dengan tim profesional.",
  keywords: ["coring beton", "service genset", "konstruksi sipil", "chemical anchor", "CV Putra Jaya"],
  authors: [{ name: "CV Putra Jaya" }],
  openGraph: {
    title: "CV Putra Jaya | Jasa Coring & Konstruksi",
    description: "Solusi Teknik Terpercaya untuk Konstruksi Modern.",
    url: 'https://jasacoring.co.id',
    siteName: 'CV Putra Jaya',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      {/* Tambahkan className font agar semua halaman menggunakan font yang sama */}
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        {/* Masukkan Measurement ID GA4 Anda di sini */}
        <GoogleAnalytics gaId="G-89JZFL5CCF" />
      </body>
    </html>
  );
}
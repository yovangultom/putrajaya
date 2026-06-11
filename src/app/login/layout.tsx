import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login Admin | PT Putra Jaya Teknik Mandiri",
    description: "Halaman akses masuk sistem manajemen PT Putra Jaya Teknik Mandiri",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
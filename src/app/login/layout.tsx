import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login Admin | CV Putra Jaya",
    description: "Halaman akses masuk sistem manajemen CV Putra Jaya",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2, PencilRuler, Target, FlaskConical, Wrench, Store } from "lucide-react";
import { AnimatedContent } from "./AnimatedDetail";

// Data Detail Layanan
const servicesDetail = {
    "konstruksi-umum": {
        title: "Konstruksi Umum",
        icon: <Building2 size={48} />,
        image: "/images/services/Layanan_KonstruksiUmum.jpg",
        description: "Layanan pembangunan dan renovasi menyeluruh untuk berbagai skala proyek sipil.",
        content: "CV Putra Jaya melayani pengerjaan konstruksi umum mulai dari tahap persiapan lahan hingga penyelesaian akhir (finishing). Kami mengutamakan kekuatan struktur dan estetika hasil akhir.",
        features: ["Pembangunan Ruko & Rumah", "Renovasi Bangunan", "Pekerjaan Infrastruktur Jalan", "Pengecoran & Pembetonan"]
    },
    "perencanaan-konstruksi": {
        title: "Perencanaan Konstruksi",
        icon: <PencilRuler size={48} />,
        image: "/images/services/Layanan_PerencanaanKonstruksi.jpg",
        description: "Solusi desain dan analisis teknis sebelum proyek dimulai.",
        content: "Setiap bangunan yang kokoh dimulai dari perencanaan yang matang. Kami menyediakan jasa desain arsitektur, perhitungan struktur (RAB), hingga analisis dampak lingkungan.",
        features: ["Desain Arsitektur 2D/3D", "Perhitungan RAB", "Analisis Struktur Bangunan", "Konsultasi Teknis Lapangan"]
    },
    "jasa-coring": {
        title: "Jasa Coring",
        icon: <Target size={48} />,
        image: "/images/services/Layanan_JasaCoring.jpg",
        description: "Pengeboran beton presisi menggunakan mesin coring modern.",
        content: "Layanan Core Drilling kami memungkinkan pembuatan lubang pada beton bertulang, keramik, atau marmer tanpa menimbulkan getaran berlebih yang merusak struktur utama.",
        features: ["Lubang Jalur Pipa (Plumbing)", "Jalur Kabel Listrik & Data", "Ventilasi AC", "Pengambilan Sampel Beton"]
    },
    "chemical-anchor": {
        title: "Chemical Anchor",
        icon: <FlaskConical size={48} />,
        image: "/images/services/Layanan_Chemical.jpg",
        description: "Pemasangan anchor dengan perekat kimia untuk kekuatan ekstra.",
        content: "Kami melayani pemasangan stek rebar dan baut anchor menggunakan bahan kimia (epoxy/resin) berkualitas tinggi untuk menambah kekuatan sambungan beton lama dan baru.",
        features: ["Sambungan Beton Lama & Baru", "Pemasangan Base Plate Baja", "Kekuatan Tarik Tinggi", "Material Standar Industri"]
    },
    "service-genset": {
        title: "Service Genset",
        icon: <Wrench size={48} />,
        image: "/images/services/Layanan_ServiceGenset.jpg",
        description: "Perawatan berkala dan perbaikan genset berbagai kapasitas.",
        content: "Pastikan ketersediaan energi cadangan Anda selalu prima. Tim teknisi kami siap melakukan pengecekan mesin, penggantian oli, hingga perbaikan panel kontrol genset.",
        features: ["Maintenance Berkala", "Overhaul Mesin", "Service Panel ATS/AMF", "Penyediaan Suku Cadang Asli"]
    },
    "jual-beli-genset": {
        title: "Jual Beli dan Sewa Genset",
        icon: <Store size={48} />,
        image: "/images/services/Layanan_JualBeliGenset.jpg",
        description: "Penyediaan unit genset baru maupun bekas berkualitas.",
        content: "Kami menyediakan berbagai macam kapasitas genset (kVA) dari merek ternama. Semua unit yang kami jual telah melalui tahap uji beban (load test) yang ketat.",
        features: ["Genset Baru & Bekas Bergaransi", "Berbagai Kapasitas (kVA)", "Layanan Tukar Tambah", "Gratis Konsultasi Kapasitas Daya"]
    }
};

// === INI ADALAH KUNCI UNTUK SKOR 100 DI DYNAMIC ROUTE ===
// Fungsi ini memberitahu Next.js untuk mem-build keenam halaman ini menjadi HTML statis
export function generateStaticParams() {
    return Object.keys(servicesDetail).map((slug) => ({
        slug: slug,
    }));
}

// Komponen Server (Menggunakan params props, bukan useParams)
export default async function DetailLayanan(props: { params: Promise<{ slug: string }> }) {

    // 3. Ekstrak params menggunakan 'await'
    const params = await props.params;
    const slug = params.slug;

    const data = servicesDetail[slug as keyof typeof servicesDetail];

    if (!data) return notFound();

    return (
        <main className="min-h-screen bg-white">
            {/* Header / Banner Layanan - MURNI HTML STATIS (Tanpa Animasi JS) */}
            <section className="bg-[#0B0C35] pt-40 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#277BBE] rounded-full blur-[100px] opacity-20 -mr-10 -mt-10 pointer-events-none"></div>

                <div className="container mx-auto px-6 relative z-10">
                    <Link
                        href="/layanan"
                        className="inline-flex items-center gap-2 text-[#F49414] font-bold mb-8 hover:-translate-x-1 transition-transform"
                    >
                        <ArrowLeft size={20} /> Kembali ke Layanan
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Bagian Teks Kiri - Langsung Muncul */}
                        <div>
                            <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center text-[#F49414] mb-6 border border-white/20">
                                {data.icon}
                            </div>
                            {/* ELEMEN LCP: Bebas dari hambatan animasi! */}
                            <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                                {data.title}
                            </h1>
                            <p className="text-xl text-white/70 leading-relaxed">
                                {data.description}
                            </p>
                        </div>

                        {/* Bagian Gambar Kanan - Diberi Priority */}
                        <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
                            <Image
                                src={data.image}
                                alt={data.title}
                                fill
                                priority // SANGAT PENTING: Ini adalah LCP di Mobile/Desktop
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Konten Detail - Memanggil komponen animasi di klien */}
            <section className="py-24">
                <div className="container mx-auto px-6">
                    <AnimatedContent data={data} />
                </div>
            </section>
        </main>
    );
}
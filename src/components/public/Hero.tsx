import Image from "next/image";
import dynamic from "next/dynamic";

const AnimatedParagraph = dynamic(() => import("./AnimatedHero").then(mod => mod.AnimatedParagraph));
const AnimatedStats = dynamic(() => import("./AnimatedHero").then(mod => mod.AnimatedStats));

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0B0C35] pt-32 pb-16">
            <div className="absolute inset-0 z-0 flex">

                {/* 1. GAMBAR KIRI (KONSTRUKSI) - HANYA MUNCUL DI DESKTOP */}
                <div
                    className="hidden md:block w-1/3 h-full bg-cover bg-center border-r border-white/10"
                    style={{ backgroundImage: "url('/images/hero-konstruksi.jpg')" }}
                />

                {/* 2. GAMBAR TENGAH (CORING) - SANG RAJA (MUNCUL DI MOBILE & DESKTOP) */}
                {/* Tetap gunakan Next Image di sini dengan priority agar skor Mobile 100 */}
                <div className="relative w-full md:w-1/3 h-full shrink-0">
                    <Image
                        src="/images/hero-coring.jpg"
                        alt="Jasa Coring"
                        fill
                        className="object-cover"
                        priority
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>

                {/* 3. GAMBAR KANAN (GENSET) - HANYA MUNCUL DI DESKTOP */}
                <div
                    className="hidden md:block w-1/3 h-full bg-cover bg-center border-l border-white/10"
                    style={{ backgroundImage: "url('/images/hero-genset.jpg')" }}
                />

            </div>

            {/* Overlay Gradient Tetap Sama */}
            <div className="absolute inset-0 z-10 bg-[#0B0C35]/20"></div>
            <div className="absolute inset-0 z-10 "></div>

            {/* Konten */}
            <div className="container mx-auto px-6 relative z-20 pt-10 md:pt-20 flex flex-col justify-between min-h-[calc(100vh-8rem)]">
                <div className="max-w-4xl mx-auto mb-16 flex flex-col items-center text-center">
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.1] mb-6 tracking-tighter drop-shadow-lg">
                        Solusi Teknik <span className="text-[#F49414]">Terpercaya</span> untuk Konstruksi Modern.
                    </h1>
                    <AnimatedParagraph />
                </div>
                <AnimatedStats />
            </div>
        </section>
    );
}
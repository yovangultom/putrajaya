import Image from "next/image";
import dynamic from "next/dynamic";

const AnimatedParagraph = dynamic(() => import("./AnimatedHero").then(mod => mod.AnimatedParagraph));
const AnimatedStats = dynamic(() => import("./AnimatedHero").then(mod => mod.AnimatedStats));

export default function Hero() {
    return (
        <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0B0C35] pt-32 pb-16">
            <div className="absolute inset-0 z-0 flex">

                {/* 1. GAMBAR KIRI (KONSTRUKSI) */}
                <div className="relative hidden md:block w-1/3 h-full border-r border-white/10">
                    <Image
                        src="/images/hero-konstruksi.jpg"
                        alt="Layanan Konstruksi"
                        fill
                        className="object-cover"
                        sizes="33vw"
                    // Tanpa atribut priority, gambar ini otomatis di-lazy-load.
                    // Karena dibungkus div 'hidden', browser mobile TIDAK akan mengunduhnya.
                    />
                </div>

                {/* 2. GAMBAR TENGAH (CORING) - SANG RAJA */}
                <div className="relative w-full md:w-1/3 h-full shrink-0">
                    <Image
                        src="/images/hero-coring.jpg"
                        alt="Jasa Coring Beton"
                        fill
                        className="object-cover"
                        priority // Wajib untuk membidik LCP yang cepat di layar mobile
                        sizes="(max-width: 768px) 100vw, 33vw"
                    />
                </div>

                {/* 3. GAMBAR KANAN (GENSET) */}
                <div className="relative hidden md:block w-1/3 h-full border-l border-white/10">
                    <Image
                        src="/images/hero-genset.jpg"
                        alt="Layanan Genset"
                        fill
                        className="object-cover"
                        sizes="33vw"
                    />
                </div>

            </div>

            {/* Overlay Gradient */}
            <div className="absolute inset-0 z-10 bg-[#0B0C35]/20"></div>

            {/* Konten Utama */}
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
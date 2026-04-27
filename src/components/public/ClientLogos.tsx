"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function ClientLogos() {
    const clients = [
        { name: "PT Waskita Karya", src: "/images/clients/client-1.png" },
        { name: "PT Wijaya Karya", src: "/images/clients/client-2.png" },
        { name: "Kementerian PUPR", src: "/images/clients/client-3.png" },
        { name: "PT Adhi Karya", src: "/images/clients/client-4.png" },
        { name: "Perusahaan Swasta 1", src: "/images/clients/client-5.png" },
        { name: "Perusahaan Swasta 2", src: "/images/clients/client-6.png" },
    ];

    return (
        <section className="py-12 bg-white border-b border-slate-100">
            <div className="container mx-auto px-6">

                <div className="text-center mb-10">
                    <h2 className="text-xl md:text-2xl font-bold text-[#0B0C35] mb-3">
                        Telah Dipercaya Oleh
                    </h2>
                    <div className="w-16 h-1 bg-[#F49414] mx-auto rounded-full"></div>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 lg:gap-20">
                    {clients.map((client, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 transition-all duration-300 hover:scale-110"
                        >
                            <Image
                                src={client.src}
                                alt={`Logo Klien ${client.name}`}
                                fill
                                sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                                className="object-contain"
                            />
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
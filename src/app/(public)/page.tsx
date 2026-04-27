import Navbar from "@/components/public/Navbar";
import Hero from "@/components/public/Hero";
import Testimonials from "@/components/public/Testimonials";
import ClientLogos from "@/components/public/ClientLogos";
import Services from "@/components/public/Services";
import RecentProjects from "@/components/public/RecentProjects";
import AboutSection from "@/components/public/AboutSection";
import ContactAndMap from "@/components/public/ContactAndMap";
export default function LandingPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <Hero />
            <AboutSection />
            <ClientLogos />
            <Services />
            <RecentProjects />
            <Testimonials />
            <ContactAndMap />
        </main>
    );
}
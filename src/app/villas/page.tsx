import Navbar from "@/components/Navbar";
import VillasHero from "@/components/VillasHero";
import VillasCarousel from "@/components/VillasCarousel";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

export default function VillasPage() {
  return (
    <main className="bg-[#1A1C1E] min-h-screen">
      <Navbar />
      <VillasHero />
      <VillasCarousel />
      <Footer />
      <div className="h-24 md:hidden" /> {/* Spacer for Mobile Bottom Nav */}
      <MobileBottomNav />
    </main>
  );
}

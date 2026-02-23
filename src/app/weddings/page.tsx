import WeddingHero from "@/components/WeddingHero";
import WeddingScrollSection from "@/components/WeddingScrollSection";
import WeddingVillasCarousel from "@/components/WeddingVillasCarousel";
import WeddingServicesSection from "@/components/WeddingServicesSection";
import WhyJadeWeddings from "@/components/WhyJadeWeddings";
import WeddingCelebrationsSection from "@/components/WeddingCelebrationsSection";
import Navbar from "@/components/Navbar";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export const metadata = {
  title: "Weddings | Jade Hospitainment",
  description:
    "Boutique Weddings Set in Nature - Private farmhouse and garden estates around Bangalore.",
};

export default function WeddingPage() {
  return (
    <SmoothScroll>
      <main className="relative bg-[#1A1C1E] min-h-screen">
        <Navbar />

        <WeddingHero />

        <div className="relative z-10">
          <WeddingScrollSection />
          <WeddingVillasCarousel />
          <WeddingServicesSection />
          <WhyJadeWeddings />
          <WeddingCelebrationsSection />
        </div>

        <Footer />
        <MobileBottomNav />
      </main>
    </SmoothScroll>
  );
}

import Navbar from "@/components/Navbar";
import ExperiencesHero from "@/components/ExperiencesHero";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ExperiencesScrollSection from "@/components/ExperiencesScrollSection";

export default function ExperiencesPage() {
  return (
    <main className="bg-[#1A1C1E] min-h-screen">
      <Navbar />
      <ExperiencesHero />
      {/* Start of Content Sections - Reusing existing sections or placeholders for now */}
      <div id="experiences-list">
        <ExperiencesScrollSection />
      </div>
      <Footer />
      <div className="h-24 md:hidden" /> {/* Spacer for Mobile Bottom Nav */}
      <MobileBottomNav />
    </main>
  );
}

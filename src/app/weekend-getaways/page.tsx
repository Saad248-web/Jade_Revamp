"use client";

import React from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import CorporateHeader from "@/components/CorporateHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";
import PrimaryButton from "@/components/PrimaryButton";
import {
  Home,
  Calendar,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Download,
} from "lucide-react";
import LiveBackground from "@/components/LiveBackground";
import Footer from "@/components/Footer";
import ExperienceHero from "@/components/ExperienceHero";
import ScrollSectionComposer, {
  ScrollSlide,
} from "@/components/ScrollSectionComposer";
import ExperienceCarouselSection from "@/components/ExperienceCarouselSection";
import VillasCarouselSection from "@/components/VillasCarouselSection";

const themedVillas = [
  {
    name: "Dome Villa",
    tag: "HOBBIT-INSPIRED PRIVATE RETREAT",
    image: "/assets/Dome_Villa.png",
  },
  {
    name: "Magnolia",
    tag: "CONTEMPORARY LUXURY VILLA",
    image: "/assets/Magnolia_for_Desktop.png",
  },
  {
    name: "Diamond Pavilion",
    tag: "MODERN ARCHITECTURAL MARVEL",
    image: "/assets/Jade_735_for_Desktop.png",
  },
  {
    name: "Retreat on the Ridge",
    tag: "SCENIC HILLTOP ESCAPE",
    image: "/assets/ROR_for_Desktop.png",
  },
  {
    name: "The Haven",
    tag: "PRIVATE SERENE SANCTUARY",
    image: "/assets/Lemon_Tree_for_Desktop.png",
  },
];

const weekendSlides = [
  {
    title: "Poolside Mornings",
    desc: "Slow mornings by the pool with coffee, sunlight, and nowhere else to be.",
    image: "/assets/Bathing_Girls.png",
  },
  {
    title: "Evenings Under the Stars",
    desc: "Bonfires, music, and long conversations that stretch late into the night.",
    image: "/assets/evening_under_stars.png",
  },
  {
    title: "Outdoor Dining",
    desc: "Freshly grilled meals, laughter around the table, and food shared with friends.",
    image: "/assets/outdoor_dining.png",
  },
  {
    title: "Nature & Nearby Escapes",
    desc: "Morning treks, quiet lakes, and scenic walks just minutes from your villa.",
    image: "/assets/nature_escapes.png",
  },
  {
    title: "Celebrations With Friends",
    desc: "Birthdays, reunions, or simply an excuse to gather everyone together.",
    image: "/assets/celebrations_friends.png",
  },
  {
    title: "Movie Nights Under The Stars",
    desc: "Projector nights, cozy spaces, and the perfect way to wind down the day.",
    image: "/assets/movie_nights.png",
  },
  {
    title: "Private Dinners",
    desc: "Experience curated dining in the privacy of your villa under the starlit sky.",
    image: "/assets/corporate_retreat.png",
  },
  {
    title: "Golden Evenings",
    desc: "Watching the sun dip below the horizon with those who matter most.",
    image: "/assets/wellness_retreat.png",
  },
];

const animatedSlides: ScrollSlide[] = [
  {
    label: "A DIFFERENT KIND OF WEEKEND ESCAPE",
    lines: [
      "Jade’s private villas offer space,",
      "privacy, and comfort just outside the",
      "city. Whether you’re planning a",
      "relaxed stay with friends, a family",
      "getaway, or a small celebration, each",
      "retreat is designed to let you slow",
      "down and enjoy the moment.",
    ],
  },
];

export default function WeekendGetawaysPage() {
  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <CorporateHeader />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        backgroundImage="/assets/weekend_getaway_hero.png"
        backgroundAlt="Weekend Getaways"
        heading={
          <>
            Weekend Getaways
            <br />
            In Bangalore
          </>
        }
        description="Private villas designed for relaxed escapes, small celebrations, and memorable weekends with friends and family."
        buttons={[
          {
            icon: <Calendar className="w-5 h-5" />,
            label: "VENUES",
            onClick: () => {
              const venuesSection = document.getElementById("themed-villas");
              if (venuesSection)
                venuesSection.scrollIntoView({ behavior: "smooth" });
            },
          },
          {
            icon: <Download className="w-5 h-5" />,
            label: "BROCHURE",
            onClick: () => window.open("/brochure.pdf", "_blank"),
          },
        ]}
      />

      {/* SECTION 2: ANIMATED TEXT SECTION */}
      <ScrollSectionComposer slides={animatedSlides} height="250vh" />

      {/* SECTION 3: CAROUSEL SECTION */}
      <ExperienceCarouselSection
        label="WHAT WEEKENDS AT JADE LOOK LIKE"
        title="Jade Weekends"
        slides={weekendSlides}
        ctaText="BOOK JADE WEEKEND"
      />

      {/* SECTION 4: CURATED EXPERIENCES */}
      <EnhanceYourStaySection />

      {/* SECTION 5: WHY CHOOSE JADE */}
      <WhyChooseJadeSection />

      {/* SECTION 6: THEMED VILLAS */}
      <VillasCarouselSection
        label="OUR VILLAS"
        title={
          <>
            Themed Villas
            <br />
            By Jade
          </>
        }
        villas={themedVillas}
        ctaText="VIEW ALL VILLA RETREATS"
      />

      <Footer />
    </main>
  );
}

function EnhanceYourStaySection() {
  const experiences = [
    { title: "Bonfire Nights", image: "/assets/bonfire_exp.png" },
    { title: "BBQ Evenings", image: "/assets/bbq_exp.png" },
    { title: "Movie Under the Stars", image: "/assets/movie_exp.png" },
    { title: "Candlelight Dinner", image: "/assets/dinner_exp.png" },
    { title: "Outdoor Games", image: "/assets/games_exp.png" },
    { title: "Live Music / DJ", image: "/assets/music_exp.png" },
    { title: "Private Chef Experience", image: "/assets/chef_exp.png" },
    { title: "Poolside Celebrations", image: "/assets/poolside_exp.png" },
  ];

  return (
    <section className="py-24 bg-[#141517]">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase mb-6">
            CURATED EXPERIENCES
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white">
            Enhance Your Stay
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-square md:aspect-[4/5] overflow-hidden group border border-white/5"
            >
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-center justify-center p-4 text-center">
                <h3 className="text-white text-gh-h3 font-philosopher leading-tight">
                  {exp.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyChooseJadeSection() {
  return (
    <PremiumFeaturesSection
      subheading="WHY CHOOSE JADE"
      heading="Designed for Private Weekend Escapes"
      cards={[
        {
          tag: "provide",
          title: "PRIVATE VILLAS",
          desc: "Stay in fully private villas designed for relaxed getaways, with no shared spaces and complete freedom to enjoy your time.",
        },
        {
          tag: "create",
          title: "ROOM TO UNWIND",
          desc: "Spacious lawns, private pools, and open settings that make it easy to slow down and enjoy the weekend.",
        },
        {
          tag: "customise",
          title: "YOUR EXPERIENCE",
          desc: "Add bonfires, BBQ nights, movie screenings, or curated dining experiences to make your getaway truly memorable.",
        },
        {
          tag: "host",
          title: "SEAMLESS STAYS",
          desc: "From check-in to curated experiences, our team ensures your weekend getaway is effortless and well taken care of.",
        },
      ]}
      footerText="Private villas and curated experiences designed to make every weekend feel like an escape."
      ctaText="PLAN YOUR WEEKEND ESCAPE"
      ctaLink="/contact"
    />
  );
}

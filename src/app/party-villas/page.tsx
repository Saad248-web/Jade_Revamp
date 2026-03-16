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
  Download,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Users,
  Wifi,
  Coffee,
  Heart,
  Music,
  PartyPopper,
  Sparkles,
} from "lucide-react";
import LiveBackground from "@/components/LiveBackground";
import Footer from "@/components/Footer";
import PartyVillasCarousel from "@/components/PartyVillasCarousel";
import ExperienceHero from "@/components/ExperienceHero";
import ScrollSectionComposer, {
  ScrollSlide,
} from "@/components/ScrollSectionComposer";
import ExperienceCarouselSection from "@/components/ExperienceCarouselSection";

const partySlides = [
  {
    title: "Pool Parties",
    desc: "Celebrate poolside with loungers, BBQ setups, cocktail stations, and vibrant lighting.",
    image: "/assets/poolside_exp.png",
  },
  {
    title: "Bachelor/Bachelorette Parties",
    desc: "Private villas designed for pre-wedding celebrations with music, entertainment, and curated dining.",
    image: "/assets/caravan_journey.png", // Using relevant existing assets
  },
  {
    title: "Reunions & Graduation Parties",
    desc: "Spacious villas perfect for reconnecting, celebrating milestones, and hosting memorable gatherings.",
    image: "/assets/outdoor_dining.png",
  },
  {
    title: "Birthdays & Anniversaries",
    desc: "Host memorable celebrations in beautifully curated villas with décor, dining, music, and private pools.",
    image: "/assets/celebrations_friends.png",
  },
];

const animatedSlides: ScrollSlide[] = [
  {
    label: "CELEBRATIONS, REIMAGINED",
    lines: [
      "Jade's private villas offer the perfect",
      "setting for unforgettable celebrations.",
      "Whether it's a birthday, anniversary,",
      "pool party, or reunion with friends,",
      "each space is designed for private",
      "gatherings with curated setups, great",
      "music, and moments worth celebrating.",
    ],
  },
];

export default function PartyVillasPage() {
  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <CorporateHeader />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        backgroundImage="/assets/celebrations_friends.png"
        backgroundAlt="Party Villas"
        heading={
          <>
            Celebrate in Style with
            <br />
            Jade Party Villas
          </>
        }
        description="Host birthdays, pool parties, reunions or milestone celebrations in exclusive Jade villas with private pools, curated setups & personalized experiences."
        buttons={[
          {
            icon: <Calendar className="w-5 h-5" />,
            label: "VENUES",
            onClick: () => {
              const venuesSection = document.getElementById(
                "spaces-for-celebrations",
              );
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

      {/* SECTION 3: PARTY TYPES CAROUSEL */}
      <ExperienceCarouselSection
        label="WHAT WE OFFER"
        title="Party Types"
        slides={partySlides}
        ctaText="BOOK A PARTY VILLA"
        aspectClass="aspect-[343/531]"
        buttonContainerClassName="h-[54px]"
      />

      {/* SECTION 4: CURATED EXPERIENCES */}
      <CuratedExperiencesSection />

      {/* SECTION 5: SPACES MADE FOR CELEBRATIONS */}
      <SpacesForCelebrationsSection />

      {/* SECTION 6: FEATURED PARTY VILLAS */}
      <PartyVillasCarousel />

      <Footer />
    </main>
  );
}

function CuratedExperiencesSection() {
  const experiences = [
    { title: "DJ & Music Setup", image: "/assets/music_exp.png" },
    { title: "BBQ & Live Grills", image: "/assets/bbq_exp.png" },
    { title: "Cocktail Bar Setup", image: "/assets/poolside_exp.png" },
    { title: "Bonfire Nights", image: "/assets/bonfire_exp.png" },
    { title: "Movie Under the Stars", image: "/assets/movie_exp.png" },
    { title: "Themed Decor & Styling", image: "/assets/dinner_exp.png" },
  ];

  return (
    <section className="py-24 bg-[#141517]">
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase mb-6">
            PERSONALIZE YOUR CELEBRATION
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white">
            Curated Experiences
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
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
                sizes="(max-width: 768px) 50vw, 33vw"
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

function SpacesForCelebrationsSection() {
  return (
    <PremiumFeaturesSection
      subheading="WHY CELEBRATE AT JADE"
      heading="Spaces Made for Celebrations"
      cards={[
        {
          tag: "enjoy",
          title: "PRIVATE PARTY VILLAS",
          desc: "Exclusive villas with private pools and spacious outdoor areas designed for unforgettable celebrations.",
        },
        {
          tag: "customise",
          title: "YOUR CELEBRATION",
          desc: "Tailor décor, dining, and music to match your theme and make your occasion truly yours.",
        },
        {
          tag: "experience",
          title: "EXPERT HOSTING",
          desc: "From planning to execution, our team ensures every detail is taken care of for a seamless event.",
        },
      ]}
      footerText="Private villas and curated experiences designed to make every celebration a masterpiece."
      ctaText="PLAN YOUR CELEBRATION"
      ctaLink="/contact"
    />
  );
}

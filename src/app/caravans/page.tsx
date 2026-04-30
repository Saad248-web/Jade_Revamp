"use client";

import React from "react";
import Image from "next/image";
import CorporateHeader from "@/components/CorporateHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ExperienceHero from "@/components/ExperienceHero";
import ScrollSectionComposer, {
  ScrollSlide,
} from "@/components/ScrollSectionComposer";
import ExperienceCarouselSection from "@/components/ExperienceCarouselSection";
import CaravanUsageSection from "@/components/CaravanUsageSection";
import CaravanJourneySection from "@/components/CaravanJourneySection";
import CuratedExperiencesGrid from "@/components/CuratedExperiencesGrid";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";
import TravelGuidelinesSection from "@/components/TravelGuidelinesSection";
import { Info, Calendar } from "lucide-react";
import { useAnimation } from "@/context/AnimationContext";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_SLIDES = [
  {
    title: "Inside Rathaa",
    desc: "A private lounge designed for relaxed journeys.",
  },
  {
    title: "Comfort On The Road",
    desc: "Convertible sleeping and lounge configurations for small groups.",
  },
  {
    title: "Entertainment",
    desc: "Dual screens, music, and plug-and-play connectivity.",
  },
  {
    title: "Kitchenette",
    desc: "Refreshments and essential utilities throughout the trip.",
  },
  {
    title: "Climate-Controlled Interiors",
    desc: "Air-conditioned comfort across seasons.",
  },
  {
    title: "Capacity",
    desc: "Ideal for 6–8 guests travelling together.",
  },
];

const animatedSlides: ScrollSlide[] = [
  {
    label: "A PRIVATE RETREAT ON WHEELS",
    lines: [
      "Rathaa is a fully equipped luxury caravan designed for small-group journeys.",
      "Combining the comfort of a private stay with the freedom of road travel, it allows you to explore",
      "scenic destinations, celebrate special moments, or simply travel differently.",
      "From short day escapes to overnight and multi-day journeys, every experience is",
      "curated around your route, your group, and your pace.",
    ],
  },
];

export default function CaravansPage() {
  const { setRathaaOverlayOpen, setEnquireOverlayOpen } = useAnimation();
  const [allImages, setAllImages] = useState<string[]>([]);
  const [heroImages, setHeroImages] = useState<string[]>([]);
  const [spaceImages, setSpaceImages] = useState<string[]>([]);
  const [heroIndex, setHeroIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/experiences/caravans/media");
        if (!res.ok) return;
        const data = await res.json();
        const groups = data?.groups || [];
        const hero = (groups.find(
          (g: any) => String(g.folder).toLowerCase() === "1-hero",
        )?.images || []) as string[];
        const spaces = (groups.find(
          (g: any) => String(g.folder).toLowerCase() === "2-spaces",
        )?.images || []) as string[];
        const all = (data?.all || []) as string[];
        if (!cancelled) {
          setHeroImages(hero);
          setSpaceImages(spaces);
          setAllImages(all);
        }
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const caravanSlides = useMemo(() => {
    const imgs = spaceImages.length ? spaceImages : allImages;
    return DEFAULT_SLIDES.map((s, idx) => ({
      ...s,
      image: imgs[idx % Math.max(imgs.length, 1)] || "",
    }));
  }, [spaceImages, allImages]);

  const heroBg = useMemo(
    () => heroImages[0] || allImages[0] || "",
    [heroImages, allImages],
  );

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const id = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 4500);
    return () => clearInterval(id);
  }, [heroImages]);

  const heroSlide = useMemo(() => {
    if (heroImages.length)
      return heroImages[heroIndex % heroImages.length] || "";
    return heroBg;
  }, [heroImages, heroIndex, heroBg]);

  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      <CorporateHeader />
      <MobileBottomNav />

      {/* SECTION 1: HERO SECTION */}
      <ExperienceHero
        key={heroSlide}
        backgroundImage={heroSlide}
        backgroundAlt="Caravans"
        heading={
          <>
            Rathaa By Jade, A
            <br />
            Retreat on the Move
          </>
        }
        description="A private caravan experience designed for curated road journeys, celebrations, and escapes beyond the city."
        buttons={[
          {
            icon: <Info className="w-5 h-5" />,
            label: "KNOW MORE",
            onClick: () => {
              const carouselSection = document.getElementById("the-caravan");
              if (carouselSection)
                carouselSection.scrollIntoView({ behavior: "smooth" });
            },
          },
          {
            icon: <Calendar className="w-5 h-5" />,
            label: "PLAN JOURNEY",
            onClick: () => setRathaaOverlayOpen(true),
          },
        ]}
      />

      {/* SECTION 2: ANIMATED TEXT SECTION */}
      <ScrollSectionComposer slides={animatedSlides} height="300vh" />

      {/* SECTION 3: THE CARAVAN CAROUSEL */}
      <div id="the-caravan">
        <ExperienceCarouselSection
          label="INSIDE THE RATHAA EXPERIENCE"
          title="The Caravan"
          slides={caravanSlides}
          ctaText="BOOK CARAVAN"
          buttonContainerClassName="mt-8"
        />
      </div>

      <CaravanUsageSection />
      <CaravanJourneySection />

      <CuratedExperiencesGrid
        label="CURATED EXPERIENCES"
        title="Enhance Your Stay"
        ctaText="ENQUIRE"
        onCtaClick={() => setEnquireOverlayOpen(true)}
        experiences={caravanSlides.slice(0, 6).map((s) => ({
          title: s.title,
          image: s.image,
        }))}
        innerClassName="max-w-6xl mx-auto px-4 sm:px-6 md:px-8"
        ctaContainerClassName="w-full max-w-xl mx-auto"
      />

      <PremiumFeaturesSection
        subheading="WHY RATHAA"
        heading="Travel Reimagined"
        cards={[
          {
            tag: "experience",
            title: "PRIVATE JOURNEYS",
            desc: "Travel with your group in a fully private caravan, designed for small gatherings, celebrations, and relaxed escapes.",
          },
          {
            tag: "explore",
            title: "CURATED ROUTES",
            desc: "Discover scenic destinations and offbeat stops through thoughtfully designed travel circuits around and beyond the city.",
          },
          {
            tag: "enjoy",
            title: "COMFORT ON THE ROAD",
            desc: "A fully equipped caravan with lounge seating, sleeping spaces, entertainment, and modern travel amenities.",
          },
          {
            tag: "create",
            title: "CUSTOM JOURNEYS",
            desc: "From one-day escapes to overnight retreats and multi-day road trips, every journey can be tailored to your plan.",
          },
        ]}
        footerText="Rathaa turns every road into an experience for those who travel beyond the ordinary."
        ctaText="PLAN YOUR JOURNEY"
        onCtaClick={() => setRathaaOverlayOpen(true)}
        cardClassName="bg-[#363A45]"
        alternateGold={true}
      />

      <TravelGuidelinesSection />

      <Footer />
    </main>
  );
}

"use client";

import React from "react";
import Image from "next/image";
import JadeImage from "@/components/ui/JadeImage";
import { Play, ArrowRight, ArrowLeft } from "lucide-react";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";
import LiveBackground from "@/components/LiveBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import GlassStatsBanner from "@/components/GlassStatsBanner";
import TrustedBySection from "@/components/TrustedBySection";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useAnimation } from "@/context/AnimationContext";
import {
  CAROUSEL_CROSSFADE,
  usePreloadNeighborImages,
} from "@/lib/carouselMotion";
import {
  heroSplitCardVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";
import CarouselSwipeLayer from "@/components/ui/CarouselSwipeLayer";

const OFFERINGS = [
  {
    title: "Weekend Getaways",
    description:
      "A day or two with your friends and family away from the bustling city in the wilderness is truly on everyone's wishlist.",
    image: "/Experiences/Weekend Getaways/1-Hero/casual stays.webp",
  },
  {
    title: "Corporate Retreats",
    description:
      "Private venues designed for focused sessions, team alignment, and meaningful downtime.",
    image: "/Experiences/Corporate Retreats/1-Hero/xhero.webp",
  },
  {
    title: "Weddings",
    description:
      "Bespoke celebrations in curated settings that make your special day truly unforgettable.",
    image: "/Experiences/Weddings/1-Hero/2 (1).webp",
  },
  {
    title: "Party Villas",
    description:
      "Host birthdays, pool parties, reunions or milestone celebrations in exclusive Jade VILLAS.",
    image: "/Experiences/Party Villas/1-Hero/Pool Parties.webp",
  },
];

const TEAM_PLACEHOLDERS = [
  { initials: "AK", name: "Aakansh Kundi", role: "Director" },
  { initials: "JK", name: "Leadership", role: "Operations" },
  { initials: "JH", name: "Leadership", role: "Hospitality" },
  { initials: "JD", name: "Leadership", role: "Experiences" },
] as const;

export default function AboutPage() {
  const { setPartnerOverlayOpen } = useAnimation();
  const [currentOffering, setCurrentOffering] = React.useState(0);
  const [offeringDirection, setOfferingDirection] = React.useState(0);
  const reducedMotion = useReducedMotion();
  const [hoverPreviewSrc, setHoverPreviewSrc] = React.useState<string | null>(
    null,
  );

  const offeringCarouselCustom: HeroSplitCustom = {
    dir: offeringDirection,
    lowFx: !!reducedMotion,
  };

  const nextOffering = () => {
    setOfferingDirection(1);
    setCurrentOffering((prev) => (prev + 1) % OFFERINGS.length);
  };
  const prevOffering = () => {
    setOfferingDirection(-1);
    setCurrentOffering(
      (prev) => (prev - 1 + OFFERINGS.length) % OFFERINGS.length,
    );
  };

  const offering = OFFERINGS[currentOffering];

  usePreloadNeighborImages(
    OFFERINGS.map((o) => o.image),
    currentOffering,
  );

  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-16 lg:pb-0">
      {/* ── Navigation ── */}
      <Navbar />
      <MobileBottomNav />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-end pb-20 overflow-hidden">
        {/* Live Background */}
        <div className="absolute inset-0 z-0">
          <LiveBackground />
          {/* Subtle gradient overlay instead of solid black/40 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 relative w-16 h-16 md:w-24 md:h-24">
            <Image
              src="/assets/Golden_Logo.png"
              alt="Jade Logo"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          <h2 className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-2">
            ABOUT JADEHOSPITAINMENT
          </h2>

          <h1 className="text-gh-h1 font-philosopher text-white mb-3 leading-tight">
            Curated VILLAS.
            <br />
            Thoughtfully Operated.
          </h1>

          <p className="text-white/80 font-manrope text-gh-body max-w-2xl leading-relaxed mb-5">
            Where hospitality and experience go beyond conventional listing
            platforms.
          </p>

          {/* Stats Bar (Figma Accurate & Responsive) */}
          <GlassStatsBanner
            stats={[
              { value: "16", label: "LUXURY VILLA" },
              { value: "7500+", label: "CHECK-INS" },
              { value: "100+", label: "EVENTS HOSTED" },
            ]}
          />
        </div>
      </section>

      {/* 2. TRUSTED BY SECTION */}
      <TrustedBySection />

      {/* 3. OUR STORY SECTION */}
      <section className="jade-section bg-jade-charcoal relative overflow-hidden">
        {/* Background Pattern Overlay (Optional subtle texture) */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h3 className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-6">
            OUR STORY
          </h3>

          <div className="text-white/90 font-manrope text-gh-body leading-relaxed mb-12 text-center">
            <p>
              Founded in 2011 under Jade Retreats, Jade Hospitainment created
              exclusive private retreat experiences, starting with one of
              Bengaluru's most sought-after vacation homes. Jade expanded beyond
              stays, transforming VILLAS and farmhouses into curated retreats
              across hospitality and experience. Today, Jade operates a growing
              portfolio of private retreats for getaways, celebrations, and
              corporate offsites.
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="relative aspect-video w-full bg-black/40 border border-[#EFCD62]/20 rounded-none overflow-hidden group cursor-pointer shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

            {/* Logo/Play Button Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="relative w-20 h-20 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
                <Image
                  src="/assets/Golden_Logo.png"
                  alt="Jade Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="w-16 h-16 rounded-full border border-[#EFCD62] flex items-center justify-center bg-black/20 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                <Play className="w-6 h-6 text-[#EFCD62] fill-[#EFCD62]" />
              </div>
              <span className="text-[#EFCD62]/60 text-gh-label tracking-[0.3em] font-light uppercase mt-2">
                Hospitainment
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY JADE SECTION */}
      <PremiumFeaturesSection
        subheading="WHY JADE"
        heading="Because how you operate matters"
        cardsLayout="scroll"
        cards={[
          {
            tag: "operate",
            title: "BY INTENT",
            desc: "Private Villas are thoughtfully positioned and operated with clarity around how they are meant to be experienced, whether for stays, celebrations, or retreats.",
          },
          {
            tag: "curate",
            title: "THROUGH CARE",
            desc: "Each property and experience is carefully curated based on its character, setting & suitability, ensuring the right fit for every occasion.",
          },
          {
            tag: "guide",
            title: "WITH CLARITY",
            desc: "From selecting the right villa to shaping the overall experience, Jade provides clear guidance so every stay or gathering unfolds smoothly.",
          },
          {
            tag: "host",
            title: "IN RESPONSIBILITY",
            desc: "Spaces are managed with long-term care in mind, balancing guest experience with respect for the property, its surroundings, and its people.",
          },
        ]}
        footerText="Bringing unique VILLAS and curated experiences together under one standard of hospitality."
        ctaText="PARTNER WITH JADE"
        onCtaClick={() => setPartnerOverlayOpen(true)}
        alternateGold={true}
      />

      {/* 5. WHAT WE DO SECTION (Offering Carousel) */}
      <section className="relative bg-[#1A1C1E] py-10 md:py-12 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col">
          {/* Header & Nav */}
          <div className="flex justify-between items-end mb-6 md:mb-10">
            <div>
              <h3 className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-2.5 font-manrope">
                WHAT WE DO
              </h3>
              <h2 className="text-gh-h2 font-philosopher text-white leading-none">
                Our Offering
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={prevOffering}
                className="w-10 h-10 md:w-12 md:h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all group"
              >
                <ArrowLeft className="w-5 h-5 group-active:scale-90 transition-transform" />
              </button>
              <button
                onClick={nextOffering}
                className="w-10 h-10 md:w-12 md:h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all group"
              >
                <ArrowRight className="w-5 h-5 group-active:scale-90 transition-transform" />
              </button>
            </div>
          </div>

          {/* Carousel Slide */}
          <div
            className="relative w-full h-[clamp(320px,50svh,540px)] md:h-[clamp(380px,55svh,700px)] lg:h-[clamp(420px,58svh,820px)] rounded-none overflow-hidden group mx-auto"
            style={{ perspective: "1500px" }}
          >
            <AnimatePresence mode="sync" initial={false} custom={offeringCarouselCustom}>
              <motion.div
                key={currentOffering}
                custom={offeringCarouselCustom}
                variants={heroSplitCardVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0 w-full h-full border border-white/10"
                style={{ willChange: "transform" }}
              >
                {/* Background Image with Overlay */}
                <div className="absolute inset-0">
                  <Image
                    src={offering.image}
                    alt={offering.title}
                    fill
                    className="object-cover"
                    priority={currentOffering === 0}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent" />
                  <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:18px_18px]" />
                </div>

                <div className="absolute inset-0 flex flex-col items-start justify-center p-8 md:p-16 lg:p-24 text-left max-w-4xl">
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.06,
                      duration: CAROUSEL_CROSSFADE.duration,
                      ease: CAROUSEL_CROSSFADE.ease,
                    }}
                    className="text-gh-h2 font-philosopher text-white mb-3"
                  >
                    {offering.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: 0.1,
                      duration: CAROUSEL_CROSSFADE.duration,
                      ease: CAROUSEL_CROSSFADE.ease,
                    }}
                    className="text-white/80 max-w-xl font-manrope text-gh-body leading-relaxed"
                  >
                    {offering.description}
                  </motion.p>
                </div>
              </motion.div>
            </AnimatePresence>
            <CarouselSwipeLayer
              onPrev={prevOffering}
              onNext={nextOffering}
              slideCount={OFFERINGS.length}
              className="absolute inset-0 z-[8] touch-pan-y cursor-grab active:cursor-grabbing"
            />
          </div>
        </div>
      </section>

      {/* 6. MEET THE TEAM SECTION (Hidden for now)
      <section className="py-fluid-lg md:py-fluid-xl bg-[#1A1C1E] relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-100">
          <LiveBackground />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-12">
          <h3 className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-3">
            MEET THE TEAM
          </h3>
          <h2 className="text-gh-h2 font-philosopher text-white mb-5">
            The Faces of Hospitainment
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto font-manrope text-gh-body">
            Seasoned leadership with hands-on experience across hospitality,
            events, and operations.
          </p>
        </div>

        <div className="relative z-10 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          <div className="flex overflow-x-auto gap-5 pb-6 no-scrollbar snap-x snap-mandatory pr-12 md:pr-24 lg:pr-[30vw]">
            {TEAM_PLACEHOLDERS.map((member, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[240px] xs:w-[280px] md:w-[350px] bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 flex flex-col items-center text-center rounded-none snap-center"
              >
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full border-2 border-[#EFCD62]/30 mb-6 flex items-center justify-center bg-gradient-to-br from-white/10 to-white/[0.02] text-[#EFCD62] font-philosopher text-3xl md:text-4xl tracking-wide">
                  {member.initials}
                </div>
                <h4 className="text-white text-gh-body font-bold font-manrope mb-2">
                  {member.name}
                </h4>
                <p className="text-white/40 uppercase tracking-widest text-gh-desc">
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      */}

      {/* 7. MEDIA SECTION */}
      <section className="jade-section bg-[#1A1C1E] !pt-6 md:!pt-8 lg:!pt-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-8 md:mb-10">
            <h3 className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-3">
              MEDIA
            </h3>
            <h2 className="text-gh-h2 font-philosopher text-white mb-5">
              Awards and Recognition
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto font-manrope text-gh-body">
              Recognised by industry platforms, media, and partners for our
              approach to private hospitality and curated experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Unique Media Items */}
            <div
              className="relative aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group cursor-pointer"
              onClick={() =>
                setHoverPreviewSrc("/Awards_and_Recognition/764.webp")
              }
            >
              <Image
                src="/Awards_and_Recognition/764.webp"
                alt="Media"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div
              className="relative aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group cursor-pointer"
              onClick={() =>
                setHoverPreviewSrc("/Awards_and_Recognition/ds.webp")
              }
            >
              <Image
                src="/Awards_and_Recognition/ds.webp"
                alt="Media"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div
              className="relative aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group cursor-pointer"
              onClick={() =>
                setHoverPreviewSrc("/Awards_and_Recognition/msa.webp")
              }
            >
              <Image
                src="/Awards_and_Recognition/msa.webp"
                alt="Media"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Featured Wide Media */}
            <div className="col-span-1 md:col-span-3 pt-3 md:pt-4">
              <div
                className="relative aspect-video w-full bg-white/5 border border-white/10 rounded-none overflow-hidden group cursor-pointer"
                onClick={() =>
                  setHoverPreviewSrc("/Awards_and_Recognition/dsas.webp")
                }
              >
                <Image
                  src="/Awards_and_Recognition/dsas.webp"
                  alt="Media Item"
                  fill
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-philosopher text-gh-h2">
                    Recognized for Excellence in Hospitality
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hover full-image preview (no linking) */}
      <AnimatePresence>
        {hoverPreviewSrc && (
          <motion.div
            key={hoverPreviewSrc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-[2px] cursor-pointer"
            onClick={() => setHoverPreviewSrc(null)}
          >
            <motion.div
              initial={{ scale: 0.98, y: 6 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-[92vw] max-w-5xl aspect-video md:aspect-[16/9] border border-white/15 bg-black/40 overflow-hidden"
            >
              <JadeImage
                src={hoverPreviewSrc}
                alt="Preview"
                fill
                className="object-contain"
                sizes="92vw"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

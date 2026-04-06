"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight, ArrowLeft } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";
import PremiumFeaturesSection from "@/components/PremiumFeaturesSection";
import LiveBackground from "@/components/LiveBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAnimation } from "@/context/AnimationContext";
import GlassStatsBanner from "@/components/GlassStatsBanner";
import { AnimatePresence, motion } from "framer-motion";

const OFFERINGS = [
  {
    title: "Weekend Getaways",
    description:
      "A day or two with your friends and family away from the bustling city in the wilderness is truly on everyone's wishlist.",
    image:
      "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
    link: "/weekend-getaways",
  },
  {
    title: "Corporate Retreats",
    description:
      "Private venues designed for focused sessions, team alignment, and meaningful downtime.",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600",
    link: "/corporate-retreats",
  },
  {
    title: "Weddings",
    description:
      "Bespoke celebrations in curated settings that make your special day truly unforgettable.",
    image: "/X/HAVEN/pool new.webp",
    link: "/weddings",
  },
  {
    title: "Party Villas",
    description:
      "Host birthdays, pool parties, reunions or milestone celebrations in exclusive Jade villas.",
    image: "/X/HAVEN/pool new.webp",
    link: "/party-villas",
  },
];

export default function AboutPage() {
  const { setPartnerOverlayOpen } = useAnimation();
  const [currentOffering, setCurrentOffering] = React.useState(0);

  const nextOffering = () =>
    setCurrentOffering((prev) => (prev + 1) % OFFERINGS.length);
  const prevOffering = () =>
    setCurrentOffering(
      (prev) => (prev - 1 + OFFERINGS.length) % OFFERINGS.length,
    );

  const offering = OFFERINGS[currentOffering];

  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      {/* ── Navigation ── */}
      <Navbar />
      <MobileBottomNav />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-end pb-24 overflow-hidden">
        {/* Live Background */}
        <div className="absolute inset-0 z-0">
          <LiveBackground />
          {/* Subtle gradient overlay instead of solid black/40 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-10 relative w-24 h-24 md:w-32 md:h-32">
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

          <h1 className="text-gh-h1 font-philosopher text-white mb-4 leading-tight">
            Curated Villas.
            <br />
            Thoughtfully Operated.
          </h1>

          <p className="text-white/80 font-manrope text-gh-body max-w-2xl leading-relaxed mb-6">
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
      <section className="min-h-screen flex flex-col items-center justify-center py-24 bg-[#1A1C1E]">
        <div className="max-w-4xl mx-auto px-8 text-center w-full">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-4">
            TRUSTED BY
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white mb-20 leading-tight">
            World-Class <br /> Organizations
          </h2>

          <div className="grid grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
            {/* Logo 1: Google */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <span className="text-white font-manrope text-gh-h3 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Google
              </span>
            </div>
            {/* Logo 2: Microsoft */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <span className="text-white font-manrope text-gh-h3 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Microsoft
              </span>
            </div>
            {/* Logo 3: L&T */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <div className="w-16 h-16 rounded-full border-2 border-white/40 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-manrope text-gh-h3 font-bold italic">
                  L&T
                </span>
              </div>
            </div>
            {/* Logo 4: IBM */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <span className="text-white font-mono text-gh-h2 font-bold tracking-tighter opacity-60 group-hover:opacity-100 transition-opacity">
                IBM
              </span>
            </div>
            {/* Logo 5: Capgemini */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <span className="text-white font-manrope text-gh-h3 font-bold opacity-60 group-hover:opacity-100 transition-opacity">
                Capgemini
              </span>
            </div>
            {/* Logo 6: Mercedes-Benz */}
            <div className="bg-[#1E2023] aspect-square flex items-center justify-center p-8 group border border-white/5 rounded-sm">
              <span className="text-white font-philosopher text-gh-h3 opacity-60 group-hover:opacity-100 transition-opacity">
                Mercedes-Benz
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. OUR STORY SECTION */}
      <section className="py-24 bg-[#0D4032] relative overflow-hidden">
        {/* Background Pattern Overlay (Optional subtle texture) */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
          <h3 className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-8">
            OUR STORY
          </h3>

          <div className="text-white/90 font-manrope text-gh-body leading-relaxed mb-16 text-center">
            <p>
              Founded in 2011 under Jade Retreats, Jade Hospitainment created
              exclusive private retreat experiences, starting with one of
              Bengaluru's most sought-after vacation homes. Jade expanded beyond
              stays, transforming villas and farmhouses into curated retreats
              across hospitality and experience. Today, Jade operates a growing
              portfolio of private retreats for getaways, celebrations, and
              corporate offsites.
            </p>
          </div>

          {/* Video Placeholder */}
          <div className="relative aspect-video w-full bg-black/40 border border-[#EFCD62]/20 rounded-none overflow-hidden group cursor-pointer shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

            {/* Logo/Play Button Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div className="relative w-24 h-24 opacity-80 group-hover:opacity-100 transition-opacity duration-500">
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
        heading={
          <>
            Because how you <br className="hidden md:block" /> operate matters
          </>
        }
        cards={[
          {
            tag: "operate",
            title: "BY INTENT",
            desc: "Private villas are thoughtfully positioned and operated with clarity around how they are meant to be experienced, whether for stays, celebrations, or retreats.",
          },
          {
            tag: "curate",
            title: "THE CANVAS",
            desc: "Each space is selected and shaped to host specific moments — from intimate getaways to large-scale celebrations — with the infrastructure and aesthetic to match.",
          },
          {
            tag: "deliver",
            title: "THE EXPERIENCE",
            desc: "End-to-end operations ensure every detail is managed — from booking to checkout — so guests experience seamless, premium hospitality at every touchpoint.",
          },
        ]}
        footerText="Bringing unique villas and curated experiences together under one standard of hospitality."
        ctaText="PARTNER WITH JADE"
        ctaLink="/contact"
      />

      {/* 5. WHAT WE DO SECTION (Offering Carousel) */}
      <section className="relative h-screen min-h-[600px] flex flex-col justify-center bg-[#1A1C1E] py-12 md:py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 w-full flex flex-col h-full">
          {/* Header & Nav */}
          <div className="flex justify-between items-end mb-8 md:mb-12">
            <div>
              <h3 className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-3 font-manrope">
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
          <div className="relative flex-1 max-h-[540px] md:max-h-[700px] lg:max-h-[820px] w-full rounded-none overflow-hidden group min-h-0 mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentOffering}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <Image
                  src={offering.image}
                  alt={offering.title}
                  fill
                  className="object-cover"
                  sizes="100vw"
                  priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                {/* Content Overlay (Matching Image 2) */}
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 md:p-16 text-center max-w-4xl mx-auto pb-12 md:pb-20">
                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-gh-h2 font-philosopher text-white mb-4"
                  >
                    {offering.title}
                  </motion.h3>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-white/70 max-w-xl mb-8 md:mb-12 font-manrope text-gh-body leading-relaxed text-center"
                  >
                    {offering.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Link
                      href={offering.link}
                      className="inline-flex w-fit border border-white/30 bg-white/5 backdrop-blur-sm text-white px-8 py-4 uppercase tracking-widest text-gh-label font-bold hover:bg-white hover:text-black transition-all items-center gap-3"
                    >
                      SEE WHAT A {offering.title.toUpperCase().split(" ")[0]}{" "}
                      LOOKS LIKE <ArrowRight className="w-4 h-4" />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* 6. MEET THE TEAM SECTION */}
      <section className="py-24 bg-[#1A1C1E] relative overflow-hidden">
        {/* Background Animation (Vibrant) */}
        <div className="absolute inset-0 z-0 opacity-100">
          <LiveBackground />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center mb-16">
          <h3 className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-4">
            MEET THE TEAM
          </h3>
          <h2 className="text-gh-h2 font-philosopher text-white mb-6">
            The Faces of Hospitainment
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto font-manrope text-gh-body">
            Seasoned leadership with hands-on experience across hospitality,
            events, and operations.
          </p>
        </div>

        {/* Full-width Slider Bleeding to Right */}
        <div className="relative z-10 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))]">
          <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory pr-12 md:pr-24 lg:pr-[30vw]">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[240px] xs:w-[280px] md:w-[350px] bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 flex flex-col items-center text-center rounded-none snap-center"
              >
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-[#EFCD62]/20 mb-8">
                  <Image
                    src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600"
                    alt="Team Member"
                    fill
                    className="object-cover grayscale"
                  />
                </div>
                <h4 className="text-white text-gh-body font-bold font-manrope mb-2">
                  Aakansh Kundi
                </h4>
                <p className="text-white/40 uppercase tracking-widest text-gh-desc">
                  Director
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. MEDIA SECTION */}
      <section className="py-24 bg-[#1A1C1E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-4">
              MEDIA
            </h3>
            <h2 className="text-gh-h2 font-philosopher text-white mb-6">
              Awards and Recognition
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto font-manrope text-gh-body">
              Recognised by industry platforms, media, and partners for our
              approach to private hospitality and curated experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Row 1 */}
            <div className="relative aspect-square md:aspect-video lg:aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group">
              <Image
                src="/X/Dome Villas/Red Dome/1.webp"
                alt="Media"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative aspect-square lg:aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group">
              <Image
                src="/assets/White_Logo.png"
                alt="Media"
                fill
                className="object-contain p-12 opacity-80 group-hover:scale-110 transition-transform duration-700"
              />
            </div>
            <div className="relative hidden lg:block aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group">
              <Image
                src="/X/Magnolia/14.webp"
                alt="Media"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Row 2 (Featured Wide) */}
            <div className="col-span-2 lg:col-span-3 pb-4">
              <div className="relative aspect-video w-full bg-white/5 border border-white/10 rounded-none overflow-hidden group">
                <Image
                  src="/X/Magnolia/16.webp"
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

            {/* Row 3 */}
            <div className="relative aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600"
                alt="Media"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group">
              <Image
                src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80"
                alt="Media"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative col-span-2 lg:col-span-1 aspect-video lg:aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group">
              <Image
                src="/X/Magnolia/VILLA.webp"
                alt="Media"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

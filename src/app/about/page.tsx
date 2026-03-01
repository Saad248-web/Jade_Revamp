"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import LiveBackground from "@/components/LiveBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useAnimation } from "@/context/AnimationContext";

export default function AboutPage() {
  const { setPartnerOverlayOpen } = useAnimation();

  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      {/* ── Navigation ── */}
      <Navbar />
      <MobileBottomNav />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100svh] w-full flex flex-col items-center justify-center overflow-hidden">
        {/* Live Background */}
        <div className="absolute inset-0 z-0">
          <LiveBackground />
          {/* Subtle gradient overlay instead of solid black/40 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto mt-20">
          {/* Logo */}
          <div className="mb-12 relative w-24 h-24 md:w-32 md:h-32">
            <Image
              src="/assets/Golden_Logo.png"
              alt="Jade Logo"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>

          <h2 className="text-[#EFCD62] text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-4">
            ABOUT JADEHOSPITAINMENT
          </h2>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-philosopher text-white mb-6 leading-tight">
            Curated Villas.
            <br />
            Thoughtfully Operated.
          </h1>

          <p className="text-white/80 font-manrope text-base md:text-lg max-w-2xl leading-relaxed mb-16">
            Where hospitality and experience go beyond conventional listing
            platforms.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 md:gap-16 w-full max-w-3xl border border-white/10 bg-white/5 backdrop-blur-sm rounded-none p-6 md:p-8">
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl md:text-4xl font-philosopher text-white">
                16
              </span>
              <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest text-center">
                LUXURY VILLA
              </span>
            </div>
            <div className="flex flex-col items-center gap-1 border-l border-r border-white/10 px-4">
              <span className="text-2xl md:text-4xl font-philosopher text-white">
                7500+
              </span>
              <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest text-center">
                CHECK-INS
              </span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-2xl md:text-4xl font-philosopher text-white">
                100+
              </span>
              <span className="text-white/60 text-[10px] md:text-xs uppercase tracking-widest text-center">
                EVENTS HOSTED
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY SECTION */}
      <section className="py-20 bg-[#1A1C1E] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h3 className="text-[#EFCD62] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            TRUSTED BY
          </h3>
          <h2 className="text-3xl md:text-4xl font-philosopher text-white mb-16">
            World-Class Organizations
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
            {/* Logo 1: Google */}
            <div className="bg-[#25282C] aspect-square flex items-center justify-center p-8 hover:bg-[#2A2D32] transition-colors group">
              <span className="text-white font-manrope text-2xl font-bold group-hover:text-white/80 transition-colors">
                Google
              </span>
            </div>
            {/* Logo 2: Microsoft */}
            <div className="bg-[#25282C] aspect-square flex items-center justify-center p-8 hover:bg-[#2A2D32] transition-colors group">
              <span className="text-white font-manrope text-2xl font-bold group-hover:text-white/80 transition-colors">
                Microsoft
              </span>
            </div>
            {/* Logo 3: L&T */}
            <div className="bg-[#25282C] aspect-square flex items-center justify-center p-8 hover:bg-[#2A2D32] transition-colors group">
              <div className="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center">
                <span className="text-white font-manrope text-xl font-bold italic">
                  L&T
                </span>
              </div>
            </div>
            {/* Logo 4: IBM */}
            <div className="bg-[#25282C] aspect-square flex items-center justify-center p-8 hover:bg-[#2A2D32] transition-colors group">
              <span className="text-white font-mono text-4xl font-bold tracking-tighter group-hover:text-white/80 transition-colors">
                IBM
              </span>
            </div>
            {/* Logo 5: Capgemini */}
            <div className="bg-[#25282C] aspect-square flex items-center justify-center p-8 hover:bg-[#2A2D32] transition-colors group">
              <span className="text-white font-manrope text-2xl font-bold group-hover:text-white/80 transition-colors">
                Capgemini
              </span>
            </div>
            {/* Logo 6: Mercedes-Benz */}
            <div className="bg-[#25282C] aspect-square flex items-center justify-center p-8 hover:bg-[#2A2D32] transition-colors group">
              <span className="text-white font-philosopher text-2xl group-hover:text-white/80 transition-colors">
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
          <h3 className="text-[#EFCD62] text-xs font-bold tracking-[0.2em] uppercase mb-8">
            OUR STORY
          </h3>

          <div className="space-y-6 text-white/90 font-manrope text-lg md:text-xl leading-relaxed mb-16">
            <p>
              Founded in 2011 under Jade Retreats, Jade Hospitainment created
              exclusive private retreat experiences, starting with one of
              Bengaluru's most sought-after vacation homes.
            </p>
            <p>
              Jade expanded beyond stays, transforming villas and farmhouses
              into curated retreats across hospitality and experience. Today,
              Jade operates a growing portfolio of private retreats for
              getaways, celebrations, and corporate offsites.
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
              <span className="text-[#EFCD62]/60 text-xs tracking-[0.3em] font-light uppercase mt-2">
                Hospitainment
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. WHY JADE SECTION */}
      <section className="py-24 bg-[#1A1C1E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-[#EFCD62] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              WHY JADE
            </h3>
            <h2 className="text-3xl md:text-5xl font-philosopher text-white">
              Because how you <br className="hidden md:block" />
              operate matters
            </h2>
          </div>

          <div className="flex overflow-x-auto gap-6 mb-16 pb-4 md:pb-0 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0 no-scrollbar">
            {/* Card 1 */}
            <div className="flex-shrink-0 w-[85vw] md:w-[45%] aspect-[4/5] relative bg-gradient-to-br from-[#4A4B4F] to-[#25282C] p-8 md:p-12 flex flex-col justify-center rounded-none overflow-hidden group snap-center">
              {/* Grainy Texture Overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: "url(/assets/Noise.png)" }}
              />

              <div className="relative z-10">
                <span className="font-philosopher text-white/80 text-xl italic mb-2 block">
                  operate
                </span>
                <h3 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-none">
                  BY <br /> INTENT
                </h3>
                <p className="text-white/70 font-manrope text-sm md:text-base leading-relaxed mt-12 max-w-sm">
                  Private villas are thoughtfully positioned and operated with
                  clarity around how they are meant to be experienced, whether
                  for stays, celebrations, or retreats.
                </p>
                <span className="text-white/40 text-sm mt-4 block">curate</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex-shrink-0 w-[85vw] md:w-[45%] aspect-[4/5] relative bg-gradient-to-br from-[#4A4B4F] to-[#25282C] p-8 md:p-12 flex flex-col justify-center rounded-none overflow-hidden group snap-center">
              {/* Grainy Texture Overlay */}
              <div
                className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
                style={{ backgroundImage: "url(/assets/Noise.png)" }}
              />

              <div className="relative z-10">
                <span className="font-philosopher text-white/80 text-xl italic mb-2 block">
                  curate
                </span>
                <h3 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-none">
                  THE <br /> CANVAS
                </h3>
                <p className="text-white/70 font-manrope text-sm md:text-base leading-relaxed mt-12 max-w-sm">
                  Private villas are thoughtfully positioned and operated with
                  clarity around how they are meant to be experienced, whether
                  for stays, celebrations, or retreats.
                </p>
                <span className="text-white/40 text-sm mt-4 block">curate</span>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="flex flex-col items-center text-center gap-6">
            <p className="text-white/60 font-manrope font-light">
              Bringing unique villas and curated experiences together
              <br />
              under one standard of hospitality.
            </p>
            <button
              onClick={() => setPartnerOverlayOpen(true)}
              className="bg-[#EFCD62] text-black font-bold uppercase tracking-widest text-sm px-8 py-4 w-full md:w-auto min-w-[300px] hover:bg-white transition-colors flex items-center justify-center gap-2 rounded-none"
            >
              PARTNER WITH JADE <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. WHAT WE DO SECTION */}
      <section className="py-24 bg-[#1A1C1E]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h3 className="text-[#EFCD62] text-xs font-bold tracking-[0.2em] uppercase mb-4">
                WHAT WE DO
              </h3>
              <h2 className="text-3xl md:text-5xl font-philosopher text-white">
                Our Offering
              </h2>
            </div>
            <div className="hidden md:flex gap-1">
              <button className="w-12 h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 rounded-none bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all">
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="relative aspect-[3/4] md:aspect-video w-full rounded-none overflow-hidden group">
            <Image
              src="/assets/Bathing_Girls.png"
              alt="Weekend Getaways"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-end p-8 md:p-16 text-center">
              <h3 className="text-3xl md:text-5xl font-philosopher text-white mb-4">
                Weekend Getaways
              </h3>
              <p className="text-white/70 max-w-xl mb-10 font-manrope text-sm md:text-base leading-relaxed text-justify">
                A day or two with your friends and family away from the bustling
                city in the wilderness is truly on everyone's wishlist.
              </p>
              <button className="border border-white/30 bg-white/5 backdrop-blur-sm text-white px-8 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-all flex items-center gap-3">
                SEE WHAT A GETAWAY LOOKS LIKE <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. MEET THE TEAM SECTION */}
      <section className="py-24 bg-[#1A1C1E] relative overflow-hidden">
        {/* Background Animation (Vibrant) */}
        <div className="absolute inset-0 z-0 opacity-100">
          <LiveBackground />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <h3 className="text-[#EFCD62] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            MEET THE TEAM
          </h3>
          <h2 className="text-3xl md:text-5xl font-philosopher text-white mb-6">
            The Faces of Hospitainment
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto mb-16 font-manrope">
            Seasoned leadership with hands-on experience across hospitality,
            events, and operations.
          </p>

          <div className="flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[280px] md:w-[350px] bg-white/5 backdrop-blur-md border border-white/10 p-8 md:p-12 flex flex-col items-center text-center rounded-none snap-center"
              >
                <div className="relative w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-2 border-[#EFCD62]/20 mb-8">
                  <Image
                    src={`/assets/corporate_retreat.png`} // Placeholder for team member
                    alt="Team Member"
                    fill
                    className="object-cover grayscale"
                  />
                </div>
                <h4 className="text-white text-xl md:text-2xl font-bold font-manrope mb-2">
                  Aakansh Kundi
                </h4>
                <p className="text-white/40 uppercase tracking-widest text-[10px] md:text-xs">
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
            <h3 className="text-[#EFCD62] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              MEDIA
            </h3>
            <h2 className="text-3xl md:text-5xl font-philosopher text-white mb-6">
              Awards and Recognition
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto font-manrope">
              Recognised by industry platforms, media, and partners for our
              approach to private hospitality and curated experiences.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Row 1 */}
            <div className="relative aspect-square md:aspect-video lg:aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group">
              <Image
                src="/assets/Dome_Villa.png"
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
                src="/assets/caravan_journey.png"
                alt="Media"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Row 2 (Featured Wide) */}
            <div className="col-span-2 lg:col-span-3 pb-4">
              <div className="relative aspect-video w-full bg-white/5 border border-white/10 rounded-none overflow-hidden group">
                <Image
                  src="/assets/wellness_retreat.png"
                  alt="Media Item"
                  fill
                  className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-x-0 bottom-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-philosopher text-2xl">
                    Recognized for Excellence in Hospitality
                  </p>
                </div>
              </div>
            </div>

            {/* Row 3 */}
            <div className="relative aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group">
              <Image
                src="/assets/corporate_retreat.png"
                alt="Media"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group">
              <Image
                src="/assets/casual_stays.png"
                alt="Media"
                fill
                className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            <div className="relative col-span-2 lg:col-span-1 aspect-video lg:aspect-square bg-white/5 border border-white/10 rounded-none overflow-hidden group">
              <Image
                src="/assets/Magnolia_for_Desktop.png"
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

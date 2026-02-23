"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Home, Download } from "lucide-react";
import { useRef } from "react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";

export default function WeddingHero() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
    >
      <NavbarThemeTrigger theme="white" sectionRef={sectionRef} />
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/Wedding_for_Both.png" // Using existing wedding asset
          alt="Boutique Weddings"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Top Navigation Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 px-6 py-8 md:px-12 md:py-10 flex items-center justify-between">
        <Link
          href="/"
          className="w-10 h-10 flex items-center justify-center rounded-full bg-black/20 backdrop-blur-sm text-white hover:bg-white hover:text-black transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <Link
          href="/contact"
          className="bg-black/20 backdrop-blur-sm hover:bg-jade-gold hover:text-black text-white text-[10px] font-manrope font-semibold tracking-[0.2em] uppercase px-5 py-2.5 border border-white/20 transition-all duration-300"
        >
          Contact Us
        </Link>
      </div>

      {/* Center Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <div className="relative w-16 h-16 md:w-20 md:h-20 mb-10 mx-auto">
            <Image
              src="/assets/White_Logo.png"
              alt="Jade Logo"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 64px, 80px"
            />
          </div>
          <h1 className="font-philosopher text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight">
            Boutique Weddings <br />
            Set in Nature
          </h1>
          <p className="font-manrope text-white/90 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            Private farmhouse and garden estates around Bangalore, designed for
            intimate ceremonies or large, multi-day celebrations.
          </p>
        </motion.div>
      </div>

      {/* Bottom Buttons - Side by Side on Mobile, Elevated to clear Bottom Nav */}
      <div className="absolute bottom-24 md:bottom-12 left-0 right-0 z-10 flex flex-row items-center justify-center gap-4 px-6 md:px-12">
        <button className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-manrope text-[10px] md:text-xs tracking-[0.2em] uppercase px-4 py-4 md:px-8 md:py-5 w-1/2 md:w-auto hover:bg-[#EFCD62] hover:text-black transition-all group">
          <Home className="w-4 h-4" />
          <span>Venues</span>
        </button>
        <button className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-manrope text-[10px] md:text-xs tracking-[0.2em] uppercase px-4 py-4 md:px-8 md:py-5 w-1/2 md:w-auto hover:bg-[#EFCD62] hover:text-black transition-all group">
          <Download className="w-4 h-4" />
          <span>Brochure</span>
        </button>
      </div>
    </section>
  );
}

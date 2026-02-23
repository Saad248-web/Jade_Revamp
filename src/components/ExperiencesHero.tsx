"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useRef } from "react";
import LiveBackground from "./LiveBackground";
import NavbarThemeTrigger from "./NavbarThemeTrigger";

export default function ExperiencesHero() {
  const sectionRef = useRef<HTMLElement>(null);
  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-[#050505] flex flex-col justify-center items-center text-center px-6"
    >
      <NavbarThemeTrigger theme="golden" sectionRef={sectionRef} />
      {/* Background Elements - Minimal & Deep */}
      {/* Live Background */}
      <div className="absolute inset-0 z-0">
        <LiveBackground />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
        {/* Label */}
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-[#EFCD62] text-xs md:text-sm font-manrope font-bold tracking-[0.25em] uppercase mb-8"
        >
          EXPERIENCES
        </motion.span>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="font-philosopher text-5xl md:text-7xl lg:text-8xl text-white mb-8 leading-tight tracking-tight"
        >
          Moments <br className="hidden md:block" /> Thoughtfully Hosted
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="font-manrope text-white/70 text-sm md:text-lg max-w-xl leading-relaxed"
        >
          A collection of curated experiences designed across Jade’s private
          villas and distinctive settings.
        </motion.p>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1, ease: "easeOut" }}
        onClick={() => {
          document.getElementById("experiences-list")?.scrollIntoView({
            behavior: "smooth",
          });
        }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-20 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <div className="w-[1px] h-12 bg-white/20" />
        <span className="text-[10px] text-white/40 font-manrope tracking-[0.2em] uppercase">
          SCROLL TO EXPERIENCES
        </span>
      </motion.div>
    </section>
  );
}

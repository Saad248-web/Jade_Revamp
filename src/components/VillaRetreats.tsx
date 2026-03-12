"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import LiveBackground from "./LiveBackground";

export default function VillaRetreats() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax for Background Elements
  const yBg = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]);

  // Animation Variants
  const containerReveal = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2,
      },
    },
  };

  const lineReveal = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const buttonReveal = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.0,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.8,
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A] py-24 md:py-32"
    >
      {/* Background Layer (Parallax) */}
      {/* Background Layer (Live) */}
      <LiveBackground />

      {/* Content Container */}
      <motion.div
        style={{ y: yText }}
        className="relative z-10 max-w-5xl px-6 md:px-12 mx-auto text-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        variants={containerReveal}
      >
        {/* Main Heading */}
        <h2 className="font-philosopher text-gh-h1 leading-[1.1] md:leading-[1.1] text-white/90 mb-12">
          <div className="overflow-hidden">
            <motion.div variants={lineReveal}>
              Private villa's transform into
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div variants={lineReveal}>
              venues for celebration,
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div variants={lineReveal}>
              immersive retreats, and
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div variants={lineReveal}>
              bespoke gatherings, adapting
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div variants={lineReveal}>
              to the moment they are meant
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div variants={lineReveal}>to host.</motion.div>
          </div>
        </h2>

        {/* CTA Button */}
        <div className="overflow-hidden">
          <motion.div variants={buttonReveal}>
            <Link
              href="#villas"
              className="inline-flex items-center gap-3 text-jade-gold font-manrope text-gh-label tracking-widest uppercase hover:text-white transition-colors group"
            >
              VIEW ALL VILLA RETREATS
              <svg
                className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Vertical Line */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent to-white/10" />
    </section>
  );
}

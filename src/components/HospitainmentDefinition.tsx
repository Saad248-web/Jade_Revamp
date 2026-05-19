"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LiveBackground from "./LiveBackground";

export default function HospitainmentDefinition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax for Background Elements
  const yBg = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "-5%"]); // Subtle text parallax

  // Animation Variants
  const containerReveal = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
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
        ease: [0.22, 1, 0.36, 1], // Cinematic easeOut
      },
    },
  };

  const subtextReveal = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.4,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.6, // Start after heading
      },
    },
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#0A0A0A] py-20 md:py-24"
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
        {/* Main Definition Heading */}
        <h2
          className="font-philosopher text-gh-h1 leading-[1.1] md:leading-[1.1] text-white/90"
          style={{ marginBottom: "clamp(15.4px, 3.2vw, 30.7px)" }}
        >
          {/* Split into lines for animation */}
          <div className="overflow-hidden">
            <motion.div variants={lineReveal}>
              Hospitainment is the art of
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div variants={lineReveal}>
              hosting experiences not just
            </motion.div>
          </div>
          <div className="overflow-hidden">
            <motion.div variants={lineReveal}>stays.</motion.div>
          </div>
        </h2>

        {/* Subtext */}
        <div className="overflow-hidden">
          <motion.p
            variants={subtextReveal}
            className="font-manrope text-gh-scroll text-white/60 font-light max-w-3xl mx-auto leading-relaxed"
          >
            At Jade, hospitality sets the foundation and
            <br className="hidden md:block" /> entertainment activates the
            space.
          </motion.p>
        </div>
      </motion.div>

      {/* Decorative Vertical Line connecting sections */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-[1px] h-24 bg-gradient-to-b from-transparent to-white/10" />
    </section>
  );
}

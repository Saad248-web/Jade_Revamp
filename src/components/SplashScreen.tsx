"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAnimation } from "@/context/AnimationContext";

export default function SplashScreen() {
  const { isSplashComplete, setSplashComplete } = useAnimation();
  const [stage, setStage] = useState(0);

  // Sequence
  useEffect(() => {
    const sequence = async () => {
      await new Promise((r) => setTimeout(r, 500));
      setStage(1); // Enter
      await new Promise((r) => setTimeout(r, 2500)); // Read time
      setStage(2); // Exit Text
      await new Promise((r) => setTimeout(r, 800)); // Exit duration
      setStage(3); // Expand Curtain
      // Stage 3 completion triggers setSplashComplete via onComplete in motion.div
    };
    sequence();
  }, []);

  // Completion trigger
  useEffect(() => {
    if (stage === 4) setSplashComplete(true);
  }, [stage, setSplashComplete]);

  // Variants
  const containerVars = {
    initial: { y: "100%", opacity: 0 },
    enter: {
      y: "0%",
      opacity: 1,
      transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] },
    },
    exit: {
      y: "-50%",
      opacity: 0,
      transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
    },
  };

  const itemVars = {
    initial: { y: "100%" },
    enter: { y: "0%", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } },
    exit: {
      y: "-100%",
      transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
    },
  };

  if (isSplashComplete) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center pointer-events-none">
      {/* Layer 0: Dark Background (Charcoal) */}
      <div className="absolute inset-0 bg-[#25282C] z-0" />

      {/* Layer 1: Text & Logo Stack */}
      <AnimatePresence mode="wait">
        {(stage === 1 || stage === 2) && (
          <motion.div
            className="relative z-10 flex flex-col items-center justify-center space-y-6 md:space-y-8"
            initial="initial"
            animate={stage === 1 ? "enter" : "exit"}
            variants={containerVars}
          >
            {/* 1. Intro Text */}
            <div className="overflow-hidden">
              <motion.p
                variants={itemVars}
                className="text-xs md:text-sm font-manrope tracking-[0.2em] text-white/60 uppercase"
              >
                Step into the world of
              </motion.p>
            </div>

            {/* 2. Main Title Group */}
            <div className="flex flex-col items-center -space-y-2 md:-space-y-4">
              <div className="overflow-hidden">
                <motion.h1
                  variants={itemVars}
                  className="text-6xl md:text-8xl font-philosopher text-white text-center leading-tight"
                >
                  Jade
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={itemVars}
                  className="text-4xl md:text-6xl font-philosopher text-white/90 text-center"
                >
                  Hospitainment
                </motion.h2>
              </div>
            </div>

            {/* 3. Logo Icon (Bottom) */}
            <div className="overflow-hidden pt-4">
              <motion.div
                variants={itemVars}
                className="relative w-16 h-16 md:w-24 md:h-24"
              >
                <Image
                  src="/assets/Golden_Logo.png"
                  alt="Jade Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Layer 2: Expanding Square Curtain */}
      <motion.div
        className="absolute z-20 overflow-hidden bg-black"
        initial={{ width: "300px", height: "0px", bottom: 0 }}
        animate={
          stage >= 3
            ? { width: "100%", height: "100%", bottom: 0 }
            : { width: "300px", height: "0px", bottom: 0 }
        }
        transition={{
          duration: 1.4,
          ease: [0.76, 0, 0.24, 1],
          delay: stage === 3 ? 0.1 : 0,
          onComplete: () => {
            if (stage === 3) setSplashComplete(true);
          },
        }}
        style={{ originY: 1 }}
      >
        {/* Parallax Image */}
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 1.15, y: "15%" }}
          animate={
            stage >= 3 ? { scale: 1, y: "0%" } : { scale: 1.15, y: "15%" }
          }
          transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
        >
          <Image
            src="/assets/desktop-bg.jpg"
            alt="Hero Background"
            fill
            className="object-cover opacity-90"
            style={{ objectPosition: "center" }} // Default center cropping usually works best
            priority
          />
          {/* Gradient Overlay - Darker for text readability */}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30" />
        </motion.div>

        {/* Hero Text Reveal - Removed */}
      </motion.div>
    </div>
  );
}

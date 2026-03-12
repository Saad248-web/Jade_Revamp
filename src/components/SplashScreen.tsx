"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAnimation } from "@/context/AnimationContext";

export default function SplashScreen() {
  const { isSplashComplete, setSplashComplete } = useAnimation();
  const [stage, setStage] = useState(0);

  // --- Sequence Logic ---
  useEffect(() => {
    const sequence = async () => {
      // 1. Start Delay
      await new Promise((r) => setTimeout(r, 200));
      setStage(1); // ACTION: Text moves to Mid + Curtain Opens to Teaser

      // 2. Reading Time (Wait for text to settle)
      await new Promise((r) => setTimeout(r, 2500));
      setStage(2); // ACTION: Text Fades Out (Curtain WAITS)

      // 3. Text Exit + The "Hold"
      // Text exit animation takes 800ms.
      // We want a 400ms hold after that.
      // Total wait = 1200ms.
      await new Promise((r) => setTimeout(r, 1200));

      setStage(3); // ACTION: Curtain Expands to Full Screen
    };

    sequence();
  }, []);

  // --- Completion Handler ---
  const handleAnimationComplete = (definition: any) => {
    // Only trigger completion when the Curtain is fully expanded (Stage 3)
    if (stage === 3) {
      setSplashComplete(true);
    }
  };

  // --- Curtain Variants ---
  const curtainVariants = {
    initial: { width: "0vw", height: "0vh" },
    teaser: {
      width: "35vw",
      height: "35vh",
      transition: { duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.4 },
    },
    full: {
      width: "100vw", // Expands to fill screen
      height: "100vh",
      transition: { duration: 2.0, ease: "easeInOut" },
    },
  };

  // --- Text Variants ---
  const textContainerVars = {
    initial: { opacity: 1 },
    enter: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
    exit: {
      opacity: 1,
      transition: {
        staggerChildren: 0,
        staggerDirection: 1,
      },
    },
  };

  const textItemVars = {
    initial: { y: 60, opacity: 0, clipPath: "inset(0 0 0 0)" },
    enter: {
      y: 0,
      opacity: 1,
      clipPath: "inset(0 0 0 0)",
      transition: { duration: 1.0, ease: [0.22, 1, 0.36, 1] },
    },
    exit: {
      y: 0,
      opacity: 1,
      clipPath: "inset(100% 0 0 0)", // Per-line Shutter Close
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (isSplashComplete) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* ------------------------------------------------------- */}
      {/* [ LAYER 0 ] HERO IMAGE (Hidden behind the "Shadow")     */}
      {/* ------------------------------------------------------- */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/assets/desktop-bg.jpg"
          alt="Hero Background"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Optional overlay to darken image slightly for text contrast */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* ------------------------------------------------------- */}
      {/* [ LAYER 1 ] THE TRANSPARENT DIV (Window)                */}
      {/* ------------------------------------------------------- */}
      <motion.div
        className="absolute z-10 bg-transparent rounded-none"
        style={{
          left: "50%",
          bottom: 0,
          x: "-50%",
          // The Magic Shadow that creates the "Curtain"
          boxShadow: "0 0 0 500vmax #25282C",
        }}
        initial="initial"
        animate={
          stage === 0 ? "initial" : stage === 3 ? "full" : "teaser" // Stays at "teaser" during stage 1 & 2
        }
        variants={curtainVariants}
        onAnimationComplete={handleAnimationComplete}
      />

      {/* ------------------------------------------------------- */}
      {/* [ LAYER 2 ] TEXT CONTAINER                              */}
      {/* ------------------------------------------------------- */}
      <AnimatePresence mode="wait">
        {(stage === 1 || stage === 2) && (
          <motion.div
            className="absolute z-20 flex flex-col items-center justify-center space-y-6 md:space-y-8 top-[42%] md:top-1/2 left-1/2"
            style={{ x: "-50%", y: "-50%" }}
            variants={textContainerVars}
            initial="initial"
            animate={stage === 1 ? "enter" : "exit"}
          >
            {/* 1. Intro Label */}
            <div className="overflow-hidden">
              <motion.p
                variants={textItemVars}
                className="text-gh-label font-manrope tracking-[0.2em] text-white/60 uppercase"
              >
                Step into the world of
              </motion.p>
            </div>

            {/* 2. Main Title Group */}
            <div className="flex flex-col items-center -space-y-2 md:-space-y-4">
              <div className="overflow-hidden">
                <motion.h1
                  variants={textItemVars}
                  className="text-gh-h1 font-philosopher text-white text-center leading-tight"
                >
                  Jade
                </motion.h1>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  variants={textItemVars}
                  className="text-gh-h2 font-philosopher text-white/90 text-center"
                >
                  Hospitainment
                </motion.h2>
              </div>
            </div>

            {/* 3. Logo Icon */}
            <div className="overflow-hidden pt-4">
              <motion.div
                variants={textItemVars}
                className="relative w-12 h-12 md:w-20 md:h-20"
              >
                <Image
                  src="/assets/Golden_Logo.png"
                  alt="Jade Logo"
                  fill
                  sizes="(max-width: 768px) 48px, 80px"
                  className="object-contain"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

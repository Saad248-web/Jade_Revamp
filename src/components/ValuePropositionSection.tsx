"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";

const SLIDES = [
  {
    id: 1,
    label: "THE VALUE JADE PROVIDES",
    heading: ["Private villas", "around Bangalore"],
    subtext:
      "Located in serene yet accessible pockets around Bangalore, offering privacy without disconnect.",
    bgImage: "/assets/Jade_735_for_Desktop.png",
    cardImage: "/assets/Bathing_Girls.png",
  },
  {
    id: 2,
    label: "THE VALUE JADE PROVIDES",
    heading: ["Distinctive,", "themed stays"],
    subtext:
      "From luxury pool villas and glass homes to landscaped farm estates and courtyard houses – each space chosen for its character and versatility.",
    bgImage: "/assets/Wedding_for_Both.png",
    cardImage: "/assets/casual_stays.png",
  },
  {
    id: 3,
    label: "THE VALUE JADE PROVIDES",
    heading: ["Built for", "every occasion"],
    subtext:
      "Weddings, corporate offsites, celebrations, wellness retreats, and private getaways – hosted seamlessly within fully private estates.",
    bgImage: "/assets/Jade_735_for_Desktop.png",
    cardImage: "/assets/wedding_for_both.png",
  },
  {
    id: 4,
    label: "THE VALUE JADE PROVIDES",
    heading: ["Designed for comfort", "and aesthetics"],
    subtext:
      "Refined interiors, ambient lighting, modern amenities, and thoughtful layouts that elevate both stays and gatherings.",
    bgImage: "/assets/Bathing_Girls.png",
    cardImage: "/assets/corporate_retreat.png",
  },
];

export default function ValuePropositionSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(textRef, { once: true, amount: 0.3 });

  const currentSlide = SLIDES[currentIndex];

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background parallax (Desktop only)
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  // Feature image parallax
  const imageY = useTransform(scrollYProgress, [0, 1], ["-5%", "5%"]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col"
      style={{ backgroundColor: "#25282C" }}
    >
      <NavbarThemeTrigger theme="white" sectionRef={sectionRef} />
      {/* 
        MOBILE LAYOUT (< 1024px) 
        - Tall background area
        - Text at top
        - Card overlaps bottom green section
        - Arrows flank the card
      */}
      <div className="lg:hidden relative min-h-[92vh] flex flex-col">
        {/* Background Layer */}
        <div className="absolute inset-0 h-full w-full z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 w-full h-full"
            >
              <Image
                src={currentSlide.bgImage}
                alt="Background"
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#25282C]/90" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Text Content (Top Half) */}
        <div className="relative z-10 pt-24 px-6 text-center">
          <motion.p
            key={`label-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-manrope text-gh-label font-bold tracking-[0.2em] uppercase text-[#EFCD62] mb-4"
          >
            {currentSlide.label}
          </motion.p>
          <div className="mb-4">
            {currentSlide.heading.map((line, index) => (
              <motion.h2
                key={`head-${currentIndex}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="font-philosopher text-gh-h2 text-white leading-tight"
              >
                {line}
              </motion.h2>
            ))}
          </div>
          <motion.p
            key={`sub-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-manrope text-gh-body text-white/80 leading-relaxed max-w-sm mx-auto"
          >
            {currentSlide.subtext}
          </motion.p>
        </div>

        {/* Overlapping Card & Controls Section */}
        <div className="mt-auto relative z-20 w-full">
          {/* Green Bottom Bar Background */}
          <div
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{ backgroundColor: "#0D4032" }}
          />

          {/* Card & Arrows Container */}
          <div className="relative px-4 pb-12 flex items-center justify-between max-w-md mx-auto">
            {/* Prev Arrow */}
            <button
              onClick={handlePrev}
              className="p-3 rounded-none bg-white/10 backdrop-blur-sm z-30"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Feature Card (Overlapping) */}
            <motion.div
              key={`card-${currentIndex}`}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-[220px] aspect-[4/3] rounded-none overflow-hidden shadow-2xl z-30 border-2 border-white/10"
            >
              <Image
                src={currentSlide.cardImage}
                alt="Feature"
                fill
                className="object-cover"
                sizes="220px"
              />
            </motion.div>

            {/* Next Arrow */}
            <button
              onClick={handleNext}
              className="p-3 rounded-none bg-white/10 backdrop-blur-sm z-30"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        DESKTOP LAYOUT (>= 1024px) 
        - Strict 100vh premium layout
      */}
      <div className="hidden lg:flex flex-col relative h-[100vh] overflow-hidden">
        {/* Top Area: Background Image & Content (Flex-1) */}
        <div className="relative flex-1 w-full overflow-hidden">
          {/* Background Image with Parallax */}
          <div className="absolute inset-0 w-full h-full z-0">
            <motion.div className="w-full h-[120%]" style={{ y: bgY }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0 w-full h-full"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={currentSlide.bgImage}
                      alt="Background"
                      fill
                      className="object-cover"
                      sizes="100vw"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#25282C]/80 via-transparent to-[#25282C]/40" />
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Desktop Content */}
          <div className="relative z-10 flex flex-col justify-center h-full px-12 xl:px-24 py-8 pointer-events-none">
            <div className="max-w-[1920px] mx-auto w-full grid grid-cols-2 gap-12 xl:gap-16 items-center pointer-events-auto">
              {/* Text Card */}
              <motion.div
                key={`text-desk-${currentIndex}`}
                className="relative p-10 xl:p-12 rounded-lg bg-[#25282C]/95 backdrop-blur-md shadow-2xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <p
                  className="font-manrope text-gh-label tracking-[0.3em] uppercase mb-4 xl:mb-6"
                  style={{ color: "#EFCD62" }}
                >
                  {currentSlide.label}
                </p>
                <div className="mb-4 xl:mb-6">
                  {currentSlide.heading.map((line, index) => (
                    <h2
                      key={index}
                      className="font-philosopher text-gh-h1 text-white leading-tight mb-2"
                    >
                      {line}
                    </h2>
                  ))}
                </div>
                <p className="font-manrope text-gh-body text-white/70 leading-relaxed max-w-lg">
                  {currentSlide.subtext}
                </p>
              </motion.div>

              {/* Feature Image */}
              <div className="relative justify-self-center w-full max-w-[500px]">
                <motion.div
                  key={`img-desk-${currentIndex}`}
                  className="relative w-full aspect-[4/5] max-h-[65vh] rounded-lg overflow-hidden shadow-2xl border border-white/10"
                  style={{ y: imageY }}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <Image
                    src={currentSlide.cardImage}
                    alt="Feature"
                    fill
                    className="object-cover"
                    sizes="50vw"
                    priority
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div
          className="relative shrink-0 z-20 py-4 xl:py-6 px-12 xl:px-24"
          style={{ backgroundColor: "#0D4032" }}
        >
          <div className="max-w-[1920px] mx-auto flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="group p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-none transition-all shadow-md"
            >
              <ChevronLeft className="w-6 h-6 xl:w-8 xl:h-8 text-[#EFCD62] group-hover:scale-110 transition-transform" />
            </button>
            <div className="flex gap-3" />
            <button
              onClick={handleNext}
              className="group p-4 bg-white/5 hover:bg-white/10 backdrop-blur-sm rounded-none transition-all shadow-md"
            >
              <ChevronRight className="w-6 h-6 xl:w-8 xl:h-8 text-[#EFCD62] group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

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
      {/* 
        MOBILE LAYOUT (< 1024px) 
        - Tall background area
        - Text at top
        - Card overlaps bottom green section
        - Arrows flank the card
      */}
      <div className="lg:hidden relative min-h-[85vh] flex flex-col">
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
            className="font-manrope text-xs tracking-[0.2em] uppercase text-[#EFCD62] mb-4"
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
                className="font-philosopher text-4xl text-white leading-tight"
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
            className="font-manrope text-sm text-white/80 leading-relaxed max-w-sm mx-auto"
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
              className="relative w-[220px] aspect-[4/3] rounded-lg overflow-hidden shadow-2xl z-30 border-2 border-white/10"
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

          {/* Dots */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-30">
            {SLIDES.map((_, index) => (
              <div
                key={index}
                className={`w-1.5 h-1.5 rounded-none transition-colors ${
                  index === currentIndex ? "bg-[#EFCD62]" : "bg-white/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 
        DESKTOP LAYOUT (>= 1024px) 
        - Original premium layout (Unchanged logic, just hidden on mobile)
      */}
      <div className="hidden lg:block relative min-h-screen overflow-hidden">
        {/* Background Image with Parallax */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
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
                  <div className="absolute inset-0 bg-gradient-to-b from-[#25282C]/80 via-transparent to-[#0D4032]/90" />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Desktop Content */}
        <div className="relative z-10 flex flex-col justify-center min-h-[85vh] px-24">
          <div className="max-w-[1920px] mx-auto w-full grid grid-cols-2 gap-16 items-center">
            {/* Text Card */}
            <motion.div
              key={`text-desk-${currentIndex}`}
              className="relative p-12 rounded-lg bg-[#25282C]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="font-manrope text-sm tracking-[0.3em] uppercase mb-6"
                style={{ color: "#EFCD62" }}
              >
                {currentSlide.label}
              </p>
              <div className="mb-6">
                {currentSlide.heading.map((line, index) => (
                  <h2
                    key={index}
                    className="font-philosopher text-6xl text-white leading-tight mb-2"
                  >
                    {line}
                  </h2>
                ))}
              </div>
              <p className="font-manrope text-lg text-white/70 leading-relaxed">
                {currentSlide.subtext}
              </p>
            </motion.div>

            {/* Feature Image */}
            <div className="relative">
              <motion.div
                key={`img-desk-${currentIndex}`}
                className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-2xl"
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

        {/* Desktop Navigation */}
        <div
          className="relative z-20 py-6 px-24"
          style={{ backgroundColor: "#0D4032" }}
        >
          <div className="max-w-[1920px] mx-auto flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="group p-4 rounded-none hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-8 h-8 text-[#EFCD62]" />
            </button>
            <div className="flex gap-3">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-none transition-all ${
                    index === currentIndex ? "bg-[#EFCD62]" : "bg-[#AC8831]/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="group p-4 rounded-none hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-8 h-8 text-[#EFCD62]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

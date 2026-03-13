"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import Link from "next/link";

const SERVICES_SLIDES = [
  {
    id: 1,
    label: "ADDITIONAL WEDDING SERVICES",
    heading: ["Décor &", "Styling"],
    subtext:
      "Custom mandaps, stages, floral concepts, lighting, and themed décor designed to adapt to each venue's unique character.",
    bgImage:
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2940&auto=format&fit=crop", // Elegant ceremony
    cardImage:
      "https://images.unsplash.com/photo-1516062423079-7ca13cdc7f5a?q=80&w=2966&auto=format&fit=crop", // Floral
  },
  {
    id: 2,
    label: "ADDITIONAL WEDDING SERVICES",
    heading: ["Catering", "Flexibility"],
    subtext:
      "Diverse catering formats including traditional, regional, and customized menus tailored to your specific taste and heritage.",
    bgImage:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?q=80&w=2787&auto=format&fit=crop", // Gourmet catering
    cardImage:
      "https://images.unsplash.com/photo-1551218808-94e220e0b442?q=80&w=2787&auto=format&fit=crop", // Plated dish
  },
  {
    id: 3,
    label: "ADDITIONAL WEDDING SERVICES",
    heading: ["Photography &", "Videography"],
    subtext:
      "Outdoor and indoor settings, including pre-wedding shoots and full wedding coverage to capture every precious moment.",
    bgImage:
      "https://images.unsplash.com/photo-1537633552985-df0486dec661?q=80&w=2940&auto=format&fit=crop", // Wedding photographer in action
    cardImage:
      "https://images.unsplash.com/photo-1511285560929-1910243285fe?q=80&w=2940&auto=format&fit=crop", // Couple shot
  },
  {
    id: 4,
    label: "ADDITIONAL WEDDING SERVICES",
    heading: ["Music &", "Entertainment"],
    subtext:
      "DJs, live bands, traditional performances, sound systems, and stage configurations to bring your celebration to life.",
    bgImage:
      "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?q=80&w=2787&auto=format&fit=crop", // Live performance
    cardImage:
      "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=2940&auto=format&fit=crop", // Music/Entertainment
  },
];

export default function WeddingServicesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const currentSlide = SERVICES_SLIDES[currentIndex];

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
    setCurrentIndex((prev) =>
      prev === 0 ? SERVICES_SLIDES.length - 1 : prev - 1,
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === SERVICES_SLIDES.length - 1 ? 0 : prev + 1,
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col"
      style={{ backgroundColor: "#25282C" }}
    >
      {/* 
        MOBILE LAYOUT (< 1024px) 
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
        <div className="relative z-10 pt-28 px-6 text-center">
          <motion.p
            key={`label-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-manrope text-gh-label font-bold tracking-[0.3em] uppercase text-[#EFCD62] mb-4"
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
              className="p-3 rounded-none bg-white/10 backdrop-blur-sm z-30 hover:bg-[#EFCD62] hover:text-black transition-all"
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
              className="p-3 rounded-none bg-white/10 backdrop-blur-sm z-30 hover:bg-[#EFCD62] hover:text-black transition-all"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* 
        DESKTOP LAYOUT (>= 1024px) 
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
              className="relative p-12 rounded-none bg-[#25282C]/90 backdrop-blur-md"
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <p
                className="font-manrope text-gh-label tracking-[0.4em] uppercase mb-8"
                style={{ color: "#EFCD62" }}
              >
                {currentSlide.label}
              </p>
              <div className="mb-8">
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
            <div className="relative">
              <motion.div
                key={`img-desk-${currentIndex}`}
                className="relative w-full aspect-[4/5] rounded-none overflow-hidden shadow-2xl border border-white/10"
                style={{ y: imageY }}
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
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
          className="relative z-20 py-8 px-24"
          style={{ backgroundColor: "#0D4032" }}
        >
          <div className="max-w-[1920px] mx-auto flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="group p-4 rounded-none hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-8 h-8 text-[#EFCD62]" />
            </button>
            <div className="flex gap-4" />
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

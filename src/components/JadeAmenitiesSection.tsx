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

const AMENITIES = [
  {
    title: "Culinary Experiences",
    description: "From private chef dinners to starlit barbecues.",
    tags: ["Private Chef", "Barbecue Setup", "Custom Menus"],
    bgImage:
      "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Leisure & Entertainment",
    description: "Immersive games, private pools, and screening rooms.",
    tags: ["Private Pools", "Home Theatre", "Indoor Games"],
    bgImage:
      "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Wellness & Nature",
    description: "Alfresco dining, lush lawns, and open-air decks.",
    tags: ["Expansive Lawns", "Alfresco Dining", "Open Decks"],
    bgImage:
      "https://images.pexels.com/photos/1488267/pexels-photo-1488267.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    title: "Seamless Hospitality",
    description: "Concierge support and premium housekeeping.",
    tags: ["24/7 Support", "Housekeeping", "Butler Service"],
    bgImage:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

export default function JadeAmenitiesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const currentSlide = AMENITIES[currentIndex];

  // Scroll-based parallax
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Background parallax (Desktop only)
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? AMENITIES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === AMENITIES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col h-[100vh] w-full overflow-hidden"
    >
      <NavbarThemeTrigger theme="white" sectionRef={sectionRef} />

      {/* 
        DESKTOP LAYOUT (>= 1024px) 
      */}
      <div className="hidden lg:block relative h-[100vh] w-full overflow-hidden bg-[#25282C]">
        {/* BACKGROUNDS */}
        {/* Top 70% Image Background */}
        <div className="absolute top-[0vh] left-0 right-0 h-[70vh] z-0 overflow-hidden bg-[#25282C]">
          <motion.div className="w-full h-full lg:h-[120%]" style={{ y: bgY }}>
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
                {/* Intelligent Fade - heavy top & bottom to keep text visible */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#25282C]/95 via-[#25282C]/30 to-[#25282C]/60" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Solid Dark Anchor Bar Background at Bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] z-10 bg-[#25282C]" />

        {/* FOREGROUND CONTENT */}

        {/* Top Text Cluster */}
        <div className="absolute top-[12vh] xl:top-[16vh] left-0 right-0 z-20 flex flex-col justify-start items-center text-center px-12 pointer-events-none">
          <motion.p
            key={`label-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-manrope text-gh-label font-bold tracking-[0.3em] uppercase text-[#EFCD62] mb-4"
          >
            {currentSlide.title}
          </motion.p>
          <div className="mb-4 flex flex-col items-center justify-center">
            <h2 className="font-philosopher text-gh-h1 text-white leading-tight block mb-2">
              {currentSlide.description}
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mt-4">
            {currentSlide.tags.map((tag, i) => (
              <span
                key={i}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-none text-white/90 text-sm font-manrope tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Padded Edge Arrows - Straddling exactly on intersection boundary */}
        <button
          onClick={handlePrev}
          className="absolute left-8 xl:left-32 top-[70vh] -translate-y-1/2 p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-none transition-all shadow-md z-30 group border border-white/5"
        >
          <ChevronLeft className="w-6 h-6 xl:w-8 xl:h-8 text-white group-hover:-translate-x-1 transition-transform" />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-8 xl:right-32 top-[70vh] -translate-y-1/2 p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-none transition-all shadow-md z-30 group border border-white/5"
        >
          <ChevronRight className="w-6 h-6 xl:w-8 xl:h-8 text-white group-hover:translate-x-1 transition-transform" />
        </button>

        {/* Landscape Master Feature Card - Scaled horizontally for Image 1 reference matching */}
        <div className="absolute top-[70vh] -translate-y-1/2 left-1/2 -translate-x-1/2 w-[35vw] max-w-[480px] xl:w-[28vw] aspect-[4/3] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 z-30">
          <motion.div
            key={`card-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full relative"
          >
            <Image
              src={currentSlide.bgImage}
              alt="Feature"
              fill
              className="object-cover"
              sizes="40vw"
              priority
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

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
    bgImage:
      "https://images.pexels.com/photos/32870/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600",
    cardImage:
      "https://images.pexels.com/photos/32870/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: 3,
    label: "THE VALUE JADE PROVIDES",
    heading: ["Curated", "experiences"],
    subtext:
      "More than just a stay, expect bespoke services—from private chef dining and starlit barbecues to curated recreational setups tailored precisely for you.",
    bgImage:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600",
    cardImage:
      "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1600",
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
                <div className="absolute inset-0 bg-gradient-to-b from-[#25282C]/95 via-[#25282C]/30 to-[#25282C]/60" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Solid Dark Anchor Bar Background at Bottom (Bottom 30%) */}
        <div className="absolute bottom-0 left-0 right-0 h-[30vh] z-10 bg-[#25282C]" />

        {/* FOREGROUND CONTENT */}

        {/* Top Text Cluster (Safely nestled in the upper 70% image area) */}
        <div className="absolute top-[12vh] xl:top-[16vh] left-0 right-0 z-20 flex flex-col justify-start items-center text-center px-12 pointer-events-none">
          <motion.p
            key={`label-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-manrope text-gh-label font-bold tracking-[0.3em] uppercase text-[#EFCD62] mb-4"
          >
            {currentSlide.label}
          </motion.p>
          <div className="mb-4 flex flex-col items-center justify-center">
            {currentSlide.heading.map((line, index) => (
              <h2
                key={index}
                className="font-philosopher text-gh-h1 text-white leading-tight block mb-2"
              >
                {line}
              </h2>
            ))}
          </div>
          <motion.p
            key={`sub-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-manrope text-gh-body text-white/80 leading-relaxed max-w-2xl mx-auto line-clamp-3"
          >
            {currentSlide.subtext}
          </motion.p>
        </div>

        {/* Padded Edge Arrows - Straddling EXACTLY on the 70/30 intersection boundary */}
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

        {/* Feature Card - Exact Intersection Math: Pinned perfectly horizontally symmetrically overlapping the 70vh split */}
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

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
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import Link from "next/link";

const VILLAS = [
  {
    id: 1,
    category: "HOBBIT THEMED FARMHOUSE",
    title: "Dome Villa",
    description:
      "A hobbit-home inspired retreat set amidst rolling hills, defined by its iconic dome architecture, private pool and immersive connection to nature. Ideal for intimate getaways and quiet celebrations.",
    desktopImage: "/assets/Dome_Villa.png",
    mobileImage: "/assets/Dome_Villa.png",
    link: "/villas/dome-villa",
  },
  {
    id: 2,
    category: "GARDEN FARM VILLA",
    title: "Lemon Tree",
    description:
      "A farmhouse retreat nestled within a lemon grove, featuring a rooftop pool and a flexible indoor hall—well suited for relaxed getaways, intimate celebrations, and countryside offsites.",
    desktopImage: "/assets/Lemon_Tree_for_Desktop.png",
    mobileImage: "/assets/Lemon_Tree_for_Mobile.png",
    link: "/villas/lemon-tree",
  },
  {
    id: 3,
    category: "HILL VIEW VILLA",
    title: "Retreat on the Ridge",
    description:
      "A hill-facing private villa known for panoramic views, sunset backdrops, and a serene pool setting—designed for group getaways, nature-led retreats, and slow weekends away from the city.",
    desktopImage: "/assets/ROR_for_Desktop.png",
    mobileImage: "/assets/ROR_for_Mobile.png",
    link: "/villas/retreat-on-ridge",
  },
  {
    id: 4,
    category: "CONTEMPORARY GLASS VILLA",
    title: "Magnolia",
    description:
      "A modern glass-walled estate with expansive lawns, a private pool, and an in-house theatre—crafted for vibrant celebrations, social gatherings, and large-format experiences with complete privacy.",
    desktopImage: "/assets/Magnolia_for_Desktop.png",
    mobileImage: "/assets/Magnolia_for_Mobile.png",
    link: "/villas/magnolia",
  },
];

export default function FeaturedVillas() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const currentSlide = VILLAS[currentIndex];

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
    setCurrentIndex((prev) => (prev === 0 ? VILLAS.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === VILLAS.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col"
      style={{ backgroundColor: "#0D4032" }} // Deep Green distinct background
    >
      {/* 
        MOBILE LAYOUT (< 1024px) 
      */}
      <div className="lg:hidden relative py-20 px-6 flex flex-col items-center pb-32">
        {/* Main Image Container */}
        <div className="relative w-full aspect-[4/5] rounded-lg overflow-hidden shadow-2xl mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="w-full h-full relative">
                <Image
                  src={currentSlide.mobileImage}
                  alt={currentSlide.title}
                  fill
                  className="object-cover"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Internal Navigation Arrows (Bottom Corners) */}
          <div className="absolute bottom-0 left-0">
            <button
              onClick={handlePrev}
              className="p-4 bg-[#1a1d21]/60 backdrop-blur-md text-white hover:bg-[#EFCD62] hover:text-[#1a1d21] transition-colors rounded-tr-xl border-t border-r border-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="absolute bottom-0 right-0">
            <button
              onClick={handleNext}
              className="p-4 bg-[#1a1d21]/60 backdrop-blur-md text-white hover:bg-[#EFCD62] hover:text-[#1a1d21] transition-colors rounded-tl-xl border-t border-l border-white/10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Text Content Below */}
        <div className="w-full text-left relative z-10">
          <motion.p
            key={`cat-${currentIndex}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-manrope text-xs tracking-[0.2em] uppercase text-[#EFCD62] mb-3"
          >
            {currentSlide.category}
          </motion.p>
          <motion.h2
            key={`title-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-philosopher text-5xl text-white leading-none mb-6"
          >
            {currentSlide.title}
          </motion.h2>
          <motion.p
            key={`desc-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-manrope text-sm text-white/80 leading-relaxed mb-8"
          >
            {currentSlide.description}
          </motion.p>

          <Link
            href={currentSlide.link}
            className="inline-flex items-center gap-2 text-[#EFCD62] text-xs font-bold tracking-widest uppercase hover:gap-4 transition-all"
          >
            SEE MORE <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Overlapping Call to Action Button (Mobile) */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-40 w-max pointer-events-auto">
          <Link
            href="/villas"
            className="flex items-center gap-3 px-6 py-4 bg-[#EFCD62] text-[#1a1d21] rounded-sm shadow-xl font-manrope font-bold text-xs tracking-[0.2em] uppercase hover:bg-white transition-colors"
          >
            EXPLORE ALL JADE VILLAS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 
        DESKTOP LAYOUT (>= 1024px) 
      */}
      <div className="hidden lg:block relative min-h-screen pb-12">
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
                <div className="relative w-full h-full bg-[#0D4032]">
                  <Image
                    src={currentSlide.desktopImage}
                    alt="Background"
                    fill
                    className="object-cover opacity-30 mix-blend-overlay"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0D4032] via-[#0D4032]/90 to-[#1a1d21]/90" />
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Desktop Content */}
        <div className="relative z-10 flex flex-col justify-center min-h-[85vh] px-24">
          <div className="max-w-[1920px] mx-auto w-full grid grid-cols-2 gap-24 items-center">
            {/* Feature Image (LEFT COLUMN) */}
            <div className="relative">
              <motion.div
                key={`img-desk-${currentIndex}`}
                className="relative w-full aspect-[4/3] rounded-lg overflow-hidden shadow-2xl bg-[#1a1d21]"
                style={{ y: imageY }}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Image
                  src={currentSlide.desktopImage}
                  alt={currentSlide.title}
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Text Card (RIGHT COLUMN) */}
            <motion.div
              key={`text-desk-${currentIndex}`}
              className="relative p-12 rounded-lg"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="font-manrope text-sm tracking-[0.3em] uppercase mb-6"
                style={{ color: "#EFCD62" }}
              >
                {currentSlide.category}
              </p>
              <h2 className="font-philosopher text-6xl text-white leading-tight mb-8">
                {currentSlide.title}
              </h2>
              <p className="font-manrope text-lg text-white/70 leading-relaxed mb-8">
                {currentSlide.description}
              </p>

              <Link
                href={currentSlide.link}
                className="inline-flex items-center gap-3 text-[#EFCD62] font-manrope tracking-widest uppercase text-sm hover:gap-6 transition-all duration-300"
              >
                SEE MORE <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div
          className="relative z-20 py-6 px-24"
          style={{ backgroundColor: "#082820" }}
        >
          <div className="max-w-[1920px] mx-auto flex items-center justify-between">
            <button
              onClick={handlePrev}
              className="group p-4 rounded-lg hover:bg-white/10 transition-all"
            >
              <ChevronLeft className="w-8 h-8 text-[#EFCD62]" />
            </button>
            <div className="flex gap-3">
              {VILLAS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-[#EFCD62]" : "bg-[#AC8831]/50"
                  }`}
                />
              ))}
            </div>
            <button
              onClick={handleNext}
              className="group p-4 rounded-lg hover:bg-white/10 transition-all"
            >
              <ChevronRight className="w-8 h-8 text-[#EFCD62]" />
            </button>
          </div>
        </div>

        {/* Overlapping Call to Action Button (Desktop) */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 z-40 w-max pointer-events-auto">
          <Link
            href="/villas"
            className="flex items-center gap-3 px-8 py-5 bg-[#EFCD62] text-[#1a1d21] rounded-sm shadow-xl font-manrope font-bold text-sm tracking-[0.2em] uppercase hover:bg-white transition-colors"
          >
            EXPLORE ALL JADE VILLAS <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

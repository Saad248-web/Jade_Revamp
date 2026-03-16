"use client";

import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";

const SLIDES = [
  {
    id: 1,
    label: "PERFECT FOR",
    heading: ["Family Road", "Trips"],
    subtext: "Reconnect and explore scenic destinations together.",
    bgImage: "/assets/nature_escapes.png",
    cardImage: "/assets/nature_escapes.png",
  },
  {
    id: 2,
    label: "PERFECT FOR",
    heading: ["Romantic", "Getaways"],
    subtext: "Private journeys designed for couples seeking quiet escapes.",
    bgImage: "/assets/evening_under_stars.png",
    cardImage: "/assets/evening_under_stars.png",
  },
  {
    id: 3,
    label: "PERFECT FOR",
    heading: ["Private", "Celebrations"],
    subtext: "Birthdays, proposals, bridal showers, and milestone moments.",
    bgImage: "/assets/celebrations_friends.png",
    cardImage: "/assets/celebrations_friends.png",
  },
  {
    id: 4,
    label: "PERFECT FOR",
    heading: ["One-Day", "Escapes"],
    subtext:
      "Short journeys outside the city without the need for overnight stays.",
    bgImage: "/assets/weekend_getaway_hero.png",
    cardImage: "/assets/weekend_getaway_hero.png",
  },
  {
    id: 5,
    label: "PERFECT FOR",
    heading: ["Content Shoots", "& Creative Projects"],
    subtext:
      "Unique mobile spaces for filming, photography, and creative work.",
    bgImage: "/assets/caravan_journey.png",
    cardImage: "/assets/caravan_journey.png",
  },
  {
    id: 6,
    label: "PERFECT FOR",
    heading: ["Work on", "the Move"],
    subtext:
      "A quiet mobile environment for offsites, brainstorming, or remote work.",
    bgImage: "/assets/corporate_retreat.png",
    cardImage: "/assets/corporate_retreat.png",
  },
];

export default function CaravanUsageSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const currentSlide = SLIDES[currentIndex];

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
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

      {/* MOBILE LAYOUT */}
      <div className="lg:hidden relative min-h-[92vh] flex flex-col">
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

        <div className="mt-auto relative z-20 w-full">
          <div
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{ backgroundColor: "#0D4032" }}
          />
          <div className="relative px-4 pb-12 flex items-center justify-between max-w-md mx-auto">
            <button
              onClick={handlePrev}
              className="p-3 rounded-none bg-white/10 backdrop-blur-sm z-30"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

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

            <button
              onClick={handleNext}
              className="p-3 rounded-none bg-white/10 backdrop-blur-sm z-30"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden lg:block relative min-h-screen overflow-hidden">
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

        <div className="relative z-10 flex flex-col justify-center min-h-[85vh] px-24">
          <div className="max-w-[1920px] mx-auto w-full grid grid-cols-2 gap-16 items-center">
            <motion.div
              key={`text-desk-${currentIndex}`}
              className="relative p-12 rounded-none bg-[#25282C]"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="font-manrope text-gh-label tracking-[0.3em] uppercase mb-6"
                style={{ color: "#EFCD62" }}
              >
                {currentSlide.label}
              </p>
              <div className="mb-6">
                {currentSlide.heading.map((line, index) => (
                  <h2
                    key={index}
                    className="font-philosopher text-gh-h1 text-white leading-tight mb-2"
                  >
                    {line}
                  </h2>
                ))}
              </div>
              <p className="font-manrope text-gh-body text-white/70 leading-relaxed">
                {currentSlide.subtext}
              </p>
            </motion.div>

            <div className="relative">
              <motion.div
                key={`img-desk-${currentIndex}`}
                className="relative w-full aspect-[4/5] rounded-none overflow-hidden shadow-2xl"
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
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </motion.div>
            </div>
          </div>
        </div>

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

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import {
  CAROUSEL_CROSSFADE,
  usePreloadNeighborSlideImages,
} from "@/lib/carouselMotion";
import {
  heroSplitBgVariants,
  heroSplitCardVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";

function pick(images: string[], idx: number) {
  if (!images.length) return "";
  return images[idx % images.length];
}

const SERVICES_SLIDES = [
  {
    id: 1,
    label: "ADDITIONAL WEDDING SERVICES",
    heading: ["Décor &", "Styling"],
    subtext:
      "Custom mandaps, stages, floral concepts, lighting, and themed décor designed to adapt to each venue's unique character.",
    bgImage: "",
    cardImage: "",
  },
  {
    id: 2,
    label: "ADDITIONAL WEDDING SERVICES",
    heading: ["Catering", "Flexibility"],
    subtext:
      "Diverse catering formats including traditional, regional, and customized menus tailored to your specific taste and heritage.",
    bgImage: "",
    cardImage: "",
  },
  {
    id: 3,
    label: "ADDITIONAL WEDDING SERVICES",
    heading: ["Photography &", "Videography"],
    subtext:
      "Outdoor and indoor settings, including pre-wedding shoots and full wedding coverage to capture every precious moment.",
    bgImage: "",
    cardImage: "",
  },
  {
    id: 4,
    label: "ADDITIONAL WEDDING SERVICES",
    heading: ["Music &", "Entertainment"],
    subtext:
      "DJs, live bands, traditional performances, sound systems, and stage configurations to bring your celebration to life.",
    bgImage: "",
    cardImage: "",
  },
];

export default function WeddingServicesSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const [serviceImages, setServiceImages] = useState<string[]>([]);
  const [preWeddingImages, setPreWeddingImages] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/experiences/weddings/media");
        if (!res.ok) return;
        const data = await res.json();
        const servicesGroup = (data?.groups || []).find((g: any) =>
          String(g.folder || "")
            .toLowerCase()
            .includes("3-additional"),
        );
        const preWeddingGroup = (data?.groups || []).find((g: any) =>
          String(g.folder || "")
            .toLowerCase()
            .includes("5-pre wedding"),
        );
        const services = (servicesGroup?.images || []).filter(Boolean);
        const pre = (preWeddingGroup?.images || []).filter(Boolean);
        if (!cancelled) {
          setServiceImages(services);
          setPreWeddingImages(pre);
        }
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const slides = useMemo(() => {
    // Use services images for first 3, then pull a “music/cocktail” vibe from pre-wedding set.
    return SERVICES_SLIDES.map((s, idx) => ({
      ...s,
      bgImage:
        idx < 3 ? pick(serviceImages, idx * 2) : pick(preWeddingImages, 2),
      cardImage:
        idx < 3 ? pick(serviceImages, idx * 2 + 1) : pick(preWeddingImages, 3),
    }));
  }, [serviceImages, preWeddingImages]);

  const currentSlide = slides[currentIndex] || SERVICES_SLIDES[0];

  usePreloadNeighborSlideImages(slides, currentIndex);

  const carouselCustom: HeroSplitCustom = {
    dir: direction,
    lowFx: !!reducedMotion,
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#0D4032] flex flex-col"
    >
      <NavbarThemeTrigger theme="white" sectionRef={sectionRef} />

      {/* ── TOP AREA (80vh) — background image ── */}
      <div
        className="relative w-full h-[80vh] z-0 overflow-hidden shrink-0"
        style={{ perspective: "1500px" }}
      >
        <AnimatePresence mode="sync" initial={false} custom={carouselCustom}>
          <motion.div
            key={`bg-${currentIndex}-${currentSlide.bgImage || "empty"}`}
            custom={carouselCustom}
            variants={heroSplitBgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {currentSlide.bgImage ? (
              <Image
                src={currentSlide.bgImage}
                alt="Background"
                fill
                className="object-cover"
                sizes="100vw"
                priority={currentIndex === 0}
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#0D4032] to-[#0D4032]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0D4032]/90 via-[#0D4032]/25 to-[#0D4032]/55" />
          </motion.div>
        </AnimatePresence>

        {/* ── TEXT ── */}
        <div className="absolute inset-x-0 top-[10vh] z-20 flex flex-col items-center text-center px-6 sm:px-10 pointer-events-none">
          <motion.p
            key={`label-${currentIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-manrope text-gh-label font-bold tracking-[0.3em] uppercase text-[#EFCD62]"
            style={{ marginBottom: "clamp(4px, 1vw, 8px)" }}
          >
            {currentSlide.label}
          </motion.p>
          <div style={{ marginBottom: "clamp(6px, 1.5vw, 12px)" }}>
            <h2 className="font-philosopher text-gh-h1 text-white leading-tight lg:whitespace-nowrap">
              {currentSlide.heading.join(" ")}
            </h2>
          </div>
          <motion.p
            key={`sub-${currentIndex}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08, duration: CAROUSEL_CROSSFADE.duration }}
            className="font-manrope text-gh-carousel-sub text-white/80 leading-relaxed max-w-xl mx-auto line-clamp-3"
          >
            {currentSlide.subtext}
          </motion.p>
        </div>
      </div>

      {/* ── BOTTOM AREA ── */}
      <div className="relative w-full h-[20vh] z-10 bg-[#0D4032]" />

      {/* ── SPACER — exactly 40px gap ── */}
      <div className="h-[40px] bg-[#0D4032]" />

      {/* ── ARROWS ── */}
      <button
        onClick={handlePrev}
        aria-label="Previous"
        className="absolute left-4 sm:left-8 lg:left-16 xl:left-28 top-[80vh] -translate-y-1/2 p-3 sm:p-4 lg:p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all shadow-md z-30 border border-white/10 group"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:-translate-x-1 transition-transform" />
      </button>

      <button
        onClick={handleNext}
        aria-label="Next"
        className="absolute right-4 sm:right-8 lg:right-16 xl:right-28 top-[80vh] -translate-y-1/2 p-3 sm:p-4 lg:p-5 bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all shadow-md z-30 border border-white/10 group"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-white group-hover:translate-x-1 transition-transform" />
      </button>

      {/* ── FEATURE CARD ── */}
      <div
        className="absolute top-[80vh] -translate-y-1/2 left-1/2 -translate-x-1/2 z-30
                      w-[45vw] max-w-[280px] sm:w-[35vw] sm:max-w-[320px] lg:w-[24vw] lg:max-w-[380px] xl:w-[20vw]
                      aspect-[4/3]
                      shadow-[0_20px_50px_rgba(0,0,0,0.55)] overflow-hidden border border-white/20"
      >
        <AnimatePresence mode="sync" initial={false} custom={carouselCustom}>
          <motion.div
            key={`card-${currentIndex}-${currentSlide.cardImage || "empty"}`}
            custom={carouselCustom}
            variants={heroSplitCardVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="w-full h-full relative"
          >
            {currentSlide.cardImage ? (
              <Image
                src={currentSlide.cardImage}
                alt="Feature"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 55vw, (max-width: 1024px) 45vw, 32vw"
                priority={currentIndex === 0}
                unoptimized
                loading="eager"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#0D4032] to-black/80" />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

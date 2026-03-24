"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

import NavbarThemeTrigger from "./NavbarThemeTrigger";

const CELEBRATIONS = [
  {
    id: "mehendi",
    title: "Mehendi & Haldi",
    subtext:
      "Daytime rituals in private lawns and courtyards, with space to gather, move freely, and celebrate without interruption.",
    image:
      "https://images.unsplash.com/photo-1544275061-0ae79c456860?q=80&w=2938&auto=format&fit=crop",
    href: "/weddings",
    cta: "SEE THE RITUALS",
  },
  {
    id: "sangeet",
    title: "Sangeet Evenings",
    subtext:
      "Evenings shaped for music, performances, and dancing, supported by flexible lighting, sound, and open layouts.",
    image:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2082&auto=format&fit=crop",
    href: "/weddings",
    cta: "EXPLORE THE VIBE",
  },
  {
    id: "bachelor",
    title: "Bachelor & Bachelorette Parties",
    subtext:
      "Fully private estates for carefree celebrations—poolside moments, music, décor, and late nights with friends.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
    href: "/party-villas",
    cta: "LEARN MORE",
  },
  {
    id: "cocktail",
    title: "Pre-Wedding Cocktail Nights",
    subtext:
      "Relaxed evening gatherings with custom bar setups, lounge seating, and ambient lighting.",
    image:
      "https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=2070&auto=format&fit=crop",
    href: "/weddings",
    cta: "SEE THE MAGIC",
  },
  {
    id: "shoots",
    title: "Pre-Wedding Shoots",
    subtext:
      "Multiple backdrops within one private estate, allowing your shoot to flow naturally from one setting to the next.",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop",
    href: "/weddings",
    cta: "VIEW THE LOCATIONS",
  },
];

export default function WeddingCelebrationsSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // Smooth scroll spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const totalSteps = CELEBRATIONS.length + 1;

  return (
    <section ref={targetRef} className="relative h-[600vh] bg-[#1A1C1E]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col bg-[#1A1C1E]">
        {/* Top Label & Counter - Global */}
        <div className="relative w-full z-50 flex flex-col items-center pointer-events-none pt-20 md:pt-24 pb-[16px] md:pb-[24px]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/90 to-transparent -z-10" />
          <span className="font-manrope text-gh-label tracking-[0.3em] uppercase mb-4 md:mb-6 font-semibold text-[#EFCD62] drop-shadow-lg block">
            PRE WEDDING CELEBRATIONS
          </span>
          <GlobalCounter
            progress={smoothProgress}
            total={CELEBRATIONS.length}
            totalSteps={totalSteps}
          />
        </div>

        {/* Panels Interactive Area */}
        <div className="relative w-full flex-1 min-h-0 z-10">
          {CELEBRATIONS.map((celebration, i) => (
            <CelebrationPanelSlide
              key={celebration.id}
              data={celebration}
              index={i}
              globalProgress={smoothProgress}
              totalSteps={totalSteps}
            />
          ))}
          <EndButton globalProgress={smoothProgress} />
        </div>
      </div>
    </section>
  );
}

// Global Counter Component
function GlobalCounter({
  progress,
  total,
  totalSteps,
}: {
  progress: any;
  total: number;
  totalSteps: number;
}) {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    return progress.on("change", (v: number) => {
      const step = 1 / (totalSteps - 1);
      const lastPanelP = (total - 1) / (totalSteps - 1);
      const effectiveP = Math.min(v, lastPanelP);

      let idx = Math.round(effectiveP / step) + 1;
      if (idx > total) idx = total;
      if (idx < 1) idx = 1;

      setCurrent(idx);
    });
  }, [progress, total, totalSteps]);

  return (
    <div className="relative flex items-center gap-12 md:gap-16 font-philosopher text-gh-scroll mt-2">
      <span className="text-white drop-shadow-lg transition-all duration-300">
        {current}
      </span>
      <div className="w-24 md:w-32 h-[1px] bg-white/70 drop-shadow-lg" />
      <span className="text-white/70 drop-shadow-lg">{total}</span>
    </div>
  );
}

function EndButton({ globalProgress }: { globalProgress: any }) {
  const opacity = useTransform(globalProgress, [0.85, 1.0], [0, 1]);
  const scale = useTransform(globalProgress, [0.85, 1.0], [0.8, 1]);
  const y = useTransform(globalProgress, [0.85, 1.0], [60, 0]);

  return (
    <motion.div
      style={{ opacity, scale, y, zIndex: 100 }}
      className="absolute inset-0 flex items-center justify-center pointer-events-none"
    >
      <Link
        href="/villas"
        className="pointer-events-auto relative overflow-hidden flex items-center justify-center gap-4 px-10 py-5 md:px-14 md:py-6 rounded-full bg-[#EFCD62] text-[#1A1C1E] font-philosopher text-xl md:text-2xl shadow-[0_16px_40px_rgba(239,205,98,0.4)] hover:bg-[#F3DA85] hover:shadow-[0_20px_50px_rgba(239,205,98,0.6)] transition-all duration-500 group hover:scale-105"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-white/40 pointer-events-none" />
        <span className="relative z-10 font-bold whitespace-nowrap text-center">
          See All Wedding Villas
        </span>
        <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform duration-500 relative z-10" />
      </Link>
    </motion.div>
  );
}

function CelebrationPanelSlide({
  data,
  index,
  globalProgress,
  totalSteps,
}: {
  data: any;
  index: number;
  globalProgress: any;
  totalSteps: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [offsetPx, setOffsetPx] = useState(1000);

  useEffect(() => {
    const handleResize = () =>
      setOffsetPx(window.innerWidth >= 1024 ? 672 : window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const x = useTransform(globalProgress, (p: number) => {
    return (index - p * totalSteps) * offsetPx;
  });

  return (
    <motion.div
      style={{ x, zIndex: index * 10 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center justify-center w-full h-full">
        <NavbarThemeTrigger theme="white" sectionRef={panelRef} />
        <div
          ref={panelRef}
          className="relative w-full h-full max-w-[1920px] mx-auto flex flex-col items-center justify-center px-6 md:px-24"
        >
          <div className="relative w-full h-full max-w-xl mx-auto flex flex-col items-center justify-center gap-4 lg:gap-6">
            {/* Image Section */}
            <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/3] max-h-[50vh] lg:max-h-[60vh] overflow-hidden shadow-2xl rounded-none bg-black">
              <div className="w-full h-full relative">
                <Image
                  src={data.image}
                  alt={data.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 600px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
            </div>

            {/* Text Section */}
            <div className="relative w-full flex flex-col items-start text-left mt-2 h-[220px] lg:h-[260px]">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="font-philosopher text-gh-h2 text-white leading-none mb-4"
              >
                {data.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="font-manrope text-gh-body text-white/80 leading-relaxed mb-6 lg:mb-8 line-clamp-3 max-w-lg"
              >
                {data.subtext}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="w-full max-w-md"
              >
                <Link
                  href={data.href || "#"}
                  className="inline-flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase hover:gap-4 transition-all"
                >
                  {data.cta} <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

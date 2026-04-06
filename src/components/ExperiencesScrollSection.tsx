"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";

const PANELS = [
  {
    id: "weekend",
    title: "Weekend Getaways",
    subtext:
      "A day or two with your friends and family away from the bustling city in the wilderness is truly on everyone’s wishlist.",
    cta: "SEE WHAT A GETAWAY LOOKS LIKE",
    href: "/weekend-getaways",
    image:
      "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
  },
  {
    id: "celebrations",
    title: "Celebrations & Parties",
    subtext:
      "Birthdays, pool parties and bachelor celebrations unfold across private farmhouse villas with pools, open lawns, and entertainment-ready spaces.",
    cta: "SEE HOW CELEBRATIONS COME ALIVE",
    href: "/party-villas",
    image: "/X/ROR/14.webp",
  },
  {
    id: "weddings",
    title: "Weddings",
    subtext:
      "Intimate ceremonies to grand, multi-day wedding celebrations, set amid private gardens, sprawling lawns, and luxury rooms.",
    cta: "SEE HOW WEDDINGS UNFOLD",
    href: "/weddings",
    image: "/X/Magnolia/9.webp",
  },
  {
    id: "corporate",
    title: "Corporate Offsites",
    subtext:
      "Unwinding and ice-breaking sessions with colleagues, away from cubicles and glass walls, in private farmhouses ideal for offsites or workations.",
    cta: "SEE HOW TEAMS GATHER",
    href: "/corporate-retreats",
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1600",
  },
  {
    id: "wellness",
    title: "Wellness Retreats",
    subtext:
      "Element-led wellness restoration through mud baths, massages, spa and aroma therapies, designed for deep rejuvenation.",
    cta: "SEE HOW RETREAT TAKES SHAPE",
    href: "/experiences",
    image: "/X/Magnolia/16.webp",
  },
  {
    id: "caravans",
    title: "Journeys in Caravans",
    subtext:
      "Luxury motor caravans carry the idea of private retreat onto the road, offering comfort and privacy for glamping, pilgrimages or any evolving journeys.",
    cta: "SEE HOW THE JOURNEY UNFOLDS",
    href: "/caravans",
    image: "/X/Magnolia/14.webp",
  },
  {
    id: "private-villas",
    title: "Private Villas",
    subtext:
      "A curated collection of fully private farmhouses, suited for everything from quiet stays to vibrant celebrations and bespoke experiences.",
    cta: "SEE THE VILLAS THAT HOST IT ALL",
    href: "/villas",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function ExperiencesScrollSection() {
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

  const totalSteps = PANELS.length + 1; // 8 steps total

  return (
    <section ref={targetRef} className="relative h-[800vh] bg-[#0D4032]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col bg-[#0D4032]">
        {/* Top Label & Counter - Global */}
        <div className="relative w-full z-50 flex flex-col items-center pointer-events-none pt-12 md:pt-16 pb-[16px] md:pb-[24px]">
          <span className="font-manrope text-gh-label tracking-[0.3em] uppercase mb-2 md:mb-4 font-semibold text-jade-gold drop-shadow-lg block">
            WAYS JADE IS EXPERIENCED
          </span>
          <GlobalCounter
            progress={smoothProgress}
            total={PANELS.length}
            totalSteps={totalSteps}
          />
        </div>

        {/* Panels Interactive Area */}
        <div className="relative w-full flex-1 min-h-0 z-10">
          {PANELS.map((panel, i) => (
            <PanelSlide
              key={panel.id}
              data={panel}
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
        className="pointer-events-auto relative overflow-hidden flex items-center justify-center gap-4 px-10 py-5 md:px-14 md:py-6 rounded-full bg-[#EFCD62] text-[#0D4032] font-philosopher text-xl md:text-2xl shadow-[0_16px_40px_rgba(239,205,98,0.4)] hover:bg-[#F3DA85] hover:shadow-[0_20px_50px_rgba(239,205,98,0.6)] transition-all duration-500 group hover:scale-105"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-white/40 pointer-events-none" />
        <span className="relative z-10 font-bold whitespace-nowrap text-center">
          See Best Experience Villas
        </span>
        <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform duration-500 relative z-10" />
      </Link>
    </motion.div>
  );
}

function PanelSlide({
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
        <div className="relative w-full h-full max-w-[1920px] mx-auto flex flex-col items-center justify-center px-6 md:px-24">
          <div className="relative w-full h-full max-w-xl mx-auto flex flex-col items-center justify-center gap-4 lg:gap-6">
            {/* Image Section */}
            <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/3] max-h-[45vh] lg:max-h-[50vh] overflow-hidden shadow-2xl rounded-none bg-black">
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
            <div className="relative w-full flex flex-col items-start text-left mt-2 h-auto shrink-0 pb-4">
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

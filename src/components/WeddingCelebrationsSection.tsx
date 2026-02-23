"use client";

import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
} from "framer-motion";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const CELEBRATIONS = [
  {
    id: "mehendi",
    title: "Mehendi & Haldi",
    subtext:
      "Daytime rituals in private lawns and courtyards, with space to gather, move freely, and celebrate without interruption.",
    image:
      "https://images.unsplash.com/photo-1544275061-0ae79c456860?q=80&w=2938&auto=format&fit=crop",
  },
  {
    id: "sangeet",
    title: "Sangeet Evenings",
    subtext:
      "Evenings shaped for music, performances, and dancing, supported by flexible lighting, sound, and open layouts.",
    image:
      "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=2082&auto=format&fit=crop",
  },
  {
    id: "bachelor",
    title: "Bachelor & Bachelorette Parties",
    subtext:
      "Fully private estates for carefree celebrations—poolside moments, music, décor, and late nights with friends.",
    image:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "cocktail",
    title: "Pre-Wedding Cocktail Nights",
    subtext:
      "Relaxed evening gatherings with custom bar setups, lounge seating, and ambient lighting.",
    image:
      "https://images.unsplash.com/photo-1574096079513-d8259312b785?q=80&w=2070&auto=format&fit=crop",
  },
  {
    id: "shoots",
    title: "Pre-Wedding Shoots",
    subtext:
      "Multiple backdrops within one private estate, allowing your shoot to flow naturally from one setting to the next.",
    image:
      "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=2069&auto=format&fit=crop",
  },
];

export default function WeddingCelebrationsSection() {
  const targetRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section ref={targetRef} className="relative h-[600vh] bg-[#1A1C1E]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {/* Top Label & Counter - Desktop/Mobile Mixed Overlay */}
          <div className="absolute top-0 left-0 w-full z-50 flex flex-col items-center pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[20vh] bg-gradient-to-b from-black/80 to-transparent" />

            <div className="relative mt-24 md:mt-28 flex flex-col items-center">
              <span className="font-manrope text-[10px] md:text-sm tracking-[0.4em] uppercase mb-4 font-bold text-[#EFCD62]">
                PRE WEDDING CELEBRATIONS
              </span>
              <CelebrationCounter
                progress={smoothProgress}
                total={CELEBRATIONS.length}
              />
            </div>
          </div>

          {CELEBRATIONS.map((celebration, i) => (
            <CelebrationPanel
              key={celebration.id}
              data={celebration}
              index={i}
              globalProgress={smoothProgress}
              totalPanels={CELEBRATIONS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function CelebrationCounter({
  progress,
  total,
}: {
  progress: any;
  total: number;
}) {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    return progress.on("change", (v: number) => {
      let idx = Math.round(v * (total - 1)) + 1;
      if (idx > total) idx = total;
      if (idx < 1) idx = 1;
      setCurrent(idx);
    });
  }, [progress, total]);

  return (
    <div className="relative flex items-center gap-8 md:gap-12 font-philosopher text-xl md:text-2xl mt-1">
      <span className="text-white drop-shadow-lg">{current}</span>
      <div className="w-16 md:w-20 h-[1px] bg-white/40" />
      <span className="text-white/40">{total}</span>
    </div>
  );
}

function CelebrationPanel({
  data,
  index,
  globalProgress,
  totalPanels,
}: {
  data: any;
  index: number;
  globalProgress: any;
  totalPanels: number;
}) {
  const step = 1 / (totalPanels - 1);
  const enterStart = (index - 1) * step;
  const enterEnd = index * step;
  const exitEnd = (index + 1) * step;

  // Combine transforms for smooth stacked flow
  const x = useTransform(
    globalProgress,
    [enterStart, enterEnd],
    ["100%", "0%"],
  );

  const scale = useTransform(
    globalProgress,
    [enterStart, enterEnd, exitEnd],
    [1.05, 1, 0.9],
  );

  const opacity = useTransform(
    globalProgress,
    [enterStart, enterEnd, exitEnd],
    [1, 1, 0.6],
  );

  const filter = useTransform(
    globalProgress,
    [enterStart, enterEnd, exitEnd],
    ["brightness(1)", "brightness(1)", "brightness(0.4)"],
  );

  let panelStyle: any = { zIndex: index };
  if (index !== 0) panelStyle.x = x;
  panelStyle.scale = scale;
  panelStyle.opacity = opacity;
  panelStyle.filter = filter;

  return (
    <motion.div
      style={panelStyle}
      className="absolute inset-0 w-full h-full overflow-hidden shadow-2xl"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={data.image}
          alt={data.title}
          fill
          className="object-cover"
          priority={index <= 1}
          sizes="100vw"
          quality={90}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-20 w-full h-full px-6 pb-24 flex flex-col items-center justify-end text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl"
        >
          <h2 className="font-philosopher text-5xl md:text-7xl text-white mb-6 drop-shadow-xl">
            {data.title}
          </h2>
          <p className="font-manrope text-sm md:text-lg text-white/80 leading-relaxed drop-shadow-lg max-w-xl mx-auto">
            {data.subtext}
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}

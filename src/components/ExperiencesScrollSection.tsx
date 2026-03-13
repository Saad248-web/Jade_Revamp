"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";

const PANELS = [
  {
    id: "weekend",
    title: "Weekend Getaways",
    subtext:
      "A day or two with your friends and family away from the bustling city in the wilderness is truly on everyone’s wishlist.",
    cta: "SEE WHAT A GETAWAY LOOKS LIKE",
    image: "/assets/Bathing_Girls.png",
    type: "full",
  },
  {
    id: "celebrations",
    title: "Celebrations & Parties",
    subtext:
      "Birthdays, pool parties and bachelor celebrations unfold across private farmhouse villas with pools, open lawns, and entertainment-ready spaces.",
    cta: "SEE HOW CELEBRATIONS COME ALIVE",
    image: "/assets/Jade_735_for_Desktop.png",
    type: "full",
  },
  {
    id: "weddings",
    title: "Weddings",
    subtext:
      "Intimate ceremonies to grand, multi-day wedding celebrations, set amid private gardens, sprawling lawns, and luxury rooms.",
    cta: "SEE HOW WEDDINGS UNFOLD", // As per screenshot
    image: "/assets/Wedding_for_Both.png",
    type: "full",
  },
  {
    id: "corporate",
    title: "Corporate Offsites",
    subtext:
      "Unwinding and ice-breaking sessions with colleagues, away from cubicles and glass walls, in private farmhouses ideal for offsites or workations.",
    cta: "SEE HOW TEAMS GATHER",
    image: "/assets/corporate_retreat.png",
    type: "full",
  },
  {
    id: "wellness",
    title: "Wellness Retreats",
    subtext:
      "Element-led wellness restoration through mud baths, massages, spa and aroma therapies, designed for deep rejuvenation.",
    cta: "SEE HOW RETREAT TAKES SHAPE",
    image: "/assets/wellness_retreat.png",
    type: "full",
  },
  {
    id: "caravans",
    title: "Journeys in Caravans",
    subtext:
      "Luxury motor caravans carry the idea of private retreat onto the road, offering comfort and privacy for glamping, pilgrimages or any evolving journeys.",
    cta: "SEE HOW THE JOURNEY UNFOLDS",
    image: "/assets/caravan_journey.png",
    type: "full",
  },
  {
    id: "private-villas",
    title: "Private Villas",
    subtext:
      "A curated collection of fully private farmhouses, suited for everything from quiet stays to vibrant celebrations and bespoke experiences.",
    cta: "SEE THE VILLAS THAT HOST IT ALL",
    image: "/assets/casual_stays.png",
    type: "full",
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

  // Total panels
  const totalPanels = PANELS.length;

  return (
    <section ref={targetRef} className="relative h-[800vh] bg-[#050505]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative w-full h-full">
          {/* Top Label & Counter - Global (Fixed on top of everything) */}
          <div className="absolute top-0 left-0 w-full z-[100] flex flex-col items-center pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[16.6vh] bg-gradient-to-b from-black/90 to-transparent" />
            <div className="relative mt-20 md:mt-24 text-center">
              <span className="font-manrope text-gh-label tracking-[0.3em] uppercase mb-4 md:mb-6 font-semibold text-[#EFCD62] drop-shadow-lg block">
                WAYS JADE IS EXPERIENCED
              </span>
            </div>

            <GlobalCounter progress={smoothProgress} total={totalPanels} />
          </div>

          {PANELS.map((panel, i) => (
            <StackedPanel
              key={panel.id}
              data={panel}
              index={i}
              globalProgress={smoothProgress}
              totalPanels={totalPanels}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Global Counter Component
function GlobalCounter({ progress, total }: { progress: any; total: number }) {
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    return progress.on("change", (v: number) => {
      // Logic to determine current slide
      const segment = 1 / (total - 1);
      // We want to snap to the closest logical index
      // v goes from 0 to 1
      // If v=0 -> 1
      // If v=1 -> total

      // Simple division:
      let idx = Math.round(v * (total - 1)) + 1;
      if (idx > total) idx = total;
      if (idx < 1) idx = 1;
      setCurrent(idx);
    });
  }, [progress, total]);

  return (
    <div className="relative flex items-center gap-12 md:gap-16 font-philosopher text-xl md:text-2xl lg:text-3xl mt-2">
      <span className="text-white drop-shadow-lg transition-all duration-300 w-8 text-center text-3xl font-bold">
        {current}
      </span>
      <div className="w-16 md:w-24 h-[1px] bg-white/70 drop-shadow-lg opacity-70" />
      <span className="text-white/70 drop-shadow-lg w-8 text-center text-xl">
        {total}
      </span>
    </div>
  );
}

function StackedPanel({
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
  const exitStart = index * step;
  const exitEnd = (index + 1) * step;

  // Transforms
  const xInput = [enterStart, enterEnd];
  const xOutput = ["100%", "0%"];

  // Entry
  const x = useTransform(globalProgress, xInput, xOutput, { clamp: false });

  // Exit (Recede)
  const exitScale = useTransform(
    globalProgress,
    [exitStart, exitEnd],
    [1, 0.8],
  );
  const exitOpacity = useTransform(
    globalProgress,
    [exitStart, exitEnd],
    [1, 0.4],
  );
  const exitFilter = useTransform(
    globalProgress,
    [exitStart, exitEnd],
    ["brightness(1)", "brightness(0.3)"],
  );

  let style: any = { zIndex: index * 10 };

  if (index === 0) {
    // First panel: Static start, then exit
    style.scale = exitScale;
    style.opacity = exitOpacity;
    style.filter = exitFilter;
    style.x = 0;
  } else if (index === totalPanels - 1) {
    // Last panel: Enter, no exit
    style.x = useTransform(
      globalProgress,
      [enterStart, enterEnd],
      ["100%", "0%"],
    );
  } else {
    // Middle panels: Enter then Exit
    const xCombined = useTransform(
      globalProgress,
      [enterStart, enterEnd, exitEnd],
      ["100%", "0%", "0%"],
    );
    const scaleCombined = useTransform(
      globalProgress,
      [enterStart, enterEnd, exitEnd],
      [1, 1, 0.8],
    );
    const opacityCombined = useTransform(
      globalProgress,
      [enterStart, enterEnd, exitEnd],
      [1, 1, 0.4],
    );
    const filterCombined = useTransform(
      globalProgress,
      [enterStart, enterEnd, exitEnd],
      ["brightness(1)", "brightness(1)", "brightness(0.3)"],
    );

    style.x = xCombined;
    style.scale = scaleCombined;
    style.opacity = opacityCombined;
    style.filter = filterCombined;
  }

  // Ken Burns Effect for Image
  // Slowly scale up while visible
  const kbScale = useTransform(
    globalProgress,
    [Math.max(0, enterStart), Math.min(1, exitEnd)],
    [1.0, 1.15],
  );

  // Content Animation
  const contentVars = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut", delay: 0.3 },
    },
  };

  return (
    <motion.div
      style={style}
      className="absolute inset-0 w-full h-full bg-[#050505] overflow-hidden shadow-2xl"
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.div
          style={{ scale: kbScale }}
          className="relative w-full h-full"
        >
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover"
            priority={index === 0}
            sizes="100vw"
          />
        </motion.div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-20 w-full h-full px-6 pb-32 md:pb-24 text-center flex flex-col items-center justify-end"
        initial="hidden"
        whileInView="visible"
        viewport={{ amount: 0.5 }}
        variants={contentVars}
      >
        <h2 className="font-philosopher text-gh-h2 text-white mb-6 drop-shadow-lg">
          {data.title}
        </h2>
        <p className="font-manrope text-gh-body text-white/90 font-light max-w-xl mb-10 leading-relaxed drop-shadow-md">
          {data.subtext}
        </p>
        <PrimaryButton href="#">{data.cta}</PrimaryButton>
      </motion.div>
    </motion.div>
  );
}

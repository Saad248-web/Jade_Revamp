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
    cta: "SEE HOW WEDDINGS UNFOLD",
    image: "/assets/Wedding_for_Both.png",
    type: "full",
  },
  {
    id: "grid",
    type: "grid",
    items: [
      {
        title: "Corporate Retreats",
        img: "/assets/corporate_retreat.png",
      },
      {
        title: "Wellness Retreats",
        img: "/assets/wellness_retreat.png",
      },
      {
        title: "Caravan Journeys",
        img: "/assets/caravan_journey.png",
      },
      {
        title: "Casual Stays",
        img: "/assets/casual_stays.png",
      },
    ],
    cta: "SEE ALL EXPERIENCES",
  },
];

export default function HorizontalScrollSection() {
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

  const totalSteps = PANELS.length; // Ensure exactly 4 steps for 4 panels

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#0D4032]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col bg-[#0D4032]">
        {/* Top Label & Counter - Global */}
        <div className="relative w-full z-50 flex flex-col items-center pointer-events-none pt-20 md:pt-24 pb-[16px] md:pb-[24px]">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/90 to-transparent -z-10" />
          <span className="font-manrope text-gh-label tracking-[0.3em] uppercase mb-4 md:mb-6 font-semibold text-jade-gold drop-shadow-lg block">
            WAYS JADE IS EXPERIENCED
          </span>
          <GlobalCounter progress={smoothProgress} total={PANELS.length} />
        </div>

        {/* Panels Interactive Area */}
        <div className="relative w-full flex-1 min-h-0 z-10">
          {PANELS.map((panel, i) => (
            <StackedPanel
              key={panel.id}
              data={panel}
              index={i}
              globalProgress={smoothProgress}
              totalSteps={totalSteps}
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
      // Calculate index based on 4 total panels (indices 0-3)
      // v goes from 0.0 to 1.0.
      // 0.0 -> 0.33 -> 0.66 -> 1.0 (Approximate step triggers)
      const step = 1 / (total - 1); // 0.333 for total=4

      // We want to trigger the number change when the next panel is mostly visible
      let idx = Math.round(v / step) + 1;

      if (idx > total) idx = total;
      if (idx < 1) idx = 1;

      setCurrent(idx);
    });
  }, [progress, total]);

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

function StackedPanel({
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
  const isGrid = data.type === "grid";

  const step = 1 / totalSteps;

  const enterStart = index * step - step;
  const enterEnd = index * step;
  const exitStart = index * step;
  const exitEnd = (index + 1) * step;

  // X Position: Slides in from right, active, then slides out to left
  let xInput, xOutput;
  if (index === 0) {
    xInput = [exitStart, exitEnd];
    xOutput = ["0%", "-100%"];
  } else {
    xInput = [enterStart, enterEnd, exitEnd];
    xOutput = ["100%", "0%", "-100%"];
  }

  const x = useTransform(globalProgress, xInput, xOutput);

  let scaleInput, scaleOutput;
  if (index === 0) {
    scaleInput = [exitStart, exitEnd];
    scaleOutput = [1, 0.9];
  } else {
    scaleInput = [enterStart, enterEnd, exitEnd];
    scaleOutput = [1.1, 1, 0.9];
  }

  const scale = useTransform(globalProgress, scaleInput, scaleOutput);

  return (
    <motion.div
      style={{ x, zIndex: index * 10 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-[#0D4032]"
    >
      <NavbarThemeTrigger
        theme={isGrid ? "golden" : "white"}
        sectionRef={panelRef}
      />
      <div className="relative w-full h-full max-w-[1920px] mx-auto flex flex-col items-center justify-center px-6 md:px-24">
        {/* Layout Container */}
        <div className="relative w-full h-full flex flex-col lg:flex-row items-center justify-center lg:gap-24 pt-0 pb-12">
          {/* Image/Grid Section */}
          <div className="relative w-full lg:w-1/2 aspect-[4/5] lg:aspect-[4/3] max-h-[40vh] lg:max-h-[70vh]">
            <motion.div
              style={{ scale }}
              className={`w-full h-full relative overflow-hidden shadow-2xl ${
                isGrid ? "bg-transparent" : "bg-black"
              } rounded-none`}
            >
              {!isGrid ? (
                <>
                  <Image
                    src={data.image}
                    alt={data.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent lg:hidden" />
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 w-full h-full">
                  {data.items.slice(0, 4).map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="relative border border-white/10 group overflow-hidden w-full h-full"
                    >
                      <Image
                        src={item.img}
                        alt={item.title}
                        fill
                        className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700"
                      />
                      <div className="absolute bottom-4 left-0 w-full text-center">
                        <h3 className="font-philosopher text-white text-gh-body">
                          {item.title}
                        </h3>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Text Section */}
          <div className="relative w-full lg:w-1/2 flex flex-col items-start text-left mt-4 lg:mt-0 lg:pl-12">
            {!isGrid ? (
              <>
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
                  className="font-manrope text-gh-body text-white/80 leading-relaxed mb-8 max-w-lg"
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
                    href="#"
                    className="inline-flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase hover:gap-4 transition-all"
                  >
                    {data.cta} <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </>
            ) : (
              // Grid panel text layout
              <>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-philosopher text-gh-h2 text-white leading-none mb-4"
                >
                  More Experiences
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-manrope text-gh-body text-white/80 leading-relaxed mb-8 max-w-lg"
                >
                  Discover the diverse range of retreats, journeys, and stays
                  curated intentionally for your specific needs.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Link
                    href="#"
                    className="inline-flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase hover:gap-4 transition-all"
                  >
                    {data.cta} <ArrowRight className="w-5 h-5" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

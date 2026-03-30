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
    image: "/X/Dome Villas/Blue Dome/Dome Villas by Jade - Blue v3_Page_07_Image_0001.webp",
    type: "full",
  },
  {
    id: "celebrations",
    title: "Celebrations & Parties",
    subtext:
      "Birthdays, pool parties and bachelor celebrations unfold across private farmhouse villas with pools, open lawns, and entertainment-ready spaces.",
    cta: "SEE HOW CELEBRATIONS COME ALIVE",
    href: "/party-villas",
    image: "/X/ROR/14.webp",
    type: "full",
  },
  {
    id: "weddings",
    title: "Weddings",
    subtext:
      "Intimate ceremonies to grand, multi-day wedding celebrations, set amid private gardens, sprawling lawns, and luxury rooms.",
    cta: "SEE HOW WEDDINGS UNFOLD",
    href: "/weddings",
    image: "/X/Magnolia/9.webp",
    type: "full",
  },
  {
    id: "grid",
    type: "grid",
    items: [
      {
        title: "Corporate Retreats",
        img: "/X/ROR/15.webp",
      },
      {
        title: "Wellness Retreats",
        img: "/X/Magnolia/16.webp",
      },
      {
        title: "Caravan Journeys",
        img: "/X/Magnolia/14.webp",
      },
      {
        title: "Casual Stays",
        img: "/X/Magnolia/15.webp",
      },
    ],
    cta: "SEE ALL EXPERIENCES",
    href: "/experiences",
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

  const totalSteps = PANELS.length + 1; // 5 steps total to allow the last panel to fully exit

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-[#0D4032]">
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col bg-[#0D4032]">
        {/* Top Label & Counter - Global */}
        <div className="relative w-full z-50 flex flex-col items-center pointer-events-none pt-16 md:pt-20 pb-[20px] md:pb-[28px]">
          <span className="font-manrope text-gh-label tracking-[0.3em] uppercase mb-3 md:mb-5 font-semibold text-jade-gold drop-shadow-lg block">
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
            <StackedPanel
              key={panel.id}
              data={panel}
              index={i}
              globalProgress={smoothProgress}
              totalSteps={totalSteps}
            />
          ))}
        </div>
        {/* End Button — positioned in the outer sticky container for true screen centering */}
        <EndButton globalProgress={smoothProgress} />
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
      // With totalSteps = 5, panels are at p = 0, 0.2, 0.4, 0.6
      // v goes from 0.0 to 1.0.
      const step = 1 / (totalSteps - 1); // 0.2 for totalSteps=5

      // Map progress to panel index (1-4)
      // Clamping p up to the last panel's center point for the counter
      const lastPanelP = (total - 1) / (totalSteps - 1); // 0.6 if total=4, totalSteps=5
      const effectiveP = Math.min(v, lastPanelP);

      let idx = Math.round(effectiveP / step) + 1;

      if (idx > total) idx = total;
      if (idx < 1) idx = 1;

      setCurrent(idx);
    });
  }, [progress, total, totalSteps]);

  return (
    <div className="relative flex items-center gap-8 md:gap-12 font-philosopher text-[18px] md:text-[22px] mt-2">
      <span className="text-white drop-shadow-lg transition-all duration-300">
        {current}
      </span>
      <div className="w-20 md:w-28 h-[1px] bg-white/70 drop-shadow-lg" />
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
        href="/experiences"
        className="pointer-events-auto relative overflow-hidden flex items-center justify-center gap-4 px-10 py-5 md:px-14 md:py-6 rounded-full bg-[#EFCD62] text-[#0D4032] font-philosopher text-xl md:text-2xl shadow-[0_16px_40px_rgba(239,205,98,0.4)] hover:bg-[#F3DA85] hover:shadow-[0_20px_50px_rgba(239,205,98,0.6)] transition-all duration-500 group hover:scale-105"
      >
        {/* Subtle metallic glare for premium finish */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/10 to-white/40 pointer-events-none" />

        <span className="relative z-10 font-bold whitespace-nowrap">
          View All Experiences
        </span>
        <ArrowRight className="w-6 h-6 md:w-8 md:h-8 group-hover:translate-x-2 transition-transform duration-500 relative z-10" />
      </Link>
    </motion.div>
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

  // Responsive scroll distance to tighten gap on desktop to exactly 96px
  // Content max-w is 576px (max-w-xl). Gap is 96px. Total = 672px.
  const [offsetPx, setOffsetPx] = useState(1000); // 1000px fallback

  useEffect(() => {
    const handleResize = () =>
      setOffsetPx(window.innerWidth >= 1024 ? 672 : window.innerWidth);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // X Position: Continuous tracked position instead of clamped keyframes
  // to ensure panels don't pile up at a fixed clamp boundary off-screen.
  const x = useTransform(globalProgress, (p: number) => {
    // p goes from 0 to 1 over the whole scroll.
    // Panel 'index' is at screen center (x=0) when p = index / totalSteps.
    return (index - p * totalSteps) * offsetPx;
  });

  return (
    <motion.div
      style={{ x, zIndex: index * 10 }}
      className="absolute inset-0 w-full h-full flex items-center justify-center bg-transparent pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center justify-center w-full h-full">
        <NavbarThemeTrigger
          theme={isGrid ? "golden" : "white"}
          sectionRef={panelRef}
        />
        <div className="relative w-full h-full max-w-[1920px] mx-auto flex flex-col items-center justify-center px-4 sm:px-8 md:px-16 xl:px-24">
          {/* Layout Container */}
          <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg xl:max-w-xl mx-auto flex flex-col items-center justify-center gap-4 lg:gap-6">
            {/* Image/Grid Section */}
            <div
              className={`relative w-full aspect-[4/5] sm:aspect-[3/4] md:aspect-square lg:aspect-[4/3] max-h-[45vh] md:max-h-[52vh] lg:max-h-[58vh] overflow-hidden shadow-2xl rounded-none ${isGrid ? "bg-transparent" : "bg-black"}`}
            >
              <div className="w-full h-full relative">
                {!isGrid ? (
                  <>
                    <Image
                      src={data.image}
                      alt={data.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 600px"
                    />
                    {/* Subtle Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
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
                          sizes="(max-width: 1024px) 50vw, 300px"
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
              </div>
            </div>

            {/* Text Section */}
            <div className="relative w-full flex flex-col items-start text-left mt-2 h-[220px] lg:h-[260px]">
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
                    className="font-manrope text-gh-body text-white/80 leading-relaxed mb-6 lg:mb-8 line-clamp-3 max-w-lg"
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
                      href={data.href || "#"}
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
      </div>
    </motion.div>
  );
}

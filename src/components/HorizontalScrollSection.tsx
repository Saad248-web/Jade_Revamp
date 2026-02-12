"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

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

  // Map vertical scroll (0-1) to horizontal transform (0% to -300vw for 4 panels)
  // Actually we need to move 3 full widths to show the 4th panel at the end.
  // Translating -300vw moves the container so the 4th panel (at 300vw) aligns with viewport (0).
  const x = useTransform(smoothProgress, [0, 1], ["0%", "-75%"]); // 75% of 400vw = 300vw

  return (
    <section ref={targetRef} className="relative h-[400vh] bg-jade-charcoal">
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full w-[400vw]">
          {PANELS.map((panel, i) => (
            <Panel key={panel.id} data={panel} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Panel({ data, index }: { data: any; index: number }) {
  const isGrid = data.type === "grid";

  // Text Animation Variants
  const containerVars = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const lineVars = {
    hidden: { y: 40, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <div className="w-[100vw] h-screen relative flex flex-col justify-end overflow-hidden border-r border-white/5 last:border-r-0">
      {/* 0. Top Label & Counter (Sticky Visual) */}
      <div className="absolute top-20 md:top-24 left-0 w-full z-20 flex flex-col items-center pointer-events-none">
        {/* Background overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-transparent backdrop-blur-sm" />

        <div className="relative">
          <span className="font-manrope text-sm md:text-base lg:text-lg tracking-[0.3em] uppercase mb-4 md:mb-6 font-semibold text-white drop-shadow-lg">
            WAYS JADE IS EXPERIENCED
          </span>
        </div>

        <div className="relative flex items-center gap-6 md:gap-8 font-philosopher text-xl md:text-2xl lg:text-3xl">
          <span className="text-white drop-shadow-lg">{index + 1}</span>
          <div className="w-12 md:w-16 h-[1px] bg-white/70 drop-shadow-lg" />
          <span className="text-white/70 drop-shadow-lg">7</span>
        </div>
      </div>

      {/* 1. BACKGROUND IMAGE (Parallax) */}
      {!isGrid && (
        <div className="absolute inset-0 z-0">
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-[2s] hover:scale-105"
            priority={index === 0}
            sizes="100vw"
          />
          {/* Gradient Overlay for Text Readability - Bottom Heavy */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10" />
        </div>
      )}

      {/* GRID LAYOUT BACKGROUND */}
      {isGrid && (
        <div className="absolute inset-0 z-0 bg-jade-charcoal">
          {/* Solid background - no noise texture */}
        </div>
      )}

      {/* 2. TEXT CONTENT (Bottom Aligned) */}
      <motion.div
        className={`relative z-10 w-full px-6 pb-12 md:pb-20 text-center flex flex-col items-center ${isGrid ? "h-full justify-center" : "justify-end"}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }}
        variants={containerVars}
      >
        {!isGrid ? (
          <>
            <motion.h2 className="font-philosopher text-4xl md:text-6xl text-white mb-6 drop-shadow-lg">
              <div className="overflow-hidden">
                <motion.span className="block" variants={lineVars}>
                  {data.title}
                </motion.span>
              </div>
            </motion.h2>

            <motion.p
              variants={lineVars}
              className="font-manrope text-base md:text-lg text-white/90 font-light max-w-xl mb-12 leading-relaxed drop-shadow-md"
            >
              {data.subtext}
            </motion.p>

            <motion.div variants={lineVars} className="w-full max-w-md">
              <Link
                href="#"
                className="w-full block bg-jade-gold text-jade-charcoal py-4 px-6 uppercase tracking-widest text-xs md:text-sm font-bold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3"
              >
                {data.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </>
        ) : (
          /* GRID PANEL CONTENT */
          <div className="w-full h-full flex flex-col items-center justify-center px-6 md:px-8 pt-32 md:pt-40">
            {/* Grid Container */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full max-w-7xl mb-8 md:mb-12">
              {data.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="relative group overflow-hidden border border-white/10 cursor-pointer aspect-[3/4] md:aspect-[3/4]"
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  <div className="absolute bottom-4 md:bottom-6 left-0 w-full text-center px-3 md:px-4">
                    <h3 className="font-philosopher text-lg md:text-xl lg:text-2xl text-white tracking-wide leading-tight">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.div
              variants={lineVars}
              className="w-full max-w-md px-4 md:px-0"
            >
              <Link
                href="#"
                className="w-full block bg-jade-gold text-jade-charcoal py-3 md:py-4 px-6 uppercase tracking-widest text-xs md:text-sm font-bold hover:bg-white hover:text-black transition-all duration-300 flex items-center justify-center gap-3"
              >
                {data.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

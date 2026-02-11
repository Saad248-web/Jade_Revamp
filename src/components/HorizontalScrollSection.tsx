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
        img: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Wellness Retreats",
        img: "https://images.unsplash.com/photo-1544367563-12123d896589?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Caravan Journeys",
        img: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop",
      },
      {
        title: "Casual Stays",
        img: "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop",
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
  // Reveal animations setup
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
    <div className="w-[100vw] h-full relative flex items-center justify-center overflow-hidden border-r border-white/5 last:border-r-0">
      {/* BACKGROUND IMAGE (Parallax) */}
      {!isGrid && (
        <div className="absolute inset-0 z-0">
          {/* Subtle Parallax Scale/Move could be added here if needed, 
               but horizontal movement handles most of the 'parallax' feel naturally 
               as elements slide in. We'll stick to full cover. */}
          <Image
            src={data.image}
            alt={data.title}
            fill
            className="object-cover transition-transform duration-[2s] hover:scale-105"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-black/40" />
          {/* Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>
      )}

      {/* GRID LAYOUT BACKGROUND */}
      {isGrid && (
        <div className="absolute inset-0 z-0 bg-jade-charcoal">
          {/* Abstract Grid BG */}
          <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-[0.05]" />
        </div>
      )}

      {/* TEXT CONTENT */}
      <motion.div
        className={`relative z-10 max-w-4xl px-8 text-center flex flex-col items-center ${isGrid ? "w-full max-w-7xl" : ""}`}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.5 }} // Sync animation with visibility
        variants={containerVars}
      >
        {!isGrid ? (
          <>
            <motion.h2 className="font-philosopher text-4xl md:text-6xl text-white mb-6">
              <div className="overflow-hidden">
                <motion.span className="block" variants={lineVars}>
                  {data.title}
                </motion.span>
              </div>
            </motion.h2>

            <motion.p
              variants={lineVars}
              className="font-manrope text-lg md:text-xl text-white/90 font-light max-w-2xl mb-10 leading-relaxed drop-shadow-md"
            >
              {data.subtext}
            </motion.p>

            <motion.div variants={lineVars}>
              <Link
                href="#"
                className="bg-jade-gold text-jade-charcoal px-8 py-4 rounded-none uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors duration-300 inline-flex items-center gap-2"
              >
                {data.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </>
        ) : (
          /* GRID PANEL CONTENT */
          <div className="w-full h-full flex flex-col items-center justify-center py-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full h-[60vh]">
              {data.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="relative group overflow-hidden border border-white/10 cursor-pointer"
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                  <div className="absolute bottom-8 left-0 w-full text-center">
                    <h3 className="font-philosopher text-2xl text-white tracking-wide">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>

            <motion.div variants={lineVars} className="mt-12">
              <Link
                href="#"
                className="bg-jade-gold text-jade-charcoal px-12 py-4 rounded-none uppercase tracking-widest text-sm font-bold hover:bg-white transition-colors duration-300 inline-flex items-center gap-2"
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

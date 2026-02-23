"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import LiveBackground from "./LiveBackground";
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

  // Calculate current slide index (0-3) for Counter
  const totalPanels = PANELS.length;
  const currentIndex = useTransform(
    smoothProgress,
    // Map scroll ranges to index: 0-0.2 -> 0, 0.3-0.5 -> 1, etc.
    [
      0,
      (1 / (totalPanels - 1)) * 0.8,
      1 / (totalPanels - 1),
      2 / (totalPanels - 1),
    ],
    [0, 0, 1, 2], // Simplified tracking, actual index logic logic below
  );

  // Actually, let's just use a simpler mapped value for the visual counter if needed,
  // or rely on the derived logic in the child.

  return (
    <section ref={targetRef} className="relative h-[500vh] bg-jade-charcoal">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="relative w-full h-full">
          <LiveBackground />
          {/* Top Label & Counter - Global (Fixed on top of everything) */}
          <div className="absolute top-0 left-0 w-full z-50 flex flex-col items-center pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-[16.6vh] bg-gradient-to-b from-black/90 to-transparent" />
            <div className="relative mt-20 md:mt-24">
              <span className="font-manrope text-sm md:text-base lg:text-lg tracking-[0.3em] uppercase mb-4 md:mb-6 font-semibold text-jade-gold drop-shadow-lg">
                WAYS JADE IS EXPERIENCED
              </span>
            </div>
            {/* 
                Visual Counter Implementation: 
                Since we are stacking, we can either have a global counter here 
                OR proper per-panel counters if we want them to slide.
                Design usually implies a static counter overlay. 
                Let's make it global and drive the number.
             */}
            <GlobalCounter progress={smoothProgress} total={PANELS.length} />
          </div>

          {PANELS.map((panel, i) => (
            <StackedPanel
              key={panel.id}
              data={panel}
              index={i}
              globalProgress={smoothProgress}
              totalPanels={PANELS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// Global Counter Component
function GlobalCounter({ progress, total }: { progress: any; total: number }) {
  // Map progress to distinct steps: 0->0.33 (1), 0.33->0.66 (2), etc.
  // We use a transform but we need to render integer.
  // Framer Motion 'useTransform' returns a generic MotionValue.
  // To render text from it, we can use a small component that listens to change.
  const [current, setCurrent] = useState(1);

  useEffect(() => {
    return progress.on("change", (v: number) => {
      // v goes 0 to 1.
      // Segments:
      // 0 - 0.33 : 1
      // 0.33 - 0.66 : 2
      // 0.66 - 1.0 : 3
      // Wait, we have 4 panels?
      // 0 -> Panel 0 active.
      // 0.33 -> Panel 1 enters.
      // 0.66 -> Panel 2 enters.
      // 1.0 -> Panel 3 enters.
      const segment = 1 / (total - 1);
      const rawIdx = v / segment;
      // Round to nearest index based on transition point?
      // Actually, "Active" is the one entering or fully entered.
      // Let's say index is floor(rawIdx) + 1?
      // If v=0, idx=0 -> 1.
      // If v=0.33, idx=1 -> 2.
      let idx = Math.round(v * (total - 1)) + 1;
      if (idx > total) idx = total;
      if (idx < 1) idx = 1;
      setCurrent(idx);
    });
  }, [progress, total]);

  return (
    <div className="relative flex items-center gap-12 md:gap-16 font-philosopher text-xl md:text-2xl lg:text-3xl mt-2">
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
  totalPanels,
}: {
  data: any;
  index: number;
  globalProgress: any;
  totalPanels: number;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isGrid = data.type === "grid";

  // ===== ANIMATION LOGIC =====
  // 4 Panels (0, 1, 2, 3)
  // Step size = 1 / 3 = 0.333
  const step = 1 / (totalPanels - 1);

  // Transition In (Entry):
  // Occurs when scroll is between (index - 1) * step and index * step.
  // Panel 0: Starts at 0, no entry phase.
  // Panel 1: Enters 0 -> 0.33
  // Panel 2: Enters 0.33 -> 0.66

  const enterStart = (index - 1) * step;
  const enterEnd = index * step;

  // Transition Out (Exit/Recede):
  // Occurs when scroll is between index * step and (index + 1) * step.
  // Panel 0: Recedes 0 -> 0.33
  // Panel 1: Recedes 0.33 -> 0.66

  const exitStart = index * step;
  const exitEnd = (index + 1) * step;

  // ENTRY TRANSFORM (Slide from Right)
  // Clamp range: Panel 0 shouldn't slide.
  const xInput = [enterStart, enterEnd];
  const xOutput = ["100%", "0%"];
  const scaleInput = [enterStart, enterEnd];
  const scaleOutput = [1.05, 1]; // Gentle scale down on entry

  const x = useTransform(globalProgress, xInput, xOutput, { clamp: false });
  const entryScale = useTransform(globalProgress, scaleInput, scaleOutput, {
    clamp: false,
  });

  // EXIT TRANSFORM (Recede to Background)
  const exitScale = useTransform(
    globalProgress,
    [exitStart, exitEnd],
    [1, 0.8],
  );
  const exitOpacity = useTransform(
    globalProgress,
    [exitStart, exitEnd],
    [1, 0.5],
  );
  const exitFilter = useTransform(
    globalProgress,
    [exitStart, exitEnd],
    ["brightness(1)", "brightness(0.5)"],
  );

  // Combined Styles
  // If index is 0, it doesn't enter. It just exists and exits.
  // If index is last, it doesn't exit.

  let style: any = { zIndex: index };

  if (index === 0) {
    // Panel 0: Only Exit Logic
    style.scale = exitScale;
    style.opacity = exitOpacity;
    style.filter = exitFilter;
    style.x = 0; // Fixed
  } else if (index === totalPanels - 1) {
    // Last Panel: Only Entry Logic
    // But wait, useTransform needs valid ranges.
    // If we are "past" the entry phase, useTransform clamps to end value by default if we don't set clamp false.
    // We want standard clamping.

    const safeX = useTransform(
      globalProgress,
      [enterStart, enterEnd],
      ["100%", "0%"],
    );
    const safeScale = useTransform(
      globalProgress,
      [enterStart, enterEnd],
      [1.05, 1],
    );
    style.x = safeX;
    style.scale = safeScale;
  } else {
    // Middle Panels: Enter then Exit
    // We need to combine them.
    // Problem: simple useTransform range [enterStart, enterEnd, exitEnd] -> [values] works?
    // Entry: x 100->0, scale 1.05->1.
    // Exit: x 0, scale 1->0.8.

    const xCombined = useTransform(
      globalProgress,
      [enterStart, enterEnd, exitEnd],
      ["100%", "0%", "0%"],
    );
    // Scale: 1.05 -> 1 -> 0.8
    const scaleCombined = useTransform(
      globalProgress,
      [enterStart, enterEnd, exitEnd],
      [1.05, 1, 0.8],
    );
    const opacityCombined = useTransform(
      globalProgress,
      [enterStart, enterEnd, exitEnd],
      [1, 1, 0.5],
    );
    const filterCombined = useTransform(
      globalProgress,
      [enterStart, enterEnd, exitEnd],
      ["brightness(1)", "brightness(1)", "brightness(0.5)"],
    );

    style.x = xCombined;
    style.scale = scaleCombined;
    style.opacity = opacityCombined;
    style.filter = filterCombined;
  }

  // KEN BURNS (Internal Image)
  // Moves slowly while visible.
  const kenBurnsScale = useTransform(
    globalProgress,
    [Math.max(0, enterStart), Math.min(1, exitEnd)],
    [1, 1.15],
  );

  // Text Animation (Trigger when "active")
  // Active means globalProgress approx index * step.
  // We can use `whileInView` effectively if we construct a ref?
  // Or better, drive opacity by scroll too to ensure it plays at the right time.
  // Let's stick to simple InView or just map it.
  // If we map it, we get scrubbing. User wants "Transition" feel.
  // Let's use `whileInView` on an inner element that enters the viewport?
  // But the panel is "technically" in viewport even when hidden by siblings or offscreen.
  // Actually, absolute positioned offscreen elements are "in viewport"? No, if x=100%.
  // So standard whileInView works for Entry.

  const containerVars = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };
  const lineVars = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      ref={panelRef}
      style={style}
      className="absolute inset-0 w-full h-full bg-jade-charcoal overflow-hidden shadow-2xl"
    >
      <NavbarThemeTrigger
        theme={isGrid ? "golden" : "white"}
        sectionRef={panelRef}
      />
      {/* BACKGROUND */}
      {!isGrid && (
        <div className="absolute inset-0 z-0">
          <motion.div
            className="w-full h-full relative"
            style={{ scale: kenBurnsScale }}
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/10 z-10" />
        </div>
      )}

      {isGrid && <div className="absolute inset-0 z-0 bg-jade-charcoal" />}

      {/* CONTENT */}
      <motion.div
        className={`relative z-20 w-full h-full px-6 pb-24 md:pb-16 text-center flex flex-col items-center justify-end`}
        initial="hidden"
        whileInView="visible"
        // Ensure trigger happens when panel actually slides in.
        // With X transform, intersection observer should fire when it crosses viewport.
        viewport={{ amount: 0.3, once: true }}
        variants={containerVars}
      >
        {!isGrid ? (
          <>
            <motion.h2 className="font-philosopher text-4xl md:text-6xl text-white mb-4 drop-shadow-lg">
              <div className="overflow-hidden">
                <motion.span className="block" variants={lineVars}>
                  {data.title}
                </motion.span>
              </div>
            </motion.h2>
            <motion.p
              variants={lineVars}
              className="font-manrope text-base md:text-lg text-white/90 font-light max-w-xl mb-8 leading-relaxed drop-shadow-md"
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
          /* Grid Content - Simply reusing structure */
          <div className="w-full flex flex-col items-center">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full max-w-7xl mb-8 md:mb-12 pt-36 md:pt-44">
              {data.items.map((item: any, idx: number) => (
                <div
                  key={idx}
                  className="relative aspect-[3/4] border border-white/10 group overflow-hidden"
                >
                  <Image
                    src={item.img}
                    alt={item.title}
                    fill
                    className="object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-700"
                  />
                  <div className="absolute bottom-4 left-0 w-full text-center">
                    <h3 className="font-philosopher text-white text-lg">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
            <motion.div variants={lineVars} className="w-full max-w-md">
              <Link
                href="#"
                className="w-full block bg-jade-gold text-jade-charcoal py-3 px-6 uppercase tracking-widest text-xs md:text-sm font-bold flex items-center justify-center gap-3"
              >
                {data.cta} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

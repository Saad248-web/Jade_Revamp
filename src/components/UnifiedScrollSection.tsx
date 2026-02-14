"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import LiveBackground from "./LiveBackground";

export default function UnifiedScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the entire 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // ===== SECTION 1: HospitainmentDefinition (0 → 0.33) =====
  // 1. "Hospitainment is the art of"
  // 2. "hosting experiences not just"
  // 3. "stays. At Jade, hospitality sets"
  // 4. "the foundation and"
  // 5. "entertainment activates the"
  // 6. "space."

  const s1Start = 0;
  const s1FadeOut = 0.28;
  const s1End = 0.33;

  const line1Opacity = useTransform(
    scrollYProgress,
    [s1Start, s1Start + 0.05, s1FadeOut, s1End],
    [0, 1, 1, 0],
  );
  const line2Opacity = useTransform(
    scrollYProgress,
    [s1Start + 0.04, s1Start + 0.09, s1FadeOut, s1End],
    [0, 1, 1, 0],
  );
  const line3Opacity = useTransform(
    scrollYProgress,
    [s1Start + 0.08, s1Start + 0.13, s1FadeOut, s1End],
    [0, 1, 1, 0],
  );
  const line4Opacity = useTransform(
    scrollYProgress,
    [s1Start + 0.12, s1Start + 0.17, s1FadeOut, s1End],
    [0, 1, 1, 0],
  );
  const line5Opacity = useTransform(
    scrollYProgress,
    [s1Start + 0.16, s1Start + 0.21, s1FadeOut, s1End],
    [0, 1, 1, 0],
  );
  const line6Opacity = useTransform(
    scrollYProgress,
    [s1Start + 0.2, s1Start + 0.25, s1FadeOut, s1End],
    [0, 1, 1, 0],
  );

  const section1Y = useTransform(scrollYProgress, [0, 0.33], [0, -20]);

  // ===== SECTION 2: VillaRetreats (0.33 → 0.66) =====
  // 1. "Private villas transform into"
  // 2. "venues for celebration,"
  // 3. "immersive retreats, and"
  // 4. "bespoke gatherings," (Break)
  // 5. "adapting to the moment"
  // 6. "they are meant to host."
  const s2Start = 0.33;
  const s2End = 0.66;
  const s2FadeOut = 0.6;

  const s2Line1 = useTransform(
    scrollYProgress,
    [s2Start, s2Start + 0.05, s2FadeOut, s2End],
    [0, 1, 1, 0],
  );
  const s2Line2 = useTransform(
    scrollYProgress,
    [s2Start + 0.03, s2Start + 0.08, s2FadeOut, s2End],
    [0, 1, 1, 0],
  );
  const s2Line3 = useTransform(
    scrollYProgress,
    [s2Start + 0.06, s2Start + 0.11, s2FadeOut, s2End],
    [0, 1, 1, 0],
  );
  const s2Line4 = useTransform(
    scrollYProgress,
    [s2Start + 0.09, s2Start + 0.14, s2FadeOut, s2End],
    [0, 1, 1, 0],
  );
  const s2Line5 = useTransform(
    scrollYProgress,
    [s2Start + 0.12, s2Start + 0.17, s2FadeOut, s2End],
    [0, 1, 1, 0],
  );
  const s2Line6 = useTransform(
    scrollYProgress,
    [s2Start + 0.15, s2Start + 0.2, s2FadeOut, s2End],
    [0, 1, 1, 0],
  );
  const s2Btn = useTransform(
    scrollYProgress,
    [s2Start + 0.18, s2Start + 0.23, s2FadeOut, s2End],
    [0, 1, 1, 0],
  );

  const section2Y = useTransform(scrollYProgress, [s2Start, s2End], [20, -20]);

  // ===== SECTION 3: ExperiencesSection (0.66 → 1) =====
  // 1. "From high-energy parties and"
  // 2. "destination weddings to"
  // 3. "corporate offsites, wellness"
  // 4. "retreats, and private getaways."
  // 5. "Jade's spaces are designed"
  // 6. "to evolve with every occasion."

  const s3Start = 0.66;
  const s3End = 1.0;
  // Delayed fade out to 0.98 to give a longer "locked" reading time (after text appears)
  const s3FadeOut = 0.98;

  const s3Line1 = useTransform(
    scrollYProgress,
    [s3Start, s3Start + 0.05, s3FadeOut, s3End],
    [0, 1, 1, 0],
  );
  const s3Line2 = useTransform(
    scrollYProgress,
    [s3Start + 0.03, s3Start + 0.08, s3FadeOut, s3End],
    [0, 1, 1, 0],
  );
  const s3Line3 = useTransform(
    scrollYProgress,
    [s3Start + 0.06, s3Start + 0.11, s3FadeOut, s3End],
    [0, 1, 1, 0],
  );
  const s3Line4 = useTransform(
    scrollYProgress,
    [s3Start + 0.09, s3Start + 0.14, s3FadeOut, s3End],
    [0, 1, 1, 0],
  );
  const s3Line5 = useTransform(
    scrollYProgress,
    [s3Start + 0.12, s3Start + 0.17, s3FadeOut, s3End],
    [0, 1, 1, 0],
  );
  const s3Line6 = useTransform(
    scrollYProgress,
    [s3Start + 0.15, s3Start + 0.2, s3FadeOut, s3End],
    [0, 1, 1, 0],
  );
  // Line 7 removed (merged)
  const s3Btn = useTransform(
    scrollYProgress,
    [s3Start + 0.18, s3Start + 0.23, s3FadeOut, s3End],
    [0, 1, 1, 0],
  );

  const section3Y = useTransform(scrollYProgress, [s3Start, s3End], [20, -20]);

  return (
    <div ref={containerRef} className="relative h-[600vh]">
      {/* ===== STICKY BACKGROUND (100vh, stays for full 300vh) ===== */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <LiveBackground />

        {/* ===== CONTENT OVERLAY (absolute positioning) ===== */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* ===== SECTION 1: Hospitainment Definition ===== */}
          <motion.div
            className="absolute inset-x-0 flex items-center justify-center px-6 md:px-12 pointer-events-auto"
            style={{ y: section1Y }}
          >
            <div className="max-w-5xl mx-auto text-center">
              {/* Font Manrope Regular (font-normal), size updated to 24px (text-2xl) */}
              <h2 className="font-manrope font-normal text-2xl md:text-5xl lg:text-7xl leading-[1.2] md:leading-[1.2] text-white/90 mb-12">
                <motion.div style={{ opacity: line1Opacity }}>
                  Hospitainment is the art of
                </motion.div>
                <motion.div style={{ opacity: line2Opacity }}>
                  hosting experiences not just
                </motion.div>
                <motion.div style={{ opacity: line3Opacity }}>
                  stays. At Jade, hospitality sets
                </motion.div>
                <motion.div style={{ opacity: line4Opacity }}>
                  the foundation and
                </motion.div>
                <motion.div style={{ opacity: line5Opacity }}>
                  entertainment activates the
                </motion.div>
                <motion.div style={{ opacity: line6Opacity }}>
                  space.
                </motion.div>
              </h2>
            </div>
          </motion.div>

          {/* ===== SECTION 2: Villa Retreats ===== */}
          <motion.div
            className="absolute inset-x-0 flex items-center justify-center px-6 md:px-12 pointer-events-auto"
            style={{ y: section2Y }}
          >
            <div className="max-w-5xl mx-auto text-center">
              {/* Updated to Manrope, Normal, 24px */}
              <h2 className="font-manrope font-normal text-2xl md:text-5xl lg:text-7xl leading-[1.2] md:leading-[1.2] text-white/90 mb-12">
                <motion.div style={{ opacity: s2Line1 }}>
                  Private villas transform into
                </motion.div>
                <motion.div style={{ opacity: s2Line2 }}>
                  venues for celebration,
                </motion.div>
                <motion.div style={{ opacity: s2Line3 }}>
                  immersive retreats, and
                </motion.div>
                <motion.div style={{ opacity: s2Line4 }}>
                  bespoke gatherings,
                </motion.div>
                <motion.div style={{ opacity: s2Line5 }}>
                  adapting to the moment
                </motion.div>
                <motion.div style={{ opacity: s2Line6 }}>
                  they are meant to host.
                </motion.div>
              </h2>
              <motion.div style={{ opacity: s2Btn }}>
                <Link
                  href="#villas"
                  className="inline-flex items-center gap-3 text-jade-gold font-manrope text-sm md:text-base tracking-widest uppercase hover:text-white transition-colors group"
                >
                  VIEW ALL VILLA RETREATS
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>

          {/* ===== SECTION 3: Experiences ===== */}
          <motion.div
            className="absolute inset-x-0 flex items-center justify-center px-6 md:px-12 pointer-events-auto"
            style={{ y: section3Y }}
          >
            <div className="max-w-5xl mx-auto text-center">
              {/* Updated to Manrope, Normal, 24px */}
              <h2 className="font-manrope font-normal text-2xl md:text-5xl lg:text-7xl leading-[1.2] md:leading-[1.2] text-white/90 mb-12">
                <motion.div style={{ opacity: s3Line1 }}>
                  From high-energy parties and
                </motion.div>
                <motion.div style={{ opacity: s3Line2 }}>
                  destination weddings to
                </motion.div>
                <motion.div style={{ opacity: s3Line3 }}>
                  corporate offsites, wellness
                </motion.div>
                <motion.div style={{ opacity: s3Line4 }}>
                  retreats, and private getaways.
                </motion.div>
                <motion.div style={{ opacity: s3Line5 }}>
                  Jade&apos;s spaces are designed
                </motion.div>
                <motion.div style={{ opacity: s3Line6 }}>
                  to evolve with every occasion.
                </motion.div>
              </h2>
              <motion.div style={{ opacity: s3Btn }}>
                <Link
                  href="#experiences"
                  className="inline-flex items-center gap-3 text-jade-gold font-manrope text-sm md:text-base tracking-widest uppercase hover:text-white transition-colors group"
                >
                  VIEW EXPERIENCES AT JADE
                  <svg
                    className="w-5 h-5 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

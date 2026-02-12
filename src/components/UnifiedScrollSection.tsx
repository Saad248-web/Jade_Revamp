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
  const section1Opacity = useTransform(
    scrollYProgress,
    [0, 0.08, 0.25, 0.33],
    [0, 1, 1, 0],
  );
  const section1Y = useTransform(
    scrollYProgress,
    [0, 0.08, 0.33],
    [40, 0, -20],
  );

  // ===== SECTION 2: VillaRetreats (0.33 → 0.66) =====
  const section2Opacity = useTransform(
    scrollYProgress,
    [0.33, 0.41, 0.58, 0.66],
    [0, 1, 1, 0],
  );
  const section2Y = useTransform(
    scrollYProgress,
    [0.33, 0.41, 0.66],
    [40, 0, -20],
  );

  // ===== SECTION 3: ExperiencesSection (0.66 → 1) =====
  const section3Opacity = useTransform(
    scrollYProgress,
    [0.66, 0.74, 0.92, 1],
    [0, 1, 1, 0],
  );
  const section3Y = useTransform(
    scrollYProgress,
    [0.66, 0.74, 1],
    [40, 0, -20],
  );

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      {/* ===== STICKY BACKGROUND (100vh, stays for full 300vh) ===== */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <LiveBackground />

        {/* ===== CONTENT OVERLAY (absolute positioning) ===== */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* ===== SECTION 1: Hospitainment Definition ===== */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-6 md:px-12"
            style={{
              opacity: section1Opacity,
              y: section1Y,
            }}
          >
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="font-philosopher text-3xl md:text-5xl lg:text-7xl leading-[1.1] md:leading-[1.1] text-white/90 mb-12">
                <div>Hospitainment is the art of</div>
                <div>hosting experiences not just</div>
                <div>stays.</div>
              </h2>
              <p className="font-manrope text-lg md:text-2xl text-white/60 font-light max-w-3xl mx-auto leading-relaxed">
                At Jade, hospitality sets the foundation and
                <br className="hidden md:block" /> entertainment activates the
                space.
              </p>
            </div>
          </motion.div>

          {/* ===== SECTION 2: Villa Retreats ===== */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-6 md:px-12"
            style={{
              opacity: section2Opacity,
              y: section2Y,
            }}
          >
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="font-philosopher text-3xl md:text-5xl lg:text-7xl leading-[1.1] md:leading-[1.1] text-white/90 mb-12">
                <div>Private villa's transform into</div>
                <div>venues for celebration,</div>
                <div>immersive retreats, and</div>
                <div>bespoke gatherings, adapting</div>
                <div>to the moment they are meant</div>
                <div>to host.</div>
              </h2>
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
            </div>
          </motion.div>

          {/* ===== SECTION 3: Experiences ===== */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center px-6 md:px-12"
            style={{
              opacity: section3Opacity,
              y: section3Y,
            }}
          >
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="font-philosopher text-3xl md:text-5xl lg:text-7xl leading-[1.1] md:leading-[1.1] text-white/90 mb-12">
                <div>From high-energy parties and</div>
                <div>destination weddings to</div>
                <div>corporate offsites, wellness</div>
                <div>retreats, and private</div>
                <div>getaways. Jade's spaces are</div>
                <div>designed to evolve with every</div>
                <div>occasion.</div>
              </h2>
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
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

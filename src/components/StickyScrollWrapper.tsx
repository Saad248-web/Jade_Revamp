"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LiveBackground from "./LiveBackground";

interface StickyScrollWrapperProps {
  section1: React.ReactNode;
  section2: React.ReactNode;
  section3: React.ReactNode;
}

export default function StickyScrollWrapper({
  section1,
  section2,
  section3,
}: StickyScrollWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress through the entire 300vh container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // ===== SECTION 1: 0 → 0.33 =====
  const section1Opacity = useTransform(
    scrollYProgress,
    [0, 0.1, 0.25, 0.33],
    [0, 1, 1, 0],
  );
  const section1Y = useTransform(scrollYProgress, [0, 0.1, 0.33], [40, 0, -20]);

  // ===== SECTION 2: 0.33 → 0.66 =====
  const section2Opacity = useTransform(
    scrollYProgress,
    [0.33, 0.43, 0.56, 0.66],
    [0, 1, 1, 0],
  );
  const section2Y = useTransform(
    scrollYProgress,
    [0.33, 0.43, 0.66],
    [40, 0, -20],
  );

  // ===== SECTION 3: 0.66 → 1 =====
  const section3Opacity = useTransform(
    scrollYProgress,
    [0.66, 0.76, 0.9, 1],
    [0, 1, 1, 0],
  );
  const section3Y = useTransform(
    scrollYProgress,
    [0.66, 0.76, 1],
    [40, 0, -20],
  );

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      {/* ===== STICKY BACKGROUND (100vh, stays for full 300vh) ===== */}
      <div className="sticky top-0 h-screen w-full">
        <LiveBackground />

        {/* ===== CONTENT OVERLAY (absolute positioning) ===== */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Section 1 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: section1Opacity,
              y: section1Y,
            }}
          >
            {section1}
          </motion.div>

          {/* Section 2 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: section2Opacity,
              y: section2Y,
            }}
          >
            {section2}
          </motion.div>

          {/* Section 3 */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity: section3Opacity,
              y: section3Y,
            }}
          >
            {section3}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import LiveBackground from "./LiveBackground";

export default function WeddingScrollSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll progress
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Animation timings for a single locked section
  const sStart = 0;
  const sFadeOut = 0.9;
  const sEnd = 1.0;

  const line1Opacity = useTransform(
    scrollYProgress,
    [sStart, sStart + 0.1, sFadeOut, sEnd],
    [0, 1, 1, 0],
  );
  const line2Opacity = useTransform(
    scrollYProgress,
    [sStart + 0.15, sStart + 0.25, sFadeOut, sEnd],
    [0, 1, 1, 0],
  );
  const line3Opacity = useTransform(
    scrollYProgress,
    [sStart + 0.3, sStart + 0.4, sFadeOut, sEnd],
    [0, 1, 1, 0],
  );
  const line4Opacity = useTransform(
    scrollYProgress,
    [sStart + 0.45, sStart + 0.55, sFadeOut, sEnd],
    [0, 1, 1, 0],
  );
  const line5Opacity = useTransform(
    scrollYProgress,
    [sStart + 0.6, sStart + 0.7, sFadeOut, sEnd],
    [0, 1, 1, 0],
  );
  const line6Opacity = useTransform(
    scrollYProgress,
    [sStart + 0.75, sStart + 0.85, sFadeOut, sEnd],
    [0, 1, 1, 0],
  );

  const sectionY = useTransform(scrollYProgress, [0, 1], [0, -30]);

  return (
    <div ref={containerRef} className="relative h-[200vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#1A1C1E]">
        <LiveBackground />

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            className="absolute inset-x-0 flex items-center justify-center px-6 md:px-12 pointer-events-auto"
            style={{ y: sectionY }}
          >
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="font-manrope font-normal text-gh-h1 leading-[1.2] md:leading-[1.2] text-white/90 mb-12">
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

              {/* Vertical line indicator */}
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 100 }}
                transition={{ duration: 1.5, delay: 0.5 }}
                className="w-px bg-white/20 mx-auto mt-12"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

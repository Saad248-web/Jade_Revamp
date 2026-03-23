"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowLeft, Headset } from "lucide-react";
import LiveBackground from "./LiveBackground";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import PrimaryButton from "./PrimaryButton";

export interface ScrollSlide {
  label?: string;
  lines: string[];
  button?: {
    label: string;
    href: string;
  };
}

interface ScrollSectionComposerProps {
  slides: ScrollSlide[];
  theme?: "golden" | "white";
  background?: ReactNode;
  height?: string; // e.g. "400vh"
  showNavigation?: boolean;
}

const ScrollButton = ({ href, label }: { href: string; label: string }) => (
  <div className="pointer-events-auto">
    <PrimaryButton href={href}>{label}</PrimaryButton>
  </div>
);

const SlideLines = ({
  slide,
  progress,
  start,
  end,
  index,
  totalSlides,
}: {
  slide: ScrollSlide;
  progress: MotionValue<number>;
  start: number;
  end: number;
  index: number;
  totalSlides: number;
}) => {
  const span = end - start;
  // Calculate when all lines finished appearing
  const linesFinishedAt = start + slide.lines.length * 0.015 + 0.05;
  // fadeOut is sooner: either 30% after lines finish or 15% before end
  const fadeOut = Math.min(linesFinishedAt + 0.3, end - span * 0.1);

  // Locking/Y-parallax logic
  const yInput =
    index === 0
      ? [start, fadeOut, end]
      : [start - span * 0.2, start, fadeOut, end];
  const yOutput = index === 0 ? [0, 0, -50] : [100, 0, 0, -80];

  const y = useTransform(progress, yInput, yOutput);

  return (
    <motion.div
      className="absolute inset-x-0 flex items-center justify-center px-6 md:px-12 pointer-events-none"
      style={{ y }}
    >
      <div className="text-center w-full max-w-[90vw] md:max-w-4xl mx-auto mb-12">
        {slide.label && (
          <motion.p
            style={{
              opacity: useTransform(
                progress,
                [start, start + 0.05, fadeOut, end],
                [0, 1, 1, 0],
              ),
            }}
            className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-12 text-center"
          >
            {slide.label}
          </motion.p>
        )}
        <h2 className="font-manrope font-normal text-gh-scroll leading-[1.6] tracking-[0.01em] text-white/90 mb-12">
          {slide.lines.map((line, lineIdx) => {
            const lineStart = start + lineIdx * 0.015;
            const lineShow = lineStart + 0.02;

            const opacity = useTransform(
              progress,
              [start, lineStart, lineShow, fadeOut, end],
              [0, 0, 1, 1, 0],
            );

            return (
              <motion.div key={lineIdx} style={{ opacity }}>
                {line}
              </motion.div>
            );
          })}
        </h2>

        {slide.button && (
          <motion.div
            style={{
              opacity: useTransform(
                progress,
                [
                  start + slide.lines.length * 0.015,
                  start + slide.lines.length * 0.015 + 0.02,
                  fadeOut,
                  end,
                ],
                [0, 1, 1, 0],
              ),
            }}
          >
            <ScrollButton href={slide.button.href} label={slide.button.label} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default function ScrollSectionComposer({
  slides,
  theme = "golden",
  background = <LiveBackground />,
  height = "400vh",
  showNavigation = false,
}: ScrollSectionComposerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const total = slides.length;
  const segmentSpan = 1.0 / total;
  const gap = segmentSpan * 0.1;

  return (
    <div ref={containerRef} className="relative" style={{ height }}>
      <NavbarThemeTrigger theme={theme} sectionRef={containerRef} />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {background}

        {/* Floating Icons - Only if showNavigation is true */}
        {showNavigation && (
          <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-6 md:p-12">
            <button
              onClick={() => window.history.back()}
              className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
              <Headset className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {slides.map((slide, i) => {
            const start = i * segmentSpan;
            const end = i === total - 1 ? 1.0 : (i + 1) * segmentSpan - gap;

            return (
              <SlideLines
                key={i}
                slide={slide}
                progress={scrollYProgress}
                start={start}
                end={end}
                index={i}
                totalSlides={total}
              />
            );
          })}
        </div>

        {/* Scroll Indicator at the bottom */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
          <div className="h-24 w-[1px] bg-gradient-to-b from-white/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}

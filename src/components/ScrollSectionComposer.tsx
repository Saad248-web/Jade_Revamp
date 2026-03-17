"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
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
  // First slide stays at 0 until fade out
  // Middle/Last slides come from 100 to 0, stay, then move to -80
  const yInput =
    index === 0
      ? [start, fadeOut, end]
      : [start - span * 0.2, start, fadeOut, end];
  const yOutput = index === 0 ? [0, 0, -50] : [100, 0, 0, -80];

  const y = useTransform(progress, yInput, yOutput);

  return (
    <motion.div
      className="absolute inset-x-0 flex items-center justify-center px-2 md:px-6 pointer-events-none"
      style={{ y }}
    >
      <div className="text-center w-full max-w-[95vw] md:max-w-6xl mx-auto">
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
        <h2 className="font-manrope font-normal text-gh-scroll lg:text-gh-scroll leading-[1.6] md:leading-[1.6] tracking-[0.01em] text-white/90 mb-12">
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
}: ScrollSectionComposerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const total = slides.length;
  // Calculate segments
  // We want slides to be active for a portion of the scroll.
  // In UnifiedScrollSection, S1: 0-0.3, S2: 0.35-0.65, S3: 0.7-1.0
  // Gap is 0.05. Active span is ~0.3.
  const segmentSpan = 1.0 / total;
  const activeSpan = segmentSpan * 0.9; // 90% of segment is active/fade
  const gap = segmentSpan * 0.1;

  return (
    <div ref={containerRef} className="relative" style={{ height }}>
      <NavbarThemeTrigger theme={theme} sectionRef={containerRef} />

      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {background}

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
      </div>
    </div>
  );
}

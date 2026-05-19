"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { ArrowLeft, MessageCircle } from "lucide-react";
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
  /** "early" — copy in by ~50% scroll, then holds locked before exit (philosophy) */
  fadeTiming?: "default" | "early";
  showNavigation?: boolean;
  showScrollIndicator?: boolean;
  scrollIndicatorText?: string;
}

const ScrollButton = ({ href, label }: { href: string; label: string }) => (
  <div className="pointer-events-auto">
    <PrimaryButton href={href}>{label}</PrimaryButton>
  </div>
);

const StaggeredLine = ({
  line,
  progress,
  fadeInStart,
  fadeInEnd,
}: {
  line: string;
  progress: MotionValue<number>;
  fadeInStart: number;
  fadeInEnd: number;
}) => {
  const opacity = useTransform(progress, [fadeInStart, fadeInEnd], [0, 1]);
  const y = useTransform(progress, [fadeInStart, fadeInEnd], [16, 0]);
  return (
    <motion.p
      className="m-0"
      style={{ opacity, y, willChange: "opacity, transform" }}
    >
      {line}
    </motion.p>
  );
};

const SlideLines = ({
  slide,
  progress,
  start,
  end,
  index,
  fadeTiming,
}: {
  slide: ScrollSlide;
  progress: MotionValue<number>;
  start: number;
  end: number;
  index: number;
  totalSlides: number;
  fadeTiming: "default" | "early";
}) => {
  const span = end - start;
  const early = fadeTiming === "early";
  // Philosophy: longer locked plateau before exit; default keeps prior 90% hold.
  const fadeOut = end - span * (early ? 0.14 : 0.1);

  // Locking / Y parallax (slide-level enter & exit)
  const yInput =
    index === 0
      ? [start, fadeOut, end]
      : [start - span * 0.2, start, fadeOut, end];
  const yOutput = index === 0 ? [0, 0, -50] : [100, 0, 0, -80];

  const y = useTransform(progress, yInput, yOutput);

  // Slide-level: hold at full opacity through the lock window, fade only at end.
  const opacity = useTransform(progress, [start, fadeOut, end], [1, 1, 0]);
  const scale = useTransform(
    progress,
    [start, start + span * (early ? 0.12 : 0.2), fadeOut, end],
    [0.985, 1, 1, 0.995],
  );
  const blurPx = useTransform(
    progress,
    [start, start + span * (early ? 0.12 : 0.2), fadeOut, end],
    [6, 0, 0, 4],
  );

  // Per-line fade-in: early = quick reveal, then idle until slide fade-out.
  const labelOffset = early ? (slide.label ? 0.06 : 0.03) : slide.label ? 0.15 : 0.05;
  const tail = early ? 0.22 : 0.15;
  const lineCount = Math.max(slide.lines.length, 1);
  const perLineWindow = (1 - labelOffset - tail) / lineCount;
  const fadeWidth = perLineWindow * (early ? 0.72 : 0.85);

  const labelOpacity = useTransform(
    progress,
    [start + span * 0.02, start + span * 0.12],
    [0, 1],
  );
  const labelY = useTransform(
    progress,
    [start + span * 0.02, start + span * 0.12],
    [12, 0],
  );

  const buttonStart =
    start + span * (labelOffset + lineCount * perLineWindow + 0.04);
  const buttonEnd = Math.min(buttonStart + span * 0.12, fadeOut);
  const buttonOpacity = useTransform(
    progress,
    [buttonStart, buttonEnd],
    [0, 1],
  );

  return (
    <motion.div
      className="absolute inset-x-0 flex items-center justify-center px-6 md:px-12 pointer-events-none"
      style={{ y }}
    >
      <motion.div
        className="text-center w-full max-w-[90vw] md:max-w-4xl mx-auto mb-10"
        style={{
          opacity,
          scale,
          filter: useTransform(blurPx, (v) => `blur(${v}px)`),
          willChange: "transform, filter, opacity",
        }}
      >
        {slide.label && (
          <motion.p
            className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-5 md:mb-6 text-center"
            style={{ opacity: labelOpacity, y: labelY }}
          >
            {slide.label}
          </motion.p>
        )}

        <motion.div
          className={`font-manrope font-normal text-[16px] sm:text-[17px] md:text-[19px] leading-[1.7] md:leading-[1.75] tracking-[0.01em] text-[#FAFAFA]/90 max-w-[340px] sm:max-w-xl md:max-w-2xl mx-auto flex flex-col${slide.lines.length > 1 ? " gap-6 md:gap-7" : ""}${slide.button ? " mb-6 md:mb-8" : ""}`}
        >
          {slide.lines.map((line, lineIdx) => {
            const fadeInStart =
              start + span * (labelOffset + lineIdx * perLineWindow);
            const fadeInEnd = fadeInStart + span * fadeWidth;
            return (
              <StaggeredLine
                key={`${line}-${lineIdx}`}
                line={line}
                progress={progress}
                fadeInStart={fadeInStart}
                fadeInEnd={fadeInEnd}
              />
            );
          })}
        </motion.div>

        {slide.button && (
          <motion.div
            className="pointer-events-auto"
            style={{ opacity: buttonOpacity }}
          >
            <ScrollButton href={slide.button.href} label={slide.button.label} />
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function ScrollSectionComposer({
  slides,
  theme = "golden",
  background = <LiveBackground />,
  height = "400vh",
  fadeTiming = "default",
  showNavigation = false,
  showScrollIndicator = true,
  scrollIndicatorText,
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

      <div className="sticky top-0 min-h-screen w-full overflow-hidden pb-8">
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
              <MessageCircle className="w-5 h-5" aria-hidden />
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
                fadeTiming={fadeTiming}
              />
            );
          })}
        </div>

        {/* Scroll Indicator at the bottom */}
        {showScrollIndicator && (
          <div className="absolute max-lg:bottom-[calc(6rem+env(safe-area-inset-bottom))] lg:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5">
            <div className="h-16 md:h-24 w-[1px] bg-gradient-to-b from-transparent to-white/40" />
            {scrollIndicatorText && (
              <span className="font-manrope text-[12px] tracking-[0.2em] uppercase text-white/50 whitespace-nowrap">
                {scrollIndicatorText}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

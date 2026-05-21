"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import clsx from "clsx";
import JadeImage from "@/components/ui/JadeImage";
import CarouselSwipeLayer from "@/components/ui/CarouselSwipeLayer";
import { CAROUSEL_CROSSFADE_FAST } from "@/lib/carouselMotion";

type VillaDetailImageFrameProps = {
  imageKey: string;
  src: string;
  alt: string;
  onPrev: () => void;
  onNext: () => void;
  slideCount: number;
  aspectClassName?: string;
  imageClassName?: string;
  sizes?: string;
  onPauseAuto?: () => void;
  onResumeAuto?: () => void;
  children?: React.ReactNode;
};

export default function VillaDetailImageFrame({
  imageKey,
  src,
  alt,
  onPrev,
  onNext,
  slideCount,
  aspectClassName = "aspect-[3/4] md:aspect-[16/9]",
  imageClassName = "object-cover object-center",
  sizes = "(max-width: 768px) 100vw, 800px",
  onPauseAuto,
  onResumeAuto,
  children,
}: VillaDetailImageFrameProps) {
  const reducedMotion = useReducedMotion();
  const { duration, ease } = CAROUSEL_CROSSFADE_FAST;
  const transition = reducedMotion
    ? { duration: 0.01 }
    : { duration, ease };

  return (
    <div
      className={clsx(
        "relative w-full rounded-none overflow-hidden group bg-black/30",
        aspectClassName,
      )}
      onMouseEnter={onPauseAuto}
      onMouseLeave={onResumeAuto}
      onFocusCapture={onPauseAuto}
      onBlurCapture={onResumeAuto}
    >
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={imageKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={transition}
          className="absolute inset-0"
        >
          <JadeImage
            src={src}
            alt={alt}
            fill
            className={imageClassName}
            sizes={sizes}
            loading="lazy"
          />
        </motion.div>
      </AnimatePresence>
      <CarouselSwipeLayer
        onPrev={onPrev}
        onNext={onNext}
        slideCount={slideCount}
        className="absolute inset-0 z-[10] touch-pan-y"
      />
      {children}
    </div>
  );
}

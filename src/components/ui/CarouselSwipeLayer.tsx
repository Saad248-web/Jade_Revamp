"use client";

import { motion } from "framer-motion";
import { useCarouselSwipeDragProps } from "@/lib/carouselMotion";

type CarouselSwipeLayerProps = {
  onPrev: () => void;
  onNext: () => void;
  slideCount: number;
  className?: string;
};

export default function CarouselSwipeLayer({
  onPrev,
  onNext,
  slideCount,
  className = "absolute inset-0 z-10 touch-pan-y",
}: CarouselSwipeLayerProps) {
  const dragProps = useCarouselSwipeDragProps(
    onPrev,
    onNext,
    slideCount > 1,
  );

  if (slideCount <= 1 || dragProps.drag === false) return null;

  return <motion.div aria-hidden className={className} {...dragProps} />;
}

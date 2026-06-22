"use client";

import { useRef } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import JadeImage from "@/components/ui/JadeImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import NavbarThemeTrigger from "@/components/NavbarThemeTrigger";
import { experiencePanelTextOpacity } from "@/lib/experiencePanelMotion";
import { useMediaMinLg } from "@/lib/useMediaMinLg";
import { useScrollLinkedPanelOffset } from "@/lib/useScrollLinkedPanelOffset";
import {
  scrollLinkedPanelBodyClass,
  scrollLinkedPanelCtaClass,
  scrollLinkedPanelImageFrameClass,
  scrollLinkedPanelOuterClass,
  scrollLinkedPanelSlideClass,
  scrollLinkedPanelSlideInteractiveClass,
  scrollLinkedPanelStackClass,
  scrollLinkedPanelStackWrapClass,
  scrollLinkedPanelTextBlockClass,
} from "@/lib/scrollLinkedPanelLayout";

export type ScrollLinkedPanelData = {
  id: string;
  title: string;
  subtext: string;
  cta: string;
  href: string;
  image: string;
  mobileImage?: string;
};

export type ScrollLinkedPanelCardProps = {
  data: ScrollLinkedPanelData;
  index: number;
  panelProgress: MotionValue<number>;
  totalSteps: number;
  panelCount: number;
  imageFrameClassName?: string;
  gapVariant?: "standard" | "wide";
  /** Mobile snap — one centred card, no neighbour peek (Featured Villas parity). */
  snapCentered?: boolean;
};

export default function ScrollLinkedPanelCard({
  data,
  index,
  panelProgress,
  totalSteps,
  panelCount,
  imageFrameClassName = scrollLinkedPanelImageFrameClass,
  gapVariant = "standard",
  snapCentered = false,
}: ScrollLinkedPanelCardProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const isLg = useMediaMinLg();
  const panelImageSrc = data.mobileImage
    ? isLg
      ? data.image
      : data.mobileImage
    : data.image;

  const stackWrapRef = useRef<HTMLDivElement>(null);
  const { offsetPx } = useScrollLinkedPanelOffset(stackWrapRef, {
    variant: gapVariant,
    snapCentered: snapCentered && !isLg,
  });

  const x = useTransform(panelProgress, (p: number) => {
    return (index - p * totalSteps) * offsetPx;
  });

  const zIndex = useTransform(panelProgress, (p: number) => {
    const centered = Math.min(Math.round(p * totalSteps), panelCount - 1);
    return index === centered ? 100 : index * 10;
  });

  const textOpacity = useTransform(panelProgress, (p: number) =>
    experiencePanelTextOpacity(p, index, totalSteps),
  );

  return (
    <motion.div
      style={{ x, zIndex, willChange: "transform" }}
      className={`${scrollLinkedPanelSlideClass} bg-transparent`}
    >
      <div className={scrollLinkedPanelSlideInteractiveClass}>
        <NavbarThemeTrigger theme="white" sectionRef={panelRef} />
        <div className={scrollLinkedPanelOuterClass}>
          <div ref={stackWrapRef} className={scrollLinkedPanelStackWrapClass}>
            <div className={scrollLinkedPanelStackClass}>
              <div className={imageFrameClassName}>
                <div className="w-full h-full relative">
                  <JadeImage
                    src={panelImageSrc}
                    alt={data.title}
                    fill
                    className="object-cover"
                    sizes={
                      data.mobileImage
                        ? isLg
                          ? "600px"
                          : "(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 600px"
                        : "(max-width: 640px) 100vw, (max-width: 1024px) 70vw, 600px"
                    }
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>
              </div>

              <motion.div
                style={{ opacity: textOpacity }}
                className={scrollLinkedPanelTextBlockClass}
              >
                <h2 className="font-philosopher text-gh-h2 text-white leading-none mb-2 lg:mb-2.5">
                  {data.title}
                </h2>
                <p className={scrollLinkedPanelBodyClass}>{data.subtext}</p>
                <div className="w-full">
                  <Link href={data.href} className={scrollLinkedPanelCtaClass}>
                    {data.cta} <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

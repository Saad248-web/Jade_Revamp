"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";
import JadeImage from "@/components/ui/JadeImage";
import CarouselSwipeLayer from "@/components/ui/CarouselSwipeLayer";
import type { VillaActivity } from "@/lib/types";
import VillaDetailSection from "./VillaDetailSection";
import { VILLA_DETAIL_SPACING } from "./villaDetailSpacing";

const vd = VILLA_DETAIL_SPACING;

type Props = {
  activity: VillaActivity;
  slideCount: number;
  fallbackImage: string;
  onPrev: () => void;
  onNext: () => void;
  onEnquire: () => void;
  isValidImage: (url?: string) => boolean;
};

export default function VillaDetailExperienceCarousel({
  activity,
  slideCount,
  fallbackImage,
  onPrev,
  onNext,
  onEnquire,
  isValidImage,
}: Props) {
  const src = isValidImage(activity.image) ? activity.image : fallbackImage;

  return (
    <VillaDetailSection id="experiences" variant="charcoal">
      <div className="flex justify-between items-end gap-3">
        <h3 className={vd.sectionHeading}>Experiences</h3>
        {slideCount > 1 ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onPrev}
              className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Previous experience"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onNext}
              className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Next experience"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : null}
      </div>
      <div className="relative aspect-[3/4] md:aspect-[16/9] w-full rounded-none overflow-hidden group bg-black/30">
        {src ? (
          <JadeImage
            src={src}
            alt={activity.title}
            fill
            className="object-cover object-center transition-transform duration-700 opacity-90 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 800px"
            loading="lazy"
          />
        ) : null}
        <div className="absolute inset-x-0 bottom-0 h-2/3 md:h-1/2 bg-gradient-to-t from-jade-charcoal/95 via-jade-charcoal/50 to-transparent z-10" />
        <CarouselSwipeLayer
          onPrev={onPrev}
          onNext={onNext}
          slideCount={slideCount}
          className="absolute inset-0 z-[15] touch-pan-y"
        />
        <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col items-center justify-end text-center z-20 gap-1.5">
          <p className={vd.mediaCaption}>{activity.title}</p>
          {activity.description ? (
            <p className={clsx(vd.mediaDescription, "max-w-2xl")}>
              {activity.description}
            </p>
          ) : null}
        </div>
      </div>
      <button
        type="button"
        onClick={onEnquire}
        className="w-full py-4 bg-[#EFCD62] text-black font-manrope font-bold text-[11px] md:text-gh-label tracking-[0.2em] uppercase flex items-center justify-center gap-2 rounded-none hover:bg-[#dfbd52] transition-colors"
      >
        ENQUIRE
        <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
      </button>
    </VillaDetailSection>
  );
}

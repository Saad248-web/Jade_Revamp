"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import clsx from "clsx";
import type { VillaActivity } from "@/lib/types";
import VillaDetailSection from "./VillaDetailSection";
import VillaDetailImageFrame from "./VillaDetailImageFrame";
import { VILLA_DETAIL_SPACING } from "./villaDetailSpacing";

const vd = VILLA_DETAIL_SPACING;

type Props = {
  activity: VillaActivity;
  slideCount: number;
  activityIndex: number;
  fallbackImage: string;
  onPrev: () => void;
  onNext: () => void;
  onPauseAuto?: () => void;
  onResumeAuto?: () => void;
  onEnquire: () => void;
  isValidImage: (url?: string) => boolean;
};

export default function VillaDetailExperienceCarousel({
  activity,
  slideCount,
  activityIndex,
  fallbackImage,
  onPrev,
  onNext,
  onPauseAuto,
  onResumeAuto,
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
      {src ? (
        <VillaDetailImageFrame
          imageKey={`${activityIndex}-${src}`}
          src={src}
          alt={activity.title}
          onPrev={onPrev}
          onNext={onNext}
          slideCount={slideCount}
          imageClassName="object-cover object-center opacity-90"
          onPauseAuto={onPauseAuto}
          onResumeAuto={onResumeAuto}
        >
          <div className="absolute inset-x-0 bottom-0 h-2/3 md:h-1/2 bg-gradient-to-t from-jade-charcoal/95 via-jade-charcoal/50 to-transparent z-[5] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col items-center justify-end text-center z-20 gap-1.5 pointer-events-none">
            <p className={vd.mediaCaption}>{activity.title}</p>
            {activity.description ? (
              <p className={clsx(vd.mediaDescription, "max-w-2xl")}>
                {activity.description}
              </p>
            ) : null}
          </div>
        </VillaDetailImageFrame>
      ) : null}
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

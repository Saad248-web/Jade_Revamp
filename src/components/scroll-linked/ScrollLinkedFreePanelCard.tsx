"use client";

import JadeImage from "@/components/ui/JadeImage";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import type { ScrollLinkedPanelData } from "@/components/scroll-linked/ScrollLinkedPanelCard";
import {
  scrollLinkedPanelBodyClass,
  scrollLinkedPanelCtaClass,
  scrollLinkedPanelStackClass,
  scrollLinkedPanelStackWideClass,
  scrollLinkedPanelTextBlockClass,
} from "@/lib/scrollLinkedPanelLayout";

const MOBILE_RAIL_CARD_WIDTH = "w-[min(88vw,400px)]";

const mobileRailImageFrameClass =
  "relative w-full shrink-0 overflow-hidden rounded-none bg-black shadow-2xl aspect-[343/420] sm:aspect-[4/3]";

export type ScrollLinkedFreePanelCardProps = {
  data: ScrollLinkedPanelData;
  gapVariant?: "standard" | "wide";
  isFirst?: boolean;
};

export default function ScrollLinkedFreePanelCard({
  data,
  gapVariant = "standard",
  isFirst = false,
}: ScrollLinkedFreePanelCardProps) {
  const panelImageSrc = data.mobileImage ?? data.image;
  const stackClass =
    gapVariant === "wide"
      ? scrollLinkedPanelStackWideClass
      : scrollLinkedPanelStackClass;

  return (
    <article
      className={clsx(
        "snap-start flex-shrink-0 jade-hscroll-view-item",
        MOBILE_RAIL_CARD_WIDTH,
        isFirst && "pl-6 sm:pl-8",
      )}
    >
      <div className="flex w-full flex-col gap-2">
        <div className={mobileRailImageFrameClass}>
          <div className="relative h-full w-full">
            <JadeImage
              src={panelImageSrc}
              alt={data.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 88vw, 400px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        </div>

        <div className={stackClass}>
          <div className={scrollLinkedPanelTextBlockClass}>
            <h2 className="font-philosopher text-gh-h2 text-white leading-none mb-2">
              {data.title}
            </h2>
            <p className={scrollLinkedPanelBodyClass}>{data.subtext}</p>
            <div className="w-full">
              <Link href={data.href} className={scrollLinkedPanelCtaClass}>
                {data.cta} <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

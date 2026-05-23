"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import HorizontalScrollRail from "@/components/ui/HorizontalScrollRail";
import { WEEKEND_THEMED_VILLAS } from "@/data/weekend/weekendThemedVillas";

const CARD_COUNT = WEEKEND_THEMED_VILLAS.length;

const sectionVars = {
  "--villa-gap": "clamp(14px, 2.2vw, 28px)",
  "--villa-card-w": `clamp(220px, calc((100% - (${CARD_COUNT} - 1) * var(--villa-gap)) / ${CARD_COUNT}), 320px)`,
} as CSSProperties;

export default function WeekendThemedVillasSection() {
  return (
    <section
      id="themed-villa-retreats"
      className="bg-[#141517] border-t border-white/5 overflow-hidden flex flex-col min-h-[80dvh] max-h-[85dvh] h-[85dvh] lg:min-h-[100dvh] lg:max-h-[100dvh] lg:h-[100dvh]"
      style={sectionVars}
    >
      <header className="shrink-0 text-center px-6 pt-5 md:pt-8 pb-3 md:pb-4">
        <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase mb-2">
          OUR VILLA RETREATS
        </p>
        <h2 className="text-gh-h2 font-philosopher text-white leading-tight">
          Themed Villa Retreats By Jade
        </h2>
      </header>

      <div className="flex-1 min-h-0 w-full px-6 lg:px-10 flex items-center justify-center">
        <HorizontalScrollRail
          fadeFrom="#141517"
          className="w-full max-w-[1320px] mx-auto lg:overflow-visible"
          trackClassName="w-full max-w-[1320px] mx-auto items-end justify-start lg:justify-center gap-[var(--villa-gap)] pb-2 scroll-pr-10 lg:overflow-x-visible"
        >
          {WEEKEND_THEMED_VILLAS.map((villa) => (
            <article
              key={villa.href}
              className="group flex flex-col shrink-0 jade-hscroll-view-item w-[clamp(220px,48vw,300px)] lg:shrink lg:w-[var(--villa-card-w)] lg:max-w-[320px] lg:min-w-[220px]"
            >
              <Link
                href={villa.href}
                className="flex flex-col cursor-pointer"
              >
                <div className="relative aspect-[5/6] w-full max-h-[min(42dvh,340px)] lg:max-h-[min(48vh,380px)] overflow-hidden border border-white/5 group-hover:border-[#EFCD62]/30 transition-colors mb-2.5 lg:mb-3">
                  <Image
                    src={villa.image}
                    alt={villa.name}
                    fill
                    sizes="(max-width: 1024px) 48vw, 24vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <div className="shrink-0 pb-1">
                  <p
                    className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase text-left"
                    style={{ marginBottom: "clamp(4px, 0.64vw, 8px)" }}
                  >
                    {villa.tag}
                  </p>
                  <h3 className="text-gh-h3 font-philosopher text-white group-hover:text-[#EFCD62] transition-colors text-left leading-tight">
                    {villa.name}
                  </h3>
                </div>
              </Link>
            </article>
          ))}
        </HorizontalScrollRail>
      </div>

      <div className="shrink-0 px-6 pb-5 md:pb-6 pt-3 md:pt-4 flex justify-center">
        <PrimaryButton className="w-full max-w-xl text-gh-label" href="/villas">
          VIEW ALL VILLA RETREATS
        </PrimaryButton>
      </div>
    </section>
  );
}

"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import HorizontalScrollRail from "@/components/ui/HorizontalScrollRail";
import { VILLA_DETAIL_SPACING } from "@/components/villa/villaDetailSpacing";

const vd = VILLA_DETAIL_SPACING;

export type MenuDesktopCarouselSectionProps = {
  eyebrow: string;
  title: string;
  href: string;
  images: string[];
  imageAltPrefix: string;
};

/** Menu desktop preview — titled row + edge-bleed gallery (Spaces rail contract). */
export function MenuDesktopCarouselSection({
  eyebrow,
  title,
  href,
  images,
  imageAltPrefix,
}: MenuDesktopCarouselSectionProps) {
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = useCallback((direction: -1 | 1) => {
    const track = railRef.current;
    if (!track) return;
    const amount = Math.max(320, Math.round(track.clientWidth * 0.82));
    track.scrollBy({ left: direction * amount, behavior: "smooth" });
  }, []);

  const slides = images.length > 0 ? images : [""];

  return (
    <section className="flex flex-col gap-5">
      <div
        className={clsx(
          "flex w-full items-end justify-between gap-4",
          vd.gutterX,
        )}
      >
        <Link href={href} className="group flex min-w-0 flex-col">
          <p className="mb-1.5 font-manrope text-gh-label font-medium uppercase tracking-[0.2em] text-white/40">
            {eyebrow}
          </p>
          <div className="flex items-center gap-2">
            <h3
              style={{ fontWeight: 200 }}
              className="font-manrope text-gh-scroll capitalize tracking-wide text-white transition-colors group-hover:text-[#EFCD62] lg:text-gh-h2"
            >
              {title}
            </h3>
            <ChevronRight className="h-5 w-5 text-white/50 transition-colors group-hover:text-[#EFCD62]" />
          </div>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => scrollRail(-1)}
            aria-label={`Scroll ${title} images left`}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black md:h-12 md:w-12"
          >
            <ArrowLeft className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => scrollRail(1)}
            aria-label={`Scroll ${title} images right`}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/20 bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white hover:text-black md:h-12 md:w-12"
          >
            <ArrowRight className="h-4 w-4 md:h-5 md:w-5" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* Column-local rail: same left inset as title (no viewportEdgeAll — that misaligns in split layout) */}
      <div className="menu-desktop-hscroll-shell relative min-w-0 w-full">
        <HorizontalScrollRail
          ref={railRef}
          showFade
          patternFade
          cursorGrab
          className="menu-hscroll-fade min-h-0 w-full overflow-visible"
          trackClassName="flex snap-x snap-mandatory gap-3 pb-2 scrollbar-none scroll-pl-0 pl-0 md:gap-4"
        >
        {slides.map((src, idx) => (
          <Link
            key={`${href}-${idx}`}
            href={href}
            className="jade-hscroll-view-item group/img relative aspect-[16/10] min-w-[min(88vw,380px)] shrink-0 snap-start overflow-hidden bg-white/5 sm:min-w-[420px] lg:min-w-[480px]"
          >
            {src ? (
              <Image
                src={src}
                alt={`${imageAltPrefix} ${idx + 1}`}
                fill
                draggable={false}
                className="object-cover transition-transform duration-700 group-hover/img:scale-105"
                sizes="(max-width: 1024px) 88vw, 480px"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-bold uppercase tracking-widest text-white/10">
                Image coming soon
              </div>
            )}
          </Link>
        ))}
        </HorizontalScrollRail>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JadeImage from "@/components/ui/JadeImage";
import NavbarThemeTrigger from "@/components/NavbarThemeTrigger";
import PrimaryButton from "@/components/PrimaryButton";
import type { ScrollLinkedPanelData } from "@/components/scroll-linked/ScrollLinkedPanelCard";

export type MobileFreeCardRailProps = {
  panels: ScrollLinkedPanelData[];
  headerLabel: string;
  bgClassName: string;
  endCta: { label: string; href: string };
};

/**
 * Mobile-only horizontal card rail with NATIVE momentum scrolling — genuinely free,
 * decoupled from page scroll (no pinning, no scroll-linked transforms). Cards loosely
 * snap (proximity) without feeling sticky. Desktop keeps the scroll-linked section.
 */
export default function MobileFreeCardRail({
  panels,
  headerLabel,
  bgClassName,
  endCta,
}: MobileFreeCardRailProps) {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${bgClassName} pt-[clamp(2rem,7svh,3.25rem)] pb-[clamp(2rem,7svh,3.25rem)]`}
    >
      <NavbarThemeTrigger theme="white" sectionRef={sectionRef} />

      <div className="flex w-full flex-col items-center px-6 pb-[clamp(1rem,3svh,1.5rem)]">
        <span className="font-manrope text-gh-label tracking-[0.3em] uppercase font-semibold text-jade-gold drop-shadow-lg block text-center">
          {headerLabel}
        </span>
      </div>

      <div
        className="jade-hscroll-track flex snap-x snap-proximity gap-4 overflow-x-auto overflow-y-hidden scroll-px-6 px-6 pb-4"
        style={{ WebkitOverflowScrolling: "touch", overscrollBehaviorX: "contain" }}
      >
        {panels.map((panel) => (
          <article
            key={panel.id}
            className="flex w-[82vw] max-w-[420px] shrink-0 snap-center flex-col"
          >
            <div className="relative aspect-[3/4] max-h-[56svh] w-full overflow-hidden rounded-none bg-black shadow-2xl">
              <JadeImage
                src={panel.mobileImage ?? panel.image}
                alt={panel.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 82vw, 420px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="pt-4 text-left">
              <h2 className="font-philosopher text-gh-h2 text-white leading-none mb-2">
                {panel.title}
              </h2>
              <p className="font-manrope text-gh-body text-white/80 leading-relaxed line-clamp-3 mb-3">
                {panel.subtext}
              </p>
              <Link
                href={panel.href}
                className="inline-flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase"
              >
                {panel.cta} <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </article>
        ))}

        <div className="flex w-[70vw] max-w-[340px] shrink-0 snap-center items-center justify-center">
          <PrimaryButton
            href={endCta.href}
            width="section"
            className="shadow-[0_16px_40px_rgba(239,205,98,0.4)]"
          >
            <span className="font-bold whitespace-nowrap text-center">
              {endCta.label}
            </span>
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import ScrollSectionComposer, { ScrollSlide } from "./ScrollSectionComposer";
import LiveBackground from "./LiveBackground";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import GoldAccentLine from "@/components/ui/GoldAccentLine";

const slides: ScrollSlide[] = [
  {
    label: "OUR PHILOSOPHY",
    lines: [
      "Hospitainment is the blend of hospitality and entertainment through private, exclusive and experiential retreats.",
      "At Jade, guests enjoy curated villa stays brought to life through culinary, wellness and entertainment experiences.",
    ],
  },
];

/** Home page section 2 — philosophy scroll panel (OUR PHILOSOPHY). */
export default function UnifiedScrollSection() {
  const mobileRef = useRef<HTMLElement>(null);

  return (
    <>
      {/* Mobile: free, normal-scroll philosophy — no pinning / scroll-linking (no jump) */}
      <section
        ref={mobileRef}
        className="relative w-full overflow-hidden bg-[#050505] lg:hidden"
      >
        <GoldAccentLine className="relative z-[60]" />
        <NavbarThemeTrigger theme="golden" sectionRef={mobileRef} />
        <LiveBackground variant="static" />

        <div className="relative z-10 flex min-h-[78svh] flex-col items-center justify-center px-6 py-20 text-center">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-5">
            {slides[0].label}
          </p>
          <div className="font-manrope font-normal text-[16px] sm:text-[17px] leading-[1.7] tracking-[0.01em] text-[#FAFAFA]/90 max-w-[340px] sm:max-w-xl mx-auto flex flex-col gap-6">
            {slides[0].lines.map((line, i) => (
              <p key={i} className="m-0">
                {line}
              </p>
            ))}
          </div>
        </div>

        <GoldAccentLine className="relative z-[60]" />
      </section>

      {/* Desktop: scroll-linked reveal (unchanged) */}
      <div className="hidden lg:block">
        <ScrollSectionComposer
          slides={slides}
          height="260vh"
          fadeTiming="early"
          scrollEffects="performance"
          background={<LiveBackground />}
          showScrollIndicator
        />
      </div>
    </>
  );
}

"use client";

import { useId } from "react";
import LuxuryPattern from "@/components/LuxuryPattern";

type VillaDetailMeanderStripProps = {
  className?: string;
  /** Optional accent line below the pattern (e.g. green before pricing). */
  accentLine?: "green" | "none";
};

/** Horizontal gold lattice band — matches category bar / section dividers in villa detail mocks. */
export default function VillaDetailMeanderStrip({
  className = "",
  accentLine = "none",
}: VillaDetailMeanderStripProps) {
  const patternId = useId().replace(/:/g, "");

  return (
    <div className={`relative w-full ${className}`} aria-hidden="true">
      <div className="relative h-10 md:h-12 w-full overflow-hidden bg-jade-charcoal">
        <LuxuryPattern
          tileSize={72}
          opacity={0.38}
          patternId={`villa-meander-${patternId}`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-jade-charcoal/30 via-transparent to-jade-charcoal/80" />
      </div>
      {accentLine === "green" ? (
        <div className="h-[2px] w-full bg-jade-green" />
      ) : null}
    </div>
  );
}

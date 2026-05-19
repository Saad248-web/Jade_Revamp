"use client";

type VillaDetailMeanderStripProps = {
  className?: string;
  /** Optional accent line below the pattern (e.g. green before pricing). */
  accentLine?: "green" | "none";
};

/** Gold Greek-key band — tiles `public/assets/Sep_bar_design.svg` edge-to-edge */
export default function VillaDetailMeanderStrip({
  className = "",
  accentLine = "none",
}: VillaDetailMeanderStripProps) {
  return (
    <div className={`relative w-full ${className}`} aria-hidden="true">
      <div className="relative h-[23px] w-full overflow-hidden bg-jade-charcoal">
        <div
          className="absolute inset-0 bg-[url('/assets/Sep_bar_design.svg')] bg-repeat-x bg-[length:auto_23px] bg-center opacity-70"
          role="presentation"
        />
      </div>
      {accentLine === "green" ? (
        <div className="h-[2px] w-full bg-jade-green" />
      ) : null}
    </div>
  );
}

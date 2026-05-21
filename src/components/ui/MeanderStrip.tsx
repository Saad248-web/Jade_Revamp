"use client";

type MeanderStripProps = {
  className?: string;
  /** Optional accent line below the pattern (e.g. green before pricing). */
  accentLine?: "green" | "none";
  /** Bar fill behind the Greek-key tile — matches the section above when possible. */
  track?: "charcoal" | "green" | "deep";
};

const TRACK_CLASS: Record<NonNullable<MeanderStripProps["track"]>, string> = {
  charcoal: "bg-jade-charcoal/82",
  green: "bg-jade-green/82",
  deep: "bg-[#1A1C1E]/82",
};

/** Gold Greek-key band — tiles `public/assets/Sep_bar_design.svg` edge-to-edge */
export default function MeanderStrip({
  className = "",
  accentLine = "none",
  track = "charcoal",
}: MeanderStripProps) {
  return (
    <div
      className={`relative w-screen max-w-[100vw] shrink-0 left-1/2 -translate-x-1/2 ${className}`}
      aria-hidden="true"
    >
      <div className={`relative h-[23px] w-full ${TRACK_CLASS[track]}`}>
        <div
          className="pointer-events-none absolute inset-y-0 left-[-1px] right-[-1px] bg-[url('/assets/Sep_bar_design.svg')] bg-left bg-repeat-x bg-[length:auto_23px] opacity-50"
          role="presentation"
        />
      </div>
      {accentLine === "green" ? (
        <div className="h-[2px] w-full bg-jade-green" />
      ) : null}
    </div>
  );
}

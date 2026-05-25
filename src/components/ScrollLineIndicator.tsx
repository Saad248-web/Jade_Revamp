"use client";

import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import {
  SCROLL_LINE_INDICATOR_BOTTOM_CLASS,
  SCROLL_LINE_INDICATOR_MB_CLASS,
} from "@/lib/layoutSpacing";

export { SCROLL_LINE_INDICATOR_BOTTOM_CLASS, SCROLL_LINE_INDICATOR_MB_CLASS };

export type ScrollLineIndicatorProps = {
  /** Optional label (e.g. "SCROLL TO EXPERIENCES") */
  label?: string;
  /** Place label above or below the animated line */
  labelPosition?: "above" | "below";
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  labelClassName?: string;
  /** Loop duration in ms — default 2.8s */
  durationMs?: number;
  onClick?: () => void;
  children?: ReactNode;
  /** Absolute bottom offset above mobile nav (ScrollSectionComposer, heroes) */
  floating?: boolean;
};

const defaultLabelClass =
  "font-manrope text-[12px] tracking-[0.2em] uppercase text-white/50 whitespace-nowrap";

/**
 * Filler-line loader: grow → glide at full size → smooth shrink at end → loop.
 */
export function ScrollLineIndicator({
  label,
  labelPosition = "below",
  className,
  trackClassName,
  barClassName,
  labelClassName,
  durationMs = 2800,
  onClick,
  children,
  floating = false,
}: ScrollLineIndicatorProps) {
  const barStyle = {
    "--jade-scroll-line-duration": `${durationMs}ms`,
  } as CSSProperties;

  const labelEl =
    label != null ? (
      <span className={clsx(defaultLabelClass, labelClassName)}>{label}</span>
    ) : (
      children
    );

  const line = (
    <div
      className={clsx(
        "jade-scroll-line-track relative w-[1px] shrink-0 h-16 md:h-20",
        trackClassName,
      )}
      aria-hidden
    >
      <div className="jade-scroll-line-rail absolute inset-0 w-full rounded-full bg-white/25" />
      <div
        className={clsx(
          "jade-scroll-line-bar absolute inset-0 w-full rounded-full",
          barClassName ?? "bg-white",
        )}
        style={barStyle}
      />
    </div>
  );

  const content = (
    <>
      {labelPosition === "above" && labelEl}
      {line}
      {labelPosition === "below" && labelEl}
    </>
  );

  const rootClass = clsx(
    "flex flex-col items-center gap-3",
    onClick && "cursor-pointer hover:opacity-80 transition-opacity",
    floating &&
      `absolute left-1/2 z-20 -translate-x-1/2 ${SCROLL_LINE_INDICATOR_BOTTOM_CLASS}`,
    className,
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={rootClass}
        aria-label={label ?? "Scroll down"}
      >
        {content}
      </button>
    );
  }

  return <div className={rootClass}>{content}</div>;
}

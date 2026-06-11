"use client";

import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import {
  SCROLL_LINE_INDICATOR_BOTTOM_CLASS,
  SCROLL_LINE_INDICATOR_MB_CLASS,
} from "@/lib/layoutSpacing";
import {
  SCROLL_LINE_CAPTION_CLASS,
  SCROLL_LINE_CAPTION_JEWEL_CLASS,
  SCROLL_LINE_CAPTION_ROW_CLASS,
  SCROLL_LINE_CROWN_CLASS,
  SCROLL_LINE_DURATION_MS,
  SCROLL_LINE_INDICATOR_ROOT_GAP_CLASS,
  SCROLL_LINE_MOUSE_CLASS,
  SCROLL_LINE_TRACK_FILL_CLASS,
  SCROLL_LINE_TRACK_LINE_CLASS,
  SCROLL_LINE_WHEEL_CLASS,
} from "@/lib/scrollLineIndicatorTokens";

export { SCROLL_LINE_INDICATOR_BOTTOM_CLASS, SCROLL_LINE_INDICATOR_MB_CLASS };
export {
  SCROLL_LINE_DURATION_MS,
  SCROLL_LINE_INDICATOR_CLICKABLE_CLASS,
  SCROLL_LINE_INDICATOR_HERO_WRAPPER_CLASS,
  SCROLL_LINE_INDICATOR_ROOT_GAP_CLASS,
} from "@/lib/scrollLineIndicatorTokens";

export type ScrollLineIndicatorProps = {
  label?: string;
  labelPosition?: "above" | "below";
  showCaption?: boolean;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
  labelClassName?: string;
  durationMs?: number;
  onClick?: () => void;
  children?: ReactNode;
  floating?: boolean;
};

const customLabelClass =
  "font-manrope text-[11px] tracking-[0.28em] uppercase text-white/45 whitespace-nowrap text-center";

function ScrollCaption() {
  return (
    <div className={SCROLL_LINE_CAPTION_ROW_CLASS} aria-hidden>
      <span className={SCROLL_LINE_CAPTION_JEWEL_CLASS} />
      <span className={SCROLL_LINE_CAPTION_CLASS}>Scroll</span>
      <span className={SCROLL_LINE_CAPTION_JEWEL_CLASS} />
    </div>
  );
}

/**
 * Premium mouse scroll cue — wheel + track line restart loop together.
 */
export function ScrollLineIndicator({
  label,
  labelPosition = "below",
  showCaption = true,
  className,
  trackClassName,
  barClassName,
  labelClassName,
  durationMs = SCROLL_LINE_DURATION_MS,
  onClick,
  children,
  floating = false,
}: ScrollLineIndicatorProps) {
  const cueStyle = {
    "--jade-scroll-line-duration": `${durationMs}ms`,
  } as CSSProperties;

  const hasCustomLabel = label != null || children != null;

  const customLabelEl = hasCustomLabel ? (
    <span className={clsx(customLabelClass, labelClassName)}>
      {label ?? children}
    </span>
  ) : null;

  const content = (
    <div className={SCROLL_LINE_INDICATOR_ROOT_GAP_CLASS} style={cueStyle}>
      {labelPosition === "above" && customLabelEl}
      <div
        className={clsx(SCROLL_LINE_MOUSE_CLASS, trackClassName)}
        aria-hidden
      >
        <span className={SCROLL_LINE_CROWN_CLASS} />
        <span className={SCROLL_LINE_TRACK_LINE_CLASS} />
        <span className={SCROLL_LINE_TRACK_FILL_CLASS} />
        <div className={clsx(SCROLL_LINE_WHEEL_CLASS, barClassName)} />
      </div>
      {showCaption && !hasCustomLabel ? <ScrollCaption /> : null}
      {labelPosition === "below" && customLabelEl}
    </div>
  );

  const rootClass = clsx(
    "jade-scroll-cue inline-flex flex-col items-center justify-center opacity-[0.92] transition-[opacity,transform] duration-500 ease-out hover:opacity-100",
    onClick && "cursor-pointer",
    floating &&
      `absolute left-1/2 z-20 -translate-x-1/2 ${SCROLL_LINE_INDICATOR_BOTTOM_CLASS}`,
    className,
  );

  const ariaLabel = label ?? "Scroll down";

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={rootClass}
        aria-label={ariaLabel}
      >
        {content}
      </button>
    );
  }

  return <div className={rootClass}>{content}</div>;
}

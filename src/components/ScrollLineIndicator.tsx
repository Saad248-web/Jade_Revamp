"use client";

import clsx from "clsx";
import type { CSSProperties, ReactNode } from "react";
import {
  SCROLL_LINE_INDICATOR_BOTTOM_CLASS,
  SCROLL_LINE_INDICATOR_MB_CLASS,
} from "@/lib/layoutSpacing";
import {
  SCROLL_LINE_DOT_SIZE_PX,
  SCROLL_LINE_DURATION_MS,
  SCROLL_LINE_INDICATOR_ROOT_GAP_CLASS,
  SCROLL_LINE_MOUSE_CLASS,
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
  /** Optional label (e.g. "SCROLL TO EXPERIENCES") */
  label?: string;
  /** Place label above or below the indicator */
  labelPosition?: "above" | "below";
  className?: string;
  /** Extra classes on the mouse outline */
  trackClassName?: string;
  /** Extra classes on the animated wheel pill */
  barClassName?: string;
  labelClassName?: string;
  /** Wheel loop duration in ms — default 2.8s */
  durationMs?: number;
  onClick?: () => void;
  children?: ReactNode;
  /** Absolute bottom offset above mobile nav (ScrollSectionComposer, heroes) */
  floating?: boolean;
};

const defaultLabelClass =
  "font-manrope text-[12px] tracking-[0.2em] uppercase text-white/50 whitespace-nowrap";

const SCROLL_WHEEL_KEYFRAMES = `
  @keyframes jade-scroll-wheel-stretch {
    0% {
      transform: translateX(-50%) translateY(0) scaleX(1) scaleY(1);
    }
    40% {
      transform: translateX(-50%) translateY(10px) scaleX(1) scaleY(2.5);
    }
    85% {
      transform: translateX(-50%) translateY(24px) scaleX(1) scaleY(1);
    }
    100% {
      transform: translateX(-50%) translateY(24px) scaleX(1) scaleY(1);
    }
  }

  .jade-scroll-wheel {
    width: var(--jade-scroll-dot-size, 8px);
    min-width: var(--jade-scroll-dot-size, 8px);
    max-width: var(--jade-scroll-dot-size, 8px);
    height: var(--jade-scroll-dot-size, 8px);
    transform-origin: top center;
    animation: jade-scroll-wheel-stretch var(--jade-scroll-line-duration, 2.8s)
      ease-in-out infinite;
    backface-visibility: hidden;
    will-change: transform;
  }

  @media (prefers-reduced-motion: reduce) {
    .jade-scroll-wheel {
      animation: none;
      transform: translateX(-50%) translateY(0) scaleX(1) scaleY(1);
    }
  }
`;

/**
 * Mouse outline + wheel dot — stretch, glide, compress (pure CSS keyframes).
 */
export function ScrollLineIndicator({
  label,
  labelPosition = "below",
  className,
  trackClassName,
  barClassName,
  labelClassName,
  durationMs = SCROLL_LINE_DURATION_MS,
  onClick,
  children,
  floating = false,
}: ScrollLineIndicatorProps) {
  const mouseStyle = {
    "--jade-scroll-line-duration": `${durationMs}ms`,
    "--jade-scroll-dot-size": `${SCROLL_LINE_DOT_SIZE_PX}px`,
  } as CSSProperties;

  const labelEl =
    label != null ? (
      <span className={clsx(defaultLabelClass, labelClassName)}>{label}</span>
    ) : (
      children
    );

  const indicator = (
    <>
      <style>{SCROLL_WHEEL_KEYFRAMES}</style>
      <div
        className={clsx(SCROLL_LINE_MOUSE_CLASS, trackClassName)}
        style={mouseStyle}
        aria-hidden
      >
        <div className={clsx(SCROLL_LINE_WHEEL_CLASS, barClassName)} />
      </div>
    </>
  );

  const content = (
    <>
      {labelPosition === "above" && labelEl}
      {indicator}
      {labelPosition === "below" && labelEl}
    </>
  );

  const rootClass = clsx(
    "flex flex-col items-center",
    SCROLL_LINE_INDICATOR_ROOT_GAP_CLASS,
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

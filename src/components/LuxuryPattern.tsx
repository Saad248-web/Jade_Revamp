"use client";

import React, { memo } from "react";

export interface LuxuryPatternProps {
  /** Controls the size of each repeating tile in px. Default: 300 */
  patternSize?: number;
  /** Stroke/pattern color tint — currently unused (asset-driven). */
  strokeColor?: string;
  /** Background color rendered behind the pattern. Default: transparent (let parent show through) */
  backgroundColor?: string;
  /** Opacity of the pattern overlay. Default: 1 */
  opacity?: number;
  /** Extra Tailwind / CSS classes for the outer container */
  className?: string;
  /** Unique id — unused in CSS-tile mode but kept for API compat */
  patternId?: string;
  /**
   * Vertical edge fade distance so the pattern blends into the parent
   * background at the section's top/bottom edges (eliminates visible seams
   * against adjacent same-color sections without a pattern overlay).
   * Default: undefined (no mask).
   */
  edgeFade?: string;
  /** @deprecated use patternSize */
  tileSize?: number;
  width?: number;
  height?: number;
}

/**
 * LuxuryPattern — tiles the official `/assets/Design.png` as a transparent
 * geometric background overlay on the Jade Green base.
 *
 * The pattern uses `background-attachment: fixed` so the design stays
 * static while content scrolls over it, creating a parallax-like effect.
 */
const LuxuryPattern = memo(
  ({
    patternSize = 300,
    tileSize,
    backgroundColor = "transparent",
    opacity = 1,
    edgeFade,
    className = "",
  }: LuxuryPatternProps) => {
    const size = tileSize ?? patternSize;

    const fadeMask = edgeFade
      ? `linear-gradient(to bottom, transparent 0, black ${edgeFade}, black calc(100% - ${edgeFade}), transparent 100%)`
      : undefined;

    return (
      <div
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full pointer-events-none z-0 ${className}`}
        style={{
          opacity,
          backgroundColor,
          backgroundImage: "url(/assets/Design.png)",
          backgroundRepeat: "repeat",
          backgroundSize: `${size}px ${size}px`,
          backgroundAttachment: "fixed",
          ...(fadeMask
            ? {
                WebkitMaskImage: fadeMask,
                maskImage: fadeMask,
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskSize: "100% 100%",
                maskSize: "100% 100%",
              }
            : null),
        }}
      />
    );
  },
);

LuxuryPattern.displayName = "LuxuryPattern";

export default LuxuryPattern;

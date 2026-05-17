"use client";

import React, { memo } from "react";

export interface LuxuryPatternProps {
  /** Controls the size of each repeating tile in px. Default: 300 */
  patternSize?: number;
  /** Stroke/pattern color tint — currently unused (asset-driven). */
  strokeColor?: string;
  /** Background color rendered behind the pattern. Default: Jade Green */
  backgroundColor?: string;
  /** Opacity of the pattern overlay. Default: 1 */
  opacity?: number;
  /** Extra Tailwind / CSS classes for the outer container */
  className?: string;
  /** Unique id — unused in CSS-tile mode but kept for API compat */
  patternId?: string;
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
    backgroundColor = "#0B2C23",
    opacity = 1,
    className = "",
  }: LuxuryPatternProps) => {
    const size = tileSize ?? patternSize;

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
        }}
      />
    );
  },
);

LuxuryPattern.displayName = "LuxuryPattern";

export default LuxuryPattern;

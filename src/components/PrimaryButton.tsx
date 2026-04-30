import React from "react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  target?: string;
  rel?: string;
  withArrow?: boolean;
  className?: string;
  children: React.ReactNode;
}

/**
 * PrimaryButton — Advanced self-balancing CTA button.
 *
 * Behavior:
 * - Fills its parent container naturally (max-w-full) without ever
 *   overflowing or breaking through the frame.
 * - Uses viewport-scaled fluid padding (clamp) so it auto-balances
 *   its internal spacing on every screen size.
 * - Typography scales fluidly with clamp() for perfect readability.
 * - Pass `className` to override width (e.g. `w-full`) when the
 *   button should stretch to fill a specific layout slot.
 */
export default function PrimaryButton({
  href,
  target,
  rel,
  withArrow = true,
  className = "",
  children,
  ...props
}: PrimaryButtonProps) {
  const content = (
    <>
      {children}
      {withArrow && (
        <ArrowRight className="w-[clamp(16px,1.5vw,20px)] h-[clamp(16px,1.5vw,20px)] transition-transform duration-300 group-hover:translate-x-1 flex-shrink-0" />
      )}
    </>
  );

  const btn = (
    <button
      className={[
        // Core identity — gold solid CTA with 1px INSIDE stroke
        "group bg-[#EFCD62] text-black font-manrope font-bold",
        "ring-1 ring-inset ring-[#AC8831]",
        // Shape
        "rounded-none",
        // Self-balancing sizing: fit content, respect parent padding
        "inline-flex items-center justify-center gap-[clamp(6px,0.8vw,12px)]",
        "max-w-full box-border shrink-1",
        // Fluid padding: scales between mobile → desktop automatically
        "px-[clamp(12px,1.4vw,18px)] py-[clamp(12px,1.35vw,16px)]",
        // Fluid typography
        "text-gh-label tracking-[0.15em] uppercase",
        // Interaction
        "hover:bg-[#dfbd52] transition-all duration-300",
        // User overrides (w-full, custom sizing, etc.)
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {content}
    </button>
  );

  if (href) {
    return (
      <Link href={href} target={target} rel={rel}>
        {btn}
      </Link>
    );
  }

  return btn;
}

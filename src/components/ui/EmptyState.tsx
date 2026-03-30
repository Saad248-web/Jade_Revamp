"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  headline: string;
  subtext?: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export default function EmptyState({
  icon,
  headline,
  subtext,
  ctaLabel,
  onCta,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-5 py-24 text-center px-6">
      {icon && (
        <div className="w-16 h-16 text-white/20 flex items-center justify-center">
          {icon}
        </div>
      )}
      <h3 className="text-white font-philosopher text-gh-h3 leading-tight">
        {headline}
      </h3>
      {subtext && (
        <p className="text-white/50 font-manrope text-gh-desc max-w-xs">
          {subtext}
        </p>
      )}
      {ctaLabel && onCta && (
        <button
          onClick={onCta}
          className="mt-2 bg-jade-gold text-[#0D4032] font-manrope font-bold text-gh-label tracking-widest uppercase px-8 py-3 hover:bg-white transition-colors"
        >
          {ctaLabel}
        </button>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { GlassChromeButtonPanel } from "./GlassChromePanel";

interface GlassButtonProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  className?: string;
}

const GlassButton = ({
  icon,
  label,
  onClick,
  className = "",
}: GlassButtonProps) => {
  return (
    <GlassChromeButtonPanel
      onClick={onClick}
      className={`box-border flex h-12 min-h-12 w-full flex-1 transition-colors hover:brightness-[1.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent md:h-[52px] md:min-h-[52px] md:w-auto md:flex-initial md:min-w-[172px] ${className}`.trim()}
      contentClassName="items-center justify-center gap-2.5 px-3 font-manrope text-gh-label font-bold uppercase tracking-[0.2em] text-white sm:px-6 whitespace-nowrap"
    >
      {icon}
      <span>{label}</span>
    </GlassChromeButtonPanel>
  );
};

export default GlassButton;

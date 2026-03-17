"use client";

import React from "react";

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
    <button
      onClick={onClick}
      style={{
        backdropFilter: "blur(48px)",
        WebkitBackdropFilter: "blur(48px)",
      }}
      className={`flex items-center justify-center gap-3 bg-[#FAFAFA]/[0.08] border border-[#FAFAFA]/[0.12] text-white font-manrope text-gh-label md:text-gh-label font-bold tracking-[0.2em] uppercase px-6 h-[48px] md:h-[52px] w-full md:w-[165.5px] hover:bg-[#FAFAFA]/[0.15] transition-all shadow-2xl pointer-events-auto ${className}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
};

export default GlassButton;

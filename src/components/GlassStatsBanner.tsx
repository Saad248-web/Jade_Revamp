"use client";

import React from "react";

export interface HeroStat {
  value: string;
  label: string;
}

interface GlassStatsBannerProps {
  stats: HeroStat[];
  className?: string;
  /** Gap between the stats bar and the next element. Default is mb-16 */
  marginBottom?: string;
}

const GlassStatsBanner = ({
  stats,
  className = "",
  marginBottom = "mb-16",
}: GlassStatsBannerProps) => {
  return (
    <div
      className={`relative group mx-auto w-full max-w-[335px] md:max-w-[480px] lg:max-w-[540px] px-0 ${marginBottom} ${className}`}
    >
      {/* 1. Main Glass Container */}
      <div
        className="relative w-full h-[80px] md:h-[90px] lg:h-[104px] flex items-center justify-between px-3 md:px-8 overflow-hidden border border-transparent rounded-none"
        style={{
          background:
            "linear-gradient(135deg, rgba(250, 250, 250, 0.12) 0%, rgba(250, 250, 250, 0.05) 100%)",
          backdropFilter: "blur(70px)",
          WebkitBackdropFilter: "blur(70px)",
          boxShadow: "0px 1.2px 29.92px rgba(69, 42, 124, 0.10)",
        }}
      >
        {/* 2. Linear Gradient Stroke (Inside 1px) */}
        <div
          className="absolute inset-0 rounded-none pointer-events-none border-[1px]"
          style={{
            borderImageSource:
              "linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0.05) 100%)",
            borderImageSlice: 1,
          }}
        />

        {/* 3. The Texture (Noise Overlay) */}
        <div
          className="absolute inset-0 opacity-[0.15] mix-blend-overlay pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* 4. Content Sections */}
        {stats.map((stat, index) => (
          <React.Fragment key={index}>
            <div className="relative z-10 flex flex-col items-center text-center flex-1">
              <span className="text-[#FAFAFA]/90 text-[14px] xs:text-[16px] md:text-[20px] lg:text-[24px] font-manrope font-semibold tracking-tight leading-none">
                {stat.value}
              </span>
              <span className="text-[#FAFAFA]/90 text-[8px] xs:text-[9px] md:text-[10px] lg:text-[12px] font-manrope font-medium tracking-[0.1em] mt-1 lg:mt-2 leading-none whitespace-nowrap uppercase">
                {stat.label}
              </span>
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default GlassStatsBanner;

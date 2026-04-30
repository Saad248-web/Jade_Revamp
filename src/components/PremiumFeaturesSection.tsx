import React, { ReactNode } from "react";
import PrimaryButton from "@/components/PrimaryButton";

interface FeatureCard {
  tag: string;
  title: string;
  desc: string;
}

interface PremiumFeaturesSectionProps {
  subheading: string;
  heading: ReactNode;
  cards: FeatureCard[];
  footerText: string;
  ctaText: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  cardClassName?: string;
  alternateGold?: boolean;
}

export default function PremiumFeaturesSection({
  subheading,
  heading,
  cards,
  footerText,
  ctaText,
  ctaLink,
  onCtaClick,
  cardClassName = "bg-[#121417]",
  alternateGold = false,
}: PremiumFeaturesSectionProps) {
  return (
    <section className="flex flex-col items-center justify-center py-fluid-lg md:py-fluid-xl bg-[#1A1C1E]">
      <div className="max-w-7xl mx-auto px-4 w-full flex flex-col items-center">
        <div className="text-center mb-[40px]">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase mb-[14px] font-manrope">
            {subheading}
          </p>
          <h2 className="text-gh-h2 font-philosopher text-white leading-tight">
            {heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-[14px] mb-[40px] w-full px-4 md:px-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className={`group relative w-full h-[375px] border border-white/[0.05] p-8 flex flex-col justify-between overflow-hidden transition-all duration-500 hover:border-[#EFCD62]/30 ${cardClassName}`}
            >
              {/* Layer 1: Refined Linear Fill with Accurate Shiny Accents */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                {/* Base Gradient - Always present for the Premium "Glass/Shine" effect */}
                <div className="absolute inset-0 bg-[linear-gradient(135deg,#363A45_0%,#121417_100%)]" />

                {/* Alternating Shiny Champagne/Golden Accents - Always present if alternateGold is true */}
                {alternateGold && (
                  <>
                    {idx % 2 === 0 ? (
                      /* Top Left Accent */
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(239,205,98,0.25)_0%,rgba(239,205,98,0.05)_40%,transparent_70%)]" />
                    ) : (
                      /* Bottom Right Accent */
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_85%,rgba(239,205,98,0.25)_0%,rgba(239,205,98,0.05)_40%,transparent_70%)]" />
                    )}
                  </>
                )}

                {/* Ambient Center Glow for "Shine" */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,205,98,0.03)_0%,transparent_80%)]" />
              </div>

              {/* Layer 2: Geometric & Starry Texture (Figma Replicated) */}
              <div className="absolute inset-0 z-10 opacity-[0.12] pointer-events-none overflow-hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  className="w-full h-full"
                >
                  <defs>
                    <pattern
                      id="card-geo-luxury"
                      x="0"
                      y="0"
                      width="120"
                      height="120"
                      patternUnits="userSpaceOnUse"
                    >
                      {/* Diamonds */}
                      <path
                        d="M 60 15 L 105 60 L 60 105 L 15 60 Z"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.5"
                        opacity="0.3"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="1.2"
                        fill="white"
                        opacity="0.6"
                      />

                      {/* Stars/Dust */}
                      <circle cx="25" cy="25" r="0.4" fill="white" />
                      <circle cx="95" cy="35" r="0.6" fill="white" />
                      <circle cx="40" cy="80" r="0.5" fill="white" />
                      <circle cx="85" cy="95" r="0.3" fill="white" />

                      {/* Lens Flares / Halos */}
                      <circle
                        cx="60"
                        cy="60"
                        r="25"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.2"
                        opacity="0.08"
                      />
                      <circle
                        cx="60"
                        cy="60"
                        r="40"
                        fill="none"
                        stroke="white"
                        strokeWidth="0.1"
                        opacity="0.04"
                      />
                    </pattern>
                  </defs>
                  <rect
                    width="100%"
                    height="100%"
                    fill="url(#card-geo-luxury)"
                  />
                </svg>
              </div>

              {/* Layer 3: Noise Texture Overlay */}
              <div className="absolute inset-0 z-11 opacity-[0.08] pointer-events-none mix-blend-overlay">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                  className="w-full h-full"
                >
                  <filter id="card-noise-texture">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency="0.65"
                      numOctaves="3"
                      stitchTiles="stitch"
                    />
                  </filter>
                  <rect
                    width="100%"
                    height="100%"
                    filter="url(#card-noise-texture)"
                  />
                </svg>
              </div>

              <div className="relative z-20">
                <span className="text-[#A2A4A7] font-philosopher italic text-gh-desc mb-6 block tracking-wide">
                  {card.tag}
                </span>
                <h3 className="text-gh-h3 font-manrope font-bold text-white leading-[1.1] tracking-tight uppercase">
                  {card.title.split(" ").map((word, i) => (
                    <React.Fragment key={i}>
                      {word}
                      <br />
                    </React.Fragment>
                  ))}
                </h3>
              </div>

              <p className="relative z-20 text-white/40 font-manrope text-gh-label leading-relaxed max-w-[95%]">
                {card.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <p className="text-white/60 font-philosopher italic text-gh-body text-center max-w-3xl leading-relaxed mb-[24px]">
            {footerText}
          </p>

          <div className="w-full max-w-3xl mx-auto">
            <PrimaryButton
              href={ctaLink}
              onClick={onCtaClick}
              className="w-full h-[54px]"
            >
              {ctaText}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

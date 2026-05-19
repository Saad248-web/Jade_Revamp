"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import GlassButton from "./GlassButton";
import GlassStatsBanner from "./GlassStatsBanner";

export interface HeroButton {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export interface HeroStat {
  value: string;
  label: string;
}

interface ExperienceHeroProps {
  /** Background image path */
  backgroundImage?: string;
  /** Alt text for the background image */
  backgroundAlt: string;
  /** Main heading - supports line breaks via \n or ReactNode */
  heading: React.ReactNode;
  /** Description text below the heading */
  description: string;
  /** Two action buttons */
  buttons: [HeroButton, HeroButton];
  /** Optional stats bar (e.g. Corporate page) */
  stats?: HeroStat[];
  /** Optional extra content between description and buttons */
  children?: React.ReactNode;
}

const ExperienceHero = React.forwardRef<HTMLElement, ExperienceHeroProps>(
  (
    {
      backgroundImage,
      backgroundAlt,
      heading,
      description,
      buttons,
      stats,
      children,
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        className="major-section relative h-screen w-full flex flex-col items-center justify-end overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          {backgroundImage ? (
            <>
              <Image
                src={backgroundImage}
                alt={backgroundAlt}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#1A1C1E] to-[#0B2C23]" />
          )}
        </div>

        {/* Content - Grouped at the Bottom */}
        <div className="relative z-10 text-center px-6 page-wrapper flex flex-col items-center w-full max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-0 flex flex-col items-center w-full"
          >
            {/* Logo */}
            <div
              className="relative w-[45px] h-[45px]"
              style={{ marginBottom: "clamp(4px, 0.96vw, 8px)" }}
            >
              <Image
                src="/assets/White_Logo.png"
                alt="Jade Logo"
                fill
                className="object-contain"
                sizes="45px"
              />
            </div>

            {/* Heading */}
            <h1
              className="font-philosopher text-white text-gh-h1 leading-tight"
              style={{ marginBottom: "clamp(4px, 0.96vw, 8px)" }}
            >
              {heading}
            </h1>

            {/* Description */}
            <p
              className="font-manrope text-white/90 text-gh-body max-w-2xl leading-relaxed"
              style={{ marginBottom: "clamp(8px, 1.6vw, 12.8px)" }}
            >
              {description}
            </p>
          </motion.div>
          {stats && stats.length > 0 && (
            <GlassStatsBanner stats={stats} marginBottom="mb-4" />
          )}
          {/* Optional Extra Content */}
          {children}
          {/* Action Buttons */}
          <div className="flex flex-row items-center justify-center gap-2.5 w-full max-w-2xl mb-20 md:mb-12">
            {buttons.map((btn, idx) => (
              <GlassButton
                key={idx}
                icon={btn.icon}
                label={btn.label}
                onClick={btn.onClick}
              />
            ))}
          </div>
        </div>
      </section>
    );
  },
);

ExperienceHero.displayName = "ExperienceHero";

export default ExperienceHero;

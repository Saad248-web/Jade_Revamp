"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import GlassButton from "./GlassButton";
import GlassStatsBanner from "./GlassStatsBanner";
import {
  EXPERIENCE_HERO_CHROME_WIDTH_CLASS,
  EXPERIENCE_HERO_SAFE_BOTTOM_CLASS,
} from "@/lib/experienceHeroLayout";

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
        className="major-section relative flex min-h-[100dvh] min-h-screen w-full flex-col items-center justify-end overflow-hidden"
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
        <div
          className={`relative z-10 flex w-full max-w-5xl flex-col items-center px-4 text-center sm:px-6 page-wrapper ${EXPERIENCE_HERO_SAFE_BOTTOM_CLASS}`}
        >
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
          {/* Optional Extra Content (invisible observers, etc.) */}
          {children}
          {/* Stats strip + CTAs share one width lane so edges stay aligned */}
          <div
            className={`mt-4 flex w-full flex-col gap-2.5 sm:mt-5 ${EXPERIENCE_HERO_CHROME_WIDTH_CLASS}`}
          >
            {stats && stats.length > 0 && (
              <GlassStatsBanner stats={stats} marginBottom="mb-0" />
            )}
            <div className="flex w-full flex-row items-stretch justify-center gap-2.5">
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
        </div>
      </section>
    );
  },
);

ExperienceHero.displayName = "ExperienceHero";

export default ExperienceHero;

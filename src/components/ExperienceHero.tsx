"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

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
  backgroundImage: string;
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
          <Image
            src={backgroundImage}
            alt={backgroundAlt}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/40" />
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
            <div className="relative mb-4 w-[45px] h-[45px]">
              <Image
                src="/assets/White_Logo.png"
                alt="Jade Logo"
                fill
                className="object-contain"
                sizes="45px"
              />
            </div>

            {/* Heading */}
            <h1 className="font-philosopher text-white mb-2 text-gh-h1 leading-tight">
              {heading}
            </h1>

            {/* Description */}
            <p className="font-manrope text-white/90 text-gh-body max-w-2xl leading-relaxed mb-4">
              {description}
            </p>
          </motion.div>

          {/* Optional Stats Bar */}
          {stats && stats.length > 0 && (
            <div className="grid grid-cols-3 gap-4 w-full max-w-xl border border-white/10 bg-black/40 backdrop-blur-md rounded-none p-4 mb-4">
              {stats.map((stat, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center gap-1 ${
                    idx > 0 && idx < stats.length - 1
                      ? "border-l border-r border-white/10 px-4"
                      : ""
                  }`}
                >
                  <span className="text-gh-h2 font-philosopher text-white">
                    {stat.value}
                  </span>
                  <span className="text-white/60 text-gh-label uppercase tracking-widest text-center">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Optional Extra Content */}
          {children}

          {/* Action Buttons */}
          <div className="flex flex-row items-center justify-center gap-4 w-full max-w-2xl mb-24 md:mb-16">
            {buttons.map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.onClick}
                className="flex-1 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white font-manrope text-gh-label md:text-xs font-bold tracking-[0.2em] uppercase px-4 py-4 md:px-8 md:py-6 hover:bg-white/20 transition-all"
              >
                {btn.icon}
                <span>{btn.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    );
  },
);

ExperienceHero.displayName = "ExperienceHero";

export default ExperienceHero;

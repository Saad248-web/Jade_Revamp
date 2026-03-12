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

export default function ExperienceHero({
  backgroundImage,
  backgroundAlt,
  heading,
  description,
  buttons,
  stats,
  children,
}: ExperienceHeroProps) {
  return (
    <section className="major-section relative h-screen w-full flex flex-col items-center justify-end overflow-hidden">
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
      <div className="relative z-10 text-center px-[var(--space-3)] page-wrapper flex flex-col items-center w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-[var(--space-3)]"
        >
          {/* Logo */}
          <div
            className="relative  mb-[var(--space-3)]"
            style={{ width: "45px", height: "45px" }}
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
          <h1 className="font-philosopher text-white mb-[var(--space-2)] fs-3xl">{heading}</h1>

          {/* Description */}
          <p className="font-manrope text-white/90 page-wrapper fs-md">
            {description}
          </p>
        </motion.div>

        {/* Optional Stats Bar */}
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-3 gap-[var(--space-3)] w-full max-w-md border border-white/10 bg-black/40 backdrop-blur-md rounded-none p-[var(--space-3)] mb-[var(--space-2)]">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col items-center gap-[var(--space-1)] ${
                  idx > 0 && idx < stats.length - 1
                    ? "border-l border-r border-white/10 px-[var(--space-2)]"
                    : ""
                }`}
              >
                <span className="fs-3xl font-philosopher text-white">
                  {stat.value}
                </span>
                <span className="text-white/60 fs-xs uppercase text-center">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Optional Extra Content */}
        {children}

        {/* Action Buttons */}
        <div className="flex flex-row items-center justify-center gap-[var(--space-2)] w-full max-w-md mb-[var(--space-6)] md:mb-[var(--space-4)] mt-[var(--space-2)]">
          {buttons.map((btn, idx) => (
            <button
              key={idx}
              onClick={btn.onClick}
              className="flex-1 flex items-center justify-center gap-[var(--space-1)] bg-white/15 backdrop-blur-xl border border-white/25 text-white font-manrope fs-xs uppercase px-[var(--space-2)] py-[var(--space-2)] md:px-[var(--space-3)] md:py-[var(--space-2)] hover:bg-white/25 transition-all"
            >
              {btn.icon}
              <span>{btn.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

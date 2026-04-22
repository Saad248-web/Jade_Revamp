"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import PrimaryButton from "./PrimaryButton";

interface Experience {
  title: string;
  image: string;
}

interface CuratedExperiencesGridProps {
  label: string;
  title: string;
  experiences: Experience[];
  ctaText: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  background?: string;
}

export default function CuratedExperiencesGrid({
  label,
  title,
  experiences,
  ctaText,
  ctaLink,
  onCtaClick,
  background = "#141517",
}: CuratedExperiencesGridProps) {
  return (
    <section className="py-24" style={{ backgroundColor: background }}>
      <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="text-center mb-10">
          {" "}
          {/* 40px spacing (mb-10 is exactly 40px in tailwind) */}
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase mb-[14px] font-manrope">
            {label}
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white leading-tight">
            {title}
          </h2>
        </div>

        {/* Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
          {" "}
          {/* 40px spacing between grid and button */}
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="relative aspect-[4/3] md:aspect-[16/9] overflow-hidden group border border-white/5"
            >
              {exp.image ? (
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#141517] to-black/80" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-center justify-center p-4 text-center">
                <h3 className="text-white text-gh-scroll font-philosopher leading-tight">
                  {exp.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer CTA */}
        <div className="max-w-4xl mx-auto">
          <PrimaryButton
            className="w-full h-[54px] text-gh-label"
            href={ctaLink}
            onClick={onCtaClick}
          >
            {ctaText}
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

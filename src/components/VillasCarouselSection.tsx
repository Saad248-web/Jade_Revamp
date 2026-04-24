"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import PrimaryButton from "./PrimaryButton";

interface Villa {
  name: string;
  tag: string;
  image: string;
}

interface VillasCarouselSectionProps {
  label: string;
  title: React.ReactNode;
  villas: Villa[];
  ctaText: string;
  ctaLink?: string;
  onCtaClick?: () => void;
}

export default function VillasCarouselSection({
  label,
  title,
  villas,
  ctaText,
  ctaLink,
  onCtaClick,
}: VillasCarouselSectionProps) {
  return (
    <section className="pt-fluid-lg pb-10 md:pt-fluid-xl md:pb-10 bg-[#141517] border-t border-white/5">
      <div className="max-w-[1920px] mx-auto px-6 md:px-24 lg:px-48 xl:px-64">
        {/* Header */}
        <div
          className="text-center"
          style={{ marginBottom: "clamp(24px, 5vw, 40px)" }}
        >
          <p
            className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase"
            style={{ marginBottom: "clamp(4px, 1vw, 10px)" }}
          >
            {label}
          </p>
          <h2 className="text-gh-h2 font-philosopher text-white leading-tight">
            {title}
          </h2>
        </div>

        {/* Scrollable List */}
        <div className="relative mb-0 -mx-6 md:-mx-24 lg:-mx-48 xl:-mx-64 px-6 md:px-24 lg:px-48 xl:px-64">
          <div
            className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory"
            style={{ gap: "clamp(16px, 3vw, 32px)" }}
          >
            {villas.map((villa, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-[270px] snap-start group cursor-pointer"
              >
                <div className="relative aspect-[270/360] overflow-hidden mb-[16px] border border-white/5 group-hover:border-[#EFCD62]/30 transition-colors">
                  <Image
                    src={villa.image}
                    alt={villa.name}
                    fill
                    sizes="270px"
                    className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                </div>
                <div>
                  <p
                    className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase text-left"
                    style={{ marginBottom: "clamp(4px, 1vw, 8px)" }}
                  >
                    {villa.tag}
                  </p>
                  <h3 className="text-gh-h3 font-philosopher text-white group-hover:text-[#EFCD62] transition-colors text-left leading-tight">
                    {villa.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div
          className="flex justify-center w-full"
          style={{ marginTop: "clamp(24px, 5vw, 40px)" }}
        >
          <PrimaryButton
            className="w-full text-gh-label"
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

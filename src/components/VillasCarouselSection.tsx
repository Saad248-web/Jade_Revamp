"use client";

import React from "react";
import Image from "next/image";
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
    <section className="pt-fluid-lg pb-8 md:pt-fluid-xl md:pb-8 bg-[#141517] border-t border-white/5">
      <div className="max-w-[1920px] mx-auto px-6 md:px-24 lg:px-48 xl:px-64">
        {/* Header */}
        <div
          className="text-center"
          style={{ marginBottom: "clamp(15.4px, 3.2vw, 25.6px)" }}
        >
          <p
            className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase"
            style={{ marginBottom: "clamp(4px, 0.64vw, 8px)" }}
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
            className="jade-hscroll-track flex overflow-x-auto hide-scrollbar snap-x snap-mandatory"
            style={{ gap: "clamp(10.2px, 1.92vw, 20.5px)" }}
          >
            {villas.map((villa, idx) => (
              <div
                key={`${villa.name}-${idx}`}
                className="flex-shrink-0 w-[270px] snap-start group cursor-pointer jade-hscroll-view-item"
              >
                <div className="relative aspect-[270/360] overflow-hidden mb-[12.8px] border border-white/5 group-hover:border-[#EFCD62]/30 transition-colors">
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
                    style={{ marginBottom: "clamp(4px, 0.64vw, 8px)" }}
                  >
                    {villa.tag}
                  </p>
                  <h3 className="text-gh-h3 font-philosopher text-white group-hover:text-[#EFCD62] transition-colors text-left leading-tight">
                    {villa.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div
          className="flex justify-center w-full"
          style={{ marginTop: "clamp(15.4px, 3.2vw, 25.6px)" }}
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

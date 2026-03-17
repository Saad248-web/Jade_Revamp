"use client";

import React from "react";
import PrimaryButton from "./PrimaryButton";

interface JourneyCardProps {
  title: string;
  duration: string;
  description: string;
  capacity: string;
  pricePerHead?: string;
  totalPrice: string;
  tagsLabel: string;
  tags: string[];
  isPopular?: boolean;
}

const JourneyCard = ({
  title,
  duration,
  description,
  capacity,
  pricePerHead,
  totalPrice,
  tagsLabel,
  tags,
  isPopular,
}: JourneyCardProps) => (
  <div className="relative border border-white/20 p-6 md:p-8 bg-[#0D4032] overflow-hidden">
    {isPopular && (
      <div className="absolute top-0 right-0 w-32 h-32 overflow-hidden pointer-events-none">
        <div className="absolute top-6 -right-8 w-40 bg-[#EFCD62] text-[#0D4032] text-gh-label font-bold py-1 text-center transform rotate-45 uppercase tracking-wider shadow-lg">
          Popular
        </div>
      </div>
    )}

    <h3 className="text-[#EFCD62] text-gh-scroll font-philosopher mb-1">
      {title}
    </h3>
    <p className="text-white/60 text-gh-label font-manrope mb-6">{duration}</p>

    <p className="text-white/80 text-gh-body leading-relaxed font-manrope mb-8 max-w-xl">
      {description}
    </p>

    <div className="bg-[#0A3328] p-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <p className="text-white text-gh-body font-manrope font-medium">
          {capacity}
        </p>
        {pricePerHead && (
          <p className="text-white/40 text-gh-label font-manrope mt-1">
            {pricePerHead}
          </p>
        )}
      </div>
      <p className="text-white text-gh-scroll font-philosopher">{totalPrice}</p>
    </div>

    <p className="text-white/40 text-gh-label uppercase tracking-wider font-manrope mb-4">
      {tagsLabel}
    </p>
    <div className="flex flex-wrap gap-2">
      {tags.map((tag, idx) => (
        <span
          key={idx}
          className="px-3 py-1.5 bg-white/5 border border-white/10 text-white/80 text-gh-label font-manrope"
        >
          {tag}
        </span>
      ))}
    </div>
  </div>
);

export default function CaravanJourneySection() {
  return (
    <section className="bg-[#0D4032] py-20 px-6 md:px-12 lg:px-24">
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase font-manrope mb-4">
            TRAVEL EXPERIENCES
          </p>
          <h2 className="text-gh-h1 font-philosopher text-white leading-tight">
            Choose Your Journey
          </h2>
        </div>

        {/* Content Tiles */}
        <div className="grid grid-cols-1 gap-8 mb-12">
          {/* One-Day */}
          <JourneyCard
            title="One-Day Caravan Experience"
            duration="8–10 hours"
            description="Curated day journeys from Bangalore designed for scenic drives, outdoor stops, and relaxed exploration."
            capacity="Up to 8 Guests"
            pricePerHead="≈ ₹3125/head"
            totalPrice="₹25,000 onwards"
            tagsLabel="Popular circuits include:"
            tags={[
              "Skandagiri",
              "Savandurga",
              "Ramanagara",
              "Kanakapura Backwaters",
              "Bannerghatta",
              "Hesaraghatta",
            ]}
          />

          {/* Overnight */}
          <JourneyCard
            title="Overnight Caravan Retreat"
            duration="24 hours"
            description="A slow travel experience combining road journeys with secure overnight halts at curated locations."
            capacity="Up to 8 Guests"
            pricePerHead="≈ ₹5250/head"
            totalPrice="₹42,000 onwards"
            tagsLabel="Popular destinations include:"
            tags={[
              "Coorg",
              "Chikkamagaluru",
              "Kabini",
              "Sakleshpur",
              "Bheemeshwari",
              "Shivanasamudra",
            ]}
            isPopular={true}
          />

          {/* Multi-Day */}
          <JourneyCard
            title="Multi-Day Curated Journeys"
            duration="24 hours"
            description="Custom road journeys built around your travel goals, from plantations and heritage circuits to nature retreats, tailored to your group and destination."
            capacity="Up to 8 Guests"
            totalPrice="Price on request"
            tagsLabel="Popular Journeys:"
            tags={[
              "Holy Pilgrimages",
              "Nature Getaway",
              "Family Road Trip",
              "Camping",
              "Content Shoots & Creative Projects",
            ]}
          />
        </div>

        {/* Footer Disclaimer & CTA */}
        <div className="max-w-4xl">
          <p className="text-white/40 text-gh-label leading-relaxed font-manrope mb-8">
            Note: Prices are base rates and may vary based on season, day of
            week, and specific requirements. Fuel charges may apply depending on
            the travel route.
          </p>
          <PrimaryButton
            className="w-full h-[54px] text-gh-label"
            onClick={() => window.open("/contact", "_blank")}
          >
            BOOK CARAVAN
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
}

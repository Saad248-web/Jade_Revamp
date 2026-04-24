"use client";

import React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import PrimaryButton from "./PrimaryButton";

interface Slide {
  title: string;
  desc: string;
  image: string;
}

interface ExperienceCarouselSectionProps {
  label: string;
  title: string;
  slides: Slide[];
  ctaText: string;
  ctaLink?: string;
  onCtaClick?: () => void;
  aspectClass?: string;
  buttonClassName?: string;
  buttonContainerClassName?: string;
}

export default function ExperienceCarouselSection({
  label,
  title,
  slides,
  ctaText,
  ctaLink,
  onCtaClick,
  aspectClass = "aspect-[4/5] md:aspect-[16/9] lg:h-[50vh] lg:max-h-[550px]",
  buttonClassName = "w-full text-gh-label",
  buttonContainerClassName = "",
}: ExperienceCarouselSectionProps) {
  const [activeSlide, setActiveSlide] = React.useState(0);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="pt-fluid-lg pb-10 bg-[#141517]">
      <div className="max-w-[1920px] mx-auto px-6 md:px-24 lg:px-48 xl:px-64">
        <div className="relative">
          {/* Header Area */}
          <div
            className="relative z-10"
            style={{ marginBottom: "clamp(16px, 4vw, 32px)" }}
          >
            <p
              className="text-[#EFCD62] text-gh-label font-bold tracking-[0.3em] uppercase font-manrope"
              style={{ marginBottom: "clamp(8px, 1.5vw, 16px)" }}
            >
              {label}
            </p>
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-gh-h2 font-philosopher text-white leading-tight">
                {title}
              </h2>
              <div className="flex gap-3 shrink-0">
                <button
                  onClick={prevSlide}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-none border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                >
                  <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 stroke-[1.25]" />
                </button>
                <button
                  onClick={nextSlide}
                  className="w-10 h-10 md:w-14 md:h-14 rounded-none border border-white/20 flex items-center justify-center hover:bg-white/10 transition-colors text-white"
                >
                  <ArrowRight className="w-5 h-5 md:w-6 md:h-6 stroke-[1.25]" />
                </button>
              </div>
            </div>
          </div>

          {/* Carousel Content */}
          <div
            className={`relative ${aspectClass} w-full bg-[#121417] overflow-hidden mb-4`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="absolute inset-0"
              >
                {slides[activeSlide]?.image ? (
                  <Image
                    src={slides[activeSlide].image}
                    alt={slides[activeSlide].title}
                    fill
                    sizes="100vw"
                    className="object-cover opacity-75"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#121417] to-black/80" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/20 to-transparent flex flex-col items-center justify-end pb-12 md:pb-20 px-8 text-center">
                  <h3
                    className="text-gh-h2 font-philosopher text-white"
                    style={{ marginBottom: "clamp(8px, 2vw, 16px)" }}
                  >
                    {slides[activeSlide].title}
                  </h3>
                  <p className="text-white/60 font-manrope text-gh-label max-w-xl mx-auto leading-relaxed">
                    {slides[activeSlide].desc}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Action Button */}
          <div className={`relative z-10 w-full ${buttonContainerClassName}`}>
            <PrimaryButton
              className={`${buttonClassName} h-full`}
              href={ctaLink}
              onClick={onCtaClick}
            >
              {ctaText}
            </PrimaryButton>
          </div>
        </div>
      </div>
    </section>
  );
}

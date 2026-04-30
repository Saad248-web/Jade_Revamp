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
  containerClassName?: string;
  innerClassName?: string;
}

export default function ExperienceCarouselSection({
  label,
  title,
  slides,
  ctaText,
  ctaLink,
  onCtaClick,
  aspectClass = "flex-1 min-h-[440px] sm:min-h-[480px] md:min-h-[560px] lg:min-h-[620px] relative w-full",
  buttonClassName = "w-full text-gh-label",
  buttonContainerClassName = "mt-auto",
  containerClassName = "min-h-[100dvh] bg-[#141517] overflow-x-hidden",
  innerClassName = "min-h-[100dvh] max-w-[1920px] mx-auto px-6 md:px-24 lg:px-48 xl:px-64 flex flex-col py-12 md:py-20 lg:py-24",
}: ExperienceCarouselSectionProps) {
  const [activeSlide, setActiveSlide] = React.useState(0);

  const nextSlide = () => setActiveSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className={containerClassName}>
      <div className={innerClassName}>
        {/* Header Area */}
        <div
          className="relative z-10 shrink-0"
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
          className={`relative ${aspectClass} bg-[#121417] overflow-hidden mb-8 shadow-2xl`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              {slides[activeSlide]?.image ? (
                <Image
                  src={slides[activeSlide].image}
                  alt={slides[activeSlide].title}
                  fill
                  sizes="100vw"
                  className="object-cover opacity-80"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-[#121417] to-black/80" />
              )}

              {/* Subtle Overlay Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col items-center justify-end pb-12 md:pb-24 px-8 text-center">
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.08, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="text-gh-h3 md:text-gh-h2 font-philosopher text-white"
                  style={{ marginBottom: "clamp(8px, 2vw, 16px)" }}
                >
                  {slides[activeSlide].title}
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.14, duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                  className="text-white/70 font-manrope text-gh-body max-w-2xl mx-auto leading-relaxed"
                >
                  {slides[activeSlide].desc}
                </motion.p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Action Button */}
        <div
          className={`relative z-10 w-full shrink-0 ${buttonContainerClassName}`}
        >
          <PrimaryButton
            className={`${buttonClassName} h-[54px] md:h-[64px]`}
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

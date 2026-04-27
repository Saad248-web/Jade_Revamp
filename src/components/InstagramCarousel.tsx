"use client";

import { useRef } from "react";
import { Instagram } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import PrimaryButton from "./PrimaryButton";

const INSTAGRAM_POSTS = [
  { id: "DCRJKQozm9F", type: "p" },
  { id: "DBrM8YMy1UC", type: "p" },
  { id: "DOJYFnEAWz4", type: "p" },
  { id: "DPNzH4ACZnp", type: "p" },
  { id: "C_aq1_qya_e", type: "reel" },
  { id: "C_N0gQJhTp4", type: "reel" },
  { id: "C681aInK5jn", type: "reel" },
  { id: "C5KsbqBvNLf", type: "reel" },
  { id: "CzIjR_3Lj_H", type: "reel" },
  { id: "Cxp7fnkvZm9", type: "reel" },
  { id: "DHYKpZqSn1V", type: "reel" },
  { id: "DL9BbyaSEHV", type: "reel" },
  { id: "DL97zvLzxUb", type: "reel" },
  { id: "DMKlWXLSr6a", type: "reel" },
  { id: "DRZBNuzEbnA", type: "reel" },
];

export default function InstagramCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={sectionRef}
      className="relative bg-jade-charcoal pt-fluid-lg md:pt-fluid-xl pb-12 overflow-hidden"
    >
      <NavbarThemeTrigger theme="golden" sectionRef={sectionRef} />
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 px-6 md:px-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="w-5 h-5 text-jade-gold" />
            <span className="font-manrope text-gh-label tracking-[0.3em] uppercase text-jade-gold">
              Featured on Instagram
            </span>
          </div>
          <h2 className="font-philosopher text-gh-h1 text-white mb-2">
            Moments as they unfold
          </h2>
        </div>

        <div
          ref={scrollContainerRef}
          className="flex gap-8 md:gap-12 overflow-x-auto scrollbar-hide px-8 md:px-20 snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {INSTAGRAM_POSTS.map((post) => (
            <div
              key={post.id}
              className="flex-shrink-0 w-[300px] md:w-[380px] snap-center py-8"
            >
              {/* Instagram Post Card - Standardized Height & Premium Dark Theme */}
              <div className="w-full h-[640px] bg-[#050505] backdrop-blur-2xl rounded-[12px] overflow-hidden hover:scale-[1.02] transition-all duration-700 border border-white/10 group flex flex-col relative">
                {/* Subtle Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-jade-gold/5 via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                <iframe
                  src={`https://www.instagram.com/${post.type}/${post.id}/embed`}
                  className="w-full h-full border-0 relative z-10"
                  scrolling="no"
                  allowTransparency={true}
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-4 px-6">
          <PrimaryButton
            href="https://www.instagram.com/jadehospitainment"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Jade on Instagram
          </PrimaryButton>
        </div>
      </div>

      {/* Custom CSS to hide scrollbar */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Heart, MessageCircle, Instagram } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";

const INSTAGRAM_POSTS = [
  {
    id: 1,
    username: "@jadehospitainment",
    userLabel: "Instagram",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    image: "/assets/Bathing_Girls.png",
    likes: "2.4k",
    comments: "89",
    caption: "Paradise found @jade 🌺🌸",
  },
  {
    id: 2,
    username: "@jadehospitainment",
    userLabel: "Instagram",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    image: "/assets/Wedding_for_Both.png",
    likes: "3.2k",
    comments: "124",
    caption: "Amazing celebrations ✨",
  },
  {
    id: 3,
    username: "@jadehospitainment",
    userLabel: "Instagram",
    userAvatar: "https://i.pravatar.cc/150?img=2",
    image: "/assets/Jade_735_for_Desktop.png",
    likes: "2.8k",
    comments: "95",
    caption: "Weekend vibes 🌴",
  },
  {
    id: 4,
    username: "@jadehospitainment",
    userLabel: "Instagram",
    userAvatar: "https://i.pravatar.cc/150?img=3",
    image: "/assets/Bathing_Girls.png",
    likes: "4.1k",
    comments: "156",
    caption: "Perfect venue for unforgettable moments 💫",
  },
  {
    id: 5,
    username: "@jadehospitainment",
    userLabel: "Instagram",
    userAvatar: "https://i.pravatar.cc/150?img=4",
    image: "/assets/Wedding_for_Both.png",
    likes: "5.3k",
    comments: "203",
    caption: "Dream weddings come alive @jade 💍✨",
  },
  {
    id: 6,
    username: "@jadehospitainment",
    userLabel: "Instagram",
    userAvatar: "https://i.pravatar.cc/150?img=5",
    image: "/assets/Jade_735_for_Desktop.png",
    likes: "3.7k",
    comments: "142",
    caption: "Summer pool parties done right 🏊‍♀️☀️",
  },
  {
    id: 7,
    username: "@jadehospitainment",
    userLabel: "Instagram",
    userAvatar: "https://i.pravatar.cc/150?img=1",
    image: "/assets/Bathing_Girls.png",
    likes: "4.5k",
    comments: "178",
    caption: "Escape to luxury and tranquility 🌅",
  },
];

export default function InstagramCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const progress = (scrollLeft / (scrollWidth - clientWidth)) * 100;
      setScrollProgress(progress);
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative bg-jade-charcoal pt-16 md:pt-24 pb-0 overflow-hidden"
    >
      <NavbarThemeTrigger theme="golden" sectionRef={sectionRef} />
      <div className="max-w-[1920px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16 px-6 md:px-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Instagram className="w-5 h-5 text-jade-gold" />
            <span className="font-manrope text-xs md:text-sm tracking-[0.3em] uppercase text-jade-gold">
              Featured on Instagram
            </span>
          </div>
          <h2 className="font-philosopher text-4xl md:text-5xl lg:text-6xl text-white mb-2">
            Moments as they unfold
          </h2>
        </div>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide px-6 md:px-12 snap-x snap-mandatory scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {INSTAGRAM_POSTS.map((post, index) => (
            <div key={post.id} className="flex-shrink-0 w-[280px] snap-center">
              {/* Instagram Post Card */}
              <div className="w-full bg-[#FAFAFA]/[0.04] backdrop-blur-xl rounded-[16px] overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300 border border-[#FAFAFA]/[0.12] group">
                {/* Header */}
                <div className="flex items-center justify-between p-[14px] bg-transparent">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden border-[1px] border-white/20">
                      <Image
                        src={post.userAvatar}
                        alt="Profile"
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                    <div>
                      <p className="font-manrope text-sm font-semibold text-[#FAFAFA]">
                        {post.username}
                      </p>
                      <p className="font-manrope text-xs text-[#FAFAFA]/60">
                        {post.userLabel}
                      </p>
                    </div>
                  </div>
                  <Instagram className="w-5 h-5 text-[#FAFAFA]/60" />
                </div>

                {/* Image */}
                <div className="relative w-full aspect-[4/5] bg-black">
                  <Image
                    src={post.image}
                    alt="Post"
                    fill
                    className="object-cover"
                    sizes="380px"
                  />
                </div>

                {/* Footer */}
                <div className="p-[14px] bg-transparent">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="flex items-center gap-1 text-[#FAFAFA]/90">
                      <Heart className="w-5 h-5" />
                      <span className="font-manrope text-sm">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-white/90">
                      <MessageCircle className="w-5 h-5" />
                      <span className="font-manrope text-sm">
                        {post.comments}
                      </span>
                    </div>
                  </div>
                  <p className="font-manrope text-sm text-[#FAFAFA]/60 line-clamp-2">
                    {post.caption}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Unified Scroll Indicator */}
        <div className="flex justify-center gap-2 mt-[8px]">
          {[...Array(5)].map((_, i) => {
            const isActive = Math.round((scrollProgress / 100) * 4) === i;
            return (
              <div
                key={i}
                className={`h-[6px] transition-all duration-300 ${
                  isActive ? "bg-jade-gold w-6" : "bg-white/20 w-[6px]"
                }`}
              />
            );
          })}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mt-8 mb-8 px-6">
          <a
            href="https://www.instagram.com/jadehospitainment"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-jade-gold text-jade-charcoal px-8 py-4 uppercase tracking-widest text-sm font-bold hover:bg-white transition-all duration-300 group"
          >
            Visit Jade on Instagram
            <div className="flex items-center gap-2">
              <span className="text-xl group-hover:translate-x-1 transition-transform">
                →
              </span>
              <Instagram className="w-5 h-5" />
            </div>
          </a>
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

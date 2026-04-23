"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import NavbarThemeTrigger from "./NavbarThemeTrigger";

import { BLOG_POSTS } from "@/data/blogs";

const BlogCard = ({ post }: { post: any }) => {
  return (
    <Link
      href={post.link}
      className="group relative block w-full min-w-[280px] sm:min-w-[340px] md:min-w-[380px] lg:min-w-[400px] lg:max-w-[420px]"
    >
      <div className="relative aspect-[16/10] md:aspect-[4/3] overflow-hidden rounded-sm mb-5">
        <Image
          src={post.image}
          alt={post.title}
          fill
          sizes="(max-width: 1024px) 100vw, 400px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
      </div>

      <div className="flex flex-col pr-4">
        {/* Title - Systematic size and clamping */}
        <h3 className="font-philosopher text-[1.1rem] sm:text-[1.2rem] lg:text-[1.4rem] text-white group-hover:text-[#EFCD62] transition-colors mb-3 line-clamp-2 leading-normal">
          {post.title}
        </h3>
        <p className="font-manrope text-white/60 text-[0.85rem] sm:text-[0.9rem] leading-relaxed line-clamp-2 mb-5 min-h-[3em]">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 text-[#EFCD62] text-[0.75rem] sm:text-gh-label font-bold tracking-[0.2em] uppercase group-hover:gap-4 transition-all duration-300">
          View Blog <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </Link>
  );
};

export default function BlogSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 450, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[60vh] lg:h-screen flex flex-col justify-center overflow-hidden py-8 lg:py-10"
      style={{ backgroundColor: "#25282C" }}
    >
      <NavbarThemeTrigger theme="golden" sectionRef={sectionRef} />
      <div className="max-w-[1920px] mx-auto w-full px-6 md:px-12 lg:px-24">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 lg:mb-12 gap-4 md:gap-8">
          <div className="max-w-2xl">
            <p
              className="font-manrope text-gh-label tracking-[0.3em] uppercase text-[#EFCD62]"
              style={{ marginBottom: "clamp(4px, 1vw, 8px)" }}
            >
              BLOG
            </p>
            <h2
              className="font-philosopher text-gh-h2 sm:text-gh-h1 text-white"
              style={{ marginBottom: "clamp(8px, 2vw, 16px)" }}
            >
              From the Journal
            </h2>
            <p className="font-manrope text-white/60 text-[0.9rem] sm:text-gh-body leading-relaxed max-w-md">
              Thoughts on hosting, travel, and creating meaningful experiences
              through space.
            </p>
          </div>

          <div className="flex items-center gap-5 md:gap-6">
            <Link
              href="/blogs"
              className="font-manrope text-[0.75rem] sm:text-gh-label text-[#EFCD62] tracking-widest uppercase border-b border-[#EFCD62]/30 hover:border-[#EFCD62] transition-colors pb-1"
            >
              View All
            </Link>
            <button
              onClick={scrollRight}
              className="hidden md:flex items-center justify-center w-11 h-11 lg:w-12 lg:h-12 rounded-full border border-white/20 hover:border-[#EFCD62] hover:bg-[#EFCD62]/10 transition-all text-white hover:text-[#EFCD62]"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Systematic Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-8 lg:gap-11 overflow-x-auto pb-8 md:pb-10 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {BLOG_POSTS.map((post) => (
            <div key={post.id} className="snap-start">
              <BlogCard post={post} />
            </div>
          ))}
          {/* Spacer for right padding */}
          <div className="min-w-[5vw]" />
        </div>
      </div>
    </section>
  );
}

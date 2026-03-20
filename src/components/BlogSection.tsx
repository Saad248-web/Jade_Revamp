"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { ArrowRight, ChevronRight, MoveRight } from "lucide-react";
import Link from "next/link";
import NavbarThemeTrigger from "./NavbarThemeTrigger";

import { BLOG_POSTS } from "@/data/blogs";

const BlogCard = ({ post }: { post: any }) => {
  return (
    <Link
      href={post.link}
      className="group relative block min-w-[300px] md:min-w-[400px]"
    >
      <div className="relative aspect-[3/2] overflow-hidden rounded-sm mb-6">
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
        <h3 className="font-philosopher text-gh-h2 text-white group-hover:text-[#EFCD62] transition-colors mb-2">
          {post.title}
        </h3>
        <p className="font-manrope text-white/60 text-gh-body leading-relaxed line-clamp-3 mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase group-hover:gap-4 transition-all duration-300">
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
      scrollContainerRef.current.scrollBy({ left: 400, behavior: "smooth" });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative h-[100vh] flex flex-col justify-center overflow-hidden"
      style={{ backgroundColor: "#25282C" }}
    >
      <NavbarThemeTrigger theme="golden" sectionRef={sectionRef} />
      <div className="max-w-[1920px] mx-auto w-full px-6 md:px-12 lg:px-24">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <div className="max-w-2xl">
            <p className="font-manrope text-gh-label tracking-[0.3em] uppercase text-[#EFCD62] mb-4">
              BLOG
            </p>
            <h2 className="font-philosopher text-gh-h1 text-white mb-6">
              From the Journal
            </h2>
            <p className="font-manrope text-white/60 text-gh-body leading-relaxed max-w-md">
              Thoughts on hosting, travel, and creating meaningful experiences
              through space.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <Link
              href="/blogs"
              className="font-manrope text-gh-label text-[#EFCD62] tracking-widest uppercase border-b border-[#EFCD62]/30 hover:border-[#EFCD62] transition-colors pb-1"
            >
              View All
            </Link>
            <button
              onClick={scrollRight}
              className="hidden md:flex items-center justify-center w-14 h-14 rounded-full border border-white/20 hover:border-[#EFCD62] hover:bg-[#EFCD62]/10 transition-all text-white hover:text-[#EFCD62]"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollContainerRef}
          className="flex gap-8 overflow-x-auto pb-12 scrollbar-none snap-x snap-mandatory"
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

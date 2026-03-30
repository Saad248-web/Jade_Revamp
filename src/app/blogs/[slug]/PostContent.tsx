"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  ChevronRight,
} from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { BlogPost, BLOG_POSTS } from "@/data/blogs";

interface PostContentProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

export default function PostContent({ post, relatedPosts }: PostContentProps) {
  return (
    <main className="relative min-h-screen bg-[#25282C] text-white">
      <Navbar />
      <MobileBottomNav />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 md:pt-48 md:pb-32 px-6 md:px-12 lg:px-24 overflow-hidden">
        <div className="max-w-[1920px] mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex items-center gap-6 mb-8">
              <Link
                href="/blogs"
                className="group flex items-center gap-2 text-white/40 hover:text-[#EFCD62] transition-colors uppercase text-gh-label tracking-widest"
              >
                <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />{" "}
                Back
              </Link>
              <div className="w-[1px] h-4 bg-white/20" />
              <span className="text-[#EFCD62] font-manrope font-bold tracking-[0.2em] uppercase text-gh-label">
                {post.category}
              </span>
            </div>

            <h1 className="font-philosopher text-gh-h1 md:text-[80px] text-white mb-10 leading-[1.1]">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-8 text-white/50 text-gh-label uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#EFCD62]/60" /> {post.date}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#EFCD62]/60" /> {post.readTime}
              </div>
              <div className="flex items-center gap-2 cursor-pointer hover:text-white transition-colors">
                <Share2 className="w-4 h-4 text-[#EFCD62]/60" /> Share Story
              </div>
            </div>
          </motion.div>
        </div>

        {/* Abstract Background Element */}
        <div className="absolute top-0 right-0 w-[60%] h-full pointer-events-none opacity-10">
          <div className="absolute inset-0 bg-gradient-to-l from-[#EFCD62]/20 to-transparent" />
          <Image
            src={post.image}
            alt="Decoration"
            fill
            className="object-cover grayscale"
          />
        </div>
      </section>

      {/* Featured Image */}
      <section className="px-6 md:px-12 lg:px-24 mb-24">
        <div className="max-w-[1920px] mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative aspect-[21/9] w-full overflow-hidden"
          >
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        </div>
      </section>

      {/* Content Layout */}
      <section className="px-6 md:px-12 lg:px-24 pb-32">
        <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-20">
          {/* Main Article Content */}
          <article className="lg:w-[65%] space-y-12">
            {post.sections.map((section, idx) => {
              switch (section.type) {
                case "text":
                  return (
                    <p
                      key={idx}
                      className="font-manrope text-gh-body text-white/80 leading-[1.8] text-lg md:text-xl"
                    >
                      {section.content}
                    </p>
                  );
                case "quote":
                  return (
                    <blockquote
                      key={idx}
                      className="relative py-8 md:py-12 border-y border-white/10"
                    >
                      <div className="absolute -top-6 -left-4 text-[120px] font-philosopher text-[#EFCD62] opacity-10 leading-none">
                        "
                      </div>
                      <p className="font-philosopher text-gh-h2 md:text-4xl text-white italic leading-relaxed text-center px-8">
                        {section.content}
                      </p>
                    </blockquote>
                  );
                case "image":
                  return (
                    <div key={idx} className="space-y-4">
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={section.image || ""}
                          alt={section.caption || "Content image"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {section.caption && (
                        <p className="text-center text-white/40 text-gh-label italic uppercase tracking-widest pt-2">
                          — {section.caption}
                        </p>
                      )}
                    </div>
                  );
                case "list":
                  return (
                    <ul
                      key={idx}
                      className="space-y-6 pl-6 border-l-2 border-[#EFCD62]/30"
                    >
                      {section.items?.map((item, i) => (
                        <li key={i} className="flex gap-4 items-start">
                          <span className="w-2 h-2 rounded-full bg-[#EFCD62] mt-2 shrink-0" />
                          <span className="font-manrope text-gh-body text-white/70 leading-relaxed text-lg italic">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  );
                case "table":
                  return (
                    <div
                      key={idx}
                      className="overflow-x-auto my-12 border border-white/10 rounded-sm bg-[#1A1C1E]/50"
                    >
                      <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                          <tr className="border-b border-white/20 bg-[#EFCD62]/5 font-philosopher">
                            {section.tableData?.headers.map((header, i) => (
                              <th
                                key={i}
                                className="p-6 text-gh-label text-[#EFCD62] uppercase tracking-widest font-bold"
                              >
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="font-manrope text-gh-body">
                          {section.tableData?.rows.map((row, i) => (
                            <tr
                              key={i}
                              className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                            >
                              {row.map((cell, j) => (
                                <td
                                  key={j}
                                  className="p-6 text-white/70 italic lg:not-italic"
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                case "faq":
                  return (
                    <div key={idx} className="space-y-4 my-12">
                      <h3 className="font-philosopher text-gh-h2 text-[#EFCD62] mb-8">
                        Guided Insights
                      </h3>
                      {section.faqs?.map((faq, i) => (
                        <details
                          key={i}
                          className="group border border-white/10 bg-white/5 rounded-sm overflow-hidden"
                        >
                          <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-white/[0.02] transition-all">
                            <span className="font-philosopher text-gh-h3 text-white pr-8">
                              {faq.question}
                            </span>
                            <ChevronRight className="w-5 h-5 text-[#EFCD62] transition-transform group-open:rotate-90" />
                          </summary>
                          <div className="p-8 pt-0 font-manrope text-gh-body text-white/60 leading-relaxed border-t border-white/5 bg-black/20">
                            {faq.answer}
                          </div>
                        </details>
                      ))}
                    </div>
                  );
                case "heading":
                  return section.level === 2 ? (
                    <h2
                      key={idx}
                      className="font-philosopher text-gh-h2 text-white border-b-2 border-white/10 pb-4 mb-8 mt-16 flex items-center gap-4"
                    >
                      {section.content}
                    </h2>
                  ) : (
                    <h3
                      key={idx}
                      className="font-philosopher text-gh-h3 text-[#EFCD62] mb-4 mt-12"
                    >
                      {section.content}
                    </h3>
                  );
                case "cta":
                  return (
                    <div key={idx} className="flex flex-wrap gap-6 my-12">
                      {section.ctas?.map((cta, i) => (
                        <Link
                          key={i}
                          href={cta.link}
                          className={`inline-flex items-center justify-center px-8 py-4 font-manrope font-bold tracking-[0.2em] uppercase text-[10px] transition-all duration-300 ${
                            cta.variant === "primary"
                              ? "bg-[#EFCD62] text-black hover:bg-[#EFCD62]/90 shadow-[inset_0_0_0_1px_rgba(172,136,49,1)]"
                              : "bg-transparent text-[#EFCD62] border border-[#EFCD62] hover:bg-[#EFCD62]/10"
                          }`}
                        >
                          {cta.label}
                        </Link>
                      ))}
                    </div>
                  );
                default:
                  return null;
              }
            })}

            {/* Tags & Footer Meta */}
            <div className="pt-20 border-t border-white/10 flex flex-wrap gap-4">
              {(post.tags || ["WELLNESS", "RETREAT", "JOURNAL", "LUXURY"]).map(
                (tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-manrope font-bold tracking-[0.2em] text-[#EFCD62] border border-[#EFCD62]/30 px-3 py-1.5 hover:bg-[#EFCD62]/10 transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ),
              )}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="lg:w-[35%] space-y-16">
            <div className="sticky top-32 space-y-16">
              {/* Share */}
              <div className="bg-white/5 p-8 border border-white/10 rounded-sm">
                <h4 className="font-philosopher text-xl text-white mb-6">
                  Share this Story
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  {[Facebook, Twitter, Linkedin].map((Icon, idx) => (
                    <button
                      key={idx}
                      className="flex items-center justify-center p-4 bg-white/5 border border-white/10 hover:border-[#EFCD62] hover:bg-[#EFCD62]/5 transition-all group"
                    >
                      <Icon className="w-5 h-5 text-[#EFCD62] group-hover:scale-110 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Sticky Newsletter */}
              <div className="sticky top-32 bg-[#EFCD62] p-8 md:p-10 rounded-sm text-black">
                <h4 className="font-philosopher text-2xl mb-4 leading-tight">
                  Stay Inspired
                </h4>
                <p className="font-manrope text-sm text-black/70 mb-8 leading-relaxed">
                  Join our list for monthly curations of Bangalore's finest
                  escapes and architectural highlights.
                </p>
                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="EMAIL ADDRESS"
                    className="w-full bg-black/10 border border-black/10 px-6 py-4 text-black placeholder:text-black/40 focus:outline-none focus:bg-black/20 transition-all font-manrope text-xs tracking-widest font-bold"
                  />
                  <button className="w-full bg-black text-[#EFCD62] py-4 font-manrope font-bold tracking-[0.2em] uppercase hover:bg-black/90 transition-all text-xs">
                    JOIN THE LIST
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Reading */}
      <section className="py-32 bg-[#1E2023] border-t border-white/5">
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24">
          <div className="flex justify-between items-end mb-16">
            <div>
              <p className="text-[#EFCD62] text-gh-label tracking-widest uppercase mb-4">
                CONTINUE READING
              </p>
              <h2 className="font-philosopher text-gh-h2 text-white">
                More from Journal
              </h2>
            </div>
            <Link
              href="/blogs"
              className="hidden md:flex items-center gap-2 text-white/40 hover:text-[#EFCD62] transition-all uppercase text-gh-label tracking-widest font-bold"
            >
              Journal Archive <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {relatedPosts.map((rPost, idx) => (
              <Link
                key={rPost.id}
                href={`/blogs/${rPost.slug}`}
                className="group block space-y-6"
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image
                    src={rPost.image}
                    alt={rPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-3">
                  <span className="text-[#EFCD62] text-[10px] font-bold tracking-[0.2em] uppercase">
                    {rPost.category}
                  </span>
                  <h3 className="font-philosopher text-gh-h3 text-white group-hover:text-[#EFCD62] transition-colors leading-snug">
                    {rPost.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

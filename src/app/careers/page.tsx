"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  CheckCircle2,
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LiveBackground from "@/components/LiveBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MobileBottomNav from "@/components/MobileBottomNav";

const JOBS = [
  {
    id: "sales",
    title: "SALES EXECUTIVES",
    purpose: "Drive growth and build relationships with our clients.",
    lookingFor: [
      "2+ years experience in luxury sales",
      "Excellent communication skills",
      "Goal-oriented mindset",
    ],
  },
  {
    id: "content-creator",
    title: "CONTENT CREATOR",
    purpose:
      "As a Content Creator Intern, you'll play a key role in telling our brand story online from showcasing our design work to capturing everyday studio moments. You'll work closely with the marketing and design teams to create content that's relevant, engaging, and aligned with what people love to see and share.",
    lookingFor: [
      "0-2 years of hands-on experience with content creation — personal pages/projects count too!",
      "Strong interest in social media trends, storytelling, and visual content",
      "Familiarity with editing tools like CapCut, InShot, Canva, or basic video software",
      "Good understanding of what works across Instagram, LinkedIn, YouTube Shorts, etc.",
      "Excellent written and verbal communication skills",
      "Proactive, detail-oriented, and comfortable working in a fast-paced creative environment",
      "Bonus: If you've run your own page, grown a following, or had content go viral — tell us about it!",
      "Must share your Instagram / LinkedIn profiles or a portfolio showcasing your past work",
    ],
    purposeToTeam: [
      "Create and share content that highlights our design work, studio culture, and team wins",
      "Pitch and produce ideas for reels, stories, carousels, and short-form videos",
      "Capture behind-the-scenes moments and everyday interactions at the studio",
      "Bring awareness to our work by staying current with trends and tailoring them to fit our brand",
    ],
  },
  {
    id: "marketing-intern",
    title: "MARKETING INTERN",
    purpose: "Assist our marketing team in executing campaigns and strategies.",
    lookingFor: [
      "Currently pursuing or recently completed a degree in Marketing",
      "Strong writing and research skills",
      "Familiarity with digital marketing tools",
    ],
  },
  {
    id: "content-writer",
    title: "CONTENT WRITER",
    purpose: "Craft compelling narratives and copy for our brand.",
    lookingFor: [
      "Strong portfolio of written work",
      "Ability to write in a premium, editorial voice",
      "Experience with SEO is a plus",
    ],
  },
  {
    id: "photographer",
    title: "PHOTOGRAPHER",
    purpose:
      "Capture the essence of our villas and experiences through high-end photography.",
    lookingFor: [
      "Experience in architectural or lifestyle photography",
      "Proficient in Adobe Lightroom and Photoshop",
      "Keen eye for detail and composition",
    ],
  },
  {
    id: "video-editor",
    title: "VIDEO EDITOR",
    purpose: "Create cinematic video content for our social platforms.",
    lookingFor: [
      "Expertise in Premiere Pro or DaVinci Resolve",
      "Experience with short-form and high-production content",
      "Strong sense of pacing and music integration",
    ],
  },
  {
    id: "social-media-intern",
    title: "SOCIAL MEDIA INTERN",
    purpose: "Engage with our community and manage our social presence.",
    lookingFor: [
      "Deep understanding of current social trends",
      "Creative mindset for community engagement",
      "Basic design/video skills for social stories",
    ],
  },
];

export default function CareersPage() {
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isApplyModalOpen) {
      setCanClose(false);
      const timer = setTimeout(() => setCanClose(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isApplyModalOpen]);

  /* Body scroll lock — prevents background scroll + viewport shift on mobile */
  useEffect(() => {
    document.body.style.overflow = isApplyModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isApplyModalOpen]);

  const toggleJob = (id: string) => {
    setExpandedJob(expandedJob === id ? null : id);
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFileName(e.target.files[0].name);
    }
  };

  return (
    <main className="relative min-h-screen bg-[#1A1C1E] text-white pb-20 lg:pb-0">
      {/* ── Navigation ── */}
      <Navbar />
      <MobileBottomNav />
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
        {/* Live Background */}
        <div className="absolute inset-0 z-0 opacity-80">
          <LiveBackground />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[#EFCD62] text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-6"
          >
            CAREERS
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-7xl font-philosopher leading-tight mb-8"
          >
            Work Where <br /> Standards Matter
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-white/70 text-sm md:text-lg max-w-2xl mx-auto mb-12 font-manrope leading-relaxed"
          >
            Join us in building Hospitainment, bringing together hospitality,
            events and operations with clarity and care.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() =>
              document
                .getElementById("jobs")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold uppercase tracking-widest text-sm px-12 py-5 rounded-none transition-all"
          >
            VIEW OPEN ROLES
          </motion.button>
        </div>
      </section>

      {/* 2. JOBS SECTION */}
      <section
        id="jobs"
        className="py-24 bg-[#0D4032] relative overflow-hidden"
      >
        {/* Diamond Pattern Overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
            backgroundSize: "40px 40px",
            transform: "rotate(45deg)",
          }}
        />

        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <p className="text-[#EFCD62] text-xs font-bold tracking-[0.2em] uppercase mb-4">
              JOBS
            </p>
            <h2 className="text-3xl md:text-5xl font-philosopher text-white">
              Current Opportunities
            </h2>
          </div>

          <div className="space-y-1">
            {JOBS.map((job) => (
              <div key={job.id} className="border-b border-white/10">
                <button
                  onClick={() => toggleJob(job.id)}
                  className="w-full py-8 flex items-center justify-between text-left group hover:opacity-80 transition-opacity"
                >
                  <span className="text-sm md:text-base font-bold tracking-widest uppercase">
                    {job.title}
                  </span>
                  {expandedJob === job.id ? (
                    <ChevronUp className="w-5 h-5 text-white/40" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/40" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedJob === job.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pb-12 text-white/80 font-manrope space-y-8">
                        <div>
                          <p className="leading-relaxed text-sm md:text-base mb-6 text-justify">
                            {job.purpose}
                          </p>
                          <p className="leading-relaxed text-sm md:text-base italic text-justify">
                            If you&apos;re someone who&apos;s constantly on
                            Social Media, knows what&apos;s trending, and enjoys
                            making videos, reels, or content that gets attention
                            this internship is the perfect creative playground
                            for you.
                          </p>
                        </div>

                        {job.purposeToTeam && (
                          <div>
                            <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">
                              Your Purpose to the Team:
                            </h4>
                            <ul className="list-disc pl-5 space-y-2 text-sm">
                              {job.purposeToTeam.map((item, idx) => (
                                <li key={idx}>{item}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <h4 className="font-bold text-white mb-4 uppercase tracking-wider text-xs">
                            What We&apos;re Looking For:
                          </h4>
                          <ul className="list-disc pl-5 space-y-2 text-sm">
                            {job.lookingFor.map((item, idx) => (
                              <li key={idx}>{item}</li>
                            ))}
                          </ul>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsApplyModalOpen(true);
                          }}
                          className="w-full bg-[#EFCD62] text-black font-bold uppercase tracking-widest text-sm py-5 mt-4 hover:bg-white transition-colors flex items-center justify-center gap-2 rounded-none"
                        >
                          APPLY NOW <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CULTURE SECTION */}
      <section className="py-24 bg-[#1A1C1E] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-[#EFCD62] text-xs font-bold tracking-[0.2em] uppercase mb-4">
            CULTURE
          </p>
          <h2 className="text-4xl md:text-6xl font-philosopher text-white mb-8">
            Work Hard. <br /> Celebrate Well.
          </h2>

          <div className="text-white/70 max-w-2xl mx-auto space-y-6 font-manrope leading-relaxed mb-12">
            <p className="text-justify">
              Our culture is built on accountability, teamwork, and consistent
              execution. We take our work seriously, knowing that experience is
              shaped by effort. And when we succeed, we celebrate it with the
              same energy we bring to the job.
            </p>
            <p className="text-white/40 italic text-justify">
              Bringing unique villas and curated experiences together under one
              standard of hospitality.
            </p>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setIsApplyModalOpen(true);
            }}
            className="inline-flex bg-[#EFCD62] text-black font-bold uppercase tracking-widest text-sm px-12 py-5 hover:bg-white transition-all items-center gap-2 rounded-none shadow-xl"
          >
            SEND US YOUR CV <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* 4. APPLICATION MODAL / FULL-SCREEN MOBILE OVERLAY */}
      <AnimatePresence>
        {isApplyModalOpen && (
          <>
            {/* ── Desktop backdrop (md+) ── */}
            <div className="hidden md:block">
              <motion.div
                key="backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (!isSuccess && canClose) setIsApplyModalOpen(false);
                }}
                className={`fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm ${!canClose ? "pointer-events-none" : ""}`}
              />
            </div>

            {/* ── Mobile: backdrop (dismisses on tap, below Navbar z-50) ── */}
            <div className="md:hidden">
              <motion.div
                key="mobile-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (!isSuccess && canClose) {
                    setIsApplyModalOpen(false);
                    setIsSuccess(false);
                    setSelectedFileName(null);
                  }
                }}
                className="fixed inset-0 z-[46] bg-black/70 backdrop-blur-[2px]"
              />
            </div>

            {/* ── Mobile: bottom-sheet card (below Navbar z-50 → Navbar stays accessible) ── */}
            <div className="md:hidden w-full">
              <motion.div
                key="mobile-overlay"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed inset-x-0 bottom-0 top-24 z-[48] bg-[#0D4032] rounded-t-[28px] flex flex-col"
              >
                {/* The Close button centered at top, outside the modal */}
                <div className="absolute -top-[72px] left-1/2 -translate-x-1/2 flex items-center z-10">
                  <button
                    onClick={() => setIsApplyModalOpen(false)}
                    className="w-12 h-12 rounded-full bg-[#124131] flex items-center justify-center text-white hover:bg-[#1f5c48] transition-colors shadow-2xl"
                  >
                    <X className="w-6 h-6 stroke-[1.5]" />
                  </button>
                </div>

                {/* ── Scrollable Content (no custom header — real Navbar is above) ── */}
                <div className="flex-1 w-full overflow-y-auto overflow-x-hidden rounded-t-[28px]">
                  {!isSuccess ? (
                    /* FORM VIEW */
                    <div className="px-5 pt-8 pb-10 w-full box-border">
                      {/* Title row */}
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-3xl font-philosopher text-white mt-2">
                          Apply Now
                        </h3>
                      </div>
                      <p className="text-white/60 text-sm mb-8 leading-relaxed">
                        Share a few details. Our team will get back to you
                        shortly
                      </p>

                      <form className="space-y-4 w-full" onSubmit={handleApply}>
                        {/* Full Name */}
                        <div className="relative w-full">
                          <label className="absolute -top-2.5 left-4 bg-[#0D4032] px-2 text-[10px] text-[#EFCD62] uppercase tracking-widest font-bold z-10">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full bg-transparent border border-white/20 px-4 py-4 text-white text-sm focus:border-[#EFCD62] outline-none transition-colors"
                          />
                        </div>

                        {/* Email */}
                        <input
                          type="email"
                          required
                          placeholder="Email"
                          className="w-full bg-transparent border border-white/20 px-4 py-4 text-white text-sm focus:border-[#EFCD62] outline-none transition-colors placeholder:text-white/40"
                        />

                        {/* Phone */}
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number"
                          className="w-full bg-transparent border border-white/20 px-4 py-4 text-white text-sm focus:border-[#EFCD62] outline-none transition-colors placeholder:text-white/40"
                        />

                        {/* Company */}
                        <input
                          type="text"
                          placeholder="Company/Organization"
                          className="w-full bg-transparent border border-white/20 px-4 py-4 text-white text-sm focus:border-[#EFCD62] outline-none transition-colors placeholder:text-white/40"
                        />

                        {/* Upload CV */}
                        <div className="flex flex-col items-center gap-3 py-3">
                          <label className="cursor-pointer flex items-center gap-2 text-[#EFCD62]">
                            <span className="uppercase tracking-[0.2em] text-[10px] font-bold">
                              UPLOAD CV
                            </span>
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>

                          {selectedFileName && (
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 text-[11px] text-white/60 max-w-full overflow-hidden">
                              <span className="truncate">
                                {selectedFileName}
                              </span>
                              <button
                                type="button"
                                className="shrink-0"
                                onClick={() => setSelectedFileName(null)}
                              >
                                <X className="w-3 h-3 hover:text-white" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Submit */}
                        <button
                          type="submit"
                          className="w-full bg-[#EFCD62] text-[#0D4032] font-bold uppercase tracking-[0.2em] text-sm py-5 hover:bg-white transition-all flex items-center justify-center gap-3 rounded-none shadow-lg group"
                        >
                          SUBMIT APPLICATION{" "}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </form>
                    </div>
                  ) : (
                    /* SUCCESS VIEW */
                    <div className="flex flex-col items-center text-center px-6 pt-12 pb-10 w-full box-border">
                      {/* Jade Coin — Glassmorphic Circle */}
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative w-48 h-48 flex items-center justify-center mx-auto mb-10"
                      >
                        {/* Outer soft glow */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
                          }}
                        />

                        {/* Glassmorphic disc */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "rgba(255, 255, 255, 0.10)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                            boxShadow:
                              "inset 0 1px 1px rgba(255,255,255,0.25), 0 4px 24px rgba(0,0,0,0.15)",
                          }}
                        />

                        {/* Inner glass highlight ring */}
                        <div
                          className="absolute rounded-full pointer-events-none"
                          style={{
                            inset: 6,
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "50%",
                          }}
                        />

                        {/* Coin image — centered, smaller than glass disc */}
                        <Image
                          src="/assets/JAde Correction.png"
                          alt="Jade Coin"
                          width={128}
                          height={128}
                          className="relative z-10 w-32 h-32 object-contain drop-shadow-2xl"
                        />
                      </motion.div>

                      <motion.h3
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.4 }}
                        className="text-[2rem] font-philosopher text-white mb-4 leading-tight"
                      >
                        We&apos;ve got it from here
                      </motion.h3>

                      <motion.p
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.4 }}
                        className="text-white/70 text-sm leading-relaxed mb-10 max-w-xs mx-auto"
                      >
                        Thanks for sharing your details!
                        <br />
                        Our team will take a look and reach out shortly to
                        understand things better.
                      </motion.p>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4, duration: 0.4 }}
                        className="space-y-5 mb-10 w-full"
                      >
                        <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
                          MEANWHILE CHECK US OUT HERE
                        </p>
                        <div className="flex justify-center gap-4">
                          {[
                            {
                              Icon: Facebook,
                              href: "https://www.facebook.com/jadehospitainment/",
                            },
                            {
                              Icon: Instagram,
                              href: "https://www.instagram.com/jadehospitainment/?hl=en",
                            },
                            {
                              Icon: Youtube,
                              href: "https://www.youtube.com/@jade_hospitainment",
                            },
                          ].map(({ Icon, href }, i) => (
                            <a
                              key={i}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 bg-white/5 border border-white/20 flex items-center justify-center hover:bg-[#EFCD62] hover:text-black transition-all"
                            >
                              <Icon className="w-5 h-5" />
                            </a>
                          ))}
                        </div>
                        <p className="text-[10px] text-white/30 italic">
                          Thoughtfully operated. Always.
                        </p>
                      </motion.div>

                      <button
                        onClick={() => {
                          setIsApplyModalOpen(false);
                          setIsSuccess(false);
                          setSelectedFileName(null);
                        }}
                        className="w-full bg-[#EFCD62] text-[#0D4032] font-bold uppercase tracking-widest text-sm py-5 hover:bg-white transition-all rounded-none"
                      >
                        OKAY
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
            {/* end md:hidden wrapper */}

            {/* ── Desktop: centered modal (md+) ── */}
            <div className="hidden md:flex fixed inset-0 z-[101] items-center justify-center pointer-events-none">
              <motion.div
                key="modal-desktop"
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 40, opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-lg bg-[#0D4032] overflow-visible max-h-[85vh] rounded-3xl shadow-2xl pointer-events-auto flex flex-col"
              >
                {/* The Close button centered at top, outside the modal */}
                <div className="absolute -top-[72px] left-1/2 -translate-x-1/2 flex items-center z-10">
                  <button
                    onClick={() => {
                      setIsApplyModalOpen(false);
                      setIsSuccess(false);
                      setSelectedFileName(null);
                    }}
                    className="w-12 h-12 rounded-full bg-[#124131] flex items-center justify-center text-white hover:bg-[#1f5c48] transition-colors shadow-2xl"
                  >
                    <X className="w-6 h-6 stroke-[1.5]" />
                  </button>
                </div>

                <div className="p-12 overflow-y-auto overflow-x-hidden rounded-3xl">
                  {!isSuccess ? (
                    <>
                      <h3 className="text-4xl font-philosopher text-white mb-4 pr-16">
                        Apply Now
                      </h3>
                      <p className="text-white/60 text-sm mb-10">
                        Share a few details. Our team will get back to you
                        shortly
                      </p>

                      <form className="space-y-6" onSubmit={handleApply}>
                        <div className="relative">
                          <label className="absolute -top-3 left-4 bg-[#0D4032] px-2 text-[10px] text-[#EFCD62] uppercase tracking-widest font-bold">
                            Full Name
                          </label>
                          <input
                            type="text"
                            required
                            className="w-full bg-transparent border border-white/20 px-6 py-4 text-white focus:border-[#EFCD62] outline-none transition-colors"
                          />
                        </div>
                        <input
                          type="email"
                          required
                          placeholder="Email"
                          className="w-full bg-transparent border border-white/20 px-6 py-4 text-white focus:border-[#EFCD62] outline-none transition-colors placeholder:text-white/30"
                        />
                        <input
                          type="tel"
                          required
                          placeholder="Phone Number"
                          className="w-full bg-transparent border border-white/20 px-6 py-4 text-white focus:border-[#EFCD62] outline-none transition-colors placeholder:text-white/30"
                        />
                        <input
                          type="text"
                          placeholder="Company/Organization"
                          className="w-full bg-transparent border border-white/20 px-6 py-4 text-white focus:border-[#EFCD62] outline-none transition-colors placeholder:text-white/30"
                        />

                        <div className="flex flex-col items-center gap-4 py-4">
                          <label className="cursor-pointer flex items-center gap-2 text-[#EFCD62] hover:text-white transition-colors">
                            <span className="uppercase tracking-[0.2em] text-[10px] font-bold">
                              UPLOAD CV
                            </span>
                            <Upload className="w-4 h-4" />
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleFileChange}
                            />
                          </label>
                          {selectedFileName && (
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 text-[11px] text-white/60">
                              {selectedFileName}
                              <button
                                type="button"
                                onClick={() => setSelectedFileName(null)}
                              >
                                <X className="w-3 h-3 hover:text-white" />
                              </button>
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#EFCD62] text-black font-bold uppercase tracking-[0.2em] text-sm py-5 hover:bg-white transition-all flex items-center justify-center gap-3 rounded-none mt-4 shadow-lg group"
                        >
                          SUBMIT APPLICATION{" "}
                          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center pb-12">
                      {/* Jade Coin — Glassmorphic Circle */}
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="relative w-48 h-48 flex items-center justify-center mx-auto mb-10"
                      >
                        {/* Outer soft glow */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
                          }}
                        />
                        {/* Glassmorphic disc */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: "rgba(255, 255, 255, 0.10)",
                            backdropFilter: "blur(12px)",
                            WebkitBackdropFilter: "blur(12px)",
                            border: "1px solid rgba(255, 255, 255, 0.18)",
                            boxShadow:
                              "inset 0 1px 1px rgba(255,255,255,0.25), 0 4px 24px rgba(0,0,0,0.15)",
                          }}
                        />
                        {/* Inner highlight ring */}
                        <div
                          className="absolute rounded-full pointer-events-none"
                          style={{
                            inset: 6,
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "50%",
                          }}
                        />
                        {/* Coin image */}
                        <Image
                          src="/assets/JAde Correction.png"
                          alt="Jade Coin"
                          width={128}
                          height={128}
                          className="relative z-10 w-32 h-32 object-contain drop-shadow-2xl"
                        />
                      </motion.div>

                      <h3 className="text-3xl font-philosopher text-white mb-6">
                        We&apos;ve got it from here
                      </h3>
                      <p className="text-white/70 text-sm leading-relaxed mb-10 max-w-xs mx-auto text-center">
                        Thanks for sharing your details! Our team will take a
                        look and reach out shortly to understand things better.
                      </p>

                      <div className="space-y-8">
                        <p className="text-[10px] tracking-[0.3em] text-white/40 uppercase">
                          MEANWHILE CHECK US OUT HERE
                        </p>
                        <div className="flex justify-center gap-6">
                          {[
                            {
                              Icon: Facebook,
                              href: "https://www.facebook.com/jadehospitainment/",
                            },
                            {
                              Icon: Instagram,
                              href: "https://www.instagram.com/jadehospitainment/?hl=en",
                            },
                            {
                              Icon: Youtube,
                              href: "https://www.youtube.com/@jade_hospitainment",
                            },
                          ].map(({ Icon, href }, i) => (
                            <a
                              key={i}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#EFCD62] hover:text-black transition-all"
                            >
                              <Icon className="w-5 h-5" />
                            </a>
                          ))}
                        </div>
                        <p className="text-[10px] text-white/30 italic">
                          Thoughtfully operated. Always.
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setIsApplyModalOpen(false);
                          setIsSuccess(false);
                          setSelectedFileName(null);
                        }}
                      >
                        OKAY
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}

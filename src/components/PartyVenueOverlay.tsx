"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  Share2,
  MapPin,
  Users,
  Home,
  ArrowRight,
  Calendar,
  Waves,
  ShieldCheck,
} from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";

interface PartyVenueOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  villa: any;
}

const PartyVenueOverlay: React.FC<PartyVenueOverlayProps> = ({
  isOpen,
  onClose,
  villa,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Amenities");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!mounted || !isOpen || !villa) return null;

  const images =
    villa.spaces?.length > 0
      ? villa.spaces
      : [{ name: "Main", image: villa.image }];

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const tabs = ["Amenities", "Pricing", "Location", "Walkthrough", "FAQ"];

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-black/60 overflow-y-auto text-white scrollbar-none"
      data-lenis-prevent
    >
      {/* FIXED CLOSE BUTTON IN TRANSPARENT AREA */}
      <div className="fixed top-0 inset-x-0 z-[100] flex items-center justify-center py-6 pointer-events-none">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={onClose}
          className="w-12 h-12 flex items-center justify-center bg-[#124131] rounded-full text-white shadow-2xl pointer-events-auto hover:bg-[#1f5c48] transition-colors z-[102]"
        >
          <X className="w-6 h-6 stroke-[1.5]" />
        </motion.button>
      </div>

      <div className="flex flex-col min-h-screen">
        {/* TRANSPARENT SPACER */}
        <div
          className="h-[100px] md:h-[120px] w-full bg-transparent"
          onClick={onClose}
        />

        {/* CONTENT SHEET */}
        <div className="flex-1 bg-[#0E3A2F] rounded-t-2xl md:rounded-t-[48px] shadow-[0_-20px_80px_rgba(0,0,0,0.6)] relative z-10">
          <div className="max-w-4xl mx-auto w-full pb-32">
            <div className="relative aspect-[4/3] md:aspect-[16/9] w-full overflow-hidden rounded-t-[32px] md:rounded-t-[48px] group">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentImageIndex}
                  custom={direction}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={images[currentImageIndex].image}
                    alt={images[currentImageIndex].name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                </motion.div>
              </AnimatePresence>

              {/* Numerical Pagination */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5">
                <span className="text-white font-philosopher text-gh-scroll leading-none">
                  {currentImageIndex + 1}
                </span>
                <div className="w-8 h-[1px] bg-white/40" />
                <span className="text-white/40 font-philosopher text-gh-scroll leading-none">
                  {images.length}
                </span>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center bg-transparent text-white/40 hover:text-white transition-all group z-10"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-sm group-hover:bg-[#EFCD62] group-hover:text-black transition-all">
                  <ArrowLeft className="w-5 h-5" />
                </div>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center bg-transparent text-white/40 hover:text-white transition-all group z-10"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-sm group-hover:bg-[#EFCD62] group-hover:text-black transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>

            {/* SPACE NAME */}
            <div className="mt-6 px-4 text-center">
              <span className="text-white/40 font-manrope text-gh-label font-bold tracking-[0.4em] uppercase">
                {images[currentImageIndex].name || "SPACE"}
              </span>
            </div>

            {/* INFO SECTION */}
            <div className="px-6 py-8">
              <div className="mb-4">
                <span className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase block mb-1">
                  {villa.type || "PARTY VILLA"}
                </span>
                <div className="flex justify-between items-center">
                  <h1 className="text-gh-h1 font-philosopher leading-tight">
                    {villa.name}
                  </h1>
                  <button className="p-2 text-white/70 hover:text-white transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center flex-wrap gap-4 text-white/70 font-manrope text-gh-label mb-8">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#EFCD62]" />
                  <span>{villa.location.split("·")[0]}</span>
                </div>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#EFCD62]" />
                  <span>Exclusive Estate</span>
                </div>
              </div>

              <p className="text-white/80 text-gh-body leading-relaxed mb-10 text-justify">
                {villa.description}
              </p>

              {/* QUICK STATS */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                {[
                  {
                    label: "Capacity",
                    value: villa.stats.events.split(" ")[0] || "30",
                    icon: Users,
                  },
                  {
                    label: "BHK",
                    value: villa.stats.bhk.split(" ")[0] || "4",
                    icon: Home,
                  },
                  {
                    label: "Stay",
                    value: villa.stats.stay.split(" ")[0] || "15",
                    icon: Home,
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center py-6 border border-white/10 bg-white/5 rounded-sm"
                  >
                    <stat.icon className="w-5 h-5 text-[#EFCD62] mb-3" />
                    <span className="text-white font-philosopher text-gh-scroll md:text-gh-h3 mb-1">
                      {stat.value}
                    </span>
                    <span className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* PERFECT FOR */}
              <div className="mb-12">
                <h4 className="text-white font-manrope font-bold text-gh-label uppercase tracking-widest mb-4">
                  PERFECT FOR CELEBRATIONS:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Birthdays",
                    "Anniversaries",
                    "Pool Parties",
                    "Reunions",
                  ].map((tag: string) => (
                    <span
                      key={tag}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-sm text-white/80 text-gh-label font-manrope"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* TABS NAVIGATION */}
              <div className="border-b border-white/10 mb-8 flex overflow-x-auto scrollbar-none">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabClick(tab)}
                    className={`px-4 py-4 text-gh-label md:text-gh-label font-bold tracking-widest uppercase transition-colors whitespace-nowrap border-b-2 ${
                      activeTab === tab
                        ? "border-[#EFCD62] text-[#EFCD62] bg-[#EFCD62]/5"
                        : "border-transparent text-white/40 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* TABS CONTENT */}
              <div className="relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {activeTab === "Amenities" && (
                      <section className="animate-in fade-in duration-500">
                        <h2 className="text-gh-h2 font-philosopher mb-8">
                          Villa Amenities
                        </h2>
                        <div className="space-y-6">
                          {(
                            villa.amenities || [
                              { label: "Private Pool" },
                              { label: "Music System" },
                              { label: "BBQ Setup" },
                              { label: "Indoor Games" },
                              { label: "Kitchen Access" },
                            ]
                          ).map((item: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="w-3 h-3 rotate-45 bg-[#EFCD62]" />
                              <span className="text-white font-manrope font-bold text-gh-body uppercase tracking-wider">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {activeTab === "Pricing" && (
                      <section className="animate-in fade-in duration-500">
                        <h2 className="text-gh-h2 font-philosopher mb-8">
                          Party Pricing
                        </h2>
                        {(() => {
                          const pricingData = [];
                          if (villa.pricing?.event) {
                            pricingData.push({
                              ...villa.pricing.event,
                              title: "Party Rental",
                              subtitle: "6-12 hour sessions",
                            });
                          }
                          if (villa.pricing?.stay) {
                            pricingData.push({
                              ...villa.pricing.stay,
                              title: "Overnight Celebration",
                              subtitle: "Stay included",
                            });
                          }

                          return pricingData.map((rent: any, idx: number) => (
                            <div
                              key={idx}
                              className="border border-white/10 rounded-sm p-6 bg-white/5 mb-6"
                            >
                              <h4 className="text-[#EFCD62] text-gh-h3 font-manrope font-semibold mb-1">
                                {rent.title}
                              </h4>
                              <p className="text-white/40 text-gh-desc mb-6">
                                {rent.subtitle || rent.duration}
                              </p>
                              <div className="space-y-3 mb-8">
                                {(rent.packages || rent.items).map(
                                  (item: any, i: number) => (
                                    <div
                                      key={i}
                                      className="flex justify-between items-center bg-black/20 p-4 rounded-sm border border-white/5"
                                    >
                                      <div className="flex flex-col">
                                        <span className="text-white font-bold text-gh-desc mb-1 uppercase tracking-wide">
                                          {item.label}
                                        </span>
                                        <span className="text-white/40 text-gh-label leading-tight">
                                          {item.sublabel || item.head}
                                        </span>
                                      </div>
                                      <div className="text-white font-bold text-gh-scroll md:text-gh-h3 uppercase tracking-tighter text-right">
                                        {item.price}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                              <div className="space-y-4">
                                <span className="text-white/40 text-gh-label font-bold uppercase tracking-widest">
                                  Included:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {(rent.features || rent.included || []).map(
                                    (inc: string) => (
                                      <span
                                        key={inc}
                                        className="px-3 py-1.5 bg-[#174539] border border-white/5 rounded-sm text-white/70 text-gh-label"
                                      >
                                        {inc}
                                      </span>
                                    ),
                                  )}
                                </div>
                              </div>
                            </div>
                          ));
                        })()}
                        <p className="mt-6 text-gh-label text-white/30 leading-relaxed italic">
                          Note: All party pricing is exclusive of GST. Custom
                          packages available.
                        </p>
                      </section>
                    )}

                    {activeTab === "Location" && (
                      <section className="animate-in fade-in duration-500">
                        <h2 className="text-gh-h2 font-philosopher mb-8">
                          Location
                        </h2>
                        <div className="rounded-xl overflow-hidden border border-white/5 bg-white/5">
                          <div className="relative aspect-video w-full bg-white/10">
                            <Image
                              src="/X/Magnolia/VILLA2.webp"
                              alt="Map"
                              fill
                              className="object-cover opacity-60"
                            />
                          </div>
                          <div className="p-6">
                            <div className="flex gap-4 mb-6">
                              <MapPin className="w-6 h-6 text-[#EFCD62] shrink-0" />
                              <div>
                                <p className="text-gh-body font-manrope leading-relaxed">
                                  {villa.locationDetails?.address ||
                                    villa.location}
                                </p>
                              </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg text-center">
                              <p className="text-gh-label text-white/60">
                                Approximately 45 minutes from Bangalore City
                                Center
                              </p>
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                    {activeTab === "Walkthrough" && (
                      <section className="animate-in fade-in duration-500">
                        <h2 className="text-gh-h2 font-philosopher mb-8">
                          Video Walkthrough
                        </h2>
                        <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-black/40 border border-white/10 group cursor-pointer">
                          <Image
                            src="/X/Magnolia/22.webp"
                            alt="Video Cover"
                            fill
                            className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full border border-white flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                              <ArrowRight className="w-6 h-6 text-white" />
                            </div>
                          </div>
                        </div>
                      </section>
                    )}

                    {activeTab === "FAQ" && (
                      <section className="animate-in fade-in duration-500">
                        <h2 className="text-gh-h2 font-philosopher mb-10">
                          FAQ
                        </h2>
                        <div className="space-y-8">
                          {villa.faq?.map((item: any, idx: number) => (
                            <div key={idx} className="flex gap-4 group">
                              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center mt-1">
                                <div className="w-2 h-2 rotate-45 bg-[#EFCD62]" />
                              </div>
                              <div>
                                <h4 className="text-white font-manrope font-bold text-gh-body mb-2">
                                  {item.question}
                                </h4>
                                <p className="text-white/60 text-gh-body leading-relaxed">
                                  {item.answer}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="mt-16 pt-12 border-t border-white/5">
                          <h3 className="text-gh-scroll font-philosopher mb-8">
                            Key Policies
                          </h3>
                          <div className="space-y-6">
                            {[
                              {
                                title: "Check-in / Check-out",
                                desc: "Standard check-in at 2:00 PM and check-out at 11:00 AM. Early check-in subject to availability.",
                              },
                              {
                                title: "Music & Noise",
                                desc: "Outdoor music allowed till 10:00 PM as per local regulations. Indoor music can continue at moderate levels.",
                              },
                              {
                                title: "Refund Policy",
                                desc: "Full refund for cancellations made 15 days prior to check-in. No refunds within 7 days of booking.",
                              },
                            ].map((policy) => (
                              <div key={policy.title} className="flex gap-4">
                                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center mt-1">
                                  <div className="w-2 h-2 rotate-45 bg-[#EFCD62]" />
                                </div>
                                <div>
                                  <h4 className="text-white font-manrope font-bold text-gh-body mb-1">
                                    {policy.title}
                                  </h4>
                                  <p className="text-white/40 text-gh-desc leading-relaxed">
                                    {policy.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* ENQUIRY FORM */}
              <div
                ref={formRef}
                className="mt-24 pt-24 border-t border-white/10"
              >
                <h2 className="text-gh-h1 font-philosopher mb-4">
                  Plan Your Celebration
                </h2>
                <p className="text-white/50 text-gh-body mb-12">
                  Share a few details. Our concierge team will help you pick the
                  perfect villa for your party.
                </p>

                <form className="space-y-6">
                  <div className="relative">
                    <label className="absolute -top-2.5 left-4 bg-[#0D4032] px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-white/20 rounded-sm px-6 py-4 focus:border-[#EFCD62] outline-none transition-colors"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <label className="absolute -top-2.5 left-4 bg-[#0D4032] px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full bg-transparent border border-white/20 rounded-sm px-6 py-4 focus:border-[#EFCD62] outline-none transition-colors"
                        placeholder="+91"
                      />
                    </div>
                    <div className="relative">
                      <label className="absolute -top-2.5 left-4 bg-[#0D4032] px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10">
                        Event Date
                      </label>
                      <input
                        type="date"
                        className="w-full bg-transparent border border-white/20 rounded-sm px-6 py-4 focus:border-[#EFCD62] outline-none transition-colors [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="absolute -top-2.5 left-4 bg-[#0D4032] px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10">
                      Celebration Type
                    </label>
                    <select className="w-full bg-[#0D4032] border border-white/20 rounded-sm px-6 py-4 focus:border-[#EFCD62] outline-none transition-colors appearance-none">
                      <option>Birthday Party</option>
                      <option>Anniversary</option>
                      <option>Pool Party</option>
                      <option>Get-together</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <button className="w-full py-5 bg-[#174539] border border-white/10 text-white font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all">
                    ENQUIRE NOW
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FLOATING BOTTOM BAR */}
      <div className="fixed bottom-0 inset-x-0 z-50 px-4 py-3 bg-[#0D4032] border-t border-white/10 flex items-center justify-between gap-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col">
          <span className="text-white/40 text-gh-label uppercase font-bold tracking-[0.2em] block mb-0.5">
            Starting from
          </span>
          <span className="text-white font-manrope font-bold text-gh-body tracking-tight">
            ₹35,000 onwards
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() => window.open("#", "_blank")}
            className="text-[#EFCD62] font-manrope font-bold text-gh-label tracking-widest uppercase hover:text-white transition-colors border-b border-transparent hover:border-[#EFCD62]"
          >
            VIEW VENUE
          </button>
          <PrimaryButton withArrow={false} onClick={scrollToForm}>
            ENQUIRE
          </PrimaryButton>
        </div>
      </div>
    </motion.div>,
    document.body,
  );
};

export default PartyVenueOverlay;

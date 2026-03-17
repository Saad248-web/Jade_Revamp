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
  Check,
  ChevronRight,
  Play,
} from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";

interface CorporateVenueOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  villa: any;
}

const CorporateVenueOverlay: React.FC<CorporateVenueOverlayProps> = ({
  isOpen,
  onClose,
  villa,
}) => {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Amenities");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

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
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center bg-[#1E5D48] rounded-full border border-white/10 hover:bg-white/10 transition-colors pointer-events-auto shadow-xl"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col min-h-screen">
        {/* TRANSPARENT SPACER */}
        <div
          className="h-[100px] md:h-[120px] w-full bg-transparent"
          onClick={onClose}
        />

        {/* CONTENT SHEET */}
        <div className="flex-1 bg-[#0D4032] rounded-t-[32px] md:rounded-t-[48px] shadow-[0_-20px_80px_rgba(0,0,0,0.6)] relative z-10">
          <div className="max-w-4xl mx-auto w-full pb-32">
            {/* HERO IMAGE SECTION */}
            <div className="relative aspect-[4/5] md:aspect-[16/9] w-full overflow-hidden rounded-t-[32px] md:rounded-t-[48px] group">
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
                {images[currentImageIndex].name || "Property"}
              </span>
            </div>

            {/* INFO SECTION */}
            <div className="px-6 py-8">
              <div className="mb-4">
                <span className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase block mb-1">
                  {villa.type || "HOBBIT-INSPIRED CORPORATE RETREAT"}
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
                  <span>2-acre private retreat</span>
                </div>
              </div>

              <p className="text-white/80 text-gh-body leading-relaxed mb-10 text-justify">
                {villa.description ||
                  `${villa.name} by Jade is an expansive corporate retreat featuring private spaces, lush lawns, and dedicated outdoor areas. Designed for corporate offsites, team celebrations, and immersive workations, the venue balances structured productivity with open-air engagement.`}
              </p>

              {/* QUICK STATS */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                {[
                  { label: "Capacity", value: "200", icon: Users },
                  { label: "Property", value: "1.5 Acre", icon: Calendar },
                  { label: "Stay", value: "30", icon: Home },
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
                  Perfect for:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Corporate Offsites",
                    "Leadership Retreats",
                    "Team Outings",
                    "Workations",
                    "Recognition Events",
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
                    className={`px-4 py-4 text-gh-label font-bold tracking-widest uppercase transition-colors whitespace-nowrap border-b-2 ${
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
              <div className="relative overflow-hidden min-h-[400px]">
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
                          Venue Amenities
                        </h2>
                        <div className="space-y-6">
                          {[
                            "EXPANSIVE LAWN AREA",
                            "OUTDOOR STAGE SETUP",
                            "PRESENTATION & WHITEBOARD SETUP",
                            "HIGH-SPEED WI-FI",
                            "IN-HOUSE CHEF",
                            "PARKING FOR 80 CARS",
                            "BBQ & BONFIRE AREA",
                            "DJ AND SOUND SYSTEM",
                            "CATERING KITCHEN",
                            "PREMIUM RESTROOMS",
                          ].map((item, idx) => (
                            <div key={idx} className="flex items-center gap-4">
                              <div className="w-3 h-3 rotate-45 bg-[#EFCD62]" />
                              <span className="text-white/90 text-gh-body font-bold uppercase tracking-wider">
                                {item}
                              </span>
                            </div>
                          ))}
                        </div>
                      </section>
                    )}

                    {activeTab === "Pricing" && (
                      <section className="animate-in fade-in duration-500">
                        <h2 className="text-gh-h2 font-philosopher mb-8">
                          Pricing
                        </h2>
                        <div className="space-y-8">
                          {/* Day Outing Card */}
                          <div className="p-6 border border-white/5 bg-white/5 rounded-xl">
                            <div className="mb-6">
                              <h3 className="text-[#EFCD62] text-gh-h3 font-bold mb-1">
                                Day Outing
                              </h3>
                              <p className="text-white/40 text-gh-desc italic">
                                8 hours
                              </p>
                            </div>
                            <div className="space-y-4 mb-8">
                              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                                <div>
                                  <p className="font-bold text-gh-body">
                                    Up to 100 Guests
                                  </p>
                                  <p className="text-gh-label text-white/40">
                                    ≈ ₹1500/head
                                  </p>
                                </div>
                                <p className="text-gh-scroll md:text-gh-h3 font-bold">
                                  ₹1,50,000
                                </p>
                              </div>
                              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                                <div>
                                  <p className="font-bold text-gh-body">
                                    Up to 200 Guests
                                  </p>
                                  <p className="text-gh-label text-white/40">
                                    ≈ ₹1250/head
                                  </p>
                                </div>
                                <p className="text-gh-scroll md:text-gh-h3 font-bold">
                                  ₹2,25,000
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-gh-label font-bold uppercase tracking-widest text-white/40 mb-3">
                                Included:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-white/5 rounded-md text-gh-label text-white/80">
                                  Includes lunch & high tea
                                </span>
                                <span className="px-3 py-1.5 bg-white/5 rounded-md text-gh-label text-white/80">
                                  Custom activity available at additional cost
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Overnight Card */}
                          <div className="p-6 border border-white/5 bg-white/5 rounded-xl">
                            <div className="mb-6">
                              <h3 className="text-[#EFCD62] text-gh-h3 font-bold mb-1">
                                Overnight Corporate Stay
                              </h3>
                              <p className="text-white/40 text-gh-desc italic">
                                22 hours
                              </p>
                            </div>
                            <div className="space-y-4 mb-8">
                              <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                                <p className="font-bold text-gh-body">
                                  Up to 30 Guests
                                </p>
                                <p className="text-gh-scroll md:text-gh-h3 font-bold">
                                  ₹3,500-5,000/head
                                </p>
                              </div>
                            </div>
                            <div>
                              <p className="text-gh-label font-bold uppercase tracking-widest text-white/40 mb-3">
                                Included:
                              </p>
                              <div className="flex flex-wrap gap-2">
                                <span className="px-3 py-1.5 bg-white/5 rounded-md text-gh-label text-white/80">
                                  Includes all meals
                                </span>
                                <span className="px-3 py-1.5 bg-white/5 rounded-md text-gh-label text-white/80">
                                  Customised menus
                                </span>
                                <span className="px-3 py-1.5 bg-white/5 rounded-md text-gh-label text-white/80">
                                  team-building activities available on request.
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <p className="mt-6 text-gh-label text-white/30 leading-relaxed italic">
                          Note: Prices are base rates and may vary based on
                          season, day of week, and specific requirements.
                          Additional charges may apply for decorations,
                          catering, and extended hours.
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
                              src="/assets/map_placeholder.png"
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
                                  Sy 48/14, Channaveerenahalli Village, Sasalu
                                  Hobli Doddaballapura, 561204
                                </p>
                              </div>
                            </div>
                            <div className="p-3 bg-white/5 rounded-lg text-center">
                              <p className="text-gh-label text-white/60">
                                Approximately 60-75 minutes from Central
                                Bengaluru
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-12">
                          <h4 className="text-[#EFCD62] text-gh-label font-bold uppercase tracking-[0.2em] mb-6">
                            WHATS NEARBY:
                          </h4>
                          <div className="space-y-4">
                            {[
                              { name: "MAKALIDURGA HILLS", dist: "1 km away" },
                              { name: "HULUKUDI BETTA", dist: "5 km away" },
                              { name: "GUNDAMAGERE LAKE", dist: "2 km away" },
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center justify-between"
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-2.5 h-2.5 rotate-45 bg-[#EFCD62]" />
                                  <span className="text-gh-body font-bold uppercase tracking-widest">
                                    {item.name}
                                  </span>
                                </div>
                                <span className="text-gh-label text-white/60">
                                  {item.dist}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </section>
                    )}

                    {activeTab === "Walkthrough" && (
                      <section className="animate-in fade-in duration-500">
                        <h2 className="text-gh-h2 font-philosopher mb-8">
                          Video Walkthrough
                        </h2>
                        <div className="relative aspect-video rounded-xl overflow-hidden group cursor-pointer">
                          <Image
                            src="/assets/Walkthrough_Cover.png"
                            alt="Walkthrough"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-all">
                            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40">
                              <Play className="w-6 h-6 fill-white text-white" />
                            </div>
                          </div>
                          <div className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 rounded text-gh-label font-bold">
                            1:41
                          </div>
                        </div>
                      </section>
                    )}

                    {activeTab === "FAQ" && (
                      <section className="animate-in fade-in duration-500">
                        <h2 className="text-gh-h2 font-philosopher mb-8">
                          FAQ
                        </h2>
                        <div className="space-y-10">
                          {[
                            {
                              q: "Is Wi-Fi available for work sessions?",
                              a: "Yes, high-speed Wi-Fi is available for presentations and structured sessions.",
                            },
                            {
                              q: "Can seating layouts be customised?",
                              a: "Yes, seating can be arranged based on workshop, conference, or recognition formats.",
                            },
                            {
                              q: "Are team-building activities included?",
                              a: "Activities can be curated and hosted by professional emcees at an additional cost.",
                            },
                            {
                              q: "Is the venue fully private?",
                              a: "Yes, Dome Villas is an exclusive-use property with no shared spaces.",
                            },
                          ].map((item, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex items-start gap-4">
                                <div className="w-2.5 h-2.5 rotate-45 bg-[#EFCD62] mt-1 shrink-0" />
                                <div>
                                  <h4 className="text-gh-body font-bold text-white leading-tight mb-2">
                                    {item.q}
                                  </h4>
                                  <p className="text-gh-label text-white/60 leading-relaxed">
                                    {item.a}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* KEY POLICIES */}
                        <div className="mt-24">
                          <h2 className="text-gh-h2 font-philosopher mb-8">
                            Key Policies
                          </h2>
                          <div className="space-y-10">
                            {[
                              {
                                t: "Cancellation Policy",
                                d: "Full refund if cancelled 90+ days before. 50% refund for 30-90 days. No refund within 30 days.",
                              },
                              {
                                t: "Booking Requirements",
                                d: "30% advance payment required. Balance due 15 days before event. Refundable security deposit applicable.",
                              },
                              {
                                t: "Outside Vendors",
                                d: "You can bring your own caterers, decorators, and photographers. Coordination required.",
                              },
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-start gap-4">
                                <div className="w-2.5 h-2.5 rotate-45 bg-[#EFCD62] mt-1 shrink-0" />
                                <div>
                                  <h4 className="text-gh-body font-bold text-white mb-2">
                                    {item.t}
                                  </h4>
                                  <p className="text-gh-label text-white/60 leading-relaxed">
                                    {item.d}
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
              <section
                id="section-form"
                ref={formRef}
                className="mt-32 pt-16 border-t border-white/5"
              >
                <h2 className="text-gh-h1 font-philosopher mb-4">
                  Plan Your Corporate Retreat
                </h2>
                <p className="text-white/60 text-gh-body mb-12">
                  Share a few details. Our wedding team will guide you through
                  venues & pricing.
                </p>

                <form className="space-y-6">
                  <div className="relative">
                    <label className="absolute -top-3 left-4 bg-[#0D4032] px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10 font-manrope">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-white/20 rounded-[4px] px-6 py-4 focus:border-[#EFCD62] outline-none transition-colors text-white text-gh-body"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      placeholder="Company Name*"
                      className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors"
                    />
                    <input
                      placeholder="Phone Number*"
                      className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      placeholder="Email*"
                      className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors"
                    />
                    <input
                      placeholder="Team Size*"
                      className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors"
                    />
                  </div>

                  <div className="relative">
                    <input
                      placeholder="Date"
                      className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors pr-12"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  </div>

                  <div className="py-6">
                    <h4 className="text-white font-bold text-gh-body mb-4">
                      Retreat Format
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4">
                      {[
                        "Leadership Retreat",
                        "Day Outing / Team Outing",
                        "Recognition Programme",
                        "Offsite (Overnight)",
                        "Conference / Workshop",
                        "Success Party",
                      ].map((label) => (
                        <label
                          key={label}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-5 h-5 border border-white/20 rounded flex items-center justify-center group-hover:border-[#EFCD62] transition-colors">
                            <Check className="w-3 h-3 text-[#EFCD62] opacity-0 group-hover:opacity-100" />
                          </div>
                          <span className="text-gh-label text-white/70 group-hover:text-white">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="py-6 border-t border-white/5">
                    <h4 className="text-white font-bold text-gh-body mb-4">
                      Services Required:
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4">
                      {[
                        "Décor & Event Setup",
                        "AV & Presentation Setup",
                        "Emcee / Host",
                        "Photography/Videography",
                        "Catering & F&B",
                        "Team-Building Activities",
                        "DJ & Entertainment",
                        "Not Sure Yet",
                      ].map((label) => (
                        <label
                          key={label}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-5 h-5 border border-white/20 rounded flex items-center justify-center group-hover:border-[#EFCD62] transition-colors">
                            <Check className="w-3 h-3 text-[#EFCD62] opacity-0 group-hover:opacity-100" />
                          </div>
                          <span className="text-gh-label text-white/70 group-hover:text-white">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="py-6 border-t border-white/5">
                    <h4 className="text-white font-bold text-gh-body mb-4">
                      Preferred Setting
                    </h4>
                    <div className="grid grid-cols-2 gap-y-4">
                      {[
                        "Outdoor Lawn Setup",
                        "Poolside / Informal Setup",
                        "Indoor Conference Setup",
                        "Indoor & Outdoor",
                      ].map((label) => (
                        <label
                          key={label}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-5 h-5 border border-white/20 rounded flex items-center justify-center group-hover:border-[#EFCD62] transition-colors">
                            <Check className="w-3 h-3 text-[#EFCD62] opacity-0 group-hover:opacity-100" />
                          </div>
                          <span className="text-gh-label text-white/70 group-hover:text-white">
                            {label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="relative py-6">
                    <textarea
                      placeholder="Additional requests"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors"
                    />
                  </div>

                  <button className="w-full py-5 bg-[#174539] border border-white/10 text-white font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all">
                    SUBMIT ENQUIRE
                  </button>
                </form>
              </section>
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
            ₹1,50,000
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

export default CorporateVenueOverlay;

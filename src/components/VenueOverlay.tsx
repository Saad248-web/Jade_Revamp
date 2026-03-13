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
  Car,
  Home,
  ArrowRight,
  Play,
  Calendar,
  Check,
  Phone,
  Mail,
  User,
} from "lucide-react";
import PrimaryButton from "@/components/PrimaryButton";

interface VenueOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  villa: any;
}

const VenueOverlay: React.FC<VenueOverlayProps> = ({
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

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getPrice = () => {
    if (villa.id === "tranquil-woods") return "₹65,000";
    if (villa.id === "magnolia" || villa.id === "diamond") return "₹99,000";
    return "₹75,000";
  };
  const price = getPrice();

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
            {/* IMAGE CAROUSEL */}
            <div className="relative aspect-[4/5] md:aspect-[16/9] w-full overflow-hidden bg-black/20 group rounded-t-[32px] md:rounded-t-[48px]">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentImageIndex}
                  custom={direction}
                  initial={{ x: direction > 0 ? "100%" : "-100%", opacity: 1 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: direction > 0 ? "-100%" : "100%", opacity: 1 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
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
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-4 bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5">
                <span className="text-white font-philosopher text-lg leading-none">
                  {currentImageIndex + 1}
                </span>
                <div className="w-8 h-[1px] bg-white/40" />
                <span className="text-white/40 font-philosopher text-lg leading-none">
                  {images.length}
                </span>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevImage}
                className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center bg-black/0 hover:bg-black/10 text-white/40 hover:text-white transition-all group z-10"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-sm group-hover:bg-[#EFCD62] group-hover:text-black transition-all">
                  <ArrowLeft className="w-5 h-5" />
                </div>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center bg-black/0 hover:bg-black/10 text-white/40 hover:text-white transition-all group z-10"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-sm group-hover:bg-[#EFCD62] group-hover:text-black transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </button>
            </div>

            {/* SPACE NAME - ELEVATED FOR FLOATING FEEL */}
            <div className="mt-6 px-4 text-center">
              <span className="text-white/40 font-manrope text-[10px] font-bold tracking-[0.4em] uppercase">
                {images[currentImageIndex].name || "SPACE"}
              </span>
            </div>

            {/* INFO SECTION */}
            <div className="px-4 py-8">
              <div className="mb-4">
                <span className="text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.2em] uppercase block mb-2">
                  {villa.type || "HOBBIT THEMED FARMHOUSE"}
                </span>
                <div className="flex justify-between items-center">
                  <h1 className="text-gh-h1 font-philosopher leading-tight">
                    {villa.name}
                  </h1>
                  <button className="p-2 text-white hover:text-[#EFCD62] transition-colors">
                    <Share2 className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-6 text-white/70 font-manrope text-gh-body mb-8">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-[#EFCD62]" />
                  <span>{villa.location.split("·")[0]}</span>
                </div>
                <div className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-[#EFCD62]" />
                  <span>2-acre estate</span>
                </div>
              </div>

              <p className="text-white/70 text-gh-body leading-relaxed mb-12 text-justify">
                {villa.description}
              </p>

              {/* QUICK STATS */}
              <div className="grid grid-cols-3 gap-4 mb-12">
                {[
                  {
                    label: "Guests",
                    value:
                      villa.stats.events.split("-")[1]?.split(" ")[0] || "600",
                    icon: Users,
                  },
                  { label: "Parking", value: "80", icon: Car },
                  {
                    label: "Stay",
                    value:
                      villa.stats.stay.split("-")[1]?.split(" ")[0] || "20",
                    icon: Home,
                  },
                ].map((stat, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center justify-center py-6 border border-white/10 bg-white/5 rounded-sm"
                  >
                    <stat.icon className="w-5 h-5 text-[#EFCD62] mb-3" />
                    <span className="text-white font-philosopher text-2xl md:text-3xl mb-1">
                      {stat.value}
                    </span>
                    <span className="text-[#EFCD62] text-[9px] font-bold tracking-[0.2em] uppercase">
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
                  {villa.perfectFor.map((tag: string) => (
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
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-4 text-xs md:text-gh-label font-bold tracking-widest uppercase transition-colors whitespace-nowrap border-b-2 ${
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
                      <div className="space-y-8">
                        <h3 className="text-gh-h2 font-philosopher">
                          Venue Amenities
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                          {(
                            villa.amenities || [
                              { label: "Lawn Space" },
                              { label: "Private Pool" },
                              { label: "Stay Accommodation" },
                              { label: "Kitchen Access" },
                              { label: "Parking" },
                            ]
                          ).map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="flex items-center gap-4 group"
                            >
                              <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                                <div className="w-2.5 h-2.5 rotate-45 bg-[#EFCD62]" />
                              </div>
                              <span className="text-white font-manrope font-bold text-gh-body uppercase tracking-wider">
                                {item.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === "Pricing" && (
                      <div className="space-y-12">
                        <h3 className="text-gh-h2 font-philosopher">Pricing</h3>
                        {(() => {
                          const pricingData = [];

                          // 1. Half-Day Rental (Mapped from event)
                          if (villa.pricing?.event) {
                            pricingData.push({
                              ...villa.pricing.event,
                              title: "Half-Day Rental",
                              subtitle: "6 hours",
                            });
                          }

                          // 2. Full-Day Rental (Mapped from stay)
                          if (villa.pricing?.stay) {
                            pricingData.push({
                              ...villa.pricing.stay,
                              title: "Full-Day Rental",
                              subtitle: "12 hours",
                            });
                          }

                          // 3. Multi-Day Events
                          pricingData.push({
                            title: "Multi-Day Events",
                            subtitle: "24+ hours (Customizable)",
                            packages: [
                              {
                                label: "Starting Package",
                                sublabel: "Custom quotes",
                                price: "On Request",
                              },
                            ],
                            features: [
                              "Full Estate Access",
                              "Overnight Stay",
                              "Event Coordination",
                              "Security",
                            ],
                          });

                          return pricingData.map((rent: any, idx: number) => (
                            <div
                              key={idx}
                              className="border border-white/10 rounded-sm p-5 md:p-6 bg-white/5 mb-6"
                            >
                              <h4 className="text-[#EFCD62] text-xl font-manrope font-semibold mb-1">
                                {rent.title}
                              </h4>
                              <p className="text-white/40 text-sm mb-6">
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
                                        <span className="text-white font-bold text-sm mb-1 uppercase tracking-wide">
                                          {item.label}
                                        </span>
                                        <span className="text-white/40 text-[10px] leading-tight">
                                          {item.sublabel || item.head}
                                        </span>
                                      </div>
                                      <div className="text-white font-bold text-lg md:text-xl uppercase tracking-tighter text-right">
                                        {item.price}
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>

                              <div className="space-y-4">
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">
                                  Included:
                                </span>
                                <div className="flex flex-wrap gap-2">
                                  {(rent.features || rent.included).map(
                                    (inc: string) => (
                                      <span
                                        key={inc}
                                        className="px-3 py-1.5 bg-[#174539] border border-white/5 rounded-sm text-white/70 text-[11px]"
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
                        <p className="text-white/40 text-gh-label leading-relaxed">
                          Note: Prices are base rates and may vary based on
                          season, day of week, and specific requirements.
                          Additional charges may apply for decorations,
                          catering, and extended hours.
                        </p>
                      </div>
                    )}

                    {activeTab === "Location" && (
                      <div className="space-y-8">
                        <h3 className="text-gh-h2 font-philosopher">
                          Location
                        </h3>
                        <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-gray-800 border border-white/10">
                          <Image
                            src={
                              villa.locationDetails?.mapImage ||
                              "/assets/map_placeholder.png"
                            }
                            alt="Map"
                            fill
                            className="object-cover opacity-80"
                          />
                        </div>
                        <div className="border border-white/10 p-6 md:p-8 rounded-sm bg-white/5 flex items-start gap-4">
                          <MapPin className="w-6 h-6 text-[#EFCD62] shrink-0 mt-1" />
                          <div>
                            <p className="text-white font-manrope text-gh-body leading-relaxed mb-4">
                              {villa.locationDetails?.address ||
                                "Tranquil Woods, Kanakapura Road, Bangalore - 560062"}
                            </p>
                            <div className="px-4 py-2 bg-white/5 rounded-sm inline-block">
                              <span className="text-white/60 text-gh-label">
                                Approximately 45 minutes from Bangalore City
                                Center
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="pt-8">
                          <h4 className="text-[#EFCD62] font-manrope font-bold text-gh-label uppercase tracking-widest mb-6">
                            WHATS NEARBY:
                          </h4>
                          <div className="space-y-4">
                            {[
                              { label: "JW MARRIOT", dist: "1 km away" },
                              { label: "AIRPORT", dist: "5 km away" },
                              { label: "BUS STATION", dist: "2 km away" },
                            ].map((place) => (
                              <div
                                key={place.label}
                                className="flex justify-between items-center py-2 border-b border-white/5"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-2 h-2 rotate-45 bg-[#EFCD62]" />
                                  <span className="text-white font-bold uppercase tracking-wider text-sm">
                                    {place.label}
                                  </span>
                                </div>
                                <span className="text-white/60 text-sm">
                                  {place.dist}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "Walkthrough" && (
                      <div className="space-y-8">
                        <h3 className="text-gh-h2 font-philosopher">
                          Video Walkthrough
                        </h3>
                        <div className="relative aspect-video w-full overflow-hidden rounded-sm bg-black/40 border border-white/10 group cursor-pointer">
                          <Image
                            src="/assets/Walkthrough_Cover.png"
                            alt="Video Cover"
                            fill
                            className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                          />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-20 h-20 rounded-full border-2 border-white flex items-center justify-center bg-white/10 backdrop-blur-sm group-hover:scale-110 transition-transform">
                              <Play className="w-8 h-8 text-white fill-white ml-1" />
                            </div>
                          </div>
                          <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 rounded text-xs">
                            1:41
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "FAQ" && (
                      <div className="space-y-12">
                        <h3 className="text-gh-h2 font-philosopher">FAQ</h3>
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

                        <div className="pt-12">
                          <h3 className="text-gh-h2 font-philosopher mb-8">
                            Key Policies
                          </h3>
                          <div className="space-y-8">
                            {[
                              {
                                title: "Cancellation Policy",
                                desc: "Full refund if cancelled 90+ days before. 50% refund for 30-90 days. No refund within 30 days.",
                              },
                              {
                                title: "Booking Requirements",
                                desc: "30% advance payment required. Balance due 15 days before event. Refundable security deposit applicable.",
                              },
                              {
                                title: "Outside Vendors",
                                desc: "You can bring your own caterers, decorators, and photographers. Coordination required.",
                              },
                            ].map((policy) => (
                              <div
                                key={policy.title}
                                className="flex gap-4 group"
                              >
                                <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center mt-1">
                                  <div className="w-2 h-2 rotate-45 bg-[#EFCD62]" />
                                </div>
                                <div>
                                  <h4 className="text-white font-manrope font-bold text-gh-body mb-2">
                                    {policy.title}
                                  </h4>
                                  <p className="text-white/60 text-gh-body leading-relaxed">
                                    {policy.desc}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
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
                  Plan Your Wedding at Jade
                </h2>
                <p className="text-white/60 text-gh-body mb-12">
                  Share a few details. Our wedding team will guide you through
                  venues & pricing.
                </p>

                <form className="space-y-6">
                  <div className="relative">
                    <label className="absolute -top-3 left-4 bg-[#0D4032] px-2 text-white/40 text-[10px] uppercase font-bold tracking-widest z-10 font-manrope">
                      Full Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-transparent border border-white/20 rounded-[4px] px-6 py-4 focus:border-[#EFCD62] outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="Phone Number*"
                        className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Email*"
                        className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Date"
                      className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none transition-colors pr-12"
                    />
                    <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  </div>

                  <div className="space-y-4">
                    <p className="text-white/60 text-gh-label font-bold uppercase tracking-widest">
                      Services Required:
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Décor & Styling",
                        "Catering",
                        "Photography",
                        "Music & Entertainment",
                        "Not decided yet",
                      ].map((s) => (
                        <label
                          key={s}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-5 h-5 border border-white/20 flex items-center justify-center group-hover:border-[#EFCD62] transition-colors">
                            <Check className="w-4 h-4 text-[#EFCD62] opacity-0" />
                          </div>
                          <span className="text-white/80 text-sm md:text-gh-body">
                            {s}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <p className="text-white/60 text-gh-label font-bold uppercase tracking-widest">
                      Events You're Planning
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        "Mehendi",
                        "Haldi",
                        "Sangeet",
                        "Cocktail Night",
                        "Bachelor / Bachelorette",
                        "Pre-Wedding Shoot",
                      ].map((e) => (
                        <label
                          key={e}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-5 h-5 border border-white/20 flex items-center justify-center group-hover:border-[#EFCD62] transition-colors">
                            <Check className="w-4 h-4 text-[#EFCD62] opacity-0" />
                          </div>
                          <span className="text-white/80 text-sm md:text-gh-body">
                            {e}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <p className="text-white/60 text-gh-label font-bold uppercase tracking-widest">
                      Preferred Setting
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                      {["Outdoor", "Indoor", "Combination of both"].map((p) => (
                        <label
                          key={p}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <div className="w-5 h-5 border border-white/20 flex items-center justify-center group-hover:border-[#EFCD62] transition-colors">
                            <Check className="w-4 h-4 text-[#EFCD62] opacity-0" />
                          </div>
                          <span className="text-white/80 text-sm md:text-gh-body">
                            {p}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <textarea
                      placeholder="Additional requests"
                      rows={4}
                      className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none transition-colors"
                    />
                  </div>

                  <button className="w-full py-5 bg-[#174539] border border-white/10 text-white font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all">
                    CONTACT US
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PRICING BAR (REPLACES BOTTOM NAV) */}
      <div className="fixed bottom-0 inset-x-0 z-50 px-4 py-3 bg-[#0D4032] border-t border-white/10 flex items-center justify-between gap-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        <div className="flex flex-col">
          <span className="text-white/40 text-[10px] uppercase font-bold tracking-[0.2em] block mb-0.5">
            Starting from
          </span>
          <span className="text-white font-manrope font-bold text-[14px] tracking-tight">
            {price}
          </span>
        </div>
        <div className="flex items-center gap-6">
          <button
            onClick={() =>
              window.open(villa.locationDetails?.mapLink || "#", "_blank")
            }
            className="text-[#EFCD62] font-manrope font-bold text-[12px] tracking-widest uppercase hover:text-white transition-colors border-b border-transparent hover:border-[#EFCD62]"
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

export default VenueOverlay;

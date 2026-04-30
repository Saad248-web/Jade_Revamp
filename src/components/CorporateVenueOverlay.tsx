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
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { buildVillaGalleryItems } from "@/lib/villaGallery";

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
  const MotionDiv = motion.div;
  const MotionButton = motion.button;
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Amenities");
  const [view, setView] = useState<"form" | "success">("form");
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

  useEffect(() => {
    if (!isOpen) return;
    setCurrentImageIndex(0);
    setDirection(0);
    setView("form");
  }, [isOpen, villa?.id]);

  const images = (() => {
    const gallery = buildVillaGalleryItems(villa, 8);
    if (gallery.length > 0) return gallery;
    if (villa?.spaces?.length > 0) return villa.spaces;
    return [{ name: "Main", image: villa?.image }];
  })();

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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id.toLowerCase());
    if (element) {
      const container = element.closest(".overflow-y-auto");
      if (container) {
        const offset = 80;
        const elementPosition = element.offsetTop;
        container.scrollTo({
          top: elementPosition - offset,
          behavior: "smooth",
        });
      }
    }
  };

  useEffect(() => {
    const container = document.querySelector(".fixed.inset-0.z-\\[9999\\]");
    if (!container) return;

    const sectionIds = [
      "amenities",
      "pricing",
      "location",
      "walkthrough",
      "faq",
    ];

    const observerOptions = {
      root: container,
      rootMargin: "-20% 0px -40% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          setActiveTab(id.charAt(0).toUpperCase() + id.slice(1));
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isOpen, mounted]);

  if (!mounted || !isOpen || !villa) return null;

  return createPortal(
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[9999] bg-[#0E3A2F] overflow-y-auto text-white scrollbar-none"
      data-lenis-prevent
    >
      {/* FIXED CLOSE BUTTON (TOP-RIGHT) */}
      <MotionButton
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={onClose}
        aria-label="Close"
        className="fixed top-6 right-6 z-[200] w-12 h-12 flex items-center justify-center bg-[#124131] rounded-full text-white shadow-2xl pointer-events-auto hover:bg-[#1f5c48] transition-colors"
      >
        <X className="w-6 h-6 stroke-[1.5]" />
      </MotionButton>

      <div className="min-h-screen pb-28">
        {/* CONTENT (CENTERED LIKE BOOK PAGE) */}
        <div className="max-w-5xl mx-auto w-full pb-10 px-4 sm:px-6 md:px-8">
            {/* HERO IMAGE SECTION */}
            <div className="relative w-full h-[clamp(260px,50vh,600px)] overflow-hidden rounded-none group">
              <AnimatePresence initial={false} custom={direction}>
                <MotionDiv
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
                </MotionDiv>
              </AnimatePresence>

              {/* Numerical Pagination */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-black/20 backdrop-blur-sm px-4 py-1.5 rounded-full border border-white/5">
                <span className="text-white font-philosopher text-[14px] sm:text-[15px] md:text-[16px] leading-none">
                  {currentImageIndex + 1}
                </span>
                <div className="w-8 h-[1px] bg-white/40" />
                <span className="text-white/40 font-philosopher text-[14px] sm:text-[15px] md:text-[16px] leading-none">
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
              <span className="text-white/50 font-manrope text-gh-label font-bold tracking-[0.12em]">
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
                  {
                    label: "Offsite Cap.",
                    value: villa.stats?.events?.split(" ")[0] || "500",
                    icon: Users,
                  },
                  {
                    label: "Meeting Space",
                    value:
                      villa.stats?.lawn ||
                      villa.stats?.villaArea ||
                      "Lawn",
                    icon: Calendar,
                  },
                  {
                    label: "Stay Cap.",
                    value: villa.stats?.stay?.split(" ")[0] || "20",
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

              {/* TABS NAVIGATION - STICKY */}
              <div className="sticky top-0 z-[60] bg-[#0E3A2F] border-b border-white/10 mb-8 flex overflow-x-auto scrollbar-none py-2">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => scrollToSection(tab)}
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

              {/* ALL SECTIONS RENDERED STATICALLY */}
              <div className="space-y-24">
                {/* Amenities Section */}
                <section id="amenities" className="scroll-mt-24">
                  <div className="space-y-8">
                    <h3 className="text-gh-h2 font-philosopher">
                      Corporate Amenities
                    </h3>
                    <div className="space-y-6">
                      {(
                        villa.amenities || [
                          { label: "Conference Room" },
                          { label: "High-speed Wi-Fi" },
                          { label: "AV Equipment" },
                          { label: "Team Building Areas" },
                          { label: "Dining Hall" },
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
                  </div>
                </section>

                {/* Pricing Section */}
                <section id="pricing" className="scroll-mt-24">
                  <div className="space-y-12">
                    <h3 className="text-gh-h2 font-philosopher">
                      Corporate Pricing
                    </h3>
                    {(() => {
                      const pricingData = [];
                      if (villa.pricing?.event) {
                        pricingData.push({
                          ...villa.pricing.event,
                          title: "Day Conference",
                          subtitle: "6-12 hour sessions",
                        });
                      }
                      if (villa.pricing?.stay) {
                        pricingData.push({
                          ...villa.pricing.stay,
                          title: "Residential Offsite",
                          subtitle: "Includes stay & meals",
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
                                  <div className="text-white font-bold text-[15px] sm:text-[16px] md:text-[18px] leading-tight uppercase tracking-wide text-right">
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
                      Note: All corporate pricing is exclusive of GST. Custom
                      packages for team building activities available.
                    </p>
                  </div>
                </section>

                {/* Location Section */}
                <section id="location" className="scroll-mt-24">
                  <div className="space-y-8">
                    <h3 className="text-gh-h2 font-philosopher">Location</h3>
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
                              {villa.locationDetails?.address || villa.location}
                            </p>
                          </div>
                        </div>
                        <div className="p-3 bg-white/5 rounded-lg text-center">
                          <p className="text-gh-label text-white/60">
                            Approximately 45 minutes from Bangalore City Center
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Walkthrough Section */}
                <section id="walkthrough" className="scroll-mt-24">
                  <div className="space-y-8">
                    <h3 className="text-gh-h2 font-philosopher">
                      Video Walkthrough
                    </h3>
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
                  </div>
                </section>

                {/* FAQ Section */}
                <section id="faq" className="scroll-mt-24">
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

                    <div className="mt-16 pt-12 border-t border-white/5">
                      <h3 className="text-gh-scroll font-philosopher mb-8">
                        Key Policies
                      </h3>
                      <div className="space-y-6">
                        {[
                          {
                            title: "AV Equipment",
                            desc: "Projectors, screens, and basic sound systems are included. Specialized equipment on request.",
                          },
                          {
                            title: "Catering",
                            desc: "In-house culinary team provides all meals. Customized corporate menus available.",
                          },
                          {
                            title: "Booking Policy",
                            desc: "50% advance required to block dates. Full payment due week before the event.",
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
                  </div>
                </section>
              </div>

              {/* ENQUIRY FORM */}
              <section
                id="enquiry"
                ref={formRef}
                className="mt-24 pt-24 border-t border-white/10"
              >
                {view === "form" ? (
                  <>
                    <h2 className="text-gh-h1 font-philosopher mb-4">
                      Plan Your Corporate Retreat
                    </h2>
                    <p className="text-white/60 text-gh-body mb-12">
                      Share a few details. Our wedding team will guide you
                      through venues & pricing.
                    </p>

                    <form
                      className="space-y-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setView("success");
                      }}
                    >
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

                      <p className="text-[11px] text-white/30 pt-2 text-center font-manrope">
                        By proceeding, you agree to our{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={onClose}
                        >
                          Privacy Policy
                        </Link>
                        ,{" "}
                        <Link
                          href="/terms-conditions"
                          className="text-[#EFCD62] hover:underline"
                          onClick={onClose}
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/refund-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={onClose}
                        >
                          Refund Policy
                        </Link>
                      </p>

                      <button
                        type="submit"
                        className="w-full py-5 bg-[#174539] border border-white/10 text-white font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                      >
                        SUBMIT ENQUIRE
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="w-[180px] h-[180px] shrink-0 relative mb-8 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl">
                      <div className="w-[84px] h-[84px] shrink-0 relative drop-shadow-2xl">
                        <Image
                          src="/assets/JAde%20Correction.png"
                          alt="Success Check"
                          fill
                          sizes="96px"
                          quality={100}
                          className="object-contain"
                        />
                      </div>
                    </div>

                    <h2 className="text-white text-shadow-sm text-[36px] font-philosopher mb-4">
                      We've got it from here
                    </h2>

                    <p className="text-white/90 text-[16px] leading-relaxed mb-12 max-w-sm mx-auto">
                      Thanks for sharing your details!
                      <br />
                      Our team will take a look and reach out shortly to
                      understand things better.
                    </p>

                    <div className="flex flex-col w-full max-w-[300px] mx-auto">
                      <p className="text-white/60 text-[11px] font-bold tracking-[0.2em] uppercase mb-5">
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

                      <p className="text-white/60 text-[13px] mb-10 mt-6">
                        Thoughtfully operated. Always.
                      </p>

                      <PrimaryButton
                        withArrow={false}
                        className="w-full"
                        onClick={() => setView("form")}
                      >
                        SUBMIT ANOTHER
                      </PrimaryButton>
                    </div>
                  </div>
                )}
              </section>
            </div>
        </div>
      </div>

      {/* BOTTOM PRICE BAR (SAME AS VILLA DETAIL PAGE) */}
      <div className="fixed bottom-0 left-0 w-full bg-[#1A1C1E] border-t border-white/10 py-4 z-[150] transition-all flex justify-center">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-4 px-4 md:px-12">
          <p className="font-manrope whitespace-nowrap leading-tight">
            <span className="text-white/60 text-[11px] sm:text-[12px] md:text-[13px] font-bold">
              Starting from
            </span>{" "}
            <span className="text-white text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-extrabold">
              ₹75,000
            </span>
          </p>
          <div className="flex items-center gap-4 md:gap-6">
            <button
              onClick={() => scrollToSection("enquiry")}
              className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase hover:text-white transition-colors whitespace-nowrap"
            >
              ENQUIRE
            </button>
            <PrimaryButton
              href={`/book?villa=${villa.id}`}
              withArrow={false}
              className="whitespace-nowrap"
            >
              BOOK VILLA
            </PrimaryButton>
          </div>
        </div>
      </div>
    </MotionDiv>,
    document.body,
  );
};

export default CorporateVenueOverlay;

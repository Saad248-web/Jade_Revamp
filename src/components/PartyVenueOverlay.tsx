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
  Facebook,
  Instagram,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { buildVillaGalleryItems } from "@/lib/villaGallery";
import { getBhk, getEventCapacity, getStayCapacity } from "@/lib/villaDisplay";
import { getOverlayVillaData } from "@/lib/overlayVillaData";

interface PartyVenueOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  villa: any;
  overlayPage?: "party";
}

const PartyVenueOverlay: React.FC<PartyVenueOverlayProps> = ({
  isOpen,
  onClose,
  villa,
  overlayPage,
}) => {
  const MotionDiv = motion.div;
  const MotionButton = motion.button;
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("Amenities");
  const [view, setView] = useState<"form" | "success">("form");
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

  useEffect(() => {
    if (!isOpen) return;
    setCurrentImageIndex(0);
    setDirection(0);
    setView("form");
  }, [isOpen, villa?.id]);

  const overlayVilla = getOverlayVillaData((overlayPage ?? "party") as any, villa?.id);
  const v = overlayVilla ?? villa;

  const images = (() => {
    const gallery = buildVillaGalleryItems(v, 8);
    if (gallery.length > 0) return gallery;
    if (v?.spaces?.length > 0) return v.spaces;
    return [{ name: "Main", image: v?.image }];
  })();

  const displayPrice = (overlayVilla as any)?.overlay?.onwardsPrice ?? null;

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
                    value: getEventCapacity(villa)?.toString() || villa.stats?.events?.split(" ")[0] || "30",
                    icon: Users,
                  },
                  {
                    label: "BHK",
                    value: getBhk(villa)?.toString() || villa.stats?.bhk?.split(" ")[0] || "4",
                    icon: Home,
                  },
                  {
                    label: "Stay",
                    value:
                      getStayCapacity(villa)?.toString() || villa.stats?.stay?.split(" ")[0] || "15",
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

                {/* Pricing Section */}
                <section id="pricing" className="scroll-mt-24">
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
                    Note: All party pricing is exclusive of GST. Custom packages
                    available.
                  </p>
                </section>

                {/* Location Section */}
                <section id="location" className="scroll-mt-24">
                  <h2 className="text-gh-h2 font-philosopher mb-8">Location</h2>
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
                </section>

                {/* Walkthrough Section */}
                <section id="walkthrough" className="scroll-mt-24">
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

                {/* FAQ Section */}
                <section id="faq" className="scroll-mt-24">
                  <h2 className="text-gh-h2 font-philosopher mb-10">FAQ</h2>
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
              </div>

              {/* ENQUIRY FORM */}
              <div
                id="enquiry"
                ref={formRef}
                className="mt-24 pt-24 border-t border-white/10"
              >
                {view === "form" ? (
                  <>
                    <h2 className="text-gh-h1 font-philosopher mb-4">
                      Plan Your Celebration
                    </h2>
                    <p className="text-white/50 text-gh-body mb-12">
                      Share a few details. Our concierge team will help you pick
                      the perfect villa for your party.
                    </p>

                    <form
                      className="space-y-6"
                      onSubmit={(e) => {
                        e.preventDefault();
                        setView("success");
                      }}
                    >
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

                      <p className="text-[11px] text-white/30 pt-2 text-center font-manrope">
                        By proceeding, you agree to our{" "}
                        <Link
                          href="/privacy-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={() => onClose()}
                        >
                          Privacy Policy
                        </Link>
                        ,{" "}
                        <Link
                          href="/terms-conditions"
                          className="text-[#EFCD62] hover:underline"
                          onClick={() => onClose()}
                        >
                          Terms & Conditions
                        </Link>{" "}
                        and{" "}
                        <Link
                          href="/refund-policy"
                          className="text-[#EFCD62] hover:underline"
                          onClick={() => onClose()}
                        >
                          Refund Policy
                        </Link>
                      </p>

                      <button
                        type="submit"
                        className="w-full py-5 bg-[#174539] border border-white/10 text-white font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                      >
                        ENQUIRE NOW
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
              </div>
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
              {displayPrice || "Enquire"}
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

export default PartyVenueOverlay;

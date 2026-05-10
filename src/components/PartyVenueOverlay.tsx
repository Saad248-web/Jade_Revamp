"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Share2,
  MapPin,
  Users,
  Home,
  Play,
  Waves,
  ShieldCheck,
  Facebook,
  Instagram,
  Youtube,
  Wifi,
  Wind,
  Dribbble,
  Presentation,
  Trees,
  Mountain,
  PartyPopper,
  Bath,
  Sun,
  ChefHat,
  SprayCan,
  User,
  Phone,
  Check,
  Zap,
  LayoutGrid,
  Leaf,
  HandPlatter,
  Bell,
  Sparkles,
  Heart,
  Coffee,
  Search,
  Mic,
  Music,
  Info,
  Download,
} from "lucide-react";

// Icon mapping helper matching villa detail page
const getIcon = (iconName?: string, title?: string) => {
  const icons: any = {
    Wifi,
    Car: Users, // fallback Car to Users if needed, or import Car
    Wind,
    Waves,
    Dribbble,
    Presentation,
    Trees,
    Mountain,
    PartyPopper,
    Bath,
    Home,
    Sun,
    ChefHat,
    SprayCan,
    User,
    Phone: Users,
    Check,
    Zap,
    LayoutGrid,
    Leaf,
    HandPlatter,
    Bell,
    Sparkles,
    ShieldCheck,
    Heart,
    Coffee,
    Search,
    Mic,
    Music,
  };

  const name = iconName?.toLowerCase() || "";
  const t = title?.toLowerCase() || "";

  if (icons[iconName || ""]) return icons[iconName || ""];

  if (name.includes("chef") || t.includes("chef") || t.includes("cooking"))
    return ChefHat;
  if (name.includes("butler") || t.includes("butler") || t.includes("service"))
    return HandPlatter;
  if (
    name.includes("housekeeping") ||
    t.includes("housekeeping") ||
    t.includes("cleaning")
  )
    return Sparkles;
  if (
    name.includes("concierge") ||
    t.includes("concierge") ||
    t.includes("help") ||
    t.includes("phone")
  )
    return Bell;
  if (name.includes("security") || t.includes("security")) return ShieldCheck;
  if (name.includes("wellness") || t.includes("wellness") || t.includes("spa"))
    return Heart;
  if (
    name.includes("breakfast") ||
    t.includes("breakfast") ||
    t.includes("coffee")
  )
    return Coffee;

  return icons[iconName || ""] || Info;
};
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { buildVillaGalleryItems } from "@/lib/villaGallery";
import { getBhk, getEventCapacity, getStayCapacity } from "@/lib/villaDisplay";
import { getOverlayVillaData } from "@/lib/overlayVillaData";
import type { HeroSplitCustom } from "@/lib/heroSplitCarouselVariants";
import { getVillaGoogleMapsUrl } from "@/lib/googleMapsLinks";
import {
  EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS,
  EXPERIENCE_OVERLAY_ROOT_CLASS,
} from "@/lib/experienceOverlayTheme";
import {
  VillaExperienceBookingBottomBar,
  VillaExperienceHeroCarousel,
  VillaExperienceOverlayCloseFramer,
  VillaExperienceOverlayContentFrame,
  VillaExperienceStickyTabs,
} from "@/components/experience/VillaExperienceOverlayLayout";
import VillaPricingBlocks, {
  buildPartyOverlayPricingBlocks,
} from "@/components/experience/VillaPricingBlocks";
import ExperienceFaqAccordion, {
  ExperiencePolicyCompactList,
} from "@/components/experience/ExperienceFaqAccordion";

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
  const reducedMotion = useReducedMotion();
  const overlayCarouselCustom: HeroSplitCustom = {
    dir: direction,
    lowFx: !!reducedMotion,
  };
  const formRef = useRef<HTMLDivElement>(null);
  const [partyFullName, setPartyFullName] = useState("");
  const [partyPhone, setPartyPhone] = useState("");
  const [partyEmail, setPartyEmail] = useState("");
  const [partyDate, setPartyDate] = useState("");
  const [partyType, setPartyType] = useState("Birthday Party");
  const [partyFormError, setPartyFormError] = useState<string | null>(null);

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
  const mapsHref = getVillaGoogleMapsUrl(v);
  const partyPricingBlocks = buildPartyOverlayPricingBlocks(v);

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
      className={EXPERIENCE_OVERLAY_ROOT_CLASS}
      data-lenis-prevent
    >
      <VillaExperienceOverlayCloseFramer MotionButton={MotionButton} onClose={onClose} />

      <VillaExperienceOverlayContentFrame>
            <VillaExperienceHeroCarousel
              images={images}
              currentImageIndex={currentImageIndex}
              carouselCustom={overlayCarouselCustom}
              onPrev={prevImage}
              onNext={nextImage}
            />

            {/* ── CHARCOAL: Title / Info / Stats / Description ─────────── */}
            <div className="w-full bg-[#25282C]">
              <div className="px-6 py-8 md:px-12 md:py-16 max-w-7xl mx-auto">
                {/* Header info sitting directly in max-w-7xl for full-width alignment like detail page */}
                <div className="flex flex-col gap-2 mb-8">
                  <span className="text-[#EFCD62] text-[10px] md:text-gh-label font-bold tracking-[0.2em] uppercase">
                    {villa.type || "PARTY VILLA"}
                  </span>
                  <h1 className="text-[28px] md:text-[32px] font-philosopher text-white mb-1 leading-tight">
                    {villa.name}
                  </h1>
                  <a href={mapsHref} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-2.5 text-white/90 mt-2 w-fit hover:text-[#EFCD62] transition-colors"
                    aria-label="Open location in Google Maps">
                    <MapPin className="w-5 h-5 text-white/70 shrink-0" />
                    <span className="font-manrope text-[15px] md:text-[18px] underline-offset-4 group-hover:underline">
                      {v.location?.split("·")[0]}
                    </span>
                  </a>
                </div>

                <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-x-4 items-center text-white/90 mb-10 text-[10px] md:text-[12px] lg:text-[14px] font-normal font-manrope tracking-wide pb-2 -mr-6 pr-6 md:-mr-12 md:pr-12">
                  <div className="flex items-center gap-2.5 whitespace-nowrap flex-shrink-0">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                    <span>{getEventCapacity(villa)?.toString() || villa.stats?.events || "30 Guests"}</span>
                  </div>
                  <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />
                  <div className="flex items-center gap-2.5 whitespace-nowrap flex-shrink-0">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                    <span>{getBhk(villa)?.toString() || villa.stats?.bhk || "4 BHK"}</span>
                  </div>
                  <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />
                  <div className="flex items-center gap-2.5 whitespace-nowrap flex-shrink-0">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                    <span>{getStayCapacity(villa)?.toString() || villa.stats?.stay || "15 Stay"}</span>
                  </div>
                </div>

                {/* Horizontal amenity cards (Categories UI) — perfectly matches splitting & style of detail page */}
                {villa.amenities && villa.amenities.length > 0 && (
                  <div className="flex gap-3 overflow-x-auto pb-6 mb-12 snap-x scrollbar-none -mr-6 pr-6 md:-mr-12 md:pr-12">
                    {villa.amenities.map((amenity: any, idx: number) => {
                      const IconComponent = getIcon(amenity.icon, amenity.label);
                      const words = (amenity.label || "").split(" ");
                      const label = words.length > 2 ? words.slice(0, 2).join(" ") : words[0] || "";
                      const sublabel = words.length > 2 ? words.slice(2).join(" ") : words.slice(1).join(" ");

                      return (
                        <div key={idx}
                          className="relative min-w-[130px] h-[130px] md:min-w-[140px] md:h-[140px] bg-white/[0.07] backdrop-blur-[12px] flex flex-col items-center justify-between text-center px-4 py-5 rounded-none snap-start flex-shrink-0"
                          style={{ border: "1px solid", borderImageSource: "linear-gradient(135deg,rgba(255,255,255,0.95) 0%,rgba(255,255,255,0) 40%,rgba(255,255,255,0) 60%,rgba(255,255,255,0.2) 100%)", borderImageSlice: 1 }}>
                          <IconComponent className="w-[26px] h-[26px] text-white/80 mt-1" strokeWidth={1} />
                          <div className="flex flex-col items-center w-full">
                            <span className="text-white font-manrope font-medium text-[15px] leading-tight text-center break-words w-full">{label}</span>
                            {sublabel && (
                              <span className="text-white/60 font-manrope text-[13px] leading-tight mt-1 text-center break-words w-full">{sublabel}</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <p className="font-manrope text-white/80 text-gh-body leading-relaxed mb-10 whitespace-pre-line text-justify">
                  {villa.description}
                </p>

                <div className="mb-4">
                  <h4 className="text-white font-manrope font-bold text-gh-label uppercase tracking-widest mb-4">PERFECT FOR:</h4>
                  <div className="flex flex-wrap gap-2">
                    {["Birthdays", "Anniversaries", "Pool Parties", "Reunions"].map((tag) => (
                      <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 text-white/80 text-gh-label font-manrope">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── STICKY TABS ─────────────────────────────────────────────── */}
            <VillaExperienceStickyTabs tabs={tabs} activeTab={activeTab} onTabClick={(tab) => scrollToSection(tab)} />

            {/* ── GREEN: Amenities ─────────────────────────────────────────── */}
            <section id="amenities" className="w-full bg-[#0B2C23] text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-10 md:py-16">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-gh-h2 font-philosopher mb-8">Villa Amenities</h2>
                  <div className="space-y-6">
                    {(villa.amenities || [
                      { label: "Private Pool" }, { label: "Music System" },
                      { label: "BBQ Setup" }, { label: "Indoor Games" }, { label: "Kitchen Access" },
                    ]).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 sm:gap-4">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 bg-[#EFCD62] shrink-0" />
                        <span className="text-white font-manrope font-bold text-gh-body uppercase tracking-wider">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── CHARCOAL: Pricing ────────────────────────────────────────── */}
            {partyPricingBlocks.length > 0 && (
              <section id="pricing" className="w-full bg-[#25282C] text-white">
                <div className="px-6 md:px-12 max-w-7xl mx-auto py-10 md:py-16">
                  <div className="max-w-4xl mx-auto">
                    <VillaPricingBlocks
                      sectionTitle="Party Pricing"
                      blocks={partyPricingBlocks}
                      footnote={<p className="mt-6 text-gh-label text-white/30 leading-relaxed italic">Note: All party pricing is exclusive of GST. Custom packages available.</p>}
                    />
                  </div>
                </div>
              </section>
            )}

            {/* ── GREEN: Location ───────────────────────────────────────────── */}
            <section id="location" className="w-full bg-[#0B2C23] text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-10 md:py-16">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-gh-h2 font-philosopher mb-8">Location</h2>
                  <div className="overflow-hidden mb-8 border border-white/10">
                    <a href={mapsHref} target="_blank" rel="noopener noreferrer"
                      className="relative block w-full h-64 md:h-80 cursor-pointer outline-none transition-opacity hover:opacity-95"
                      aria-label="Open location in Google Maps">
                      <Image src={v.locationDetails?.mapImage || "/Villa_Retreats/Magnolia/Spaces/Villa.webp"} alt="Map" fill className="object-cover opacity-70" sizes="100vw" loading="lazy" />
                    </a>
                    <div className="p-5 md:p-6 border-t border-white/10">
                      <a href={mapsHref} target="_blank" rel="noopener noreferrer"
                        className="group flex items-start gap-4 outline-none hover:text-[#EFCD62] transition-colors">
                        <MapPin className="w-5 h-5 text-[#EFCD62] shrink-0 mt-1" aria-hidden />
                        <p className="text-white text-gh-body font-manrope font-medium leading-relaxed group-hover:underline underline-offset-4">
                          {v.locationDetails?.address || v.location}
                        </p>
                      </a>
                      <div className="w-full bg-white/[0.03] border border-white/5 px-4 py-3 mt-6">
                        <p className="text-white/60 text-[12px] md:text-[13px] font-manrope">
                          {v.locationDetails?.distance || "Approximately 45 minutes from Bangalore City Center"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── CHARCOAL: Walkthrough ────────────────────────────────────── */}
            <section id="walkthrough" className="w-full bg-[#25282C] text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-10 md:py-16">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-gh-h2 font-philosopher mb-8">Video Walkthrough</h2>
                  <div className="relative aspect-video w-full overflow-hidden bg-black/40 border border-white/10 group cursor-pointer">
                    <Image src="/Villa_Retreats/Magnolia/Hero/hero.webp" alt="Video Cover" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ── GREEN: FAQ + Policies ─────────────────────────────────────── */}
            <section id="faq" className="w-full bg-[#0B2C23] text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-10 md:py-16">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-gh-h2 font-philosopher mb-8">FAQ</h2>
                  <ExperienceFaqAccordion items={(villa.faq || []).map((item: any) => ({ question: item.question, answer: item.answer }))} />
                  <div className="mt-12 pt-8 border-t border-white/5">
                    <h3 className="text-gh-h2 font-philosopher mb-6">Key Policies</h3>
                    <ExperiencePolicyCompactList policies={[
                      { title: "Check-in / Check-out", desc: "Standard check-in at 2:00 PM and check-out at 11:00 AM. Early check-in subject to availability." },
                      { title: "Music & Noise", desc: "Outdoor music allowed till 10:00 PM as per local regulations. Indoor music can continue at moderate levels." },
                      { title: "Refund Policy", desc: "Full refund for cancellations made 15 days prior to check-in. No refunds within 7 days of booking." },
                    ]} />
                  </div>
                </div>
              </div>
            </section>

            {/* ── CHARCOAL: Enquiry Form ────────────────────────────────────── */}
            <div className="w-full bg-[#25282C] text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-10 md:py-16">
                <div className="max-w-4xl mx-auto">
                  <div id="enquiry" ref={formRef}>
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
                            if (!partyFullName.trim()) {
                              setPartyFormError("Please enter your full name.");
                              return;
                            }
                            if (!/^[\d\s+()-]{10,}/.test(partyPhone.trim())) {
                              setPartyFormError(
                                "Please enter a valid phone number (at least 10 digits).",
                              );
                              return;
                            }
                            if (
                              partyEmail.trim() &&
                              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                                partyEmail.trim(),
                              )
                            ) {
                              setPartyFormError("Please enter a valid email.");
                              return;
                            }
                            if (!partyDate) {
                              setPartyFormError("Please choose an event date.");
                              return;
                            }
                            setPartyFormError(null);
                            setView("success");
                          }}
                          noValidate
                        >
                          {partyFormError ? (
                            <p
                              className="text-red-400 text-gh-label font-manrope"
                              role="alert"
                            >
                              {partyFormError}
                            </p>
                          ) : null}
                          <div className="relative">
                            <label
                              className={`absolute -top-2.5 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10`}
                            >
                              Full Name *
                            </label>
                            <input
                              type="text"
                              value={partyFullName}
                              onChange={(e) => setPartyFullName(e.target.value)}
                              className="w-full bg-transparent border border-white/20 rounded-sm px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors"
                              placeholder="Enter your name"
                            />
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative">
                              <label
                                className={`absolute -top-2.5 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10`}
                              >
                                Phone *
                              </label>
                              <input
                                type="tel"
                                value={partyPhone}
                                onChange={(e) => setPartyPhone(e.target.value)}
                                className="w-full bg-transparent border border-white/20 rounded-sm px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors"
                                placeholder="+91"
                                autoComplete="tel"
                              />
                            </div>
                            <div className="relative">
                              <label
                                htmlFor="party-event-date"
                                className={`absolute -top-2.5 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10`}
                              >
                                Event date *
                              </label>
                              <input
                                id="party-event-date"
                                type="date"
                                value={partyDate}
                                min={new Date().toISOString().slice(0, 10)}
                                onChange={(e) => setPartyDate(e.target.value)}
                                className="w-full bg-transparent border border-white/20 rounded-sm px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors [color-scheme:dark]"
                              />
                            </div>
                          </div>

                          <input
                            type="email"
                            value={partyEmail}
                            onChange={(e) => setPartyEmail(e.target.value)}
                            placeholder="Email (optional)"
                            className="w-full bg-white/5 border border-white/10 rounded-sm px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors placeholder:text-white/35"
                            autoComplete="email"
                          />

                          <div className="relative">
                            <label
                              className={`absolute -top-2.5 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10`}
                            >
                              Celebration Type
                            </label>
                            <select
                              value={partyType}
                              onChange={(e) => setPartyType(e.target.value)}
                              className={`w-full ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} border border-white/20 rounded-sm px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors appearance-none`}
                            >
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
                            className="w-full py-5 bg-[#EFCD62] text-black font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all"
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
      </VillaExperienceOverlayContentFrame>

      <VillaExperienceBookingBottomBar
        villaId={v.id}
        onwardPrice={displayPrice}
        onEnquireClick={() => scrollToSection("enquiry")}
      />
    </MotionDiv>,
    document.body,
  );
};

export default PartyVenueOverlay;

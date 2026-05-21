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
  ArrowRight,
  Calendar,
  ChevronRight,
  Play,
  Facebook,
  Instagram,
  Youtube,
  Check,
} from "lucide-react";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { useVillaListingImages } from "@/lib/useVillaListingImages";
import { getEventCapacity, getStayCapacity } from "@/lib/villaDisplay";
import type { OverlayPageKey } from "@/lib/overlayVillaData";
import { getOverlayVillaData } from "@/lib/overlayVillaData";
import type { HeroSplitCustom } from "@/lib/heroSplitCarouselVariants";
import { getVillaGoogleMapsUrl } from "@/lib/googleMapsLinks";
import VillaPricingBlocks, {
  buildCorporateOverlayPricingBlocks,
} from "@/components/experience/VillaPricingBlocks";
import ExperienceFaqAccordion, {
  ExperiencePolicyCompactList,
} from "@/components/experience/ExperienceFaqAccordion";
import {
  EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS,
  EXPERIENCE_OVERLAY_ROOT_CLASS,
} from "@/lib/experienceOverlayTheme";
import { useOverlayScrollChromeHide } from "@/lib/useOverlayScrollChromeHide";
import { useVenueOverlaySectionNav } from "@/lib/useVenueOverlaySectionNav";
import { sanitizePhoneDigitsInput } from "@/lib/phoneNumberInput";
import {
  VillaExperienceBookingBottomBar,
  VillaExperienceHeroCarousel,
  VillaExperienceOverlayCloseFramer,
  VillaExperienceOverlayBody,
  VillaExperienceStickyTabs,
  isExperienceOverlayMdUp,
} from "@/components/experience/VillaExperienceOverlayLayout";
import AmenityHighlightTile from "@/components/villa/AmenityHighlightTile";
import MeanderStrip from "@/components/ui/MeanderStrip";
import { VILLA_DETAIL_SPACING } from "@/components/villa/villaDetailSpacing";
import { getVillaDetailIcon } from "@/lib/villaDetailIcons";

interface CorporateVenueOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  villa: any;
  overlayPage?: OverlayPageKey;
}

const CorporateVenueOverlay: React.FC<CorporateVenueOverlayProps> = ({
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
  const { isHidden: isCloseButtonHidden, onScroll: handleScrollBase } =
    useOverlayScrollChromeHide(150);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!isExperienceOverlayMdUp()) return;
    handleScrollBase(e);
  };
  const overlayCarouselCustom: HeroSplitCustom = {
    dir: direction,
    lowFx: !!reducedMotion,
  };
  const formRef = useRef<HTMLDivElement>(null);
  const overlayScrollRef = useRef<HTMLDivElement>(null);
  const [overlayScrollRootGen, setOverlayScrollRootGen] = useState(0);
  const corpDateRef = useRef<HTMLInputElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const [corpFullName, setCorpFullName] = useState("");
  const [corpCompany, setCorpCompany] = useState("");
  const [corpPhone, setCorpPhone] = useState("");
  const [corpEmail, setCorpEmail] = useState("");
  const [corpTeamSize, setCorpTeamSize] = useState("");
  const [corpDate, setCorpDate] = useState("");
  const [corpFormats, setCorpFormats] = useState<Set<string>>(new Set());
  const [corpServices, setCorpServices] = useState<Set<string>>(new Set());
  const [corpPref, setCorpPref] = useState<Set<string>>(new Set());
  const [corpNotes, setCorpNotes] = useState("");
  const [corpError, setCorpError] = useState<string | null>(null);

  const corpToggle = (
    setFn: React.Dispatch<React.SetStateAction<Set<string>>>,
    label: string,
  ) => {
    setFn((prev) => {
      const n = new Set(prev);
      if (n.has(label)) n.delete(label);
      else n.add(label);
      return n;
    });
  };

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
    setActiveTab("Amenities");
  }, [isOpen, villa?.id]);

  const overlayVilla = getOverlayVillaData(overlayPage ?? "corporate", villa?.id);
  const v = overlayVilla ?? villa;
  const mapsHref = getVillaGoogleMapsUrl(v);
  const corporatePricingBlocks = buildCorporateOverlayPricingBlocks(v);
  const { images: listingImages, primaryImage } = useVillaListingImages(
    v?.id ? { id: v.id, name: v.name, image: v.image } : villa,
  );

  const images =
    listingImages.filter((i) => i.image).length > 0
      ? listingImages.filter((i) => i.image)
      : [{ name: "Main", image: v?.image || "" }];
  const walkthroughCover = primaryImage || v?.image || "";

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const tabs = ["Amenities", "Pricing", "Location", "Walkthrough", "FAQ"];

  const { scrollToSection } = useVenueOverlaySectionNav(
    overlayScrollRef,
    setActiveTab,
    isOpen && mounted,
    overlayScrollRootGen,
  );

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
      <VillaExperienceOverlayCloseFramer
        MotionButton={MotionButton}
        onClose={onClose}
        variant="above-sheet"
      />
      <VillaExperienceOverlayCloseFramer
        MotionButton={MotionButton}
        onClose={onClose}
        isHidden={isCloseButtonHidden}
        variant="fixed"
      />

      <VillaExperienceOverlayBody
        scrollRef={overlayScrollRef}
        onScroll={handleScroll}
        onScrollRootUpdated={() => setOverlayScrollRootGen((g) => g + 1)}
        onBackdropClick={onClose}
        mobileFooter={
          <VillaExperienceBookingBottomBar
            placement="sheet"
            villaId={v.id}
            onwardPrice={(overlayVilla as any)?.overlay?.onwardsPrice ?? null}
            onEnquireClick={() => scrollToSection("enquiry")}
          />
        }
        pinnedTop={
          <VillaExperienceHeroCarousel
            images={images}
            currentImageIndex={currentImageIndex}
            carouselCustom={overlayCarouselCustom}
            onPrev={prevImage}
            onNext={nextImage}
            fallbackSlideLabel="Property"
          />
        }
      >
            {/* ── CHARCOAL: Title / Info / Stats / Amenity Cards / Description ─── */}
            <div className="w-full bg-[#25282C]">
              <div className="px-6 py-6 md:px-12 md:py-12 max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col gap-2 mb-6">
                  <span className="text-[#EFCD62] text-[10px] md:text-gh-label font-bold tracking-[0.2em] uppercase">
                    {villa.type || "CORPORATE RETREAT"}
                  </span>
                  <h1 className="text-[28px] md:text-[32px] font-philosopher text-white mb-1 leading-tight">
                    {villa.name}
                  </h1>
                  <a href={mapsHref} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-white/90 mt-2 w-fit hover:text-[#EFCD62] transition-colors"
                    aria-label="Open location in Google Maps">
                    <MapPin className="w-5 h-5 text-white/70 shrink-0" />
                    <span className="font-manrope text-[15px] md:text-[18px] underline-offset-4 group-hover:underline">
                      {v.location?.split("·")[0]}
                    </span>
                  </a>
                </div>

                {/* Stats pill row — same as Villa Detail page */}
                <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-x-4 items-center text-white/90 mb-8 text-[10px] md:text-[12px] lg:text-[14px] font-normal font-manrope tracking-wide pb-2 -mr-6 pr-6 md:-mr-12 md:pr-12">
                  <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                    <span>{getEventCapacity(villa)?.toString() || villa.stats?.events || "500 Guests"}</span>
                  </div>
                  <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />
                  <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                    <span>{getStayCapacity(villa)?.toString() || villa.stats?.stay || "20 Stay"}</span>
                  </div>
                  <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />
                  <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                    <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                    <span>{villa.stats?.lawn || villa.stats?.villaArea || "Private Lawn"}</span>
                  </div>
                </div>

                {/* Horizontal amenity cards — same as Villa Detail page */}
                {v.amenities && v.amenities.length > 0 && (
                  <div
                    className={
                      VILLA_DETAIL_SPACING.amenityHighlightTrackOverlay
                    }
                  >
                    {v.amenities.map((amenity: any, idx: number) => {
                      const IconComponent = getVillaDetailIcon(amenity.icon);
                      const words = (amenity.label || "").split(" ");
                      const label = words.length > 2 ? words.slice(0, 2).join(" ") : words[0] || "";
                      const sublabel = words.length > 2 ? words.slice(2).join(" ") : words.slice(1).join(" ");
                      return (
                        <AmenityHighlightTile
                          key={idx}
                          icon={IconComponent}
                          label={label}
                          sublabel={sublabel || null}
                        />
                      );
                    })}
                  </div>
                )}

                {/* Description */}
                <p className="text-white/80 text-gh-body leading-relaxed mb-8 text-justify">
                  {villa.description ||
                    `${villa.name} by Jade is an expansive corporate retreat featuring private spaces, lush lawns, and dedicated outdoor areas. Designed for corporate offsites, team celebrations, and immersive workations, the venue balances structured productivity with open-air engagement.`}
                </p>

                {/* Perfect For tags */}
                <div className="mb-3">
                  <h4 className="text-white font-manrope font-bold text-gh-label uppercase tracking-widest mb-3">Perfect for:</h4>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Corporate Offsites",
                      "Leadership Retreats",
                      "Team Outings",
                      "Workations",
                      "Recognition Events",
                    ].map((tag: string) => (
                      <span key={tag} className="px-4 py-2 bg-white/5 border border-white/10 text-white/80 text-gh-label font-manrope">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <VillaExperienceStickyTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={(tab) => scrollToSection(tab)}
            />


            {/* ── GREEN: Amenities ─────────────────────────────────────────── */}
            <section id="amenities" className="w-full bg-jade-charcoal text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-gh-h2 font-philosopher mb-6">Corporate Amenities</h3>
                  <div className="space-y-5">
                    {(villa.amenities || [
                      { label: "Conference Room" },
                      { label: "High-speed Wi-Fi" },
                      { label: "AV Equipment" },
                      { label: "Team Building Areas" },
                      { label: "Dining Hall" },
                    ]).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-2.5 sm:gap-3">
                        <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rotate-45 bg-[#EFCD62] shrink-0" />
                        <span className="text-white font-manrope font-bold text-gh-body uppercase tracking-wider">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {corporatePricingBlocks.length > 0 ? <MeanderStrip accentLine="green" /> : null}

            {/* ── CHARCOAL: Pricing ────────────────────────────────────────── */}
            {corporatePricingBlocks.length > 0 && (
              <section id="pricing" className="w-full bg-jade-green text-white">
                <div className="px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-12">
                  <div className="max-w-4xl mx-auto">
                    <VillaPricingBlocks
                      variant="villa-detail"
                      sectionTitle="Corporate Pricing"
                      blocks={corporatePricingBlocks}
                      footnote={
                        <p className="mt-5 text-gh-label text-white/30 leading-relaxed italic">
                          Note: All corporate pricing is exclusive of GST. Custom packages for team building activities available.
                        </p>
                      }
                    />
                  </div>
                </div>
              </section>
            )}

            {corporatePricingBlocks.length > 0 ? <MeanderStrip track="green" /> : null}

            {/* ── GREEN: Location ───────────────────────────────────────────── */}
            <section id="location" className="w-full bg-jade-charcoal text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-gh-h2 font-philosopher mb-6">Location</h3>
                  <div className="overflow-hidden mb-6 border border-white/10">
                    <a href={mapsHref} target="_blank" rel="noopener noreferrer"
                      className="relative block w-full h-64 md:h-80 cursor-pointer outline-none transition-opacity hover:opacity-95"
                      aria-label="Open location in Google Maps">
                      <Image src={v.locationDetails?.mapImage || primaryImage || "/Villa_Retreats/Magnolia/Spaces/Villa.webp"} alt="Map" fill className="object-cover opacity-70" sizes="100vw" loading="lazy" />
                    </a>
                    <div className="p-5 md:p-6 border-t border-white/10">
                      <a href={mapsHref} target="_blank" rel="noopener noreferrer"
                        className="group flex items-start gap-3 outline-none hover:text-[#EFCD62] transition-colors">
                        <MapPin className="w-5 h-5 text-[#EFCD62] shrink-0 mt-1" aria-hidden />
                        <p className="text-white text-gh-body font-manrope font-medium leading-relaxed group-hover:underline underline-offset-4">
                          {v.locationDetails?.address || v.location}
                        </p>
                      </a>
                      <div className="w-full bg-white/[0.03] border border-white/5 px-4 py-3 mt-5">
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
            <section id="walkthrough" className="w-full bg-jade-charcoal text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-gh-h2 font-philosopher mb-6">Video Walkthrough</h3>
                  <div className="relative aspect-video w-full overflow-hidden bg-black/40 border border-white/10 group cursor-pointer">
                    <Image src={walkthroughCover || "/Villa_Retreats/Magnolia/Hero/hero.webp"} alt="Video Cover" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
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
            <section id="faq" className="w-full bg-jade-charcoal text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-gh-h2 font-philosopher mb-6">FAQ</h3>
                  <ExperienceFaqAccordion items={(villa.faq || []).map((item: any) => ({ question: item.question, answer: item.answer }))} />
                  <div className="mt-10 pt-6 border-t border-white/5">
                    <h3 className="text-gh-h2 font-philosopher mb-5">Key Policies</h3>
                    <ExperiencePolicyCompactList policies={[
                      { title: "AV Equipment", desc: "Projectors, screens, and basic sound systems are included. Specialized equipment on request." },
                      { title: "Catering", desc: "In-house culinary team provides all meals. Customized corporate menus available." },
                      { title: "Booking Policy", desc: "50% advance required to block dates. Full payment due week before the event." },
                    ]} />
                  </div>
                </div>
              </div>
            </section>


            {/* ── CHARCOAL: Enquiry Form ────────────────────────────────────── */}
            <div className="w-full bg-jade-charcoal text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                  <div id="enquiry" ref={formRef}>
                {view === "form" ? (
                  <>
                    <h2 className="text-gh-h1 font-philosopher mb-3">
                      Plan Your Corporate Retreat
                    </h2>
                    <p className="text-white/60 text-gh-body mb-10">
                      Share a few details. Our corporate team will guide you
                      through venues &amp; pricing.
                    </p>

                    <form
                      className="space-y-5"
                      noValidate
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!corpFullName.trim()) {
                          setCorpError("Please enter your full name.");
                          return;
                        }
                        if (!corpCompany.trim()) {
                          setCorpError("Please enter your company name.");
                          return;
                        }
                        if (!/^[\d\s+()-]{10,}$/.test(corpPhone.trim())) {
                          setCorpError(
                            "Please enter a valid phone number (at least 10 digits).",
                          );
                          return;
                        }
                        if (
                          !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(corpEmail.trim())
                        ) {
                          setCorpError("Please enter a valid email address.");
                          return;
                        }
                        if (!corpTeamSize.trim()) {
                          setCorpError("Please enter an approximate team size.");
                          return;
                        }
                        if (!corpDate) {
                          setCorpError("Please choose an event date.");
                          return;
                        }
                        setCorpError(null);
                        setView("success");
                      }}
                    >
                      {corpError ? (
                        <p className="text-red-400 text-gh-label" role="alert">
                          {corpError}
                        </p>
                      ) : null}

                      <div className="relative">
                        <label
                          className={`absolute -top-3 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10 font-manrope`}
                        >
                          Full Name *
                        </label>
                        <input
                          type="text"
                          value={corpFullName}
                          onChange={(e) => setCorpFullName(e.target.value)}
                          className="w-full bg-transparent border border-white/20 rounded-[4px] px-6 py-4 focus:border-[#EFCD62] outline-none transition-colors text-white text-gh-body"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input
                          placeholder="Company Name *"
                          value={corpCompany}
                          onChange={(e) => setCorpCompany(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors placeholder:text-white/35"
                        />
                        <input
                          type="tel"
                          inputMode="numeric"
                          placeholder="Phone Number *"
                          value={corpPhone}
                          onChange={(e) =>
                            setCorpPhone(sanitizePhoneDigitsInput(e.target.value))
                          }
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors placeholder:text-white/35"
                          autoComplete="tel"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <input
                          type="email"
                          placeholder="Email *"
                          value={corpEmail}
                          onChange={(e) => setCorpEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors placeholder:text-white/35"
                          autoComplete="email"
                        />
                        <input
                          placeholder="Team Size *"
                          value={corpTeamSize}
                          onChange={(e) => setCorpTeamSize(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors placeholder:text-white/35"
                        />
                      </div>

                      <div className="relative">
                        <label
                          htmlFor="corp-event-date"
                          className={`absolute -top-3 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10 font-manrope`}
                        >
                          Event date *
                        </label>
                        <input
                          ref={corpDateRef}
                          id="corp-event-date"
                          type="date"
                          value={corpDate}
                          min={new Date().toISOString().slice(0, 10)}
                          onChange={(e) => setCorpDate(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 pr-12 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors [color-scheme:dark]"
                        />
                        <button
                          type="button"
                          aria-label="Open date picker"
                          onClick={() => {
                            corpDateRef.current?.showPicker?.();
                            corpDateRef.current?.focus();
                          }}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-[#EFCD62] rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="py-5">
                        <h4 className="text-white font-bold text-gh-body mb-3">
                          Retreat Format
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                          {[
                            "Leadership Retreat",
                            "Day Outing / Team Outing",
                            "Recognition Programme",
                            "Offsite (Overnight)",
                            "Conference / Workshop",
                            "Success Party",
                          ].map((label) => {
                            const checked = corpFormats.has(label);
                            return (
                              <label
                                key={label}
                                className="flex items-center gap-2.5 cursor-pointer min-h-[1.5rem] group"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => corpToggle(setCorpFormats, label)}
                                  className="sr-only"
                                />
                                <div
                                  className="w-5 h-5 shrink-0 flex items-center justify-center transition-all"
                                  style={{
                                    border: checked ? "2px solid #EFCD62" : "1.5px solid rgba(255,255,255,0.45)",
                                    backgroundColor: checked ? "#EFCD62" : "transparent",
                                  }}
                                >
                                  {checked && (
                                    <Check className="w-3 h-3 text-black" strokeWidth={3.5} />
                                  )}
                                </div>
                                <span className="text-gh-label text-white/70 leading-snug group-hover:text-white transition-colors">
                                  {label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="py-5 border-t border-white/5">
                        <h4 className="text-white font-bold text-gh-body mb-3">
                          Services Required
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                          {[
                            "Décor & Event Setup",
                            "AV & Presentation Setup",
                            "Emcee / Host",
                            "Photography/Videography",
                            "Catering & F&B",
                            "Team-Building Activities",
                            "DJ & Entertainment",
                            "Not Sure Yet",
                          ].map((label) => {
                            const checked = corpServices.has(label);
                            return (
                              <label
                                key={label}
                                className="flex items-center gap-2.5 cursor-pointer min-h-[1.5rem] group"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => corpToggle(setCorpServices, label)}
                                  className="sr-only"
                                />
                                <div
                                  className="w-5 h-5 shrink-0 flex items-center justify-center transition-all"
                                  style={{
                                    border: checked ? "2px solid #EFCD62" : "1.5px solid rgba(255,255,255,0.45)",
                                    backgroundColor: checked ? "#EFCD62" : "transparent",
                                  }}
                                >
                                  {checked && (
                                    <Check className="w-3 h-3 text-black" strokeWidth={3.5} />
                                  )}
                                </div>
                                <span className="text-gh-label text-white/70 leading-snug group-hover:text-white transition-colors">
                                  {label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="py-5 border-t border-white/5">
                        <h4 className="text-white font-bold text-gh-body mb-3">
                          Preferred Setting
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                          {[
                            "Outdoor Lawn Setup",
                            "Poolside / Informal Setup",
                            "Indoor Conference Setup",
                            "Indoor & Outdoor",
                          ].map((label) => {
                            const checked = corpPref.has(label);
                            return (
                              <label
                                key={label}
                                className="flex items-center gap-2.5 cursor-pointer min-h-[1.5rem] group"
                              >
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => corpToggle(setCorpPref, label)}
                                  className="sr-only"
                                />
                                <div
                                  className="w-5 h-5 shrink-0 flex items-center justify-center transition-all"
                                  style={{
                                    border: checked ? "2px solid #EFCD62" : "1.5px solid rgba(255,255,255,0.45)",
                                    backgroundColor: checked ? "#EFCD62" : "transparent",
                                  }}
                                >
                                  {checked && (
                                    <Check className="w-3 h-3 text-black" strokeWidth={3.5} />
                                  )}
                                </div>
                                <span className="text-gh-label text-white/70 leading-snug group-hover:text-white transition-colors">
                                  {label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <div className="relative py-5">
                        <textarea
                          placeholder="Additional requests"
                          rows={4}
                          value={corpNotes}
                          onChange={(e) => setCorpNotes(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 focus:border-[#EFCD62] outline-none text-white text-gh-body transition-colors placeholder:text-white/35"
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
                        className="w-full py-4 bg-[#EFCD62] text-black font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                      >
                        SUBMIT ENQUIRE
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-[180px] h-[180px] shrink-0 relative mb-6 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl">
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

                    <h2 className="text-white text-shadow-sm text-[36px] font-philosopher mb-3">
                      We've got it from here
                    </h2>

                    <p className="text-white/90 text-[16px] leading-relaxed mb-10 max-w-sm mx-auto">
                      Thanks for sharing your details!
                      <br />
                      Our team will take a look and reach out shortly to
                      understand things better.
                    </p>

                    <div className="flex flex-col w-full max-w-[300px] mx-auto">
                      <p className="text-white/60 text-[11px] font-bold tracking-[0.2em] uppercase mb-4">
                        MEANWHILE CHECK US OUT HERE
                      </p>

                      <div className="flex justify-center gap-3">
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

                      <p className="text-white/60 text-[13px] mb-8 mt-5">
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
      </VillaExperienceOverlayBody>

      <VillaExperienceBookingBottomBar
        villaId={v.id}
        onwardPrice={(overlayVilla as any)?.overlay?.onwardsPrice ?? null}
        onEnquireClick={() => scrollToSection("enquiry")}
      />
    </MotionDiv>,
    document.body,
  );
};

export default CorporateVenueOverlay;

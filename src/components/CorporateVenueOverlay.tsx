"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Share2,
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
import { ExperiencePolicyCompactList } from "@/components/experience/ExperienceFaqAccordion";
import VillaDetailAmenityGrid from "@/components/villa/VillaDetailAmenityGrid";
import VillaDetailFaqList from "@/components/villa/VillaDetailFaqList";
import VillaDetailLocationBlock from "@/components/villa/VillaDetailLocationBlock";
import {
  EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS,
  EXPERIENCE_OVERLAY_ROOT_CLASS,
} from "@/lib/experienceOverlayTheme";
import { useOverlayScrollChromeHide } from "@/lib/useOverlayScrollChromeHide";
import { useVenueOverlaySectionNav } from "@/lib/useVenueOverlaySectionNav";
import { sanitizePhoneDigitsInput } from "@/lib/phoneNumberInput";
import {
  validateEmail,
  validateFullName,
  validatePhone,
} from "@/lib/leadFormValidation";
import { getFieldShellClass } from "@/lib/jadeFormTokens";
import {
  JadeFloatingField,
  JadeFloatingTextarea,
} from "@/components/ui/form";
import JadeFormFieldError from "@/components/ui/form/JadeFormFieldError";
import {
  VillaExperienceBookingBottomBar,
  VillaExperienceHeroCarousel,
  VillaExperienceOverlayCloseFramer,
  VillaExperienceOverlayBody,
  VillaExperienceStickyTabs,
  isExperienceOverlayMdUp,
} from "@/components/experience/VillaExperienceOverlayLayout";
import VillaDetailIntroSection from "@/components/villa/VillaDetailIntroSection";
import OverlayIntroAmenityHighlights from "@/components/villa/OverlayIntroAmenityHighlights";
import clsx from "clsx";
import {
  VILLA_DETAIL_CHARCOAL,
  VILLA_DETAIL_GREEN,
  VILLA_DETAIL_SPACING,
} from "@/components/villa/villaDetailSpacing";
import { getVillaDetailIcon } from "@/lib/villaDetailIcons";

const vd = VILLA_DETAIL_SPACING;

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
  const [corpAttempted, setCorpAttempted] = useState(false);
  const [corpFieldErrors, setCorpFieldErrors] = useState<
    Record<string, string | undefined>
  >({});

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
            onwardPrice={(v as { overlay?: { onwardsPrice?: string } })?.overlay?.onwardsPrice ?? null}
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
            <div className={VILLA_DETAIL_CHARCOAL}>
              <div className={vd.sectionShell}>
                <VillaDetailIntroSection
                  eyebrow={v.type || "CORPORATE RETREAT"}
                  title={v.name}
                  mapsHref={mapsHref}
                  locationLabel={v.location?.split("·")[0] ?? v.location ?? ""}
                  statsRow={
                    <div className={VILLA_DETAIL_SPACING.introStatsRow}>
                      <div className="flex items-center gap-2.5 whitespace-nowrap flex-shrink-0">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                        <span>{getEventCapacity(v)?.toString() || v.stats?.events || "500 Guests"}</span>
                      </div>
                      <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />
                      <div className="flex items-center gap-2.5 whitespace-nowrap flex-shrink-0">
                        <Home className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                        <span>{getStayCapacity(v)?.toString() || v.stats?.stay || "20 Stay"}</span>
                      </div>
                      <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />
                      <div className="flex items-center gap-2.5 whitespace-nowrap flex-shrink-0">
                        <Calendar className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                        <span>{v.stats?.lawn || v.stats?.villaArea || "Private Lawn"}</span>
                      </div>
                    </div>
                  }
                  amenityHighlights={
                    v.amenities?.length ? (
                      <OverlayIntroAmenityHighlights
                        amenities={v.amenities}
                        getIcon={(icon) => getVillaDetailIcon(icon)}
                      />
                    ) : undefined
                  }
                >
                  <p className={VILLA_DETAIL_SPACING.introDescription}>
                    {v.description ||
                      `${v.name} by Jade is an expansive corporate retreat featuring private spaces, lush lawns, and dedicated outdoor areas. Designed for corporate offsites, team celebrations, and immersive workations, the venue balances structured productivity with open-air engagement.`}
                  </p>
                  <div className={VILLA_DETAIL_SPACING.stackSm}>
                    <h4 className="text-white font-manrope font-medium text-gh-body">
                      Perfect for:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {(v.perfectForTags?.length
                        ? v.perfectForTags
                        : [
                            "Corporate Offsites",
                            "Leadership Retreats",
                            "Team Outings",
                            "Workations",
                            "Recognition Events",
                          ]
                      ).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-4 py-2 bg-white/5 border border-white/15 text-white/90 text-[11px] md:text-gh-label font-manrope"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </VillaDetailIntroSection>
              </div>
            </div>

            <VillaExperienceStickyTabs
              tabs={tabs}
              activeTab={activeTab}
              onTabClick={(tab) => scrollToSection(tab)}
            />


            <VillaDetailAmenityGrid
              amenities={
                v.amenities || [
                  { label: "Conference Room" },
                  { label: "High-speed Wi-Fi" },
                  { label: "AV Equipment" },
                  { label: "Team Building Areas" },
                  { label: "Dining Hall" },
                ]
              }
              title="Corporate Amenities"
              showSeeMore={false}
              meanderBottom={corporatePricingBlocks.length > 0}
            />

            {corporatePricingBlocks.length > 0 ? (
              <section id="pricing" className={VILLA_DETAIL_GREEN}>
                <div className={vd.sectionShell}>
                  <div className={clsx(vd.content, vd.stack)}>
                    <VillaPricingBlocks
                      variant="villa-detail"
                      sectionTitle="Corporate Pricing"
                      blocks={corporatePricingBlocks}
                      footnote={
                        <p className={vd.pricingFootnote}>
                          Note: All corporate pricing is exclusive of GST. Custom packages for team building activities available.
                        </p>
                      }
                    />
                  </div>
                </div>
              </section>
            ) : null}

            <section id="location" className={VILLA_DETAIL_CHARCOAL}>
              <div className={vd.sectionShell}>
                <div className={clsx(vd.content, vd.stack)}>
                  <h3 className={vd.heading}>Location</h3>
                  <VillaDetailLocationBlock
                    mapsHref={mapsHref}
                    locationDetails={{
                      mapImage: v.locationDetails?.mapImage,
                      address: v.locationDetails?.address || v.location,
                      distance:
                        v.locationDetails?.distance ||
                        "Approximately 45 minutes from Bangalore City Center",
                    }}
                    fallbackMapImage={
                      primaryImage || "/Villa_Retreats/Magnolia/Spaces/Villa.webp"
                    }
                  />
                </div>
              </div>
            </section>

            <section id="walkthrough" className={VILLA_DETAIL_CHARCOAL}>
              <div className={vd.sectionShell}>
                <div className={clsx(vd.content, vd.stack)}>
                  <h3 className={vd.heading}>Video Walkthrough</h3>
                  <div className="group relative aspect-video w-full cursor-pointer overflow-hidden border border-white/10 bg-gray-900">
                    <Image
                      src={walkthroughCover || "/Villa_Retreats/Magnolia/Hero/hero.webp"}
                      alt="Video Cover"
                      fill
                      className="object-cover opacity-80 transition-opacity group-hover:opacity-60"
                      sizes="(max-width: 768px) 100vw, 800px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md transition-all hover:bg-white/30 sm:h-20 sm:w-20">
                        <div className="ml-1 h-0 w-0 border-b-[10px] border-l-[18px] border-t-[10px] border-b-transparent border-l-white border-t-transparent" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section id="faq" className={VILLA_DETAIL_CHARCOAL}>
              <div className={vd.sectionShell}>
                <div className={clsx(vd.content, vd.stack)}>
                  <h3 className={vd.heading}>FAQ</h3>
                  {(villa.faq || []).length > 0 ? (
                    <VillaDetailFaqList
                      items={(villa.faq || []).map((item: any) => ({
                        question: item.question,
                        answer: item.answer,
                      }))}
                    />
                  ) : null}
                  <div className={vd.stackSm}>
                    <h3 className={vd.heading}>Key Policies</h3>
                    <ExperiencePolicyCompactList
                      policies={[
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
                      ]}
                    />
                  </div>
                </div>
              </div>
            </section>

            <div className={VILLA_DETAIL_CHARCOAL}>
              <div className={vd.sectionShell}>
                <div className={clsx(vd.content, vd.stack)} id="enquiry" ref={formRef}>
                {view === "form" ? (
                  <>
                    <h2 className={vd.heading}>Plan Your Corporate Retreat</h2>
                    <p className="text-white/60 text-gh-body">
                      Share a few details. Our corporate team will guide you
                      through venues &amp; pricing.
                    </p>

                    <form
                      className="space-y-5"
                      noValidate
                      onSubmit={(e) => {
                        e.preventDefault();
                        setCorpAttempted(true);
                        const errs: Record<string, string | undefined> = {
                          fullName: validateFullName(corpFullName),
                          company: !corpCompany.trim()
                            ? "Please enter your company name."
                            : undefined,
                          phone: validatePhone(corpPhone),
                          email: validateEmail(corpEmail),
                          teamSize: !corpTeamSize.trim()
                            ? "Please enter an approximate team size."
                            : undefined,
                          eventDate: !corpDate
                            ? "Please choose an event date."
                            : undefined,
                        };
                        setCorpFieldErrors(errs);
                        if (Object.values(errs).some(Boolean)) return;
                        setCorpError(null);
                        setView("success");
                      }}
                    >
                      {corpError ? (
                        <p className="text-red-400 text-gh-label" role="alert">
                          {corpError}
                        </p>
                      ) : null}

                      <JadeFloatingField
                        id="corp-fullName"
                        label="Full Name"
                        value={corpFullName}
                        onChange={setCorpFullName}
                        theme="experienceCharcoal"
                        invalid={Boolean(corpFieldErrors.fullName)}
                        showError={corpAttempted && Boolean(corpFieldErrors.fullName)}
                        errorMessage={corpFieldErrors.fullName}
                      />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <JadeFloatingField
                          id="corp-company"
                          label="Company Name"
                          value={corpCompany}
                          onChange={setCorpCompany}
                          theme="experienceCharcoal"
                          invalid={Boolean(corpFieldErrors.company)}
                          showError={corpAttempted && Boolean(corpFieldErrors.company)}
                          errorMessage={corpFieldErrors.company}
                        />
                        <JadeFloatingField
                          id="corp-phone"
                          label="Phone Number"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          value={corpPhone}
                          onChange={(v) =>
                            setCorpPhone(sanitizePhoneDigitsInput(v))
                          }
                          theme="experienceCharcoal"
                          invalid={Boolean(corpFieldErrors.phone)}
                          showError={corpAttempted && Boolean(corpFieldErrors.phone)}
                          errorMessage={corpFieldErrors.phone}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <JadeFloatingField
                          id="corp-email"
                          label="Email"
                          type="email"
                          autoComplete="email"
                          value={corpEmail}
                          onChange={setCorpEmail}
                          theme="experienceCharcoal"
                          invalid={Boolean(corpFieldErrors.email)}
                          showError={corpAttempted && Boolean(corpFieldErrors.email)}
                          errorMessage={corpFieldErrors.email}
                        />
                        <JadeFloatingField
                          id="corp-teamSize"
                          label="Team Size"
                          value={corpTeamSize}
                          onChange={setCorpTeamSize}
                          theme="experienceCharcoal"
                          invalid={Boolean(corpFieldErrors.teamSize)}
                          showError={corpAttempted && Boolean(corpFieldErrors.teamSize)}
                          errorMessage={corpFieldErrors.teamSize}
                        />
                      </div>
                      <div
                        className={`relative ${getFieldShellClass({
                          invalid: Boolean(corpFieldErrors.eventDate),
                          showError:
                            corpAttempted && Boolean(corpFieldErrors.eventDate),
                          variant: "standard",
                        })}`}
                      >
                        <input
                          ref={corpDateRef}
                          id="corp-event-date"
                          type="date"
                          value={corpDate}
                          min={new Date().toISOString().slice(0, 10)}
                          onChange={(e) => setCorpDate(e.target.value)}
                          className="w-full bg-transparent px-4 py-3.5 pr-12 text-white text-gh-body focus:outline-none [color-scheme:dark] font-manrope rounded-sm"
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
                        <label
                          htmlFor="corp-event-date"
                          className="absolute -top-3 left-4 bg-jade-charcoal px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10 font-manrope pointer-events-none"
                        >
                          Event date
                          {corpAttempted && corpFieldErrors.eventDate ? (
                            <span className="ml-1 text-[#D32C55]">*</span>
                          ) : null}
                        </label>
                      </div>
                      {corpAttempted && corpFieldErrors.eventDate ? (
                        <JadeFormFieldError
                          id="corp-date-err"
                          message={corpFieldErrors.eventDate}
                        />
                      ) : null}

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

                      <JadeFloatingTextarea
                        id="corp-notes"
                        label="Additional requests"
                        required={false}
                        value={corpNotes}
                        onChange={setCorpNotes}
                        theme="experienceCharcoal"
                        className="py-5"
                      />

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

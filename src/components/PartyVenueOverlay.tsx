"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Share2,
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
import { sanitizePhoneDigitsInput } from "@/lib/phoneNumberInput";

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
import { useOverlayScrollChromeHide } from "@/lib/useOverlayScrollChromeHide";
import { useVenueOverlaySectionNav } from "@/lib/useVenueOverlaySectionNav";
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
import VillaPricingBlocks, {
  buildPartyOverlayPricingBlocks,
} from "@/components/experience/VillaPricingBlocks";
import { ExperiencePolicyCompactList } from "@/components/experience/ExperienceFaqAccordion";
import VillaDetailAmenityGrid from "@/components/villa/VillaDetailAmenityGrid";
import VillaDetailFaqList from "@/components/villa/VillaDetailFaqList";
import VillaDetailLocationBlock from "@/components/villa/VillaDetailLocationBlock";
import VillaDetailMeanderStrip from "@/components/villa/VillaDetailMeanderStrip";

const vd = VILLA_DETAIL_SPACING;

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
    setActiveTab("Amenities");
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
            onwardPrice={displayPrice}
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
          />
        }
      >
            <div className={VILLA_DETAIL_CHARCOAL}>
              <div className={vd.sectionShell}>
                <VillaDetailIntroSection
                  eyebrow={villa.type || "PARTY VILLA"}
                  title={villa.name}
                  mapsHref={mapsHref}
                  locationLabel={villa.location?.split("·")[0] ?? ""}
                  statsRow={
                    <div className={VILLA_DETAIL_SPACING.introStatsRow}>
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
                  }
                  amenityHighlights={
                    villa.amenities?.length ? (
                      <OverlayIntroAmenityHighlights
                        amenities={villa.amenities}
                        getIcon={getIcon}
                      />
                    ) : undefined
                  }
                >
                  <p className={VILLA_DETAIL_SPACING.introDescription}>{villa.description}</p>
                  <div className={VILLA_DETAIL_SPACING.stackSm}>
                    <h4 className="text-white font-manrope font-medium text-gh-body">
                      Perfect for:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {["Birthdays", "Anniversaries", "Pool Parties", "Reunions"].map((tag) => (
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

            {/* ── STICKY TABS ─────────────────────────────────────────────── */}
            <VillaExperienceStickyTabs tabs={tabs} activeTab={activeTab} onTabClick={(tab) => scrollToSection(tab)} />

            <VillaDetailAmenityGrid
              amenities={
                villa.amenities || [
                  { label: "Private Pool" },
                  { label: "Music System" },
                  { label: "BBQ Setup" },
                  { label: "Indoor Games" },
                  { label: "Kitchen Access" },
                ]
              }
              title="Villa Amenities"
              showSeeMore={false}
              meanderBottom={partyPricingBlocks.length > 0}
            />

            {partyPricingBlocks.length > 0 ? (
              <section id="pricing" className={VILLA_DETAIL_GREEN}>
                <div className={vd.sectionShell}>
                  <div className={clsx(vd.content, vd.stack)}>
                    <VillaPricingBlocks
                      variant="villa-detail"
                      sectionTitle="Party Pricing"
                      blocks={partyPricingBlocks}
                      footnote={
                        <p className={vd.pricingFootnote}>
                          Note: All party pricing is exclusive of GST. Custom packages available.
                        </p>
                      }
                    />
                  </div>
                </div>
                <VillaDetailMeanderStrip track="green" />
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
                    fallbackMapImage="/Villa_Retreats/Magnolia/Spaces/Villa.webp"
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
                      src="/Villa_Retreats/Magnolia/Hero/hero.webp"
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
                        <h2 className={vd.heading}>Plan Your Celebration</h2>
                        <p className="text-white/50 text-gh-body">
                          Share a few details. Our concierge team will help you pick
                          the perfect villa for your party.
                        </p>

                        <form
                          className="space-y-5"
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="relative">
                              <label
                                className={`absolute -top-2.5 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10`}
                              >
                                Phone *
                              </label>
                              <input
                                type="tel"
                                inputMode="numeric"
                                value={partyPhone}
                                onChange={(e) =>
                                  setPartyPhone(
                                    sanitizePhoneDigitsInput(e.target.value),
                                  )
                                }
                                className="w-full bg-transparent border border-white/20 rounded-sm px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors"
                                placeholder="91XXXXXXXXXX"
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
                            className="w-full py-4 bg-[#EFCD62] text-black font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all"
                          >
                            ENQUIRE NOW
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
        onwardPrice={displayPrice}
        onEnquireClick={() => scrollToSection("enquiry")}
      />
    </MotionDiv>,
    document.body,
  );
};

export default PartyVenueOverlay;

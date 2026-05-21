"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Share2,
  MapPin,
  Users,
  Car,
  Home,
  Play,
  Phone,
  Mail,
  User,
  Facebook,
  Instagram,
  Youtube,
  Wifi,
  Wind,
  Waves,
  Dribbble,
  Presentation,
  Trees,
  Mountain,
  PartyPopper,
  Bath,
  Sun,
  ChefHat,
  SprayCan,
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
  Info,
  Download,
} from "lucide-react";

// Icon mapping helper matching villa detail page
const getIcon = (iconName?: string, title?: string) => {
  const icons: any = {
    Wifi,
    Car,
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
    Phone,
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
import { usePathname } from "next/navigation";
import PrimaryButton from "@/components/PrimaryButton";
import { useVillaListingImages } from "@/lib/useVillaListingImages";
import { getEventCapacity, getStayCapacity } from "@/lib/villaDisplay";
import type { OverlayPageKey } from "@/lib/overlayVillaData";
import { getOverlayVillaData } from "@/lib/overlayVillaData";
import type { HeroSplitCustom } from "@/lib/heroSplitCarouselVariants";
import { getVillaGoogleMapsUrl } from "@/lib/googleMapsLinks";
import VillaPricingBlocks, {
  buildWeddingWeekendOverlayPricingBlocks,
} from "@/components/experience/VillaPricingBlocks";
import ExperienceFaqAccordion, {
  ExperiencePolicyCompactList,
} from "@/components/experience/ExperienceFaqAccordion";
import WeddingVenueEnquiryForm from "@/components/experience/WeddingVenueEnquiryForm";
import { EXPERIENCE_OVERLAY_ROOT_CLASS } from "@/lib/experienceOverlayTheme";
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
import AmenityHighlightTile from "@/components/villa/AmenityHighlightTile";
import MeanderStrip from "@/components/ui/MeanderStrip";
import { VILLA_DETAIL_SPACING } from "@/components/villa/villaDetailSpacing";

interface VenueOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  villa: any;
  context?: "wedding" | "weekend";
  overlayPage?: OverlayPageKey;
}

const VenueOverlay: React.FC<VenueOverlayProps> = ({
  isOpen,
  onClose,
  villa,
  context,
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
  const pathname = usePathname();

  const resolvedContext: VenueOverlayProps["context"] =
    context ??
    (pathname?.includes("/weekend-getaways")
      ? "weekend"
      : pathname?.includes("/weddings")
        ? "wedding"
        : undefined);

  const resolvedPage: OverlayPageKey =
    overlayPage ?? (resolvedContext === "weekend" ? "weekend" : "wedding");

  const overlayVilla = getOverlayVillaData(resolvedPage, villa?.id);
  const v = overlayVilla ?? villa;
  const mapsHref = getVillaGoogleMapsUrl(v);
  const { images: listingImages, primaryImage } = useVillaListingImages(
    v?.id ? { id: v.id, name: v.name, image: v.image } : villa,
  );

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

  const price = (overlayVilla as any)?.overlay?.onwardsPrice ?? null;

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
            onwardPrice={price}
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
            {/* ── CHARCOAL: Title / Info / Amenity Cards / Description ─── */}
            <div className="w-full bg-[#25282C]">
              <div className="px-6 py-6 md:px-12 md:py-12 max-w-7xl mx-auto">
                {/* Header info sitting directly in max-w-7xl for full-width alignment like detail page */}
                <div className="flex flex-col gap-2 mb-6">
                  <span className="text-[#EFCD62] text-[10px] md:text-gh-label font-bold tracking-[0.2em] uppercase">
                    {v.type || "VILLA"}
                  </span>
                  <h1 className="text-[28px] md:text-[32px] font-philosopher text-white mb-1 leading-tight">
                    {v.name}
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

                {/* Stats pill row */}
                <div className="flex flex-nowrap overflow-x-auto scrollbar-none gap-x-4 items-center text-white/90 mb-8 text-[10px] md:text-[12px] lg:text-[14px] font-normal font-manrope tracking-wide pb-2 -mr-6 pr-6 md:-mr-12 md:pr-12">
                  <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                    <Users className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                    <span>{getEventCapacity(v)?.toString() || v.stats?.events || (resolvedContext === "weekend" ? "15+ Guests" : "600 Guests")}</span>
                  </div>
                  <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />
                  <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                    <Home className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                    <span>{getStayCapacity(v)?.toString() || v.stats?.stay || (resolvedContext === "weekend" ? "6-12 Stay" : "20 Stay")}</span>
                  </div>
                  <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />
                  <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
                    <Car className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                    <span>{(overlayVilla as any)?.overlay?.parking ?? (resolvedContext === "weekend" ? "20+ Parking" : "80 Parking")}</span>
                  </div>
                </div>

                {/* Horizontal amenity cards (Categories UI) — perfectly matches splitting & style of detail page */}
                {v.amenities && v.amenities.length > 0 && (
                  <div
                    className={
                      VILLA_DETAIL_SPACING.amenityHighlightTrackOverlay
                    }
                  >
                    {v.amenities.map((amenity: any, idx: number) => {
                      const IconComponent = getIcon(amenity.icon, amenity.label);
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
                <p className="font-manrope text-white/70 text-gh-body leading-relaxed mb-10 whitespace-pre-line text-justify">
                  {v.description}
                </p>

                {/* Perfect For tags */}
                {v.perfectForTags && v.perfectForTags.length > 0 && (
                  <motion.div className="mb-6">
                    <h4 className="text-white font-manrope font-bold text-gh-label uppercase tracking-widest mb-3">Perfect for:</h4>
                    <div className="flex flex-wrap gap-2">
                      {v.perfectForTags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-4 py-2 bg-white/5 border border-white/10 text-white/80 text-gh-label font-manrope"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* ── STICKY TABS ─────────────────────────────────────────────── */}
            <VillaExperienceStickyTabs tabs={tabs} activeTab={activeTab} onTabClick={(tab) => scrollToSection(tab)} />

            {/* ── GREEN: Amenities ─────────────────────────────────────────── */}
            <section id="amenities" className="w-full bg-jade-charcoal text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-gh-h2 font-philosopher mb-6">Venue Amenities</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    {(v.amenities || [
                      { label: "Lawn Space" }, { label: "Private Pool" },
                      { label: "Stay Accommodation" }, { label: "Kitchen Access" }, { label: "Parking" },
                    ]).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-5 h-5 flex-shrink-0 flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rotate-45 bg-[#EFCD62]" />
                        </div>
                        <span className="text-white font-manrope font-bold text-gh-body uppercase tracking-wider">{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <MeanderStrip accentLine="green" />

            {/* ── CHARCOAL: Pricing ────────────────────────────────────────── */}
            <section id="pricing" className="w-full bg-jade-green text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                  <VillaPricingBlocks
                    variant="villa-detail"
                    blocks={buildWeddingWeekendOverlayPricingBlocks(v)}
                    footnote={<p className="text-white/40 text-gh-label leading-relaxed mt-3">Note: Prices are base rates and may vary based on season, day of week, and specific requirements. Additional charges may apply for decorations, catering, and extended hours.</p>}
                  />
                </div>
              </div>
            </section>

            <MeanderStrip track="green" />

            {/* ── GREEN: Location ───────────────────────────────────────────── */}
            <section id="location" className="w-full bg-jade-charcoal text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-gh-h2 font-philosopher mb-6">Location</h3>
                  <div className="bg-jade-charcoal overflow-hidden mb-6 border border-white/10">
                    <a href={mapsHref} target="_blank" rel="noopener noreferrer"
                      className="relative block w-full h-64 md:h-80 cursor-pointer outline-none transition-opacity hover:opacity-95"
                      aria-label="Open location in Google Maps">
                      <Image src={v.locationDetails?.mapImage || primaryImage || "/Villa_Retreats/Magnolia/Spaces/Villa.webp"} alt="Map Location" fill className="object-cover opacity-80" sizes="100vw" loading="lazy" />
                    </a>
                    <div className="p-5 md:p-6 border-t border-white/10">
                      <a href={mapsHref} target="_blank" rel="noopener noreferrer"
                        className="group flex items-start gap-3 outline-none hover:text-[#EFCD62] transition-colors">
                        <MapPin className="w-5 h-5 text-jade-gold mt-1 shrink-0" />
                        <p className="text-white text-gh-body font-manrope font-medium leading-relaxed group-hover:underline underline-offset-4">
                          {v.locationDetails?.address || "Tranquil Woods, Kanakapura Road, Bangalore - 560062"}
                        </p>
                      </a>
                      <div className="w-full bg-white/[0.03] border border-white/5 px-4 py-3 mt-5">
                        <p className="text-white/60 text-[12px] md:text-[13px] font-manrope">
                          {v.locationDetails?.distance || "Approximately 45 minutes from Bangalore City Center"}
                        </p>
                      </div>
                    </div>
                  </div>
                  {v.locationDetails?.nearby && v.locationDetails.nearby.length > 0 && (
                    <div className="mt-6">
                      <h4 className="text-jade-gold text-gh-label font-medium tracking-widest uppercase mb-5 font-manrope">Whats nearby:</h4>
                      <div className="flex flex-col gap-3">
                        {v.locationDetails.nearby.map((place: any) => (
                          <div key={place.label} className="flex justify-between items-center border-b border-white/5 pb-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-1.5 h-1.5 rotate-45 bg-jade-gold" />
                              <span className="text-white font-manrope text-gh-desc font-medium uppercase tracking-wider">{place.label}</span>
                            </div>
                            <span className="text-white/60 text-gh-desc font-manrope">{place.distance || place.dist}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* ── CHARCOAL: Video Walkthrough ──────────────────────────────── */}
            <section id="walkthrough" className="w-full bg-jade-charcoal text-white">
              <div className="px-6 md:px-12 max-w-7xl mx-auto py-8 md:py-12">
                <div className="max-w-4xl mx-auto">
                  <h3 className="text-gh-h2 font-philosopher mb-6">Video Walkthrough</h3>
                  <div className="relative aspect-video w-full overflow-hidden bg-black/40 border border-white/10 group cursor-pointer">
                    <Image src={walkthroughCover || "/Villa_Retreats/Magnolia/Hero/hero.webp"} alt="Video Cover" fill className="object-cover opacity-60 group-hover:opacity-40 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
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
                  <ExperienceFaqAccordion items={(v.faq || []).map((item: any) => ({ question: item.question, answer: item.answer }))} />
                  <div className="pt-6 mt-6 border-t border-white/5">
                    <h3 className="text-gh-h2 font-philosopher mb-5">Key Policies</h3>
                    <ExperiencePolicyCompactList policies={[
                      { title: "Cancellation Policy", desc: "Full refund if cancelled 90+ days before. 50% refund for 30-90 days. No refund within 30 days." },
                      { title: "Booking Requirements", desc: "30% advance payment required. Balance due 15 days before event. Refundable security deposit applicable." },
                      { title: "Outside Vendors", desc: "You can bring your own caterers, decorators, and photographers. Coordination required." },
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
                        <h2 className="text-gh-h1 font-philosopher mb-3">Plan Your Wedding at Jade</h2>
                        <p className="text-white/60 text-gh-body mb-10">Share a few details. Our wedding team will guide you through venues &amp; pricing.</p>
                        <WeddingVenueEnquiryForm onSuccess={() => setView("success")} onClosePrivacyNav={onClose} />
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-[180px] h-[180px] shrink-0 relative mb-6 rounded-full bg-white/[0.03] flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl">
                          <div className="w-[84px] h-[84px] shrink-0 relative drop-shadow-2xl">
                            <Image src="/assets/JAde%20Correction.png" alt="Success Check" fill sizes="96px" quality={100} className="object-contain" />
                          </div>
                        </div>
                        <h2 className="text-white text-[36px] font-philosopher mb-3">We've got it from here</h2>
                        <p className="text-white/90 text-[16px] leading-relaxed mb-10 max-w-sm mx-auto">Thanks for sharing your details!<br />Our team will take a look and reach out shortly.</p>
                        <PrimaryButton withArrow={false} className="max-w-[300px] w-full" onClick={() => setView("form")}>SUBMIT ANOTHER</PrimaryButton>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
      </VillaExperienceOverlayBody>

      <VillaExperienceBookingBottomBar
        villaId={v.id}
        onwardPrice={price}
        onEnquireClick={() => scrollToSection("enquiry")}
      />
    </MotionDiv>,
    document.body,
  );
};

export default VenueOverlay;

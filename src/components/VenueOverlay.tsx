"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Share2,
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
import { ExperiencePolicyCompactList } from "@/components/experience/ExperienceFaqAccordion";
import VillaDetailAmenityGrid from "@/components/villa/VillaDetailAmenityGrid";
import VillaDetailFaqList from "@/components/villa/VillaDetailFaqList";
import VillaDetailLocationBlock from "@/components/villa/VillaDetailLocationBlock";
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
import VillaDetailIntroSection from "@/components/villa/VillaDetailIntroSection";
import OverlayIntroAmenityHighlights from "@/components/villa/OverlayIntroAmenityHighlights";
import clsx from "clsx";
import {
  VILLA_DETAIL_CHARCOAL,
  VILLA_DETAIL_GREEN,
  VILLA_DETAIL_SPACING,
} from "@/components/villa/villaDetailSpacing";

const vd = VILLA_DETAIL_SPACING;

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
            <div className={VILLA_DETAIL_CHARCOAL}>
              <div className={vd.sectionShell}>
                <VillaDetailIntroSection
                  eyebrow={v.type || "VILLA"}
                  title={v.name}
                  mapsHref={mapsHref}
                  locationLabel={v.location?.split("·")[0] ?? ""}
                  statsRow={
                    <div className={VILLA_DETAIL_SPACING.introStatsRow}>
                      <div className="flex items-center gap-2.5 whitespace-nowrap flex-shrink-0">
                        <Users className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                        <span>{getEventCapacity(v)?.toString() || v.stats?.events || (resolvedContext === "weekend" ? "15+ Guests" : "600 Guests")}</span>
                      </div>
                      <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />
                      <div className="flex items-center gap-2.5 whitespace-nowrap flex-shrink-0">
                        <Home className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                        <span>{getStayCapacity(v)?.toString() || v.stats?.stay || (resolvedContext === "weekend" ? "6-12 Stay" : "20 Stay")}</span>
                      </div>
                      <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />
                      <div className="flex items-center gap-2.5 whitespace-nowrap flex-shrink-0">
                        <Car className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]" strokeWidth={1.5} />
                        <span>{(overlayVilla as any)?.overlay?.parking ?? (resolvedContext === "weekend" ? "20+ Parking" : "80 Parking")}</span>
                      </div>
                    </div>
                  }
                  amenityHighlights={
                    v.amenities?.length ? (
                      <OverlayIntroAmenityHighlights
                        amenities={v.amenities}
                        getIcon={getIcon}
                      />
                    ) : undefined
                  }
                >
                  <p className={VILLA_DETAIL_SPACING.introDescription}>{v.description}</p>
                  {v.perfectForTags && v.perfectForTags.length > 0 ? (
                    <div className={VILLA_DETAIL_SPACING.stackSm}>
                      <h4 className="text-white font-manrope font-medium text-gh-body">
                        Perfect for:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {v.perfectForTags.map((tag: string) => (
                          <span
                            key={tag}
                            className="px-4 py-2 bg-white/5 border border-white/15 text-white/90 text-[11px] md:text-gh-label font-manrope"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </VillaDetailIntroSection>
              </div>
            </div>

            {/* ── STICKY TABS ─────────────────────────────────────────────── */}
            <VillaExperienceStickyTabs tabs={tabs} activeTab={activeTab} onTabClick={(tab) => scrollToSection(tab)} />

            <VillaDetailAmenityGrid
              amenities={
                v.amenities || [
                  { label: "Lawn Space" },
                  { label: "Private Pool" },
                  { label: "Stay Accommodation" },
                  { label: "Kitchen Access" },
                  { label: "Parking" },
                ]
              }
              title="Venue Amenities"
              showSeeMore={false}
            />

            <section id="pricing" className={VILLA_DETAIL_GREEN}>
              <div className={vd.sectionShell}>
                <div className={clsx(vd.content, vd.stack)}>
                  <VillaPricingBlocks
                    variant="villa-detail"
                    sectionTitle="Pricing"
                    blocks={buildWeddingWeekendOverlayPricingBlocks(v)}
                    footnote={
                      <p className={vd.pricingFootnote}>
                        Note: Prices are base rates and may vary based on season, day of week, and specific requirements. Additional charges may apply for decorations, catering, and extended hours.
                      </p>
                    }
                  />
                </div>
              </div>
            </section>

            <section id="location" className={VILLA_DETAIL_CHARCOAL}>
              <div className={vd.sectionShell}>
                <div className={clsx(vd.content, vd.stack)}>
                  <h3 className={vd.heading}>Location</h3>
                  <VillaDetailLocationBlock
                    mapsHref={mapsHref}
                    locationDetails={{
                      mapImage: v.locationDetails?.mapImage,
                      address:
                        v.locationDetails?.address ||
                        "Tranquil Woods, Kanakapura Road, Bangalore - 560062",
                      distance:
                        v.locationDetails?.distance ||
                        "Approximately 45 minutes from Bangalore City Center",
                      nearby: v.locationDetails?.nearby,
                    }}
                    fallbackMapImage={primaryImage || "/Villa_Retreats/Magnolia/Spaces/Villa.webp"}
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
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 bg-white/10 shadow-2xl backdrop-blur-md transition-all hover:bg-white/30 md:h-20 md:w-20">
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
                  {(v.faq || []).length > 0 ? (
                    <VillaDetailFaqList
                      items={(v.faq || []).map((item: any) => ({
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
                        <h2 className={vd.heading}>Plan Your Wedding at Jade</h2>
                        <p className="text-white/60 text-gh-body">
                          Share a few details. Our wedding team will guide you through venues &amp; pricing.
                        </p>
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

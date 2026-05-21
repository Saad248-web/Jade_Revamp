"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import JadeImage from "@/components/ui/JadeImage";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSectionScrollSpy } from "@/lib/useSectionScrollSpy";
import { VILLA_DETAIL_SECTION_IDS } from "@/lib/villaDetailSectionNav";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Bed,
  Users,
  Home,
  Trees,
  Projector,
  Maximize,
  Wifi,
  Car,
  Wind,
  Waves,
  Dribbble,
  Presentation,
  Download,
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
  Calendar,
  Info,
  HelpCircle,
  Facebook,
  Instagram,
  Youtube,
  LayoutGrid,
  Leaf,
  HandPlatter,
  Bell,
  Sparkles,
  ShieldCheck,
  Heart,
  Search,
  Settings,
  Coffee,
  Mic,
  Music,
  MessageCircle,
} from "lucide-react"; // Import all potentially used icons
import Footer from "@/components/Footer";
import DetailsDrawer from "@/components/DetailsDrawer";
import { VILLAS } from "@/lib/mockData";
import type { Villa } from "@/lib/types";
import { prettyMediaLabel } from "@/lib/mediaLabels";
import { buildSpaceLabelMap, labelForSpaceImage } from "@/lib/spaceLabelMap";
import { getVillaSocialProof } from "@/lib/villaSocialProof";
import { DOME_VIDEO_URLS, getYouTubeId } from "@/lib/videoUtils";
import {
  DOME_COLOR_META,
  DOME_COLOR_ORDER,
  getDomeColorFromVillaId,
  isDomeEstateId,
} from "@/lib/domeVillaIds";
import { useAnimation } from "@/context/AnimationContext";
import { MEDIA_MANIFEST } from "@/generated/mediaManifest";
import { getHeroOverrideForId } from "@/lib/heroOverrides";
import { getVillaGoogleMapsUrl } from "@/lib/googleMapsLinks";
import VillaPricingBlocks, {
  buildDetailPagePricingBlocks,
} from "@/components/experience/VillaPricingBlocks";
import VillaDetailAmenityGrid from "@/components/villa/VillaDetailAmenityGrid";
import VillaDetailAmenityHighlights from "@/components/villa/VillaDetailAmenityHighlights";
import VillaDetailFaqList from "@/components/villa/VillaDetailFaqList";
import VillaDetailMeanderStrip from "@/components/villa/VillaDetailMeanderStrip";
import VillaDetailPerfectForGallery from "@/components/villa/VillaDetailPerfectForGallery";
import VillaDetailPerfectForTags from "@/components/villa/VillaDetailPerfectForTags";
import VillaDetailExperienceCarousel from "@/components/villa/VillaDetailExperienceCarousel";
import VillaDetailPropertyDetailsList from "@/components/villa/VillaDetailPropertyDetailsList";
import VillaDetailServiceList from "@/components/villa/VillaDetailServiceList";
import VillaDetailStickyTabs from "@/components/villa/VillaDetailStickyTabs";
import { getVillaDetailIcon } from "@/lib/villaDetailIcons";
import {
  VILLA_DETAIL_CHARCOAL,
  VILLA_DETAIL_SPACING,
} from "@/components/villa/villaDetailSpacing";
import clsx from "clsx";
import {
  useCarouselAutoAdvance,
  usePreloadNeighborImages,
} from "@/lib/carouselMotion";
import CarouselSwipeLayer from "@/components/ui/CarouselSwipeLayer";
import VillaDetailImageFrame from "@/components/villa/VillaDetailImageFrame";

const vd = VILLA_DETAIL_SPACING;

const getManifestEntry = (villa: { name?: string; image?: string }) => {
  const byName = villa.name ? (MEDIA_MANIFEST as any).villasByFolder?.[villa.name] : null;
  if (byName) return byName;
  const m = (villa.image || "").match(/^\/Villa_Retreats\/([^/]+)\//);
  if (!m?.[1]) return null;
  try {
    return (MEDIA_MANIFEST as any).villasByFolder?.[decodeURIComponent(m[1])] ?? null;
  } catch {
    return (MEDIA_MANIFEST as any).villasByFolder?.[m[1]] ?? null;
  }
};

export default function VillaDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const villa = VILLAS.find((v) => v.id === id) as Villa | undefined;
  const { setEnquireOverlayOpen } = useAnimation();

  const [media, setMedia] = useState<{
    hero: string[];
    spaces: string[];
    experiences: string[];
    categorizedSpaces: any[];
  } | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState({
    title: "",
    items: [] as any[],
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSpaceIndex, setCurrentSpaceIndex] = useState(0);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("spaces");
  const [activeDomeVideo, setActiveDomeVideo] = useState<
    "red" | "blue" | "yellow"
  >("blue");
  const [activeDomeSpaceTab, setActiveDomeSpaceTab] = useState<
    "blue" | "red" | "yellow"
  >("blue");
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const mapsHref = useMemo(
    () => getVillaGoogleMapsUrl(villa ?? {}),
    [villa],
  );

  const detailPricingBlocks = useMemo(
    () =>
      villa?.pricing
        ? buildDetailPagePricingBlocks(villa.pricing as any)
        : [],
    [villa?.pricing],
  );

  const villaFooterPriceDisplay = useMemo(() => {
    const p = villa?.pricing as Record<string, unknown> | undefined;
    const stayPkg = (p?.stay as { packages?: { price?: string }[] })?.packages?.[0]
      ?.price;
    const eventPkg = (p?.event as { packages?: { price?: string }[] })?.packages?.[0]
      ?.price;
    const raw = stayPkg || eventPkg;
    if (!raw) return null;
    return String(raw).replace(/\s*\+\s*taxes\s*/i, "").trim();
  }, [villa?.pricing]);

  const scrollFrameRef = useRef<number>();
  const isAutoScrolling = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/villas/${id}/media?v=2`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setMedia(data);
      } catch {
        // ignore
      }
    }
    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (!villa) {
    return (
      <div className="min-h-screen bg-[#0B2C23] flex items-center justify-center text-white font-philosopher text-2xl">
        Villa Not Found
      </div>
    );
  }

  const socialProofLine = getVillaSocialProof(villa);

  const manifestHero = getManifestEntry(villa)?.hero || [];
  const overrideHero = getHeroOverrideForId(villa.id);
  const heroImages = overrideHero
    ? overrideHero
    : media?.hero?.length
      ? media.hero
      : manifestHero?.length
        ? manifestHero
        : [];
  const spaceImages = media?.spaces?.length ? media.spaces : [];
  const experienceImages = media?.experiences?.length ? media.experiences : [];

  const domeColor = getDomeColorFromVillaId(villa.id);
  const isDomeEstate = isDomeEstateId(villa.id);

  // Per-color pages: filter spaces to one dome. Estate page: optional tab filter.
  const domeSpaceFilter = useMemo(() => {
    if (domeColor) return DOME_COLOR_META[domeColor].pathNeedle;
    if (!isDomeEstate) return null;
    const label =
      activeDomeSpaceTab === "blue"
        ? "Blue"
        : activeDomeSpaceTab === "red"
          ? "Red"
          : "Yellow";
    return `/Villa_Retreats/Dome/Dome Villa_s - ${label}/`;
  }, [domeColor, isDomeEstate, activeDomeSpaceTab]);

  const spaceLabelMap = useMemo(
    () =>
      buildSpaceLabelMap(
        villa,
        media?.categorizedSpaces as Villa["categorizedSpaces"],
      ),
    [villa, media?.categorizedSpaces],
  );

  const derivedSpaces = useMemo(() => {
    let list = spaceImages.length
      ? spaceImages
      : (villa.spaces || []).map((s) => s.image);
    if (domeSpaceFilter) {
      list = list.filter((img) => img && img.includes(domeSpaceFilter));
    }
    return list.map((img) => ({
      name: labelForSpaceImage(img, spaceLabelMap, "Space"),
      image: img,
    }));
  }, [spaceImages, villa.spaces, domeSpaceFilter, spaceLabelMap]);

  useEffect(() => {
    setCurrentSpaceIndex(0);
  }, [activeDomeSpaceTab]);

  const derivedActivities = useMemo(() => {
    const activities = villa.activities ?? [];
    const activityByImage = new Map(
      activities.filter((a) => a.image).map((a) => [a.image, a]),
    );

    if (experienceImages.length > 0) {
      return experienceImages.map((img) => {
        const match = activityByImage.get(img);
        return {
          title:
            match?.title ??
            prettyMediaLabel({
              url: img,
              fallback: "Experience",
              kind: "experience",
            }),
          description: match?.description,
          image: img,
        };
      });
    }

    return activities
      .filter((a) => a.image)
      .map((a) => ({
        title: a.title,
        description: a.description,
        image: a.image,
      }));
  }, [experienceImages, villa.activities]);

  // Filter out empty strings — "" is truthy in JS so we must check length
  const validImg = (s: string | undefined) => s && s.length > 0;
  const imagesList = (() => {
    const gallery = heroImages.filter(
      (img: string | undefined): img is string => validImg(img) === true,
    );
    if (gallery.length > 0) return gallery; // hero only, as requested
    if (validImg(villa.image)) return [villa.image];
    return [];
  })();

  const activeHeroSrc =
    imagesList.length > 0 && imagesList[currentImageIndex]
      ? imagesList[currentImageIndex]
      : "";

  usePreloadNeighborImages(imagesList, currentImageIndex);

  const spaceImageUrls = useMemo(
    () =>
      derivedSpaces
        .map((s) => s.image)
        .filter((img): img is string => validImg(img) === true),
    [derivedSpaces],
  );
  usePreloadNeighborImages(spaceImageUrls, currentSpaceIndex);

  const activityImageUrls = useMemo(
    () =>
      derivedActivities
        .map((a) => a.image)
        .filter((img): img is string => validImg(img) === true),
    [derivedActivities],
  );
  usePreloadNeighborImages(activityImageUrls, currentActivityIndex);

  const spaceSlideCount = derivedSpaces.length;
  const activitySlideCount = derivedActivities.length;

  const handleNextSpaceRef = useRef(() => {});
  const handleNextActivityRef = useRef(() => {});

  const { pause: pauseSpaceAuto, resume: resumeSpaceAuto } =
    useCarouselAutoAdvance({
      onNext: () => handleNextSpaceRef.current(),
      enabled: spaceSlideCount > 1,
    });

  const { pause: pauseActivityAuto, resume: resumeActivityAuto } =
    useCarouselAutoAdvance({
      onNext: () => handleNextActivityRef.current(),
      enabled: activitySlideCount > 1,
    });

  const handlePrevImage = () => {
    if (imagesList.length <= 1) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagesList.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    if (imagesList.length <= 1) return;
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const advanceSpace = () => {
    if (derivedSpaces.length > 0) {
      setCurrentSpaceIndex((prev) => (prev + 1) % derivedSpaces.length);
    }
  };

  const advanceActivity = () => {
    if (derivedActivities.length > 0) {
      setCurrentActivityIndex((prev) => (prev + 1) % derivedActivities.length);
    }
  };

  const handlePrevSpace = () => {
    pauseSpaceAuto();
    if (derivedSpaces.length > 0) {
      setCurrentSpaceIndex((prev) =>
        prev === 0 ? derivedSpaces.length - 1 : prev - 1,
      );
    }
  };

  const handleNextSpace = () => {
    pauseSpaceAuto();
    advanceSpace();
  };

  const handlePrevActivity = () => {
    pauseActivityAuto();
    if (derivedActivities.length > 0) {
      setCurrentActivityIndex((prev) =>
        prev === 0 ? derivedActivities.length - 1 : prev - 1,
      );
    }
  };

  const handleNextActivity = () => {
    pauseActivityAuto();
    advanceActivity();
  };

  handleNextSpaceRef.current = advanceSpace;
  handleNextActivityRef.current = advanceActivity;

  const currentSpace =
    derivedSpaces && derivedSpaces.length > 0
      ? derivedSpaces[currentSpaceIndex % derivedSpaces.length]
      : null;

  const currentActivity =
    derivedActivities && derivedActivities.length > 0
      ? derivedActivities[currentActivityIndex % derivedActivities.length]
      : null;

  const openDrawer = (title: string, items: any[]) => {
    setDrawerData({ title, items });
    setIsDrawerOpen(true);
  };

  const scrollToSection = useCallback((id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (!element) return;

    const offset = 88;
    const top =
      element.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  }, []);

  useSectionScrollSpy({
    sectionIds: VILLA_DETAIL_SECTION_IDS,
    onActiveSection: setActiveTab,
    rootMargin: "-12% 0px -55% 0px",
  });

  useEffect(() => {
    // Only start auto-scroll if the URL parameter is present
    const shouldAutoScroll = searchParams?.get("autoScroll") === "true";

    if (shouldAutoScroll) {
      isAutoScrolling.current = true;
      let lastTime = performance.now();
      const scrollSpeed = 0.5; // pixels per millisecond (adjust for speed)

      const autoScroll = (currentTime: number) => {
        if (!isAutoScrolling.current) return;

        const deltaTime = currentTime - lastTime;
        lastTime = currentTime;

        // Scroll down slightly
        window.scrollBy({ top: scrollSpeed, left: 0, behavior: "auto" });

        // Continue the animation frame
        scrollFrameRef.current = requestAnimationFrame(autoScroll);
      };

      // Start the animation immediately (optionally add a small delay if needed)
      setTimeout(() => {
        lastTime = performance.now();
        scrollFrameRef.current = requestAnimationFrame(autoScroll);
      }, 500); // 500ms delay to let the page load visually first
    }

    // Stop scrolling on any user interaction
    const stopScroll = () => {
      if (isAutoScrolling.current) {
        isAutoScrolling.current = false;
        if (scrollFrameRef.current) {
          cancelAnimationFrame(scrollFrameRef.current);
        }
      }
    };

    // Attach interaction listeners
    window.addEventListener("wheel", stopScroll);
    window.addEventListener("touchstart", stopScroll);
    window.addEventListener("mousedown", stopScroll);
    window.addEventListener("keydown", stopScroll);

    return () => {
      stopScroll();
      window.removeEventListener("wheel", stopScroll);
      window.removeEventListener("touchstart", stopScroll);
      window.removeEventListener("mousedown", stopScroll);
      window.removeEventListener("keydown", stopScroll);
    };
  }, [searchParams]);

  const domeVideoUrls = DOME_VIDEO_URLS;

  return (
    <main className="bg-jade-charcoal min-h-screen relative">
      <div
        className={clsx(
          "absolute top-4 sm:top-6 lg:top-8 z-[60] flex justify-between items-center pointer-events-none left-0 right-0",
          vd.gutterX,
        )}
      >
        <button
          type="button"
          onClick={() => window.history.back()}
          className="pointer-events-auto w-11 h-11 md:w-12 md:h-12 flex items-center justify-center border border-white/15 bg-transparent text-white backdrop-blur-2xl transition-all hover:border-white/35"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" strokeWidth={1.5} />
        </button>
        <div className="pointer-events-auto flex items-center gap-2 md:gap-2.5">
          {/* Mobile: Dialer */}
          <a
            href="tel:08970663366"
            className="md:hidden w-11 h-11 flex items-center justify-center border border-white/15 bg-transparent text-white backdrop-blur-2xl transition-all hover:border-white/35"
            aria-label="Call to enquire"
          >
            <Phone className="w-5 h-5" strokeWidth={1.5} />
          </a>
          {/* Desktop: Contact Page */}
          <Link
            href="/contact"
            className="hidden md:flex w-12 h-12 items-center justify-center border border-white/15 bg-transparent text-white backdrop-blur-2xl transition-all hover:border-white/35"
            aria-label="Enquire with us"
          >
            <MessageCircle className="w-5 h-5" strokeWidth={1.5} />
          </Link>
          <button
            type="button"
            onClick={() => setEnquireOverlayOpen(true)}
            className="inline-flex h-11 items-center justify-center whitespace-nowrap border border-white/15 bg-transparent px-3 text-[9px] font-bold uppercase tracking-[0.35em] text-white backdrop-blur-2xl transition-all hover:border-white/35 md:h-12 md:px-5 md:text-[10px]"
          >
            ENQUIRE NOW
          </button>
        </div>
      </div>
      {/* HERO / CAROUSEL SECTION */}
      <section className="relative h-[60vh] md:h-[80vh] w-full bg-jade-green">
        {/* Image (Interactive Carousel) */}
        <div className="absolute inset-0">
          {activeHeroSrc && (
            <JadeImage
              src={activeHeroSrc}
              alt={villa.name}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />
          <CarouselSwipeLayer
            onPrev={handlePrevImage}
            onNext={handleNextImage}
            slideCount={imagesList.length}
            className="absolute inset-0 z-[15] touch-pan-y"
          />
        </div>

        {/* Carousel Controls */}
        {/* Hero Overlays */}
        <div className="absolute inset-0 z-20 pointer-events-none flex justify-center">
          <div className="max-w-7xl mx-auto h-full relative w-full">
            {/* Bottom Controls */}
            <div
              className={clsx(
                "absolute inset-x-0 pointer-events-none",
                vd.heroBottom,
              )}
            >
              <button
                type="button"
                onClick={handlePrevImage}
                className={clsx(
                  "pointer-events-auto absolute bottom-0 z-10 w-11 h-11 md:w-16 md:h-16 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all rounded-none",
                  vd.heroArrowLeft,
                )}
                aria-label="Previous photo"
              >
                <ArrowLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>

              <div className="pointer-events-auto absolute left-1/2 bottom-0 z-10 flex w-[min(100%,calc(100vw-8.5rem))] sm:w-[min(100%,calc(100vw-10rem))] -translate-x-1/2 flex-col items-center gap-2.5 md:gap-3 md:max-w-md px-4 sm:px-6">
                <div className="flex w-full flex-col items-center gap-2">
                  <div className="w-16 md:w-28 h-px bg-gradient-to-r from-transparent via-[#EFCD62] to-transparent opacity-90" />
                  <h2 className="text-[#EFCD62] font-philosopher text-xl sm:text-2xl md:text-4xl uppercase tracking-[0.28em] md:tracking-[0.35em] text-center drop-shadow-lg leading-tight px-1">
                    {villa.name}
                  </h2>
                  {socialProofLine && (
                    <p className="font-manrope text-[11px] sm:text-xs text-white/75 tracking-wide text-center">
                      {socialProofLine}
                    </p>
                  )}
                  <div className="w-16 md:w-28 h-px bg-gradient-to-r from-transparent via-[#EFCD62] to-transparent opacity-90" />
                </div>
                <Link
                  href={`/villas/${id}/spaces`}
                  className="inline-flex w-auto max-w-full shrink-0 items-center justify-center gap-1.5 border border-white/30 bg-black/40 backdrop-blur-md px-3 py-2.5 md:px-4 md:py-3 text-white text-[9px] md:text-[11px] font-bold tracking-[0.18em] md:tracking-[0.25em] uppercase whitespace-nowrap hover:bg-white hover:text-black transition-all"
                >
                  <LayoutGrid className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" strokeWidth={1.5} />
                  VIEW ALL PICTURES
                </Link>
              </div>

              <button
                type="button"
                onClick={handleNextImage}
                className={clsx(
                  "pointer-events-auto absolute bottom-0 z-10 w-11 h-11 md:w-16 md:h-16 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all rounded-none",
                  vd.heroArrowRight,
                )}
                aria-label="Next photo"
              >
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* CONTENT SECTION */}
      <div className="relative bg-jade-charcoal w-full z-10">
        <div className={vd.sectionShell}>
        <div className={clsx(vd.content, vd.stack)}>
        {/* HEADER INFO */}
        <div className={vd.stackTight}>
          {domeColor ? (
            <Link
              href="/villas/dome-villas"
              className="text-[#EFCD62]/90 text-[10px] md:text-gh-label font-bold tracking-[0.2em] uppercase hover:text-[#EFCD62] inline-flex items-center gap-1.5 w-fit"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Dome Villas Estate
            </Link>
          ) : null}
          <span className="text-[#EFCD62] text-[10px] md:text-gh-label font-bold tracking-[0.2em] uppercase">
            {villa.type}
          </span>
          <h1 className="text-[28px] md:text-[32px] font-philosopher text-white leading-tight">
            {villa.name}
          </h1>
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 text-white/90 w-fit max-w-full rounded-sm outline-none hover:text-[#EFCD62] transition-colors focus-visible:ring-2 focus-visible:ring-[#EFCD62]/60"
            aria-label={`Open ${villa.name} location in Google Maps`}
          >
            <MapPin className="w-5 h-5 text-white/70 shrink-0" />
            <span className="font-manrope text-[15px] md:text-[18px] underline-offset-4 group-hover:underline">
              {villa.location}
            </span>
          </a>
        </div>

        {/* AMENITY SUMMARY LINE */}
        <div className={clsx("flex flex-nowrap overflow-x-auto scrollbar-none gap-x-4 items-center text-white/90 text-[10px] md:text-[12px] lg:text-[14px] font-normal font-manrope tracking-wide pb-2")}>
          <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
            <Bed
              className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]"
              strokeWidth={1.5}
            />
            <span>
              {villa.stats.stay.toLowerCase().includes("stay")
                ? villa.stats.stay
                : `${villa.stats.stay} Stay`}
            </span>
          </div>

          <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />

          <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
            <Users
              className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]"
              strokeWidth={1.5}
            />
            <span>
              {villa.stats.events.toLowerCase().includes("event")
                ? villa.stats.events
                : `${villa.stats.events} Event`}
            </span>
          </div>

          <div className="w-[4px] h-[4px] rounded-full bg-white/30 flex-shrink-0" />

          <div className="flex items-center gap-2 whitespace-nowrap flex-shrink-0">
            <Home
              className="w-4 h-4 md:w-5 md:h-5 text-[#EFCD62]"
              strokeWidth={1.5}
            />
            <span>{villa.stats.bhk}</span>
          </div>
        </div>

        <VillaDetailAmenityHighlights highlights={villa.amenityHighlights ?? []} />

        <p className="font-manrope text-white/70 text-gh-body leading-relaxed whitespace-pre-line text-justify">
          {villa.description}
        </p>

        <VillaDetailPerfectForTags tags={villa.perfectForTags ?? []} />

        {isDomeEstate ? (
          <div className={vd.stackSm}>
            <span className={clsx(vd.eyebrow, "block")}>
              Explore Each Dome
            </span>
            <div className={clsx(vd.hScrollBleed, vd.hScrollTrack)}>
              {[
                {
                  name: "Blue Dome",
                  image: "/Villa_Retreats/Dome/Dome Villa_s - Blue/Spaces/Glamping_Experince.webp",
                  brochure: "/All Properties - Jade Hospitainment.pdf",
                },
                {
                  name: "Red Dome",
                  image: "/Villa_Retreats/Dome/Dome Villa_s - Red/Spaces/Bath_Tub.webp",
                  brochure: "/All Properties - Jade Hospitainment.pdf",
                },
                {
                  name: "Yellow Dome",
                  image: "/Villa_Retreats/Dome/Dome Villa_s - Yellow/Spaces/Greek_Style_Bath.webp",
                  brochure: "/All Properties - Jade Hospitainment.pdf",
                },
              ].map((dome, idx) => (
                <Link
                  key={idx}
                  href={`/villas/${DOME_COLOR_META[DOME_COLOR_ORDER[idx]].id}`}
                  className="relative flex-shrink-0 w-[240px] h-[240px] md:w-[280px] md:h-[280px] snap-start group overflow-hidden rounded-sm border border-white/10"
                >
                  {/* Background Image with Hover Zoom */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out scale-100 group-hover:scale-110"
                    style={{ backgroundImage: `url('${dome.image}')` }}
                  />
                  {/* Dark Elegant Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/25 group-hover:via-black/50 group-hover:from-black/90 transition-all duration-300" />
                  
                  {/* Content Centered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-10">
                    <h3 className="font-philosopher text-[24px] md:text-[28px] text-white leading-tight mb-2 select-none">
                      {dome.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-white/95 text-[10px] font-bold tracking-[0.2em] font-manrope uppercase mt-1 group-hover:text-[#EFCD62] transition-colors duration-300">
                      <span>View Villa</span>
                      <ArrowRight className="w-3.5 h-3.5 text-white/60 group-hover:text-[#EFCD62] transition-colors duration-300" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <a
              href="/All Properties - Jade Hospitainment.pdf"
              download
              className="w-full bg-white/5 border border-white/10 text-white px-8 py-4 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-white hover:text-black transition-all flex items-center justify-between group rounded-sm"
            >
              <span>Download Estate Brochure</span>
              <Download className="w-4 h-4 text-white/40 group-hover:text-black transition-colors" />
            </a>
          </div>
        ) : (
          <a
            href="/All Properties - Jade Hospitainment.pdf"
            download
            className="w-full bg-white/5 border border-white/10 text-white px-8 py-4 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-white hover:text-black transition-all flex items-center justify-between group rounded-sm"
          >
            <span>Download Brochure</span>
            <Download className="w-4 h-4 text-white/40 group-hover:text-black transition-colors" />
          </a>
        )}
        </div>
        </div>
      </div>
      <VillaDetailMeanderStrip />
      <VillaDetailStickyTabs activeTab={activeTab} onTabClick={scrollToSection} />

      {/* SPACES — Green */}
      {(domeColor || isDomeEstate || currentSpace) && (
        <section id="spaces" className={VILLA_DETAIL_CHARCOAL}>
          <div className={vd.sectionShell}>
            <div className={clsx(vd.content, vd.stack)}>
              <div className="flex flex-wrap justify-between items-center gap-3">
                <div className="flex flex-wrap items-center gap-2.5 md:gap-4">
                  <h3 className={vd.heading}>Spaces</h3>
                  {isDomeEstate && (
                    <div className="flex flex-wrap items-center gap-2">
                      {([ { id: "blue", label: "Blue Dome", dot: "#3b82f6" }, { id: "red", label: "Red Dome", dot: "#ef4444" }, { id: "yellow", label: "Yellow Dome", dot: "#eab308" } ] as const).map((t) => {
                        const isActive = activeDomeSpaceTab === t.id;
                        return (
                          <button key={t.id} onClick={() => setActiveDomeSpaceTab(t.id)}
                            className={`flex items-center gap-2 px-3 md:px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-bold border transition-colors ${isActive ? "bg-[#EFCD62] text-black border-[#EFCD62]" : "bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10"}`}>
                            <span className="inline-block w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: t.dot }} />
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
                {derivedSpaces && derivedSpaces.length > 1 && (
                  <div className="flex gap-2">
                    <button onClick={handlePrevSpace} disabled={derivedSpaces.length <= 1} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"><ArrowLeft className="w-4 h-4" /></button>
                    <button onClick={handleNextSpace} disabled={derivedSpaces.length <= 1} className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"><ArrowRight className="w-4 h-4" /></button>
                  </div>
                )}
              </div>
              {currentSpace ? (
                <VillaDetailImageFrame
                  imageKey={`${currentSpaceIndex}-${validImg(currentSpace.image) ? currentSpace.image : villa.image}`}
                  src={
                    validImg(currentSpace.image) ? currentSpace.image : villa.image
                  }
                  alt={currentSpace.name || "Space"}
                  onPrev={handlePrevSpace}
                  onNext={handleNextSpace}
                  slideCount={spaceSlideCount}
                  onPauseAuto={pauseSpaceAuto}
                  onResumeAuto={resumeSpaceAuto}
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-jade-charcoal/80 via-transparent to-transparent opacity-90 z-[5] pointer-events-none" />
                  <div className="absolute bottom-8 left-0 w-full text-center flex flex-col items-center z-20 pointer-events-none">
                    <h4 className="text-white text-sm md:text-base uppercase tracking-[0.2em] font-bold mb-3 font-manrope">
                      {currentSpace.name || "Lawn"}
                    </h4>
                    {spaceSlideCount > 1 && (
                      <div className="flex items-center justify-center gap-2.5 text-white text-gh-label font-bold tracking-widest">
                        <span>{currentSpaceIndex + 1}</span>
                        <div className="w-12 h-[1px] bg-white/60" />
                        <span className="text-white/60">{spaceSlideCount}</span>
                      </div>
                    )}
                  </div>
                </VillaDetailImageFrame>
              ) : (
                <div className="relative aspect-[4/3] md:aspect-[16/9] w-full rounded-none overflow-hidden bg-emerald-900/20 flex items-center justify-center text-white/40 italic">Loading spaces…</div>
              )}
              <Link href={`/villas/${id}/spaces`} className="w-full border border-white/20 bg-white/5 py-4 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                VIEW ALL SPACES
                <LayoutGrid className="w-3.5 h-3.5" strokeWidth={1.5} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {currentActivity ? (
        <VillaDetailExperienceCarousel
          activity={currentActivity}
          slideCount={activitySlideCount}
          activityIndex={currentActivityIndex}
          fallbackImage={villa.image}
          onPrev={handlePrevActivity}
          onNext={handleNextActivity}
          onPauseAuto={pauseActivityAuto}
          onResumeAuto={resumeActivityAuto}
          onEnquire={() => setEnquireOverlayOpen(true)}
          isValidImage={(url) => Boolean(validImg(url))}
        />
      ) : null}

      <VillaDetailPropertyDetailsList
        items={villa.propertyDetails ?? []}
        onSeeMore={() => openDrawer("Property Details", villa.propertyDetails || [])}
      />

      {/* VIDEO WALKTHROUGH — Charcoal */}
      {villa.video && (
        <section id="video-walkthrough" className={VILLA_DETAIL_CHARCOAL}>
          <div className={vd.sectionShell}>
            <div className={clsx(vd.content, vd.stack)}>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <h3 className="text-gh-h1 font-philosopher text-white">Video Walkthrough</h3>
                {isDomeEstate && (
                  <div className="flex items-center gap-2">
                    {([ { id: "blue", label: "Blue Dome", dot: "#3b82f6" }, { id: "red", label: "Red Dome", dot: "#ef4444" }, { id: "yellow", label: "Yellow Dome", dot: "#eab308" } ] as const).map((t) => {
                      const isActive = activeDomeVideo === t.id;
                      return (
                        <button key={t.id} onClick={() => setActiveDomeVideo(t.id)} className={`flex items-center gap-2 px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-bold border transition-colors ${isActive ? "bg-[#EFCD62] text-black border-[#EFCD62]" : "bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10"}`}>
                          <span className="inline-block w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: t.dot }} />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              {(() => {
                const chosenUrl = domeColor
                  ? DOME_VIDEO_URLS[domeColor]
                  : isDomeEstate
                    ? domeVideoUrls[activeDomeVideo]
                    : typeof villa.video === "object"
                      ? villa.video.youtubeUrl
                      : "";
                const ytId = chosenUrl ? getYouTubeId(chosenUrl) : "";
                if (!ytId) return null;
                if (isPlayingVideo) {
                  return (
                    <div className="relative aspect-video w-full bg-gray-900 overflow-hidden border border-white/10">
                      <iframe src={`https://www.youtube.com/embed/${ytId}?autoplay=1`} title={`${villa.name} Walkthrough`} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
                    </div>
                  );
                }
                return (
                  <div className="relative aspect-video w-full bg-gray-900 overflow-hidden group border border-white/10 cursor-pointer" onClick={() => setIsPlayingVideo(true)}>
                    <Image src={`https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`} alt={`${villa.name} Video Walkthrough`} fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, 800px" priority={false} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center hover:bg-white/30 transition-all group shadow-2xl">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
          <VillaDetailMeanderStrip />
        </section>
      )}

      <VillaDetailServiceList
        services={villa.services ?? []}
        onSeeMore={() => openDrawer("Services", villa.services || [])}
      />

      <VillaDetailAmenityGrid
        amenities={villa.amenities ?? []}
        onSeeMore={() => openDrawer("Amenities", villa.amenities || [])}
      />

      {/* PRICING — Green */}
      {detailPricingBlocks.length > 0 && (
        <section id="pricing" className="w-full bg-[#0B3027] text-white">
          <div className={vd.sectionShell}>
            <div className={clsx(vd.content, vd.stack)}>
              <VillaPricingBlocks
                variant="villa-detail"
                sectionTitle="Pricing"
                blocks={detailPricingBlocks}
                footnote={
                  <p className="text-[#B0B0B0] text-[8px] sm:text-[9px] md:text-[10px] font-manrope leading-relaxed">
                    Note: Prices are base rates and may vary based on season, day of week, and specific requirements. Additional charges may apply for decorations, catering, and extended hours.
                  </p>
                }
              />
            </div>
          </div>
        </section>
      )}

      {/* LOCATION — Charcoal */}
      {villa.locationDetails && (
        <section id="location" className={VILLA_DETAIL_CHARCOAL}>
          <VillaDetailMeanderStrip />
          <div className={vd.sectionShell}>
            <div className={clsx(vd.content, vd.stack)}>
              <h3 className={vd.heading}>Location</h3>
              <div className="bg-jade-charcoal rounded-none overflow-hidden border border-white/10">
                <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="relative block w-full h-64 md:h-80 cursor-pointer outline-none transition-opacity hover:opacity-95 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#EFCD62]/70" aria-label="Open location in Google Maps">
                  {(villa.locationDetails.mapImage || villa.image) && (
                    <JadeImage src={villa.locationDetails.mapImage || villa.image} alt="Map Location" fill className="object-cover opacity-80" sizes="100vw" loading="lazy" />
                  )}
                </a>
                <div className="p-5 md:p-6 bg-[#25282C] border-t border-white/10">
                  <a href={mapsHref} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 rounded-sm outline-none hover:text-[#EFCD62] transition-colors focus-visible:ring-2 focus-visible:ring-[#EFCD62]/60">
                    <MapPin className="w-5 h-5 text-jade-gold mt-1 shrink-0" />
                    <p className="text-white text-gh-body font-manrope font-medium leading-relaxed group-hover:underline underline-offset-4">{villa.locationDetails.address}</p>
                  </a>
                  <div className="w-full bg-white/[0.03] px-4 py-3 mt-5">
                    <p className="text-white/60 text-[12px] md:text-[13px] font-manrope">{villa.locationDetails.distance}</p>
                  </div>
                </div>
              </div>
              {villa.locationDetails.nearby && villa.locationDetails.nearby.length > 0 && (
                <div className={vd.stackSm}>
                  <h4 className="text-[#EFCD62] font-philosopher text-xl md:text-2xl">Whats nearby:</h4>
                  <div className="flex flex-col gap-3">
                    {villa.locationDetails.nearby.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center border-b border-white/5 pb-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-1.5 h-1.5 rotate-45 bg-jade-gold" />
                          <span className="text-white font-manrope text-gh-desc font-medium uppercase tracking-wider">{item.label}</span>
                        </div>
                        <span className="text-white/60 text-gh-desc font-manrope">{item.distance}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* PERFECT FOR — Charcoal */}
      <VillaDetailPerfectForGallery
        cards={villa.perfectForCards ?? []}
        fallbackImage={villa.image}
      />

      {/* FAQ — Charcoal */}
      <section id="faq" className={VILLA_DETAIL_CHARCOAL}>
        <div className={vd.sectionShell}>
          <div className={clsx(vd.content, vd.stack)}>
            <h3 className={vd.heading}>FAQ</h3>
            {villa.faq?.length ? (
              <VillaDetailFaqList
                items={villa.faq.map((item) => ({
                  question: item.question,
                  answer: item.answer,
                }))}
              />
            ) : null}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <Footer stickyBottomBar />
      <div className="jade-scroll-chrome fixed bottom-0 left-0 z-50 flex w-full justify-center border-t border-white/10 bg-transparent py-4 backdrop-blur-2xl transition-all shadow-[0_-8px_32px_rgba(0,0,0,0.12)]">
        <div className={clsx(vd.page, vd.gutterX, "flex justify-between items-center gap-4")}>
          <div className="flex flex-col font-manrope leading-tight">
            <span className="text-white/60 text-[11px] sm:text-[12px] md:text-[13px] font-bold whitespace-nowrap">Starting from</span>
            <span className="text-white text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-extrabold whitespace-nowrap">{villaFooterPriceDisplay ?? "Contact for pricing"}</span>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <button onClick={() => setEnquireOverlayOpen(true)} className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase hover:text-white transition-colors whitespace-nowrap">ENQUIRE</button>
            <PrimaryButton href={`/book?villa=${villa.id}`} withArrow={false} className="whitespace-nowrap">BOOK VILLA</PrimaryButton>
          </div>
        </div>
      </div>
      <DetailsDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={drawerData.title} items={drawerData.items} />
    </main>
  );
}

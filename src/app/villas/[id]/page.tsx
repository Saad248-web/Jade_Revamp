"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { useEffect, useMemo, useRef, useState } from "react";
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
  Plus,
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
} from "lucide-react"; // Import all potentially used icons
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DetailsDrawer from "@/components/DetailsDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { VILLAS } from "@/lib/mockData";
import type { Villa } from "@/lib/types";
import { prettyMediaLabel } from "@/lib/mediaLabels";

// Icon mapping helper
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

  // Semantic fallbacks based on name or title
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

export default function VillaDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const villa = VILLAS.find((v) => v.id === id) as Villa | undefined;

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
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});
  const [activeDomeVideo, setActiveDomeVideo] = useState<
    "red" | "blue" | "yellow"
  >("red");

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => ({ ...prev, [sectionId]: !prev[sectionId] }));
  };

  const scrollFrameRef = useRef<number>();
  const isAutoScrolling = useRef(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/villas/${id}/media`);
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

  const heroImages = media?.hero?.length ? media.hero : [];
  const spaceImages = media?.spaces?.length ? media.spaces : [];
  const experienceImages = media?.experiences?.length ? media.experiences : [];

  const derivedSpaces = useMemo(() => {
    const list = spaceImages.length
      ? spaceImages
      : (villa.spaces || []).map((s) => s.image);
    return list.map((img) => ({
      name: prettyMediaLabel({ url: img, fallback: "Space", kind: "space" }),
      image: img,
    }));
  }, [spaceImages, villa.spaces]);

  const derivedActivities = useMemo(() => {
    const list = experienceImages.length
      ? experienceImages
      : (villa.activities || []).map((a) => a.image);
    return list.map((img) => ({
      title: prettyMediaLabel({
        url: img,
        fallback: "Experience",
        kind: "experience",
      }),
      image: img,
    }));
  }, [experienceImages, villa.activities]);

  // Filter out empty strings — "" is truthy in JS so we must check length
  const validImg = (s: string | undefined) => s && s.length > 0;
  const imagesList = (() => {
    const gallery = heroImages.filter((img) => validImg(img) === true);
    if (gallery.length > 0) return gallery; // hero only, as requested
    if (validImg(villa.image)) return [villa.image];
    return [];
  })();

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

  const handlePrevSpace = () => {
    if (derivedSpaces && derivedSpaces.length > 0) {
      setCurrentSpaceIndex((prev) =>
        prev === 0 ? derivedSpaces.length - 1 : prev - 1,
      );
    }
  };

  const handleNextSpace = () => {
    if (derivedSpaces && derivedSpaces.length > 0) {
      setCurrentSpaceIndex((prev) => (prev + 1) % derivedSpaces.length);
    }
  };

  const handlePrevActivity = () => {
    if (derivedActivities && derivedActivities.length > 0) {
      setCurrentActivityIndex((prev) =>
        prev === 0 ? derivedActivities.length - 1 : prev - 1,
      );
    }
  };

  const handleNextActivity = () => {
    if (derivedActivities && derivedActivities.length > 0) {
      setCurrentActivityIndex((prev) => (prev + 1) % derivedActivities.length);
    }
  };

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

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80; // Reverted to 80 as header now scrolls away
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    // Only start auto-scroll if the URL parameter is present
    const shouldAutoScroll = searchParams.get("autoScroll") === "true";

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

  const getYouTubeId = (url: string) => {
    try {
      // supports:
      // - https://youtu.be/<id>?...
      // - https://www.youtube.com/watch?v=<id>&...
      // - https://www.youtube.com/embed/<id>
      const u = new URL(url);
      const host = u.hostname.replace(/^www\./, "");
      if (host === "youtu.be") return u.pathname.replace("/", "");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || "";
      if (u.pathname === "/watch") return u.searchParams.get("v") || "";
      return "";
    } catch {
      return "";
    }
  };

  const domeVideoUrls = {
    red: "https://youtu.be/k0-1rTGdowk?si=hVmn5sCIcMwn_deE",
    blue: "https://youtu.be/qcstdzAh1ck?si=8Op3MUQu_Je_8cFk",
    yellow: "https://youtu.be/1FnJXIa7LDg?si=z1TjKQ6TEN8SAbzQ",
  } as const;

  return (
    <main className="bg-[#1A1C1E] min-h-screen relative">
      {/* Top Navigation - Scrolls away with page */}
      <div className="absolute top-8 left-6 md:left-12 right-6 md:right-12 flex justify-between items-center z-[60] pointer-events-none">
        <button
          onClick={() => window.history.back()}
          className="pointer-events-auto flex items-center justify-center text-white hover:text-jade-gold transition-all"
          aria-label="Go back"
        >
          <ArrowLeft className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1} />
        </button>
        <Link
          href="/contact"
          className="pointer-events-auto px-[20px] py-[12px] bg-black/40 backdrop-blur-md border border-white/10 text-white text-[9px] md:text-[11px] font-bold tracking-[0.4em] uppercase hover:bg-white hover:text-black transition-all flex items-center justify-center w-fit h-fit gap-[8px]"
        >
          CONTACT US
        </Link>
      </div>
      {/* HERO / CAROUSEL SECTION */}
      <section className="relative h-[60vh] md:h-[80vh] w-full bg-[#1A1C1E]">
        {/* Image (Interactive Carousel) */}
        <div className="absolute inset-0">
          {imagesList.length > 0 && imagesList[currentImageIndex] && (
            <Image
              src={imagesList[currentImageIndex]}
              alt={villa.name}
              fill
              className="object-cover object-center"
              priority
              sizes="100vw"
              quality={75}
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Carousel Controls */}
        {/* Hero Overlays */}
        <div className="absolute inset-0 z-20 pointer-events-none flex justify-center">
          <div className="max-w-7xl mx-auto h-full relative w-full">
            {/* Bottom Controls */}
            <div className="absolute bottom-12 left-0 right-0 px-6 md:px-12 pointer-events-auto flex items-end justify-between">
              {/* Previous Arrow */}
              <button
                onClick={handlePrevImage}
                className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all rounded-none"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              {/* Center Info and Button */}
              <div className="flex flex-col items-center justify-center gap-4">
                {/* Pagination Dash Indicator */}
                <div className="flex items-center gap-4 text-white text-[12px] md:text-[14px] font-bold tracking-[0.2em] opacity-80">
                  <span>{String(currentImageIndex + 1)}</span>
                  <div className="w-16 md:w-24 h-[1px] bg-white/40" />
                  <span className="text-white/40">
                    {String(imagesList.length)}
                  </span>
                </div>

                {/* Branding Header Below Number */}
                <h2 className="text-white font-philosopher text-2xl md:text-4xl uppercase tracking-[0.4em] text-center drop-shadow-2xl">
                  {villa.name}
                </h2>
              </div>

              {/* Next Arrow */}
              <button
                onClick={handleNextImage}
                className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all rounded-none"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </section>
      {/* CONTENT SECTION */}
      <div className="relative bg-[#1A1C1E] rounded-none z-10 px-6 py-8 md:px-12 md:py-16 max-w-7xl mx-auto">
        {/* HEADER INFO */}
        <div className="flex flex-col gap-2 mb-8">
          <span className="text-[#EFCD62] text-[10px] md:text-gh-label font-bold tracking-[0.2em] uppercase">
            {villa.type}
          </span>
          <h1 className="text-[28px] md:text-[32px] font-philosopher text-white mb-1 leading-tight">
            {villa.name}
          </h1>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4 text-white/60" />
            <span className="font-manrope text-[12px] md:text-[14px]">
              {villa.location}
            </span>
          </div>
        </div>

        {/* AMENITY SUMMARY LINE */}
        <div className="flex flex-wrap gap-4 items-center text-white/90 mb-10 text-[11px] md:text-[12px] font-semibold font-manrope tracking-wide">
          <div className="flex items-center gap-2">
            <Bed className="w-4 h-4 text-[#EFCD62]" strokeWidth={1.5} />
            <span>
              {villa.stats.stay.toLowerCase().includes("stay")
                ? villa.stats.stay
                : `${villa.stats.stay} Stay`}
            </span>
          </div>
          <div className="text-white/30 text-xs mt-[1px]">•</div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#EFCD62]" strokeWidth={1.5} />
            <span>
              {villa.stats.events.toLowerCase().includes("event")
                ? villa.stats.events
                : `${villa.stats.events} Event`}
            </span>
          </div>
          <div className="text-white/30 text-xs mt-[1px]">•</div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-[#EFCD62]" strokeWidth={1.5} />
            <span>{villa.stats.bhk}</span>
          </div>
        </div>

        {/* HORIZONTAL AMENITY CARDS */}
        <div className="flex gap-3 overflow-x-auto pb-6 mb-12 snap-x scrollbar-none -mr-6 pr-6 md:-mr-12 md:pr-12">
          {villa.amenities?.map((amenity, idx) => {
            const Icon = getIcon(amenity.icon);
            // Splitting logic for label and sublabel (heuristic)
            const words = amenity.label.split(" ");
            const label =
              words.length > 2 ? words.slice(0, 2).join(" ") : words[0] || "";
            const sublabel =
              words.length > 2
                ? words.slice(2).join(" ")
                : words.slice(1).join(" ");

            return (
              <div
                key={idx}
                className="relative min-w-[130px] h-[130px] md:min-w-[140px] md:h-[140px] p-[1px] rounded-none snap-start group flex-shrink-0 cursor-pointer"
                style={{
                  background:
                    "linear-gradient(to bottom right, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.54) 100%)",
                }}
              >
                <div className="w-full h-full bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-[70px] flex flex-col items-center justify-center text-center px-4 py-4 hover:bg-white/10 transition-colors">
                  <Icon
                    className="w-[24px] h-[24px] text-white/90 group-hover:text-[#EFCD62] transition-colors mb-3"
                    strokeWidth={1.2}
                  />
                  <div className="flex flex-col items-center w-full">
                    <span className="text-white font-manrope font-bold text-[12px] md:text-[14px] leading-snug text-center break-words w-full">
                      {label}
                    </span>
                    {sublabel && (
                      <span className="text-white/60 font-manrope font-medium text-[10px] md:text-[12px] leading-snug mt-1 text-center break-words w-full">
                        {sublabel}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="font-manrope text-white/70 text-gh-body leading-relaxed mb-12 whitespace-pre-line text-justify">
          {villa.description}
        </p>

        <div className="flex flex-col gap-8 mb-12">
          <a
            href="/All Properties - Jade Hospitainment.pdf"
            download
            className="w-full bg-white/5 border border-white/10 text-white px-8 py-5 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-white hover:text-black transition-all flex items-center justify-between group rounded-sm"
          >
            <span>Download Brochure</span>
            <Download className="w-4 h-4 text-white/40 group-hover:text-black transition-colors" />
          </a>
        </div>
      </div>
      {/* EMERALD GREEN SECTION: SPACES, AMENITIES, SERVICES, ETC. */}
      <section className="relative w-full bg-[#0B2C23] py-12 text-white">
        <div className="relative z-10 px-6 py-8 md:px-12 max-w-7xl mx-auto">
          {/* TABS NAVIGATION - STICKY */}
          <div className="sticky top-0 z-40 bg-[#0B2C23] border-b border-white/10 mb-8 flex gap-6 md:gap-10 overflow-x-auto pb-0 scrollbar-none -mr-6 md:-mr-12 pr-6 md:pr-12">
            {[
              "Spaces",
              "Amenities",
              "Services",
              "Experiences",
              "Details",
              "Pricing",
              "Location",
              "Perfect For",
              "Video Walkthrough",
              "FAQ",
            ].map((tab) => {
              const sectionId = tab.toLowerCase().replace(/ /g, "-");
              const isActive = activeTab === sectionId;
              return (
                <button
                  key={tab}
                  onClick={() => scrollToSection(sectionId)}
                  className={`py-4 text-[11px] uppercase tracking-widest font-bold transition-colors whitespace-nowrap border-b-2 ${
                    isActive
                      ? "border-[#EFCD62] text-[#EFCD62]"
                      : "border-transparent text-white/60 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* CONTENT AREA */}
          <div className="flex flex-col gap-16 md:gap-24 max-w-4xl mx-auto">
            {/* SPACES SECTION */}
            {currentSpace && (
              <section id="spaces">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-gh-h1 font-philosopher text-white">
                    Spaces
                  </h3>
                  {derivedSpaces && derivedSpaces.length > 1 && (
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevSpace}
                        disabled={derivedSpaces.length <= 1}
                        className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextSpace}
                        disabled={derivedSpaces.length <= 1}
                        className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative aspect-[4/3] md:aspect-[16/9] w-full rounded-none overflow-hidden group bg-emerald-900/20">
                  {(validImg(currentSpace.image) || validImg(villa.image)) && (
                    <Image
                      src={
                        validImg(currentSpace.image)
                          ? currentSpace.image
                          : villa.image
                      }
                      alt={currentSpace.name || "Space"}
                      fill
                      className="object-cover object-center transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 800px"
                      loading="lazy"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2C23]/80 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-8 left-0 w-full text-center flex flex-col items-center">
                    <h4 className="text-white text-sm md:text-base uppercase tracking-[0.2em] font-bold mb-4 font-manrope">
                      {currentSpace.name || "Lawn"}
                    </h4>
                    {derivedSpaces && derivedSpaces.length > 1 && (
                      <div className="flex items-center justify-center gap-3 text-white text-gh-label font-bold tracking-widest">
                        <span>{currentSpaceIndex + 1}</span>
                        <div className="w-12 h-[1px] bg-white/60" />
                        <span className="text-white/60">
                          {derivedSpaces.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <Link
                  href={`/villas/${id}/spaces`}
                  className="mt-8 w-full border border-white/20 bg-white/5 py-4 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2"
                >
                  VIEW ALL SPACES
                </Link>
              </section>
            )}

            {/* AMENITIES */}
            <section id="amenities">
              <h3 className="text-gh-h2 font-philosopher text-white mb-8">
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                {villa.amenities?.slice(0, 4).map((amenity, idx) => {
                  const Icon = getIcon(amenity.icon);
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-3 p-6 bg-[#0B2C23] border border-white/5 hover:border-jade-gold/30 transition-all group"
                    >
                      <Icon
                        className="w-8 h-8 text-jade-gold transition-transform group-hover:scale-110"
                        strokeWidth={1}
                      />
                      <span className="text-white/80 font-bold uppercase tracking-widest text-[9px] text-center">
                        {amenity.label}
                      </span>
                    </div>
                  );
                })}
                {/* Desktop view shows the rest without truncation logic in the same grid if needed, 
                    but here we strictly follow the 4-item limit for mobile and rely on Know More for the rest.
                    To show all on desktop, we would need a more complex responsive slice. 
                    Given the request 'Remove View More', we maintain a clean 4-item preview. */}
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => openDrawer("Amenities", villa.amenities || [])}
                  className="flex items-center gap-2 text-white/40 text-gh-label font-bold tracking-widest uppercase hover:text-white transition-colors"
                >
                  Know More <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </section>

            {/* SERVICES SECTION */}
            <section id="services">
              <h3 className="text-gh-h2 font-philosopher text-white mb-8">
                Services
              </h3>
              <div className="flex flex-col gap-8 mb-12">
                {villa.services?.slice(0, 4).map((service, idx) => {
                  const Icon = getIcon(service.icon, service.title);
                  return (
                    <div key={idx} className="flex gap-4 md:gap-6 group">
                      <div className="w-12 h-12 md:w-16 md:h-16 flex-shrink-0 border border-[#EFCD62] flex items-center justify-center p-2.5 md:p-3">
                        <Icon
                          strokeWidth={1}
                          className="w-full h-full text-[#EFCD62]"
                        />
                      </div>
                      <div>
                        <h4 className="text-xl md:text-2xl font-bold font-manrope text-white mb-1 transition-colors group-hover:text-[#EFCD62]">
                          {service.title}
                        </h4>
                        <p className="text-white/70 text-gh-body mb-2 leading-relaxed">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() => openDrawer("Services", villa.services || [])}
                  className="flex items-center gap-2 text-white/40 text-gh-label font-bold tracking-widest uppercase hover:text-white transition-colors"
                >
                  Know More <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </section>

            {/* EXPERIENCES SECTION */}
            {currentActivity && (
              <section id="experiences">
                <div className="flex justify-between items-end mb-8">
                  <h3 className="text-gh-h1 font-philosopher text-white">
                    Experiences
                  </h3>
                  {derivedActivities && derivedActivities.length > 1 && (
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevActivity}
                        disabled={derivedActivities.length <= 1}
                        className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextActivity}
                        disabled={derivedActivities.length <= 1}
                        className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative aspect-[4/3] md:aspect-[16/9] w-full rounded-none overflow-hidden group bg-emerald-900/20 mt-4">
                  {(validImg(currentActivity.image) ||
                    validImg(villa.image)) && (
                    <Image
                      src={
                        validImg(currentActivity.image)
                          ? currentActivity.image
                          : villa.image
                      }
                      alt={currentActivity.title}
                      fill
                      className="object-cover object-center transition-transform duration-700 opacity-90 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 800px"
                      loading="lazy"
                      unoptimized
                    />
                  )}
                  <div className="absolute inset-x-0 bottom-0 h-2/3 md:h-1/2 bg-gradient-to-t from-[#1A1C1E]/95 via-[#1A1C1E]/50 to-transparent z-10" />
                  <div className="absolute bottom-0 left-0 w-full p-6 md:p-12 flex flex-col items-center justify-end text-center z-20">
                    <h4 className="text-white font-philosopher text-[28px] md:text-[36px] mb-3">
                      {currentActivity.title}
                    </h4>
                    {(currentActivity as any).description && (
                      <p className="text-white/80 font-manrope text-[14px] md:text-[16px] leading-relaxed max-w-2xl">
                        {(currentActivity as any).description}
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* WHY JADE WEDDING VENUES */}
            <section className="py-12 border-t border-white/5">
              <h3 className="text-gh-h1 font-philosopher text-white mb-12">
                Why Jade Wedding Venues
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                {[
                  {
                    title: "FULLY PRIVATE VENUES",
                    desc: "No shared spaces, no parallel events, complete control over the setting.",
                  },
                  {
                    title: "OUTDOOR-FIRST LAYOUTS",
                    desc: "Lawns, gardens, and open-air spaces designed for ceremonies, receptions, and celebrations.",
                  },
                  {
                    title: "FLEXIBLE PLANNING",
                    desc: "Freedom to work with your own decorators, caterers, photographers, and planners.",
                  },
                  {
                    title: "BUILT FOR SCALE",
                    desc: "Venues that support intimate gatherings as well as large, multi-event weddings.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1 w-2 h-2 rotate-45 bg-jade-gold flex-shrink-0" />
                    <div>
                      <h4 className="text-white font-manrope font-bold tracking-widest text-[13px] mb-3 uppercase">
                        {item.title}
                      </h4>
                      <p className="text-white/60 text-gh-body leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* PROPERTY DETAILS SECTION */}
            <section id="details">
              <h3 className="text-gh-h1 font-philosopher text-white mb-8">
                Property Details
              </h3>
              <div className="flex flex-col gap-8 mb-8">
                {villa.propertyDetails?.slice(0, 4).map((detail, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1.5 w-2 h-2 rotate-45 bg-[#EFCD62] flex-shrink-0" />
                    <div>
                      <h4 className="text-gh-body text-white font-manrope font-medium mb-2">
                        {(detail as any).label || (detail as any).title}
                      </h4>
                      <p className="text-white/60 text-gh-body leading-relaxed">
                        {detail.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                <button
                  onClick={() =>
                    openDrawer("Property Details", villa.propertyDetails || [])
                  }
                  className="flex items-center gap-2 text-white/40 text-gh-label font-bold tracking-widest uppercase hover:text-white transition-colors"
                >
                  Know More <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </section>

            {/* PRICING SECTION */}
            {villa.pricing && (
              <section id="pricing">
                <h3 className="text-gh-h1 font-philosopher text-white mb-8">
                  Pricing
                </h3>
                <div className="flex flex-col gap-8">
                  {/* Stay Experience */}
                  {villa.pricing.stay && (
                    <div className="border border-white/10 p-4 md:p-6 bg-transparent">
                      <h4 className="text-[#EFCD62] text-gh-h2 font-bold font-manrope mb-1">
                        {villa.pricing.stay.title}
                      </h4>
                      <p className="text-white/60 text-gh-body mb-6 max-w-xs">
                        {villa.pricing.stay.subtitle}
                      </p>
                      <div className="flex flex-col gap-3 mb-6">
                        {villa.pricing.stay.packages.map(
                          (pkg: any, i: number) => (
                            <div
                              key={i}
                              className="flex justify-between items-start md:items-center bg-[#0B2C23] p-4 rounded-none border border-white/5"
                            >
                              <div>
                                <div className="text-white font-bold text-gh-body leading-tight mb-1">
                                  {pkg.label}
                                </div>
                                {pkg.sublabel && (
                                  <div className="text-white/40 text-gh-label">
                                    {pkg.sublabel}
                                  </div>
                                )}
                              </div>
                              <div className="text-jade-gold font-mono text-gh-body font-bold text-right shrink-0">
                                {pkg.price}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                      <p className="text-white/50 text-[10px] font-manrope mb-4">
                        Included:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {villa.pricing.stay.features.map(
                          (feat: string, i: number) => (
                            <span
                              key={i}
                              className="bg-[#0B2C23] text-white/80 px-4 py-2 text-gh-label rounded-none border border-white/5 font-medium"
                            >
                              {feat}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                  {/* Event Experience */}
                  {(villa.pricing as any).event && (
                    <div className="border border-white/10 p-4 md:p-6 bg-transparent">
                      <h4 className="text-[#EFCD62] text-gh-h2 font-bold font-manrope mb-1">
                        {(villa.pricing as any).event.title}
                      </h4>
                      <p className="text-white/60 text-gh-body mb-6 max-w-xs">
                        {(villa.pricing as any).event.subtitle}
                      </p>
                      <div className="flex flex-col gap-3 mb-6">
                        {(villa.pricing as any).event.packages.map(
                          (pkg: any, i: number) => (
                            <div
                              key={i}
                              className="flex justify-between items-start md:items-center bg-[#0B2C23] p-4 rounded-none border border-white/5"
                            >
                              <div>
                                <div className="text-white font-bold text-gh-body leading-tight mb-1">
                                  {pkg.label}
                                </div>
                                {pkg.sublabel && (
                                  <div className="text-white/40 text-gh-label">
                                    {pkg.sublabel}
                                  </div>
                                )}
                              </div>
                              <div className="text-jade-gold font-mono text-gh-body font-bold text-right shrink-0">
                                {pkg.price}
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                      <p className="text-white/50 text-[10px] font-manrope mb-4">
                        Included:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {(villa.pricing as any).event.features.map(
                          (feat: string, i: number) => (
                            <span
                              key={i}
                              className="bg-[#0B2C23] text-white/80 px-4 py-2 text-gh-label rounded-none border border-white/5 font-medium"
                            >
                              {feat}
                            </span>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-white/40 text-[10px] mt-4 font-manrope leading-relaxed">
                  Note: Prices are base rates and may vary based on season, day
                  of week, and specific requirements. Additional charges may
                  apply for decorations, catering, and extended hours.
                </p>
              </section>
            )}

            {/* LOCATION SECTION */}
            {villa.locationDetails && (
              <section id="location">
                <h3 className="text-gh-h1 font-philosopher text-white mb-8">
                  Location
                </h3>
                <div className="bg-[#1A1C1E] rounded-none overflow-hidden mb-8 border border-white/10">
                  <div className="relative w-full h-64 md:h-80 bg-gray-800">
                    {(villa.locationDetails.mapImage || villa.image) && (
                      <Image
                        src={villa.locationDetails.mapImage || villa.image}
                        alt="Map Location"
                        fill
                        className="object-cover opacity-80"
                        sizes="100vw"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-6 md:p-8 bg-[#0B2C23] border-t border-white/10">
                    <div className="flex items-start gap-4 mb-8">
                      <MapPin className="w-6 h-6 text-jade-gold mt-1 shrink-0" />
                      <div>
                        <p className="text-white text-gh-body font-manrope font-medium leading-relaxed mb-4">
                          {villa.locationDetails.address}
                        </p>
                        <div className="bg-white/5 inline-block px-4 py-2 rounded-none border border-white/10">
                          <p className="text-jade-gold text-gh-label font-bold tracking-widest uppercase">
                            {villa.locationDetails.distance}
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* What's Nearby */}
                    {villa.locationDetails.nearby &&
                      villa.locationDetails.nearby.length > 0 && (
                        <div className="mt-6">
                          <h4 className="text-jade-gold text-gh-label font-bold tracking-widest uppercase mb-4 font-manrope">
                            What&apos;s nearby:
                          </h4>
                          <div className="flex flex-col gap-3">
                            {villa.locationDetails.nearby.map(
                              (item: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex justify-between items-center"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rotate-45 bg-jade-gold" />
                                    <span className="text-white font-manrope text-gh-body font-bold uppercase tracking-wider">
                                      {item.label}
                                    </span>
                                  </div>
                                  <span className="text-white/60 text-gh-body font-manrope">
                                    {item.distance}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </section>
            )}

            {/* PERFECT FOR SECTION */}
            {villa.perfectFor && villa.perfectFor.length > 0 && (
              <section
                id="perfect-for"
                className="py-12 border-t border-white/5"
              >
                <h3 className="text-gh-h1 font-philosopher text-white mb-8">
                  Perfect for
                </h3>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  {(expandedSections["perfect-for"]
                    ? villa.perfectFor
                    : villa.perfectFor.slice(0, 4)
                  ).map((item: any, idx: number) => {
                    const title = typeof item === "string" ? item : item.title;
                    const image =
                      typeof item === "string"
                        ? villa.images && villa.images.length > idx
                          ? villa.images[idx % villa.images.length]
                          : villa.image
                        : item.image || villa.image;

                    return (
                      <div
                        key={idx}
                        className="relative aspect-square md:aspect-[4/3] bg-[#1A1C1E] group overflow-hidden border border-white/5"
                      >
                        {image && (
                          <Image
                            src={image}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                            sizes="(max-width: 768px) 50vw, 25vw"
                            loading="lazy"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/40 z-10 transition-colors group-hover:bg-black/50" />
                        <div className="absolute inset-0 flex items-center justify-center z-20 p-4">
                          <h4 className="text-white font-manrope font-medium text-sm md:text-base text-center">
                            {title}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {villa.perfectFor && villa.perfectFor.length > 4 && (
                  <button
                    onClick={() => toggleSection("perfect-for")}
                    className="md:hidden flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase hover:text-white transition-colors"
                  >
                    {expandedSections["perfect-for"]
                      ? "View Less"
                      : "View More"}
                    <ArrowRight
                      className={`w-3 h-3 transition-transform ${expandedSections["perfect-for"] ? "-rotate-90" : "rotate-90"}`}
                    />
                  </button>
                )}
              </section>
            )}

            {/* VIDEO WALKTHROUGH */}
            {villa.video && (
              <section
                id="video-walkthrough"
                className="py-12 border-t border-white/5"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                  <h3 className="text-gh-h1 font-philosopher text-white">
                    Video Walkthrough
                  </h3>

                  {villa.id === "dome-villas" && (
                    <div className="flex items-center gap-2">
                      {(
                        [
                          { id: "red", label: "Red Dome" },
                          { id: "blue", label: "Blue Dome" },
                          { id: "yellow", label: "Yellow Dome" },
                        ] as const
                      ).map((t) => {
                        const isActive = activeDomeVideo === t.id;
                        return (
                          <button
                            key={t.id}
                            onClick={() => setActiveDomeVideo(t.id)}
                            className={`px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-bold border transition-colors ${
                              isActive
                                ? "bg-[#EFCD62] text-black border-[#EFCD62]"
                                : "bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10"
                            }`}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {(() => {
                  const chosenUrl =
                    villa.id === "dome-villas"
                      ? domeVideoUrls[activeDomeVideo]
                      : typeof villa.video === "object"
                        ? villa.video.youtubeUrl
                        : "";
                  const ytId = chosenUrl ? getYouTubeId(chosenUrl) : "";
                  return ytId ? (
                    <div className="relative aspect-video w-full bg-gray-900 overflow-hidden border border-white/10">
                      <iframe
                        src={`https://www.youtube.com/embed/${ytId}`}
                        title={`${villa.name} Walkthrough`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                  ) : null;
                })() ? (
                  <div className="relative aspect-video w-full bg-gray-900 overflow-hidden border border-white/10">
                    <iframe
                      src={`https://www.youtube.com/embed/${
                        villa.id === "dome-villas"
                          ? getYouTubeId(domeVideoUrls[activeDomeVideo])
                          : getYouTubeId(
                              typeof villa.video === "object"
                                ? villa.video.youtubeUrl
                                : "",
                            )
                      }`}
                      title={`${villa.name} Walkthrough`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video w-full bg-gray-900 overflow-hidden group border border-white/10">
                    {(typeof villa.video === "string"
                      ? villa.video
                      : villa.image) && (
                      <Image
                        src={
                          typeof villa.video === "string"
                            ? villa.video
                            : villa.image
                        }
                        alt="Video Thumbnail"
                        fill
                        className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                        sizes="(max-width: 768px) 100vw, 800px"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer group shadow-2xl">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* FAQ SECTION */}
            <section id="faq" className="py-12 border-t border-white/5 mb-20">
              <h3 className="text-gh-h1 font-philosopher text-white mb-8">
                FAQ
              </h3>
              <div className="flex flex-col gap-4">
                {villa.faq?.map((item, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div
                      key={idx}
                      className="bg-[#0B2C23] border border-white/5 p-6 md:p-8"
                    >
                      <div
                        className="flex justify-between items-center gap-4 cursor-pointer group"
                        onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      >
                        <h4 className="text-white font-bold text-gh-body leading-tight group-hover:text-jade-gold transition-colors">
                          {item.question}
                        </h4>
                        <div
                          className={`transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                        >
                          <Plus className="w-4 h-4 text-white/40 group-hover:text-jade-gold transition-colors" />
                        </div>
                      </div>
                      {isOpen && (
                        <div className="mt-4 text-white/70 font-manrope text-sm leading-relaxed border-t border-white/10 pt-4">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <Footer />
      <div className="fixed bottom-0 left-0 w-full bg-[#1A1C1E] border-t border-white/10 py-4 z-50 transition-all flex justify-center">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center gap-4 px-4 md:px-12">
          <p className="text-white text-[12px] md:text-[14px] lg:text-base font-bold font-manrope whitespace-nowrap">
            {(villa.pricing as any)?.stay?.packages?.[0]?.price
              ? `Starting from ${(villa.pricing as any).stay.packages[0].price.replace(" + taxes", "")}`
              : (villa.pricing as any)?.event?.packages?.[0]?.price
                ? `Starting from ${(villa.pricing as any).event.packages[0].price.replace(" + taxes", "")}`
                : "Contact for pricing"}
          </p>
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/contact"
              className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase hover:text-white transition-colors whitespace-nowrap"
            >
              ENQUIRE
            </Link>
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
      <div className="h-24 lg:h-20" /> {/* Spacer for floating bar */}
      <DetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerData.title}
        items={drawerData.items}
      />
    </main>
  );
}

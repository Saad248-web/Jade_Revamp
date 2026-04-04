"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import { useEffect, useRef } from "react";
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
} from "lucide-react"; // Import all potentially used icons
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DetailsDrawer from "@/components/DetailsDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
import { useState } from "react";
import { VILLAS } from "@/data/villas";

// Icon mapping helper
const getIcon = (iconName: string) => {
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
  };
  return icons[iconName] || Info;
};

export default function VillaDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params?.id as string;
  const villa = VILLAS.find((v) => v.id === id);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState({
    title: "",
    items: [] as any[],
  });

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSpaceIndex, setCurrentSpaceIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("spaces");

  const scrollFrameRef = useRef<number>();
  const isAutoScrolling = useRef(false);

  if (!villa) {
    return (
      <div className="min-h-screen bg-[#0B2C23] flex items-center justify-center text-white font-philosopher text-2xl">
        Villa Not Found
      </div>
    );
  }

  const imagesList =
    villa.images && villa.images.length > 0 ? villa.images : [villa.image];

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? imagesList.length - 1 : prev - 1,
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagesList.length);
  };

  const handlePrevSpace = () => {
    if (villa.spaces && villa.spaces.length > 0) {
      setCurrentSpaceIndex((prev) =>
        prev === 0 ? villa.spaces!.length - 1 : prev - 1,
      );
    }
  };

  const handleNextSpace = () => {
    if (villa.spaces && villa.spaces.length > 0) {
      setCurrentSpaceIndex((prev) => (prev + 1) % villa.spaces!.length);
    }
  };

  const currentSpace =
    villa.spaces && villa.spaces.length > 0
      ? villa.spaces[currentSpaceIndex]
      : null;

  const openDrawer = (title: string, items: any[]) => {
    setDrawerData({ title, items });
    setIsDrawerOpen(true);
  };

  const scrollToSection = (id: string) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 160; // Increased to account for floating bar + sticky tabs
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

  return (
    <main className="bg-[#1A1C1E] min-h-screen relative">
      {/* Top Floating Navigation */}
      <div className="fixed top-8 left-6 md:left-12 right-6 md:right-12 flex justify-between items-center z-[60] pointer-events-none">
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
          <Image
            src={imagesList[currentImageIndex]}
            alt={villa.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={75}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Carousel Controls */}
        {/* Hero Overlays */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="container mx-auto h-full relative px-6 md:px-12">
            {/* Bottom Controls */}
            <div className="absolute bottom-12 inset-x-0 px-6 md:px-12 pointer-events-auto flex items-end justify-between">
              {/* Previous Arrow */}
              <button
                onClick={handlePrevImage}
                className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-white hover:text-black transition-all rounded-none"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>

              {/* Center Info and Button */}
              <div className="flex flex-col items-center gap-8">
                <div className="flex flex-col items-center">
                  {/* Branding Header moved to Hero Title */}
                  <div className="relative flex flex-col items-center mb-4">
                    <h2 className="text-white font-philosopher text-2xl md:text-5xl uppercase tracking-[0.4em] text-center drop-shadow-2xl">
                      {villa.name}
                    </h2>
                    <div className="w-12 h-[1px] bg-jade-gold/50 mt-4" />
                  </div>

                  {/* Pagination Dash Indicator */}
                  <div className="flex items-center gap-4 text-white text-[10px] md:text-[12px] font-bold tracking-[0.3em] opacity-80">
                    <span>
                      {String(currentImageIndex + 1).padStart(2, "0")}
                    </span>
                    <div className="w-10 md:w-16 h-[1px] bg-white/40" />
                    <span className="text-white/40">
                      {String(imagesList.length).padStart(2, "0")}
                    </span>
                  </div>
                </div>

                {/* View All Pictures Container */}
                <div className="flex flex-col items-center gap-2">
                  <span className="text-[7px] md:text-[8px] text-white/60 uppercase tracking-[0.3em] font-bold">
                    Gallery
                  </span>
                  <button className="bg-white/5 backdrop-blur-sm border border-white/20 text-white px-6 py-2.5 md:px-10 md:py-4 uppercase tracking-[0.3em] text-[8px] md:text-[8px] font-bold hover:bg-white hover:text-black transition-all flex items-center gap-3 rounded-none whitespace-nowrap">
                    <LayoutGrid className="w-3.5 h-3.5" />
                    VIEW ALL PICTURES
                  </button>
                </div>
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
      <div className="relative bg-[#1A1C1E] -mt-4 rounded-none z-10 px-6 py-8 md:px-12 md:py-16 max-w-7xl mx-auto">
        {/* HEADER INFO */}
        <div className="flex flex-col gap-1 mb-8">
          <span className="text-jade-gold text-gh-label font-bold tracking-[0.2em] uppercase">
            {villa.type}
          </span>
          <h1 className="text-5xl md:text-7xl font-philosopher text-white mb-2 leading-tight">
            {villa.name}
          </h1>
          <div className="flex items-center gap-2 text-white/80">
            <MapPin className="w-4 h-4 text-white/60" />
            <span className="font-manrope text-gh-label font-medium">
              {villa.location}
            </span>
          </div>
        </div>

        {/* AMENITY SUMMARY LINE */}
        <div className="flex flex-wrap gap-6 items-center text-white/90 mb-10 text-gh-label font-bold tracking-wide">
          <div className="flex items-center gap-2.5">
            <Bed className="w-5 h-5 text-white/40" strokeWidth={1.5} />
            <span>{villa.stats.stay}</span>
          </div>
          <div className="w-[4px] h-[4px] rounded-full bg-white/20" />
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-white/40" strokeWidth={1.5} />
            <span>{villa.stats.events}</span>
          </div>
          <div className="w-[4px] h-[4px] rounded-full bg-white/20" />
          <div className="flex items-center gap-2.5">
            <Home className="w-5 h-5 text-white/40" strokeWidth={1.5} />
            <span>{villa.stats.bhk}</span>
          </div>
        </div>

        {/* HORIZONTAL AMENITY CARDS */}
        <div className="flex gap-4 overflow-x-auto pb-6 mb-12 snap-x scrollbar-none">
          {villa.amenities?.map((amenity, idx) => {
            const Icon = getIcon(amenity.icon);
            // Splitting logic for label and sublabel (heuristic)
            const words = amenity.label.split(" ");
            const label =
              words.length > 2 ? words.slice(0, 2).join(" ") : words[0];
            const sublabel =
              words.length > 2
                ? words.slice(2).join(" ")
                : words.slice(1).join(" ");

            return (
              <div
                key={idx}
                className="min-w-[160px] md:min-w-[180px] aspect-square bg-[#2A2C30] border border-white/5 p-6 flex flex-col items-center justify-center text-center gap-4 snap-start hover:bg-white/5 transition-colors group rounded-sm"
              >
                <div className="w-12 h-12 flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-white/5 rounded-full blur-xl group-hover:bg-jade-gold/20 transition-colors" />
                  <Icon
                    className="w-8 h-8 text-white/80 group-hover:text-jade-gold transition-colors"
                    strokeWidth={1}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-white font-manrope font-bold text-[14px] leading-tight">
                    {label}
                  </span>
                  <span className="text-white/40 font-manrope text-[11px] font-medium tracking-wide">
                    {sublabel}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="font-manrope text-white/70 text-gh-body leading-relaxed mb-12 whitespace-pre-line text-justify">
          {villa.description}
        </p>

        {/* PERFECT FOR & DOWNLOAD */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center gap-4 text-gh-body overflow-hidden">
            <span className="text-jade-gold font-manrope font-bold min-w-fit flex-shrink-0 uppercase tracking-widest text-[11px]">
              Perfect for:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-none snap-x">
              {villa.perfectFor.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/10 text-white/90 px-3 py-1.5 md:px-4 md:py-2 text-gh-label rounded-[4px] font-manrope whitespace-nowrap flex-shrink-0 snap-start"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button className="w-full bg-white/5 border border-white/10 text-white px-8 py-5 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-white hover:text-black transition-all flex items-center justify-between group rounded-sm">
            <span>Download Brochure</span>
            <Download className="w-4 h-4 text-white/40 group-hover:text-black transition-colors" />
          </button>
        </div>
      </div>
      {/* EMERALD GREEN SECTION: SPACES, AMENITIES, SERVICES, ETC. */}
      <section className="relative w-full bg-[#0B2C23] py-12 text-white">
        <div className="relative z-10 px-6 py-8 md:px-12 max-w-7xl mx-auto">
          {/* TABS NAVIGATION - STICKY */}
          <div className="sticky top-[96px] z-40 bg-[#0B2C23] -mx-6 md:-mx-12 px-6 md:px-12 border-b border-white/10 mb-8 flex gap-1 overflow-x-auto pb-0 scrollbar-none">
            {["Spaces", "Amenities", "Services", "Experiences", "Details"].map(
              (tab) => {
                const isActive = activeTab === tab.toLowerCase();
                return (
                  <button
                    key={tab}
                    onClick={() => scrollToSection(tab.toLowerCase())}
                    className={`px-6 py-4 text-[11px] uppercase tracking-widest font-bold transition-colors whitespace-nowrap border-b-2 ${
                      isActive
                        ? "border-jade-gold text-jade-gold"
                        : "border-transparent text-white/60 hover:text-white"
                    }`}
                  >
                    {tab}
                  </button>
                );
              },
            )}
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
                  {villa.spaces && villa.spaces.length > 1 && (
                    <div className="flex gap-2">
                      <button
                        onClick={handlePrevSpace}
                        className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={handleNextSpace}
                        className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative aspect-[3/4] md:aspect-[16/9] w-full rounded-none overflow-hidden group bg-emerald-900/20">
                  <Image
                    src={currentSpace.image || villa.image}
                    alt={currentSpace.name || "Space"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B2C23]/80 via-transparent to-transparent opacity-90" />
                  <div className="absolute bottom-8 left-0 w-full text-center flex flex-col items-center">
                    <h4 className="text-white text-gh-h3 uppercase tracking-widest font-bold mb-4 font-manrope">
                      {currentSpace.name || "Lawn"}
                    </h4>
                    {villa.spaces && villa.spaces.length > 1 && (
                      <div className="flex items-center justify-center gap-3 text-white text-gh-label font-bold tracking-widest">
                        <span>{currentSpaceIndex + 1}</span>
                        <div className="w-12 h-[1px] bg-white/60" />
                        <span className="text-white/60">
                          {villa.spaces.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <button className="mt-8 w-full border border-white/20 bg-white/5 py-4 uppercase tracking-[0.3em] text-[10px] font-bold hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">
                  VIEW ALL SPACES
                </button>
              </section>
            )}

            {/* AMENITIES */}
            <section id="amenities">
              <h3 className="text-gh-h2 font-philosopher text-white mb-8">
                Amenities
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {villa.amenities?.map((amenity, idx) => {
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
              </div>
              <button
                onClick={() => openDrawer("Amenities", villa.amenities || [])}
                className="flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase hover:text-white transition-colors"
              >
                Know More <ArrowRight className="w-3 h-3" />
              </button>
            </section>

            {/* SERVICES SECTION */}
            <section id="services">
              <h3 className="text-gh-h2 font-philosopher text-white mb-8">
                Services
              </h3>
              <div className="flex flex-col gap-8 mb-12">
                {villa.services?.map((service, idx) => {
                  const Icon =
                    service.icon === "ChefHat"
                      ? ChefHat
                      : service.icon === "User"
                        ? User
                        : service.icon === "SprayCan"
                          ? SprayCan
                          : Phone;
                  return (
                    <div key={idx} className="flex gap-6 group">
                      <div className="w-16 h-16 flex-shrink-0 border border-[#EFCD62] flex items-center justify-center p-3">
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
            </section>

            {/* EXPERIENCES SECTION */}
            <section id="experiences">
              <div className="flex justify-between items-end mb-8">
                <h3 className="text-gh-h1 font-philosopher text-white">
                  Experiences
                </h3>
                <div className="flex gap-2">
                  <button className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button className="w-10 h-10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/5 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="relative aspect-[4/5] md:aspect-[16/9] w-full bg-gray-900 group overflow-hidden">
                <Image
                  src="/X/Tranquil Woods/10.webp"
                  alt="Experiences"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2C23] via-transparent to-transparent z-10" />
                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col items-start z-20">
                  <h4 className="text-gh-h2 font-philosopher text-white mb-2">
                    Candlelight Dining
                  </h4>
                  <p className="text-white/60 text-gh-body mb-6 max-w-lg leading-relaxed">
                    A private setup amidst nature's serenity, perfect for those
                    special moments.
                  </p>
                </div>
              </div>
            </section>

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
                {villa.propertyDetails?.map((detail, idx) => (
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
              <button
                onClick={() =>
                  openDrawer("Property Details", villa.propertyDetails || [])
                }
                className="flex items-center gap-2 text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase hover:text-white transition-colors"
              >
                Know More <ArrowRight className="w-3 h-3" />
              </button>
            </section>

            {/* PRICING SECTION */}
            {villa.pricing && (
              <section id="pricing">
                <h3 className="text-gh-h1 font-philosopher text-white mb-8">
                  Pricing
                </h3>
                <div className="flex flex-col gap-6 border border-white/10 p-4 md:p-6 bg-transparent">
                  {/* Event Experience */}
                  <div className="bg-transparent rounded-none p-0">
                    <h4 className="text-[#EFCD62] text-gh-h2 font-bold font-manrope mb-1">
                      {villa.pricing.event.title}
                    </h4>
                    <p className="text-white/60 text-gh-body mb-6 max-w-xs">
                      {villa.pricing.event.subtitle}
                    </p>
                    <div className="flex flex-col gap-3 mb-6">
                      {villa.pricing.event.packages.map((pkg, i) => (
                        <div
                          key={i}
                          className="flex justify-between items-start md:items-center bg-[#0B2C23] p-4 rounded-none border border-white/5"
                        >
                          <div>
                            <div className="text-white font-bold text-gh-body leading-tight mb-1">
                              {pkg.label}
                            </div>
                          </div>
                          <div className="text-jade-gold font-mono text-gh-body font-bold text-right shrink-0">
                            {pkg.price}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {villa.pricing.event.features.map((feat, i) => (
                        <span
                          key={i}
                          className="bg-[#0B2C23] text-white/80 px-4 py-2 text-gh-label rounded-none border border-white/5 font-medium"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
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
                    <Image
                      src={villa.locationDetails.mapImage || villa.image}
                      alt="Map Location"
                      fill
                      className="object-cover opacity-80"
                    />
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
                  </div>
                </div>
              </section>
            )}

            {/* VIDEO WALKTHROUGH */}
            <section id="video" className="py-12 border-t border-white/5">
              <h3 className="text-gh-h1 font-philosopher text-white mb-8">
                Video Walkthrough
              </h3>
              <div className="relative aspect-video w-full bg-gray-900 overflow-hidden group border border-white/10">
                <Image
                  src={villa.video || villa.image}
                  alt="Video Thumbnail"
                  fill
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center hover:bg-white/30 transition-all cursor-pointer group shadow-2xl">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 text-white text-[10px] font-bold px-2 py-1 rounded-none border border-white/10">
                  1:41
                </div>
              </div>
            </section>

            {/* FAQ SECTION */}
            <section id="faq" className="py-12 border-t border-white/5 mb-20">
              <h3 className="text-gh-h1 font-philosopher text-white mb-8">
                FAQ
              </h3>
              <div className="flex flex-col gap-4">
                {villa.faq?.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0B2C23] border border-white/5 p-6 md:p-8"
                  >
                    <div className="flex justify-between items-center gap-4 cursor-pointer group">
                      <h4 className="text-white font-bold text-gh-body leading-tight group-hover:text-jade-gold transition-colors">
                        {item.question}
                      </h4>
                      <Plus className="w-4 h-4 text-white/40 group-hover:text-jade-gold transition-colors" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <Footer />
      {/* FLOATING BOOKING BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-[#1A1C1E] border-t border-white/10 p-3 md:p-4 md:px-8 z-50 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <p className="text-white text-base md:text-gh-h3 font-bold font-manrope whitespace-nowrap">
            ₹65,000 onwards
          </p>
          <div className="flex items-center gap-4 md:gap-6">
            <Link
              href="/contact"
              className="text-[#EFCD62] text-gh-label font-bold tracking-[0.2em] uppercase hover:text-white transition-colors whitespace-nowrap"
            >
              ENQUIRE
            </Link>
            <PrimaryButton href={`/book?villa=${villa.id}`} withArrow={false}>
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

"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
  };
  return icons[iconName] || Info;
};

export default function VillaDetailsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerData, setDrawerData] = useState({
    title: "",
    items: [] as any[],
  });

  const scrollFrameRef = useRef<number>();
  const isAutoScrolling = useRef(false);

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

  const villa = VILLAS.find((v) => v.id === id);

  const openDrawer = (title: string, items: any[]) => {
    setDrawerData({ title, items });
    setIsDrawerOpen(true);
  };

  if (!villa) {
    return (
      <div className="min-h-screen bg-[#1A1C1E] flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-philosopher mb-4">Villa Not Found</h1>
        <Link href="/villas" className="text-jade-gold hover:underline">
          Back to Villas
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-[#1A1C1E] min-h-screen relative">
      <Navbar />
      {/* HERO / CAROUSEL SECTION */}
      <section className="relative h-[60vh] md:h-[80vh] w-full bg-[#1A1C1E]">
        {/* Image (Simulated Carousel for now with single image) */}
        <div className="absolute inset-0">
          <Image
            src={villa.image}
            alt={villa.name}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={75}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* Carousel Controls (Simulated) */}
        <div className="absolute bottom-8 left-0 w-full px-4 md:px-8 flex justify-between items-center z-20">
          <button className="w-10 h-10 flex items-center justify-center bg-black/40 border border-white/10 text-white hover:bg-white hover:text-black transition-all">
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4 text-white text-xs font-bold tracking-widest">
            <span>1</span>
            <div className="w-12 h-[1px] bg-white/50" />
            <span className="text-white/50">37</span>
          </div>

          <button className="w-10 h-10 flex items-center justify-center bg-black/40 border border-white/10 text-white hover:bg-white hover:text-black transition-all">
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
      {/* CONTENT SECTION */}
      <div className="relative bg-[#1A1C1E] -mt-4 rounded-t-3xl md:rounded-none z-10 px-6 py-8 md:px-12 md:py-16 max-w-7xl mx-auto">
        {/* HEADER INFO */}
        <div className="flex justify-between items-start mb-8 relative">
          <div className="flex flex-col gap-2 relative w-full">
            <div className="flex items-center justify-between w-full">
              <span className="text-jade-gold text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase max-w-[80%]">
                {villa.type}
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-philosopher text-white">
              {villa.name}
            </h1>
            <div className="flex items-center gap-2 text-white/60 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="font-manrope text-sm">
                {villa.location.split("·")[0]}
              </span>
            </div>
          </div>
        </div>

        {/* SCROLLABLE STATS BAR */}
        <div className="flex gap-4 overflow-x-auto pb-4 mb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
          {/* Box 1: Stay */}
          <div className="w-32 md:w-40 aspect-square border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center bg-white/5 snap-start shrink-0">
            <Bed className="w-6 h-6 text-white/70 mb-3" />
            <span className="text-white font-manrope text-sm font-bold mb-1 leading-tight">
              {villa.stats.stay}
            </span>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">
              Stay
            </span>
          </div>

          {/* Box 2: Events */}
          <div className="w-32 md:w-40 aspect-square border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center bg-white/5 snap-start shrink-0">
            <Users className="w-6 h-6 text-white/70 mb-3" />
            <span className="text-white font-manrope text-sm font-bold mb-1 leading-tight">
              {villa.stats.events}
            </span>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">
              Events
            </span>
          </div>

          {/* Box 3: BHK+Bathroom */}
          <div className="w-32 md:w-40 aspect-square border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center bg-white/5 snap-start shrink-0">
            <Home className="w-6 h-6 text-white/70 mb-3" />
            <span className="text-white font-manrope text-sm font-bold mb-1 leading-tight">
              {villa.stats.bhk}
            </span>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">
              BHK+Bathroom
            </span>
          </div>

          {/* Box 4: Lawn (Conditional) */}
          {villa.stats.lawn && (
            <div className="w-32 md:w-40 aspect-square border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center bg-white/5 snap-start shrink-0">
              <Bed className="w-6 h-6 text-white/70 mb-3" />
              <span className="text-white font-manrope text-sm font-bold mb-1 leading-tight">
                {villa.stats.lawn}
              </span>
              <span className="text-white/40 text-[10px] uppercase tracking-wider">
                Lawn
              </span>
            </div>
          )}

          {/* Box 5: Home Theater (Conditional) */}
          {villa.stats.homeTheater && (
            <div className="w-32 md:w-40 aspect-square border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center bg-white/5 snap-start shrink-0">
              <Users className="w-6 h-6 text-white/70 mb-3" />
              <span className="text-white font-manrope text-sm font-bold mb-1 leading-tight">
                {villa.stats.homeTheater}
              </span>
              <span className="text-white/40 text-[10px] uppercase tracking-wider">
                Home Theater
              </span>
            </div>
          )}

          {/* Box 6: Villa Area (Conditional) */}
          {villa.stats.villaArea && (
            <div className="w-32 md:w-40 aspect-square border border-white/10 rounded-sm p-4 flex flex-col items-center justify-center text-center bg-white/5 snap-start shrink-0">
              <Home className="w-6 h-6 text-white/70 mb-3" />
              <span className="text-white font-manrope text-sm font-bold mb-1 leading-tight">
                {villa.stats.villaArea}
              </span>
              <span className="text-white/40 text-[10px] uppercase tracking-wider">
                Villa
              </span>
            </div>
          )}
        </div>

        <p className="font-manrope text-white/70 text-sm md:text-base leading-relaxed mb-12 whitespace-pre-line text-justify">
          {villa.description}
        </p>

        {/* PERFECT FOR & DOWNLOAD */}
        <div className="flex flex-col gap-8 mb-12">
          <div className="flex items-center gap-2 text-sm md:text-base overflow-hidden">
            <span className="text-white/60 font-manrope font-bold min-w-fit flex-shrink-0">
              Perfect for:
            </span>
            <div className="flex gap-2 overflow-x-auto pb-2 -mb-2 scrollbar-none snap-x">
              {villa.perfectFor.map((tag) => (
                <span
                  key={tag}
                  className="bg-white/10 text-white/90 px-3 py-1.5 md:px-4 md:py-2 text-[13px] md:text-sm rounded-[4px] font-manrope whitespace-nowrap flex-shrink-0 snap-start"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <button className="w-full bg-[#2A2C30] border border-white/10 text-white px-6 py-4 uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-colors flex items-center justify-between group">
            <span>Download Brochure</span>
            <Download className="w-4 h-4 text-white/60 group-hover:text-black transition-colors" />
          </button>
        </div>
      </div>
      {/* EMERALD GREEN SECTION: SPACES, AMENITIES, SERVICES, ETC. */}
      <section className="relative w-full bg-[#0D4032] py-12 text-white">
        <div className="relative z-10 px-6 py-8 md:px-12 max-w-7xl mx-auto">
          {/* TABS NAVIGATION */}
          <div className="border-b border-white/10 mb-8 flex gap-1 overflow-x-auto pb-0 scrollbar-none">
            {["Spaces", "Amenities", "Services", "Experiences", "Details"].map(
              (tab, idx) => (
                <button
                  key={tab}
                  className={`px-6 py-3 text-xs md:text-sm uppercase tracking-widest font-bold transition-colors whitespace-nowrap ${
                    idx === 0
                      ? "bg-[#EFCD62] text-black"
                      : "text-white/60 hover:text-white bg-transparent"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>

          {/* CONTENT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-24">
            {/* LEFT COLUMN (Details) */}
            <div className="lg:col-span-2 flex flex-col gap-16">
              {/* SPACES CAROUSEL SECTION */}
              <section>
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl md:text-4xl font-philosopher text-white">
                    Spaces
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

                {/* Space Card */}
                <div className="relative aspect-[3/4] md:aspect-[4/5] w-full rounded-sm overflow-hidden group bg-emerald-900/20">
                  <Image
                    src={villa.spaces?.[0]?.image || villa.image}
                    alt={villa.spaces?.[0]?.name || "Space"}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 66vw"
                    quality={60}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                  <div className="absolute bottom-8 left-0 w-full text-center flex flex-col items-center">
                    <h4 className="text-white text-xl uppercase tracking-widest font-bold mb-4 font-manrope">
                      {villa.spaces?.[0]?.name || "Lawn"}
                    </h4>
                    <div className="flex items-center justify-center gap-3 text-white text-xs font-bold tracking-widest">
                      <span>4</span>
                      <div className="w-12 h-[1px] bg-white/60" />
                      <span className="text-white/60">7</span>
                    </div>
                  </div>
                </div>
              </section>
              {/* AMENITIES */}
              <section>
                <h3 className="text-2xl md:text-3xl font-philosopher text-white mb-8">
                  Amenities
                </h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-8 mb-8">
                  {villa.amenities?.map((amenity, idx) => {
                    const Icon = getIcon(amenity.icon);
                    return (
                      <div key={idx} className="flex items-start gap-4 group">
                        <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center border border-white/10 rounded-sm bg-transparent">
                          <Icon className="w-5 h-5 text-[#EFCD62]" />
                        </div>
                        <div className="flex flex-col justify-center h-12">
                          <span className="text-white font-manrope font-semibold text-sm md:text-base leading-tight">
                            {amenity.label.split(" ").map((word, i) => (
                              <span key={i} className="block">
                                {word}
                              </span>
                            ))}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  onClick={() => openDrawer("Amenities", villa.amenities || [])}
                  className="flex items-center gap-2 text-[#EFCD62] text-xs font-bold tracking-widest uppercase hover:text-white transition-colors"
                >
                  See More <ArrowRight className="w-3 h-3" />
                </button>
              </section>

              {/* SERVICES SECTION */}
              <section>
                <h3 className="text-2xl md:text-3xl font-philosopher text-white mb-8">
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
                          <h4 className="text-lg font-bold font-manrope text-white mb-1 transition-colors group-hover:text-[#EFCD62]">
                            {service.title}
                          </h4>
                          <p className="text-white/70 text-sm mb-2 leading-relaxed">
                            {service.description}
                          </p>
                          <p className="text-white/40 text-[10px] uppercase tracking-wider">
                            {service.footer}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* EXPERIENCES SECTION */}
              <section>
                <div className="flex justify-between items-end mb-8">
                  <h3 className="text-3xl md:text-4xl font-philosopher text-white">
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
                <div className="relative aspect-[4/5] md:aspect-[3/4] w-full bg-gray-900 group overflow-hidden">
                  <Image
                    src="/assets/experience_wellness.png"
                    alt="Experiences"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    quality={60}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                  <div className="absolute bottom-0 left-0 w-full p-8 text-center bg-gradient-to-t from-black/80 to-transparent z-20">
                    <h4 className="text-2xl md:text-3xl font-philosopher text-white mb-4">
                      Weekend Getaways
                    </h4>
                    <p className="text-white/80 text-sm mb-6 leading-relaxed">
                      A day or two with your friends and family away from the
                      bustling city in the wilderness is truly on everyone's
                      wishlist.
                    </p>
                    <button className="w-full border border-white/30 bg-white/10 backdrop-blur-sm text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2">
                      See what a getaway looks like{" "}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </section>

              {/* PROPERTY DETAILS SECTION */}
              <section>
                <h3 className="text-3xl md:text-4xl font-philosopher text-white mb-8">
                  Property Details
                </h3>
                <div className="flex flex-col gap-8 mb-8">
                  {villa.propertyDetails?.map((detail, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="mt-1.5 w-2 h-2 rotate-45 bg-[#EFCD62] flex-shrink-0" />
                      <div>
                        <h4 className="text-lg text-white font-manrope font-medium mb-2">
                          {(detail as any).label || (detail as any).title}
                        </h4>
                        <p className="text-white/60 text-sm leading-relaxed">
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
                  className="flex items-center gap-2 text-[#EFCD62] text-xs font-bold tracking-widest uppercase hover:text-white transition-colors"
                >
                  See More <ArrowRight className="w-3 h-3" />
                </button>
              </section>

              {/* PRICING SECTION */}
              {villa.pricing && (
                <section>
                  <h3 className="text-3xl md:text-4xl font-philosopher text-white mb-8">
                    Pricing
                  </h3>
                  <div className="flex flex-col gap-6 border border-white/10 rounded-2xl p-4 md:p-6 bg-transparent">
                    {/* Stay Experience */}
                    <div className="bg-transparent rounded-lg p-0">
                      <h4 className="text-[#EFCD62] text-xl font-bold font-manrope mb-1">
                        {villa.pricing.stay.title}
                      </h4>
                      <p className="text-white/60 text-sm mb-6 max-w-xs">
                        {villa.pricing.stay.subtitle}
                      </p>

                      <div className="flex flex-col gap-3 mb-6">
                        {villa.pricing.stay.packages.map((pkg, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-start md:items-center bg-[#174539] p-4 rounded-sm"
                          >
                            <div>
                              <div className="text-white font-bold text-base leading-tight mb-1">
                                {pkg.label}
                              </div>
                              {pkg.sublabel && (
                                <div className="text-white/40 text-xs">
                                  {pkg.sublabel}
                                </div>
                              )}
                            </div>
                            <div className="text-white font-mono text-base font-bold text-right shrink-0">
                              {pkg.price}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {villa.pricing.stay.features.map((feat, i) => (
                          <span
                            key={i}
                            className="bg-[#174539] text-white/80 px-4 py-2 text-xs rounded-full border border-white/5 font-medium"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Event Experience */}
                    <div className="bg-transparent rounded-lg p-0 pt-6 border-t border-white/10">
                      <h4 className="text-[#EFCD62] text-xl font-bold font-manrope mb-1">
                        {villa.pricing.event.title}
                      </h4>
                      <p className="text-white/60 text-sm mb-6 max-w-xs">
                        {villa.pricing.event.subtitle}
                      </p>

                      <div className="flex flex-col gap-3 mb-6">
                        {villa.pricing.event.packages.map((pkg, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-start md:items-center bg-[#174539] p-4 rounded-sm"
                          >
                            <div>
                              <div className="text-white font-bold text-base leading-tight mb-1">
                                {pkg.label}
                              </div>
                              {pkg.sublabel && (
                                <div className="text-white/40 text-xs">
                                  {pkg.sublabel}
                                </div>
                              )}
                            </div>
                            <div className="text-white font-mono text-base font-bold text-right shrink-0">
                              {pkg.price}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {villa.pricing.event.features.map((feat, i) => (
                          <span
                            key={i}
                            className="bg-[#174539] text-white/80 px-4 py-2 text-xs rounded-full border border-white/5 font-medium"
                          >
                            {feat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-white/40 text-[10px] mt-4 leading-relaxed">
                    Note: Prices are base rates and may vary based on season,
                    day of week, and specific requirements. Additional charges
                    may apply for decorations, catering, and extended hours.
                  </p>
                </section>
              )}

              {/* LOCATION SECTION */}
              {villa.locationDetails && (
                <section>
                  <h3 className="text-3xl md:text-4xl font-philosopher text-white mb-8">
                    Location
                  </h3>
                  <div className="bg-[#1A1C1E] rounded-xl overflow-hidden mb-8 border border-white/10">
                    {/* Map Image Placeholder */}
                    <div className="relative w-full h-64 md:h-80 bg-gray-800">
                      {/* In a real app, this would be a Google Maps embed or a static map image */}
                      <div className="absolute inset-0 flex items-center justify-center text-white/20">
                        Map Placeholder
                      </div>
                      <Image
                        src={villa.locationDetails.mapImage}
                        alt="Map Location"
                        fill
                        className="object-cover opacity-80"
                        sizes="(max-width: 768px) 100vw, 66vw"
                        quality={60}
                      />
                    </div>

                    {/* Address Box */}
                    <div className="p-6 md:p-8">
                      <div className="flex items-start gap-4 mb-6">
                        <MapPin className="w-6 h-6 text-white/60 mt-1 shrink-0" />
                        <div>
                          <p className="text-white text-lg font-manrope font-medium leading-relaxed mb-4">
                            {villa.locationDetails.address}
                          </p>
                          <div className="bg-white/5 inline-block px-4 py-2 rounded-md">
                            <p className="text-white/60 text-xs">
                              {villa.locationDetails.distance}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Whats Nearby */}
                      <div>
                        <h4 className="text-[#EFCD62] text-xl font-bold font-manrope mb-6">
                          Whats nearby:
                        </h4>
                        <div className="flex flex-col gap-4">
                          {villa.locationDetails.nearby.map((place, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between items-center border-b border-white/5 pb-4 last:border-0 hover:bg-white/5 transition-colors p-2 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rotate-45 bg-[#EFCD62]" />
                                <span className="text-white font-bold uppercase tracking-wider text-sm">
                                  {place.label}
                                </span>
                              </div>
                              <span className="text-white/60 text-sm">
                                {place.distance}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              )}

              {/* ACTIVITIES SECTION */}
              {villa.activities && (
                <section>
                  <h3 className="text-3xl md:text-4xl font-philosopher text-white mb-8">
                    Activities
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {villa.activities.map((activity, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square w-full bg-gray-800 rounded-sm overflow-hidden group"
                      >
                        <Image
                          src={activity.image}
                          alt={activity.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 50vw, 33vw"
                          quality={60}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <h4 className="text-white text-lg md:text-2xl font-philosopher text-center px-2 drop-shadow-md">
                            {activity.title}
                          </h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* VIDEO WALKTHROUGH SECTION */}
              <section className="mb-12">
                <h3 className="text-3xl md:text-4xl font-philosopher text-white mb-8">
                  Video Walkthrough
                </h3>
                <div className="relative w-full aspect-video bg-black/50 rounded-lg overflow-hidden group cursor-pointer border border-white/10">
                  <Image
                    src="/assets/Walkthrough_Cover.png" // Placeholder or reuse an existing asset
                    alt="Video Walkthrough"
                    fill
                    className="object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                    sizes="(max-width: 768px) 100vw, 66vw"
                    quality={60}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border-2 border-white flex items-center justify-center backdrop-blur-sm bg-white/10 group-hover:scale-110 transition-transform">
                      <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    1:41
                  </div>
                </div>
              </section>

              {/* FAQ SECTION */}
              {villa.faq && (
                <section className="mb-20">
                  <h3 className="text-3xl md:text-4xl font-philosopher text-white mb-8">
                    FAQ
                  </h3>
                  <div className="flex flex-col gap-8">
                    {villa.faq.slice(0, 3).map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4">
                        <div className="mt-1.5 w-2 h-2 rotate-45 bg-[#EFCD62] flex-shrink-0" />
                        <div>
                          <h4 className="text-lg text-white font-manrope font-medium mb-2">
                            {item.question}
                          </h4>
                          <p className="text-white/60 text-sm leading-relaxed">
                            {item.answer}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {villa.faq.length > 3 && (
                    <button
                      onClick={() => openDrawer("FAQ", villa.faq || [])}
                      className="mt-8 text-[#EFCD62] text-xs font-bold tracking-widest uppercase hover:text-white transition-colors flex items-center gap-2"
                    >
                      VIEW MORE <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </section>
              )}
            </div>

            {/* RIGHT COLUMN (Booking Card / Info) */}
            <div className="relative">
              <div className="sticky top-32 bg-[#252629] p-8 rounded-2xl border border-white/10">
                <h4 className="text-xl font-philosopher text-white mb-2">
                  Interested in {villa.name}?
                </h4>
                <p className="text-white/60 text-sm mb-8 font-manrope">
                  Contact us to check availability, pricing, or to schedule a
                  site visit.
                </p>

                <button className="w-full bg-[#EFCD62] text-[#1A1C1E] font-bold py-4 rounded-lg uppercase tracking-widest text-xs hover:bg-white transition-colors mb-4">
                  Request Booking
                </button>
                <button className="w-full bg-transparent border border-white/20 text-white font-bold py-4 rounded-lg uppercase tracking-widest text-xs hover:bg-white/5 transition-colors">
                  Speak with our team
                </button>

                <div className="mt-8 pt-8 border-t border-white/10 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <Info className="w-4 h-4" />
                    <span>Minimum advance booking required</span>
                  </div>
                  <div className="flex items-center gap-3 text-white/60 text-sm">
                    <HelpCircle className="w-4 h-4" />
                    <span>
                      Questions? <strong>+91 99999 99999</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FOOTER */}
      <Footer />
      {/* FLOATING BOOKING BAR */}
      <div className="fixed bottom-[72px] lg:bottom-0 left-0 w-full bg-[#1A1C1E] border-t border-white/10 p-3 md:p-4 md:px-8 z-40 transition-all">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-2">
          <div>
            <p className="text-white/60 text-[10px] md:text-xs mb-0.5 font-manrope">
              Starting from
            </p>
            <p className="text-white text-lg md:text-xl font-bold font-manrope">
              ₹65,000
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <button className="text-[#EFCD62] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase px-2 py-2 md:px-4 md:py-3 hover:text-white transition-colors">
              ENQUIRE
            </button>
            <button className="bg-[#EFCD62] text-[#1A1C1E] text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase px-4 py-2 md:px-8 md:py-3 rounded-sm hover:bg-white transition-colors">
              BOOK VILLA
            </button>
          </div>
        </div>
      </div>
      <div className="h-36 lg:h-20" />{" "}
      {/* Spacer for floating bar and mobile nav */}
      <MobileBottomNav />
      <DetailsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={drawerData.title}
        items={drawerData.items}
      />
    </main>
  );
}

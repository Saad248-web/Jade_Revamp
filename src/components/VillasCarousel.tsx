"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Search } from "lucide-react";
import { VILLAS, CATEGORIES } from "@/data/villas";
import ReservationOverlay from "./ReservationOverlay";
import VillaCard from "./VillaCard";

// Navbar height to offset the sticky filter bar
const NAVBAR_HEIGHT = 72; // px — matches the fixed navbar (2px progress + ~70px bar)

export default function VillasCarousel() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [navbarVisible, setNavbarVisible] = useState(true);

  // Overlay states
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [overlayView, setOverlayView] = useState<"dates" | "guests">("dates");

  // Dynamic Search State
  const [guests, setGuests] = useState({ adults: 2, children: 0, pets: 0 });
  const [dates, setDates] = useState<number[]>([]);

  // Format strings for inputs
  const formatDates = () => {
    if (dates.length === 0) return "";
    if (dates.length === 1) return `${dates[0]} Jan`;
    return `${dates[0]} Jan - ${dates[dates.length - 1]} Jan`;
  };

  const formatGuests = () => {
    const total = guests.adults + guests.children;
    if (total === 0) return "";
    let str = `${total} Guest${total > 1 ? "s" : ""}`;
    if (guests.pets > 0)
      str += `, ${guests.pets} Pet${guests.pets > 1 ? "s" : ""}`;
    return str;
  };

  // Mirror the same hide/show logic used in Navbar.tsx
  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const current = window.scrollY;
      if (current > lastY && current > 150) {
        setNavbarVisible(false); // scrolling down → navbar hides
      } else {
        setNavbarVisible(true); // scrolling up → navbar shows
      }
      lastY = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredVillas = VILLAS.filter(
    (villa) =>
      activeCategory === "All" || villa.categories.includes(activeCategory),
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  return (
    <section
      id="villas-carousel"
      className="relative bg-[#1A1C1E] pb-20 min-h-screen"
    >
      {/* STICKY FILTERS BAR — slides with the navbar */}
      <div
        className="sticky z-30 bg-[#1A1C1E]/95 backdrop-blur-md border-b border-white/8 transition-all duration-300 ease-in-out"
        style={{ top: navbarVisible ? `${NAVBAR_HEIGHT}px` : "0px" }}
      >
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 pb-4">
          <div className="flex flex-col gap-4 mt-6">
            <span className="text-white/40 font-manrope text-[10px] font-bold tracking-wider">
              {activeCategory === "All" ? "All Villas" : activeCategory}{" "}
              {filteredVillas.length}
            </span>

            {/* SEARCH BAR */}
            <div className="flex items-center bg-[#222428] border border-white/10 w-full lg:max-w-4xl">
              <div
                onClick={() => {
                  setOverlayView("dates");
                  setIsOverlayOpen(true);
                }}
                className="flex-1 px-4 py-3 md:px-6 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <span className="block text-white/50 text-[9px] md:text-[10px] font-manrope uppercase tracking-widest mb-1 pointer-events-none">
                  Check In - Check Out
                </span>
                <input
                  type="text"
                  placeholder="28 Mar - 2 Apr"
                  value={formatDates()}
                  readOnly
                  className="bg-transparent text-white font-manrope text-sm md:text-base outline-none w-full placeholder:text-white cursor-pointer"
                />
              </div>
              <div className="w-px h-10 md:h-12 bg-white/10" />
              <div
                onClick={() => {
                  setOverlayView("guests");
                  setIsOverlayOpen(true);
                }}
                className="flex-1 px-4 py-3 md:px-6 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <span className="block text-white/50 text-[9px] md:text-[10px] font-manrope uppercase tracking-widest mb-1 pointer-events-none">
                  Guests
                </span>
                <input
                  type="text"
                  placeholder="2 Guests"
                  value={formatGuests()}
                  readOnly
                  className="bg-transparent text-white font-manrope text-sm md:text-base outline-none w-full placeholder:text-white cursor-pointer"
                />
              </div>
              <button className="px-4 md:px-6 text-white/50 hover:text-white transition-colors flex items-center justify-center self-stretch border-l border-transparent">
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>

            {/* CATEGORIES */}
            <div className="flex overflow-x-auto items-center gap-2 md:gap-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`whitespace-nowrap flex-shrink-0 px-4 py-2 text-xs md:text-sm font-manrope font-medium transition-all duration-300 ${
                    activeCategory === category
                      ? "bg-[#EFCD62] text-[#1A1C1E] border border-[#EFCD62]"
                      : "bg-transparent text-white/60 border border-white/20 hover:border-white/50 hover:text-white"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 w-full mt-12 pb-32">
        {filteredVillas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-16">
            {filteredVillas.map((villa) => (
              <VillaCard key={villa.id} villa={villa} />
            ))}
          </div>
        ) : (
          // No results fallback
          <div className="flex flex-col items-center justify-center h-[50vh] text-center">
            <span className="text-white/40 font-manrope text-lg">
              No villas found for "{activeCategory}".
            </span>
            <button
              onClick={() => setActiveCategory("All")}
              className="mt-4 text-[#EFCD62] font-manrope underline underline-offset-4"
            >
              View All Villas
            </button>
          </div>
        )}
      </div>

      <ReservationOverlay
        isOpen={isOverlayOpen}
        onClose={() => setIsOverlayOpen(false)}
        initialView={overlayView}
        guests={guests}
        setGuests={setGuests}
        dates={dates}
        setDates={setDates}
        onApply={() =>
          console.log("Search applying:", {
            dates,
            guests,
            category: activeCategory,
          })
        }
      />
    </section>
  );
}

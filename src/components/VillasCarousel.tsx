"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { VILLAS, CATEGORIES } from "@/lib/mockData";
import ReservationOverlay from "./ReservationOverlay";
import VillaCard from "./VillaCard";
import BookingBanner from "./BookingBanner";
import PrimaryButton from "@/components/PrimaryButton";
import { useBooking } from "@/context/BookingContext";

// Navbar height to offset the sticky filter bar
const NAVBAR_HEIGHT = 72;

// Unavailable date ranges (month name → array of unavailable days)
const VILLA_UNAVAILABLE: Record<string, number[]> = {
  "January 2026": [7, 8, 9, 21, 22],
  "February 2026": [7, 8, 9, 10, 21, 22],
  "March 2026": [14, 15, 21, 22, 28, 29, 30, 31],
  "April 2026": [1, 2, 3, 4, 5, 18, 19, 20],
};

const VILLA_MONTHS = [
  { name: "January 2026", month: 0 },
  { name: "February 2026", month: 1 },
  { name: "March 2026", month: 2 },
  { name: "April 2026", month: 3 },
];

const NEXT_AVAILABLE = [
  { label: "25 Mar - 27 Mar" },
  { label: "5 Apr - 7 Apr" },
  { label: "3 Apr - 5 Apr" },
];

export default function VillasCarousel() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [navbarVisible, setNavbarVisible] = useState(true);
  const searchParams = useSearchParams();

  // Read category from URL on mount
  useEffect(() => {
    const categoryParam = searchParams?.get("category");
    if (categoryParam) {
      // Check if it's a valid category
      const validCategory = CATEGORIES.find(
        (c) => c.toLowerCase() === categoryParam.toLowerCase(),
      );
      if (validCategory) {
        setActiveCategory(validCategory);
        // Scroll to the carousel when a category is specified
        setTimeout(() => {
          const el = document.getElementById("villas-carousel");
          if (el) {
            const y =
              el.getBoundingClientRect().top +
              window.scrollY -
              NAVBAR_HEIGHT -
              20;
            window.scrollTo({ top: y, behavior: "smooth" });
          }
        }, 500);
      }
    }
  }, [searchParams]);

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
        setNavbarVisible(false);
      } else {
        setNavbarVisible(true);
      }
      lastY = current;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { dateRange, setDateRange, guests: contextGuests } = useBooking();

  // Check if booking dateRange overlaps any unavailable days
  const hasDateConflict = (() => {
    const { checkIn, checkOut } = dateRange;
    if (!checkIn || !checkOut) return false;
    const from = checkIn.month * 31 + checkIn.day;
    const to = checkOut.month * 31 + checkOut.day;
    for (const month of VILLA_MONTHS) {
      const days = VILLA_UNAVAILABLE[month.name] ?? [];
      for (const d of days) {
        const val = month.month * 31 + d;
        if (val >= from && val <= to) return true;
      }
    }
    return false;
  })();

  const filteredVillas = VILLAS.filter(
    (villa) =>
      activeCategory === "All" ||
      villa.categories?.some(
        (c: string) => c.toLowerCase() === activeCategory.toLowerCase(),
      ),
  );

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  // Auto-scroll to the carousel section when there is a date conflict
  useEffect(() => {
    if (!hasDateConflict) return;
    const el = document.getElementById("villas-carousel");
    if (!el) return;
    // Try Lenis first, fall back to native
    const lenis = (window as unknown as Record<string, unknown>).__lenis as
      | { scrollTo?: (el: Element, opts: object) => void }
      | undefined;
    if (lenis?.scrollTo) {
      lenis.scrollTo(el, { offset: 0, duration: 1.2 });
    } else {
      const y = el.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasDateConflict]);

  const handleSearch = () => {
    const el = document.getElementById("villas-carousel");
    if (el) {
      const y =
        el.getBoundingClientRect().top + window.scrollY - NAVBAR_HEIGHT - 20;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <section id="villas-carousel" className="relative bg-[#1A1C1E]">
      {/* STICKY FILTERS BAR */}
      <div
        className="sticky z-30 bg-[#1A1C1E]/95 backdrop-blur-md border-b border-white/8 transition-all duration-300 ease-in-out"
        style={{ top: navbarVisible ? `${NAVBAR_HEIGHT}px` : "0px" }}
      >
        <div className="max-w-[1920px] mx-auto px-2 md:px-8 lg:px-16 pt-3 md:pt-6 pb-3">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start gap-3 md:gap-6">
            {/* SEARCH BAR - Left Side on Desktop */}
            <div className="order-1 lg:order-1 w-full lg:w-auto flex justify-start">
              <BookingBanner onSearch={handleSearch} />
            </div>

            {/* CATEGORIES - Right Side on Desktop (Scrollable, edge-to-edge) */}
            <div className="order-2 lg:order-2 flex-1 min-w-0 flex overflow-x-auto items-center gap-2 md:gap-3 pb-1 -mr-2 md:-mr-8 lg:-mr-16 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`whitespace-nowrap flex-shrink-0 px-4 py-2 text-gh-label font-manrope font-medium transition-all duration-300 ${
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
      {hasDateConflict ? (
        /* ── No Results UI — full viewport height ── */
        <div className="flex flex-col items-center justify-center h-[100svh] text-center gap-6 px-6">
          <div className="w-40 h-40 md:w-52 md:h-52 opacity-40">
            <svg
              viewBox="0 0 200 200"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <ellipse
                cx="100"
                cy="115"
                rx="60"
                ry="30"
                fill="#888"
                opacity="0.3"
              />
              <circle
                cx="85"
                cy="80"
                r="40"
                stroke="#aaa"
                strokeWidth="5"
                fill="#444"
                fillOpacity="0.4"
              />
              <line
                x1="118"
                y1="113"
                x2="155"
                y2="150"
                stroke="#aaa"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <circle cx="74" cy="68" r="10" fill="#666" fillOpacity="0.5" />
              <rect
                x="140"
                y="40"
                width="22"
                height="16"
                rx="2"
                stroke="#aaa"
                strokeWidth="2"
                fill="none"
                opacity="0.5"
              />
              <polyline
                points="140,40 151,50 162,40"
                stroke="#aaa"
                strokeWidth="2"
                opacity="0.5"
              />
              <circle
                cx="148"
                cy="95"
                r="5"
                stroke="#aaa"
                strokeWidth="2"
                fill="none"
                opacity="0.5"
              />
              <line
                x1="148"
                y1="100"
                x2="148"
                y2="108"
                stroke="#aaa"
                strokeWidth="2"
                opacity="0.5"
              />
            </svg>
          </div>
          <p className="text-white/40 text-gh-desc font-manrope tracking-wide">
            No matching search results
          </p>
          <h2 className="text-white text-gh-h2 font-philosopher leading-tight">
            Next Available Dates:
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {NEXT_AVAILABLE.map((d) => (
              <button
                key={d.label}
                onClick={() => setDateRange({ checkIn: null, checkOut: null })}
                className="border border-white/25 text-white text-gh-desc font-manrope px-5 py-2.5 rounded-[2px] hover:bg-white/10 transition-colors"
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="text-white/30 text-gh-label font-manrope">or</p>
          <PrimaryButton
            withArrow={false}
            onClick={() => {
              setDateRange({ checkIn: null, checkOut: null });
              setActiveCategory("All");
            }}
          >
            CLEAR ALL FILTERS
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </PrimaryButton>
        </div>
      ) : (
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 lg:px-16 w-full mt-12 pb-10 min-h-screen">
          {filteredVillas.length > 0 ? (
            <div className="flex flex-col">
              {filteredVillas.map((villa, index) => (
                <div key={villa.id}>
                  <VillaCard villa={villa} />
                  {index < filteredVillas.length - 1 && (
                    <hr className="border-0 border-t border-white/10 my-12" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[50vh] text-center">
              <span className="text-white/40 font-manrope text-gh-body">
                No villas found for &quot;{activeCategory}&quot;.
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
      )}

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

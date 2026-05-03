"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import {
  X,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Bed,
  Home,
  Check,
  Headset,
} from "lucide-react";
import { useAnimation } from "@/context/AnimationContext";
import { VILLAS, CATEGORIES } from "@/lib/mockData";
import { getVillaGoogleMapsUrl } from "@/lib/googleMapsLinks";
import { isBookingDetailsValid } from "@/lib/bookingDetailsValidation";
import type { UserDetails } from "@/lib/types";
import BookingDetailsFormFields from "@/components/booking/BookingDetailsFormFields";

/* ─────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────── */
type Step = "dates" | "guests" | "villas" | "details" | "review";

interface DateRange {
  checkIn: { month: number; day: number } | null;
  checkOut: { month: number; day: number } | null;
}

interface Guests {
  adults: number;
  children: number;
  pets: number;
}

/* ─────────────────────────────────────────────────────────────────────
   Data
───────────────────────────────────────────────────────────────────── */
const MONTHS = [
  {
    name: "January 2026",
    year: 2026,
    month: 0,
    days: 31,
    startDay: 3 /* Thursday */,
  },
  {
    name: "February 2026",
    year: 2026,
    month: 1,
    days: 28,
    startDay: 0 /* Sunday */,
  },
  {
    name: "March 2026",
    year: 2026,
    month: 2,
    days: 31,
    startDay: 0 /* Sunday */,
  },
];

const UNAVAILABLE: Record<string, number[]> = {
  "January 2026": [7, 8, 9],
  "February 2026": [7, 8, 9, 10],
  "March 2026": [],
};

const ADD_ONS = [
  { id: "bonfire", label: "Bonfire Setup", price: 99000 },
  { id: "bbq", label: "Private BBQ Experience", price: 99000 },
  { id: "movie", label: "Movie Under the Stars", price: 99000 },
  { id: "candle", label: "Candle-Lit Dinner", price: 99000 },
  { id: "dj", label: "DJ & Sound Setup", price: 99000 },
  { id: "wellness", label: "Guided Wellness Session", price: 99000 },
  { id: "culinary", label: "Culinary Experience", price: 0 }, // Price on request
];

const BASE_PRICE = 99000;
const NIGHT_TAX = 99000;

/* ─────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────── */
function formatDate(d: { month: number; day: number } | null): string {
  if (!d) return "---";
  const MONTH_SHORT = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${d.day} ${MONTH_SHORT[d.month]}`;
}

function formatRupees(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function StepDots({ step, total = 5 }: { step: Step; total?: number }) {
  const steps5: Step[] = ["dates", "guests", "villas", "details", "review"];
  const steps4: Step[] = ["dates", "guests", "details", "review"];
  const steps = total === 4 ? steps4 : steps5;
  const currentIdx = steps.indexOf(step);

  return (
    <div className="flex w-full gap-1">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`flex-1 h-[2px] transition-all duration-400 ${
            i <= currentIdx ? "bg-[#EFCD62]" : "bg-white/20"
          }`}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Step 1: Select Dates
───────────────────────────────────────────────────────────────────── */
function StepDates({
  dateRange,
  setDateRange,
  onNext,
  onClose,
  onReset,
  currentStep,
  stepTotal,
}: {
  dateRange: DateRange;
  setDateRange: (d: DateRange) => void;
  onNext: () => void;
  onClose: () => void;
  onReset: () => void;
  currentStep: Step;
  stepTotal: number;
}) {
  const handleDayClick = (monthIdx: number, day: number) => {
    const clicked = { month: MONTHS[monthIdx].month, day };
    const { checkIn, checkOut } = dateRange;

    if (!checkIn || (checkIn && checkOut)) {
      setDateRange({ checkIn: clicked, checkOut: null });
    } else {
      // Determine order
      const ci = checkIn.month * 31 + checkIn.day;
      const cl = clicked.month * 31 + clicked.day;
      if (cl <= ci) {
        setDateRange({ checkIn: clicked, checkOut: null });
      } else {
        setDateRange({ checkIn, checkOut: clicked });
      }
    }
  };

  const isInRange = (monthIdx: number, day: number) => {
    const m = MONTHS[monthIdx].month;
    const { checkIn, checkOut } = dateRange;
    if (!checkIn || !checkOut) return false;
    const d = m * 31 + day;
    const ci = checkIn.month * 31 + checkIn.day;
    const co = checkOut.month * 31 + checkOut.day;
    return d > ci && d < co;
  };

  const isSelected = (monthIdx: number, day: number) => {
    const m = MONTHS[monthIdx].month;
    const { checkIn, checkOut } = dateRange;
    if (checkIn && checkIn.month === m && checkIn.day === day) return "start";
    if (checkOut && checkOut.month === m && checkOut.day === day) return "end";
    return false;
  };

  const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

  return (
    <div className="flex flex-col h-full">
      {/* Header Area (Title & Actions) */}
      <div className="bg-[#0D4032] shrink-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <h2 className="text-white text-gh-h1 font-philosopher leading-none">
            Select Dates
          </h2>
          <div className="flex items-center gap-5 md:gap-6">
            <button
              onClick={onReset}
              className="text-[#EFCD62] text-gh-label font-manrope font-bold tracking-widest uppercase hover:text-white transition-colors"
            >
              RESET
            </button>
            <a
              href="tel:08970663366"
              className="text-white hover:text-[#EFCD62] transition-colors"
            >
              <Headset className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
            </a>
            <button
              onClick={onClose}
              className="text-white hover:text-[#EFCD62] transition-colors"
            >
              <X className="w-7 h-7 md:w-8 md:h-8" strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex justify-center md:justify-start items-center gap-6 md:gap-10 px-6 py-5 text-gh-label text-[#A6C0B5] font-manrope font-medium">
          <span className="flex items-center gap-3">
            <span className="w-6 h-6 bg-[#165040] rounded-[2px]" />
            Available
          </span>
          <span className="flex items-center gap-3 relative">
            <span className="w-6 h-6 bg-[#165040] rounded-[2px] overflow-hidden relative border border-[#165040]">
              <span className="block w-[150%] h-[1.5px] bg-[#A6C0B5]/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
            </span>
            Unavailable
          </span>
          <span className="flex items-center gap-3">
            <span className="w-6 h-6 bg-[#EFCD62] rounded-[2px]" />
            Selected
          </span>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 text-center px-5 mb-1 shrink-0">
        {DAY_LABELS.map((d) => (
          <span
            key={d}
            className="text-white/40 text-gh-label font-manrope tracking-wider"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Calendars */}
      <div className="flex-1 overflow-y-auto px-5 pb-4" data-lenis-prevent>
        {MONTHS.map((month, mIdx) => (
          <div key={month.name} className="mb-6">
            <h3 className="text-white font-manrope font-semibold text-gh-body mb-3">
              {month.name}
            </h3>
            <div className="grid grid-cols-7 gap-y-1.5 text-center">
              {Array.from({ length: month.startDay }, (_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: month.days }, (_, i) => i + 1).map(
                (day) => {
                  const unavail = UNAVAILABLE[month.name]?.includes(day);
                  const sel = isSelected(mIdx, day);
                  const inRange = isInRange(mIdx, day);
                  return (
                    <button
                      key={day}
                      disabled={unavail}
                      onClick={() => !unavail && handleDayClick(mIdx, day)}
                      className={`w-9 h-9 mx-auto flex items-center justify-center text-gh-body font-manrope transition-colors rounded-sm relative
                      ${sel ? "bg-[#EFCD62] text-[#0D4032] font-bold" : ""}
                      ${inRange ? "bg-[#EFCD62]/20 text-white" : ""}
                      ${!sel && !inRange && !unavail ? "text-white hover:bg-white/10" : ""}
                      ${unavail ? "text-white/20 cursor-not-allowed" : ""}
                    `}
                    >
                      {unavail && (
                        <span className="absolute inset-0 flex items-center justify-center overflow-hidden">
                          <span className="block w-[141%] h-[1px] bg-white/20 -rotate-45 origin-center" />
                        </span>
                      )}
                      {day}
                    </button>
                  );
                },
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="shrink-0">
        <div className="px-5 pt-3 pb-1">
          <StepDots step={currentStep} total={stepTotal} />
        </div>
        <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between">
          <div className="text-white/60 text-gh-body font-manrope">
            <span>{formatDate(dateRange.checkIn)}</span>
            <span className="mx-2 text-white/30">to</span>
            <span>{formatDate(dateRange.checkOut)}</span>
          </div>
          <button
            disabled={!dateRange.checkIn || !dateRange.checkOut}
            onClick={onNext}
            className={`px-8 py-2.5 text-gh-label font-bold tracking-widest uppercase transition-all font-manrope ${
              dateRange.checkIn && dateRange.checkOut
                ? "bg-[#EFCD62] text-[#0D4032] hover:bg-white"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Step 2: Total Guests
───────────────────────────────────────────────────────────────────── */
function StepGuests({
  guests,
  setGuests,
  dateRange,
  onNext,
  onBack,
  onClose,
  onReset,
  currentStep,
  stepTotal,
}: {
  guests: Guests;
  setGuests: (g: Guests) => void;
  dateRange: DateRange;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  onReset: () => void;
  currentStep: Step;
  stepTotal: number;
}) {
  const update = (key: keyof Guests, val: number) =>
    setGuests({ ...guests, [key]: Math.max(0, val) });

  const totalGuests = guests.adults + guests.children;

  const Counter = ({
    label,
    subtitle,
    value,
    onMinus,
    onPlus,
  }: {
    label: string;
    subtitle?: string;
    value: number;
    onMinus: () => void;
    onPlus: () => void;
  }) => (
    <div className="flex items-center justify-between py-5 border-b border-white/8">
      <div>
        <p className="text-white font-philosopher text-gh-body">{label}</p>
        {subtitle && (
          <p className="text-white/40 text-gh-label font-manrope mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={onMinus}
          className="w-9 h-9 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-white font-philosopher text-gh-scroll w-8 text-center">
          {String(value).padStart(2, "0")}
        </span>
        <button
          onClick={onPlus}
          className="w-9 h-9 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors bg-white/5"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <h2 className="text-white text-gh-h2 font-philosopher">Total Guests</h2>
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="text-[#EFCD62] text-gh-label font-bold tracking-widest uppercase hover:text-white transition-colors"
          >
            RESET
          </button>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Counters */}
      <div className="flex-1 overflow-y-auto px-5" data-lenis-prevent>
        <Counter
          label="Adults"
          subtitle="Age 13 years and more"
          value={guests.adults}
          onMinus={() => update("adults", guests.adults - 1)}
          onPlus={() => update("adults", guests.adults + 1)}
        />
        <Counter
          label="Children"
          subtitle="Age 3 - 12 years"
          value={guests.children}
          onMinus={() => update("children", guests.children - 1)}
          onPlus={() => update("children", guests.children + 1)}
        />
        <Counter
          label="Pets"
          value={guests.pets}
          onMinus={() => update("pets", guests.pets - 1)}
          onPlus={() => update("pets", guests.pets + 1)}
        />
      </div>

      {/* Footer */}
      <div className="shrink-0">
        <div className="px-5 pt-3 pb-1">
          <StepDots step={currentStep} total={stepTotal} />
        </div>
        <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between">
          <span className="text-white/60 text-gh-body font-manrope">
            {totalGuests > 0
              ? `${guests.adults} Guest${guests.adults !== 1 ? "s" : ""}${guests.children > 0 ? `, ${guests.children} Children` : ""}`
              : "-- --"}
          </span>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-5 py-2.5 text-gh-label font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors font-manrope"
            >
              BACK
            </button>
            <button
              disabled={guests.adults === 0}
              onClick={onNext}
              className={`px-8 py-2.5 text-gh-label font-bold tracking-widest uppercase transition-all font-manrope ${
                guests.adults > 0
                  ? "bg-[#EFCD62] text-[#0D4032] hover:bg-white"
                  : "bg-white/10 text-white/30 cursor-not-allowed"
              }`}
            >
              APPLY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Step 3: Select Villa
───────────────────────────────────────────────────────────────────── */
function StepVillas({
  selectedVillaId,
  setSelectedVillaId,
  guests,
  dateRange,
  onNext,
  onBack,
  onClose,
  currentStep,
  stepTotal,
}: {
  selectedVillaId: string | null;
  setSelectedVillaId: (id: string) => void;
  guests: Guests;
  dateRange: DateRange;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  currentStep: Step;
  stepTotal: number;
}) {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = useMemo(
    () =>
      activeFilter === "All"
        ? VILLAS
        : VILLAS.filter((v) =>
            v.categories?.some(
              (c: string) => c.toLowerCase() === activeFilter.toLowerCase(),
            ),
          ),
    [activeFilter],
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <div>
          <h2 className="text-white text-gh-h2 font-philosopher">
            Select a Villa
          </h2>
          <p className="text-white/40 text-gh-label font-manrope mt-0.5">
            {formatDate(dateRange.checkIn)} → {formatDate(dateRange.checkOut)} ·{" "}
            {guests.adults} Guests
          </p>
        </div>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Filter chips — edge-to-edge scroll */}
      <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide shrink-0">
        <div className="shrink-0 w-3" aria-hidden="true" />
        {CATEGORIES.map((f) => {
          const count =
            f === "All"
              ? VILLAS.length
              : VILLAS.filter((v) =>
                  v.categories?.some(
                    (c: string) => c.toLowerCase() === f.toLowerCase(),
                  ),
                ).length;
          return (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-4 py-1.5 text-gh-label font-manrope font-semibold tracking-wide rounded-sm transition-all flex items-center gap-2 border ${
                activeFilter === f
                  ? "bg-[#EFCD62] text-[#0D4032] border-[#EFCD62]"
                  : "bg-white/5 text-white/60 hover:bg-white/10 border-white/10"
              }`}
            >
              {f}
              <span
                className={`text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full ${
                  activeFilter === f
                    ? "bg-[#0D4032]/20 text-[#0D4032]"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
        {/* no trailing spacer — chips touch right edge */}
      </div>

      {/* Villa cards */}
      <div
        className="flex-1 overflow-y-auto px-5 pb-4 space-y-5"
        data-lenis-prevent
      >
        {filtered.map((villa) => (
          <div
            key={villa.id}
            onClick={() => setSelectedVillaId(villa.id)}
            className={`rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
              selectedVillaId === villa.id
                ? "border-[#EFCD62]"
                : "border-transparent"
            }`}
          >
            {/* Image */}
            <div className="relative w-full h-44">
              <Image
                src={villa.image}
                alt={villa.name}
                fill
                className="object-cover"
              />
              {selectedVillaId === villa.id && (
                <div className="absolute top-3 right-3 w-7 h-7 bg-[#EFCD62] rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-[#0D4032]" strokeWidth={3} />
                </div>
              )}
              <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-2 py-1 text-white text-gh-label font-manrope font-semibold tracking-widest uppercase">
                {villa.type}
              </div>
            </div>

            {/* Info */}
            <div className="bg-[#0a3527] p-4">
              <h3 className="text-white font-philosopher text-gh-h3 mb-1">
                {villa.name}
              </h3>
              <a
                href={getVillaGoogleMapsUrl(villa)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-white/50 text-gh-label font-manrope mb-2 w-fit rounded-sm outline-none hover:text-[#EFCD62] transition-colors focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
              >
                <MapPin className="w-3 h-3 shrink-0" />
                <span className="hover:underline underline-offset-2">{villa.location}</span>
              </a>
              <p className="text-white/60 text-gh-body font-manrope line-clamp-2 mb-3">
                {villa.description}
              </p>
              <div className="flex flex-wrap gap-3 text-white/50 text-gh-label font-manrope">
                {villa.stats.stay && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {villa.stats.stay} Stay
                  </span>
                )}
                {villa.stats.events && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {villa.stats.events} Events
                  </span>
                )}
                {villa.stats.bhk && (
                  <span className="flex items-center gap-1">
                    <Bed className="w-3 h-3" /> {villa.stats.bhk}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <div>
                  <p className="text-white/40 text-gh-label font-manrope">
                    Starting from
                  </p>
                  <p className="text-[#EFCD62] font-philosopher text-gh-body">
                    {formatRupees(
                      villa.pricing?.stay?.packages?.[0]?.price?.replace(
                        /[^0-9]/g,
                        "",
                      )
                        ? parseInt(
                            villa.pricing.stay.packages[0].price.replace(
                              /[^0-9]/g,
                              "",
                            ),
                          )
                        : BASE_PRICE,
                    )}
                  </p>
                </div>
                <PrimaryButton
                  withArrow={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVillaId(villa.id);
                    onNext();
                  }}
                >
                  BOOK VILLA
                </PrimaryButton>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="shrink-0">
        <div className="px-5 pt-3 pb-1">
          <StepDots step={currentStep} total={stepTotal} />
        </div>
        <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-gh-body font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors font-manrope"
          >
            BACK
          </button>
          <button
            disabled={!selectedVillaId}
            onClick={onNext}
            className={`px-8 py-2.5 text-gh-label font-bold tracking-widest uppercase transition-all font-manrope ${
              selectedVillaId
                ? "bg-[#EFCD62] text-[#0D4032] hover:bg-white"
                : "bg-white/10 text-white/30 cursor-not-allowed"
            }`}
          >
            NEXT
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Step 4: Your Details
───────────────────────────────────────────────────────────────────── */
function StepDetails({
  details,
  setDetails,
  selectedVilla,
  onNext,
  onBack,
  onClose,
  currentStep,
  stepTotal,
}: {
  details: UserDetails;
  setDetails: (d: UserDetails) => void;
  selectedVilla: (typeof VILLAS)[0] | undefined;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  currentStep: Step;
  stepTotal: number;
}) {
  const [forceShowErrors, setForceShowErrors] = useState(false);

  const basePrice = selectedVilla
    ? parseInt(
        (selectedVilla.pricing?.stay?.packages?.[0]?.price ?? "").replace(
          /[^0-9]/g,
          "",
        ) || String(BASE_PRICE),
      )
    : BASE_PRICE;

  const canProceed = isBookingDetailsValid(details);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <h2 className="text-white text-gh-h2 font-philosopher">Your Details</h2>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Form */}
      <div
        className="flex-1 overflow-y-auto px-5 py-5"
        data-lenis-prevent
      >
        <BookingDetailsFormFields
          details={details}
          setDetails={setDetails}
          forceShowErrors={forceShowErrors}
          idPrefix="gbo"
        />

        <p className="text-[11px] text-white/30 pt-3 text-center font-manrope">
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
      </div>

      {/* Footer */}
      <div className="shrink-0">
        <div className="px-5 pt-3 pb-1">
          <StepDots step={currentStep} />
        </div>
        <div className="px-5 py-4 border-t border-white/10 flex flex-col gap-2">
          <p className="text-white/35 text-[10px] font-manrope">
            Name, phone, and email are checked before you can continue. Tap Apply
            to see what needs fixing.
          </p>
          <div className="flex items-center justify-between">
            <span className="text-[#EFCD62] font-manrope text-gh-label font-bold">
              {formatRupees(basePrice)} onwards
            </span>
            <div className="flex gap-3">
              <button
                onClick={onBack}
                className="px-5 py-2.5 text-gh-label font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors font-manrope"
              >
                BACK
              </button>
              <button
                onClick={() => {
                  if (!canProceed) {
                    setForceShowErrors(true);
                    return;
                  }
                  setForceShowErrors(false);
                  onNext();
                }}
                className={`px-8 py-2.5 text-gh-label font-bold tracking-widest uppercase transition-all font-manrope ${
                  canProceed
                    ? "bg-[#EFCD62] text-[#0D4032] hover:bg-white"
                    : "bg-white/10 text-white/30 cursor-pointer"
                }`}
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Step 5: Review & Pay
───────────────────────────────────────────────────────────────────── */
function StepReview({
  dateRange,
  guests,
  details,
  selectedVilla,
  onBack,
  onClose,
  goToStep,
  currentStep,
  stepTotal,
}: {
  dateRange: DateRange;
  guests: Guests;
  details: UserDetails;
  selectedVilla: (typeof VILLAS)[0] | undefined;
  onBack: () => void;
  onClose: () => void;
  goToStep: (s: Step) => void;
  currentStep: Step;
  stepTotal: number;
}) {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  const toggleAddOn = (id: string) =>
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );

  const basePrice = selectedVilla
    ? parseInt(
        (selectedVilla.pricing?.stay?.packages?.[0]?.price ?? "").replace(
          /[^0-9]/g,
          "",
        ) || String(BASE_PRICE),
      )
    : BASE_PRICE;

  const addOnTotal = selectedAddOns.reduce((sum, id) => {
    const item = ADD_ONS.find((a) => a.id === id);
    return sum + (item?.price ?? 0);
  }, 0);

  const total = basePrice + addOnTotal + NIGHT_TAX;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 shrink-0">
        <h2 className="text-white text-gh-h2 font-philosopher">Review & Pay</h2>
        <button
          onClick={onClose}
          className="text-white/50 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div
        className="flex-1 overflow-y-auto px-5 py-4 space-y-5"
        data-lenis-prevent
      >
        {/* Villa preview */}
        {selectedVilla && (
          <div className="flex gap-4 bg-white/5 rounded-lg p-3">
            <div className="relative w-20 h-20 rounded-md overflow-hidden shrink-0">
              <Image
                src={selectedVilla.image}
                alt={selectedVilla.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-[#EFCD62] text-gh-label font-manrope font-bold tracking-widest uppercase mb-1">
                {selectedVilla.type}
              </p>
              <h3 className="text-white font-philosopher text-gh-body mb-2">
                {selectedVilla.name}
              </h3>
              <div className="flex flex-col gap-1 text-white/50 text-gh-label font-manrope">
                <a
                  href={getVillaGoogleMapsUrl(selectedVilla)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-sm outline-none transition-colors hover:text-[#EFCD62] focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
                >
                  <MapPin className="w-3 h-3 shrink-0" />{" "}
                  <span className="hover:underline underline-offset-2">
                    {selectedVilla.location}
                  </span>
                </a>
                {selectedVilla.stats.stay && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {selectedVilla.stats.stay}{" "}
                    Stay
                  </span>
                )}
                {selectedVilla.stats.events && (
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3" /> {selectedVilla.stats.events}{" "}
                    Events
                  </span>
                )}
                {selectedVilla.stats.bhk && (
                  <span className="flex items-center gap-1">
                    <Home className="w-3 h-3" /> {selectedVilla.stats.bhk}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dates */}
        <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-gh-label font-manrope font-bold tracking-widest uppercase mb-1">
              Dates
            </p>
            <p className="text-white font-manrope text-gh-body">
              {formatDate(dateRange.checkIn)} - {formatDate(dateRange.checkOut)}
            </p>
          </div>
          <button
            onClick={() => goToStep("dates")}
            className="text-gh-label font-bold tracking-widest text-white/50 hover:text-[#EFCD62] uppercase border border-white/20 px-3 py-1.5 transition-colors font-manrope"
          >
            EDIT
          </button>
        </div>

        {/* Guests */}
        <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-gh-label font-manrope font-bold tracking-widest uppercase mb-1">
              Total Guests
            </p>
            <p className="text-white font-manrope text-gh-body">
              {guests.adults} Guests
              {guests.children > 0 ? `, ${guests.children} Children` : ""}
              {guests.pets > 0
                ? `, ${guests.pets} Pet${guests.pets > 1 ? "s" : ""}`
                : ""}
            </p>
          </div>
          <button
            onClick={() => goToStep("guests")}
            className="text-gh-label font-bold tracking-widest text-white/50 hover:text-[#EFCD62] uppercase border border-white/20 px-3 py-1.5 transition-colors font-manrope"
          >
            EDIT
          </button>
        </div>

        {/* Details */}
        <div className="bg-white/5 rounded-lg p-4 flex items-start justify-between">
          <div>
            <p className="text-white/40 text-gh-label font-manrope font-bold tracking-widest uppercase mb-1">
              Your Details
            </p>
            <ul className="text-white/70 text-gh-body font-manrope space-y-0.5">
              <li>• Name: {details.fullName}</li>
              <li>• Number: {details.phone}</li>
              <li>• Email: {details.email}</li>
              {details.notes && (
                <li>
                  • Note: {details.notes.slice(0, 40)}
                  {details.notes.length > 40 ? "..." : ""}
                </li>
              )}
            </ul>
          </div>
          <button
            onClick={() => goToStep("details")}
            className="text-gh-label font-bold tracking-widest text-white/50 hover:text-[#EFCD62] uppercase border border-white/20 px-3 py-1.5 transition-colors font-manrope shrink-0 ml-2"
          >
            EDIT
          </button>
        </div>

        {/* Add-ons */}
        <div>
          <h4 className="text-white font-philosopher text-gh-body mb-2">
            Add On Experiences
          </h4>
          <p className="text-white/40 text-gh-label font-manrope mb-3">
            Optional experiences available at an additional cost. Pricing is
            subject to confirmation based on group size.
          </p>
          <div className="space-y-2">
            {ADD_ONS.map((addon) => (
              <label
                key={addon.id}
                className="flex items-center justify-between gap-3 py-2 cursor-pointer group"
                onClick={() => toggleAddOn(addon.id)}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${
                      selectedAddOns.includes(addon.id)
                        ? "bg-[#EFCD62] border-[#EFCD62]"
                        : "border-white/30 group-hover:border-white/60"
                    }`}
                  >
                    {selectedAddOns.includes(addon.id) && (
                      <Check
                        className="w-3 h-3 text-[#0D4032]"
                        strokeWidth={3}
                      />
                    )}
                  </div>
                  <span className="text-white/80 text-gh-body font-manrope">
                    {addon.label}
                  </span>
                </div>
                <span className="text-white/60 text-gh-body font-manrope shrink-0">
                  {addon.price > 0
                    ? formatRupees(addon.price)
                    : "Price on request"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price details */}
        <div className="border border-white/10 rounded-lg p-4 space-y-2">
          <h4 className="text-white font-philosopher text-gh-body mb-3">
            Price Details
          </h4>
          <div className="flex items-center justify-between text-gh-body font-manrope">
            <span className="text-white/60 text-gh-desc">
              1 Night × {formatRupees(basePrice)}
            </span>
            <span className="text-white text-gh-desc">
              {formatRupees(basePrice)}
            </span>
          </div>
          {addOnTotal > 0 && (
            <div className="flex items-center justify-between text-gh-body font-manrope">
              <span className="text-white/60 text-gh-desc">
                Add On Experiences
              </span>
              <span className="text-white text-gh-desc">
                {formatRupees(addOnTotal)}
              </span>
            </div>
          )}
          <div className="flex items-center justify-between text-gh-body font-manrope">
            <span className="text-white/60 text-gh-desc">Taxes</span>
            <span className="text-white text-gh-desc">
              {formatRupees(NIGHT_TAX)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-white/30 text-gh-label font-manrope mt-1">
            <Link
              href="/privacy-policy"
              className="underline cursor-pointer hover:text-white/60 transition-colors"
              onClick={onClose}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms-conditions"
              className="underline cursor-pointer hover:text-white/60 transition-colors"
              onClick={onClose}
            >
              Terms
            </Link>
            <Link
              href="/refund-policy"
              className="underline cursor-pointer hover:text-white/60 transition-colors"
              onClick={onClose}
            >
              Refunds
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0">
        <div className="px-5 pt-3 pb-1">
          <StepDots step={currentStep} total={stepTotal} />
        </div>
        <div className="px-5 py-4 border-t border-white/10 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-gh-label font-manrope uppercase tracking-widest">
              Total Price:
            </p>
            <p className="text-white font-philosopher text-gh-label font-bold">
              {formatRupees(total)}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="px-5 py-2.5 text-gh-label font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors font-manrope"
            >
              BACK
            </button>
            <PrimaryButton withArrow={false}>PAY NOW</PrimaryButton>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Main GlobalBookingOverlay
───────────────────────────────────────────────────────────────────── */
export default function GlobalBookingOverlay() {
  const { isGlobalBookingOpen, setGlobalBookingOpen, villaBookingId } =
    useAnimation();

  // When villaBookingId is set, skip the villa selection step
  const isVillaPreSelected = !!villaBookingId;

  const [step, setStep] = useState<Step>("dates");
  const [dateRange, setDateRange] = useState<DateRange>({
    checkIn: null,
    checkOut: null,
  });
  const [guests, setGuests] = useState<Guests>({
    adults: 0,
    children: 0,
    pets: 0,
  });
  const [selectedVillaId, setSelectedVillaId] = useState<string | null>(null);
  const [details, setDetails] = useState<UserDetails>({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });

  // Sync pre-selected villa from context
  useEffect(() => {
    if (villaBookingId) {
      setSelectedVillaId(villaBookingId);
    }
  }, [villaBookingId]);

  const selectedVilla = VILLAS.find((v) => v.id === selectedVillaId);

  const handleClose = () => {
    setGlobalBookingOpen(false);
    setTimeout(() => {
      setStep("dates");
      setDateRange({ checkIn: null, checkOut: null });
      setGuests({ adults: 0, children: 0, pets: 0 });
      // Only reset villa if it was manually chosen (not pre-selected)
      if (!villaBookingId) setSelectedVillaId(null);
      setDetails({ fullName: "", phone: "", email: "", notes: "" });
    }, 400);
  };

  const handleReset = () => {
    setStep("dates");
    setDateRange({ checkIn: null, checkOut: null });
    setGuests({ adults: 0, children: 0, pets: 0 });
    if (!villaBookingId) setSelectedVillaId(null);
    setDetails({ fullName: "", phone: "", email: "", notes: "" });
  };

  // Navigation helpers that skip villa step when pre-selected
  const goNextFromDates = () => setStep("guests");
  const goNextFromGuests = () =>
    isVillaPreSelected ? setStep("details") : setStep("villas");
  const goBackFromDetails = () =>
    isVillaPreSelected ? setStep("guests") : setStep("villas");

  return (
    <AnimatePresence>
      {isGlobalBookingOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm"
          />

          {/* Centering wrapper */}
          <div
            className="fixed inset-0 z-[201] flex flex-col items-center justify-end md:justify-center md:px-0"
            onWheel={(e) => e.stopPropagation()}
          >
            {/* Floating close button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={handleClose}
              className="w-12 h-12 mb-3 rounded-full bg-[#124131] flex items-center justify-center text-white hover:bg-[#1f5c48] transition-colors shadow-2xl flex-shrink-0 z-[202]"
            >
              <X className="w-6 h-6 stroke-[1.5]" />
            </motion.button>

            {/* Modal */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full md:w-[640px] h-[80vh] md:h-[82vh] md:max-h-[760px] bg-jade-green flex flex-col font-manrope rounded-t-2xl md:rounded-lg shadow-2xl border border-white/10 overflow-hidden"
            >
              {/* Step content */}
              <div
                className="flex-1 overflow-hidden flex flex-col min-h-0"
                data-lenis-prevent
              >
                <AnimatePresence mode="wait">
                  {step === "dates" && (
                    <motion.div
                      key="dates"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 overflow-hidden flex flex-col min-h-0"
                    >
                      <StepDates
                        dateRange={dateRange}
                        setDateRange={setDateRange}
                        onNext={goNextFromDates}
                        onClose={handleClose}
                        onReset={handleReset}
                        currentStep={step}
                        stepTotal={isVillaPreSelected ? 4 : 5}
                      />
                    </motion.div>
                  )}
                  {step === "guests" && (
                    <motion.div
                      key="guests"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 overflow-hidden flex flex-col min-h-0"
                    >
                      <StepGuests
                        guests={guests}
                        setGuests={setGuests}
                        dateRange={dateRange}
                        onNext={goNextFromGuests}
                        onBack={() => setStep("dates")}
                        onClose={handleClose}
                        onReset={handleReset}
                        currentStep={step}
                        stepTotal={isVillaPreSelected ? 4 : 5}
                      />
                    </motion.div>
                  )}
                  {step === "villas" && (
                    <motion.div
                      key="villas"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 overflow-hidden flex flex-col min-h-0"
                    >
                      <StepVillas
                        selectedVillaId={selectedVillaId}
                        setSelectedVillaId={setSelectedVillaId}
                        guests={guests}
                        dateRange={dateRange}
                        onNext={() => setStep("details")}
                        onBack={() => setStep("guests")}
                        onClose={handleClose}
                        currentStep={step}
                        stepTotal={5}
                      />
                    </motion.div>
                  )}
                  {step === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 overflow-hidden flex flex-col min-h-0"
                    >
                      <StepDetails
                        details={details}
                        setDetails={setDetails}
                        selectedVilla={selectedVilla}
                        onNext={() => setStep("review")}
                        onBack={goBackFromDetails}
                        onClose={handleClose}
                        currentStep={step}
                        stepTotal={isVillaPreSelected ? 4 : 5}
                      />
                    </motion.div>
                  )}
                  {step === "review" && (
                    <motion.div
                      key="review"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="flex-1 overflow-hidden flex flex-col min-h-0"
                    >
                      <StepReview
                        dateRange={dateRange}
                        guests={guests}
                        details={details}
                        selectedVilla={selectedVilla}
                        onBack={() => setStep("details")}
                        onClose={handleClose}
                        goToStep={setStep}
                        currentStep={step}
                        stepTotal={isVillaPreSelected ? 4 : 5}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

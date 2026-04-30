"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import PrimaryButton from "@/components/PrimaryButton";
import { useRouter, useSearchParams } from "next/navigation";
import {
  X,
  Minus,
  Plus,
  ChevronLeft,
  MapPin,
  Users,
  Bed,
  Home,
  Check,
  Headset,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { VILLAS } from "@/lib/mockData";
import { useBooking, DateRange, Guests } from "@/context/BookingContext";

/* ─────────────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────────────── */
type Step = "dates" | "guests" | "details" | "review";

interface UserDetails {
  fullName: string;
  phone: string;
  email: string;
  notes: string;
}

/* ─────────────────────────────────────────────────────────────────────
   Static data
───────────────────────────────────────────────────────────────────── */
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const ADD_ONS = [
  { id: "bonfire", label: "Bonfire Setup", price: 99000 },
  { id: "bbq", label: "Private BBQ Experience", price: 99000 },
  { id: "movie", label: "Movie Under the Stars", price: 99000 },
  { id: "candle", label: "Candle-Lit Dinner", price: 99000 },
  { id: "dj", label: "DJ & Sound Setup", price: 99000 },
  { id: "wellness", label: "Guided Wellness Session", price: 99000 },
  { id: "culinary", label: "Culinary Experience", price: 0 },
];

const NIGHT_TAX = 99000;

/* ─────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────── */
function generateMonths(count = 3) {
  const today = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const year = d.getFullYear();
    const month = d.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    // Convert JS Sunday=0 to Mon-first grid (0=Mon … 6=Sun)
    const startDay = (d.getDay() + 6) % 7;
    return {
      name: `${MONTH_NAMES[month]} ${year}`,
      year,
      month,
      days,
      startDay,
    };
  });
}

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function formatDate(d: { month: number; day: number } | null): string {
  if (!d) return "---";
  const SHORT = [
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
  return `${d.day} ${SHORT[d.month]}`;
}

function formatRupees(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

// Accept today's components as args so callers control when Date() is evaluated
function isPastDate(
  year: number,
  month: number,
  day: number,
  todayYear: number,
  todayMonth: number,
  todayDay: number,
) {
  if (year !== todayYear) return year < todayYear;
  if (month !== todayMonth) return month < todayMonth;
  return day < todayDay;
}

/* ─────────────────────────────────────────────────────────────────────
   Step progress dots
───────────────────────────────────────────────────────────────────── */
function StepDots({ step }: { step: Step }) {
  const steps: Step[] = ["dates", "guests", "details", "review"];
  const idx = steps.indexOf(step);
  return (
    <div className="flex w-full gap-1">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`flex-1 h-[2px] transition-all duration-400 ${i <= idx ? "bg-[#EFCD62]" : "bg-white/20"}`}
        />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Step 1: Select Dates (with live booked dates)
───────────────────────────────────────────────────────────────────── */
function StepDates({
  dateRange,
  setDateRange,
  villaId,
}: {
  dateRange: DateRange;
  setDateRange: (d: DateRange) => void;
  villaId: string | null;
}) {
  // `mounted` defers all Date-based logic to the client only, preventing
  // server/client HTML mismatches (hydration errors).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  // Compute months only on the client (after mount) to avoid hydration mismatch
  const MONTHS = mounted ? generateMonths(3) : [];
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [loadingMonths, setLoadingMonths] = useState<Set<string>>(new Set());

  // Fetch availability for each displayed month when villaId is known
  useEffect(() => {
    if (!villaId || !mounted) return;

    MONTHS.forEach(async ({ year, month }) => {
      const key = `${year}-${month}`;
      setLoadingMonths((prev) => new Set(prev).add(key));
      try {
        const res = await fetch(
          `/api/bookings/availability?villaId=${villaId}&year=${year}&month=${month}`,
        );
        if (!res.ok) return;
        const data: { bookedDates: string[] } = await res.json();
        setBookedDates((prev) => {
          const next = new Set(prev);
          data.bookedDates.forEach((d) => next.add(d));
          return next;
        });
      } finally {
        setLoadingMonths((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [villaId, mounted]);

  // Compute today's components once per render (always on client after mount)
  const todayRef = (() => {
    const t = new Date();
    return { y: t.getFullYear(), m: t.getMonth(), d: t.getDate() };
  })();

  const handleDayClick = (year: number, month: number, day: number) => {
    const iso = toISO(year, month, day);
    if (
      bookedDates.has(iso) ||
      isPastDate(year, month, day, todayRef.y, todayRef.m, todayRef.d)
    )
      return;

    const clicked = { month, day };
    const { checkIn, checkOut } = dateRange;

    if (!checkIn || (checkIn && checkOut)) {
      setDateRange({ checkIn: clicked, checkOut: null });
    } else {
      const ci = checkIn.month * 31 + checkIn.day;
      const cl = month * 31 + day;
      if (cl <= ci) setDateRange({ checkIn: clicked, checkOut: null });
      else setDateRange({ checkIn, checkOut: clicked });
    }
  };

  const isInRange = (year: number, month: number, day: number) => {
    const { checkIn, checkOut } = dateRange;
    if (!checkIn || !checkOut) return false;
    const d = month * 31 + day;
    return (
      d > checkIn.month * 31 + checkIn.day &&
      d < checkOut.month * 31 + checkOut.day
    );
  };

  const isSelected = (month: number, day: number) => {
    const { checkIn, checkOut } = dateRange;
    if (checkIn?.month === month && checkIn?.day === day) return "start";
    if (checkOut?.month === month && checkOut?.day === day) return "end";
    return false;
  };

  const DAY_LABELS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const isLoading = loadingMonths.size > 0;

  // Show a stable skeleton until client hydration is complete
  if (!mounted) {
    return (
      <div className="flex flex-col h-full">
        <div className="shrink-0 border-b border-white/10 py-3 px-5">
          <div className="grid grid-cols-7 text-center">
            {DAY_LABELS.map((d) => (
              <span
                key={d}
                className="text-white/50 text-gh-label font-manrope tracking-widest uppercase"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#EFCD62] animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Day headers */}
      <div className="shrink-0 border-b border-white/10 py-3 px-5">
        <div className="grid grid-cols-7 text-center">
          {DAY_LABELS.map((d) => (
            <span
              key={d}
              className="text-white/50 text-gh-label font-manrope tracking-widest uppercase"
            >
              {d}
            </span>
          ))}
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center gap-2 px-5 py-2 text-[#EFCD62] text-gh-label font-manrope">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Loading live availability…</span>
        </div>
      )}

      {/* Calendars */}
      <div
        className="flex-1 overflow-y-auto px-5 pb-24 pt-4"
        data-lenis-prevent
      >
        {MONTHS.map(({ name, year, month, days, startDay }) => (
          <div key={name} className="mb-8">
            <h3 className="text-white font-manrope font-bold text-gh-scroll mb-4">
              {name}
            </h3>
            <div className="grid grid-cols-7 gap-[12px] text-center">
              {Array.from({ length: startDay }, (_, i) => (
                <div key={`empty-${i}`} className="w-[35px] h-[35px]" />
              ))}
              {Array.from({ length: days }, (_, i) => i + 1).map((day) => {
                const iso = toISO(year, month, day);
                const booked = bookedDates.has(iso);
                const past = isPastDate(
                  year,
                  month,
                  day,
                  todayRef.y,
                  todayRef.m,
                  todayRef.d,
                );
                const unavail = booked || past;
                const sel = isSelected(month, day);
                const inRange = isInRange(year, month, day);

                return (
                  <button
                    key={day}
                    disabled={unavail}
                    onClick={() => handleDayClick(year, month, day)}
                    title={
                      booked ? "Already booked" : past ? "Past date" : undefined
                    }
                    className={`w-[35px] h-[35px] mx-auto flex items-center justify-center text-gh-body font-manrope transition-colors rounded-[3px] relative overflow-hidden
                      ${sel ? "bg-[#EFCD62] text-[#0D4032] font-bold" : ""}
                      ${inRange ? "bg-[#EFCD62]/20 text-white" : ""}
                      ${!sel && !inRange && !unavail ? "bg-[#165040] text-white hover:bg-[#1e6050]" : ""}
                      ${unavail ? "bg-[#165040]/50 text-white/25 cursor-not-allowed" : ""}`}
                  >
                    {unavail && (
                      <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="block w-[140%] h-[1px] bg-white/20 -rotate-45" />
                      </span>
                    )}
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
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
}: {
  guests: Guests;
  setGuests: (g: Guests) => void;
}) {
  const update = (key: keyof Guests, val: number) =>
    setGuests({ ...guests, [key]: Math.max(0, val) });

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
    <div className="flex items-center justify-between py-5 border-b border-white/10">
      <div>
        <p className="text-white font-philosopher text-gh-body">{label}</p>
        {subtitle && (
          <p className="text-white/40 text-gh-label font-manrope mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onMinus}
          className="w-9 h-9 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors shrink-0"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="text-white font-philosopher text-gh-h2 w-12 text-center leading-none">
          {String(value).padStart(2, "0")}
        </span>
        <button
          onClick={onPlus}
          className="w-9 h-9 border border-white/20 flex items-center justify-center text-white hover:bg-white/10 transition-colors bg-white/5 shrink-0"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 overflow-y-auto px-5 md:px-8 pb-28"
        data-lenis-prevent
      >
        <Counter
          label="Adults"
          subtitle="Age 13 years and more"
          value={guests.adults}
          onMinus={() => update("adults", guests.adults - 1)}
          onPlus={() => update("adults", guests.adults + 1)}
        />
        <Counter
          label="Children"
          subtitle="Age 3 – 12 years"
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
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Step 3: Your Details
───────────────────────────────────────────────────────────────────── */
function StepDetails({
  details,
  setDetails,
}: {
  details: UserDetails;
  setDetails: (d: UserDetails) => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div
        className="flex-1 overflow-y-auto px-5 md:px-8 py-4 pb-28 space-y-4"
        data-lenis-prevent
      >
        <div className="relative border border-white/20 focus-within:border-[#EFCD62] transition-colors">
          <label className="absolute -top-2.5 left-3 bg-[#0D4032] px-1 text-gh-label text-[#EFCD62] uppercase tracking-widest font-bold">
            Full Name
          </label>
          <input
            type="text"
            value={details.fullName}
            onChange={(e) =>
              setDetails({ ...details, fullName: e.target.value })
            }
            className="w-full bg-transparent px-4 py-3.5 text-white text-gh-body placeholder:text-white/30 focus:outline-none font-manrope"
          />
        </div>
        <input
          type="tel"
          placeholder="Phone Number*"
          value={details.phone}
          onChange={(e) => setDetails({ ...details, phone: e.target.value })}
          className="w-full bg-transparent border border-white/20 focus:border-[#EFCD62] px-4 py-3.5 text-white text-gh-body placeholder:text-white/40 focus:outline-none transition-colors font-manrope"
        />
        <input
          type="email"
          placeholder="Email*"
          value={details.email}
          onChange={(e) => setDetails({ ...details, email: e.target.value })}
          className="w-full bg-transparent border border-white/20 focus:border-[#EFCD62] px-4 py-3.5 text-white text-gh-body placeholder:text-white/40 focus:outline-none transition-colors font-manrope"
        />
        <textarea
          rows={4}
          placeholder="Additional requests or note to the host"
          value={details.notes}
          onChange={(e) => setDetails({ ...details, notes: e.target.value })}
          className="w-full bg-transparent border border-white/20 focus:border-[#EFCD62] px-4 py-3.5 text-white text-gh-body placeholder:text-white/40 focus:outline-none transition-colors resize-none font-manrope"
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Step 4: Review & Pay
───────────────────────────────────────────────────────────────────── */
function StepReview({
  dateRange,
  guests,
  details,
  selectedVilla,
  goToStep,
  selectedAddOns,
  setSelectedAddOns,
  basePrice,
}: {
  dateRange: DateRange;
  guests: Guests;
  details: UserDetails;
  selectedVilla: (typeof VILLAS)[0] | undefined;
  goToStep: (s: Step) => void;
  selectedAddOns: string[];
  setSelectedAddOns: React.Dispatch<React.SetStateAction<string[]>>;
  basePrice: number;
}) {
  const toggleAddOn = (id: string) =>
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );

  const addOnTotal = selectedAddOns.reduce(
    (sum, id) => sum + (ADD_ONS.find((a) => a.id === id)?.price ?? 0),
    0,
  );

  return (
    <div className="flex flex-col h-full bg-transparent">
      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 pb-40">
        {/* VILLA CARD */}
        {selectedVilla && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative w-full sm:w-32 h-48 sm:h-32 shrink-0 border border-white/20">
              <Image
                src={selectedVilla.image}
                alt={selectedVilla.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[#EFCD62] text-gh-label font-bold tracking-[0.15em] uppercase mb-1 mt-2 sm:mt-0">
                {selectedVilla.type}
              </p>
              <h3 className="text-white font-philosopher text-gh-h2 mb-3 leading-none">
                {selectedVilla.name}
              </h3>
              <div className="flex flex-col gap-1.5 text-white/80 text-gh-desc font-manrope">
                <span className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#EFCD62]" />{" "}
                  {selectedVilla.location}
                </span>
                {selectedVilla.stats.stay && (
                  <span className="flex items-center gap-2">
                    <Bed className="w-3.5 h-3.5 text-[#EFCD62]" />{" "}
                    {selectedVilla.stats.stay} Stay
                  </span>
                )}
                {selectedVilla.stats.bhk && (
                  <span className="flex items-center gap-2">
                    <Home className="w-3.5 h-3.5 text-[#EFCD62]" />{" "}
                    {selectedVilla.stats.bhk}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUMMARY BLOCKS */}
        <div className="space-y-4">
          <SummaryBlock
            label="Dates"
            value={`${formatDate(dateRange.checkIn)} – ${formatDate(dateRange.checkOut)}`}
            onEdit={() => goToStep("dates")}
          />
          <SummaryBlock
            label="Total Guests"
            value={`${guests.adults + guests.children} Guests${guests.children > 0 ? `, ${guests.children} Children` : ""}${guests.pets > 0 ? `, ${guests.pets} Pet${guests.pets > 1 ? "s" : ""}` : ""}`}
            onEdit={() => goToStep("guests")}
          />
          <div className="bg-white/5 p-4 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-white font-manrope font-bold text-gh-body mb-1">
                Your Details
              </p>
              <ul className="text-white/80 text-gh-desc font-manrope space-y-0.5 list-disc list-inside">
                <li>Name: {details.fullName}</li>
                <li>Number: {details.phone}</li>
                <li>Email: {details.email}</li>
                {details.notes && (
                  <li>
                    Note: {details.notes.slice(0, 40)}
                    {details.notes.length > 40 ? "…" : ""}
                  </li>
                )}
              </ul>
            </div>
            <button
              onClick={() => goToStep("details")}
              className="bg-[#1E4336] border border-white/20 px-4 py-2 text-gh-label font-bold tracking-widest text-white uppercase hover:bg-[#285848] transition-colors font-manrope shrink-0 ml-4"
            >
              EDIT
            </button>
          </div>
        </div>

        {/* ADD-ONS */}
        <div className="mt-8">
          <h4 className="text-white font-manrope font-bold text-gh-body mb-1">
            Add On Experiences
          </h4>
          <p className="text-white/70 text-gh-desc font-manrope mb-4">
            Optional experiences available at an additional cost.
            <br />
            Pricing is subject to confirmation based on group size.
          </p>
          <div className="space-y-3">
            {ADD_ONS.map((addon) => (
              <label
                key={addon.id}
                className="flex items-center justify-between py-1 cursor-pointer group"
                onClick={() => toggleAddOn(addon.id)}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-4 h-4 border flex items-center justify-center shrink-0 transition-colors ${selectedAddOns.includes(addon.id) ? "border-white bg-transparent" : "border-white/50 group-hover:border-white"}`}
                  >
                    {selectedAddOns.includes(addon.id) && (
                      <div className="w-2 h-2 bg-white" />
                    )}
                  </div>
                  <span className="text-white text-gh-desc font-manrope">
                    {addon.label}
                  </span>
                </div>
                <span className="text-white text-gh-desc font-manrope font-bold">
                  {addon.price > 0
                    ? formatRupees(addon.price)
                    : "Price on request"}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* PRICE DETAILS */}
        <div className="mt-8 border-t border-white/10 pt-6">
          <h4 className="text-white font-manrope font-bold text-gh-body mb-4">
            Price details
          </h4>
          <div className="space-y-2 text-gh-desc font-manrope">
            <div className="flex items-center justify-between text-white/90">
              <span className="text-white/80">
                1 Night × {formatRupees(basePrice)}
              </span>
              <span className="font-bold text-white">
                {formatRupees(basePrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-white/90">
              <span className="text-white/80">Add On Experiences</span>
              <span className="font-bold text-white">
                {formatRupees(addOnTotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-white/90">
              <span className="text-white/80">Taxes</span>
              <span className="font-bold text-white">
                {formatRupees(NIGHT_TAX)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-white/50 text-gh-label font-manrope mt-5">
            <span>Cancel within 24 hours for refund</span>
            <span>Full Policy</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryBlock({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string;
  onEdit: () => void;
}) {
  return (
    <div className="bg-white/5 p-4 flex items-start justify-between border border-transparent">
      <div className="flex flex-col gap-1">
        <p className="text-white font-manrope font-bold text-gh-body mb-1">
          {label}
        </p>
        <p className="text-white/80 font-manrope text-gh-desc">{value}</p>
      </div>
      <button
        onClick={onEdit}
        className="bg-[#1E4336] border border-white/20 px-4 py-2 text-gh-label font-bold tracking-widest text-white uppercase hover:bg-[#285848] transition-colors font-manrope"
      >
        EDIT
      </button>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Success screen
───────────────────────────────────────────────────────────────────── */
function SuccessScreen({
  bookingId,
  villaName,
  checkIn,
  checkOut,
  onClose,
}: {
  bookingId: string;
  villaName: string;
  checkIn: { month: number; day: number } | null;
  checkOut: { month: number; day: number } | null;
  onClose: () => void;
}) {
  return (
    <div className="h-[100svh] bg-[#0D4032] flex flex-col items-center justify-center px-6 text-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-col items-center max-w-sm"
      >
        <div className="w-20 h-20 rounded-full border-2 border-[#EFCD62] flex items-center justify-center mb-8">
          <CheckCircle2 className="w-10 h-10 text-[#EFCD62]" />
        </div>
        <h1 className="font-philosopher text-white text-gh-h1 mb-3">
          Booking Confirmed
        </h1>
        <p className="text-white/60 font-manrope text-gh-body mb-2">
          Your stay at <span className="text-white font-bold">{villaName}</span>{" "}
          is confirmed.
        </p>
        <p className="text-white/60 font-manrope text-gh-body mb-8">
          {formatDate(checkIn)} → {formatDate(checkOut)}
        </p>
        <div className="bg-white/5 border border-white/10 px-6 py-4 mb-8 w-full">
          <p className="text-white/40 text-gh-label font-manrope uppercase tracking-widest mb-1">
            Booking ID
          </p>
          <p className="text-[#EFCD62] font-manrope font-bold text-gh-body break-all">
            {bookingId.split("-")[0].toUpperCase()}
          </p>
        </div>
        <p className="text-white/50 text-gh-label font-manrope mb-8">
          We'll reach out on the phone/email you provided to confirm details.
        </p>
        <button
          onClick={onClose}
          className="w-full bg-[#EFCD62] text-[#0D4032] py-3.5 font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white transition-colors"
        >
          BACK TO HOME
        </button>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Main BookPage Content
───────────────────────────────────────────────────────────────────── */
function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const villaParam = searchParams?.get("villa") ?? null;
  const isVillaPreSelected = !!villaParam;

  const { dateRange, setDateRange, guests, setGuests, resetBooking } =
    useBooking();

  const stepParam = (searchParams?.get("step") ?? null) as Step | null;

  // Resolve the correct initial step.
  // NOTE: useState initializer runs on both server and client — keep it deterministic.
  // We cannot read BookingContext here for the initial value because the context state
  // starts as default on the server (no dates/guests), so doing so would cause a
  // hydration mismatch. Instead, we start at the URL-specified step (or "dates"),
  // and auto-advance in a useEffect after hydration.
  const getInitialStep = (): Step => {
    if (
      stepParam &&
      ["dates", "guests", "details", "review"].includes(stepParam)
    ) {
      return stepParam as Step;
    }
    return "dates";
  };

  const [step, setStep] = useState<Step>(getInitialStep);
  const [selectedVillaId, setSelectedVillaId] = useState<string | null>(
    villaParam,
  );
  const [details, setDetails] = useState<UserDetails>({
    fullName: "",
    phone: "",
    email: "",
    notes: "",
  });
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{ id: string } | null>(
    null,
  );

  useEffect(() => {
    if (villaParam) setSelectedVillaId(villaParam);
  }, [villaParam]);

  // After hydration: if villa is pre-selected and context already has dates + guests
  // (user came through the flow: /book → dates → guests → /villas → BOOK VILLA),
  // jump straight to details. Safe to do in useEffect (client-only).
  useEffect(() => {
    if (
      villaParam &&
      !stepParam &&
      dateRange.checkIn &&
      dateRange.checkOut &&
      guests.adults > 0 &&
      step === "dates"
    ) {
      setStep("details");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedVilla = VILLAS.find((v) => v.id === selectedVillaId);

  const basePrice = selectedVilla
    ? parseInt(
        (selectedVilla.pricing?.stay?.packages?.[0]?.price ?? "99000").replace(
          /[^0-9]/g,
          "",
        ),
      ) || 99000
    : 99000;

  const addOnTotal = selectedAddOns.reduce(
    (sum, id) => sum + (ADD_ONS.find((a) => a.id === id)?.price ?? 0),
    0,
  );

  const handleClose = () => router.back();

  const handleReset = () => {
    setStep("dates");
    resetBooking();
    if (!villaParam) setSelectedVillaId(null);
    setDetails({ fullName: "", phone: "", email: "", notes: "" });
    setSelectedAddOns([]);
    setSubmitError(null);
  };

  const goNextFromGuests = () => {
    if (isVillaPreSelected) {
      setStep("details");
    } else {
      // No villa pre-selected — send to villa listing so user can pick one.
      // VillaCard will detect the filled context and link to step=details.
      router.push("/villas");
    }
  };

  const goBackFromDetails = () => {
    if (isVillaPreSelected) {
      setStep("guests");
    } else {
      // Came from villas listing — go back there
      router.push("/villas");
    }
  };

  /* ── Submit booking to API ── */
  const handlePayNow = useCallback(async () => {
    if (!selectedVilla || !dateRange.checkIn || !dateRange.checkOut) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Build YYYY-MM-DD strings directly (avoids UTC shift from toISOString)
    const thisYear = new Date().getFullYear();
    const pad = (n: number) => String(n).padStart(2, "0");
    const checkInISO = `${thisYear}-${pad(dateRange.checkIn.month + 1)}-${pad(dateRange.checkIn.day)}`;
    const checkOutISO = `${thisYear}-${pad(dateRange.checkOut.month + 1)}-${pad(dateRange.checkOut.day)}`;

    const payload = {
      villaId: selectedVilla.id,
      villaName: selectedVilla.name,
      checkIn: checkInISO,
      checkOut: checkOutISO,
      adults: guests.adults,
      children: guests.children,
      pets: guests.pets,
      fullName: details.fullName,
      phone: details.phone,
      email: details.email,
      notes: details.notes,
      addOns: selectedAddOns,
      basePrice,
      addOnTotal,
      taxAmount: NIGHT_TAX,
      totalPrice: basePrice + addOnTotal + NIGHT_TAX,
    };

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setSubmitError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setBookingResult({ id: data.bookingId });
    } catch {
      setSubmitError(
        "Network error. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [
    selectedVilla,
    dateRange,
    guests,
    details,
    selectedAddOns,
    basePrice,
    addOnTotal,
  ]);

  /* ── Show success screen ── */
  if (bookingResult) {
    return (
      <SuccessScreen
        bookingId={bookingResult.id}
        villaName={selectedVilla?.name ?? "Jade Villa"}
        checkIn={dateRange.checkIn}
        checkOut={dateRange.checkOut}
        onClose={() => router.push("/")}
      />
    );
  }

  /* ── Bottom action bar ── */
  const renderBottomBar = () => {
    if (step === "dates") {
      const canNext = !!(dateRange.checkIn && dateRange.checkOut);
      return (
        <div className="flex items-center justify-between">
          <div className="text-white/60 text-gh-body font-manrope">
            <span>{formatDate(dateRange.checkIn)}</span>
            <span className="mx-2 text-white/30">to</span>
            <span>{formatDate(dateRange.checkOut)}</span>
          </div>
          <button
            disabled={!canNext}
            onClick={() => setStep("guests")}
            className={`px-8 py-2.5 text-gh-label font-bold tracking-widest uppercase transition-all font-manrope ${canNext ? "bg-[#EFCD62] text-[#0D4032] hover:bg-white" : "bg-white/10 text-white/30 cursor-not-allowed"}`}
          >
            NEXT
          </button>
        </div>
      );
    }

    if (step === "guests") {
      const guestLabel =
        guests.adults + guests.children > 0
          ? `${guests.adults} Guest${guests.adults !== 1 ? "s" : ""}${guests.children > 0 ? `, ${guests.children} Children` : ""}`
          : "-- --";
      // Label depends on whether villa is already chosen
      const nextLabel = isVillaPreSelected ? "APPLY" : "NEXT";
      return (
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-gh-body font-manrope">
            {guestLabel}
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => setStep("dates")}
              className="px-5 py-2.5 text-gh-label font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors font-manrope"
            >
              BACK
            </button>
            <button
              disabled={guests.adults === 0}
              onClick={goNextFromGuests}
              className={`px-8 py-2.5 text-gh-label font-bold tracking-widest uppercase transition-all font-manrope ${guests.adults > 0 ? "bg-[#EFCD62] text-[#0D4032] hover:bg-white" : "bg-white/10 text-white/30 cursor-not-allowed"}`}
            >
              {nextLabel}
            </button>
          </div>
        </div>
      );
    }

    if (step === "details") {
      const isValid =
        details.fullName.trim() && details.phone.trim() && details.email.trim();
      return (
        <div className="flex items-center justify-between">
          <span className="text-[#EFCD62] font-manrope text-gh-label font-bold">
            {formatRupees(basePrice)} onwards
          </span>
          <div className="flex gap-3">
            <button
              onClick={goBackFromDetails}
              className="px-5 py-2.5 text-gh-label font-bold tracking-widest uppercase text-white/60 hover:text-white transition-colors font-manrope"
            >
              BACK
            </button>
            <button
              disabled={!isValid}
              onClick={() => setStep("review")}
              className={`px-8 py-2.5 text-gh-label font-bold tracking-widest uppercase transition-all font-manrope ${isValid ? "bg-[#EFCD62] text-[#0D4032] hover:bg-white" : "bg-white/10 text-white/30 cursor-not-allowed"}`}
            >
              CONTINUE
            </button>
          </div>
        </div>
      );
    }

    if (step === "review") {
      const total = basePrice + addOnTotal + NIGHT_TAX;
      return (
        <div className="flex flex-col gap-3 w-full">
          {/* Error message */}
          <AnimatePresence>
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="flex items-center gap-2 text-red-400 text-gh-label font-manrope bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-sm"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                {submitError}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-3 sm:gap-0">
            <div className="flex items-center gap-2">
              <span className="text-white/80 font-manrope text-gh-desc font-bold tracking-wider">
                Total Price:
              </span>
              <span className="text-[#EFCD62] sm:text-white font-manrope text-gh-label font-bold">
                {formatRupees(total)}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={() => setStep("details")}
                className="px-4 sm:px-6 py-2 sm:py-2.5 text-gh-label font-bold tracking-widest text-[#EFCD62] uppercase transition-colors font-manrope border border-[#EFCD62]/30 sm:border-transparent rounded-sm sm:rounded-none"
              >
                BACK
              </button>
              <button
                disabled={isSubmitting}
                onClick={handlePayNow}
                className={`flex items-center gap-2 px-6 py-2.5 text-gh-label font-bold tracking-widest uppercase transition-all font-manrope ${isSubmitting ? "bg-[#EFCD62]/60 text-[#0D4032]/60 cursor-not-allowed" : "bg-[#EFCD62] text-[#0D4032] hover:bg-white"}`}
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "CONFIRMING…" : "PAY NOW"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="h-[100svh] bg-[#0D4032] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-[#0D4032] shrink-0">
        <div className="w-full max-w-[720px] mx-auto">
          <div className="flex items-center justify-between px-5 sm:px-6 py-5 border-b border-white/10">
            <h2 className="text-white text-gh-h2 font-philosopher leading-none">
              {step === "dates" && "Select Dates"}
              {step === "guests" && "Total Guests"}
              {step === "details" && "Your Details"}
              {step === "review" && "Review & Pay"}
            </h2>
            <div className="flex items-center gap-5">
              <button
                onClick={handleReset}
                className="text-[#EFCD62] text-gh-label font-manrope font-bold tracking-widest uppercase hover:text-white transition-colors"
              >
                RESET
              </button>
              <a
                href="tel:08970663366"
                className="text-white hover:text-[#EFCD62] transition-colors"
              >
                <Headset className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <button
                onClick={handleClose}
                className="text-white hover:text-[#EFCD62] transition-colors"
              >
                <X className="w-5 h-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>

          {/* Legend — only on dates step */}
          {step === "dates" && (
            <div className="flex justify-start items-center gap-2 md:gap-4 px-5 sm:px-6 py-3 md:py-4 text-gh-label text-[#A6C0B5] font-manrope font-medium border-b border-white/10">
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-[#165040] rounded-[2px] shrink-0" />{" "}
                Available
              </span>
              <span className="flex items-center gap-2 relative">
                <span className="w-4 h-4 bg-[#165040]/50 rounded-[2px] overflow-hidden relative shrink-0">
                  <span className="block w-[150%] h-[1px] bg-[#A6C0B5]/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
                </span>
                Unavailable
              </span>
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 bg-[#EFCD62] rounded-[2px] shrink-0" />{" "}
                Selected
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col w-full max-w-[720px] mx-auto overflow-hidden">
        <AnimatePresence mode="wait">
          {step === "dates" && (
            <motion.div
              key="dates"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              <StepDates
                dateRange={dateRange}
                setDateRange={setDateRange}
                villaId={selectedVillaId}
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
              <StepGuests guests={guests} setGuests={setGuests} />
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
              <StepDetails details={details} setDetails={setDetails} />
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
                goToStep={setStep}
                selectedAddOns={selectedAddOns}
                setSelectedAddOns={setSelectedAddOns}
                basePrice={basePrice}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0D4032] z-50">
        <div className="w-full max-w-[720px] mx-auto border-t border-white/10">
          <div className="relative px-4 sm:px-5 py-3 sm:py-5">
            <div className="absolute left-0 right-0 top-0 -translate-y-[1px]">
              <StepDots step={step} />
            </div>
            {renderBottomBar()}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0D4032] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#EFCD62] animate-spin" />
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}

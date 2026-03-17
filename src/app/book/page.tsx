"use client";

import { useState, useMemo, useEffect, Suspense } from "react";
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
} from "lucide-react";
import { VILLAS } from "@/data/villas";

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
   Data
───────────────────────────────────────────────────────────────────── */
const MONTHS = [
  { name: "January 2026", year: 2026, month: 0, days: 31, startDay: 3 },
  { name: "February 2026", year: 2026, month: 1, days: 28, startDay: 0 },
  { name: "March 2026", year: 2026, month: 2, days: 31, startDay: 0 },
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
  { id: "culinary", label: "Culinary Experience", price: 0 },
];

const BASE_PRICE = 99000;
const NIGHT_TAX = 99000;
const FILTERS = ["All", "Pet friendly", "Corporate Retreats", "Weddings"];

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

function StepDots({ step }: { step: Step }) {
  const steps: Step[] = ["dates", "guests", "details", "review"];
  const currentIdx = steps.indexOf(step);
  return (
    <div className="flex w-full gap-1">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`flex-1 h-[2px] transition-all duration-400 ${i <= currentIdx ? "bg-[#EFCD62]" : "bg-white/20"}`}
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
}: {
  dateRange: DateRange;
  setDateRange: (d: DateRange) => void;
}) {
  const handleDayClick = (monthIdx: number, day: number) => {
    const clicked = { month: MONTHS[monthIdx].month, day };
    const { checkIn, checkOut } = dateRange;
    if (!checkIn || (checkIn && checkOut)) {
      setDateRange({ checkIn: clicked, checkOut: null });
    } else {
      const ci = checkIn.month * 31 + checkIn.day;
      const cl = clicked.month * 31 + clicked.day;
      if (cl <= ci) setDateRange({ checkIn: clicked, checkOut: null });
      else setDateRange({ checkIn, checkOut: clicked });
    }
  };

  const isInRange = (monthIdx: number, day: number) => {
    const m = MONTHS[monthIdx].month;
    const { checkIn, checkOut } = dateRange;
    if (!checkIn || !checkOut) return false;
    const d = m * 31 + day;
    return (
      d > checkIn.month * 31 + checkIn.day &&
      d < checkOut.month * 31 + checkOut.day
    );
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
      {/* Day headers with separator */}
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

      {/* Calendars — scrollable */}
      <div
        className="flex-1 overflow-y-auto px-5 pb-24 pt-4"
        data-lenis-prevent
      >
        {MONTHS.map((month, mIdx) => (
          <div key={month.name} className="mb-8">
            <h3 className="text-white font-manrope font-bold text-gh-scroll mb-4">
              {month.name}
            </h3>
            <div className="grid grid-cols-7 gap-[12px] text-center">
              {Array.from({ length: month.startDay }, (_, i) => (
                <div key={`empty-${i}`} className="w-[35px] h-[35px]" />
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
                      className={`w-[35px] h-[35px] mx-auto flex items-center justify-center text-gh-body font-manrope transition-colors rounded-[3px] relative overflow-hidden
                      ${sel ? "bg-[#EFCD62] text-[#0D4032] font-bold" : ""}
                      ${inRange ? "bg-[#EFCD62]/20 text-white" : ""}
                      ${!sel && !inRange && !unavail ? "bg-[#165040] text-white hover:bg-[#1e6050]" : ""}
                      ${unavail ? "bg-[#165040]/60 text-white/30 cursor-not-allowed" : ""}`}
                    >
                      {unavail && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="block w-[140%] h-[1px] bg-white/20 -rotate-45" />
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
}: {
  details: UserDetails;
  setDetails: (d: UserDetails) => void;
  selectedVilla: (typeof VILLAS)[0] | undefined;
}) {
  const basePrice = selectedVilla
    ? parseInt(
        (selectedVilla.pricing?.stay?.packages?.[0]?.price ?? "").replace(
          /[^0-9]/g,
          "",
        ) || String(BASE_PRICE),
      )
    : BASE_PRICE;
  const isValid =
    details.fullName.trim() && details.phone.trim() && details.email.trim();

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
   Step 5: Review & Pay
───────────────────────────────────────────────────────────────────── */
function StepReview({
  dateRange,
  guests,
  details,
  selectedVilla,
  goToStep,
  selectedAddOns,
  setSelectedAddOns,
}: {
  dateRange: DateRange;
  guests: Guests;
  details: UserDetails;
  selectedVilla: (typeof VILLAS)[0] | undefined;
  goToStep: (s: Step) => void;
  selectedAddOns: string[];
  setSelectedAddOns: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const toggleAddOn = (id: string) =>
    setSelectedAddOns((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id],
    );

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
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#EFCD62]" />{" "}
                  {selectedVilla.location}
                </span>
                {selectedVilla.stats.stay && (
                  <span className="flex items-center gap-2">
                    <Bed className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#EFCD62]" />{" "}
                    {selectedVilla.stats.stay} Stay
                  </span>
                )}
                {selectedVilla.stats.events && (
                  <span className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-[#EFCD62]" />{" "}
                    {selectedVilla.stats.events} Stay
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
          <div className="bg-white/5 p-4 flex items-start justify-between border border-transparent">
            <div className="flex flex-col gap-1">
              <p className="text-white font-manrope font-bold text-gh-body mb-1">
                Dates
              </p>
              <p className="text-white/80 font-manrope text-gh-desc">
                {formatDate(dateRange.checkIn)} -{" "}
                {formatDate(dateRange.checkOut)}
              </p>
            </div>
            <button
              onClick={() => goToStep("dates")}
              className="bg-[#1E4336] border border-white/20 px-4 py-2 text-gh-label font-bold tracking-widest text-white uppercase hover:bg-[#285848] transition-colors font-manrope"
            >
              EDIT
            </button>
          </div>

          <div className="bg-white/5 p-4 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-white font-manrope font-bold text-gh-body mb-1">
                Total Guests
              </p>
              <p className="text-white/80 font-manrope text-gh-desc">
                {guests.adults + guests.children} Guests
                {guests.children > 0 ? `, ${guests.children} Children` : ""}
                {guests.pets > 0
                  ? `, ${guests.pets} Pet${guests.pets > 1 ? "s" : ""}`
                  : ""}
              </p>
            </div>
            <button
              onClick={() => goToStep("guests")}
              className="bg-[#1E4336] border border-white/20 px-4 py-2 text-gh-label font-bold tracking-widest text-white uppercase hover:bg-[#285848] transition-colors font-manrope"
            >
              EDIT
            </button>
          </div>

          <div className="bg-white/5 p-4 flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-white font-manrope font-bold text-gh-body mb-1">
                Your Details
              </p>
              <ul className="text-white/80 text-gh-desc font-manrope space-y-0.5 list-disc list-inside">
                <li>Name: {details.fullName || "---"}</li>
                <li>Number: {details.phone || "---"}</li>
                <li>Email: {details.email || "---"}</li>
                {details.notes && (
                  <li>
                    Note: {details.notes.slice(0, 30)}
                    {details.notes.length > 30 ? "...See full note" : ""}
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

        {/* ADD ON EXPERIENCES */}
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
                1 Night x {formatRupees(basePrice)}
              </span>
              <span className="font-bold text-white">
                {formatRupees(basePrice)}
              </span>
            </div>
            <div className="flex items-center justify-between text-white/90">
              <span className="flex items-center gap-2 text-white/80">
                Add On Experiences{" "}
                <span className="text-gh-label text-white/50 lowercase">
                  View Price Breakdown
                </span>
              </span>
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
            <span className="cursor-pointer hover:text-white transition-colors">
              Cancel within 24 hours for refund
            </span>
            <span className="cursor-pointer hover:text-white transition-colors">
              Full Policy
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────
   Main Book Page Content (reads searchParams)
───────────────────────────────────────────────────────────────────── */
import { useBooking, DateRange, Guests } from "@/context/BookingContext";

function BookPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const villaParam = searchParams.get("villa");

  const isVillaPreSelected = !!villaParam;

  const { dateRange, setDateRange, guests, setGuests, resetBooking } =
    useBooking();

  const stepParam = searchParams.get("step") as Step | null;
  const initialStep: Step =
    stepParam && ["dates", "guests", "details", "review"].includes(stepParam)
      ? stepParam
      : "dates";

  const [step, setStep] = useState<Step>(initialStep);
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

  useEffect(() => {
    if (villaParam) {
      setSelectedVillaId(villaParam);
      // Removed the auto-jump to "details" so the flow starts at "dates"
    }
  }, [villaParam]);

  const selectedVilla = VILLAS.find((v) => v.id === selectedVillaId);

  const handleClose = () => router.back();

  const handleReset = () => {
    setStep("dates");
    resetBooking();
    if (!villaParam) setSelectedVillaId(null);
    setDetails({ fullName: "", phone: "", email: "", notes: "" });
  };

  const goNextFromDates = () => setStep("guests");
  const goNextFromGuests = () => {
    if (isVillaPreSelected) {
      setStep("details");
    } else {
      router.push("/villas");
    }
  };
  const goBackFromDetails = () =>
    isVillaPreSelected ? setStep("guests") : router.push("/villas");

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
            onClick={goNextFromDates}
            className={`px-8 py-2.5 text-gh-label font-bold tracking-widest uppercase transition-all font-manrope ${canNext ? "bg-[#EFCD62] text-[#0D4032] hover:bg-white" : "bg-white/10 text-white/30 cursor-not-allowed"}`}
          >
            NEXT
          </button>
        </div>
      );
    }
    if (step === "guests") {
      const totalGuests = guests.adults + guests.children;
      return (
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-gh-body font-manrope">
            {totalGuests > 0
              ? `${guests.adults} Guest${guests.adults !== 1 ? "s" : ""}${guests.children > 0 ? `, ${guests.children} Children` : ""}`
              : "-- --"}
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
              APPLY
            </button>
          </div>
        </div>
      );
    }
    if (step === "details") {
      const basePrice = selectedVilla
        ? parseInt(
            (selectedVilla.pricing?.stay?.packages?.[0]?.price ?? "").replace(
              /[^0-9]/g,
              "",
            ) || "99000",
          )
        : 99000;
      const isValid =
        details.fullName.trim() && details.phone.trim() && details.email.trim();
      return (
        <div className="flex items-center justify-between">
          <span className="text-[#EFCD62] font-manrope text-gh-label font-bold">
            ₹{basePrice.toLocaleString("en-IN")} onwards
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
              APPLY
            </button>
          </div>
        </div>
      );
    }
    if (step === "review") {
      const basePrice = selectedVilla
        ? parseInt(
            (
              selectedVilla.pricing?.stay?.packages?.[0]?.price ?? "99000"
            ).replace(/[^0-9]/g, ""),
          ) || 99000
        : 99000;
      const addOnTotal = selectedAddOns.reduce(
        (sum, id) => sum + (ADD_ONS.find((a) => a.id === id)?.price ?? 0),
        0,
      );
      const total = basePrice + addOnTotal + NIGHT_TAX;

      return (
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
            <PrimaryButton withArrow={false}>PAY NOW</PrimaryButton>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[100svh] bg-[#0D4032] flex flex-col overflow-hidden">
      {/* Header — step title left, actions right */}
      <div className="bg-[#0D4032] shrink-0">
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
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
          <div className="flex justify-start items-center gap-2 md:gap-4 px-5 md:px-6 py-3 md:py-4 text-gh-label text-[#A6C0B5] font-manrope font-medium border-b border-white/10">
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-[#165040] rounded-[2px] shrink-0" />
              Available
            </span>
            <span className="flex items-center gap-2 relative">
              <span className="w-4 h-4 bg-[#165040] rounded-[2px] overflow-hidden relative border border-[#165040] shrink-0">
                <span className="block w-[150%] h-[1px] bg-[#A6C0B5]/40 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45" />
              </span>
              Unavailable
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 bg-[#EFCD62] rounded-[2px] shrink-0" />
              Selected
            </span>
          </div>
        )}
      </div>

      {/* Content area — pb accounts for the floating bottom bar height */}
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
              <StepDates dateRange={dateRange} setDateRange={setDateRange} />
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
              <StepDetails
                details={details}
                setDetails={setDetails}
                selectedVilla={selectedVilla}
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
                goToStep={setStep}
                selectedAddOns={selectedAddOns}
                setSelectedAddOns={setSelectedAddOns}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Floating bottom bar (fixed) ── */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#0D4032] border-t border-white/10 z-50">
        <div className="absolute top-0 left-0 right-0 -translate-y-[1px]">
          <div className="w-full">
            <StepDots step={step} />
          </div>
        </div>
        <div className="w-full max-w-[720px] mx-auto px-4 sm:px-5 py-3 sm:py-5">
          {renderBottomBar()}
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
          <div className="w-8 h-8 border-2 border-[#EFCD62] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <BookPageContent />
    </Suspense>
  );
}

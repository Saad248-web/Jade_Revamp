"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// ── Calendar helpers ────────────────────────────────────────────────────────
const MONTHS = [
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
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}
function sameDay(a: Date | null, b: Date | null) {
  if (!a || !b) return false;
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}
function isBetween(d: Date, start: Date | null, end: Date | null) {
  if (!start || !end) return false;
  const t = startOfDay(d).getTime();
  return t > startOfDay(start).getTime() && t < startOfDay(end).getTime();
}
function formatDate(d: Date | null) {
  if (!d) return "";
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    subject: "",
    queries: "",
  });

  // ── Calendar state ─────────────────────────────────────────────────────────
  const [showCalendar, setShowCalendar] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const today = startOfDay(new Date());
  const [calMonth, setCalMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showCalendar) return;
    const handler = (e: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(e.target as Node)
      )
        setShowCalendar(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showCalendar]);

  const handleDayClick = (day: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(day);
      setCheckOut(null);
    } else {
      if (day < checkIn) {
        setCheckOut(checkIn);
        setCheckIn(day);
      } else {
        setCheckOut(day);
        if (!sameDay(day, checkIn)) setShowCalendar(false);
      }
    }
  };

  const getDaysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDay = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const dateLabel = checkIn
    ? checkOut
      ? `${formatDate(checkIn)} – ${formatDate(checkOut)}`
      : `${formatDate(checkIn)} – Select checkout`
    : "";

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setFormData({ fullName: "", phoneNumber: "", subject: "", queries: "" });
    setCheckIn(null);
    setCheckOut(null);
  };

  const isFormValid =
    formData.fullName.trim() !== "" && formData.phoneNumber.trim() !== "";

  const LINKS_COLUMN_1 = [
    { label: "VILLAS", href: "/villas" },
    { label: "EXPERIENCES", href: "/experiences" },
    { label: "WEDDINGS", href: "/weddings" },
    { label: "CORPORATE RETREATS", href: "/corporate-retreats" },
    { label: "WEEKEND GETAWAYS", href: "/weekend-getaways" },
    { label: "PARTY VILLAS", href: "/party-villas" },
    { label: "ABOUT", href: "/about" },
    { label: "CAREERS", href: "/careers" },
  ];

  const LINKS_COLUMN_2 = [
    { label: "PRIVACY POLICY", href: "/privacy-policy" },
    { label: "TERMS & CONDITIONS", href: "/terms-conditions" },
    { label: "REFUND POLICY", href: "/refund-policy" },
  ];

  return (
    <>
      <footer
        className="relative z-20 overflow-hidden"
        style={{ backgroundColor: "#2E3034" }}
      >
        {/* Decorative top border */}
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#EFCD62]/40 to-transparent" />

        {/* Background Watermark */}
        <div className="absolute top-1/2 right-0 w-[700px] h-[700px] opacity-[0.025] pointer-events-none -translate-y-1/2 translate-x-1/4">
          <Image
            src="/assets/Golden_Logo.png"
            alt="Watermark"
            fill
            sizes="700px"
            className="object-contain"
          />
        </div>

        {/* ── FORM SECTION ─────────────────────────────────────────────── */}
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 relative z-10 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* LEFT: Heading + (Desktop) Links + Contact */}
            <div className="lg:col-span-6 flex flex-col gap-16">
              {/* Heading */}
              <div>
                <p className="font-manrope text-[10px] tracking-[0.3em] uppercase text-[#EFCD62]/70 mb-4">
                  Get In Touch
                </p>
                <h2 className="font-philosopher text-5xl md:text-6xl text-white leading-tight">
                  We'd love to <br />
                  hear from <span className="italic text-[#EFCD62]">you</span>
                </h2>
              </div>

              {/* Desktop: Links + Contact */}
              <div className="hidden lg:flex flex-col gap-12">
                {/* Links Grid */}
                <div className="grid grid-cols-2 gap-x-12 gap-y-3 max-w-md">
                  <div className="flex flex-col gap-3">
                    {LINKS_COLUMN_1.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="group font-manrope text-sm text-[#EFCD62] tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors duration-300"
                      >
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-[10px]">
                          ▶
                        </span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                  <div className="flex flex-col gap-3">
                    {LINKS_COLUMN_2.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="group font-manrope text-sm text-[#EFCD62] tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors duration-300"
                      >
                        <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 text-[10px]">
                          ▶
                        </span>
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Logo + Contact Info */}
                <div className="flex flex-col gap-6">
                  <div className="w-14 h-14 relative">
                    <Image
                      src="/assets/Golden_Logo.png"
                      alt="Jade Logo"
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </div>
                  <div className="flex flex-col gap-3 text-white/60 font-manrope text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-[#EFCD62] shrink-0 mt-0.5" />
                      <span>
                        76, phase II, Royal Enclave, Srirampura, Bengaluru - 64
                      </span>
                    </div>
                    <a
                      href="tel:08970663366"
                      className="flex items-center gap-3 hover:text-white transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#EFCD62] shrink-0" />
                      <span>0897 066 3366</span>
                    </a>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-[#EFCD62] shrink-0" />
                      <span>Info@jadehospitainment.com</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {[
                      {
                        Icon: Facebook,
                        href: "https://www.facebook.com/jadehospitainment/",
                      },
                      {
                        Icon: Instagram,
                        href: "https://www.instagram.com/jadehospitainment/?hl=en",
                      },
                      {
                        Icon: Youtube,
                        href: "https://www.youtube.com/@jade_hospitainment",
                      },
                    ].map(({ Icon, href }, i) => (
                      <a
                        key={i}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-9 h-9 border border-white/15 flex items-center justify-center hover:bg-[#EFCD62] hover:border-[#EFCD62] group transition-all duration-300 cursor-pointer"
                      >
                        <Icon className="w-4 h-4 text-white/70 group-hover:text-black transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: Contact Form */}
            <div className="lg:col-span-6 lg:pl-12 pt-0 lg:pt-16">
              <form className="space-y-5" onSubmit={handleFormSubmit}>
                {/* Name */}
                <div className="group relative">
                  <input
                    type="text"
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder=" "
                    className="peer w-full bg-white/[0.04] border border-white/15 px-4 py-4 text-white focus:border-[#EFCD62] focus:outline-none transition-colors rounded-none h-14 placeholder-transparent"
                  />
                  <label
                    htmlFor="fullName"
                    className="absolute left-4 -top-2.5 text-xs text-white/50 bg-[#2E3034] px-2 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-white/50 peer-focus:-top-2.5 peer-focus:text-[#EFCD62]"
                  >
                    Full Name
                  </label>
                </div>

                {/* Phone */}
                <div className="group relative">
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder=" "
                    className="peer w-full bg-white/[0.04] border border-white/15 px-4 py-4 text-white focus:border-[#EFCD62] focus:outline-none transition-colors rounded-none h-14 placeholder-transparent"
                  />
                  <label
                    htmlFor="phoneNumber"
                    className="absolute left-4 -top-2.5 text-xs text-white/50 bg-[#2E3034] px-2 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-white/50 peer-focus:-top-2.5 peer-focus:text-[#EFCD62]"
                  >
                    Phone Number
                  </label>
                </div>

                {/* Subject */}
                <div className="group relative">
                  <input
                    type="text"
                    id="subject"
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder=" "
                    className="peer w-full bg-white/[0.04] border border-white/15 px-4 py-4 text-white focus:border-[#EFCD62] focus:outline-none transition-colors rounded-none h-14 placeholder-transparent"
                  />
                  <label
                    htmlFor="subject"
                    className="absolute left-4 -top-2.5 text-xs text-white/50 bg-[#2E3034] px-2 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-white/50 peer-focus:-top-2.5 peer-focus:text-[#EFCD62]"
                  >
                    Subject
                  </label>
                </div>

                {/* Date – calendar trigger */}
                <div className="relative" ref={calendarRef}>
                  {/* Trigger button */}
                  <button
                    type="button"
                    onClick={() => setShowCalendar((v) => !v)}
                    className={`w-full h-14 bg-white/[0.04] border px-4 text-left transition-colors rounded-none flex items-center justify-between ${
                      showCalendar ? "border-[#EFCD62]" : "border-white/15"
                    }`}
                  >
                    <span
                      className={`font-manrope text-sm ${
                        dateLabel ? "text-white" : "text-white/40"
                      }`}
                    >
                      {dateLabel || "Check-In & Out Date"}
                    </span>
                    <CalendarDays
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        showCalendar ? "text-[#EFCD62]" : "text-white/30"
                      }`}
                    />
                  </button>

                  {/* Floating label when date selected */}
                  {dateLabel && (
                    <span className="absolute left-4 -top-2.5 text-xs text-[#EFCD62] bg-[#2E3034] px-2 pointer-events-none">
                      Check-In &amp; Out Date
                    </span>
                  )}

                  {/* Calendar overlay */}
                  <AnimatePresence>
                    {showCalendar && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.18 }}
                        className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 bg-[#1C1F22] border border-white/10 shadow-2xl p-5"
                      >
                        {/* Month nav */}
                        <div className="flex items-center justify-between mb-4">
                          <button
                            type="button"
                            onClick={() =>
                              setCalMonth(
                                new Date(
                                  calMonth.getFullYear(),
                                  calMonth.getMonth() - 1,
                                  1,
                                ),
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-[#EFCD62] transition-colors"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <p className="font-manrope text-sm font-semibold text-white tracking-widest uppercase">
                            {MONTHS[calMonth.getMonth()]}{" "}
                            {calMonth.getFullYear()}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setCalMonth(
                                new Date(
                                  calMonth.getFullYear(),
                                  calMonth.getMonth() + 1,
                                  1,
                                ),
                              )
                            }
                            className="w-8 h-8 flex items-center justify-center text-white/50 hover:text-[#EFCD62] transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 mb-2">
                          {DAYS.map((d) => (
                            <div
                              key={d}
                              className="text-center font-manrope text-[10px] text-white/30 tracking-widest py-1"
                            >
                              {d}
                            </div>
                          ))}
                        </div>

                        {/* Day cells */}
                        <div className="grid grid-cols-7">
                          {/* offset */}
                          {Array.from({
                            length: getFirstDay(
                              calMonth.getFullYear(),
                              calMonth.getMonth(),
                            ),
                          }).map((_, i) => (
                            <div key={`e-${i}`} />
                          ))}

                          {Array.from({
                            length: getDaysInMonth(
                              calMonth.getFullYear(),
                              calMonth.getMonth(),
                            ),
                          }).map((_, i) => {
                            const day = new Date(
                              calMonth.getFullYear(),
                              calMonth.getMonth(),
                              i + 1,
                            );
                            const isStart = sameDay(day, checkIn);
                            const isEnd = sameDay(day, checkOut);
                            const isToday = sameDay(day, today);
                            const isPast = day < today;
                            const effectiveEnd = checkOut ?? hoverDate;
                            const inRange =
                              checkIn && !checkOut
                                ? isBetween(day, checkIn, effectiveEnd)
                                : isBetween(day, checkIn, checkOut);

                            return (
                              <button
                                key={i}
                                type="button"
                                disabled={isPast}
                                onClick={() => !isPast && handleDayClick(day)}
                                onMouseEnter={() => setHoverDate(day)}
                                onMouseLeave={() => setHoverDate(null)}
                                className={`relative h-9 w-full font-manrope text-xs transition-all duration-150 ${
                                  isPast
                                    ? "text-white/15 cursor-not-allowed"
                                    : isStart || isEnd
                                      ? "bg-[#EFCD62] text-[#1C1F22] font-bold z-10"
                                      : inRange
                                        ? "bg-[#EFCD62]/15 text-white"
                                        : isToday
                                          ? "text-[#EFCD62] font-semibold hover:bg-white/10"
                                          : "text-white/70 hover:bg-white/10"
                                }`}
                              >
                                {i + 1}
                              </button>
                            );
                          })}
                        </div>

                        {/* Footer hint */}
                        <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
                          <p className="font-manrope text-[10px] text-white/30">
                            {!checkIn
                              ? "Select check-in date"
                              : !checkOut
                                ? "Select check-out date"
                                : `${formatDate(checkIn)} → ${formatDate(checkOut)}`}
                          </p>
                          {(checkIn || checkOut) && (
                            <button
                              type="button"
                              onClick={() => {
                                setCheckIn(null);
                                setCheckOut(null);
                              }}
                              className="font-manrope text-[10px] text-white/30 hover:text-[#EFCD62] transition-colors tracking-widest uppercase"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Queries */}
                <div className="group relative">
                  <textarea
                    id="queries"
                    rows={4}
                    value={formData.queries}
                    onChange={(e) =>
                      setFormData({ ...formData, queries: e.target.value })
                    }
                    placeholder=" "
                    className="peer w-full bg-white/[0.04] border border-white/15 px-4 py-4 text-white focus:border-[#EFCD62] focus:outline-none transition-colors rounded-none resize-none placeholder-transparent"
                  />
                  <label
                    htmlFor="queries"
                    className="absolute left-4 -top-2.5 text-xs text-white/50 bg-[#2E3034] px-2 transition-all duration-300 peer-placeholder-shown:top-4 peer-placeholder-shown:text-white/50 peer-focus:-top-2.5 peer-focus:text-[#EFCD62]"
                  >
                    Queries
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-4 mt-6 font-manrope tracking-[0.25em] text-xs transition-all duration-300 uppercase border ${
                    isFormValid
                      ? "bg-transparent border-[#EFCD62]/50 text-[#EFCD62] hover:bg-[#EFCD62] hover:text-black hover:border-[#EFCD62]"
                      : "bg-white/[0.03] border-white/10 text-white/20 cursor-not-allowed"
                  }`}
                >
                  SUBMIT
                </button>
              </form>
            </div>
          </div>

          {/* ── MOBILE ONLY: Links + Contact ─────── */}
          <div className="lg:hidden mt-14 flex flex-col gap-10">
            <div className="w-full h-[1px] bg-white/10" />

            {/* Links Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-5">
              <div className="flex flex-col gap-4">
                {LINKS_COLUMN_1.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group font-manrope text-[11px] text-[#EFCD62] tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors duration-300"
                  >
                    <span className="text-[9px] inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                      ▶
                    </span>
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="flex flex-col gap-4">
                {LINKS_COLUMN_2.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group font-manrope text-[11px] text-[#EFCD62] tracking-widest uppercase flex items-center gap-2 hover:text-white transition-colors duration-300"
                  >
                    <span className="text-[9px] inline-block transition-transform duration-300 group-hover:translate-x-0.5">
                      ▶
                    </span>
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Logo + Contact */}
            <div className="flex flex-col gap-6">
              <div className="w-10 h-10 relative">
                <Image
                  src="/assets/Golden_Logo.png"
                  alt="Jade Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>

              <div className="flex flex-col gap-3 text-white/55 font-manrope text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-3.5 h-3.5 text-[#EFCD62] shrink-0 mt-0.5" />
                  <span>
                    76, phase II, Royal Enclave, Srirampura, Bengaluru - 64
                  </span>
                </div>
                <a
                  href="tel:08970663366"
                  className="flex items-center gap-2.5 hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#EFCD62] shrink-0" />
                  <span>0897 066 3366</span>
                </a>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-3.5 h-3.5 text-[#EFCD62] shrink-0" />
                  <span>Info@jadehospitainment.com</span>
                </div>
              </div>

              <div className="flex gap-3">
                {[
                  {
                    Icon: Facebook,
                    href: "https://www.facebook.com/jadehospitainment/",
                  },
                  {
                    Icon: Instagram,
                    href: "https://www.instagram.com/jadehospitainment/?hl=en",
                  },
                  {
                    Icon: Youtube,
                    href: "https://www.youtube.com/@jade_hospitainment",
                  },
                ].map(({ Icon, href }, i) => (
                  <a
                    key={i}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 border border-white/15 flex items-center justify-center hover:bg-[#EFCD62] hover:border-[#EFCD62] group transition-all duration-300 cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-white/70 group-hover:text-black transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* ── BOTTOM COPYRIGHT BAR ─────────────────────────────────────── */}
          <div className="border-t border-white/8 mt-14 pt-7 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="font-manrope text-[10px] text-white/35 tracking-widest uppercase">
              © {currentYear} Jade Hospitainment — All Rights Reserved
            </p>
            <p className="font-manrope text-[10px] text-white/25 tracking-wide">
              Crafted with excellence
            </p>
          </div>
        </div>
      </footer>

      {/* Success Modal Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSuccess(false)}
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
            />

            {/* Centering wrapper */}
            <div className="fixed inset-0 z-[101] flex items-center justify-center pointer-events-none px-4">
              {/* Relative wrapper so close button can float above */}
              <div className="relative pointer-events-auto w-full max-w-[520px]">
                {/* Close button — floats centered above the card */}
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 z-10">
                  <button
                    type="button"
                    onClick={() => setIsSuccess(false)}
                    className="w-12 h-12 rounded-full bg-[#124131] flex items-center justify-center text-white hover:bg-[#1f5c48] transition-colors shadow-2xl"
                  >
                    <X className="w-6 h-6 stroke-[1.5]" />
                  </button>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  onClick={(e) => e.stopPropagation()}
                  className="w-full max-h-[85vh] bg-[#0D4032] rounded-3xl flex flex-col shadow-2xl border border-white/10 overflow-hidden"
                >
                  <div className="flex flex-col items-center justify-center px-8 text-center pt-8 pb-10 overflow-y-auto">
                    {/* Glassy circular wrapper for the checkmark */}
                    <motion.div
                      initial={{ scale: 0.7, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="w-[160px] h-[160px] shrink-0 relative mb-8 rounded-full flex items-center justify-center"
                    >
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: "rgba(255, 255, 255, 0.10)",
                          backdropFilter: "blur(12px)",
                          WebkitBackdropFilter: "blur(12px)",
                          border: "1px solid rgba(255, 255, 255, 0.18)",
                          boxShadow:
                            "inset 0 1px 1px rgba(255,255,255,0.25), 0 4px 24px rgba(0,0,0,0.15)",
                        }}
                      />
                      <div
                        className="absolute rounded-full pointer-events-none"
                        style={{
                          inset: 6,
                          border: "1px solid rgba(255,255,255,0.08)",
                        }}
                      />
                      <div className="w-[84px] h-[84px] shrink-0 relative drop-shadow-2xl">
                        <Image
                          src="/assets/JAde Correction.png"
                          alt="Success Check"
                          fill
                          sizes="96px"
                          quality={100}
                          className="object-contain"
                        />
                      </div>
                    </motion.div>

                    <motion.h2
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-white text-3xl font-philosopher mb-4"
                    >
                      We've got it from here
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-white/80 text-sm leading-relaxed mb-10 max-w-sm mx-auto font-manrope"
                    >
                      Thanks for sharing your details!
                      <br />
                      Our team will take a look and reach out shortly to
                      understand things better.
                    </motion.p>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="flex flex-col w-full max-w-[280px] mx-auto gap-5"
                    >
                      <p className="text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase text-center">
                        MEANWHILE CHECK US OUT HERE
                      </p>

                      <div className="flex justify-center gap-4">
                        {[
                          {
                            Icon: Facebook,
                            href: "https://www.facebook.com/jadehospitainment/",
                          },
                          {
                            Icon: Instagram,
                            href: "https://www.instagram.com/jadehospitainment/?hl=en",
                          },
                          {
                            Icon: Youtube,
                            href: "https://www.youtube.com/@jade_hospitainment",
                          },
                        ].map(({ Icon, href }, i) => (
                          <a
                            key={i}
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-12 h-12 flex items-center justify-center bg-white/5 border border-white/20 hover:bg-[#EFCD62] hover:border-[#EFCD62] transition-colors group"
                          >
                            <Icon className="w-5 h-5 text-white/50 group-hover:text-black transition-colors" />
                          </a>
                        ))}
                      </div>

                      <p className="text-white/30 text-[10px] italic text-center">
                        Thoughtfully operated. Always.
                      </p>

                      <button
                        type="button"
                        onClick={() => setIsSuccess(false)}
                        className="w-full bg-[#EFCD62] text-[#0E3A2F] py-5 text-xs font-bold tracking-widest uppercase hover:bg-white transition-colors rounded-none"
                      >
                        OKAY
                      </button>
                    </motion.div>
                  </div>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import PrimaryButton from "@/components/PrimaryButton";
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
  // Defer new Date() to client-only to prevent hydration mismatches
  const [currentYear, setCurrentYear] = useState(2026);
  const [today, setToday] = useState<Date>(() => new Date(2026, 0, 1));
  const [calMonth, setCalMonth] = useState<Date>(() => new Date(2026, 0, 1));

  useEffect(() => {
    const t = startOfDay(new Date());
    setCurrentYear(t.getFullYear());
    setToday(t);
    setCalMonth(new Date(t.getFullYear(), t.getMonth(), 1));
  }, []);

  const [isSuccess, setIsSuccess] = useState(false);
  const [consent, setConsent] = useState(false);
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
    setConsent(false);
  };

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.phoneNumber.trim() !== "" &&
    consent;

  const LINKS_COLUMN_1 = [
    { label: "VILLAS", href: "/villas" },
    { label: "EXPERIENCES", href: "/experiences" },
    { label: "WEDDINGS", href: "/weddings" },
    { label: "CORPORATE RETREATS", href: "/corporate-retreats" },
    { label: "WEEKEND GETAWAYS", href: "/weekend-getaways" },
    { label: "PARTY VILLAS", href: "/party-villas" },
    { label: "CARAVANS", href: "/caravans" },
    { label: "ABOUT", href: "/about" },
    { label: "CAREERS", href: "/careers" },
    { label: "BLOG", href: "/blogs" },
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
        <div className="max-w-[1920px] mx-auto px-6 md:px-12 lg:px-24 relative z-10 pt-10 lg:pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-stretch">
            {/* LEFT: Heading + (Desktop) Links + Contact */}
            {/* LEFT: Heading + Contact Form */}
            <div className="lg:col-span-7 flex flex-col gap-12 lg:pr-12">
              {/* Heading */}
              <div>
                <p
                  className="font-manrope text-gh-label tracking-[0.3em] uppercase text-[#EFCD62]/70"
                  style={{ marginBottom: "clamp(8px, 1.5vw, 16px)" }}
                >
                  Get In Touch
                </p>
                <h2 className="font-philosopher text-gh-h1 text-white leading-tight">
                  We'd love to <br />
                  hear from <span className="italic text-[#EFCD62]">you</span>
                </h2>
              </div>

              {/* Form Content */}
              <form className="space-y-6" onSubmit={handleFormSubmit}>
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
                    className="peer w-full bg-white/[0.02] border border-white/15 px-4 py-4 text-white focus:border-[#EFCD62]/55 focus:outline-none transition-all duration-300 rounded-none h-14 placeholder-transparent"
                  />
                  <label
                    htmlFor="fullName"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gh-label text-white/45 transition-all duration-300 pointer-events-none px-2 
                      peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:text-white/75 peer-focus:bg-[#2E3034] 
                      peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-white/75 peer-[:not(:placeholder-shown)]:bg-[#2E3034]"
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
                      setFormData({
                        ...formData,
                        phoneNumber: e.target.value,
                      })
                    }
                    placeholder=" "
                    className="peer w-full bg-white/[0.02] border border-white/15 px-4 py-4 text-white focus:border-[#EFCD62]/55 focus:outline-none transition-all duration-300 rounded-none h-14 placeholder-transparent"
                  />
                  <label
                    htmlFor="phoneNumber"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gh-label text-white/45 transition-all duration-300 pointer-events-none px-2 
                      peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:text-white/75 peer-focus:bg-[#2E3034] 
                      peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-white/75 peer-[:not(:placeholder-shown)]:bg-[#2E3034]"
                  >
                    Phone Number
                  </label>
                </div>

                {/* Date */}
                <div className="relative" ref={calendarRef}>
                  <button
                    type="button"
                    onClick={() => setShowCalendar((v) => !v)}
                    className={`w-full h-14 bg-white/[0.02] border px-4 text-left transition-colors rounded-none flex items-center justify-between ${
                      showCalendar ? "border-[#EFCD62]/70" : "border-white/15"
                    }`}
                  >
                    <span
                      className={`font-manrope text-gh-label ${
                        dateLabel ? "text-white/80" : "text-white/35"
                      }`}
                    >
                      {dateLabel || "Check-In & Out Date"}
                    </span>
                    <CalendarDays
                      className={`w-4 h-4 shrink-0 transition-colors ${
                        showCalendar ? "text-[#EFCD62]" : "text-white/25"
                      }`}
                    />
                  </button>
                  {dateLabel && (
                    <span className="absolute left-4 -top-2.5 text-gh-label text-white/70 bg-[#2E3034] px-2 pointer-events-none">
                      Check-In & Out Date
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
                          <p className="font-manrope text-gh-body font-semibold text-white tracking-widest uppercase">
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
                              className="text-center font-manrope text-gh-label text-white/30 tracking-widest py-1"
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
                                className={`relative h-9 w-full font-manrope text-gh-label transition-all duration-150 ${
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
                        <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                          <p className="font-manrope text-gh-label text-white/30">
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
                              className="font-manrope text-gh-label text-white/30 hover:text-[#EFCD62] transition-colors tracking-widest uppercase"
                            >
                              Clear
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                    className="peer w-full bg-white/[0.02] border border-white/15 px-4 py-4 text-white focus:border-[#EFCD62]/55 focus:outline-none transition-all duration-300 rounded-none h-14 placeholder-transparent"
                  />
                  <label
                    htmlFor="subject"
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gh-label text-white/45 transition-all duration-300 pointer-events-none px-2 
                      peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:text-white/75 peer-focus:bg-[#2E3034] 
                      peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-white/75 peer-[:not(:placeholder-shown)]:bg-[#2E3034]"
                  >
                    Subject
                  </label>
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
                    className="peer w-full bg-white/[0.02] border border-white/15 px-4 py-4 text-white focus:border-[#EFCD62]/55 focus:outline-none transition-all duration-300 rounded-none resize-none placeholder-transparent"
                  />
                  <label
                    htmlFor="queries"
                    className="absolute left-4 top-6 text-gh-label text-white/45 transition-all duration-300 pointer-events-none px-2 
                      peer-focus:-top-2.5 peer-focus:translate-y-0 peer-focus:text-white/75 peer-focus:bg-[#2E3034] 
                      peer-[:not(:placeholder-shown)]:-top-2.5 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-white/75 peer-[:not(:placeholder-shown)]:bg-[#2E3034]"
                  >
                    Your Queries
                  </label>
                </div>

                {/* Consent */}
                <label className="flex items-start gap-3 pt-1 select-none">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded-[2px] border border-white/25 bg-transparent text-[#EFCD62] focus:ring-[#EFCD62]/50 focus:ring-2"
                  />
                  <span className="font-manrope text-gh-label text-white/40 leading-relaxed">
                    Welcome to Jade Hospitainment, where hospitality meets
                    entertainment in unique and unforgettable ways. With over
                    two decades of experience.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-4 mt-4 font-manrope tracking-[0.25em] text-gh-label transition-all duration-300 uppercase border ${
                    isFormValid
                      ? "bg-transparent border-[#EFCD62]/40 text-[#EFCD62] hover:bg-[#EFCD62] hover:text-black hover:border-[#EFCD62]"
                      : "bg-white/[0.03] border-white/10 text-white/15 cursor-not-allowed"
                  }`}
                >
                  SUBMIT INQUIRY
                </button>
              </form>
            </div>

            <div className="lg:col-start-8 lg:col-span-5 flex flex-col gap-12 border-t border-white/10 pt-10 lg:border-t-0 lg:pt-0 lg:border-l lg:border-white/10 lg:pl-12">
              {/* LINKS block (matches screenshot style, but keeps all existing links) */}
              <div>
                <p className="font-manrope text-gh-label tracking-[0.35em] uppercase text-white/55 mb-10">
                  Links
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
                  <div className="flex flex-col gap-4">
                    {LINKS_COLUMN_1.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="font-manrope text-gh-label text-[#EFCD62]/85 tracking-widest uppercase hover:text-[#EFCD62] transition-colors inline-flex items-center gap-2"
                      >
                        <span>{link.label}</span>
                        <span
                          aria-hidden
                          className="shrink-0 text-[0.65em] leading-none translate-y-px select-none"
                        >
                          ▸
                        </span>
                      </Link>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4">
                    {LINKS_COLUMN_2.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="font-manrope text-gh-label text-[#EFCD62]/85 tracking-widest uppercase hover:text-[#EFCD62] transition-colors inline-flex items-center gap-2"
                      >
                        <span>{link.label}</span>
                        <span
                          aria-hidden
                          className="shrink-0 text-[0.65em] leading-none translate-y-px select-none"
                        >
                          ▸
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Info Anchor */}
              <div className="mt-auto pt-12 border-t border-white/10">
                <div className="flex flex-col gap-8">
                  <div className="w-12 h-12 relative opacity-50 contrast-125">
                    <Image
                      src="/assets/Golden_Logo.png"
                      alt="Jade Logo"
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  </div>

                  <div className="flex flex-col gap-6 text-white/50 font-manrope text-gh-label tracking-wide uppercase">
                    <div className="flex items-start gap-4">
                      <MapPin className="w-4 h-4 text-[#EFCD62] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">
                        76, phase II, Royal Enclave, Srirampura, Bengaluru - 64
                      </span>
                    </div>
                    <a
                      href="tel:08970663366"
                      className="flex items-center gap-4 hover:text-[#EFCD62] transition-colors"
                    >
                      <Phone className="w-4 h-4 text-[#EFCD62] shrink-0" />
                      <span>0897 066 3366</span>
                    </a>
                    <a
                      href="mailto:Info@jadehospitainment.com"
                      className="flex items-center gap-4 hover:text-[#EFCD62] transition-colors normal-case tracking-normal"
                    >
                      <Mail className="w-4 h-4 text-[#EFCD62] shrink-0" />
                      <span>Info@jadehospitainment.com</span>
                    </a>

                    <div className="flex gap-2 pt-2">
                      {[
                        {
                          Icon: Facebook,
                          size: "w-[18px] h-[18px]",
                          href: "https://www.facebook.com/jadehospitainment/",
                        },
                        {
                          Icon: Instagram,
                          size: "w-[20px] h-[20px]",
                          href: "https://www.instagram.com/jadehospitainment/?hl=en",
                        },
                        {
                          Icon: Youtube,
                          size: "w-[22px] h-[22px]",
                          href: "https://www.youtube.com/@jade_hospitainment",
                        },
                      ].map(({ Icon, size, href }, i) => (
                        <a
                          key={i}
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-11 h-11 flex items-center justify-center bg-white/[0.03] border border-white/10 text-white/45 hover:text-[#EFCD62] hover:border-white/20 transition-all duration-300 cursor-pointer group"
                        >
                          <Icon
                            className={`${size} transition-transform group-hover:scale-110`}
                          />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── BOTTOM COPYRIGHT BAR ─────────────────────────────────────── */}
          <div className="border-t border-white/10 mt-14 pt-7 flex w-full flex-col items-center justify-between gap-4 md:flex-row">
            <p className="font-manrope text-gh-label text-white/35 tracking-widest uppercase text-center md:text-left">
              © {currentYear} Jade Hospitainment — All Rights Reserved
            </p>
            <PrimaryButton
              href="/experiences/another-experience-1"
              withArrow
              className="shrink-0"
            >
              Another experience
            </PrimaryButton>
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
                  className="w-full max-h-[85vh] bg-[#0B2C23] rounded-3xl flex flex-col shadow-2xl border border-white/10 overflow-hidden"
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
                      className="text-white text-gh-h2 font-philosopher mb-4"
                    >
                      We've got it from here
                    </motion.h2>

                    <motion.p
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-white/80 text-gh-body leading-relaxed mb-10 max-w-sm mx-auto font-manrope"
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
                      <p className="text-white/50 text-gh-label font-bold tracking-[0.2em] uppercase text-center">
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

                      <p className="text-white/30 text-gh-label italic text-center">
                        Thoughtfully operated. Always.
                      </p>

                      <PrimaryButton
                        withArrow={false}
                        className="w-full"
                        onClick={() => setIsSuccess(false)}
                      >
                        OKAY
                      </PrimaryButton>
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

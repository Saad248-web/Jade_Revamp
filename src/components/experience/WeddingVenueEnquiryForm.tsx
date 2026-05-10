"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { Calendar, Check } from "lucide-react";
import { EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS } from "@/lib/experienceOverlayTheme";

type Props = {
  onSuccess: () => void;
  onClosePrivacyNav?: () => void;
};

const SERVICES = [
  "Décor & Styling",
  "Catering",
  "Photography",
  "Music & Entertainment",
  "Not decided yet",
];

const EVENTS = [
  "Mehendi",
  "Haldi",
  "Sangeet",
  "Cocktail Night",
  "Bachelor / Bachelorette",
  "Pre-Wedding Shoot",
];

const SETTINGS = ["Outdoor", "Indoor", "Combination of both"];

function ToggleSet({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: Set<string>;
  onToggle: (s: string) => void;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {options.map((s) => {
        const checked = selected.has(s);
        return (
          <label
            key={s}
            className="flex items-center gap-3 cursor-pointer group text-left min-h-[1.5rem]"
          >
            <input
              type="checkbox"
              checked={checked}
              onChange={() => onToggle(s)}
              className="sr-only"
            />
            <div
              className="w-5 h-5 shrink-0 flex items-center justify-center transition-all"
              style={{
                border: checked ? "2px solid #EFCD62" : "1.5px solid rgba(255,255,255,0.45)",
                backgroundColor: checked ? "#EFCD62" : "transparent",
              }}
            >
              {checked && (
                <Check className="w-3 h-3 text-black" strokeWidth={3.5} />
              )}
            </div>
            <span className="text-white/80 text-gh-desc leading-snug group-hover:text-white transition-colors">
              {s}
            </span>
          </label>
        );
      })}
    </div>
  );
}

export default function WeddingVenueEnquiryForm({
  onSuccess,
  onClosePrivacyNav,
}: Props) {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [services, setServices] = useState<Set<string>>(new Set());
  const [events, setEvents] = useState<Set<string>>(new Set());
  const [setting, setSetting] = useState<Set<string>>(new Set());
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const toggle = (prev: Set<string>, v: string) => {
    const next = new Set(prev);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };

  const validate = (): boolean => {
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return false;
    }
    if (!/^[\d\s+()-]{10,}$/.test(phone.trim())) {
      setError("Please enter a valid phone number (at least 10 digits).");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }
    if (!eventDate) {
      setError("Please choose an event date.");
      return false;
    }
    setError(null);
    return true;
  };

  const openCalendar = () => {
    dateRef.current?.showPicker?.();
    dateRef.current?.focus();
  };

  return (
    <form
      className="space-y-6"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
          const res = await fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              source: "wedding_enquiry",
              payload: {
                fullName: fullName.trim(),
                phone: phone.trim(),
                email: email.trim(),
                eventDate,
                services: Array.from(services),
                events: Array.from(events),
                setting: Array.from(setting),
                notes: notes.trim(),
              },
            }),
          });
          const data = (await res.json().catch(() => ({}))) as { error?: string };
          if (!res.ok) {
            throw new Error(
              data.error || "Something went wrong. Please try again.",
            );
          }
          onSuccess();
        } catch (err) {
          setSubmitError(
            err instanceof Error ? err.message : "Unable to submit enquiry.",
          );
        } finally {
          setSubmitting(false);
        }
      }}
      noValidate
    >
      {error ? (
        <p className="text-red-400 text-gh-label font-manrope" role="alert">
          {error}
        </p>
      ) : null}
      {submitError ? (
        <p className="text-red-400 text-gh-label font-manrope" role="alert">
          {submitError}
        </p>
      ) : null}

      <div className="relative">
        <label
          className={`absolute -top-3 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10 font-manrope`}
        >
          Full Name *
        </label>
        <input
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full bg-transparent border border-white/20 rounded-[4px] px-6 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="tel"
          placeholder="Phone Number *"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors placeholder:text-white/35"
          autoComplete="tel"
        />
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors placeholder:text-white/35"
          autoComplete="email"
        />
      </div>

      <div className="relative">
        <label
          htmlFor="wedding-event-date"
          className={`absolute -top-3 left-4 ${EXPERIENCE_OVERLAY_FLOATING_LABEL_CLASS} px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10 font-manrope`}
        >
          Event date *
        </label>
        <input
          ref={dateRef}
          id="wedding-event-date"
          type="date"
          value={eventDate}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setEventDate(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 pr-12 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors [color-scheme:dark]"
        />
        <button
          type="button"
          aria-label="Open date picker"
          onClick={openCalendar}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-[#EFCD62] rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
        >
          <Calendar className="w-5 h-5" />
        </button>
      </div>

      <div className="space-y-3">
        <p className="text-white/60 text-gh-label font-bold uppercase tracking-widest">
          Services Required
        </p>
        <ToggleSet
          options={SERVICES}
          selected={services}
          onToggle={(s) => setServices((prev) => toggle(prev, s))}
        />
      </div>

      <div className="space-y-3">
        <p className="text-white/60 text-gh-label font-bold uppercase tracking-widest">
          Events You&apos;re Planning
        </p>
        <ToggleSet
          options={EVENTS}
          selected={events}
          onToggle={(s) => setEvents((prev) => toggle(prev, s))}
        />
      </div>

      <div className="space-y-3">
        <p className="text-white/60 text-gh-label font-bold uppercase tracking-widest">
          Preferred Setting
        </p>
        <ToggleSet
          options={SETTINGS}
          selected={setting}
          onToggle={(s) => setSetting((prev) => toggle(prev, s))}
        />
      </div>

      <div>
        <textarea
          placeholder="Additional requests"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-[4px] px-4 py-4 text-white text-gh-body focus:border-[#EFCD62] outline-none transition-colors placeholder:text-white/35"
        />
      </div>

      <p className="text-[11px] text-white/30 pt-2 text-center font-manrope">
        By proceeding, you agree to our{" "}
        <Link
          href="/privacy-policy"
          className="text-[#EFCD62] hover:underline"
          onClick={onClosePrivacyNav}
        >
          Privacy Policy
        </Link>
        ,{" "}
        <Link
          href="/terms-conditions"
          className="text-[#EFCD62] hover:underline"
          onClick={onClosePrivacyNav}
        >
          Terms & Conditions
        </Link>{" "}
        and{" "}
        <Link
          href="/refund-policy"
          className="text-[#EFCD62] hover:underline"
          onClick={onClosePrivacyNav}
        >
          Refund Policy
        </Link>
      </p>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-5 bg-[#EFCD62] text-black font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        {submitting ? "SENDING…" : "CONTACT US"}
      </button>
    </form>
  );
}

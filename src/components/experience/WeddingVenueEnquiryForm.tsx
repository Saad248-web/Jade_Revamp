"use client";

import React, { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Calendar, Check } from "lucide-react";
import { getFieldShellClass } from "@/lib/jadeFormTokens";
import { sanitizePhoneDigitsInput } from "@/lib/phoneNumberInput";
import {
  validateEmail,
  validateFullName,
  validatePhone,
} from "@/lib/leadFormValidation";
import {
  JadeFloatingField,
  JadeFloatingTextarea,
} from "@/components/ui/form";
import JadeFormFieldError from "@/components/ui/form/JadeFormFieldError";

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
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map((s) => {
        const checked = selected.has(s);
        return (
          <label
            key={s}
            className="flex items-center gap-2.5 cursor-pointer group text-left min-h-[1.5rem]"
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
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const dateRef = useRef<HTMLInputElement>(null);

  const toggle = (prev: Set<string>, v: string) => {
    const next = new Set(prev);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    return next;
  };

  const fieldErrors = useMemo(() => {
    const errs: Record<string, string | undefined> = {};
    errs.fullName = validateFullName(fullName);
    errs.phone = validatePhone(phone);
    errs.email = validateEmail(email);
    if (!eventDate) errs.eventDate = "Please choose an event date.";
    return errs;
  }, [fullName, phone, email, eventDate]);

  const showErr = (key: string) =>
    attemptedSubmit && Boolean(fieldErrors[key]);

  const isValid = !Object.values(fieldErrors).some(Boolean);

  const openCalendar = () => {
    dateRef.current?.showPicker?.();
    dateRef.current?.focus();
  };

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setAttemptedSubmit(true);
        if (!isValid) return;
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
      {submitError ? (
        <p className="text-red-400 text-gh-label font-manrope" role="alert">
          {submitError}
        </p>
      ) : null}

      <JadeFloatingField
        id="wedding-fullName"
        label="Full Name"
        value={fullName}
        onChange={setFullName}
        theme="experienceCharcoal"
        invalid={Boolean(fieldErrors.fullName)}
        showError={showErr("fullName")}
        errorMessage={fieldErrors.fullName}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <JadeFloatingField
          id="wedding-phone"
          label="Phone Number"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={phone}
          onChange={(v) => setPhone(sanitizePhoneDigitsInput(v))}
          theme="experienceCharcoal"
          invalid={Boolean(fieldErrors.phone)}
          showError={showErr("phone")}
          errorMessage={fieldErrors.phone}
        />
        <JadeFloatingField
          id="wedding-email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={setEmail}
          theme="experienceCharcoal"
          invalid={Boolean(fieldErrors.email)}
          showError={showErr("email")}
          errorMessage={fieldErrors.email}
        />
      </div>

      <div
        className={`relative ${getFieldShellClass({
          invalid: Boolean(fieldErrors.eventDate),
          showError: showErr("eventDate"),
          variant: "standard",
        })}`}
      >
        <input
          ref={dateRef}
          id="wedding-event-date"
          type="date"
          value={eventDate}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setEventDate(e.target.value)}
          aria-invalid={showErr("eventDate")}
          className="w-full bg-transparent px-4 py-3.5 pr-12 text-white text-gh-body focus:outline-none [color-scheme:dark] font-manrope rounded-sm"
        />
        <button
          type="button"
          aria-label="Open date picker"
          onClick={openCalendar}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/50 hover:text-[#EFCD62] rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
        >
          <Calendar className="w-5 h-5" />
        </button>
        <label
          htmlFor="wedding-event-date"
          className="absolute -top-3 left-4 bg-jade-charcoal px-2 text-white/40 text-gh-label uppercase font-bold tracking-widest z-10 font-manrope pointer-events-none"
        >
          Event date
          {showErr("eventDate") ? (
            <span className="ml-1 text-[#D32C55]">*</span>
          ) : null}
        </label>
      </div>
      {showErr("eventDate") && fieldErrors.eventDate ? (
        <JadeFormFieldError
          id="wedding-date-err"
          message={fieldErrors.eventDate}
        />
      ) : null}

      <div className="space-y-2.5">
        <p className="text-white/60 text-gh-label font-bold uppercase tracking-widest">
          Services Required
        </p>
        <ToggleSet
          options={SERVICES}
          selected={services}
          onToggle={(s) => setServices((prev) => toggle(prev, s))}
        />
      </div>

      <div className="space-y-2.5">
        <p className="text-white/60 text-gh-label font-bold uppercase tracking-widest">
          Events You&apos;re Planning
        </p>
        <ToggleSet
          options={EVENTS}
          selected={events}
          onToggle={(s) => setEvents((prev) => toggle(prev, s))}
        />
      </div>

      <div className="space-y-2.5">
        <p className="text-white/60 text-gh-label font-bold uppercase tracking-widest">
          Preferred Setting
        </p>
        <ToggleSet
          options={SETTINGS}
          selected={setting}
          onToggle={(s) => setSetting((prev) => toggle(prev, s))}
        />
      </div>

      <JadeFloatingTextarea
        id="wedding-notes"
        label="Additional requests"
        required={false}
        value={notes}
        onChange={setNotes}
        theme="experienceCharcoal"
      />

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
        className="w-full py-4 bg-[#EFCD62] text-black font-manrope font-bold text-gh-label tracking-widest uppercase hover:bg-white hover:text-black transition-all disabled:opacity-50 disabled:pointer-events-none"
      >
        {submitting ? "SENDING…" : "CONTACT US"}
      </button>
    </form>
  );
}

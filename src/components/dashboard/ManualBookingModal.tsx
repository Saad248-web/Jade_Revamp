"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  GLASS_CHROME_FRAME_CLASS,
  GLASS_INNER_SURFACE,
} from "@/lib/glassChrome";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { addDays, todayIST } from "@/lib/bookingDates";
import {
  normalizePhone,
  validateManualBooking,
} from "@/lib/dashboard/formValidation";
import type { VillaOption } from "./BlockFormModal";

type ManualBookingFormProps = {
  villas: VillaOption[];
  onClose: () => void;
  onSubmit: (values: {
    villaSlug: string;
    checkIn: string;
    checkOut: string;
    fullName: string;
    email: string;
    phone: string;
    guests: number;
    paymentMode: "external" | "none";
    notes: string;
  }) => Promise<string | null>;
};

const inputClass =
  "w-full border border-white/15 bg-black/20 px-4 py-3 font-manrope text-[length:var(--fs-body)] text-white placeholder:text-white/30 focus:border-[#EFCD62]/60 focus:outline-none";
const inputErrorClass =
  "border-red-400/70 focus:border-red-400/90";
const labelClass =
  "mb-1.5 block font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-widest text-[#EFCD62]";

export function ManualBookingModal({
  villas,
  onClose,
  onSubmit,
}: ManualBookingFormProps) {
  const [villaSlug, setVillaSlug] = useState(villas[0]?.slug ?? "");
  const [checkIn, setCheckIn] = useState(todayIST());
  const [checkOut, setCheckOut] = useState(addDays(todayIST(), 1));
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [guests, setGuests] = useState(4);
  const [paymentMode, setPaymentMode] = useState<"external" | "none">("external");
  const [notes, setNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedVilla = useMemo(
    () => villas.find((v) => v.slug === villaSlug),
    [villas, villaSlug],
  );
  const maxGuests = selectedVilla?.stayMaxPax ?? 500;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    if (guests > maxGuests) setGuests(maxGuests);
  }, [maxGuests, guests]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = {
      villaSlug,
      checkIn,
      checkOut,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: normalizePhone(phone),
      guests,
      notes: notes.trim(),
      maxGuests,
    };
    const errors = validateManualBooking(trimmed);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError(null);
      return;
    }
    setFieldErrors({});
    setError(null);
    setSaving(true);
    const err = await onSubmit({
      ...trimmed,
      paymentMode,
      notes: trimmed.notes,
    });
    setSaving(false);
    if (err) setError(err);
    else onClose();
  };

  const field = (key: string) => ({
    className: `${inputClass}${fieldErrors[key] ? ` ${inputErrorClass}` : ""}`,
    "aria-invalid": fieldErrors[key] ? true : undefined,
    "aria-describedby": fieldErrors[key] ? `${key}-error` : undefined,
  });

  return (
    <div className={dash.modalOverlay} onClick={onClose} role="presentation">
      <div
        className={`${GLASS_CHROME_FRAME_CLASS} ${dash.modalWide}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="manual-booking-title"
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-px block ${GLASS_INNER_SURFACE}`}
        />
        <form onSubmit={handleSubmit} className={dash.modalBody} noValidate>
          <div className="flex items-center justify-between gap-3">
            <h2
              id="manual-booking-title"
              className="font-philosopher text-[length:var(--fs-h3)] text-[#EFCD62]"
            >
              Manual booking
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 text-white/50 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className={dash.stack}>
            <div>
              <label className={labelClass} htmlFor="mb-villa">
                Villa
              </label>
              <select
                id="mb-villa"
                {...field("villaSlug")}
                value={villaSlug}
                onChange={(e) => setVillaSlug(e.target.value)}
              >
                {villas.map((v) => (
                  <option key={v.slug} value={v.slug} className="bg-[#1A1C1E]">
                    {v.name}
                  </option>
                ))}
              </select>
              {fieldErrors.villaSlug && (
                <p id="villaSlug-error" className={dash.fieldError} role="alert">
                  {fieldErrors.villaSlug}
                </p>
              )}
            </div>

            <div className={dash.formGrid2}>
              <div>
                <label className={labelClass} htmlFor="mb-checkin">
                  Check-in
                </label>
                <input
                  id="mb-checkin"
                  type="date"
                  {...field("checkIn")}
                  value={checkIn}
                  min={todayIST()}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    if (e.target.value >= checkOut) {
                      setCheckOut(addDays(e.target.value, 1));
                    }
                  }}
                />
                {fieldErrors.checkIn && (
                  <p id="checkIn-error" className={dash.fieldError} role="alert">
                    {fieldErrors.checkIn}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass} htmlFor="mb-checkout">
                  Check-out
                </label>
                <input
                  id="mb-checkout"
                  type="date"
                  {...field("checkOut")}
                  value={checkOut}
                  min={addDays(checkIn, 1)}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
                {fieldErrors.checkOut && (
                  <p id="checkOut-error" className={dash.fieldError} role="alert">
                    {fieldErrors.checkOut}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="mb-name">
                Guest name
              </label>
              <input
                id="mb-name"
                {...field("fullName")}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                autoComplete="name"
                maxLength={200}
              />
              {fieldErrors.fullName && (
                <p id="fullName-error" className={dash.fieldError} role="alert">
                  {fieldErrors.fullName}
                </p>
              )}
            </div>

            <div className={dash.formGrid2}>
              <div>
                <label className={labelClass} htmlFor="mb-email">
                  Email
                </label>
                <input
                  id="mb-email"
                  type="email"
                  {...field("email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  maxLength={254}
                />
                {fieldErrors.email && (
                  <p id="email-error" className={dash.fieldError} role="alert">
                    {fieldErrors.email}
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass} htmlFor="mb-phone">
                  Phone
                </label>
                <input
                  id="mb-phone"
                  type="tel"
                  inputMode="tel"
                  {...field("phone")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  autoComplete="tel"
                  placeholder="10+ digits"
                  maxLength={32}
                />
                {fieldErrors.phone && (
                  <p id="phone-error" className={dash.fieldError} role="alert">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className={labelClass} htmlFor="mb-guests">
                Guests
                {maxGuests < 500 && (
                  <span className="ml-2 font-normal normal-case tracking-normal text-white/50">
                    (max {maxGuests})
                  </span>
                )}
              </label>
              <input
                id="mb-guests"
                type="number"
                min={1}
                max={maxGuests}
                {...field("guests")}
                value={guests}
                onChange={(e) => {
                  const n = Number(e.target.value);
                  setGuests(Number.isFinite(n) ? n : 1);
                }}
              />
              {fieldErrors.guests && (
                <p id="guests-error" className={dash.fieldError} role="alert">
                  {fieldErrors.guests}
                </p>
              )}
            </div>

            <div>
              <label className={labelClass} htmlFor="mb-payment">
                Payment
              </label>
              <select
                id="mb-payment"
                className={inputClass}
                value={paymentMode}
                onChange={(e) =>
                  setPaymentMode(e.target.value as "external" | "none")
                }
              >
                <option value="external" className="bg-[#1A1C1E]">
                  Paid externally (confirm now)
                </option>
                <option value="none" className="bg-[#1A1C1E]">
                  No payment / comp
                </option>
              </select>
            </div>

            <div>
              <label className={labelClass} htmlFor="mb-notes">
                Notes
              </label>
              <textarea
                id="mb-notes"
                className={`${inputClass} min-h-[80px] resize-y`}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={2000}
              />
              {fieldErrors.notes && (
                <p id="notes-error" className={dash.fieldError} role="alert">
                  {fieldErrors.notes}
                </p>
              )}
            </div>

            {error && (
              <p className={dash.errorText} role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="flex w-full min-h-[48px] items-center justify-center bg-[#EFCD62] font-manrope text-sm font-bold uppercase tracking-widest text-[#1A1C1E] hover:bg-white disabled:opacity-50"
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-label="Saving" />
              ) : (
                "Create booking"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

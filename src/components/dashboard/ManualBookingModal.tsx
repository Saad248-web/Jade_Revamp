"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import {
  GLASS_CHROME_FRAME_CLASS,
  GLASS_INNER_SURFACE,
} from "@/lib/glassChrome";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { DashboardModalHeader } from "./ui/DashboardModalHeader";
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
    externalPaymentRef: string;
    balanceDueDate: string;
    notes: string;
  }) => Promise<string | null>;
};

const inputClass =
  "w-full border border-white/15 bg-black/20 px-4 py-3 font-manrope text-[length:var(--fs-body)] text-white placeholder:text-white/30 focus:border-[var(--dash-accent-border)] focus:outline-none";
const inputErrorClass =
  "border-red-400/70 focus:border-red-400/90";
const labelClass =
  "mb-1.5 block font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-widest text-[var(--dash-accent)]";

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
  const [externalPaymentRef, setExternalPaymentRef] = useState("");
  const [balanceDueDate, setBalanceDueDate] = useState("");
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
      externalPaymentRef: externalPaymentRef.trim(),
      balanceDueDate: balanceDueDate.trim(),
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
        <form onSubmit={handleSubmit} className={`${dash.modalFrame} flex min-h-0 flex-col`} noValidate>
          <DashboardModalHeader
            section="Calendar"
            title="Reserve dates"
            description="Payment is collected externally. OTAs are blocked as soon as you place the hold."
            onClose={onClose}
            titleId="manual-booking-title"
          />
          <div className={`${dash.modalBody} ${dash.stack}`}>
            <div
              className="flex items-start gap-3 border border-amber-400/30 bg-amber-500/10 px-4 py-3 font-manrope text-sm text-amber-100"
              role="status"
            >
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden />
              <p>
                These dates block Airbnb and Booking.com immediately. Confirm or cancel
                from the booking folio after external payment is settled.
              </p>
            </div>

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

            <div className={dash.formGrid2}>
              <div>
                <label className={labelClass} htmlFor="mb-payment-ref">
                  External payment ref
                  <span className="ml-2 font-normal normal-case tracking-normal text-white/50">
                    (optional)
                  </span>
                </label>
                <input
                  id="mb-payment-ref"
                  className={inputClass}
                  value={externalPaymentRef}
                  onChange={(e) => setExternalPaymentRef(e.target.value)}
                  placeholder="UTR, receipt #, bank ref"
                  maxLength={200}
                />
              </div>
              <div>
                <label className={labelClass} htmlFor="mb-balance-due">
                  Balance due date
                  <span className="ml-2 font-normal normal-case tracking-normal text-white/50">
                    (optional)
                  </span>
                </label>
                <input
                  id="mb-balance-due"
                  type="date"
                  className={inputClass}
                  value={balanceDueDate}
                  min={todayIST()}
                  onChange={(e) => setBalanceDueDate(e.target.value)}
                />
              </div>
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
              className={`${dash.btn} ${dash.btnAccent} w-full`}
            >
              {saving ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-label="Saving" />
              ) : (
                "Place on hold"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

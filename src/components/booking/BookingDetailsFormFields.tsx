"use client";

import { useMemo, useState } from "react";
import type { UserDetails } from "@/lib/types";
import { bookingDetailsFieldErrors } from "@/lib/bookingDetailsValidation";

type TouchedKey = keyof UserDetails;

const initialTouched = (): Record<TouchedKey, boolean> => ({
  fullName: false,
  phone: false,
  email: false,
  notes: false,
});

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p
      id={id}
      role="alert"
      className="mt-1.5 text-[11px] md:text-xs text-red-400/95 font-manrope leading-snug"
    >
      {message}
    </p>
  );
}

export default function BookingDetailsFormFields({
  details,
  setDetails,
  forceShowErrors,
  idPrefix = "booking",
}: {
  details: UserDetails;
  setDetails: (d: UserDetails) => void;
  /** After a failed submit — show all invalid fields */
  forceShowErrors: boolean;
  idPrefix?: string;
}) {
  const [touched, setTouched] = useState(initialTouched);

  const errors = useMemo(
    () => bookingDetailsFieldErrors(details),
    [details],
  );

  const show = (key: TouchedKey) =>
    Boolean(errors[key]) && (forceShowErrors || touched[key]);

  const markTouched = (key: TouchedKey) =>
    setTouched((t) => ({ ...t, [key]: true }));

  const border = (key: TouchedKey) =>
    show(key) ? "border-red-400/70" : "border-white/20";

  return (
    <div className="space-y-4">
      <div>
        <div
          className={`relative border ${border("fullName")} focus-within:border-[#EFCD62] transition-colors rounded-sm`}
        >
          <label
            htmlFor={`${idPrefix}-fullName`}
            className="absolute -top-2.5 left-3 bg-[#0B2C23] px-1 text-gh-label text-[#EFCD62] uppercase tracking-widest font-bold"
          >
            Full Name
          </label>
          <input
            id={`${idPrefix}-fullName`}
            type="text"
            name="fullName"
            autoComplete="name"
            aria-invalid={show("fullName")}
            aria-describedby={
              show("fullName") ? `${idPrefix}-fullName-err` : undefined
            }
            value={details.fullName}
            onBlur={() => markTouched("fullName")}
            onChange={(e) =>
              setDetails({ ...details, fullName: e.target.value })
            }
            className="w-full bg-transparent px-4 py-3.5 text-white text-gh-body placeholder:text-white/30 focus:outline-none font-manrope"
          />
        </div>
        {show("fullName") && errors.fullName ? (
          <FieldError id={`${idPrefix}-fullName-err`} message={errors.fullName} />
        ) : null}
      </div>

      <div>
        <input
          id={`${idPrefix}-phone`}
          type="tel"
          name="phone"
          placeholder="Phone Number*"
          autoComplete="tel"
          aria-invalid={show("phone")}
          aria-describedby={
            show("phone") ? `${idPrefix}-phone-err` : undefined
          }
          value={details.phone}
          onBlur={() => markTouched("phone")}
          onChange={(e) => setDetails({ ...details, phone: e.target.value })}
          className={`w-full bg-transparent border ${border("phone")} focus:border-[#EFCD62] px-4 py-3.5 text-white text-gh-body placeholder:text-white/40 focus:outline-none transition-colors font-manrope rounded-sm`}
        />
        {show("phone") && errors.phone ? (
          <FieldError id={`${idPrefix}-phone-err`} message={errors.phone} />
        ) : null}
      </div>

      <div>
        <input
          id={`${idPrefix}-email`}
          type="email"
          name="email"
          placeholder="Email*"
          autoComplete="email"
          aria-invalid={show("email")}
          aria-describedby={
            show("email") ? `${idPrefix}-email-err` : undefined
          }
          value={details.email}
          onBlur={() => markTouched("email")}
          onChange={(e) => setDetails({ ...details, email: e.target.value })}
          className={`w-full bg-transparent border ${border("email")} focus:border-[#EFCD62] px-4 py-3.5 text-white text-gh-body placeholder:text-white/40 focus:outline-none transition-colors font-manrope rounded-sm`}
        />
        {show("email") && errors.email ? (
          <FieldError id={`${idPrefix}-email-err`} message={errors.email} />
        ) : null}
      </div>

      <div>
        <textarea
          id={`${idPrefix}-notes`}
          name="notes"
          rows={4}
          placeholder="Additional requests or note to the host"
          aria-invalid={show("notes")}
          aria-describedby={
            show("notes") ? `${idPrefix}-notes-err` : undefined
          }
          value={details.notes}
          onBlur={() => markTouched("notes")}
          onChange={(e) => setDetails({ ...details, notes: e.target.value })}
          className={`w-full bg-transparent border ${border("notes")} focus:border-[#EFCD62] px-4 py-3.5 text-white text-gh-body placeholder:text-white/40 focus:outline-none transition-colors resize-none font-manrope rounded-sm`}
        />
        {show("notes") && errors.notes ? (
          <FieldError id={`${idPrefix}-notes-err`} message={errors.notes} />
        ) : null}
      </div>
    </div>
  );
}

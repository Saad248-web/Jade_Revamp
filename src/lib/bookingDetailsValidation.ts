import type { UserDetails } from "@/lib/types";

export type BookingDetailsErrors = Partial<
  Record<keyof UserDetails, string>
>;

const NOTES_MAX_LENGTH = 2000;

/** Digits only, with light normalization for +91 / leading 0 */
export function normalizeBookingPhoneDigits(raw: string): string {
  let d = raw.replace(/\D/g, "");
  if (d.length >= 12 && d.startsWith("91")) return d.slice(-10);
  if (d.length === 11 && d.startsWith("0")) return d.slice(1);
  return d;
}

function validateFullName(raw: string): string | undefined {
  const name = raw.trim().replace(/\s+/g, " ");
  if (!name) return "Please enter your full name.";
  if (name.length < 2) return "Name is too short.";
  if (name.length > 120) return "Name is too long.";
  if (/\d/.test(name)) return "Name cannot include numbers.";
  if (!/^[A-Za-z\u00C0-\u024F\s'.\-]+$/.test(name)) {
    return "Use letters only. Spaces, hyphens, apostrophes, and periods are ok.";
  }
  const letters = name.match(/[A-Za-z\u00C0-\u024F]/g);
  if (!letters || letters.length < 2) {
    return "Enter at least two letters in your name.";
  }
  return undefined;
}

function validatePhone(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return "Please enter your phone number.";
  const d = normalizeBookingPhoneDigits(trimmed);
  if (d.length < 10) return "Phone number is too short.";
  if (d.length > 15) return "Phone number is too long.";
  if (d.length === 10 && !/^[6-9]/.test(d)) {
    return "Enter a valid Indian mobile number (10 digits, starts with 6–9).";
  }
  return undefined;
}

function validateEmail(raw: string): string | undefined {
  const e = raw.trim();
  if (!e) return "Please enter your email address.";
  if (e.length > 254) return "Email address is too long.";
  const simple =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!simple.test(e)) return "Enter a valid email address.";
  return undefined;
}

function validateNotes(raw: string): string | undefined {
  if ((raw ?? "").length > NOTES_MAX_LENGTH) {
    return `Notes must be at most ${NOTES_MAX_LENGTH} characters.`;
  }
  return undefined;
}

export function bookingDetailsFieldErrors(
  details: UserDetails,
): BookingDetailsErrors {
  const errors: BookingDetailsErrors = {};

  const ne = validateFullName(details.fullName);
  if (ne) errors.fullName = ne;

  const pe = validatePhone(details.phone);
  if (pe) errors.phone = pe;

  const ee = validateEmail(details.email);
  if (ee) errors.email = ee;

  const te = validateNotes(details.notes);
  if (te) errors.notes = te;

  return errors;
}

export function isBookingDetailsValid(details: UserDetails): boolean {
  return Object.keys(bookingDetailsFieldErrors(details)).length === 0;
}

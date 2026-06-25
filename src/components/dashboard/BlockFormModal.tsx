"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2, X } from "lucide-react";
import {
  GLASS_CHROME_FRAME_CLASS,
  GLASS_INNER_SURFACE,
} from "@/lib/glassChrome";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { addDays, todayIST } from "@/lib/bookingDates";
import { validateManualBlock } from "@/lib/dashboard/formValidation";

export type VillaOption = {
  slug: string;
  name: string;
  stayMaxPax?: number;
};

export type BlockFormValues = {
  villaSlug: string;
  checkIn: string;
  checkOut: string;
  reason: string;
};

type BlockFormModalProps = {
  villas: VillaOption[];
  onClose: () => void;
  onSubmit: (values: BlockFormValues) => Promise<string | null>;
  initialValues?: Partial<BlockFormValues>;
  title?: string;
};

const inputClass =
  "w-full border border-white/15 bg-black/20 px-4 py-3 font-manrope text-[length:var(--fs-body)] text-white placeholder:text-white/30 focus:border-[#EFCD62]/60 focus:outline-none";
const labelClass =
  "mb-1.5 block font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-widest text-[#EFCD62]";

export function BlockFormModal({
  villas,
  onClose,
  onSubmit,
  initialValues,
  title = "New manual block",
}: BlockFormModalProps) {
  const [villaSlug, setVillaSlug] = useState(
    initialValues?.villaSlug ?? villas[0]?.slug ?? "",
  );
  const [checkIn, setCheckIn] = useState(
    initialValues?.checkIn ?? todayIST(),
  );
  const [checkOut, setCheckOut] = useState(
    initialValues?.checkOut ?? addDays(initialValues?.checkIn ?? todayIST(), 1),
  );
  const [reason, setReason] = useState(initialValues?.reason ?? "");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errors = validateManualBlock({ villaSlug, checkIn, checkOut, reason });
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError(null);
      return;
    }
    setFieldErrors({});
    setError(null);
    setSaving(true);
    const err = await onSubmit({ villaSlug, checkIn, checkOut, reason: reason.trim() });
    setSaving(false);
    if (err) setError(err);
    else onClose();
  };

  return (
    <div className={dash.modalOverlay} onClick={onClose}>
      <div
        className={`${GLASS_CHROME_FRAME_CLASS} ${dash.modal}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-px block ${GLASS_INNER_SURFACE}`}
        />
        <form onSubmit={handleSubmit} className={dash.modalBody}>
          <div className="flex items-center justify-between">
            <h2 className="font-philosopher text-[length:var(--fs-h3)] text-white">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white/55 hover:text-white"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div>
            <label className={labelClass} htmlFor="block-villa">
              Villa
            </label>
            <select
              id="block-villa"
              className={inputClass}
              value={villaSlug}
              onChange={(e) => setVillaSlug(e.target.value)}
              required
            >
              {villas.map((v) => (
                <option key={v.slug} value={v.slug} className="bg-[#1A1C1E]">
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          <div className={dash.formGrid2}>
            <div>
              <label className={labelClass} htmlFor="block-checkin">
                Check-in
              </label>
              <input
                id="block-checkin"
                type="date"
                className={inputClass}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass} htmlFor="block-checkout">
                Check-out
              </label>
              <input
                id="block-checkout"
                type="date"
                className={inputClass}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelClass} htmlFor="block-reason">
              Reason (optional)
            </label>
            <input
              id="block-reason"
              className={inputClass}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Owner hold, maintenance, walk-in…"
              maxLength={500}
            />
          </div>

          {error && (
            <p className="font-manrope text-[length:var(--fs-body)] text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !villaSlug}
            className={`min-h-[48px] font-manrope text-sm font-bold uppercase tracking-widest transition-colors ${
              saving
                ? "cursor-not-allowed bg-white/10 text-white/30"
                : "bg-[#EFCD62] text-[#1A1C1E] hover:bg-white"
            }`}
          >
            {saving ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            ) : (
              "Create block"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

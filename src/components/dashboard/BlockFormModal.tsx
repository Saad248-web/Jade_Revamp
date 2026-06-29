"use client";

import { FormEvent, useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import {
  GLASS_CHROME_FRAME_CLASS,
  GLASS_INNER_SURFACE,
} from "@/lib/glassChrome";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { DashboardModalHeader } from "./ui/DashboardModalHeader";
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
  "w-full border border-white/15 bg-black/20 px-4 py-3 font-manrope text-[length:var(--fs-body)] text-white placeholder:text-white/30 focus:border-[var(--dash-accent-border)] focus:outline-none";
const labelClass =
  "mb-1.5 block font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-widest text-[var(--dash-accent)]";

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
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-col">
          <DashboardModalHeader
            section="Operations"
            title={title}
            onClose={onClose}
          />
          <div className={`${dash.modalBody} ${dash.stack}`}>
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
            className={`${dash.btn} ${dash.btnAccent} w-full sm:w-auto ${
              saving ? "cursor-not-allowed opacity-40" : ""
            }`}
          >
            {saving ? (
              <Loader2 className="mx-auto h-5 w-5 animate-spin" />
            ) : (
              "Create block"
            )}
          </button>
          </div>
        </form>
      </div>
    </div>
  );
}

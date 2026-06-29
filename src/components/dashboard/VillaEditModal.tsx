"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import {
  GLASS_CHROME_FRAME_CLASS,
  GLASS_INNER_SURFACE,
} from "@/lib/glassChrome";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { DashboardModalHeader } from "./ui/DashboardModalHeader";
import { ADD_ON_CATALOG } from "@/lib/bookings/addOnCatalog";
import { dashboardFetch } from "@/lib/dashboard/dashboardFetch";
import type { AdminVillaDetail, AdminWeddingTier } from "@/lib/villas/adminVilla";
import { ImageUploadField } from "./ImageUploadField";

const inputClass =
  "w-full border border-white/15 bg-black/20 px-3 py-2.5 font-manrope text-[length:var(--fs-body)] text-white placeholder:text-white/30 focus:border-[var(--dash-accent-border)] focus:outline-none";
const labelClass =
  "mb-1.5 block font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-widest text-[var(--dash-accent)]";
const hintClass = "mt-1 font-manrope text-xs text-white/35";
const sectionTitleClass =
  "font-philosopher text-[length:var(--fs-h3)] text-white border-b border-white/10 pb-2";

const ADD_ON_OPTIONS = Object.values(ADD_ON_CATALOG).map((a) => ({
  id: a.id,
  label: a.label,
}));

type VillaEditModalProps = {
  slug: string;
  canWrite: boolean;
  onClose: () => void;
  onSaved: () => void;
  onOpenFullEditor?: () => void;
};

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={dash.stack}>
      <div>
        <h3 className={sectionTitleClass}>{title}</h3>
        {description && (
          <p className={`mt-1 ${hintClass}`}>{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

export function VillaEditModal({
  slug,
  canWrite,
  onClose,
  onSaved,
  onOpenFullEditor,
}: VillaEditModalProps) {
  const [villa, setVilla] = useState<AdminVillaDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await dashboardFetch(`/api/dashboard/villas/${slug}`);
        if (!res.ok) {
          const d = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(d.error ?? "Failed to load villa");
        }
        const data = (await res.json()) as { villa: AdminVillaDetail };
        if (!cancelled) setVilla(data.villa);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load villa");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const setNum = (key: keyof AdminVillaDetail, value: string) => {
    if (!villa) return;
    setVilla({ ...villa, [key]: Number(value) });
  };

  const setStat = (key: string, value: string) => {
    if (!villa) return;
    setVilla({
      ...villa,
      displayStats: { ...villa.displayStats, [key]: value },
    });
  };

  const updateTier = (
    tierId: string,
    patch: Partial<AdminWeddingTier>,
  ) => {
    if (!villa) return;
    setVilla({
      ...villa,
      weddingTiers: villa.weddingTiers.map((t) =>
        t.id === tierId ? { ...t, ...patch } : t,
      ),
    });
  };

  const toggleAddOn = (id: string) => {
    if (!villa) return;
    const has = villa.addOnAvailability.includes(id);
    setVilla({
      ...villa,
      addOnAvailability: has
        ? villa.addOnAvailability.filter((x) => x !== id)
        : [...villa.addOnAvailability, id],
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!villa || !canWrite) return;
    setSaving(true);
    setError(null);
    try {
      const res = await dashboardFetch(`/api/dashboard/villas/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: villa.name,
          shortName: villa.shortName,
          type: villa.type,
          location: villa.location,
          thumbnail: villa.thumbnail,
          basePriceRupees: villa.basePriceRupees,
          dayOutBasePriceRupees: villa.dayOutBasePriceRupees,
          stayBasePax: villa.stayBasePax,
          dayOutBasePax: villa.dayOutBasePax,
          stayMaxPax: villa.stayMaxPax,
          extraPaxStayRupees: villa.extraPaxStayRupees,
          extraPaxDayOutRupees: villa.extraPaxDayOutRupees,
          taxPercent: villa.taxPercent,
          cleaningFeeRupees: villa.cleaningFeeRupees,
          securityDepositRupees: villa.securityDepositRupees,
          depositPaiseRupees: villa.depositPaiseRupees,
          checkInTime: villa.checkInTime,
          checkOutTime: villa.checkOutTime,
          cancellationPolicy: villa.cancellationPolicy,
          depositPercent: villa.depositPercent,
          status: villa.status,
          bookable: villa.bookable,
          weddingVenue: villa.weddingVenue,
          weddingTiers: villa.weddingTiers.map((t) => ({
            id: t.id,
            label: t.label,
            mode: t.mode,
            maxGuests: t.maxGuests,
            priceRupees: t.priceRupees,
            stayIncludedPax: t.stayIncludedPax,
          })),
          addOnAvailability: villa.addOnAvailability,
          displayStats: villa.displayStats,
          notes: villa.notes,
          axisRooms: villa.axisRooms,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-black/75">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="Close panel"
        onClick={onClose}
      />

      <div
        className={`${GLASS_CHROME_FRAME_CLASS} relative z-10 flex h-[100dvh] w-full max-w-3xl flex-col border-l border-white/10 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-px block ${GLASS_INNER_SURFACE}`}
        />

        {/* Header — sticky */}
        <DashboardModalHeader
          section={`Villa settings${!canWrite ? " · read-only" : ""}`}
          title={villa?.shortName ?? villa?.name ?? slug}
          description={`${slug}${villa?.retreatId ? ` · ${villa.retreatId}` : ""}`}
          onClose={onClose}
          actions={
            villa?.thumbnail ? (
              <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden border border-white/15 sm:block">
                <Image
                  src={villa.thumbnail}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
            ) : undefined
          }
        />

        {/* Body — scrolls inside panel */}
        <div className="relative z-10 min-h-0 flex-1 overflow-y-auto overscroll-contain">
          <div className="p-5">
            {loading ? (
              <div className="flex justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--dash-accent)]" />
              </div>
            ) : !villa ? (
              <p className="text-red-400">{error ?? "Villa not found"}</p>
            ) : (
              <form
                id="villa-edit-form"
                onSubmit={handleSubmit}
                className="flex flex-col gap-8"
              >
                <fieldset disabled={!canWrite} className="contents">
                  <FormSection
                    title="Identity & listing"
                    description="How this property appears on /villas and in the dashboard."
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Full legal name</label>
                        <input
                          className={inputClass}
                          value={villa.name}
                          onChange={(e) =>
                            setVilla({ ...villa, name: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Short display name</label>
                        <input
                          className={inputClass}
                          value={villa.shortName}
                          onChange={(e) =>
                            setVilla({ ...villa, shortName: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Property type</label>
                        <input
                          className={inputClass}
                          value={villa.type}
                          onChange={(e) =>
                            setVilla({ ...villa, type: e.target.value })
                          }
                          placeholder="e.g. 4-BEDROOM HILLSIDE VILLA"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Location line</label>
                        <input
                          className={inputClass}
                          value={villa.location}
                          onChange={(e) =>
                            setVilla({ ...villa, location: e.target.value })
                          }
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <ImageUploadField
                          label="Hero thumbnail"
                          hint="Public path under /public or uploaded /api/media/… — used on villa cards."
                          value={villa.thumbnail}
                          onChange={(url) =>
                            setVilla({ ...villa, thumbnail: url })
                          }
                          villaSlug={slug}
                          disabled={!canWrite}
                        />
                      </div>
                      {onOpenFullEditor && canWrite && (
                        <div className="sm:col-span-2">
                          <button
                            type="button"
                            onClick={onOpenFullEditor}
                            className="w-full border border-[var(--dash-accent-border)] bg-[var(--dash-accent-muted)] px-4 py-3 text-left font-manrope text-sm text-[var(--dash-accent)] transition-colors hover:bg-[var(--dash-accent-muted)]"
                          >
                            Open full property editor — amenities, spaces,
                            experiences, video & FAQ
                          </button>
                        </div>
                      )}
                    </div>
                  </FormSection>

                  <FormSection
                    title="Pricing & capacity"
                    description="Operational rates from Jade_Property_Data.md (+ 18% GST at checkout)."
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label className={labelClass}>Stay base (₹)</label>
                        <input
                          type="number"
                          min={0}
                          className={inputClass}
                          value={villa.basePriceRupees}
                          onChange={(e) =>
                            setNum("basePriceRupees", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Day-out base (₹)</label>
                        <input
                          type="number"
                          min={0}
                          className={inputClass}
                          value={villa.dayOutBasePriceRupees}
                          onChange={(e) =>
                            setNum("dayOutBasePriceRupees", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Stay base pax</label>
                        <input
                          type="number"
                          min={1}
                          className={inputClass}
                          value={villa.stayBasePax}
                          onChange={(e) =>
                            setNum("stayBasePax", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Day-out base pax</label>
                        <input
                          type="number"
                          min={1}
                          className={inputClass}
                          value={villa.dayOutBasePax}
                          onChange={(e) =>
                            setNum("dayOutBasePax", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Stay max pax</label>
                        <input
                          type="number"
                          min={1}
                          className={inputClass}
                          value={villa.stayMaxPax}
                          onChange={(e) =>
                            setNum("stayMaxPax", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Extra pax stay (₹)</label>
                        <input
                          type="number"
                          min={0}
                          className={inputClass}
                          value={villa.extraPaxStayRupees}
                          onChange={(e) =>
                            setNum("extraPaxStayRupees", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Extra pax day-out (₹)</label>
                        <input
                          type="number"
                          min={0}
                          className={inputClass}
                          value={villa.extraPaxDayOutRupees}
                          onChange={(e) =>
                            setNum("extraPaxDayOutRupees", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </FormSection>

                  <FormSection
                    title="Fees, tax & policies"
                    description="Applied at quote and on the booking folio."
                  >
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <div>
                        <label className={labelClass}>GST %</label>
                        <input
                          type="number"
                          min={0}
                          max={28}
                          step={0.01}
                          className={inputClass}
                          value={villa.taxPercent}
                          onChange={(e) =>
                            setNum("taxPercent", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Deposit %</label>
                        <input
                          type="number"
                          min={0}
                          max={100}
                          className={inputClass}
                          value={villa.depositPercent}
                          onChange={(e) =>
                            setNum("depositPercent", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Fixed deposit (₹)</label>
                        <input
                          type="number"
                          min={0}
                          className={inputClass}
                          value={villa.depositPaiseRupees}
                          onChange={(e) =>
                            setNum("depositPaiseRupees", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Cleaning fee (₹)</label>
                        <input
                          type="number"
                          min={0}
                          className={inputClass}
                          value={villa.cleaningFeeRupees}
                          onChange={(e) =>
                            setNum("cleaningFeeRupees", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Security deposit (₹)</label>
                        <input
                          type="number"
                          min={0}
                          className={inputClass}
                          value={villa.securityDepositRupees}
                          onChange={(e) =>
                            setNum("securityDepositRupees", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Check-in</label>
                        <input
                          type="time"
                          className={inputClass}
                          value={villa.checkInTime}
                          onChange={(e) =>
                            setVilla({ ...villa, checkInTime: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Check-out</label>
                        <input
                          type="time"
                          className={inputClass}
                          value={villa.checkOutTime}
                          onChange={(e) =>
                            setVilla({ ...villa, checkOutTime: e.target.value })
                          }
                        />
                      </div>
                      <div className="sm:col-span-2 lg:col-span-3">
                        <label className={labelClass}>Cancellation policy</label>
                        <textarea
                          className={`${inputClass} min-h-[100px] resize-y`}
                          value={villa.cancellationPolicy}
                          onChange={(e) =>
                            setVilla({
                              ...villa,
                              cancellationPolicy: e.target.value,
                            })
                          }
                          rows={4}
                        />
                      </div>
                    </div>
                  </FormSection>

                  <FormSection
                    title="Availability"
                    description="Hidden removes the villa from /villas and public detail URLs. Not bookable keeps the listing live with Enquire only."
                  >
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-3">
                        <label className={labelClass}>Public visibility</label>
                        <select
                          className={inputClass}
                          value={villa.status}
                          onChange={(e) => {
                            const status = e.target.value;
                            setVilla({
                              ...villa,
                              status,
                              ...(status === "hidden" ? { bookable: false } : {}),
                            });
                          }}
                        >
                          <option value="active" className="bg-[#1A1C1E]">
                            Live — visible on /villas
                          </option>
                          <option value="maintenance" className="bg-[#1A1C1E]">
                            Maintenance — visible, booking may be limited
                          </option>
                          <option value="hidden" className="bg-[#1A1C1E]">
                            Hidden — removed from public site
                          </option>
                        </select>
                      </div>
                      <label className="flex cursor-pointer items-center gap-3 self-end border border-white/10 bg-white/[0.02] px-4 py-3 font-manrope text-sm text-white/75 sm:col-span-2">
                        <input
                          type="checkbox"
                          checked={villa.bookable}
                          disabled={villa.status === "hidden"}
                          onChange={(e) =>
                            setVilla({ ...villa, bookable: e.target.checked })
                          }
                          className="h-4 w-4 accent-[var(--dash-accent)] disabled:opacity-40"
                        />
                        Allow online booking (Book Villa on listing & detail)
                      </label>
                      <p className={`sm:col-span-3 ${hintClass}`}>
                        Uncheck booking to show <strong className="text-white/60">Enquire</strong> and{" "}
                        <strong className="text-white/60">View Villa</strong> only — villa stays visible.
                      </p>
                      <label className="flex cursor-pointer items-center gap-3 self-end border border-white/10 bg-white/[0.02] px-4 py-3 font-manrope text-sm text-white/75">
                        <input
                          type="checkbox"
                          checked={villa.weddingVenue}
                          onChange={(e) =>
                            setVilla({
                              ...villa,
                              weddingVenue: e.target.checked,
                            })
                          }
                          className="h-4 w-4 accent-[var(--dash-accent)]"
                        />
                        Wedding / event venue
                      </label>
                    </div>
                  </FormSection>

                  <FormSection
                    title="Public card stats"
                    description="Shown on villa directory cards (/villas)."
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      {(
                        [
                          ["stay", "Stay capacity"],
                          ["events", "Event capacity"],
                          ["bhk", "Bedrooms / layout"],
                          ["lawn", "Lawn / outdoor"],
                          ["villaArea", "Built-up / estate"],
                          ["pool", "Pool (if any)"],
                        ] as const
                      ).map(([key, label]) => (
                        <div key={key}>
                          <label className={labelClass}>{label}</label>
                          <input
                            className={inputClass}
                            value={villa.displayStats[key] ?? ""}
                            onChange={(e) => setStat(key, e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </FormSection>

                  {villa.weddingVenue && villa.weddingTiers.length > 0 && (
                    <FormSection
                      title="Wedding & event tiers"
                      description="Half-day and full-day packages (+ GST). Catering billed separately."
                    >
                      <div className={dash.stack}>
                        {villa.weddingTiers.map((tier) => (
                          <div
                            key={tier.id}
                            className="border border-white/10 bg-white/[0.02] p-4"
                          >
                            <p className="mb-3 font-manrope text-xs font-bold uppercase tracking-widest text-white/40">
                              {tier.id}
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div className="sm:col-span-2">
                                <label className={labelClass}>Label</label>
                                <input
                                  className={inputClass}
                                  value={tier.label}
                                  onChange={(e) =>
                                    updateTier(tier.id, {
                                      label: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className={labelClass}>Price (₹)</label>
                                <input
                                  type="number"
                                  min={0}
                                  className={inputClass}
                                  value={tier.priceRupees}
                                  onChange={(e) =>
                                    updateTier(tier.id, {
                                      priceRupees: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className={labelClass}>Max guests</label>
                                <input
                                  type="number"
                                  min={1}
                                  className={inputClass}
                                  value={tier.maxGuests}
                                  onChange={(e) =>
                                    updateTier(tier.id, {
                                      maxGuests: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                              <div>
                                <label className={labelClass}>Mode</label>
                                <select
                                  className={inputClass}
                                  value={tier.mode}
                                  onChange={(e) =>
                                    updateTier(tier.id, { mode: e.target.value })
                                  }
                                >
                                  <option
                                    value="half_day"
                                    className="bg-[#1A1C1E]"
                                  >
                                    Half day
                                  </option>
                                  <option
                                    value="full_day"
                                    className="bg-[#1A1C1E]"
                                  >
                                    Full day
                                  </option>
                                </select>
                              </div>
                              <div>
                                <label className={labelClass}>
                                  Stay included pax
                                </label>
                                <input
                                  type="number"
                                  min={0}
                                  className={inputClass}
                                  value={tier.stayIncludedPax}
                                  onChange={(e) =>
                                    updateTier(tier.id, {
                                      stayIncludedPax: Number(e.target.value),
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </FormSection>
                  )}

                  <FormSection
                    title="Paid add-ons"
                    description="Which catalog add-ons guests can select for this villa."
                  >
                    <div className="grid gap-2 sm:grid-cols-2">
                      {ADD_ON_OPTIONS.map((opt) => (
                        <label
                          key={opt.id}
                          className="flex cursor-pointer items-center gap-2 border border-white/10 bg-white/[0.02] px-3 py-2.5 font-manrope text-sm text-white/70"
                        >
                          <input
                            type="checkbox"
                            checked={villa.addOnAvailability.includes(opt.id)}
                            onChange={() => toggleAddOn(opt.id)}
                            className="h-4 w-4 shrink-0 accent-[var(--dash-accent)]"
                          />
                          <span>{opt.label}</span>
                        </label>
                      ))}
                    </div>
                  </FormSection>

                  <FormSection
                    title="Axis Rooms"
                    description="Channel manager mapping — API sync when credentials are provided."
                  >
                    <div className="grid gap-4 sm:grid-cols-3">
                      <div>
                        <label className={labelClass}>Property ID</label>
                        <input
                          className={inputClass}
                          value={
                            (villa.axisRooms ?? { propertyId: "", roomTypeId: "", ratePlanId: "" }).propertyId
                          }
                          onChange={(e) =>
                            setVilla({
                              ...villa,
                              axisRooms: {
                                ...(villa.axisRooms ?? { propertyId: "", roomTypeId: "", ratePlanId: "" }),
                                propertyId: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Room type ID</label>
                        <input
                          className={inputClass}
                          value={(villa.axisRooms ?? { propertyId: "", roomTypeId: "", ratePlanId: "" }).roomTypeId}
                          onChange={(e) =>
                            setVilla({
                              ...villa,
                              axisRooms: {
                                ...(villa.axisRooms ?? { propertyId: "", roomTypeId: "", ratePlanId: "" }),
                                roomTypeId: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Rate plan ID</label>
                        <input
                          className={inputClass}
                          value={(villa.axisRooms ?? { propertyId: "", roomTypeId: "", ratePlanId: "" }).ratePlanId}
                          onChange={(e) =>
                            setVilla({
                              ...villa,
                              axisRooms: {
                                ...(villa.axisRooms ?? { propertyId: "", roomTypeId: "", ratePlanId: "" }),
                                ratePlanId: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </FormSection>

                  <FormSection
                    title="Internal notes"
                    description="Staff-only — not shown on the public site."
                  >
                    <textarea
                      className={`${inputClass} min-h-[120px] resize-y`}
                      value={villa.notes}
                      onChange={(e) =>
                        setVilla({ ...villa, notes: e.target.value })
                      }
                      placeholder="Ops reminders, property quirks, contact on site…"
                      rows={5}
                    />
                    {villa.updatedAt && (
                      <p className={hintClass}>
                        Last saved {new Date(villa.updatedAt).toLocaleString("en-IN")}
                      </p>
                    )}
                  </FormSection>
                </fieldset>

                {error && (
                  <p className="font-manrope text-red-400">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Footer — sticky save */}
        {canWrite && villa && !loading && (
          <div
            className="relative z-10 shrink-0 border-t border-white/10 bg-[#1A1C1E]/95 p-4 backdrop-blur-sm"
          >
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[48px] flex-1 border border-white/20 font-manrope text-sm font-bold uppercase tracking-widest text-white/60 hover:border-white/40 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="villa-edit-form"
                disabled={saving}
                className={`min-h-[48px] flex-[2] font-manrope text-sm font-bold uppercase tracking-widest ${
                  saving
                    ? "cursor-not-allowed bg-white/10 text-white/30"
                    : `${dash.btn} ${dash.btnAccent}`
                }`}
              >
                {saving ? (
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                ) : (
                  "Save all changes"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

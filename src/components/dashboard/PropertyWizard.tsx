"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ExternalLink,
  Loader2,
  X,
} from "lucide-react";
import {
  GLASS_CHROME_FRAME_CLASS,
  GLASS_INNER_SURFACE,
} from "@/lib/glassChrome";
import { dash } from "@/lib/dashboard/dashboardClasses";
import { dashboardFetch } from "@/lib/dashboard/dashboardFetch";
import type { AdminVillaDetail } from "@/lib/villas/adminVilla";
import {
  formatZodValidationError,
  normalizeVillaSlug,
} from "@/lib/villas/villaIds";
import { ImageUploadField } from "./ImageUploadField";
import { AmenityEditorRows } from "./wizard/AmenityEditorRows";
import { BrochureUploadField } from "./wizard/BrochureUploadField";
import {
  NearbyLandmarkRows,
  nearbyDraftFromStored,
  nearbyDraftToPayload,
  type NearbyDraft,
} from "./wizard/NearbyLandmarkRows";
import {
  wizardHintClass,
  wizardInputClass,
  wizardLabelClass,
  wizardSectionClass,
} from "./wizard/wizardFieldStyles";
import { VILLA_AMENITY_ICON_OPTIONS } from "@/lib/villas/amenityIconOptions";

const inputClass = wizardInputClass;
const labelClass = wizardLabelClass;
const hintClass = wizardHintClass;

type AmenityRow = { label: string; icon: string; description: string };
type ActivityRow = { title: string; image: string; description: string };
type SpaceRow = {
  id: string;
  title: string;
  category: string;
  amenities: string;
  images: string;
};
type FaqRow = { question: string; answer: string };
type PerfectForCardRow = { title: string; image: string };
type ServiceRow = {
  title: string;
  description: string;
  footer: string;
  icon: string;
};
type PropertyDetailRow = { title: string; description: string; icon: string };

type ContentDraft = {
  description: string;
  socialProof: string;
  categories: string;
  perfectForTags: string;
  perfectForCards: PerfectForCardRow[];
  amenities: AmenityRow[];
  activities: ActivityRow[];
  categorizedSpaces: SpaceRow[];
  images: string;
  youtubeUrl: string;
  videoThumbnail: string;
  address: string;
  distance: string;
  googleMapsUrl: string;
  mapImage: string;
  nearbyRows: NearbyDraft[];
  brochureUrl: string;
  brochureFilename: string;
  services: ServiceRow[];
  propertyDetails: PropertyDetailRow[];
  faq: FaqRow[];
  hideFromVillasDirectory: boolean;
};

type BasicsDraft = {
  slug: string;
  retreatId: string;
  name: string;
  shortName: string;
  type: string;
  location: string;
  thumbnail: string;
  status: string;
  bookable: boolean;
};

const STEPS = [
  "Identity",
  "Intro section",
  "Amenity grid",
  "Spaces",
  "Experiences & video",
  "Location",
  "More & publish",
] as const;

function slugify(s: string) {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function linesToList(s: string) {
  return s
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function listToLines(arr: string[] | undefined) {
  return (arr ?? []).join("\n");
}

function emptyContent(): ContentDraft {
  return {
    description: "",
    socialProof: "",
    categories: "",
    perfectForTags: "",
    perfectForCards: [{ title: "", image: "" }],
    amenities: [{ label: "", icon: "Sparkles", description: "" }],
    activities: [{ title: "", image: "", description: "" }],
    categorizedSpaces: [
      { id: "space-1", title: "", category: "Indoor", amenities: "", images: "" },
    ],
    images: "",
    youtubeUrl: "",
    videoThumbnail: "",
    address: "",
    distance: "",
    googleMapsUrl: "",
    mapImage: "",
    nearbyRows: [{ label: "", distance: "", note: "" }],
    brochureUrl: "",
    brochureFilename: "",
    services: [{ title: "", description: "", footer: "", icon: "Sparkles" }],
    propertyDetails: [{ title: "", description: "", icon: "Home" }],
    faq: [{ question: "", answer: "" }],
    hideFromVillasDirectory: false,
  };
}

function contentFromAdmin(
  content: Record<string, unknown>,
): ContentDraft {
  const c = content as {
    description?: string;
    socialProof?: string;
    categories?: string[];
    perfectForTags?: string[];
    perfectForCards?: PerfectForCardRow[];
    amenities?: AmenityRow[];
    activities?: ActivityRow[];
    categorizedSpaces?: {
      id: string;
      title: string;
      category: string;
      amenities: string[];
      images: string[];
    }[];
    images?: string[];
    locationDetails?: {
      mapImage?: string;
      address?: string;
      distance?: string;
      googleMapsUrl?: string;
      nearby?: { label: string; distance: string; note?: string }[];
    };
    services?: Array<ServiceRow & { footer?: string }>;
    propertyDetails?: PropertyDetailRow[];
    video?: { youtubeUrl?: string; thumbnail?: string };
    faq?: FaqRow[];
    hideFromVillasDirectory?: boolean;
    brochureUrl?: string;
    brochureFilename?: string;
  };

  return {
    description: c.description ?? "",
    socialProof: c.socialProof ?? "",
    categories: listToLines(c.categories),
    perfectForTags: listToLines(c.perfectForTags),
    perfectForCards:
      c.perfectForCards && c.perfectForCards.length > 0
        ? c.perfectForCards.map((card) => ({
            title: card.title ?? "",
            image: card.image ?? "",
          }))
        : [{ title: "", image: "" }],
    amenities:
      c.amenities && c.amenities.length > 0
        ? c.amenities.map((a) => ({
            label: a.label ?? "",
            icon: a.icon ?? "Sparkles",
            description: a.description ?? "",
          }))
        : [{ label: "", icon: "Sparkles", description: "" }],
    activities:
      c.activities && c.activities.length > 0
        ? c.activities.map((a) => ({
            title: a.title ?? "",
            image: a.image ?? "",
            description: a.description ?? "",
          }))
        : [{ title: "", image: "", description: "" }],
    categorizedSpaces:
      c.categorizedSpaces && c.categorizedSpaces.length > 0
        ? c.categorizedSpaces.map((s) => ({
            id: s.id,
            title: s.title ?? "",
            category: s.category ?? "",
            amenities: (s.amenities ?? []).join(", "),
            images: (s.images ?? []).join("\n"),
          }))
        : [
            {
              id: "space-1",
              title: "",
              category: "Indoor",
              amenities: "",
              images: "",
            },
          ],
    images: listToLines(c.images),
    youtubeUrl: c.video?.youtubeUrl ?? "",
    videoThumbnail: c.video?.thumbnail ?? "",
    address: c.locationDetails?.address ?? "",
    distance: c.locationDetails?.distance ?? "",
    googleMapsUrl: c.locationDetails?.googleMapsUrl ?? "",
    mapImage: c.locationDetails?.mapImage ?? "",
    nearbyRows: nearbyDraftFromStored(c.locationDetails?.nearby),
    brochureUrl: c.brochureUrl ?? "",
    brochureFilename: c.brochureFilename ?? "",
    services:
      c.services && c.services.length > 0
        ? c.services.map((s) => ({
            title: s.title ?? "",
            description: s.description ?? "",
            footer: s.footer ?? "",
            icon: s.icon ?? "Sparkles",
          }))
        : [{ title: "", description: "", footer: "", icon: "Sparkles" }],
    propertyDetails:
      c.propertyDetails && c.propertyDetails.length > 0
        ? c.propertyDetails.map((p) => {
            const row = p as PropertyDetailRow & { label?: string };
            return {
              title: row.title ?? row.label ?? "",
              description: row.description ?? "",
              icon: row.icon ?? "Home",
            };
          })
        : [{ title: "", description: "", icon: "Home" }],
    faq:
      c.faq && c.faq.length > 0
        ? c.faq
        : [{ question: "", answer: "" }],
    hideFromVillasDirectory: c.hideFromVillasDirectory ?? false,
  };
}

function buildContentPayload(draft: ContentDraft) {
  return {
    description: draft.description.trim(),
    socialProof: draft.socialProof.trim() || undefined,
    categories: linesToList(draft.categories),
    perfectForTags: linesToList(draft.perfectForTags),
    perfectForCards: draft.perfectForCards
      .filter((c) => c.title.trim())
      .map((c) => ({
        title: c.title.trim(),
        image: c.image.trim(),
      })),
    amenities: draft.amenities
      .filter((a) => a.label.trim())
      .map((a) => ({
        label: a.label.trim(),
        icon: a.icon.trim() || "Sparkles",
        description: a.description.trim() || undefined,
      })),
    activities: draft.activities
      .filter((a) => a.title.trim())
      .map((a) => ({
        title: a.title.trim(),
        image: a.image.trim(),
        description: a.description.trim() || undefined,
      })),
    categorizedSpaces: draft.categorizedSpaces
      .filter((s) => s.title.trim())
      .map((s) => ({
        id: s.id || slugify(s.title) || `space-${Date.now()}`,
        title: s.title.trim(),
        category: s.category.trim() || "Indoor",
        amenities: s.amenities
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
        images: linesToList(s.images),
      })),
    images: linesToList(draft.images),
    locationDetails: {
      mapImage: draft.mapImage.trim() || undefined,
      address: draft.address.trim() || undefined,
      distance: draft.distance.trim() || undefined,
      googleMapsUrl: draft.googleMapsUrl.trim() || undefined,
      nearby: nearbyDraftToPayload(draft.nearbyRows),
    },
    services: draft.services
      .filter((s) => s.title.trim())
      .map((s) => ({
        title: s.title.trim(),
        description: s.description.trim() || undefined,
        footer: s.footer.trim() || undefined,
        icon: s.icon.trim() || undefined,
      })),
    propertyDetails: draft.propertyDetails
      .filter((p) => p.title.trim() && p.description.trim())
      .map((p) => ({
        title: p.title.trim(),
        description: p.description.trim(),
        icon: p.icon.trim() || undefined,
      })),
    video: (() => {
      const youtubeUrl = draft.youtubeUrl.trim();
      const thumbnail = draft.videoThumbnail.trim();
      if (!youtubeUrl && !thumbnail) return undefined;
      return {
        ...(youtubeUrl ? { youtubeUrl } : {}),
        ...(thumbnail ? { thumbnail } : {}),
      };
    })(),
    faq: draft.faq
      .filter((f) => f.question.trim())
      .map((f) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
      })),
    hideFromVillasDirectory: draft.hideFromVillasDirectory,
    brochureUrl: draft.brochureUrl.trim() || undefined,
    brochureFilename: draft.brochureFilename.trim() || undefined,
  };
}

type PropertyWizardProps = {
  mode: "create" | "edit";
  slug?: string;
  canWrite: boolean;
  onClose: () => void;
  onSaved: () => void;
};

export function PropertyWizard({
  mode,
  slug: editSlug,
  canWrite,
  onClose,
  onSaved,
}: PropertyWizardProps) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [basics, setBasics] = useState<BasicsDraft>({
    slug: "",
    retreatId: "",
    name: "",
    shortName: "",
    type: "",
    location: "",
    thumbnail: "",
    status: "hidden",
    bookable: false,
  });
  const [content, setContent] = useState<ContentDraft>(emptyContent());

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (mode !== "edit" || !editSlug) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await dashboardFetch(`/api/dashboard/villas/${editSlug}`);
        if (!res.ok) throw new Error("Failed to load villa");
        const data = (await res.json()) as { villa: AdminVillaDetail };
        if (cancelled) return;
        const v = data.villa;
        setBasics({
          slug: v.slug,
          retreatId: v.retreatId ?? "",
          name: v.name,
          shortName: v.shortName,
          type: v.type ?? "",
          location: v.location ?? "",
          thumbnail: v.thumbnail ?? "",
          status: v.status,
          bookable: v.bookable,
        });
        setContent(contentFromAdmin(v.content));
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Load failed");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, editSlug]);

  const previewId = basics.retreatId || basics.slug;
  const slugForUpload = basics.slug || "new-property";

  const canAdvance = useMemo(() => {
    if (step === 0) {
      if (mode === "create") {
        return (
          basics.slug.trim().length >= 2 &&
          basics.name.trim().length >= 2 &&
          basics.shortName.trim().length >= 1
        );
      }
      return true;
    }
    return true;
  }, [step, mode, basics]);

  const handleSave = async (e?: FormEvent) => {
    e?.preventDefault();
    if (!canWrite) return;
    setSaving(true);
    setError(null);
    try {
      const contentPayload = buildContentPayload(content);
      if (mode === "create") {
        const slug = normalizeVillaSlug(basics.slug);
        const retreatId = normalizeVillaSlug(
          basics.retreatId.trim() || basics.slug.trim(),
        );
        if (slug.length < 2) {
          throw new Error("URL slug must be at least 2 characters.");
        }
        const res = await dashboardFetch("/api/dashboard/villas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug,
            retreatId: retreatId.length >= 2 ? retreatId : slug,
            name: basics.name.trim(),
            shortName: basics.shortName.trim(),
            type: basics.type.trim(),
            location: basics.location.trim(),
            thumbnail: basics.thumbnail.trim(),
            status: basics.status,
            bookable: basics.bookable,
            content: contentPayload,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          details?: unknown;
        };
        if (!res.ok) {
          const detail = formatZodValidationError(data.details);
          throw new Error(detail ?? data.error ?? "Create failed");
        }
      } else if (editSlug) {
        const res = await dashboardFetch(`/api/dashboard/villas/${editSlug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: basics.name.trim(),
            shortName: basics.shortName.trim(),
            type: basics.type.trim(),
            location: basics.location.trim(),
            thumbnail: basics.thumbnail.trim(),
            status: basics.status,
            bookable: basics.bookable,
            content: contentPayload,
          }),
        });
        const data = (await res.json().catch(() => ({}))) as {
          error?: string;
          details?: unknown;
        };
        if (!res.ok) {
          const detail = formatZodValidationError(data.details);
          throw new Error(detail ?? data.error ?? "Save failed");
        }
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="property-wizard fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto overscroll-behavior-contain bg-black/80 p-4">
      <div
        className={`property-wizard__shell ${GLASS_CHROME_FRAME_CLASS} relative flex max-h-[95dvh] w-full max-w-4xl flex-col border border-white/10 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-px block ${GLASS_INNER_SURFACE}`}
        />

        <div className="relative z-10 shrink-0 border-b border-white/10 bg-[#1A1C1E]/90 p-5 backdrop-blur-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-manrope text-xs uppercase tracking-widest text-white/40">
                {mode === "create" ? "Add property" : "Full property editor"}
              </p>
              <h2 className="mt-1 font-philosopher text-2xl text-white">
                {basics.shortName || basics.name || "New villa"}
              </h2>
              <p className={hintClass}>
                Saves to MongoDB — listing & detail pages refresh within seconds
                after publish (no manual redeploy).
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-white/55 hover:text-white"
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="property-wizard__rail mt-6 flex flex-wrap gap-2">
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className={`min-h-[var(--dash-control-h)] border px-3 font-manrope text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  step === i
                    ? "border-[var(--dash-accent-border)] bg-[var(--dash-accent-muted)] text-[var(--dash-accent)]"
                    : i < step
                      ? "border-emerald-500/40 text-emerald-300/80"
                      : "border-white/15 text-white/40"
                }`}
              >
                {i < step ? <Check className="mr-1 inline h-3 w-3" /> : null}
                {i + 1}. {label}
              </button>
            ))}
          </div>
        </div>

        <form
          className="relative z-10 min-h-0 flex-1 overflow-y-auto"
          onSubmit={handleSave}
        >
          <div className="p-5">
            {loading ? (
              <div className="flex items-center justify-center gap-3 py-16 text-white/50">
                <Loader2 className="h-6 w-6 animate-spin text-[var(--dash-accent)]" />
                Loading property…
              </div>
            ) : (
              <>
                {step === 0 && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    {mode === "create" && (
                      <>
                        <div>
                          <label className={labelClass}>URL slug</label>
                          <input
                            className={inputClass}
                            value={basics.slug}
                            onChange={(e) => {
                              const v = normalizeVillaSlug(e.target.value);
                              setBasics({
                                ...basics,
                                slug: v,
                                retreatId: basics.retreatId || v,
                              });
                            }}
                            placeholder="my-new-villa"
                            required
                          />
                          <p className={hintClass}>
                            Public URL: /villas/{basics.slug || "slug"}
                          </p>
                        </div>
                        <div>
                          <label className={labelClass}>Retreat ID</label>
                          <input
                            className={inputClass}
                            value={basics.retreatId}
                            onChange={(e) =>
                              setBasics({
                                ...basics,
                                retreatId: normalizeVillaSlug(e.target.value),
                              })
                            }
                            placeholder="saad-villa (hyphens, no underscores)"
                          />
                          <p className={hintClass}>
                            Used in booking URLs — underscores are converted to
                            hyphens automatically.
                          </p>
                        </div>
                      </>
                    )}
                    <div>
                      <label className={labelClass}>Full name</label>
                      <input
                        className={inputClass}
                        value={basics.name}
                        onChange={(e) => {
                          const name = e.target.value;
                          setBasics({
                            ...basics,
                            name,
                            shortName:
                              mode === "create" && !basics.shortName
                                ? name
                                : basics.shortName,
                            slug:
                              mode === "create" && !basics.slug
                                ? slugify(name)
                                : basics.slug,
                          });
                        }}
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Card title</label>
                      <input
                        className={inputClass}
                        value={basics.shortName}
                        onChange={(e) =>
                          setBasics({ ...basics, shortName: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Property type</label>
                      <input
                        className={inputClass}
                        value={basics.type}
                        onChange={(e) =>
                          setBasics({ ...basics, type: e.target.value })
                        }
                        placeholder="Private nature retreat"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Location</label>
                      <input
                        className={inputClass}
                        value={basics.location}
                        onChange={(e) =>
                          setBasics({ ...basics, location: e.target.value })
                        }
                        placeholder="Harohalli · Bangalore"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <ImageUploadField
                        label="Hero thumbnail"
                        hint="Shown on /villas cards and detail hero fallback."
                        value={basics.thumbnail}
                        onChange={(url) =>
                          setBasics({ ...basics, thumbnail: url })
                        }
                        villaSlug={slugForUpload}
                        disabled={!canWrite}
                      />
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-5">
                    <p className={hintClass}>
                      Section 1 on the public villa page — headline copy, tags, and
                      brochure download.
                    </p>
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea
                        className={`${inputClass} min-h-[140px] resize-y`}
                        value={content.description}
                        onChange={(e) =>
                          setContent({ ...content, description: e.target.value })
                        }
                        rows={6}
                        placeholder="Main paragraph under the amenity grid…"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Social proof line</label>
                      <input
                        className={inputClass}
                        value={content.socialProof}
                        onChange={(e) =>
                          setContent({ ...content, socialProof: e.target.value })
                        }
                        placeholder="Optional trust line under the villa name"
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Perfect for tags</label>
                      <textarea
                        className={`${inputClass} min-h-[100px]`}
                        value={content.perfectForTags}
                        onChange={(e) =>
                          setContent({
                            ...content,
                            perfectForTags: e.target.value,
                          })
                        }
                        placeholder="Boutique Stays&#10;Family Gatherings"
                      />
                      <p className={hintClass}>One per line — chips below description.</p>
                    </div>
                    <BrochureUploadField
                      url={content.brochureUrl}
                      filename={content.brochureFilename}
                      onChange={(url, filename) =>
                        setContent({
                          ...content,
                          brochureUrl: url,
                          brochureFilename: filename,
                        })
                      }
                      villaSlug={slugForUpload}
                      disabled={!canWrite}
                    />
                    <div>
                      <label className={labelClass}>Listing filter categories</label>
                      <textarea
                        className={`${inputClass} min-h-[80px]`}
                        value={content.categories}
                        onChange={(e) =>
                          setContent({ ...content, categories: e.target.value })
                        }
                        placeholder="Pet Friendly&#10;Weekend Getaways"
                      />
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <AmenityEditorRows
                    rows={content.amenities}
                    onChange={(amenities) => setContent({ ...content, amenities })}
                    disabled={!canWrite}
                  />
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <p className={hintClass}>
                      Spaces carousel on villa detail — gallery paths plus per-space
                      images.
                    </p>
                    <div className={wizardSectionClass}>
                      <label className={labelClass}>Hero gallery paths</label>
                      <textarea
                        className={`${inputClass} min-h-[80px] font-mono text-sm`}
                        value={content.images}
                        onChange={(e) =>
                          setContent({ ...content, images: e.target.value })
                        }
                        placeholder="/Villa_Retreats/.../Hero 1.webp"
                      />
                      <div className="mt-3">
                        <ImageUploadField
                          label="Add gallery image"
                          hint="Upload or pick from library — appends to the list above."
                          value=""
                          compact
                          onChange={(url) => {
                            if (!url) return;
                            const prev = content.images.trim();
                            setContent({
                              ...content,
                              images: prev ? `${prev}\n${url}` : url,
                            });
                          }}
                          villaSlug={slugForUpload}
                          disabled={!canWrite}
                        />
                      </div>
                    </div>
                    {content.categorizedSpaces.map((row, i) => (
                      <div key={row.id} className={`${wizardSectionClass} space-y-3`}>
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className={labelClass}>Space title</label>
                            <input
                              className={inputClass}
                              value={row.title}
                              onChange={(e) => {
                                const next = [...content.categorizedSpaces];
                                next[i] = { ...row, title: e.target.value };
                                setContent({ ...content, categorizedSpaces: next });
                              }}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>Category</label>
                            <input
                              className={inputClass}
                              value={row.category}
                              placeholder="Indoor / Outdoor / Pool"
                              onChange={(e) => {
                                const next = [...content.categorizedSpaces];
                                next[i] = { ...row, category: e.target.value };
                                setContent({ ...content, categorizedSpaces: next });
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <label className={labelClass}>Space amenities</label>
                          <input
                            className={inputClass}
                            placeholder="Pool, BBQ, Lawn (comma-separated)"
                            value={row.amenities}
                            onChange={(e) => {
                              const next = [...content.categorizedSpaces];
                              next[i] = { ...row, amenities: e.target.value };
                              setContent({ ...content, categorizedSpaces: next });
                            }}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Image paths</label>
                          <textarea
                            className={`${inputClass} min-h-[60px] font-mono text-sm`}
                            value={row.images}
                            onChange={(e) => {
                              const next = [...content.categorizedSpaces];
                              next[i] = { ...row, images: e.target.value };
                              setContent({ ...content, categorizedSpaces: next });
                            }}
                            placeholder="One path per line"
                          />
                        </div>
                        <ImageUploadField
                          label="Add space image"
                          hint="Path, library, or upload — appends to image paths above."
                          value=""
                          compact
                          onChange={(url) => {
                            if (!url) return;
                            const next = [...content.categorizedSpaces];
                            const prev = row.images.trim();
                            next[i] = {
                              ...row,
                              images: prev ? `${prev}\n${url}` : url,
                            };
                            setContent({ ...content, categorizedSpaces: next });
                          }}
                          villaSlug={slugForUpload}
                          disabled={!canWrite}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="font-manrope text-sm text-[var(--dash-accent)] hover:underline"
                      onClick={() =>
                        setContent({
                          ...content,
                          categorizedSpaces: [
                            ...content.categorizedSpaces,
                            {
                              id: `space-${Date.now()}`,
                              title: "",
                              category: "Outdoor",
                              amenities: "",
                              images: "",
                            },
                          ],
                        })
                      }
                    >
                      + Add space
                    </button>
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-6">
                    <p className={hintClass}>
                      Experiences carousel + video walkthrough section.
                    </p>
                    {content.activities.map((row, i) => (
                      <div key={i} className={`${wizardSectionClass} space-y-3`}>
                        <div>
                          <label className={labelClass}>Experience title</label>
                          <input
                            className={inputClass}
                            value={row.title}
                            onChange={(e) => {
                              const next = [...content.activities];
                              next[i] = { ...row, title: e.target.value };
                              setContent({ ...content, activities: next });
                            }}
                          />
                        </div>
                        <ImageUploadField
                          label="Experience image"
                          value={row.image}
                          onChange={(url) => {
                            const next = [...content.activities];
                            next[i] = { ...row, image: url };
                            setContent({ ...content, activities: next });
                          }}
                          villaSlug={slugForUpload}
                          disabled={!canWrite}
                        />
                        <div>
                          <label className={labelClass}>Caption</label>
                          <textarea
                            className={`${inputClass} min-h-[60px]`}
                            value={row.description}
                            onChange={(e) => {
                              const next = [...content.activities];
                              next[i] = { ...row, description: e.target.value };
                              setContent({ ...content, activities: next });
                            }}
                          />
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="font-manrope text-sm text-[var(--dash-accent)] hover:underline"
                      onClick={() =>
                        setContent({
                          ...content,
                          activities: [
                            ...content.activities,
                            { title: "", image: "", description: "" },
                          ],
                        })
                      }
                    >
                      + Add experience
                    </button>
                    <div className={`${wizardSectionClass} space-y-4`}>
                      <div>
                        <label className={labelClass}>YouTube walkthrough URL</label>
                        <input
                          className={inputClass}
                          value={content.youtubeUrl}
                          onChange={(e) =>
                            setContent({ ...content, youtubeUrl: e.target.value })
                          }
                          placeholder="https://www.youtube.com/watch?v=..."
                        />
                      </div>
                      <ImageUploadField
                        label="Video thumbnail"
                        hint="Poster before play — path, media library, or upload (WebP)."
                        value={content.videoThumbnail}
                        onChange={(url) =>
                          setContent({ ...content, videoThumbnail: url })
                        }
                        villaSlug={slugForUpload}
                        disabled={!canWrite}
                        placeholder="/Villa_Retreats/.../walkthrough.webp"
                      />
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-5">
                    <p className={hintClass}>Location section on villa detail.</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Street address</label>
                        <input
                          className={inputClass}
                          value={content.address}
                          onChange={(e) =>
                            setContent({ ...content, address: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Distance summary</label>
                        <input
                          className={inputClass}
                          value={content.distance}
                          onChange={(e) =>
                            setContent({ ...content, distance: e.target.value })
                          }
                          placeholder="45 min from Bangalore"
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Google Maps URL</label>
                        <input
                          className={inputClass}
                          value={content.googleMapsUrl}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              googleMapsUrl: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                    <ImageUploadField
                      label="Map preview image"
                      hint="Optional static map graphic above the address."
                      value={content.mapImage}
                      onChange={(url) =>
                        setContent({ ...content, mapImage: url })
                      }
                      villaSlug={slugForUpload}
                      disabled={!canWrite}
                    />
                    <NearbyLandmarkRows
                      rows={content.nearbyRows}
                      onChange={(nearbyRows) =>
                        setContent({ ...content, nearbyRows })
                      }
                      disabled={!canWrite}
                    />
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-6">
                    <p className={hintClass}>
                      Services, property highlights, perfect-for gallery, FAQ, and
                      publish flags.
                    </p>
                    <div>
                      <label className={labelClass}>Perfect-for image cards</label>
                      <p className={hintClass}>
                        Gallery section lower on the villa detail page.
                      </p>
                      <div className="mt-3 space-y-4">
                        {content.perfectForCards.map((row, i) => (
                          <div
                            key={i}
                            className={`${wizardSectionClass} grid gap-3 sm:grid-cols-2`}
                          >
                            <div>
                              <label className={labelClass}>Card title</label>
                              <input
                                className={inputClass}
                                value={row.title}
                                onChange={(e) => {
                                  const next = [...content.perfectForCards];
                                  next[i] = { ...row, title: e.target.value };
                                  setContent({ ...content, perfectForCards: next });
                                }}
                              />
                            </div>
                            <ImageUploadField
                              label="Card image"
                              value={row.image}
                              onChange={(url) => {
                                const next = [...content.perfectForCards];
                                next[i] = { ...row, image: url };
                                setContent({ ...content, perfectForCards: next });
                              }}
                              villaSlug={slugForUpload}
                              disabled={!canWrite}
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          className="font-manrope text-sm text-[var(--dash-accent)] hover:underline"
                          onClick={() =>
                            setContent({
                              ...content,
                              perfectForCards: [
                                ...content.perfectForCards,
                                { title: "", image: "" },
                              ],
                            })
                          }
                        >
                          + Add perfect-for card
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Services</label>
                      <div className="mt-3 space-y-3">
                        {content.services.map((row, i) => (
                          <div key={i} className={`${wizardSectionClass} grid gap-3`}>
                            <div className="grid gap-3 sm:grid-cols-2">
                              <div>
                                <label className={labelClass}>Title</label>
                                <input
                                  className={inputClass}
                                  value={row.title}
                                  onChange={(e) => {
                                    const next = [...content.services];
                                    next[i] = { ...row, title: e.target.value };
                                    setContent({ ...content, services: next });
                                  }}
                                />
                              </div>
                              <div>
                                <label className={labelClass}>Icon</label>
                                <select
                                  className={inputClass}
                                  value={row.icon}
                                  onChange={(e) => {
                                    const next = [...content.services];
                                    next[i] = { ...row, icon: e.target.value };
                                    setContent({ ...content, services: next });
                                  }}
                                >
                                  {VILLA_AMENITY_ICON_OPTIONS.map((name) => (
                                    <option
                                      key={name}
                                      value={name}
                                      className="bg-[#1A1C1E]"
                                    >
                                      {name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                            <div>
                              <label className={labelClass}>Description</label>
                              <textarea
                                className={`${inputClass} min-h-[60px]`}
                                value={row.description}
                                onChange={(e) => {
                                  const next = [...content.services];
                                  next[i] = { ...row, description: e.target.value };
                                  setContent({ ...content, services: next });
                                }}
                              />
                            </div>
                            <div>
                              <label className={labelClass}>Footer note</label>
                              <input
                                className={inputClass}
                                value={row.footer}
                                placeholder="Optional small print under description"
                                onChange={(e) => {
                                  const next = [...content.services];
                                  next[i] = { ...row, footer: e.target.value };
                                  setContent({ ...content, services: next });
                                }}
                              />
                            </div>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="font-manrope text-sm text-[var(--dash-accent)] hover:underline"
                          onClick={() =>
                            setContent({
                              ...content,
                              services: [
                                ...content.services,
                                {
                                  title: "",
                                  description: "",
                                  footer: "",
                                  icon: "Sparkles",
                                },
                              ],
                            })
                          }
                        >
                          + Add service
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Property details</label>
                      <p className={hintClass}>
                        Highlight tiles on villa detail (title + description).
                      </p>
                      <div className="mt-3 space-y-3">
                        {content.propertyDetails.map((row, i) => (
                          <div
                            key={i}
                            className="grid gap-3 border border-white/10 p-4 sm:grid-cols-3"
                          >
                            <input
                              className={inputClass}
                              placeholder="Title"
                              value={row.title}
                              onChange={(e) => {
                                const next = [...content.propertyDetails];
                                next[i] = { ...row, title: e.target.value };
                                setContent({ ...content, propertyDetails: next });
                              }}
                            />
                            <input
                              className={inputClass}
                              placeholder="Icon name"
                              value={row.icon}
                              onChange={(e) => {
                                const next = [...content.propertyDetails];
                                next[i] = { ...row, icon: e.target.value };
                                setContent({ ...content, propertyDetails: next });
                              }}
                            />
                            <input
                              className={inputClass}
                              placeholder="Description"
                              value={row.description}
                              onChange={(e) => {
                                const next = [...content.propertyDetails];
                                next[i] = { ...row, description: e.target.value };
                                setContent({ ...content, propertyDetails: next });
                              }}
                            />
                          </div>
                        ))}
                        <button
                          type="button"
                          className="font-manrope text-sm text-[var(--dash-accent)] hover:underline"
                          onClick={() =>
                            setContent({
                              ...content,
                              propertyDetails: [
                                ...content.propertyDetails,
                                { title: "", description: "", icon: "Home" },
                              ],
                            })
                          }
                        >
                          + Add property detail
                        </button>
                      </div>
                    </div>

                    {content.faq.map((row, i) => (
                      <div key={i} className="grid gap-3 sm:grid-cols-2">
                        <input
                          className={inputClass}
                          placeholder="Question"
                          value={row.question}
                          onChange={(e) => {
                            const next = [...content.faq];
                            next[i] = { ...row, question: e.target.value };
                            setContent({ ...content, faq: next });
                          }}
                        />
                        <input
                          className={inputClass}
                          placeholder="Answer"
                          value={row.answer}
                          onChange={(e) => {
                            const next = [...content.faq];
                            next[i] = { ...row, answer: e.target.value };
                            setContent({ ...content, faq: next });
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="font-manrope text-sm text-[var(--dash-accent)] hover:underline"
                      onClick={() =>
                        setContent({
                          ...content,
                          faq: [...content.faq, { question: "", answer: "" }],
                        })
                      }
                    >
                      + Add FAQ
                    </button>

                    <div className="grid gap-4 border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-2">
                      <div className="sm:col-span-2">
                        <label className={labelClass}>Public visibility</label>
                        <select
                          className={inputClass}
                          value={basics.status}
                          onChange={(e) => {
                            const status = e.target.value;
                            setBasics({
                              ...basics,
                              status,
                              ...(status === "hidden" ? { bookable: false } : {}),
                            });
                          }}
                        >
                          <option value="active" className="bg-[#1A1C1E]">
                            Live — visible on /villas
                          </option>
                          <option value="maintenance" className="bg-[#1A1C1E]">
                            Maintenance
                          </option>
                          <option value="hidden" className="bg-[#1A1C1E]">
                            Hidden — removed from public site
                          </option>
                        </select>
                      </div>
                      <label className="flex cursor-pointer items-center gap-3 border border-white/10 px-4 py-3 font-manrope text-sm text-white/75">
                        <input
                          type="checkbox"
                          checked={basics.bookable}
                          disabled={basics.status === "hidden"}
                          onChange={(e) =>
                            setBasics({ ...basics, bookable: e.target.checked })
                          }
                          className="h-4 w-4 accent-[var(--dash-accent)] disabled:opacity-40"
                        />
                        Allow online booking (Book Villa)
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 border border-white/10 px-4 py-3 font-manrope text-sm text-white/75">
                        <input
                          type="checkbox"
                          checked={content.hideFromVillasDirectory}
                          disabled={basics.status === "hidden"}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              hideFromVillasDirectory: e.target.checked,
                            })
                          }
                          className="h-4 w-4 accent-[var(--dash-accent)] disabled:opacity-40"
                        />
                        Hide from /villas only (detail URL still works)
                      </label>
                      <p className={`sm:col-span-2 ${hintClass}`}>
                        <strong className="text-white/50">Not bookable:</strong> leave visibility Live and
                        uncheck booking — guests see Enquire + View Villa.{" "}
                        <strong className="text-white/50">Hidden:</strong> villa disappears from the site.
                      </p>
                    </div>

                    <div className="border border-[var(--dash-accent-border)]/40 bg-[var(--dash-accent-muted)]/30 p-4">
                      <p className={labelClass}>Go-live checklist</p>
                      <ul className="mt-2 space-y-2 font-manrope text-sm text-white/75">
                        <li>
                          {basics.status === "active"
                            ? "✓"
                            : "○"}{" "}
                          Set visibility to <strong className="text-white">Live</strong> for /villas listing
                        </li>
                        <li>
                          {basics.bookable ? "✓" : "○"} Enable online booking if guests should use /book
                        </li>
                        <li>
                          ○ Add Axis Rooms property / room / rate IDs in{" "}
                          <Link
                            href="/dashboard/settings/staah"
                            className="text-[var(--dash-accent)] hover:underline"
                          >
                            Axis Rooms settings
                          </Link>{" "}
                          (CSV export for onboarding team)
                        </li>
                        <li>
                          {previewId ? "✓" : "○"} Preview public page before sharing links
                        </li>
                      </ul>
                    </div>

                    {previewId && (
                      <a
                        href={`/villas/${previewId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-manrope text-sm text-[var(--dash-accent)] hover:underline"
                      >
                        Preview public page
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}

                {error && (
                  <p className="mt-4 font-manrope text-sm text-red-400">{error}</p>
                )}
              </>
            )}
          </div>

          <div className="property-wizard__footer sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#1A1C1E]/95 p-5 backdrop-blur-sm">
            <button
              type="button"
              onClick={() => (step > 0 ? setStep(step - 1) : onClose())}
              className="inline-flex min-h-[44px] items-center gap-2 border border-white/20 px-4 font-manrope text-xs font-bold uppercase tracking-wider text-white/70 hover:border-white/40"
            >
              <ArrowLeft className="h-4 w-4" />
              {step > 0 ? "Back" : "Cancel"}
            </button>
            <div className="flex gap-2">
              {step < STEPS.length - 1 ? (
                <button
                  type="button"
                  disabled={!canAdvance}
                  onClick={() => setStep(step + 1)}
                  className={`${dash.btn} ${dash.btnAccent}`}
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                canWrite && (
                  <button
                    type="submit"
                    disabled={saving || loading}
                    className={`${dash.btn} ${dash.btnAccent}`}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {mode === "create" ? "Create property" : "Save & publish"}
                  </button>
                )
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

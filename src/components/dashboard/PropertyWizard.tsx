"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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
import { ImageUploadField } from "./ImageUploadField";

const inputClass =
  "w-full border border-white/15 bg-black/20 px-3 py-2.5 font-manrope text-[length:var(--fs-body)] text-white placeholder:text-white/30 focus:border-[#EFCD62]/60 focus:outline-none";
const labelClass =
  "mb-1.5 block font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-widest text-[#EFCD62]/90";
const hintClass = "mt-1 font-manrope text-xs text-white/35";

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

type ContentDraft = {
  description: string;
  socialProof: string;
  categories: string;
  perfectForTags: string;
  amenities: AmenityRow[];
  activities: ActivityRow[];
  categorizedSpaces: SpaceRow[];
  images: string;
  youtubeUrl: string;
  videoThumbnail: string;
  address: string;
  distance: string;
  googleMapsUrl: string;
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
  "Story",
  "Amenities",
  "Spaces",
  "Experiences",
  "Publish",
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
      address?: string;
      distance?: string;
      googleMapsUrl?: string;
    };
    video?: { youtubeUrl?: string; thumbnail?: string };
    faq?: FaqRow[];
    hideFromVillasDirectory?: boolean;
  };

  return {
    description: c.description ?? "",
    socialProof: c.socialProof ?? "",
    categories: listToLines(c.categories),
    perfectForTags: listToLines(c.perfectForTags),
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
      address: draft.address.trim() || undefined,
      distance: draft.distance.trim() || undefined,
      googleMapsUrl: draft.googleMapsUrl.trim() || undefined,
    },
    video: draft.youtubeUrl.trim()
      ? {
          youtubeUrl: draft.youtubeUrl.trim(),
          thumbnail: draft.videoThumbnail.trim() || undefined,
        }
      : undefined,
    faq: draft.faq
      .filter((f) => f.question.trim())
      .map((f) => ({
        question: f.question.trim(),
        answer: f.answer.trim(),
      })),
    hideFromVillasDirectory: draft.hideFromVillasDirectory,
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
        const res = await dashboardFetch("/api/dashboard/villas", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slug: basics.slug.trim(),
            retreatId: basics.retreatId.trim() || basics.slug.trim(),
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
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Create failed");
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
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        if (!res.ok) throw new Error(data.error ?? "Save failed");
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 p-4">
      <div
        className={`${GLASS_CHROME_FRAME_CLASS} relative flex max-h-[95dvh] w-full max-w-4xl flex-col border border-white/10 shadow-2xl`}
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
                Changes save to MongoDB and reflect on{" "}
                <code className="text-[#EFCD62]/80">/villas/[id]</code> within
                ~30s cache.
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

          <div className="mt-6 flex flex-wrap gap-2">
            {STEPS.map((label, i) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(i)}
                className={`min-h-[36px] border px-3 font-manrope text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  step === i
                    ? "border-[#EFCD62] bg-[#EFCD62]/15 text-[#EFCD62]"
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
                <Loader2 className="h-6 w-6 animate-spin text-[#EFCD62]" />
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
                              const v = e.target.value.toLowerCase();
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
                              setBasics({ ...basics, retreatId: e.target.value })
                            }
                            placeholder="Usually same as slug"
                          />
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
                  <div className="space-y-4">
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea
                        className={`${inputClass} min-h-[140px] resize-y`}
                        value={content.description}
                        onChange={(e) =>
                          setContent({ ...content, description: e.target.value })
                        }
                        rows={6}
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
                        placeholder="Loved by 500+ guests"
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Categories</label>
                        <textarea
                          className={`${inputClass} min-h-[100px]`}
                          value={content.categories}
                          onChange={(e) =>
                            setContent({ ...content, categories: e.target.value })
                          }
                          placeholder="One per line"
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
                          placeholder="Weddings&#10;Corporate offsites"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    {content.amenities.map((row, i) => (
                      <div
                        key={i}
                        className="grid gap-3 border border-white/10 bg-white/[0.02] p-4 sm:grid-cols-3"
                      >
                        <input
                          className={inputClass}
                          placeholder="Label"
                          value={row.label}
                          onChange={(e) => {
                            const next = [...content.amenities];
                            next[i] = { ...row, label: e.target.value };
                            setContent({ ...content, amenities: next });
                          }}
                        />
                        <input
                          className={inputClass}
                          placeholder="Lucide icon name"
                          value={row.icon}
                          onChange={(e) => {
                            const next = [...content.amenities];
                            next[i] = { ...row, icon: e.target.value };
                            setContent({ ...content, amenities: next });
                          }}
                        />
                        <input
                          className={inputClass}
                          placeholder="Short description"
                          value={row.description}
                          onChange={(e) => {
                            const next = [...content.amenities];
                            next[i] = { ...row, description: e.target.value };
                            setContent({ ...content, amenities: next });
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="font-manrope text-sm text-[#EFCD62] hover:underline"
                      onClick={() =>
                        setContent({
                          ...content,
                          amenities: [
                            ...content.amenities,
                            { label: "", icon: "Sparkles", description: "" },
                          ],
                        })
                      }
                    >
                      + Add amenity
                    </button>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-6">
                    <div>
                      <label className={labelClass}>Gallery paths</label>
                      <textarea
                        className={`${inputClass} min-h-[100px] font-mono text-sm`}
                        value={content.images}
                        onChange={(e) =>
                          setContent({ ...content, images: e.target.value })
                        }
                        placeholder="One image path per line"
                      />
                    </div>
                    {content.categorizedSpaces.map((row, i) => (
                      <div
                        key={row.id}
                        className="space-y-3 border border-white/10 p-4"
                      >
                        <div className="grid gap-3 sm:grid-cols-2">
                          <input
                            className={inputClass}
                            placeholder="Space title"
                            value={row.title}
                            onChange={(e) => {
                              const next = [...content.categorizedSpaces];
                              next[i] = { ...row, title: e.target.value };
                              setContent({ ...content, categorizedSpaces: next });
                            }}
                          />
                          <input
                            className={inputClass}
                            placeholder="Category"
                            value={row.category}
                            onChange={(e) => {
                              const next = [...content.categorizedSpaces];
                              next[i] = { ...row, category: e.target.value };
                              setContent({ ...content, categorizedSpaces: next });
                            }}
                          />
                        </div>
                        <input
                          className={inputClass}
                          placeholder="Amenities (comma-separated)"
                          value={row.amenities}
                          onChange={(e) => {
                            const next = [...content.categorizedSpaces];
                            next[i] = { ...row, amenities: e.target.value };
                            setContent({ ...content, categorizedSpaces: next });
                          }}
                        />
                        <textarea
                          className={`${inputClass} min-h-[80px] font-mono text-sm`}
                          placeholder="Image paths (one per line)"
                          value={row.images}
                          onChange={(e) => {
                            const next = [...content.categorizedSpaces];
                            next[i] = { ...row, images: e.target.value };
                            setContent({ ...content, categorizedSpaces: next });
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="font-manrope text-sm text-[#EFCD62] hover:underline"
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
                    {content.activities.map((row, i) => (
                      <div
                        key={i}
                        className="space-y-3 border border-white/10 p-4"
                      >
                        <input
                          className={inputClass}
                          placeholder="Experience title"
                          value={row.title}
                          onChange={(e) => {
                            const next = [...content.activities];
                            next[i] = { ...row, title: e.target.value };
                            setContent({ ...content, activities: next });
                          }}
                        />
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
                        <textarea
                          className={`${inputClass} min-h-[60px]`}
                          placeholder="Description"
                          value={row.description}
                          onChange={(e) => {
                            const next = [...content.activities];
                            next[i] = { ...row, description: e.target.value };
                            setContent({ ...content, activities: next });
                          }}
                        />
                      </div>
                    ))}
                    <button
                      type="button"
                      className="font-manrope text-sm text-[#EFCD62] hover:underline"
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
                    <div className="border-t border-white/10 pt-4">
                      <label className={labelClass}>YouTube walkthrough URL</label>
                      <input
                        className={inputClass}
                        value={content.youtubeUrl}
                        onChange={(e) =>
                          setContent({ ...content, youtubeUrl: e.target.value })
                        }
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      <div className="mt-4">
                        <ImageUploadField
                          label="Video thumbnail (optional)"
                          value={content.videoThumbnail}
                          onChange={(url) =>
                            setContent({ ...content, videoThumbnail: url })
                          }
                          villaSlug={slugForUpload}
                          disabled={!canWrite}
                        />
                      </div>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>Address</label>
                        <input
                          className={inputClass}
                          value={content.address}
                          onChange={(e) =>
                            setContent({ ...content, address: e.target.value })
                          }
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Distance label</label>
                        <input
                          className={inputClass}
                          value={content.distance}
                          onChange={(e) =>
                            setContent({ ...content, distance: e.target.value })
                          }
                          placeholder="45 min from Bangalore"
                        />
                      </div>
                      <div className="sm:col-span-2">
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
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-6">
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
                      className="font-manrope text-sm text-[#EFCD62] hover:underline"
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
                      <div>
                        <label className={labelClass}>Visibility status</label>
                        <select
                          className={inputClass}
                          value={basics.status}
                          onChange={(e) =>
                            setBasics({ ...basics, status: e.target.value })
                          }
                        >
                          <option value="active" className="bg-[#1A1C1E]">
                            Active — visible
                          </option>
                          <option value="maintenance" className="bg-[#1A1C1E]">
                            Maintenance
                          </option>
                          <option value="hidden" className="bg-[#1A1C1E]">
                            Hidden — admin only
                          </option>
                        </select>
                      </div>
                      <label className="flex cursor-pointer items-center gap-3 self-end border border-white/10 px-4 py-3 font-manrope text-sm text-white/75">
                        <input
                          type="checkbox"
                          checked={basics.bookable}
                          onChange={(e) =>
                            setBasics({ ...basics, bookable: e.target.checked })
                          }
                          className="h-4 w-4 accent-[#EFCD62]"
                        />
                        Bookable on /book
                      </label>
                      <label className="flex cursor-pointer items-center gap-3 border border-white/10 px-4 py-3 font-manrope text-sm text-white/75 sm:col-span-2">
                        <input
                          type="checkbox"
                          checked={content.hideFromVillasDirectory}
                          onChange={(e) =>
                            setContent({
                              ...content,
                              hideFromVillasDirectory: e.target.checked,
                            })
                          }
                          className="h-4 w-4 accent-[#EFCD62]"
                        />
                        Hide from /villas directory (detail page still reachable by URL)
                      </label>
                    </div>

                    {previewId && (
                      <a
                        href={`/villas/${previewId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-manrope text-sm text-[#EFCD62] hover:underline"
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

          <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 bg-[#1A1C1E]/95 p-5 backdrop-blur-sm">
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
                  className="inline-flex min-h-[44px] items-center gap-2 bg-[#EFCD62] px-5 font-manrope text-xs font-bold uppercase tracking-wider text-[#1A1C1E] hover:bg-white disabled:opacity-40"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </button>
              ) : (
                canWrite && (
                  <button
                    type="submit"
                    disabled={saving || loading}
                    className="inline-flex min-h-[44px] items-center gap-2 bg-[#EFCD62] px-5 font-manrope text-xs font-bold uppercase tracking-wider text-[#1A1C1E] hover:bg-white disabled:opacity-40"
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

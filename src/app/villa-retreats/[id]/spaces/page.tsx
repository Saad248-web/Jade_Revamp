"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Headphones } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { VILLAS } from "@/lib/mockData";
import { Villa, VillaSpaceGroup } from "@/lib/types";
import {
  DOME_VIDEO_URLS,
  type DomeVideoKey,
  getYouTubeId,
} from "@/lib/videoUtils";
import {
  getDomeColorFromVillaId,
  isDomeEstateId,
} from "@/lib/domeVillaIds";

export default function VillaSpacesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const villa = VILLAS.find((v) => v.id === id) as Villa | undefined;

  const domeColor = getDomeColorFromVillaId(id);
  const isDomeEstate = isDomeEstateId(id);

  const [activeCategory, setActiveCategory] = useState(
    isDomeEstate ? "Blue Dome" : "All",
  );
  const [activeDomeVideo, setActiveDomeVideo] = useState<DomeVideoKey>("blue");
  const [overrideSpaces, setOverrideSpaces] = useState<
    VillaSpaceGroup[] | null
  >(null);

  // Load full media-derived categorized spaces (uses all images in public folder)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/villa-retreats/${id}/media?v=2`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled && Array.isArray(data?.categorizedSpaces)) {
          setOverrideSpaces(data.categorizedSpaces);
        }
      } catch {
        // ignore
      }
    }
    if (id) load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  const categories = useMemo(() => {
    const base = overrideSpaces || villa?.categorizedSpaces || [];
    const cats = Array.from(
      new Set(base.map((s: VillaSpaceGroup) => s.category)),
    ).filter((c) => typeof c === "string" && c.length > 0) as string[];
    // Dome Villa Retreats: no "All" — only the three dome color tabs plus Video.
    if (isDomeEstate) return [...cats, "Video"];
    // Prefer predictable ordering: show "All", then category groups, then Video
    return ["All", ...cats, "Video"];
  }, [overrideSpaces, villa?.categorizedSpaces, isDomeEstate]);

  const filteredSpaces = useMemo(() => {
    const base = overrideSpaces || villa?.categorizedSpaces;
    if (!base) return [];
    if (activeCategory === "All") return base;
    if (activeCategory === "Video") return []; // Special case
    return base.filter((s: VillaSpaceGroup) => s.category === activeCategory);
  }, [villa, activeCategory, overrideSpaces]);

  if (!villa) {
    return (
      <div className="min-h-screen bg-[#1A1C1E] flex items-center justify-center text-white font-philosopher text-2xl">
        Villa Not Found
      </div>
    );
  }

  return (
    <main className="bg-[#1A1C1E] min-h-screen">
      {/* STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-[#1A1C1E] border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-white font-philosopher text-xl md:text-2xl capitalize">
            {villa.name}
          </h1>
        </div>
        <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all bg-white/5">
          <Headphones className="w-5 h-5" />
        </button>
      </header>

      {/* FILTER BAR - STICKY BELOW HEADER */}
      <nav className="sticky top-[73px] z-40 bg-[#1A1C1E]/80 backdrop-blur-md border-b border-white/5 px-6 py-4">
        <div className="flex gap-3 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${ activeCategory === cat ? "bg-[#EFCD62] text-black" : "bg-white/5 text-white/60 hover:bg-white/10" }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* SPACES CONTENT */}
      <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-12">
        {activeCategory === "Video" ? (
          <section className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <h2 className="text-white font-philosopher text-3xl md:text-4xl">
                Video Walkthrough
              </h2>

              {isDomeEstate && (
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: "blue", label: "Blue Dome", dot: "#3b82f6" },
                      { id: "red", label: "Red Dome", dot: "#ef4444" },
                      { id: "yellow", label: "Yellow Dome", dot: "#eab308" },
                    ] as const
                  ).map((t) => {
                    const isActive = activeDomeVideo === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setActiveDomeVideo(t.id)}
                        className={`flex items-center gap-2 px-4 py-2 text-[10px] md:text-[11px] uppercase tracking-[0.25em] font-bold border transition-colors ${ isActive ? "bg-[#EFCD62] text-black border-[#EFCD62]" : "bg-white/5 text-white/70 border-white/10 hover:text-white hover:bg-white/10" }`}
                      >
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full border border-white/30"
                          style={{ backgroundColor: t.dot }}
                        />
                        {t.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {(() => {
              const chosenUrl = domeColor
                ? DOME_VIDEO_URLS[domeColor]
                : isDomeEstate
                  ? DOME_VIDEO_URLS[activeDomeVideo]
                  : (villa.video?.youtubeUrl ?? "");
              const ytId = getYouTubeId(chosenUrl);

              if (ytId) {
                return (
                  <div className="relative aspect-video w-full bg-gray-900 overflow-hidden border border-white/10">
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      title={`${villa.name} Walkthrough`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                    {villa.video?.duration && !isDomeEstate && !domeColor && (
                      <div className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 text-[10px] text-white font-bold pointer-events-none">
                        {villa.video.duration}
                      </div>
                    )}
                  </div>
                );
              }

              if (villa.video) {
                return (
                  <div className="relative aspect-video w-full group overflow-hidden border border-white/10">
                    {(villa.video.thumbnail || villa.image) && (
                      <Image
                        src={villa.video.thumbnail || villa.image || ""}
                        alt="Video Thumbnail"
                        fill
                        className="object-cover opacity-60"
                        sizes="(max-width: 768px) 100vw, 1200px"
                        loading="lazy"
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center shadow-2xl">
                        <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-white border-b-[10px] border-b-transparent ml-1" />
                      </div>
                    </div>
                    {villa.video.duration && (
                      <div className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 text-[10px] text-white font-bold">
                        {villa.video.duration}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <div className="h-64 border border-white/10 flex items-center justify-center text-white/40 italic">
                  Video not available for this retreat.
                </div>
              );
            })()}
          </section>
        ) : filteredSpaces.length > 0 ? (
          filteredSpaces.map((space: VillaSpaceGroup) => (
            <section key={space.id} className="flex flex-col gap-5">
              <div>
                <h2 className="text-white font-philosopher text-3xl md:text-4xl mb-2">
                  {space.title}
                </h2>
                <div className="text-white/40 text-[11px] md:text-[13px] font-manrope font-medium flex flex-wrap gap-x-2">
                  {space.amenities.map((amenity: string, idx: number) => (
                    <span key={idx} className="flex items-center gap-2">
                      {amenity}
                      {idx < space.amenities.length - 1 && <span>·</span>}
                    </span>
                  ))}
                </div>
              </div>

              <div className="jade-hscroll-track flex gap-3 overflow-x-auto pb-4 scrollbar-none snap-x -mx-6 px-6 md:mx-0 md:px-0">
                {(space.images.length > 0 ? space.images : ["", ""]).map(
                  (img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative min-w-[300px] md:min-w-[500px] aspect-[4/3] md:aspect-[16/9] bg-white/5 snap-start overflow-hidden group jade-hscroll-view-item"
                    >
                      {img && img.length > 0 && (
                        <Image
                          src={img}
                          alt={`${space.title} ${idx + 1}`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 500px"
                          loading="lazy"
                        />
                      )}
                      {!img && (
                        <div className="w-full h-full flex items-center justify-center text-white/10 uppercase tracking-widest text-xs font-bold">
                          {space.title} Image Coming Soon
                        </div>
                      )}
                    </div>
                  ),
                )}
              </div>
            </section>
          ))
        ) : (
          <div className="h-64 border border-white/10 flex items-center justify-center text-white/40 italic">
            No spaces found for this category.
          </div>
        )}
      </div>
    </main>
  );
}

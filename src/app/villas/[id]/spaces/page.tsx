"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Headphones, Play } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { VILLAS } from "@/lib/mockData";
import { Villa, VillaSpaceGroup } from "@/lib/types";

export default function VillaSpacesPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const villa = VILLAS.find((v) => v.id === id) as Villa | undefined;

  const [activeCategory, setActiveCategory] = useState("All");
  const [overrideSpaces, setOverrideSpaces] = useState<VillaSpaceGroup[] | null>(
    null,
  );

  // Load full media-derived categorized spaces (uses all images in public folder)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/villas/${id}/media`);
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
    const cats = Array.from(new Set(base.map((s: VillaSpaceGroup) => s.category))).filter(
      (c) => typeof c === "string" && c.length > 0,
    ) as string[];
    // Prefer predictable ordering: show "All", then category groups, then Video
    return ["All", ...cats, "Video"];
  }, [overrideSpaces, villa?.categorizedSpaces]);

  const filteredSpaces = useMemo(() => {
    const base = overrideSpaces || villa?.categorizedSpaces;
    if (!base) return [];
    if (activeCategory === "All") return base;
    if (activeCategory === "Video") return []; // Special case
    return base.filter(
      (s: VillaSpaceGroup) => s.category === activeCategory,
    );
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
        <div className="flex items-center gap-4">
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
        <div className="flex gap-4 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2 rounded-sm text-[11px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat
                  ? "bg-[#EFCD62] text-black"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </nav>

      {/* SPACES CONTENT */}
      <div className="p-6 md:p-12 max-w-7xl mx-auto flex flex-col gap-16">
        {activeCategory === "Video" ? (
          <section className="flex flex-col gap-8">
            <h2 className="text-white font-philosopher text-3xl md:text-4xl">
              Video Walkthrough
            </h2>
            {villa.video ? (
              <div className="relative aspect-video w-full group overflow-hidden">
                <Image
                  src={villa.video.thumbnail || villa.image || ""}
                  alt="Video Thumbnail"
                  fill
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, 1200px"
                  loading="lazy"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#EFCD62] flex items-center justify-center text-black group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 fill-black ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 px-2 py-1 text-[10px] text-white font-bold">
                  {villa.video.duration}
                </div>
              </div>
            ) : (
              <div className="h-64 border border-white/10 flex items-center justify-center text-white/40 italic">
                Video not available for this retreat.
              </div>
            )}
          </section>
        ) : filteredSpaces.length > 0 ? (
          filteredSpaces.map((space: VillaSpaceGroup) => (
            <section key={space.id} className="flex flex-col gap-6">
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

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-none snap-x -mx-6 px-6 md:mx-0 md:px-0">
                {(space.images.length > 0 ? space.images : ["", ""]).map(
                  (img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative min-w-[300px] md:min-w-[500px] aspect-[4/3] md:aspect-[16/9] bg-white/5 snap-start overflow-hidden group"
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

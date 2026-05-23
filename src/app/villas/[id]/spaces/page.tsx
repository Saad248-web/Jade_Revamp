"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import CallToEnquireLink from "@/components/ui/CallToEnquireLink";
import ScrollHideTopChrome from "@/components/ui/ScrollHideTopChrome";
import { useBatchedScrollHide } from "@/lib/useBatchedScrollHide";
import { VILLA_SPACES_HEADER_HEIGHT_PX } from "@/lib/scrollChromeLayout";
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
import CategoryTabRail from "@/components/ui/CategoryTabRail";
import HorizontalScrollRail from "@/components/ui/HorizontalScrollRail";
import { stickyCategoryTabClass } from "@/lib/stickyTabGlass";
import { VILLA_DETAIL_STICKY_TABS_CHROME_CLASS } from "@/lib/scrollChromeGlass";
import MeanderStrip from "@/components/ui/MeanderStrip";
import { VILLA_DETAIL_SPACING } from "@/components/villa/villaDetailSpacing";
import clsx from "clsx";
import { villaDetailPath } from "@/lib/appRoutes";
import { useSafeBack } from "@/lib/safeBackNavigation";

const vd = VILLA_DETAIL_SPACING;

export default function VillaSpacesPage() {
  const params = useParams();
  const id = params?.id as string;
  const goBack = useSafeBack(villaDetailPath(id));
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
        const res = await fetch(`/api/villas/${id}/media?v=2`);
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
    // Dome Villas: no "All" — only the three dome color tabs plus Video.
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

  const chromeHidden = useBatchedScrollHide();

  if (!villa) {
    return (
      <div className="min-h-screen bg-[#1A1C1E] flex items-center justify-center text-white font-philosopher text-2xl">
        Villa Not Found
      </div>
    );
  }

  return (
    <main className="bg-[#1A1C1E] min-h-screen">
      <ScrollHideTopChrome zIndex="z-50">
        <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={goBack}
              className="p-2 text-white/60 hover:text-white transition-colors shrink-0"
              aria-label="Go back"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-white font-philosopher text-xl md:text-2xl capitalize truncate">
              {villa.name}
            </h1>
          </div>
          <CallToEnquireLink
            ariaLabel="Call support"
            className="w-10 h-10 shrink-0 rounded-full border border-white/10 flex items-center justify-center text-white/60 hover:text-white transition-all bg-white/5"
          />
        </header>
      </ScrollHideTopChrome>
      <div
        className="shrink-0 overflow-hidden"
        style={{ height: chromeHidden ? 0 : VILLA_SPACES_HEADER_HEIGHT_PX }}
        aria-hidden
      />

      {/* Meander scrolls away; category bar sticks — top-0 when action header hidden (villa detail pattern) */}
      <MeanderStrip layout="pageGutter" track="charcoal" />
      <nav
        className={clsx(
          "jade-hscroll-chrome sticky z-40 min-w-0 w-full",
          chromeHidden ? "top-0" : "top-[76px]",
          vd.hScrollViewportEdge,
        )}
      >
        <div className={vd.stickyChromeShell}>
          <div className={VILLA_DETAIL_STICKY_TABS_CHROME_CLASS}>
            <CategoryTabRail
          fadeFrom="#1A1C1E"
          patternFade
          mobileTrackGutter
          trackAriaLabel="Space categories"
          trackClassName="gap-2 sm:gap-3 md:gap-4"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              data-tab-key={cat}
              onClick={() => setActiveCategory(cat)}
              className={clsx(
                stickyCategoryTabClass(activeCategory === cat),
                "flex-shrink-0",
              )}
            >
              {cat}
            </button>
          ))}
            </CategoryTabRail>
          </div>
        </div>
      </nav>

      {/* SPACES CONTENT */}
      <div
        className={clsx(
          "px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col gap-8",
          vd.sectionY,
        )}
      >
        {activeCategory === "Video" ? (
          <section className="flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h2 className="text-white font-philosopher text-3xl md:text-4xl">
                Video Walkthrough
              </h2>

              {isDomeEstate && (
                <CategoryTabRail
                  fadeFrom="#1A1C1E"
                  showFade={false}
                  trackAriaLabel="Dome video"
                  trackClassName="gap-2 py-0"
                  className="w-full max-w-full md:max-w-xl"
                >
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
                        type="button"
                        data-tab-key={t.id}
                        onClick={() => setActiveDomeVideo(t.id)}
                        className={clsx(
                          stickyCategoryTabClass(isActive),
                          "flex-shrink-0 inline-flex items-center gap-2",
                        )}
                      >
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full border border-white/30"
                          style={{ backgroundColor: t.dot }}
                        />
                        {t.label}
                      </button>
                    );
                  })}
                </CategoryTabRail>
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

              <HorizontalScrollRail
                showFade={false}
                mobileViewportEdge
                mobileTrackGutter
                trackClassName="gap-4 pb-4 scrollbar-none snap-x md:scroll-pr-8"
              >
                {(space.images.length > 0 ? space.images : ["", ""]).map(
                  (img: string, idx: number) => (
                    <div
                      key={idx}
                      className="relative min-w-[300px] md:min-w-[500px] flex-shrink-0 aspect-[4/3] md:aspect-[16/9] bg-white/5 snap-start overflow-hidden group jade-hscroll-view-item"
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
              </HorizontalScrollRail>
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

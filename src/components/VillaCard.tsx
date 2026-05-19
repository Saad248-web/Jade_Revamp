"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import JadeImage from "@/components/ui/JadeImage";
import {
  Bed,
  Users,
  Home,
  MapPin,
  ArrowLeft,
  ArrowRight,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { VILLAS } from "@/lib/mockData";
import PrimaryButton from "@/components/PrimaryButton";
import { useBooking } from "@/context/BookingContext";
import { useWishlist } from "@/context/WishlistContext";
import { prettyMediaLabel } from "@/lib/mediaLabels";
import { MEDIA_MANIFEST } from "@/generated/mediaManifest";
import { getHeroOverrideForId } from "@/lib/heroOverrides";
import {
  liquidCarouselBgVariants,
  type HeroSplitCustom,
} from "@/lib/heroSplitCarouselVariants";
import { getVillaGoogleMapsUrl } from "@/lib/googleMapsLinks";
import { usePreloadNeighborImages } from "@/lib/carouselMotion";
import CarouselSwipeLayer from "@/components/ui/CarouselSwipeLayer";

const getManifestEntry = (villa: { name?: string; image?: string }) => {
  // Prefer name lookup (matches `public/Villa_Retreats/<folder>`), fall back to path extraction.
  const byName = villa.name ? (MEDIA_MANIFEST as any).villasByFolder?.[villa.name] : null;
  if (byName) return byName;
  const m = (villa.image || "").match(/^\/Villa_Retreats\/([^/]+)\//);
  if (!m?.[1]) return null;
  try {
    return (MEDIA_MANIFEST as any).villasByFolder?.[decodeURIComponent(m[1])] ?? null;
  } catch {
    return (MEDIA_MANIFEST as any).villasByFolder?.[m[1]] ?? null;
  }
};

interface VillaCardProps {
  villa: (typeof VILLAS)[0];
}

export default function VillaCard({ villa }: VillaCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const router = useRouter();
  const { dateRange, guests } = useBooking();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const [serverMedia, setServerMedia] = useState<{
    hero: string[];
    categorizedSpaces?: Array<{
      title?: string;
      category?: string;
      images?: string[];
    }>;
  } | null>(null);

  const wishlisted = isWishlisted(villa.id);
  const reducedMotion = useReducedMotion();

  const carouselCustom: HeroSplitCustom = {
    dir: direction,
    lowFx: !!reducedMotion,
  };

  const wishlistItem = {
    id: villa.id,
    name: villa.name,
    type: villa.type,
    location: villa.location,
    image: villa.image,
    startingPrice:
      villa.pricing?.stay?.packages?.[0]?.price?.split(" ")[0] ?? null,
  };

  // If user already picked dates + guests (came through booking flow), jump straight to details
  const bookHref = (() => {
    const hasDates = dateRange.checkIn && dateRange.checkOut;
    const hasGuests = guests.adults > 0;
    return hasDates && hasGuests
      ? `/book?villa=${villa.id}&step=details`
      : `/book?villa=${villa.id}`;
  })();

  // Build a rich carousel: hero image first, then gallery (or spaces fallback)
  const validImage = (img: string | undefined) => img && img.length > 0;
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        // Avoid stale cached media during active image renames/updates.
        const res = await fetch(`/api/villas/${villa.id}/media?v=4`);
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) setServerMedia(data);
      } catch {
        // ignore
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [villa.id]);

  const images: { name: string; image: string }[] = useMemo(() => {
    const list: { name: string; image: string }[] = [];

    const manifestEntry = getManifestEntry(villa);
    const heroFromApi = serverMedia?.hero?.[0];
    const manifestHero = manifestEntry?.hero?.[0];
    const overrideHero = getHeroOverrideForId(villa.id)?.[0];
    const hero = validImage(heroFromApi)
      ? heroFromApi
      : validImage(overrideHero)
        ? overrideHero
        : validImage(manifestHero)
        ? manifestHero
        : villa.image;
    if (validImage(hero)) list.push({ name: "Main", image: hero as string });

    // Prefer API categorized spaces: pick one representative per category
    const cat = (
      (serverMedia?.categorizedSpaces ||
        manifestEntry?.categorizedSpaces ||
        []) as Array<{
        title?: string;
        category?: string;
        images?: string[];
      }>
    )
      .map((g) => {
        const img = g.images?.find((x: string) => validImage(x));
        if (!img) return null;
        const title = g.title || g.category || "Space";
        return {
          name: title,
          image: img,
        };
      })
      .filter(Boolean) as { name: string; image: string }[];

    if (cat.length > 0) {
      list.push(...cat);
      return list.map((x) => ({
        name: prettyMediaLabel({
          url: x.image,
          fallback: x.name,
          kind: "space",
        }),
        image: x.image,
      }));
    }

    // Fall back to manifest spaces if present (preferred over potentially stale `villa.images`).
    const manifestSpaces = (manifestEntry?.spaces || [])
      .filter((img: string) => validImage(img))
      .slice(0, 6)
      .map((img: string, i: number) => ({
        name: prettyMediaLabel({
          url: img,
          fallback: `Space ${i + 1}`,
          kind: "space",
        }),
        image: img,
      }));
    if (manifestSpaces.length > 0) return list.concat(manifestSpaces);

    if (list.length > 0) return list;
    return [{ name: "Main", image: "" }];
  }, [serverMedia, villa.id, villa.image, villa.name]);

  useEffect(() => {
    if (currentImageIndex < images.length) return;
    setCurrentImageIndex(0);
  }, [images.length, currentImageIndex]);

  const nextImage = () => {
    setDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const currentSpace = images[currentImageIndex];

  const imageUrls = useMemo(
    () => images.map((i) => i.image).filter((img) => validImage(img)),
    [images],
  );
  usePreloadNeighborImages(imageUrls, currentImageIndex);

  // Helper to extract the lowest price string if available
  const getStartingPrice = () => {
    if (villa.pricing?.stay?.packages?.[0]?.price) {
      return villa.pricing.stay.packages[0].price.split(" ")[0]; // Just grab "₹43,500"
    }
    return null;
  };
  const startingPrice = getStartingPrice();

  return (
    <motion.div className="flex w-full flex-col gap-5 md:flex-row md:items-start pointer-events-auto">
      {/* IMAGE CONTAINER */}
      <div
        className="relative w-full md:w-[45%] md:flex-shrink-0 aspect-[4/3] md:max-h-[480px] overflow-hidden rounded-md group bg-white/5"
        style={{ perspective: "1400px" }}
      >
        <AnimatePresence mode="sync" initial={false} custom={carouselCustom}>
          <motion.div
            key={`${villa.id}-${currentImageIndex}`}
            custom={carouselCustom}
            variants={liquidCarouselBgVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            {validImage(currentSpace?.image) ? (
              <JadeImage
                src={currentSpace.image}
                alt={`${villa.name} - ${currentSpace.name}`}
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 45vw"
                priority={currentImageIndex === 0}
                loading={currentImageIndex === 0 ? "eager" : "lazy"}
              />
            ) : (
              <div className="absolute inset-0 bg-white/5 flex items-center justify-center text-white/20 text-xs font-bold uppercase tracking-widest">
                Image Coming Soon
              </div>
            )}
            {/* Dark gradient overlay for bottom text */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
          </motion.div>
        </AnimatePresence>

        <CarouselSwipeLayer
          onPrev={prevImage}
          onNext={nextImage}
          slideCount={images.length}
          className="absolute inset-0 z-[8] touch-pan-y"
        />

        {/* WISHLIST HEART */}
        <button
          onClick={() => toggleWishlist(wishlistItem)}
          aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-9 h-9 flex items-center justify-center bg-black/40 backdrop-blur-sm border border-white/20 hover:border-white/60 transition-colors rounded-sm"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${ wishlisted ? "fill-red-400 text-red-400" : "text-white/70" }`}
          />
        </button>

        {/* Slide label + carousel controls — label always visible (mobile + desktop) */}
        <div className="absolute bottom-3 sm:bottom-4 left-3 right-3 sm:left-4 sm:right-4 z-10 flex items-center justify-between gap-1.5 sm:gap-2 pointer-events-none">
          {images.length > 1 ? (
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="pointer-events-auto shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-sm"
            >
              <ArrowLeft className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          ) : (
            <span className="shrink-0 w-10 h-10 md:w-12 md:h-12" aria-hidden />
          )}

          <p
            className="flex-1 min-w-0 px-0.5 sm:px-1 text-center text-white text-gh-label font-manrope font-bold tracking-[0.2em] sm:tracking-widest uppercase line-clamp-2 break-words [overflow-wrap:anywhere]"
            title={currentSpace.name || "VIEW"}
          >
            {currentSpace.name || "VIEW"}
          </p>

          {images.length > 1 ? (
            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="pointer-events-auto shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-white hover:text-black transition-colors rounded-sm"
            >
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          ) : (
            <span className="shrink-0 w-10 h-10 md:w-12 md:h-12" aria-hidden />
          )}
        </div>
      </div>

      {/* DETAILS CONTAINER */}
      <div className="flex min-w-0 flex-1 flex-col text-left md:py-2">
        <span
          className="text-[#EFCD62] text-gh-label font-manrope font-bold tracking-[0.2em] uppercase"
          style={{ marginBottom: "clamp(4px, 0.64vw, 8px)" }}
        >
          {villa.type}
        </span>
        <h2
          className="font-philosopher text-gh-h2 text-white leading-snug"
          style={{ marginBottom: "clamp(4px, 0.512vw, 8px)" }}
        >
          {villa.name}
        </h2>
        <a
          href={getVillaGoogleMapsUrl(villa)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-white/60 w-fit max-w-full rounded-sm outline-none hover:text-[#EFCD62] transition-colors focus-visible:ring-2 focus-visible:ring-[#EFCD62]/55"
          style={{ marginBottom: "clamp(8px, 1.28vw, 10.2px)" }}
        >
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="font-manrope text-gh-body hover:underline underline-offset-4">{villa.location}</span>
        </a>

        <p
          className="font-manrope text-white/70 leading-relaxed text-gh-desc line-clamp-2 lg:line-clamp-none"
          style={{ marginBottom: "clamp(8px, 1.28vw, 10.2px)" }}
        >
          {villa.description}
        </p>

        {/* Stats Row */}
        <div className="flex flex-nowrap overflow-x-auto items-center gap-x-4 mb-3 text-white/80 font-manrope text-gh-label [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
          <div className="flex shrink-0 items-center gap-2">
            <Bed className="w-4 h-4 text-[#EFCD62]" />
            <span className="whitespace-nowrap">{villa.stats.stay}</span>
          </div>
          <div className="shrink-0 w-1 h-1 rounded-full bg-white/20" />
          <div className="flex shrink-0 items-center gap-2">
            <Users className="w-4 h-4 text-[#EFCD62]" />
            <span className="whitespace-nowrap">{villa.stats.events}</span>
          </div>
          <div className="shrink-0 w-1 h-1 rounded-full bg-white/20" />
          <div className="flex shrink-0 items-center gap-2">
            <Home className="w-4 h-4 text-[#EFCD62]" />
            <span className="whitespace-nowrap">{villa.stats.bhk}</span>
          </div>
          {"lawn" in villa.stats && (villa.stats as any).lawn && (
            <>
              <div className="shrink-0 w-1 h-1 rounded-full bg-white/20" />
              <span className="shrink-0 whitespace-nowrap">
                {(villa.stats as any).lawn}
              </span>
            </>
          )}
        </div>

        {/* Perfect For Tags */}
        <div className="flex flex-nowrap overflow-x-auto items-center gap-2 mb-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:none]">
          <span className="shrink-0 text-white/40 text-gh-label font-manrope font-bold uppercase tracking-wider mr-1">
            Perfect for:
          </span>
          {(villa.perfectForTags ?? []).map((title, idx) => (
              <span
                key={`${title}-${idx}`}
                className="shrink-0 whitespace-nowrap bg-white/5 border border-white/10 text-white/80 text-gh-label px-2.5 py-1 rounded-sm font-manrope"
              >
                {title}
              </span>
            ))}
        </div>

        {/* Action Row */}
        <div className="flex flex-row items-center justify-between gap-2 md:gap-3 mt-auto">
          {/* Price */}
          <div className="text-white font-manrope font-bold text-gh-villa-footer-row tracking-wide line-clamp-2 md:line-clamp-1">
            {startingPrice || "Upon Request"}{" "}
            <span className="text-white/80 font-normal md:font-bold md:text-white inline-block">
              onwards
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-stretch gap-2 md:gap-2.5 shrink-0 h-[clamp(44px,5vw,52px)]">
            <Link
              href={`/villas/${villa.id}?autoScroll=true`}
              className="h-full inline-flex items-center justify-center border border-white/20 text-white hover:bg-white hover:text-black transition-colors px-3 md:px-5 font-manrope font-bold text-gh-villa-footer-row tracking-widest uppercase text-center rounded-sm whitespace-nowrap"
            >
              VIEW VILLA
            </Link>
            <PrimaryButton
              withArrow={false}
              onClick={() => router.push(bookHref)}
              className="h-full py-0 whitespace-nowrap text-gh-villa-footer-row"
            >
              BOOK VILLA
            </PrimaryButton>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

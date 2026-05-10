"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLayoutEffect, useRef, useState } from "react";
import clsx from "clsx";
import { useDemo1JsFrame } from "@/lib/useDemo1JsFrame";
import "./experience-sda.css";

/** Same assets + copy as `ExperiencesScrollSection` — horizontal scroll-driven motion instead of vertical Framer carousel. */
const PANELS = [
  {
    id: "weekend",
    title: "Weekend Getaways",
    subtext:
      "A day or two with your friends and family away from the bustling city in the wilderness is truly on everyone’s wishlist.",
    cta: "SEE WHAT A GETAWAY LOOKS LIKE",
    href: "/weekend-getaways",
    image: "/Experiences/Weekend Getaways/1-Hero/casual stays.webp",
  },
  {
    id: "celebrations",
    title: "Celebrations & Parties",
    subtext:
      "Birthdays, pool parties and bachelor celebrations unfold across private farmhouse villas with pools, open lawns, and entertainment-ready spaces.",
    cta: "SEE HOW CELEBRATIONS COME ALIVE",
    href: "/party-villas#spaces-for-celebrations",
    image: "/Experiences/Party Villas/1-Hero/Pool Parties.webp",
  },
  {
    id: "weddings",
    title: "Weddings",
    subtext:
      "Intimate ceremonies to grand, multi-day wedding celebrations, set amid private gardens, sprawling lawns, and luxury rooms.",
    cta: "SEE HOW WEDDINGS UNFOLD",
    href: "/weddings",
    image: "/Experiences/Weddings/1-Hero/2 (1).webp",
  },
  {
    id: "corporate",
    title: "Corporate Offsites",
    subtext:
      "Unwinding and ice-breaking sessions with colleagues, away from cubicles and glass walls, in private farmhouses ideal for offsites or workations.",
    cta: "SEE HOW TEAMS GATHER",
    href: "/corporate-retreats",
    image: "/Experiences/Corporate Retreats/1-Hero/xhero.webp",
  },
  {
    id: "wellness",
    title: "Wellness Retreats",
    subtext:
      "Element-led wellness restoration through mud baths, massages, spa and aroma therapies, designed for deep rejuvenation.",
    cta: "SEE HOW RETREAT TAKES SHAPE",
    href: "/villas?category=Wellness Retreats",
    image:
      "/Experiences/Weekend Getaways/2-What Weekends Look like/Nature & Nearby Escapes.webp",
  },
  {
    id: "caravans",
    title: "Journeys in Caravans",
    subtext:
      "Luxury motor caravans carry the idea of private retreat onto the road, offering comfort and privacy for glamping, pilgrimages or any evolving journeys.",
    cta: "SEE HOW THE JOURNEY UNFOLDS",
    href: "/caravans",
    image: "/Experiences/Caravan/1-Hero/6.webp",
  },
  {
    id: "private-villas",
    title: "Private Villas",
    subtext:
      "A curated collection of fully private farmhouses, suited for everything from quiet stays to vibrant celebrations and bespoke experiences.",
    cta: "SEE THE VILLAS THAT HOST IT ALL",
    href: "/villas",
    image: "/Villa_Retreats/Magnolia/Hero/hero.webp",
  },
] as const;

const TL_GROW = [
  "experience-sda-tl-grow-1",
  "experience-sda-tl-grow-2",
  "experience-sda-tl-grow-3",
  "experience-sda-tl-grow-4",
  "experience-sda-tl-grow-5",
  "experience-sda-tl-grow-6",
  "experience-sda-tl-grow-7",
] as const;

const TL_PAGE = [
  "experience-sda-tl-page-1",
  "experience-sda-tl-page-2",
  "experience-sda-tl-page-3",
  "experience-sda-tl-page-4",
  "experience-sda-tl-page-5",
  "experience-sda-tl-page-6",
  "experience-sda-tl-page-7",
] as const;

const TL_TEXT = [
  "experience-sda-tl-text-1",
  "experience-sda-tl-text-2",
  "experience-sda-tl-text-3",
  "experience-sda-tl-text-4",
  "experience-sda-tl-text-5",
  "experience-sda-tl-text-6",
  "experience-sda-tl-text-7",
] as const;

const TL_TEXT_UP = [
  "experience-sda-tl-text-up-1",
  "experience-sda-tl-text-up-2",
  "experience-sda-tl-text-up-3",
  "experience-sda-tl-text-up-4",
  "experience-sda-tl-text-up-5",
  "experience-sda-tl-text-up-6",
  "experience-sda-tl-text-up-7",
] as const;

/**
 * Only Chromium reliably runs named scroll + view timelines used by this page.
 * Firefox may report `animation-timeline` support without full scroll/view wiring → stuck keyframes / “black” hero.
 * Safari uses WebKit — keep JS fallback unless we opt in later with real feature probes.
 */
function supportsNativeScrollDriven(): boolean {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }
  if (!CSS.supports("animation-timeline", "auto")) return false;
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent;
  if (/Firefox\//i.test(ua)) return false;
  /* iOS Chrome reports like Safari; still Chromium-based. */
  if (/CriOS/i.test(ua)) return true;
  const isWebKitSafari =
    /Safari\//i.test(ua) && !/Chrome\//i.test(ua) && !/Chromium\//i.test(ua);
  if (isWebKitSafari) return false;
  const isChromiumFamily =
    /Chrome\//i.test(ua) ||
    /Chromium\//i.test(ua) ||
    /Edg\//i.test(ua) ||
    /OPR\//i.test(ua) ||
    /Brave/i.test(ua);
  return isChromiumFamily;
}

/** `native` = CSS scroll timelines (Chromium); `js` = same keyframes via JS (Safari/Firefox); `static` = reduced motion. */
function useExperienceMotionMode(): "native" | "js" | "static" {
  const [mode, setMode] = useState<"native" | "js" | "static">(() => {
    if (typeof window === "undefined") return "js";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return "static";
    }
    return supportsNativeScrollDriven() ? "native" : "js";
  });

  useLayoutEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pick = () => {
      if (reduced.matches) {
        setMode("static");
        return;
      }
      setMode(supportsNativeScrollDriven() ? "native" : "js");
    };
    pick();
    reduced.addEventListener("change", pick);
    return () => reduced.removeEventListener("change", pick);
  }, []);

  return mode;
}

export default function AnotherExperienceOneClient() {
  const motionMode = useExperienceMotionMode();

  if (motionMode === "static") {
    return <StaticFallback />;
  }

  return <ScrollDrivenCarousel motionMode={motionMode} />;
}

function StaticFallback() {
  return (
    <section className="bg-[#0B2C23] px-4 py-fluid-lg pb-[max(6rem,env(safe-area-inset-bottom))] md:px-fluid-md">
      <p className="mx-auto mb-fluid-md max-w-2xl text-center font-manrope text-sm text-white/70 md:text-[length:var(--fs-body)]">
        Reduced motion is enabled. Below is the same journey with standard
        vertical scrolling.
      </p>
      <div className="mx-auto flex max-w-3xl flex-col gap-fluid-xl">
        {PANELS.map((p, i) => (
          <article
            key={p.id}
            className="overflow-hidden border border-white/15 bg-black/20"
          >
            <div className="relative aspect-[16/9] w-full">
              <Image
                src={p.image}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
                priority={i === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent" />
            </div>
            <div className="space-y-3 px-5 py-6 md:px-8">
              <p className="font-manrope text-[length:var(--fs-label)] font-semibold uppercase tracking-[0.28em] text-jade-gold">
                {String(i + 1).padStart(2, "0")} — {p.title}
              </p>
              <h2 className="font-philosopher text-[length:var(--fs-h2)] text-white">
                {p.title}
              </h2>
              <p className="font-manrope text-[length:var(--fs-body)] leading-relaxed text-white/80">
                {p.subtext}
              </p>
              <Link
                href={p.href}
                className="inline-flex items-center gap-2 font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-widest text-jade-gold hover:gap-3"
              >
                {p.cta}
                <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ScrollDrivenCarousel({
  motionMode,
}: {
  motionMode: "native" | "js";
}) {
  const rootRef = useRef<HTMLElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const useJs = motionMode === "js";
  /** Vertical scroll driver for JS engines — matches Demo 1 phases with stable geometry (Firefox/Safari). Chrome keeps horizontal + native timelines. */
  const frame = useDemo1JsFrame(useJs, scrollerRef, rootRef, "y");

  return (
    <section
      ref={rootRef}
      className={clsx(
        "experience-sda-root @container relative isolate flex min-h-dscreen h-dscreen w-full flex-col overflow-hidden bg-[#050505] text-white antialiased",
        useJs && "experience-sda-js-motion experience-sda-vertical-analogy",
      )}
      aria-label={
        useJs
          ? "Curated experiences, scroll vertically through seven scenes"
          : "Curated experiences, scroll horizontally"
      }
    >
      {/* Background stack — clip-path + transform on a wrapper (Firefox often mis-composites these on raw img). */}
      <div className="experience-sda-overlap pointer-events-none absolute inset-0 -z-20">
        {PANELS.map((p, i) => (
          <div
            key={p.id}
            className={clsx(
              "experience-sda-grow-layer absolute inset-0 h-full w-full overflow-hidden",
              !useJs && "experience-sda-animate-grow",
              !useJs && TL_GROW[i],
            )}
            style={useJs ? frame.grow[i] : undefined}
            aria-hidden
          >
            <img
              src={p.image}
              alt=""
              className="pointer-events-none h-full w-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      <div
        className="pointer-events-none absolute inset-0 z-[5] bg-gradient-to-r from-black/80 via-black/45 to-black/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[6] bg-gradient-to-t from-black/60 via-transparent to-black/30"
        aria-hidden
      />

      {/* Same chrome as native (no extra panels): vertical path uses bottom-weighted grow + translateY in JS. */}

      {/* Scroll timeline driver: horizontal + view timelines (Chrome); vertical stack + vertical-analogy grow (Firefox/Safari JS) */}
      {useJs ? (
        <div
          ref={scrollerRef}
          id="experience-sda-scroller"
          className="experience-sda-scrollbar-hidden absolute inset-0 -z-10 overflow-x-hidden overflow-y-auto overscroll-y-contain scroll-smooth pointer-events-auto snap-y snap-mandatory [touch-action:pan-y]"
        >
          {/* One full-viewport block per scene — explicit height avoids Firefox collapsing flex/% min-height tracks */}
          <div className="flex w-full flex-col">
            {PANELS.map((p, i) => (
              <div
                key={p.id}
                id={`experience-sda-slide-${i + 1}`}
                role="none"
                className="h-dscreen min-h-dscreen w-full shrink-0 snap-start"
              />
            ))}
          </div>
        </div>
      ) : (
        <div
          ref={scrollerRef}
          id="experience-sda-scroller"
          className="experience-sda-scrollbar-hidden absolute inset-0 -z-10 flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth pointer-events-auto [touch-action:pan-x]"
        >
          <div className="grid h-full min-h-0 w-fit grid-flow-col auto-cols-[70cqw] pr-[30cqw]">
            {PANELS.map((p, i) => (
              <div
                key={p.id}
                id={`experience-sda-slide-${i + 1}`}
                role="none"
                className="h-full min-h-0 snap-start"
              />
            ))}
          </div>
        </div>
      )}

      {/* Chrome */}
      <header className="relative z-50 flex shrink-0 flex-col gap-3 border-b border-white/20 px-4 pb-4 pt-[max(0.75rem,env(safe-area-inset-top))] md:flex-row md:items-center md:justify-between md:px-8 md:pb-5">
        <div className="pointer-events-auto flex items-center gap-4">
          <Link
            href="/experiences"
            className="font-manrope text-[length:var(--fs-label)] font-semibold uppercase tracking-[0.22em] text-white/90 underline-offset-4 hover:text-jade-gold hover:underline"
          >
            ← Experiences
          </Link>
          <span className="hidden font-manrope text-[length:var(--fs-label)] uppercase tracking-[0.35em] text-jade-gold/90 sm:inline">
            Another experience · 1
          </span>
        </div>
        <div className="pointer-events-none h-1 w-full max-w-md overflow-hidden rounded-full bg-white/25 md:mx-4">
          <div
            className="experience-sda-animate-progress experience-sda-progress-fill h-full origin-left bg-jade-gold"
            style={
              useJs
                ? frame.progress
                : { transformOrigin: "left center" }
            }
          />
        </div>
      </header>

      {/* Index rail — horizontal on small screens, vertical on md+ */}
      <nav
        className="pointer-events-auto absolute bottom-[max(6.5rem,env(safe-area-inset-bottom))] left-0 right-0 z-50 flex justify-center gap-2 overflow-x-auto px-3 pb-1 md:bottom-auto md:left-8 md:right-auto md:top-1/2 md:flex md:w-auto md:-translate-y-1/2 md:flex-col md:justify-center md:gap-4 md:overflow-visible md:px-0"
        aria-label="Slide index"
      >
        {PANELS.map((_, i) => (
          <a
            key={i}
            href={`#experience-sda-slide-${i + 1}`}
            className={clsx(
              "shrink-0 font-philosopher text-[clamp(1rem,3.5cqw,1.35rem)] text-white/50 transition-colors hover:text-white",
              !useJs && "experience-sda-animate-page experience-sda-range",
              !useJs && TL_PAGE[i],
            )}
            style={useJs ? frame.page[i] : undefined}
          >
            {String(i + 1).padStart(2, "0")}
          </a>
        ))}
      </nav>

      {/* Copy stacks — left column; vertical flow between caption / headline / body (outer must NOT use overlap grid or layers stack on one cell). */}
      <div className="relative z-40 flex min-h-0 flex-1 flex-col overflow-hidden pointer-events-none">
        <div className="flex min-h-0 flex-1 flex-col justify-end pb-[max(8.5rem,env(safe-area-inset-bottom))] pt-4 md:justify-center md:pb-12 md:pt-0 md:items-start">
          <div className="pointer-events-auto flex w-full max-w-[min(100%,36rem)] flex-col items-start gap-3 text-left md:max-w-[min(100%,31rem)] md:gap-4 md:pl-[clamp(5.25rem,15.5cqw,9.5rem)] md:pr-[clamp(1rem,4cqw,2rem)] px-5 md:px-6">
            {/* Caption strip — stacked overlap layers + clip mask (Demo 1 text-up) */}
            <div className="experience-sda-overlap relative mb-2 w-full min-h-[2.75rem] md:mb-4 md:min-h-[3rem]">
              {PANELS.map((p, i) => (
                <div key={`cap-${p.id}`} className="overflow-clip">
                  <p
                    className={clsx(
                      "font-manrope text-[length:var(--fs-label)] font-semibold uppercase tracking-[0.28em] text-jade-gold",
                      !useJs && "experience-sda-animate-text-up experience-sda-range",
                      !useJs && TL_TEXT_UP[i],
                    )}
                    style={useJs ? frame.textUp[i] : undefined}
                  >
                    {p.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Headlines */}
            <div className="experience-sda-overlap relative mb-3 w-full min-h-[clamp(3.5rem,12cqw,7rem)] md:mb-5 md:min-h-[clamp(4rem,14cqw,8rem)]">
              {PANELS.map((p, i) => {
                const words = [...p.title.split(/\s+/)];
                const last = words.pop() ?? "";
                return (
                  <h2
                    key={`h-${p.id}`}
                    className={clsx(
                      "block w-full font-philosopher text-[clamp(1.75rem,7cqw,3.75rem)] leading-[1.05] text-white",
                      !useJs &&
                        "experience-sda-animate-text experience-sda-range -translate-y-[205%] skew-y-6",
                      !useJs && TL_TEXT[i],
                    )}
                    style={useJs ? frame.textHead[i] : undefined}
                  >
                    {words.length > 0 ? (
                      <>
                        {words.join(" ")}{" "}
                        <em className="text-jade-gold not-italic">{last}</em>
                      </>
                    ) : (
                      <em className="text-jade-gold not-italic">{last}</em>
                    )}
                  </h2>
                );
              })}
            </div>

            {/* Body */}
            <div className="experience-sda-overlap relative mb-5 w-full min-h-[4.5rem] md:min-h-[5.5rem]">
              {PANELS.map((p, i) => (
                <p
                  key={`sub-${p.id}`}
                  className={clsx(
                    "block w-full max-w-full font-manrope text-[clamp(0.8rem,2.8cqw,1.05rem)] leading-relaxed text-white/75 md:text-[length:var(--fs-body)]",
                    !useJs &&
                      "experience-sda-animate-text experience-sda-range translate-y-[50%] skew-y-[1.5deg]",
                    !useJs && TL_TEXT[i],
                  )}
                  style={useJs ? frame.textBody[i] : undefined}
                >
                  {p.subtext}
                </p>
              ))}
            </div>

            {/* CTA */}
            <div className="experience-sda-overlap relative w-full min-h-[2.75rem]">
              {PANELS.map((p, i) => (
                <Link
                  key={`cta-${p.id}`}
                  href={p.href}
                  className={clsx(
                    "inline-flex items-center gap-2 font-manrope text-[length:var(--fs-label)] font-bold uppercase tracking-widest text-jade-gold hover:gap-3",
                    !useJs &&
                      "experience-sda-animate-text experience-sda-range translate-y-[50%] skew-y-[1.5deg]",
                    !useJs && TL_TEXT[i],
                  )}
                  style={useJs ? frame.textCta[i] : undefined}
                >
                  {p.cta}
                  <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

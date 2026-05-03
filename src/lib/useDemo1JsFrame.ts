"use client";

import { useCallback, useLayoutEffect, useState } from "react";
import type { CSSProperties, RefObject } from "react";
import {
  pageIndexStyle,
  progressStyle,
  scrollerProgress,
  textStyleBody,
  textStyleHeadline,
  textUpStyle,
  growStyle,
  growPhaseFromScrollGeometry,
  textPhaseFromScrollGeometry,
} from "@/lib/experienceDemo1Motion";

const SLIDE_COUNT = 7;

/** True offset of a marker along the scroller’s scroll axis (Firefox: measured beats index×size). */
function slideContentStartX(
  el: HTMLElement,
  scroller: HTMLElement,
): number {
  const sr = scroller.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return scroller.scrollLeft + (r.left - sr.left);
}

function slideContentStartY(
  el: HTMLElement,
  scroller: HTMLElement,
): number {
  const sr = scroller.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return scroller.scrollTop + (r.top - sr.top);
}

export type Demo1ScrollAxis = "x" | "y";

export type Demo1JsFrame = {
  vps: number[];
  grow: CSSProperties[];
  textHead: CSSProperties[];
  textBody: CSSProperties[];
  textCta: CSSProperties[];
  textUp: CSSProperties[];
  page: CSSProperties[];
  progress: CSSProperties;
  scrollerP: number;
  cw: number;
  ch: number;
};

function growStackStyle(
  vpsGrow: number[],
  vp: number,
  i: number,
  cw: number,
  ch: number,
): CSSProperties {
  const dominant = vpsGrow.reduce(
    (bestIdx, v, idx, arr) => (v >= arr[bestIdx] ? idx : bestIdx),
    0,
  );
  const isTop = i === dominant;
  return {
    ...growStyle(vp, cw, ch),
    zIndex: isTop ? 45 + i : i,
    opacity:
      isTop || vp > 0.1
        ? 1
        : vp < 0.015
          ? 0
          : Math.min(1, 0.25 + vp * 5),
  };
}

function emptyFrame(cw: number, ch: number): Demo1JsFrame {
  const vps = Array(SLIDE_COUNT).fill(0) as number[];
  const vpsText = Array(SLIDE_COUNT).fill(0) as number[];
  /* Until layout runs, vp=0 renders Demo 1 grow at ~15% scale (looks blank). Seed slide 1 mid-phase. */
  const vh = Math.max(1, ch);
  const slideGuess = vh * 0.98;
  vps[0] = growPhaseFromScrollGeometry(0, 0, slideGuess, vh);
  vpsText[0] = textPhaseFromScrollGeometry(0, 0, slideGuess, vh);
  return {
    vps,
    grow: vps.map((vp, i) => growStackStyle(vps, vp, i, cw, ch)),
    textHead: vpsText.map((vp) => textStyleHeadline(vp)),
    textBody: vpsText.map((vp) => textStyleBody(vp)),
    textCta: vpsText.map((vp) => textStyleBody(vp)),
    textUp: vpsText.map((vp) => textUpStyle(vp)),
    page: vpsText.map((vp) => pageIndexStyle(vp)),
    progress: progressStyle(0, SLIDE_COUNT),
    scrollerP: 0,
    cw,
    ch,
  };
}

export function useDemo1JsFrame(
  enabled: boolean,
  scrollerRef: RefObject<HTMLElement | null>,
  rootRef: RefObject<HTMLElement | null>,
  /** `y` = vertical scroll driver (Firefox/Safari JS path — reliable snap + geometry). `x` = debug / legacy. */
  axis: Demo1ScrollAxis = "y",
) {
  const [frame, setFrame] = useState<Demo1JsFrame>(() =>
    emptyFrame(400, 600),
  );

  const measure = useCallback(() => {
    const scroller = scrollerRef.current;
    const root = rootRef.current;
    if (!scroller || !root) return;

    const cw = root.offsetWidth || 1;
    const ch = root.offsetHeight || 1;
    const scrollPos =
      axis === "y" ? scroller.scrollTop : scroller.scrollLeft;
    const maxScroll = Math.max(
      0,
      axis === "y"
        ? scroller.scrollHeight - scroller.clientHeight
        : scroller.scrollWidth - scroller.clientWidth,
    );
    const viewSpan =
      axis === "y" ? scroller.clientHeight : scroller.clientWidth;

    const vps: number[] = [];
    const vpsText: number[] = [];
    for (let i = 0; i < SLIDE_COUNT; i++) {
      const el = scroller.querySelector(
        `#experience-sda-slide-${i + 1}`,
      ) as HTMLElement | null;
      if (!el) {
        vps.push(0);
        vpsText.push(0);
        continue;
      }
      const rect = el.getBoundingClientRect();
      const slideStart =
        axis === "y"
          ? slideContentStartY(el, scroller)
          : slideContentStartX(el, scroller);
      const rawSpan =
        axis === "y"
          ? rect.height || el.offsetHeight
          : rect.width || el.offsetWidth;
      const slideSpan =
        rawSpan > 8
          ? rawSpan
          : axis === "y"
            ? ch * 0.98
            : cw * 0.7;

      vps.push(
        growPhaseFromScrollGeometry(
          scrollPos,
          slideStart,
          slideSpan,
          viewSpan,
        ),
      );
      vpsText.push(
        textPhaseFromScrollGeometry(
          scrollPos,
          slideStart,
          slideSpan,
          viewSpan,
        ),
      );
    }

    const scrollerP = scrollerProgress(scrollPos, maxScroll);

    setFrame({
      vps,
      grow: vps.map((vp, i) => growStackStyle(vps, vp, i, cw, ch)),
      textHead: vpsText.map((vp) => textStyleHeadline(vp)),
      textBody: vpsText.map((vp) => textStyleBody(vp)),
      textCta: vpsText.map((vp) => textStyleBody(vp)),
      textUp: vpsText.map((vp) => textUpStyle(vp)),
      page: vpsText.map((vp) => pageIndexStyle(vp)),
      progress: progressStyle(scrollerP, SLIDE_COUNT),
      scrollerP,
      cw,
      ch,
    });
  }, [scrollerRef, rootRef, axis]);

  useLayoutEffect(() => {
    if (!enabled) return;

    const scroller = scrollerRef.current;
    const root = rootRef.current;
    if (!scroller || !root) return;

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => measure());
    };

    measure();
    requestAnimationFrame(() => {
      requestAnimationFrame(() => measure());
    });
    const ro = new ResizeObserver(schedule);
    ro.observe(root);
    ro.observe(scroller);
    scroller.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    const imgs = root.querySelectorAll<HTMLImageElement>(
      ".experience-sda-overlap img",
    );
    const onImg = () => schedule();
    imgs.forEach((img) => {
      if (!img.complete) img.addEventListener("load", onImg, { passive: true });
    });

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      imgs.forEach((img) =>
        img.removeEventListener("load", onImg),
      );
    };
  }, [enabled, measure, scrollerRef, rootRef]);

  return frame;
}

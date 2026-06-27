"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { videoSources, type VideoSlug } from "@/lib/videoSources";

export type { VideoSlug };

interface ResponsiveVideoProps {
  slug: VideoSlug;
  className?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  poster?: string;
}

function pickSrc(slug: VideoSlug): string {
  if (typeof window === "undefined") {
    return videoSources[slug].landscape;
  }
  const useMobile = window.matchMedia(
    "(max-width: 768px) and (orientation: portrait)",
  ).matches;
  return useMobile ? videoSources[slug].mobile : videoSources[slug].landscape;
}

export default function ResponsiveVideo({
  slug,
  className = "",
  autoPlay = true,
  loop = true,
  muted = true,
  poster,
}: ResponsiveVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const triedFallback = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const ensurePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;
    if (video.paused && !video.ended) {
      void video.play().catch(() => {
        /* Autoplay blocked until gesture — visibility handler retries */
      });
    }
  }, [autoPlay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    triedFallback.current = false;
    setIsPlaying(false);

    const applySrc = () => {
      const src = pickSrc(slug);
      if (video.getAttribute("src") !== src) {
        video.src = src;
        video.load();
        ensurePlay();
      }
    };

    applySrc();

    const onPlaying = () => {
      video.removeAttribute("poster");
      setIsPlaying(true);
    };

    const onError = () => {
      if (triedFallback.current) return;
      triedFallback.current = true;
      const fallback = videoSources[slug].landscape;
      if (video.src !== fallback && !video.src.endsWith(fallback)) {
        video.src = fallback;
        video.load();
        ensurePlay();
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") ensurePlay();
    };

    const onPageShow = (event: PageTransitionEvent) => {
      if (event.persisted) ensurePlay();
    };

    const onPause = () => {
      if (!autoPlay || video.ended) return;
      if (document.visibilityState === "visible") ensurePlay();
    };

    const onStalled = () => ensurePlay();

    const mobileMq = window.matchMedia(
      "(max-width: 768px) and (orientation: portrait)",
    );
    const onLayoutChange = () => applySrc();

    video.addEventListener("playing", onPlaying);
    video.addEventListener("canplay", ensurePlay);
    video.addEventListener("loadeddata", ensurePlay);
    video.addEventListener("ended", ensurePlay);
    video.addEventListener("error", onError);
    video.addEventListener("pause", onPause);
    video.addEventListener("stalled", onStalled);
    video.addEventListener("waiting", ensurePlay);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("pageshow", onPageShow);
    mobileMq.addEventListener("change", onLayoutChange);
    window.addEventListener("orientationchange", onLayoutChange);

    ensurePlay();

    return () => {
      video.removeEventListener("playing", onPlaying);
      video.removeEventListener("canplay", ensurePlay);
      video.removeEventListener("loadeddata", ensurePlay);
      video.removeEventListener("ended", ensurePlay);
      video.removeEventListener("error", onError);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("stalled", onStalled);
      video.removeEventListener("waiting", ensurePlay);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pageshow", onPageShow);
      mobileMq.removeEventListener("change", onLayoutChange);
      window.removeEventListener("orientationchange", onLayoutChange);
    };
  }, [slug, autoPlay, ensurePlay]);

  return (
    <video
      ref={videoRef}
      className={clsx(
        className,
        "transition-opacity duration-500",
        isPlaying ? "opacity-100" : "opacity-0",
      )}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      preload="auto"
      poster={poster}
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden
      src={videoSources[slug].landscape}
    />
  );
}

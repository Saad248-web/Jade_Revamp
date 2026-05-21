"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
  memo,
} from "react";
import { Heart, Instagram, MessageCircle, Play } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import PrimaryButton from "./PrimaryButton";
import SectionWrapper from "./SectionWrapper";
import { JADE_CHARCOAL } from "@/lib/jadeSectionColors";
import {
  INSTAGRAM_POSTS,
  type InstagramPost,
} from "@/data/instagramPosts";
import {
  fetchInstagramOembed,
  getCachedInstagramOembed,
  type InstagramOembedItem,
} from "@/lib/instagramOembedCache";

type OembedItem = InstagramOembedItem;

const InstagramFramedCard = memo(function InstagramFramedCard({
  post,
  media,
}: {
  post: InstagramPost;
  media?: OembedItem;
}) {
  const href = `https://www.instagram.com/${post.type}/${post.id}/`;
  const displayImage = media?.thumbnailUrl || post.fallbackImage;

  return (
    <article className="jade-instagram-card w-full h-full flex flex-col rounded-[16px] bg-[#1E2227] border border-white/10 overflow-hidden">
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-black/25 border border-white/10 flex items-center justify-center">
            <img
              src="/assets/Golden_Logo.png"
              alt=""
              className="w-6 h-6 object-contain"
              width={24}
              height={24}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="min-w-0">
            <div className="font-manrope text-[14px] text-white/90 leading-tight truncate">
              {post.handle}
            </div>
            <div className="font-manrope text-[12px] text-white/55 leading-tight">
              Instagram
            </div>
          </div>
        </div>
        <Instagram className="w-5 h-5 text-white/45 flex-shrink-0" />
      </header>

      <div className="px-4 shrink-0">
        <div className="relative w-full aspect-[4/5] rounded-[14px] overflow-hidden bg-[#141618] border border-white/10">
          <img
            src={displayImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
          />
          {post.type === "reel" ? (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-black/45 border border-white/20 flex items-center justify-center">
                <Play className="w-7 h-7 text-white" />
              </div>
            </div>
          ) : null}

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10"
            aria-label="Open on Instagram"
          />
        </div>
      </div>

      <div className="px-4 pt-3 pb-4">
        <div className="flex items-center gap-5 text-white/65">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            <span className="font-manrope text-[13px]">{post.likes}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-manrope text-[13px]">{post.comments}</span>
          </div>
        </div>

        <div className="mt-2.5 font-manrope text-[14px] text-white/70 leading-snug line-clamp-2">
          <span className="text-white/85">{post.caption}</span>
        </div>

        <div className="mt-2.5 space-y-1">
          {post.commentPreview.slice(0, 2).map((c, idx) => (
            <div
              key={idx}
              className="font-manrope text-[13px] text-white/55 leading-snug"
            >
              <span className="text-white/75">{c.user}</span>{" "}
              <span>{c.text}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
});

export default function InstagramCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mediaMap] = useState<Record<string, OembedItem>>(() =>
    getCachedInstagramOembed() ?? {},
  );
  const [showTrack, setShowTrack] = useState(false);
  const [marqueeLoop, setMarqueeLoop] = useState(false);
  const [marqueeActive, setMarqueeActive] = useState(false);

  const postsForTrack = useMemo(
    () => (marqueeLoop ? [...INSTAGRAM_POSTS, ...INSTAGRAM_POSTS] : INSTAGRAM_POSTS),
    [marqueeLoop],
  );

  /* Phase 1: header only. Phase 2: 10 cards. Phase 3: duplicate + animate. */
  useEffect(() => {
    let cancelled = false;
    const raf1 = requestAnimationFrame(() => {
      const raf2 = requestAnimationFrame(() => {
        if (!cancelled) setShowTrack(true);
      });
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
    };
  }, []);

  useEffect(() => {
    if (!showTrack) return;

    let idleId: number | undefined;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const duplicate = () => {
      startTransition(() => setMarqueeLoop(true));
    };

    if ("requestIdleCallback" in window) {
      idleId = (
        window as Window & {
          requestIdleCallback: (
            cb: () => void,
            opts?: { timeout: number },
          ) => number;
        }
      ).requestIdleCallback(duplicate, { timeout: 600 });
    } else {
      timeoutId = setTimeout(duplicate, 400);
    }

    return () => {
      if (idleId != null) {
        (
          window as Window & {
            cancelIdleCallback: (id: number) => void;
          }
        ).cancelIdleCallback(idleId);
      }
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [showTrack]);

  /* oEmbed after first paint — fallbacks already shown; avoid mass re-render on mount */
  useEffect(() => {
    if (Object.keys(mediaMap).length > 0) return;

    const run = () => {
      void fetchInstagramOembed();
    };

    if ("requestIdleCallback" in window) {
      const id = (
        window as Window & {
          requestIdleCallback: (
            cb: () => void,
            opts?: { timeout: number },
          ) => number;
        }
      ).requestIdleCallback(run, { timeout: 2000 });
      return () => {
        (
          window as Window & {
            cancelIdleCallback: (id: number) => void;
          }
        ).cancelIdleCallback(id);
      };
    }

    const t = setTimeout(run, 1200);
    return () => clearTimeout(t);
  }, [mediaMap]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        setMarqueeActive(Boolean(entry?.isIntersecting));
      },
      { threshold: 0.08, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  return (
    <SectionWrapper
      ref={sectionRef}
      bg={JADE_CHARCOAL}
      className="py-12 md:py-20 min-h-[80dvh] lg:min-h-[100dvh] flex flex-col justify-center overflow-x-hidden"
    >
      {showTrack ? (
        <NavbarThemeTrigger theme="golden" sectionRef={sectionRef} />
      ) : null}
      <div className="max-w-[1920px] mx-auto w-full">
        <div className="text-center mb-10 md:mb-12 px-6 md:px-12">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Instagram className="w-5 h-5 text-jade-gold" />
            <span className="font-manrope text-gh-label tracking-[0.3em] uppercase text-jade-gold">
              Featured on Instagram
            </span>
          </div>
          <h2 className="font-philosopher text-gh-h1 text-white mb-2">
            Moments as they unfold
          </h2>
        </div>

        <div className="relative w-full overflow-hidden pb-4 min-h-[420px] sm:min-h-[460px]">
          {showTrack ? (
            <div
              className={`flex w-max gap-5 jade-instagram-marquee-track hover:[animation-play-state:paused]${marqueeActive && marqueeLoop ? "" : " is-paused"}`}
              style={
                marqueeActive && marqueeLoop
                  ? { willChange: "transform" }
                  : undefined
              }
            >
              {postsForTrack.map((post, index) => (
                <div
                  key={`${post.id}-${index}`}
                  className="flex-shrink-0 w-[300px] sm:w-[320px] md:w-[360px]"
                >
                  <InstagramFramedCard
                    post={post}
                    media={mediaMap[`${post.type}:${post.id}`]}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex gap-5 px-6 opacity-40" aria-hidden>
              {INSTAGRAM_POSTS.slice(0, 3).map((post) => (
                <div
                  key={post.id}
                  className="flex-shrink-0 w-[300px] h-[420px] rounded-[16px] bg-white/5"
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-center mt-8 px-6">
          <PrimaryButton
            href="https://www.instagram.com/jadehospitainment"
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit Jade on Instagram
          </PrimaryButton>
        </div>
      </div>
    </SectionWrapper>
  );
}

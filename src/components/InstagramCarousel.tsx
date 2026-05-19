"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Heart, Instagram, MessageCircle, Play } from "lucide-react";
import NavbarThemeTrigger from "./NavbarThemeTrigger";
import PrimaryButton from "./PrimaryButton";
import SectionWrapper from "./SectionWrapper";
import { JADE_CHARCOAL } from "@/lib/jadeSectionColors";

type InstagramPost = {
  id: string;
  type: "p" | "reel";
  fallbackImage: string;
  handle: string;
  caption: string;
  likes: string;
  comments: string;
  commentPreview: { user: string; text: string }[];
};

const INSTAGRAM_POSTS: InstagramPost[] = [
  // 10 posts (UI frame per Image 1/2, content pulled via oEmbed when available).
  {
    id: "DCRJKQozm9F",
    type: "p",
    fallbackImage: "/Experiences/Party Villas/2-Party Type/Pool Parties.webp",
    handle: "@jadehospitainment",
    caption: "Paradise found @jade 💗🌸",
    likes: "2.4k",
    comments: "89",
    commentPreview: [
      { user: "luxurytravel", text: "This pool view is unreal." },
      { user: "weekendvibes", text: "Adding this to my wishlist." },
    ],
  },
  {
    id: "DBrM8YMy1UC",
    type: "p",
    fallbackImage: "/Home Page/4-Venue Images/1.webp",
    handle: "@jadehospitainment",
    caption: "Amazing found @jade 💗🌸",
    likes: "2.4k",
    comments: "89",
    commentPreview: [
      { user: "staycation", text: "That courtyard swing is everything." },
      { user: "foodie", text: "Need a bonfire night here." },
    ],
  },
  {
    id: "DOJYFnEAWz4",
    type: "p",
    fallbackImage:
      "/Experiences/Party Villas/2-Party Type/Birthdays & Anniversaries.webp",
    handle: "@jadehospitainment",
    caption: "Celebrations, but make it Jade.",
    likes: "1.9k",
    comments: "64",
    commentPreview: [
      { user: "partyplanner", text: "Perfect setup for birthdays." },
      { user: "friends", text: "Book it. We’re coming." },
    ],
  },
  {
    id: "DPNzH4ACZnp",
    type: "p",
    fallbackImage:
      "/Experiences/Party Villas/2-Party Type/Bachelor_Bachelorette Parties.webp",
    handle: "@jadehospitainment",
    caption: "Party villas. Big energy.",
    likes: "2.1k",
    comments: "71",
    commentPreview: [
      { user: "nightowl", text: "This looks like a movie scene." },
      { user: "musiclover", text: "DJ + pool = sold." },
    ],
  },
  {
    id: "C_aq1_qya_e",
    type: "reel",
    fallbackImage:
      "/Experiences/Party Villas/2-Party Type/Reunions & Graduation Parties.webp",
    handle: "@jadehospitainment",
    caption: "Poolside scenes, unforgettable nights.",
    likes: "3.2k",
    comments: "112",
    commentPreview: [
      { user: "reels", text: "The vibe is immaculate." },
      { user: "sunsetclub", text: "Weekend goals." },
    ],
  },
  {
    id: "C_N0gQJhTp4",
    type: "reel",
    fallbackImage: "/Home Page/4-Venue Images/DJI_0277.webp",
    handle: "@jadehospitainment",
    caption: "Where hospitality meets entertainment.",
    likes: "2.7k",
    comments: "93",
    commentPreview: [
      { user: "corporateretreat", text: "This would be a great team offsite." },
      { user: "travelmore", text: "Saving this!" },
    ],
  },
  {
    id: "C681aInK5jn",
    type: "reel",
    fallbackImage: "/Home Page/2-Experiences/Weddings.webp",
    handle: "@jadehospitainment",
    caption: "Moments that feel cinematic.",
    likes: "2.5k",
    comments: "84",
    commentPreview: [
      { user: "weddings", text: "Venue + lighting is stunning." },
      { user: "bride", text: "Dreamy." },
    ],
  },
  {
    id: "C5KsbqBvNLf",
    type: "reel",
    fallbackImage: "/Home Page/2-Experiences/Wellness.webp",
    handle: "@jadehospitainment",
    caption: "Recharge. Reconnect. Repeat.",
    likes: "1.6k",
    comments: "42",
    commentPreview: [
      { user: "wellness", text: "So calming." },
      { user: "reset", text: "Need this break." },
    ],
  },
  {
    id: "CzIjR_3Lj_H",
    type: "reel",
    fallbackImage: "/Home Page/2-Experiences/casual stays.webp",
    handle: "@jadehospitainment",
    caption: "Easy getaways, elevated.",
    likes: "1.8k",
    comments: "55",
    commentPreview: [
      { user: "staycation", text: "This is exactly what I needed." },
      { user: "wander", text: "Looks peaceful." },
    ],
  },
  {
    id: "Cxp7fnkvZm9",
    type: "reel",
    fallbackImage:
      "/Home Page/The Value Jade Provides/Private Villas around Bangalore 2.webp",
    handle: "@jadehospitainment",
    caption: "Private villas around Bangalore.",
    likes: "2.0k",
    comments: "68",
    commentPreview: [
      { user: "bangalore", text: "Didn’t know this existed so close!" },
      { user: "getaway", text: "Booked for next weekend." },
    ],
  },
];

type OembedItem = {
  url: string;
  thumbnailUrl?: string;
  ok: boolean;
};

function InstagramFramedCard({
  post,
  media,
}: {
  post: InstagramPost;
  media?: OembedItem;
}) {
  const href = useMemo(
    () => `https://www.instagram.com/${post.type}/${post.id}/`,
    [post.id, post.type],
  );

  const displayImage = media?.thumbnailUrl || post.fallbackImage;

  return (
    <article className="w-full h-full flex flex-col rounded-[16px] bg-[#1E2227] border border-white/10 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-full bg-black/25 border border-white/10 flex items-center justify-center">
            <img
              src="/assets/Golden_Logo.png"
              alt=""
              className="w-6 h-6 object-contain"
              loading="lazy"
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

      {/* Media */}
      <div className="px-4 shrink-0">
        <div className="relative w-full aspect-[4/5] rounded-[14px] overflow-hidden bg-black border border-white/10">
          {displayImage ? (
            <>
              <img
                src={displayImage}
                alt="Instagram post preview"
                className="absolute inset-0 w-full h-full object-cover"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              {post.type === "reel" ? (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-black/35 border border-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-7 h-7 text-white" />
                  </div>
                </div>
              ) : null}
            </>
          ) : (
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-white/0 to-white/5" />
              <div className="absolute inset-0 animate-pulse bg-white/5" />
            </div>
          )}

          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10"
            aria-label="Open on Instagram"
          />
        </div>
      </div>

      {/* Actions + content */}
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
}

export default function InstagramCarousel() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mediaMap, setMediaMap] = useState<Record<string, OembedItem>>({});

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/instagram/oembed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ posts: INSTAGRAM_POSTS }),
        });
        const data = await res.json();
        const items = (data?.items || {}) as Record<string, OembedItem>;
        if (!cancelled) setMediaMap(items);
      } catch {
        if (!cancelled) setMediaMap({});
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SectionWrapper
      ref={sectionRef}
      bg={JADE_CHARCOAL}
      className="py-12 md:py-20 min-h-[80dvh] lg:min-h-[100dvh] flex flex-col justify-center overflow-x-hidden"
    >
      <NavbarThemeTrigger theme="golden" sectionRef={sectionRef} />
      <div className="max-w-[1920px] mx-auto w-full">
        {/* Header */}
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

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 0.75rem)); }
          }
          .animate-marquee {
            animation: marquee 40s linear infinite;
          }
        `}} />

        {/* Continuous Marquee Container */}
        <div className="relative w-full overflow-hidden pb-4">
          <div className="flex w-max gap-5 animate-marquee hover:[animation-play-state:paused]">
            {[...INSTAGRAM_POSTS, ...INSTAGRAM_POSTS].map((post, index) => (
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
        </div>

        {/* CTA Button */}
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

# Scroll & Lenis — Jade_ReVamp

## Global smooth scroll

- **Provider:** [`src/components/SmoothScroll.tsx`](../src/components/SmoothScroll.tsx) in [`src/app/providers.tsx`](../src/app/providers.tsx)
- **Tuning:** [`src/lib/lenisConfig.ts`](../src/lib/lenisConfig.ts)
- **Helpers:** [`src/lib/lenis.ts`](../src/lib/lenis.ts), [`src/lib/lenisScrollBridge.ts`](../src/lib/lenisScrollBridge.ts)
- **Chrome hide:** [`src/lib/useBatchedScrollHide.ts`](../src/lib/useBatchedScrollHide.ts) (Lenis `scroll` + direction; navbar uses CSS `transform`)

`html` uses `scroll-behavior: auto` so native smooth does not fight Lenis.

## Protected pin stacks (do not add `data-lenis-prevent` or nested Lenis)

These use Framer `useScroll` + tall section height for vertical pin/progress — page scroll must stay on global Lenis:

- `UnifiedScrollSection` / `ScrollSectionComposer`
- `LandingPage` hero (Section 2)
- `HorizontalScrollSection`
- `FeaturedVillas`
- `ExperiencesScrollSection`
- `WeddingCelebrationsSection`
- `AnotherExperienceOneClient` + `experience-sda.css`

## Safe `data-lenis-prevent` targets

Use on **native** inner scrollers so wheel does not move the page:

| Kind | Examples |
|------|----------|
| Vertical panels | Overlay bodies, menu/book `overflow-y-auto` roots |
| Horizontal strips | Category chips, blog track, sticky tab tracks |

Do **not** wrap whole pin section roots.

## Panel smoothing tiers

| Tier | Mechanism |
|------|-----------|
| 1 | [`smoothScrollTo`](../src/lib/smoothScrollTo.ts) — programmatic tab/section jumps |
| 2 | `PANEL_SMOOTH_SCROLL_MS` / easing in `lenisConfig.ts` |
| 3b | CSS on `[data-lenis-prevent].overflow-y-auto` in `globals.css` |
| 3a | [`useNestedLenisPanel`](../src/lib/nestedLenisPanel.ts) on venue overlay scroll roots only |

## Instagram block (not Lenis-prevent)

Lag when approaching is usually **lazy mount + oEmbed + marquee start**. Mitigations:

- [`prefetchInstagramOembed`](../src/lib/instagramOembedCache.ts)
- Staged [`LazyWhenNear`](../src/components/ui/LazyWhenNear.tsx) + [`InstagramCarouselShell`](../src/components/InstagramCarousel.tsx)
- Marquee paused until section is visible (`.jade-instagram-marquee-track`)

## Verify

```bash
npx tsc --noEmit
npm run build && npm start
```

Test: pin sections, Instagram approach, overlay inner scroll, horizontal chips, navbar hide on scroll down / gentle show on scroll up.

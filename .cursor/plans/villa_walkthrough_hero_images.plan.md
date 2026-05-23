---
name: Villa walkthrough hero images
overview: Restore Video Walkthrough posters on the villa detail page using one fixed hero image per villa, chosen from each villa's Hero folder under public/Villa_Retreats (no YouTube thumbnails).
todos:
  - id: poster-map
    content: Add WALKTHROUGH_POSTER_BY_VILLA_ID map in src/lib/walkthroughPosters.ts with one path per villa id
    status: completed
  - id: sync-retreat-data
    content: Set video.thumbnail in each retreat file to match the map (dome estate + per-color + gaps)
    status: completed
  - id: detail-page
    content: Use map in src/app/villas/[id]/page.tsx for poster Image; reset isPlayingVideo on dome tab change
    status: completed
  - id: verify-villas
    content: Spot-check posters on magnolia, palatio, dome-villas (all three tabs), wonderland
    status: completed
isProject: false
---

# Villa detail Video Walkthrough — one Hero folder image per villa

## Intent

On **View Villa** (`/villas/[id]`), the Video Walkthrough section should show **one specific image** from each villa's **Hero folder** in [`public/Villa_Retreats`](public/Villa_Retreats) as the play-button poster — not YouTube `maxresdefault` URLs and not a dynamic gallery pick.

## Root cause (unchanged)

[`src/app/villas/[id]/page.tsx`](src/app/villas/[id]/page.tsx) uses `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`, which often 404s or looks blank.

## Revised approach (per user feedback)

1. **Curated static map** — one poster path per `villa.id`, all under `public/Villa_Retreats/.../Hero` (or `1-Hero`).
2. **Single source of truth** — new [`src/lib/walkthroughPosters.ts`](src/lib/walkthroughPosters.ts) exports `WALKTHROUGH_POSTER_BY_VILLA_ID` and `getWalkthroughPosterForVilla(id, domeTab?)`.
3. **Sync retreat data** — set each `video.thumbnail` in `src/data/retreats/*.ts` to the same path (keeps type contract and works on spaces page).
4. **Detail page** — poster `Image src={getWalkthroughPosterForVilla(...)}`; keep click-to-play YouTube embed.

No runtime fallback chain (API manifest, `heroImages[0]`, YouTube hqdefault). If a villa has no Hero folder asset, poster stays empty until assets are added.

## Selected poster per villa (from Hero folders)

Primary pick = **first / canonical hero** per villa (aligned with [`src/lib/heroOverrides.ts`](src/lib/heroOverrides.ts) where that file already curates the lead hero).

| Villa ID | Poster path (`public/...`) |
|----------|----------------------------|
| `magnolia` | `/Villa_Retreats/Magnolia/Hero/hero.webp` |
| `tranquil` | `/Villa_Retreats/Tranquil Woods/1-Hero/Hero 1.webp` |
| `royalty` | `/Villa_Retreats/Royalty/1-Hero/Hero 1.webp` |
| `diamond` | `/Villa_Retreats/Diamond/Hero/Hero 2.webp` |
| `haven` | `/Villa_Retreats/Haven/Hero/hero.webp` |
| `emerald` | `/Villa_Retreats/Emerald/Hero/hero.webp` |
| `wonderland` | `/Villa_Retreats/Wonderland/Hero/hero.webp` |
| `jade-735` | `/Villa_Retreats/Jade 735/Hero/hero.webp` |
| `palatio` | `/Villa_Retreats/Palatio/1-Hero/Hero 1.webp` |
| `lounge-fly` | `/Villa_Retreats/Lounge Fly/1-Hero/Hero.webp` |
| `retreat-on-the-ridge` | `/Villa_Retreats/Retreat on the ridge/1-Hero/Hero.webp` |
| `dome-villas` | `/Villa_Retreats/Dome/Hero Main/Hero 1.webp` |
| `dome-villas-blue` | `/Villa_Retreats/Dome/Dome Villa_s - Blue/Hero/Hero 1.webp` |
| `dome-villas-red` | `/Villa_Retreats/Dome/Dome Villa_s - Red/Hero/Hero 1.webp` |
| `dome-villas-yellow` | `/Villa_Retreats/Dome/Dome Villa_s - Yellow/Hero/Hero_evening_View.webp` |
| `vannani` | *(no Hero folder in `public/Villa_Retreats` — skip or add assets later)* |
| `lemon-tree` | *(no Hero folder in `public/Villa_Retreats` — skip or add assets later)* |

**Data fixes needed** (currently empty or mismatched `video.thumbnail`):

- [`src/data/retreats/dome/estate.ts`](src/data/retreats/dome/estate.ts) → `Hero Main/Hero 1.webp`
- [`src/data/retreats/dome/shared.ts`](src/data/retreats/dome/shared.ts) → per-color paths above
- [`src/data/retreats/magnolia.ts`](src/data/retreats/magnolia.ts) → change from `Hero 1.webp` to `hero.webp` (match curated lead hero)
- [`src/data/retreats/jade-735.ts`](src/data/retreats/jade-735.ts) → change from `Hero 1.webp` to `hero.webp`
- [`src/data/retreats/diamond.ts`](src/data/retreats/diamond.ts) → change from `Hero 1.webp` to `Hero 2.webp` (match heroOverrides lead)

Most other villas already have correct `video.thumbnail` paths.

## Implementation

### 1. `src/lib/walkthroughPosters.ts`

```ts
export const WALKTHROUGH_POSTER_BY_VILLA_ID: Record<string, string> = { /* table above */ };

export function getWalkthroughPosterForVilla(
  villaId: string,
  domeTab?: "blue" | "red" | "yellow",
): string {
  if (villaId === "dome-villas" && domeTab) {
    return WALKTHROUGH_POSTER_BY_VILLA_ID[`dome-villas-${domeTab}`] ?? "";
  }
  return WALKTHROUGH_POSTER_BY_VILLA_ID[villaId] ?? "";
}
```

### 2. [`src/app/villas/[id]/page.tsx`](src/app/villas/[id]/page.tsx)

- Import `getWalkthroughPosterForVilla`.
- In Video Walkthrough block, replace YouTube poster URL with:

```tsx
const walkthroughPoster = getWalkthroughPosterForVilla(
  villa.id,
  isDomeEstate ? activeDomeVideo : domeColor ?? undefined,
);
```

- Render `Image` only when `walkthroughPoster` is non-empty.
- `useEffect` → `setIsPlayingVideo(false)` when `activeDomeVideo` changes.

### 3. Retreat data sync

Update `video.thumbnail` in retreat modules to match the map (minimal edits — only rows in table that differ today).

## Verification

- `/villas/magnolia` — poster shows `Magnolia/Hero/hero.webp`
- `/villas/dome-villas` — Blue / Red / Yellow tabs each show that dome's Hero 1 (or evening view for yellow)
- `/villas/diamond` — poster shows `Hero 2.webp`
- Play button still opens YouTube embed

## Out of scope

- Villas without Hero folders (`vannani`, `lemon-tree`) until assets exist under `public/Villa_Retreats`
- Spaces page (`/villas/[id]/spaces`) — can reuse map in a follow-up

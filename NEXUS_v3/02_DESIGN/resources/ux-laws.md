# UX/UI Laws — The Governing Rulebook
## 10 Laws · Spacing Architecture · Typography Rules · 15 Golden Tips · Pre-Delivery Checklist
## Apply to EVERY page, component, and overlay. No exceptions.

---

## Part 1 — The 10 UX Laws

### Law 1 — Gestalt: Proximity
> Elements near each other are perceived as a group.

**Rule:** Internal spacing within a group must be ≤ 50% of the spacing separating it from the next group.

```
CORRECT grouping:
"Section Label"        ← label
   ↕ 8px               ← intra-group (tight)
"Main Headline"        ← title
   ↕ 12px              ← intra-group (tight)
"Supporting subtext"
   ↕ 40px              ← inter-group (generous — visually separates)
[ Content / cards below ]

GOLDEN RATIO: Internal gap × 2.5 = External gap minimum
  8px internal → 20px+ external
  12px internal → 30px+ external
  16px internal → 40px+ external
```

**Squint test:** Squint at the screen. If you can't tell which elements belong together and which don't — spacing is wrong.

---

### Law 2 — Gestalt: Common Region
> Elements sharing a visual boundary belong together.

**Rule:** Wrap related items in a shared container (card, bg, border). Don't leave siblings floating in unbounded space.

**Application:** Every card groups image + title + location + price inside one bordered container. Form inputs live inside labeled fieldsets.

---

### Law 3 — Gestalt: Similarity
> Elements sharing visual traits (color, size, shape) are seen as related.

**Rule:** All items at the same hierarchy level MUST share the same font, weight, size, and color. If two things look different, the brain assumes they mean different things.

**Application:** All section labels across every page: `tracking-[0.3em]`, `uppercase`, `accent-color`, `font-bold`. Never vary this treatment.

---

### Law 4 — Visual Hierarchy (F/Z Pattern)
**Rule for page layouts:**
- **Hero sections** → Z-pattern: Logo (top-left) → Nav (top-right) → Headline (center) → CTA (bottom-center)
- **Content sections** → F-pattern: Heading → first paragraph → scan down left edge → subheadings catch the eye

**Application:**
- Hero CTAs: always center-aligned
- Section headings: always left-aligned OR always center — never mixed within a page
- Most important element must be biggest, most contrasted, most prominent — no exceptions

---

### Law 5 — Fitts's Law
> Time to reach a target depends on its distance and size.

**Rule:** Touch targets minimum **44×44px**. Primary CTAs must be the largest interactive element in their context. Place primary actions in the natural thumb zone on mobile (bottom half of screen).

```css
/* Mandatory on ALL interactive elements */
.btn, .nav-link, .card-clickable, .icon-btn {
  min-height: 44px;
  min-width: 44px;
}
```

---

### Law 6 — Hick's Law
> More choices = more decision time = more drop-off.

**Rule:** Limit visible options to **5–7 per context**. Progressive disclosure: show the essential first, reveal details on demand.

**Application:**
- Navigation: ≤ 6 links visible
- Never show all features/amenities at once — use expandable sections
- Forms: one field of focus at a time where possible

---

### Law 7 — Miller's Law
> Working memory holds ~7 items (±2).

**Rule:** Never present more than 7 items in a single visual group without chunking. Use dividers or group headers.

**Application:** Stats sections show 3–4 metrics. Footer groups links under 3–4 column headings. Dropdown menus: categorize after 7 items.

---

### Law 8 — Jakob's Law
> Users spend most of their time on OTHER sites. Match their expectations.

**Rule:** Don't reinvent navigation, form patterns, or core flows. Match user expectations from market leaders in your category.

**Application:**
- E-commerce: match patterns from Shopify storefronts
- SaaS: match Notion/Linear navigation patterns
- Booking: match Airbnb/Booking.com date-picker flows
- Auth: standard email+password or OAuth — no custom flows

---

### Law 9 — Law of Prägnanz (Simplicity)
> People interpret complex shapes as the simplest form possible.

**Rule:** Every UI element must serve exactly one purpose. If a design element exists only for decoration and doesn't reinforce hierarchy, meaning, or brand — **remove it**.

**Anti-patterns:**
- Decorative borders with no semantic purpose
- Gradient overlays that don't improve readability
- Animated elements that don't guide attention
- Icons without labels (except ×, ←, ☰)

---

### Law 10 — Peak-End Rule
> Users judge an experience by its peak moment and the ending — not the average.

**Rule:** The hero/splash IS the peak. The footer/confirmation IS the ending. Both demand disproportionate polish.

**Application:**
- Hero animation or scroll effect: your signature moment — make it memorable
- Footer: premium business card treatment, not an afterthought
- Success/confirmation screens: celebrate the user — don't just show "Done"

---

## Part 2 — Spacing Architecture

### The 4px Base Grid
Every spacing value must be a **multiple of 4px**. No exceptions. No 5px, 7px, 13px, or 15px.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Icon-to-text inline gap |
| `--space-2` | 8px | Tight gaps within a group (label → title) |
| `--space-3` | 12px | Standard intra-group gap |
| `--space-4` | 16px | Card padding (mobile), between form fields |
| `--space-6` | 24px | Card padding (desktop), between groups |
| `--space-8` | 32px | Between related sections |
| `--space-10` | 40px | Section padding (mobile) |
| `--space-12` | 48px | Section padding (tablet) |
| `--space-16` | 64px | Section padding (desktop) |
| `--space-20` | 80px | Section padding (wide) |

### The 3 Spacing Contexts

```
CONTEXT 1 — Intra-Group (within a group): 4px–12px
Elements that belong together: icon ↔ text, label ↔ input, title ↔ subtitle

CONTEXT 2 — Inter-Group (between groups): 24px–48px
Separating distinct groups within a section: card ↔ card, title-group ↔ description

CONTEXT 3 — Section Spacing (between sections): 40px–80px
Mobile: 40px | Tablet: 48px | Desktop: 64px | Wide: 80px
Always use clamp(): padding-block: clamp(40px, 8vw, 80px);
```

### Fluid Spacing — Never Fixed px for Sections

```css
/* ✅ Always */
padding-block: clamp(40px, 8vw, 80px);
margin-bottom: clamp(16px, 4vw, 32px);
gap: clamp(12px, 3vw, 24px);

/* ❌ Never for responsive spacing */
padding-top: 80px;
margin-bottom: 32px;
```

### Section Heading Structure

```
[SECTION LABEL]      ← uppercase, tracked, accent color
   ↕ 8–12px
Main Heading         ← display font, largest on page
   ↕ 12–16px
Supporting subtext   ← body font, muted, max-width: 65ch
   ↕ clamp(24px, 5vw, 48px)
Content (cards, grid, etc.)
```

---

## Part 3 — Typography Laws

### The 3-Tier System (mandatory for every project)

| Tier | Role | Usage | Personality match |
|------|------|-------|-------------------|
| **Display** | H1, hero, splash titles | Premium, editorial | Serif for luxury; bold grotesque for tech |
| **Subhead** | H2, H3, labels, nav | Clean, structured | Same or high-contrast pairing |
| **Body** | Paragraphs, captions, UI text | Readable, warm | Most legible, never decorative |

**Rules:**
- Max 3 font families total
- `font-display: swap` always
- Load only used weights
- Never Inter/Roboto/Arial as the creative choice (only as fallback)

### Line Height Rules

```
Headings (H1–H3):   line-height: 1.1–1.2  (tight, editorial, compact)
Subheadings:         line-height: 1.3–1.4  (balanced)
Body text:           line-height: 1.5–1.75 (generous — non-negotiable for reading)
Labels/Captions:     line-height: 1.4      (compact info)
```

### Max Line Length

**Body text: max-width 65ch.** No paragraph should stretch wider. Absolute law.
```css
p, .body-text, .description { max-width: 65ch; }
```

---

## Part 4 — Color Laws

### 60-30-10 Rule (mandatory)

```
60% — Base/Background: backgrounds, large surfaces
30% — Secondary/Text: paragraphs, cards, UI chrome
10% — Accent: CTAs, labels, highlights, active states ONLY
```

**Accent discipline:** If the accent color appears everywhere, it loses its power. Reserve it for: labels, CTAs, active states, featured indicators. Never for large backgrounds or body text.

### Contrast Minimums

```
Body text:           4.5:1 minimum (WCAG AA)
Large text (18px+):  3.0:1 minimum
UI components:       3.0:1 against adjacent colors
```

### Text Over Images — Non-Negotiable

Any text overlaying an image or video needs ONE of:
- Dark gradient overlay (minimum `rgba(0,0,0,0.4)`)
- Text shadow: `text-shadow: 0 2px 8px rgba(0,0,0,0.6)`
- Card backdrop behind text
- None of the above = remove the overlay text

---

## Part 5 — Responsive Laws (Web-First)

### The 4 Breakpoints (Web Responsive)

| Tier | Viewport | Grid | What changes |
|------|----------|------|-------------|
| **Mobile** | 375px (base) | 1 col, full-width | Stack everything, hamburger nav |
| **Tablet** | 768px | 2 cols emerge | Grid transitions, side-by-side layouts |
| **Desktop** | 1280px | Full multi-col | Multi-column grids, hover states activate |
| **Wide** | 1920px | Capped max-width | `max-width` containers, locked typography |

### The 7 Golden Responsive Rules

1. **Mobile-first CSS** — Start at 375px. Use `min-width` media queries to expand. Never `max-width` to shrink.
2. **`100dvh` not `100vh`** — Dynamic viewport height accounts for mobile browser chrome.
3. **`clamp()` everywhere** — No fixed values for spacing, font sizes, or gaps.
4. **Stack → Grid** — Mobile: 1 col. 768px: 2 col. 1280px: 3–4 col.
5. **Touch targets** — Every interactive element: `min-height: 44px; min-width: 44px`.
6. **Hover is not a given** — Wrap ALL hover effects in `@media (hover: hover) { }`.
7. **No horizontal scroll** — If any element overflows at 375px, it's a bug. Test at 320px as safety net.

---

## Part 6 — Component Spacing Standards

### Cards
```
Internal padding:    16px (mobile) → 24px (desktop)
Image radius:        12px (matches container)
Title → body gap:    8px
Body → CTA gap:      12px
Card-to-card gap:    clamp(12px, 3vw, 24px)
```

### Navigation
```
Nav height:          64px (mobile) → 72px (desktop)
Link gap:            clamp(16px, 3vw, 32px)
Active indicator:    2px bottom border, accent color
All items:           44px min touch target
Sticky:              backdrop-filter: blur(12px)
```

### Overlays / Drawers
```
Padding:             clamp(16px, 4vw, 32px)
Internal gap:        24px
Form field gap:      16px
Button row gap:      12px
Close button:        absolute top-4 right-4, 44×44px
Border radius:       16px (top corners for bottom drawers)
```

---

## Part 7 — The 15 Golden Tips (Senior Designer Wisdom)

1. **Spacing is design.** Perfect spacing + mediocre visuals > rich visuals + bad spacing.
2. **Squint test.** Can't tell which elements are grouped? Spacing is wrong.
3. **Consistent ≠ identical.** Use the same SYSTEM, vary intentionally within it.
4. **Alignment is trust.** Almost-aligned says "amateur." Pixel-perfect builds subconscious trust.
5. **White space is not empty space.** It's an active element. Luxury brands use MORE of it.
6. **One CTA per viewport.** Two competing CTAs cancel each other. One primary wins.
7. **The 3-second rule.** First-time user must understand page purpose + next action in 3 seconds.
8. **Text over images needs contrast.** Dark overlay, text-shadow, or backdrop — always.
9. **Don't animate for decoration.** Every animation must guide attention, provide feedback, or reinforce spatial relationships.
10. **Loading is part of UX.** Blank screen = "broken." Skeleton = "coming." Design loading states.
11. **Design the empty state.** Zero data, zero results — it's a state. Design it deliberately.
12. **Test on real devices.** Dev tools are approximations. Real phone, real thumb, real battery pressure.
13. **Vertical rhythm matters.** From a distance: heading → content → space → heading — a consistent drumbeat.
14. **Icons supplement, never replace.** Always pair with text labels, except ×, ←, ☰.
15. **The exit matters.** Users remember the last thing they see. Polish the footer, confirmation page, success screen.

---

## Part 8 — Pre-Delivery Checklist (Run on Every Component / Page)

```
SPACING
□ Intra-group gaps are ≤ 50% of inter-group gaps (Golden Ratio 1:2.5+)
□ Section padding uses clamp() (40px → 80px)
□ No fixed px values for responsive spacing
□ 4px grid alignment on all elements
□ Squint test passes — grouping is visually obvious

TYPOGRAPHY
□ 3-tier font system applied (display / subhead / body)
□ All sizes from fluid tokens (clamp-based)
□ Body text max-width: 65ch
□ Line heights: 1.1–1.2 headings, 1.5–1.75 body
□ Letter spacing: –0.025em large headings, 0.05em+ uppercase labels

COLOR
□ 60-30-10 rule respected (60% bg, 30% text, 10% accent)
□ 4.5:1 contrast on body text
□ Accent used sparingly — labels, CTAs, highlights ONLY
□ Text over images has sufficient contrast treatment
□ Dark mode works if applicable

RESPONSIVE (4 tiers)
□ 375px — single column, no horizontal overflow, 16px min text
□ 768px — 2-col grid, nav transforms, side-by-side appears
□ 1280px — full layout, hover states activate, multi-col grids
□ 1920px — max-width container, no stretching

INTERACTION
□ 44px touch targets on ALL buttons/links/interactive elements
□ Hover states wrapped in @media (hover: hover)
□ focus-visible on all interactive elements
□ prefers-reduced-motion respected
□ cursor: pointer on all clickable elements
□ Loading state defined
□ Empty/error state defined

UX LAWS
□ Proximity: intra-group tight, inter-group generous
□ Hierarchy: most important = biggest + most contrasted
□ One primary CTA per viewport
□ ≤ 7 items per visual group without chunking
□ No decorative elements that don't serve hierarchy or brand
□ Peak moments (hero, confirmation) are extra polished

ASSETS
□ All images have alt text
□ No emoji as icons — SVG/Lucide only
□ Images: aspect-ratio on container, object-fit: cover
□ loading="lazy" on all below-fold images
```

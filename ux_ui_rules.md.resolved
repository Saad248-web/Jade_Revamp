# Jade Hospitainment — UX/UI Rules & Spacing System

> The definitive rulebook for every page, component, and overlay in the Jade Hospitainment web app.
> Written through the lens of a senior UX/UI designer shipping luxury hospitality experiences across 375px → 1920px.

---

## Part 1 — The 10 UX Laws That Govern This Project

### 1. Gestalt Law of Proximity
> Elements near each other are perceived as a group.

**Rule:** Internal spacing within a group must be ≤ 50% of the spacing separating it from the next group. If label + title + subtitle form one group, keep them tight (4–12px internal gaps) and add generous breathing room (24–48px) before the next section.

**Jade Example:**
```
"JADE HOSPITAINMENT"   ← label
   ↕ 8px               ← intra-group (tight)
"Where Hospitality"    ← title
   ↕ 12px              ← intra-group (tight)
"Meets Entertainment"
   ↕ 32px              ← inter-group (wide — separates from next element)
[ Subtext paragraph ]
```

---

### 2. Gestalt Law of Common Region
> Elements sharing a visual boundary belong together.

**Rule:** Wrap related items in a shared container (card, background, or border). Don't leave siblings floating in unbounded space.

**Application:** Every villa card groups its image + title + location + price inside one bordered container. The overlay drawers group form inputs within labeled fieldsets.

---

### 3. Gestalt Law of Similarity
> Elements sharing visual traits (color, size, shape) are seen as related.

**Rule:** All items at the same hierarchy level must share the same font, weight, size, and color. If two things look different, the brain assumes they mean different things.

**Application:** All section labels across every page use the same treatment: `text-gh-label`, `tracking-[0.3em]`, `uppercase`, `text-jade-gold`, `font-manrope`, `font-bold`.

---

### 4. Visual Hierarchy (F-Pattern / Z-Pattern)
> Users scan in an F-shape on text-heavy pages, and a Z-shape on minimal pages.

**Rule for Jade:**
- **Hero sections** → Z-pattern: Logo (top-left) → Nav (top-right) → Headline (center) → CTA (bottom-center)
- **Content sections** → F-pattern: Heading → first paragraph → scan down left edge → subheadings catch the eye

**Application:** Hero CTAs always center-aligned. Section headings always left-aligned or center-aligned consistently within a page — never mixed.

---

### 5. Fitts's Law
> The time to reach a target depends on its distance and size.

**Rule:** Touch targets must be **minimum 44×44px**. Primary CTAs must be the largest interactive element in their context. Place primary actions in the natural thumb zone on mobile (bottom half of screen).

**Application:** `MobileBottomNav` anchors the primary CTA at the bottom. All buttons use `min-height: 44px`. Booking overlays place the "Confirm" button at the bottom of the viewport.

---

### 6. Hick's Law
> More choices = more decision time = more drop-off.

**Rule:** Limit visible options to 5–7 per context. Progressive disclosure: show the essential first, reveal details on demand.

**Application:** Menu overlay shows top-level categories only. Villa detail page uses tabs/sections to chunk information. Don't show all amenities at once — use expandable lists.

---

### 7. Miller's Law
> Working memory holds ~7 items (±2).

**Rule:** Never present more than 7 items in a single visual group without chunking. Navigation links, feature lists, stats — chunk them with dividers or group headers.

**Application:** Navbar has ≤ 6 links. Stats bars show exactly 3–4 metrics. Footer groups links under 3–4 column headings.

---

### 8. Jakob's Law
> Users spend most of their time on OTHER sites. Your site should work like the sites they already know.

**Rule:** Don't reinvent navigation, form patterns, or booking flows. Match user expectations from Airbnb, Booking.com, and luxury hotel sites.

**Application:** Villa cards look and behave like Airbnb listings. Booking overlay follows the standard: dates → guests → confirm flow. Location pins on maps behave as expected.

---

### 9. Law of Prägnanz (Simplicity)
> People interpret complex shapes as the simplest form possible.

**Rule:** Every UI element should serve exactly one purpose. If a design element exists only for decoration and doesn't reinforce hierarchy, meaning, or brand — remove it.

**Application:** No decorative borders without purpose. No gradient overlays that don't improve readability. No animated elements that don't guide attention.

---

### 10. Peak-End Rule
> Users judge an experience by its peak moment and the ending, not the average.

**Rule:** The splash screen animation IS the peak moment. The footer/contact section IS the ending. Both must be polished to perfection. Invest disproportionate effort in these two.

**Application:** The splash screen curtain animation is our signature. The footer must feel like a premium business card, not an afterthought.

---

## Part 2 — Spacing System (The Architecture of Breathing Room)

### 2.1 The 4px Base Grid

Every spacing value must be a multiple of 4px. No exceptions.

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Icon-to-text inline gap |
| `space-2` | 8px | Tight gaps within a group (e.g., label → title) |
| `space-3` | 12px | Standard intra-group gap |
| `space-4` | 16px | Card internal padding (mobile), between form fields |
| `space-6` | 24px | Card internal padding (desktop), between groups |
| `space-8` | 32px | Between related sections, inter-group gap |
| `space-10` | 40px | Section padding (mobile) |
| `space-12` | 48px | Section padding (tablet) |
| `space-16` | 64px | Section padding (desktop) |
| `space-20` | 80px | Section padding (wide screens) |

### 2.2 The 3 Spacing Contexts

```
CONTEXT 1 — Intra-Group (within a group)
──────────────────────────────────────────
4px–12px — Elements that belong together
Example: Icon ↔ text, label ↔ input, title ↔ subtitle

CONTEXT 2 — Inter-Group (between groups)
──────────────────────────────────────────
24px–48px — Separating distinct groups within a section
Example: Title-group ↔ description-group, card ↔ card

CONTEXT 3 — Section Spacing (between sections)
──────────────────────────────────────────
40px–80px — Full-width sections on a page
Mobile: 40px | Tablet: 48px | Desktop: 64px | Wide: 80px
Use clamp() for fluid transitions: clamp(40px, 8vw, 80px)
```

### 2.3 Fluid Spacing Formula

**Never use fixed px values for section spacing.** Always use `clamp()`:

```css
/* Section vertical padding */
padding-block: clamp(40px, 8vw, 80px);

/* Heading to content gap */
margin-bottom: clamp(16px, 4vw, 32px);

/* Card grid gap */
gap: clamp(12px, 3vw, 24px);
```

### 2.4 The Golden Ratio Rule

For any visual group, the spacing ratio between intra-group and inter-group should approximate **1:2.5** or greater.

```
If internal gap = 8px  → external gap ≥ 20px (ratio 1:2.5)
If internal gap = 12px → external gap ≥ 30px (ratio 1:2.5)
If internal gap = 16px → external gap ≥ 40px (ratio 1:2.5)
```

This ratio is what makes grouping visually obvious without needing borders or backgrounds.

---

## Part 3 — Typography Rules

### 3.1 The Jade 3-Tier Font System

| Tier | Font | Usage | Personality |
|------|------|-------|-------------|
| **Display** | Philosopher | H1, hero text, splash titles | Premium, editorial, serif elegance |
| **Subhead** | Manrope (Bold/SemiBold) | H2, H3, labels, nav items | Clean, structured, modern |
| **Body** | Manrope (Regular/Light) | Paragraphs, descriptions, captions | Readable, professional, warm |

### 3.2 Typography Scale (from globals.css)

| Token | Mobile (375px) | Tablet (768px) | Desktop (1024px) | Wide (1440px) |
|-------|---------------|----------------|-------------------|---------------|
| `--fs-h1` | 32px | 32px | 38px | 40px |
| `--fs-h2` | 28px | 28px | 32px | 32px |
| `--fs-h3` | 26px | 26px | 28px | 28px |
| `--fs-body` | 14px | 16px | 18px | 18px |
| `--fs-desc` | 12px | 13px | 14px | 14px |
| `--fs-label` | 10px | 12px | 12px | 12px |

### 3.3 Line Height Rules

```
Headings (H1–H3):   line-height: 1.1–1.2  (tight, compact, editorial)
Subheadings:         line-height: 1.3–1.4  (balanced)
Body text:           line-height: 1.5–1.75 (generous, readable)
Labels/Captions:     line-height: 1.4      (compact info)
```

### 3.4 Max Line Length

**Body text: max-width 65ch.** No paragraph should stretch wider than 65 characters. This is non-negotiable for readability.

```css
p, .description { max-width: 65ch; }
```

---

## Part 4 — Color System

### 4.1 Jade Palette

| Role | Color | Hex | Usage |
|------|-------|-----|-------|
| **Background 1** | Charcoal | `#25282C` | Primary page bg, splash screen |
| **Background 2** | Deep Green | `#0B2C23` | Secondary bg, footer, alternating sections |
| **Accent Primary** | Jade Gold | `#EFCD62` | CTAs, labels, highlights, stars |
| **Accent Muted** | Muted Gold | `#AC8831` | Borders, subtle accents, hover states |
| **Accent Dull** | Dull Gold | `#5C4009` | Disabled states, background hints |
| **Text Primary** | Off-white | `hsla(0,0%,98%,0.8)` | Primary body text |
| **Text Bright** | Pure White | `#FFFFFF` | Headings, strong emphasis |
| **Text Muted** | White 60% | `rgba(255,255,255,0.6)` | Captions, labels, secondary info |

### 4.2 The 60-30-10 Rule

```
60% — Background (Charcoal #25282C or Green #0B2C23)
30% — Text (Off-white, muted white, captions)
10% — Accent (Jade Gold #EFCD62 — used SPARINGLY)
```

> [!CAUTION]
> **Gold is the premium accent.** If gold appears everywhere, it loses its power. Reserve it for: labels, CTAs, active states, stars/ratings, and featured indicators. Never use it for large backgrounds or body text.

---

## Part 5 — Responsive Design Rules (4-Tier Mobile-First)

### 5.1 The 4 Breakpoints

| Tier | Width | Layout | What changes |
|------|-------|--------|-------------|
| **Mobile** | 375px (base) | 1 column, full-width | Stack everything, hamburger nav |
| **Tablet** | 768px | 2 columns emerge | Grid transitions, side-by-side layouts |
| **Desktop** | 1024px | Full layout | Multi-column grids, hover states activate |
| **Wide** | 1440px | Capped widths | `max-width` containers, locked typography |

### 5.2 The 7 Golden Responsive Rules

**Rule 1 — Mobile-first CSS.** Start at 375px. Use `min-width` media queries to expand. Never `max-width` to shrink.

**Rule 2 — `100dvh` not `100vh`.** Dynamic viewport height accounts for mobile browser chrome. Every full-height section must use `100dvh`.

**Rule 3 — `clamp()` everywhere.** No fixed values for spacing, font sizes, or gaps. Use `clamp(min, preferred, max)` for smooth scaling.

**Rule 4 — Stack → Grid.** On mobile, everything stacks vertically. At 768px, introduce 2-column grids. At 1024px+, expand to 3–4 columns.

**Rule 5 — Touch targets.** Every button, link, and interactive element: `min-height: 44px; min-width: 44px;`.

**Rule 6 — Hover is not a given.** Wrap ALL hover effects in `@media (hover: hover) { }`. Touch devices don't hover — don't rely on it.

**Rule 7 — No horizontal scroll.** If any element overflows horizontally on 375px, it's a bug. Test every component at 320px as a safety net.

### 5.3 Container Widths

```css
/* Content max-widths */
--max-w-prose:    65ch;     /* Body text, descriptions */
--max-w-section:  1200px;   /* Standard section content */
--max-w-wide:     1440px;   /* Wide sections, hero content */
--max-w-full:     1920px;   /* Absolute maximum, then center */
```

---

## Part 6 — Component Spacing Standards

### 6.1 Cards

```
Internal padding:        16px (mobile) → 24px (desktop)
Image corner radius:     12px (matches container)
Title margin-bottom:     8px
Description margin-bot:  12px
Gap between cards:       clamp(12px, 3vw, 24px)
```

### 6.2 Section Headings

```
Label (e.g., "OUR VILLAS"):     text-gh-label, tracking-[0.3em], jade-gold
  ↕ 8–12px
Main Heading:                    text-gh-h2, font-philosopher
  ↕ 12–16px
Subtext/Description:             text-gh-desc, font-manrope, max-w-65ch
  ↕ clamp(24px, 5vw, 48px)
Content below (cards, grid):     starts here
```

### 6.3 Overlays & Drawers

```
Padding:                 clamp(16px, 4vw, 32px)
Internal section gap:    24px
Form field gap:          16px
Button row gap:          12px
Close button:            absolute top-4 right-4, 44×44px touch target
Border radius:           16px (top corners for bottom drawers)
```

### 6.4 Navigation

```
Nav height:              64px (mobile) → 72px (desktop)
Link gap:                clamp(16px, 3vw, 32px)
Logo size:               32px → 40px (clamp)
Active indicator:        2px bottom border, jade-gold
Touch target:            44px minimum per link/button
```

---

## Part 7 — Motion & Animation Rules

### 7.1 Micro-Interaction Timing

| Action | Duration | Easing |
|--------|----------|--------|
| Button hover/press | 150ms | `ease-out` |
| Card hover lift | 200ms | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Page element fade-in | 600–800ms | `ease-out` |
| Overlay open | 300–400ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Overlay close | 200–300ms | `ease-in` |
| Scroll-triggered reveal | 500–800ms | `cubic-bezier(0.76, 0, 0.24, 1)` |

### 7.2 GPU-Only Properties

**Animate ONLY `transform` and `opacity`.** Never animate `width`, `height`, `margin`, `padding`, `top`, `left`, or `box-shadow` in loops.

```css
/* ✅ GPU-accelerated */
transform: translateY(-4px) scale(1.02);
opacity: 0.8;

/* ❌ Layout thrashing — will jank on mobile */
height: 100px → 200px;
margin-top: 0 → 20px;
```

### 7.3 Reduced Motion

**Every animation must respect `prefers-reduced-motion`:**

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Part 8 — Accessibility Minimums (WCAG 2.2 AA)

| Criterion | Target | Tool |
|-----------|--------|------|
| Text contrast | 4.5:1 on body, 3:1 on large text (≥ 24px) | devtools contrast checker |
| UI component contrast | 3:1 against adjacent colors | manual check |
| Touch targets | 44×44px minimum | measure in devtools |
| Focus visibility | `focus-visible` outline on all interactive elements | tab through page |
| Alt text | Every meaningful image has descriptive alt text | manual audit |
| Form labels | Every input has a visible `<label>` | manual audit |
| Semantic HTML | Headings in order (H1 → H2 → H3), no skipping | outline check |

---

## Part 9 — The 15 Golden Tips (Senior Designer Wisdom)

1. **Spacing is design.** A layout with perfect spacing and mediocre visuals beats a visually rich layout with bad spacing every time.

2. **The squint test.** Squint at your screen. If you can't tell which elements are grouped and which are separate, your spacing is wrong.

3. **Consistent ≠ identical.** Don't use the same gap everywhere. Use the same **system** everywhere. Vary spacing intentionally within the system.

4. **Alignment is trust.** Nothing says "amateur" faster than elements that are almost-but-not-quite aligned. Pixel-perfect alignment builds subconscious trust.

5. **White space is not empty space.** It's an active design element. Luxury brands use MORE white space than budget brands. Jade is luxury — breathe.

6. **One CTA per viewport.** At any scroll position, there should be exactly one obvious primary action. Two competing CTAs cancel each other out.

7. **The 3-second rule.** A first-time user landing on any page must understand what the page is about and what they can do within 3 seconds.

8. **Text over images needs contrast.** Any text overlaying an image or video needs either: a dark gradient overlay (min `bg-black/40`), a text shadow, or a card backdrop. No exceptions.

9. **Don't animate for the sake of animation.** Every animation should either guide attention, provide feedback, or reinforce spatial relationships. If it doesn't do any of these, remove it.

10. **Loading is part of the experience.** Every asynchronous operation needs a loading state. A blank screen while loading says "broken." A skeleton says "coming soon."

11. **Design the empty state.** What does the page look like with zero data? Zero search results? Zero villas available? An empty state IS a state — design it deliberately.

12. **Test on real devices.** Responsive dev tools are approximations. Test on a real iPhone SE (375px), iPad (768px), and a budget Android phone. The difference is real.

13. **Vertical rhythm matters.** When you look at a page from far away, sections should create a visual rhythm — consistent drumbeat of heading → content → space → heading → content → space.

14. **Icons supplement, never replace.** An icon without a label is a puzzle. Always pair icons with text labels, except for universally understood icons (×, ←, ☰).

15. **The exit matters.** Users remember the last thing they see. Polish the footer, the confirmation screen, the "thank you" page. It's your closing handshake.

---

## Part 10 — Pre-Delivery Checklist (Run on Every Page)

```
SPACING
□ Intra-group gaps are ≤ 50% of inter-group gaps
□ Section padding uses clamp() (40px → 80px)
□ No fixed px values for responsive spacing
□ 4px grid alignment on all elements

TYPOGRAPHY
□ 3-tier system: Philosopher (display) + Manrope (subhead/body)
□ All sizes from --fs-* tokens (globals.css)
□ Body text max-width: 65ch
□ Line heights: 1.1–1.2 headings, 1.5–1.75 body

COLOR
□ 60-30-10 rule: bg (60%), text (30%), gold accent (10%)
□ 4.5:1 contrast on all body text
□ Gold accent used sparingly (labels, CTAs, highlights only)

RESPONSIVE
□ 375px — single column, no overflow, 16px min text
□ 768px — grids transition, nav transforms
□ 1024px — full layout, hover states
□ 1440px — max-width capped, no stretching

INTERACTION
□ 44px touch targets on all buttons/links
□ Hover states wrapped in @media (hover: hover)
□ focus-visible on all interactive elements
□ prefers-reduced-motion respected

COMPONENTS
□ Loading state defined
□ Empty/error state defined
□ Image alt text present
□ No emoji as icons (SVG/Lucide only)
```

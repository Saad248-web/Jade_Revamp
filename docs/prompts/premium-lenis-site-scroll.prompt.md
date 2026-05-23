# Reusable prompt: Premium buttery Lenis scroll (any site)

Copy everything inside the fenced block below into Cursor, Claude, or another agent when starting a new project or audit.

---

```
Implement site-wide premium scroll for [FRAMEWORK — e.g. Next.js 14+ App Router, Nuxt, Vite+React] using Lenis (latest 1.3.x). 

Goal: buttery-smooth on desktop wheel, free/fast on mobile touch, NO vertical lock or stutter when cursor/finger is on horizontal marketing rows (blog carousels, tab chips, amenity strips, villa card meta rows).

---

## CRITICAL — Do NOT modify (protected scroll systems)

Before changing Lenis, CSS touch rules, or `data-lenis-prevent*`, **inventory and leave untouched** any existing:

1. **Scroll-lock / scrub sections** — tall wrapper (`h-[800vh]`, `300vh`, etc.) + `position: sticky` + Framer `useScroll` / `useTransform`, or GSAP ScrollTrigger timelines. These sections own their own scroll progress math; wrapping them in Lenis options or adding `data-lenis-prevent` on the outer pin wrapper often breaks the effect.

2. **Dedicated horizontal experience scrollers** — full-page or full-bleed horizontal panes (e.g. `#experience-sda-scroller`, `[data-page-scroll-root]`, “another experience” style demos). These keep **`data-lenis-prevent`** on the scroller root and their own CSS timelines — do not merge them with marketing tab/blog rails.

3. **Overlay / panel scroll roots** — modals, menus, book flow steps, enquire drawers with `overflow-y-auto` + `data-lenis-prevent`. Lenis must not smooth inside these; only the marketing page shell uses global Lenis.

4. **Home (or landing) narrative sections** — e.g. “section 3” style blocks: philosophy unified scroll, experiences horizontal strip, Instagram marquee, pinned carousels. **Tune Lenis globally; do not refactor** their internal scroll-lock, panel `useTransform`, or `800vh` structure unless explicitly requested.

**Rule of thumb:** Global Lenis = vertical page shell between/around special sections. Marketing `overflow-x-auto` rails = virtualScroll routing only. Pin timelines + SDA-style scrollers = hands off.

---

## Core principles (do not skip)

1. **Butter ≠ slow.** Target `lerp` ~0.09–0.10 on desktop, NOT 0.03–0.05 (molasses, endless swipes per section).

2. **Never set `touchInertiaExponent` to 35 or 50.** Lenis applies `sign(v) × |velocity|^exponent` on touch end; runtime default is **~1.7**. Values like 50 cause one small flick to jump many sections.

3. **Mobile vertical = native touch** — `syncTouch: false` on `(pointer: coarse)`. OS momentum = “free” feel. Lenis handles desktop wheel, hybrid edge cases, and programmatic `scrollTo` / anchors.

4. **Marketing horizontal rails must NOT use `data-lenis-prevent` or `data-lenis-prevent-touch`.** Those block or fight vertical scroll when the pointer is on the row.

5. **CSS on horizontal tracks: `touch-action: pan-x pan-y`**, never `pan-x` alone (locks vertical touch on the row).

6. **One scroll owner per gesture.** Mixing native page scroll + Lenis `preventDefault` on the same wheel tick causes stutter (especially desktop cursor over a horizontal frame).

---

## Lenis init (global provider)

- Client `SmoothScroll` wrapper at app root; `import "lenis/dist/lenis.css"`.
- On init: `document.documentElement.classList.add("lenis", "lenis-smooth")`.
- Global CSS: `html { scroll-behavior: auto; }` — never `scroll-behavior: smooth` on `html` (fights Lenis).
- Options:
  - `smoothWheel: true`
  - `allowNestedScroll: true`
  - `autoRaf: true`, `autoResize: true`
  - `wheelMultiplier: 1.08–1.12` (marketing routes)
  - **Do not pass `touchInertiaExponent`** unless you intentionally match Lenis default (~1.7).

- `prefers-reduced-motion: reduce` → do not initialize Lenis.

---

## Viewport profiles (runtime)

Detect `window.matchMedia("(pointer: coarse)")`.

| Profile | syncTouch | lerp | wheelMultiplier | Notes |
|--------|-----------|------|-----------------|--------|
| Desktop (fine) | `false` | 0.088–0.095 | 1.08–1.12 | Buttery wheel |
| Mobile (coarse) | `false` | ~0.1 (fallback) | n/a | Native finger vertical |
| Forms/checkout (optional) | `false` | ~0.08 | 1.0–1.04 | Slightly tighter |

Expose `getLenis()` / `window.__lenis` for programmatic `scrollTo` and sticky-tab jumps.

---

## Horizontal marketing rails (blog, tabs, amenities, galleries)

### Markup contract

- Scroll root: class e.g. `jade-hscroll-track` / `hscroll-track` + `overflow-x-auto` + `min-w-0`.
- Optional `data-jade-hscroll` / `data-hscroll` for QA — **not** paired with Lenis prevent attrs on marketing rails.

### CSS (scroll root only — not on non-scrolling parents)

```css
.hscroll-track,
.jade-hscroll-track {
  min-width: 0;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  overscroll-behavior-y: auto;
  -webkit-overflow-scrolling: touch;
  touch-action: pan-x pan-y;
}
```

Do not set `touch-action: pan-x` only on `[data-hscroll]` wrappers that are not the overflow scroll root.

### Lenis `virtualScroll` router (required)

When `composedPath` includes a horizontal marketing rail:

| Input | Return | Effect |
|-------|--------|--------|
| `touch*` | `false` | Lenis backs off; native vertical page + native horizontal row |
| `wheel`, \|ΔY\| > \|ΔX\| | `true` | Lenis owns vertical (no native/Lenis stutter on desktop) |
| `wheel`, horizontal intent | `false` | Native row scroll |

**Do not** use a global `prevent(node)` that blocks all Lenis events on rails — it breaks vertical wheel smoothness on desktop.

### Runtime assurance (recommended)

`MutationObserver` on mount/DOM updates:

- **Strip** `data-lenis-prevent`, `data-lenis-prevent-touch`, `data-lenis-prevent-wheel` from all marketing `.hscroll-track` / `.jade-hscroll-track` nodes.
- **Keep** full `data-lenis-prevent` only on allowlisted dedicated roots (SDA scroller, `[data-page-scroll-root]`, modal `overflow-y-auto` panels).

---

## Programmatic scroll

- Anchor / section jumps: `duration` ~1.2–1.4s, easing `(t) => 1 - Math.pow(1 - t, 4.5)`.
- Route-based preset optional (e.g. `/book` → balanced tighter preset).

---

## Deliverables (adapt names to repo)

1. `src/lib/lenisConfig.ts` — presets, `getLenisRuntimeOptions()`, pathname → preset if needed.
2. `src/lib/hscrollLenisRouting.ts` — `routeLenisVirtualScrollOverHorizontalRail`.
3. `src/components/SmoothScroll.tsx` — Lenis init + cleanup on route/profile change.
4. `src/components/HScrollTouchAssurance.tsx` — strip mistaken prevent attrs from rails.
5. `src/lib/horizontalScrollClasses.ts` — shared track classes + data attrs.
6. `globals.css` — `html.lenis` contract + hscroll `touch-action` (protected sections unchanged).
7. Wire provider in `app/providers.tsx` (or equivalent). **No second Lenis instance** per route layout.

---

## QA checklist

- [ ] Phone: short vertical swipe ≈ one section, not 7–8 sections.
- [ ] Phone: finger on horizontal row → page scrolls vertically; row scrolls horizontally.
- [ ] Desktop: wheel over horizontal row → smooth vertical, no jitter.
- [ ] Desktop: horizontal wheel / shift+wheel on row → row moves.
- [ ] No `touchInertiaExponent: 50` (or ≫ 2) in config.
- [ ] Single Lenis instance; `<html class="lenis lenis-smooth">`.
- [ ] **Pinned / SDA / overlay scroll systems still behave exactly as before.**

---

## Anti-patterns (reject in code review)

- `touchInertiaExponent: 50` or site-wide `lerp: 0.03` “extreme silk”.
- `syncTouch: true` on all mobile marketing pages without measuring swipe distance.
- `touch-action: pan-x` only on horizontal tracks.
- `data-lenis-prevent` on blog/tab/amenity marketing tracks.
- `virtualScroll` returning `false` for **all** events on rails (including vertical wheel).
- Refactoring home scroll-lock / section-3 horizontal narrative while only asked for global Lenis.

Match existing stack conventions, file layout, and component naming in the target repository.
```

---

## Short prompt (quick paste)

```
Add Lenis site-wide: desktop lerp ~0.09, wheelMultiplier ~1.1, syncTouch OFF on mobile. Never touchInertiaExponent 50. Marketing horizontal rails: touch-action pan-x pan-y; no data-lenis-prevent on tracks; virtualScroll — touch on rail → native, vertical wheel → Lenis, horizontal wheel → native; runtime strip prevent attrs from rails. DO NOT modify scroll-lock/pinned sections (800vh+sticky+useScroll), dedicated SDA/page horizontal scrollers, overlay panels, or home “section 3” narrative logic — only tune global page Lenis and marketing rail routing.
```

---

## Jade_ReVamp reference implementation

| Concern | Location |
|--------|----------|
| Presets / runtime | `src/lib/lenisConfig.ts` |
| Rail virtualScroll | `src/lib/hscrollLenisRouting.ts` |
| Lenis provider | `src/components/SmoothScroll.tsx` |
| Rail attr cleanup | `src/components/HScrollTouchAssurance.tsx` |
| Track contract | `src/lib/horizontalScrollClasses.ts`, `globals.css` |
| Protected SDA | `#experience-sda-scroller`, `AnotherExperienceOneClient.tsx` |
| Protected pin sections | `HorizontalScrollSection`, `ExperiencesScrollSection`, `UnifiedScrollSection` |

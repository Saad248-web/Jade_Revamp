---
name: nexus-design
description: "Sovereign UI/UX engineering. Mobile-first always. Context brief before code. Visual references before rendering. UX Laws enforced (10 cognitive laws, spacing architecture, 15 golden tips, pre-delivery checklist). Font Joy 3-tier typography. Checklist.Design component gates. 4-tier responsive web (375/768/1280/1920). global.css tokens only. MOTION auto-paired on every project — static UIs are not acceptable. Merges: frontend-design, ui-ux-pro-max, Anthropic design, Emil Kowalski, Impeccable, Taste Skill, shadcn, Tailwind, Brand Guidelines, Jade UX rulebook. Use for ANY web interface — components, pages, systems, dashboards, landing pages, design systems."
triggers: ["ui", "ux", "design", "component", "layout", "responsive", "landing page", "dashboard", "card", "form", "interface", "theme", "color", "font", "typography", "hero", "navbar", "button", "modal", "table", "dark mode", "glassmorphism", "bento", "minimalism", "brutalism", "aesthetic", "brand", "polish", "fix spacing", "looks bad", "improve ui", "redesign", "shadcn", "tailwind", "aceternity", "magic ui", "spacing", "visual hierarchy", "section", "pricing page", "checkout"]
---

# NEXUS DESIGN Engine v3.0
**Context → References → UX Laws → Tokens → Mobile-first → Deliver**
**MOTION is mandatory on every deliverable. Static = forgettable.**
**This engine handles web responsive (375px→1920px). 10_MOBILE = native apps only.**

---

## PHASE -1 — Context Engineering Gate (MANDATORY)

Ask max 3 targeted questions if absent, then infer the rest.

```
PROJECT CONTEXT
Product:       [SaaS / e-commerce / portfolio / dashboard / landing page]
Audience:      [Age · sophistication · device split · emotional state]
Goal:          [Convert / inform / retain / delight / showcase]
Tone:          [3 adjectives — e.g. "confident, minimal, premium"]
Differentiator:[One unforgettable thing. If you can't name it — keep thinking.]
Anti-pattern:  [What NOT to be. What does bad look like here?]

DESIGN CONTEXT
Primary viewport: [Mobile-first / Desktop-primary / Equal split]
Existing tokens:  [Any globals.css or brand tokens defined?]
Stack:            [Next.js / React / HTML+Tailwind / other]
```

---

## PHASE 0 — Visual Reference Protocol

**Skip references = generic AI output. Non-negotiable.**

| Source | What to pull |
|--------|-------------|
| Taste Skill | noireternel.vercel.app · floria-landing-page.vercel.app · collectiveos.vercel.app |
| 21st.dev | Production animated React components |
| Magic UI | magicui.design — Framer Motion + Tailwind |
| Aceternity UI | ui.aceternity.com — premium motion components |
| shadcn/ui | ui.shadcn.com — accessible base primitives |

**Impeccable `/polish`:** User says "polish this" → run UX Laws Pre-Delivery Checklist from `resources/ux-laws.md` Part 8.

---

## PHASE 1 — UX Laws Gate (MANDATORY — before any pixel)

**Load `resources/ux-laws.md` before making any layout decision.**

Quick law checklist:
```
□ Proximity: intra-group gap ≤ 50% of inter-group gap (Golden Ratio 1:2.5 minimum)
□ Similarity: same-level elements share font/weight/color treatment
□ Hierarchy: most important = biggest + most contrasted element
□ Hick's Law: ≤ 7 items per visual group without chunking/dividers
□ One CTA: only one primary CTA visible per viewport scroll position
□ 3-second rule: new user understands page purpose in 3 seconds
□ Prägnanz: every decorative element either serves hierarchy or brand — or remove it
□ Peak-End: hero section and footer get disproportionate polish investment
```

**The squint test (mandatory before delivery):** Squint at the layout. Groups visually obvious? Hierarchy unmistakable? If no — fix spacing before touching anything else.

**The 4px grid:** Every spacing value must be a multiple of 4px. No 5px, 7px, 13px, 15px.

---

## PHASE 2 — Aesthetic Direction

Generate 3 directions before committing. Load `resources/aesthetics.md` for exact CSS values.

| Tone | Aesthetic | CSS values in |
|------|-----------|--------------|
| Premium dark | Dark Luxury | §1.6 |
| Frosted glass | Glassmorphism | §1.1 |
| Raw & bold | Brutalism | §1.3 |
| Clean removal | Minimalism | §1.4 |
| Mixed cards | Bento Grid | §1.5 |
| Inflated 3D | Claymorphism | §1.7 |
| Y2K / futurism | Retro-Futurism | §1.8 |
| Tactile soft | Neumorphism | §1.2 |

**Rule:** Choose and commit. Half-hearted aesthetics are worse than none.

---

## PHASE 3 — Font Intelligence (Font Joy 3-Tier)

Every design gets 3 tiers: `display / subhead / body`. Never just a pair.
Load `resources/typography.md` for 60+ pairings by brand personality.

**Quick picks:**
| Brand feel | Display | Body | Contrast |
|-----------|---------|------|----------|
| Luxury | Cormorant Garamond | DM Sans | High |
| Modern SaaS | Bricolage Grotesque | Inter | Low |
| Bold editorial | Fraunces | Source Serif 4 | High |
| Creative studio | Playfair Display | Satoshi | Medium |
| Dark ambient | Syne | Space Grotesk | Medium |
| Playful consumer | Nunito | Nunito Sans | Low |

**Font laws:** Max 3 families · `font-display: swap` · load only used weights · never Inter as creative choice

---

## PHASE 4 — Token Architecture (global.css — non-negotiable)

Every value flows from `resources/global.css`. Zero hardcoded values in components.

```css
/* ✅ Always */
color: var(--color-text-primary);
padding: var(--space-4);           /* = 16px from token */
font-size: var(--text-lg);
gap: var(--space-6);               /* = 24px from token */
border-radius: var(--radius-xl);
transition: all var(--duration-200) var(--ease-out);

/* ❌ Never */
color: #111111;      /* hardcoded */
padding: 16px;       /* hardcoded */
font-size: 18px;     /* hardcoded */
```

**Spacing law:** Intra-group gaps ≤ 50% of inter-group gaps. Use the 3 spacing contexts:
- Context 1 Intra-group (within a group): 4–12px
- Context 2 Inter-group (between groups): 24–48px
- Context 3 Section spacing: clamp(40px, 8vw, 80px)

---

## PHASE 5 — Responsive System (4-Tier Web · Mobile-First)

**Law: Design at 375px first. Expand outward. Never the reverse.**

| Tier | Viewport | Grid | Nav |
|------|----------|------|-----|
| **Mobile** | 375px | 1 col | Hamburger |
| **Tablet** | 768px | 2 col | Transforms |
| **Desktop** | 1280px | 3–4 col | Full |
| **Wide** | 1920px | max-w contained | Full |

### 3 Layout Transformation Patterns

**Pattern 1 — Stack → Grid (cards, features, testimonials)**
```css
.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(12px, 3vw, 24px);
}
@media (min-width: 768px)  { .grid-responsive { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 1280px) { .grid-responsive { grid-template-columns: repeat(3, 1fr); } }
/* Auto-fit fluid grid */
.grid-fluid { grid-template-columns: repeat(auto-fit, minmax(min(300px, 100%), 1fr)); }
```

**Pattern 2 — Collapse → Expand (nav, sidebar)**
```css
.nav-links { display: none; }
.hamburger { display: flex; }
@media (min-width: 768px) {
  .nav-links { display: flex; gap: clamp(16px, 3vw, 32px); }
  .hamburger { display: none; }
}
```

**Pattern 3 — Reflow (hero, split layouts)**
```css
.split { display: flex; flex-direction: column; gap: var(--space-8); }
@media (min-width: 768px) {
  .split { flex-direction: row; align-items: center; }
  .split-content { flex: 0 0 55%; }
  .split-visual  { flex: 0 0 45%; }
}
```

### The 7 Responsive Laws
1. Mobile-first CSS — `min-width` always, never `max-width` to shrink
2. `100dvh` not `100vh` — accounts for mobile browser chrome
3. `clamp()` everywhere — no fixed px for spacing or font sizes
4. Stack → Grid — 1 col → 2 col → 3–4 col
5. 44px touch targets — every button, link, interactive element
6. Hover in `@media (hover: hover)` — touch devices don't hover
7. No horizontal scroll — 375px clean. Test at 320px as extra safety net.

---

## PHASE 6 — Component System

Load `resources/components.md` for complete state specs and Checklist.Design gates.

### Component Library Stack
```
shadcn/ui      → Accessible base primitives
Aceternity UI  → Premium motion components
Magic UI       → Framer Motion + Tailwind animated
Motion.dev     → Framer Motion v11 animation layer
Radix UI       → Headless accessible primitives
```

**shadcn install:**
```bash
npx shadcn@latest add button card dialog form
```

### 3D Assets
```
3D Letters:       artify.co/3dlettering
3D Icons:         3dicons.co
3D Illustrations: icons8.com/l/3d · handz.design · homies-f662e0.webflow.io
3D Models (AI):   meshy.ai
Spline scenes:    spline.design/community
```

---

## PHASE 7 — MOTION (Auto-Activated — Always)

**03_MOTION activates automatically on every design task.**
A deliverable without motion is incomplete. Micro-interactions separate good from great.

**Minimum motion for every project:**
```
Scroll reveals:    Fade-up sections (opacity 0→1, translateY 24→0, 600ms expo-out)
Hover states:      Card lift (-4px), button spring press (scale 0.97)
Page transitions:  Fade (250ms)
Loading states:    Skeleton wave animation
```

**Escalate to full 03_MOTION engine when:**
- Portfolio work (always — this is what wins clients)
- Landing pages (scroll narrative, pinned sections)
- Hero sections (entrance sequence)
- Feature showcases (staggered reveals)
- Any "wow" requirement

---

## PHASE 8 — Delivery Gate (Run every time)

```
UX LAWS
□ Proximity: intra-group ≤ 50% of inter-group (1:2.5 minimum ratio)
□ Similarity: same-level elements share visual treatment
□ Hierarchy: most important = biggest + most contrasted
□ ≤ 7 items per group without chunking
□ One primary CTA per viewport
□ Peak moments (hero, footer, confirmation) extra polished
□ Squint test passes — groups obvious, hierarchy unmistakable
□ Decorative elements removed if they don't serve hierarchy or brand

RESPONSIVE (all 4 tiers verified)
□ 375px — 1 col, no overflow, 16px min text, 44px touch targets
□ 768px — 2-col grid, nav transformed, side-by-side appears
□ 1280px — full layout, hover states active, multi-col grids
□ 1920px — max-w container, no stretching

VISUAL QUALITY
□ All values from global.css tokens — zero hardcoded values
□ Font Joy 3-tier applied (display / subhead / body)
□ 60-30-10 color rule — accent used sparingly
□ Section padding: clamp(40px, 8vw, 80px)
□ Body text max-width: 65ch
□ 4px grid alignment on all elements
□ Text over images has contrast treatment (overlay/shadow/backdrop)
□ Dark mode works (if applicable)

ACCESSIBILITY
□ 4.5:1 contrast on body text, 3:1 on UI components
□ 44px minimum touch targets
□ All images have alt text
□ focus-visible on all interactive elements
□ prefers-reduced-motion respected
□ Semantic HTML (H1 → H2 → H3, no skipping)
□ Form inputs have visible labels

MOTION
□ 03_MOTION activated — minimum: scroll reveals + hover states
□ Hover states in @media (hover: hover) wrapper
□ GPU-only animations (transform + opacity only)
□ prefers-reduced-motion handled
□ No linear easing anywhere

COMPONENTS
□ All required states: default, hover, active, focus, disabled, loading, empty, error
□ Checklist.Design gate passed for each component type
□ No emoji as icons — SVG/Lucide only
□ loading="lazy" on all below-fold images
```

---

## Resources (load on demand)

| File | Load when |
|------|-----------|
| `resources/ux-laws.md` | **ALWAYS — before any layout decision** |
| `resources/global.css` | **ALWAYS — first thing every build** |
| `resources/aesthetics.md` | Choosing aesthetic style |
| `resources/typography.md` | Choosing fonts |
| `resources/color-system.md` | Choosing color palette |
| `resources/components.md` | Building individual components |

---

## Traps

| Catch yourself… | Fix |
|-----------------|-----|
| Designing desktop first | 375px baseline — always |
| Hardcoding any color/spacing | Use global.css token |
| Intra-group = inter-group gap | Enforce 1:2.5 ratio — make grouping obvious |
| No motion on deliverable | Auto-activate 03_MOTION — mandatory |
| Text over image without contrast | Overlay / shadow / backdrop — always |
| Decorative elements for decoration | Prägnanz law — remove it |
| `100vh` for hero | Use `100dvh` |
| emoji as icons | SVG/Lucide only |
| Thinking 10_MOBILE = web responsive | 10_MOBILE is for React Native native apps only |
| Skipping the squint test | Squint first — spacing problems become obvious |

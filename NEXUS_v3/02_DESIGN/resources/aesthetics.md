# Design Aesthetics Reference
## Complete CSS values · AI prompts · Reference sites

Load this file when: choosing aesthetic direction, need exact CSS patterns, running /polish.

---

## /POLISH — Impeccable 20-Point Checklist

Run this on any UI before delivery. Fix everything that fails.

```
IMPECCABLE DESIGN CHECKLIST
────────────────────────────
Typography
□ 1. No default Inter/Roboto — purposeful font choice made
□ 2. Type scale uses 3-tier: display / subhead / body
□ 3. Line-height: 1.5–1.75 for body text, 1.2–1.35 for headings
□ 4. Max line-length: 65–75 chars for body (max-width: 65ch on paragraphs)
□ 5. Letter-spacing: tight on large headings (–0.025em), normal on body

Color & Contrast
□ 6. 4.5:1 contrast ratio on all body text (3:1 on large text / UI)
□ 7. Not relying on color alone to convey information
□ 8. 60-30-10 rule: 60% base, 30% secondary, 10% accent
□ 9. Dark mode tested and functional
□ 10. Borders visible in both modes

Layout & Spacing
□ 11. Consistent spacing scale (from global.css tokens only)
□ 12. Floating elements have proper edge spacing
□ 13. No content hidden behind fixed navbars
□ 14. All sections use --space-section for vertical padding
□ 15. Grid gutters consistent throughout

Interaction
□ 16. All clickable elements have cursor: pointer
□ 17. Hover states use @media (hover: hover) wrapper
□ 18. All transitions: 150–300ms with proper easing (no linear)
□ 19. Focus visible on all interactive elements
□ 20. 44px minimum touch targets on all interactive elements
```

---

## 1.1 Glassmorphism

**What it is:** Frosted glass panels — semi-transparent, blurred, with a subtle border.

**Core CSS:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

/* Required: vibrant background gradient behind glass */
.glass-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  /* OR: background: linear-gradient(135deg, #f093fb, #f5576c, #4facfe); */
}

/* Glass navbar */
.glass-nav {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

/* Dark glassmorphism */
.glass-dark {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Color palettes:**
- Vivid: `#667eea → #764ba2` (purple-blue)
- Warm: `#f093fb → #f5576c` (pink-red)
- Cool: `#4facfe → #00f2fe` (blue-cyan)
- Sunset: `#fa709a → #fee140` (pink-yellow)

**AI Prompt:**
> "Build a glassmorphism SaaS landing page. Use a vivid purple-to-blue gradient background (#667eea to #764ba2). Create 3 feature cards with background: rgba(255,255,255,0.15), backdrop-filter: blur(12px), white border at 30% opacity, subtle drop shadow. Text: white. Glass navbar at top with same treatment. Headline 72px bold white, subtext 20px rgba(255,255,255,0.8)."

**Reference sites:**
- Halo Lab: dribbble.com/tags/glassmorphism
- Apple iCloud: icloud.com (refined glass login)
- glassmorphism.com (CSS generator)

---

## 1.2 Neumorphism (Soft UI)

**What it is:** Elements that appear pushed out of or pressed into the background surface.

**Core CSS:**
```css
/* Raised element */
.neumorphic {
  background: #e0e5ec;
  box-shadow: 6px 6px 12px #b8bec7, -6px -6px 12px #ffffff;
  border-radius: 12px;
}

/* Pressed/active state (inset) */
.neumorphic:active,
.neumorphic-pressed {
  box-shadow: inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff;
}

/* Dark neumorphism */
.neumorphic-dark {
  background: #1e2030;
  box-shadow: 6px 6px 12px #151824, -6px -6px 12px #27283c;
}

/* Critical rule: background of element MUST match page background */
body.neumorphic-page {
  background: #e0e5ec;  /* Must match --neumorphic-bg */
}
```

**Palette:** Exact match required — `#e0e5ec` light, `#1e2030` dark.

**Best for:** Music players, control panels, dashboard widgets. NOT for primary CTAs — too low contrast.

**AI Prompt:**
> "Create a neumorphism music player on #e0e5ec background. Circular play/pause buttons: box-shadow: 6px 6px 12px #b8bec7, -6px -6px 12px #ffffff. Active/pressed: inset 4px 4px 8px #b8bec7, inset -4px -4px 8px #ffffff. Volume slider and track progress in same style. All text: #6b7280."

**Reference sites:**
- neumorphism.io (CSS generator)
- dribbble.com/tags/neumorphism

---

## 1.3 Brutalism

**What it is:** Intentionally raw — thick black borders, stark primary colors, no rounded corners, asymmetric layouts.

**Core CSS:**
```css
.brutalist-card {
  border: 3px solid #000000;
  border-radius: 0;           /* NEVER border-radius in brutalism */
  background: #FFFFFF;
  box-shadow: 4px 4px 0 #000000;  /* Hard offset shadow */
}

/* Hover: shift the shadow */
.brutalist-card:hover {
  box-shadow: 6px 6px 0 #000000;
  transform: translate(-2px, -2px);
}

/* Rotated elements — brutalism signature */
.brutalist-rotate { transform: rotate(-1.5deg); }
.brutalist-rotate-right { transform: rotate(1deg); }

/* Brutalist nav */
.brutalist-nav {
  border-bottom: 3px solid #000;
  background: #FFE600;  /* or #FFFFFF */
}

/* Monospace body text */
.brutalist-body {
  font-family: 'Courier New', 'Courier', monospace;
  font-size: 14px;
}
```

**Colors:** Pure yellow `#FFE600`, pure white `#FFFFFF`, pure black `#000000`. Optional red `#FF0000`. NO pastels, NO gradients.

**AI Prompt:**
> "Build a brutalist portfolio with #FFFFFF background. Bold black borders (3px solid #000) on every card and section. Hero headline 80px font-weight 900. Accent: #FFE600 for hover states. Slight rotation (transform: rotate(-1.5deg)) on image cards. Monospace body text. No gradients, no drop shadows, no border-radius anywhere. Hard offset box-shadows (4px 4px 0 #000)."

**Reference sites:**
- gumroad.com (most famous modern brutalist)
- figma.com/community (search 'brutalism')
- hype4.academy

---

## 1.4 Minimalism

**What it is:** Content IS the design. Everything that doesn't serve content is removed.

**Core CSS:**
```css
/* Minimal typography hierarchy — only font size/weight/spacing */
.minimal-hero {
  font-size: clamp(2.5rem, 8vw, 5rem);
  font-weight: 300;  /* Light weight = sophistication */
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: #111111;
}

.minimal-body {
  font-size: 1rem;
  line-height: 1.8;  /* Very generous line-height */
  color: #555555;
  max-width: 60ch;
}

/* Generous section padding */
.minimal-section {
  padding-block: clamp(4rem, 12vw, 10rem);
}

/* The only color in minimalism is the accent */
.minimal-accent { color: #111111; }  /* Or a single color */

/* Photo grid with pure whitespace */
.minimal-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
}
```

**Colors:** Near-black `#111111`, near-white `#FAFAF9` or `#F5F5F0`, single mid-gray `#888888`.

**AI Prompt:**
> "Design a minimalist photography portfolio. Background: #FAFAF9. Single font (Cormorant Garamond): hero 72px weight 300, section titles 32px. Colors: #111 text, #888 captions. No icons, no decorative elements, no gradients. Section padding: 80–120px vertical. Generous white space is the design. Image grid with 40px gaps."

**Reference sites:**
- linear.app (cleanest minimal SaaS)
- awwwards.com/websites/minimal
- typewolf.com

---

## 1.5 Bento Grid

**What it is:** Varied-size card mosaic, inspired by Apple's Mac pages. Mixed sizes, treatments, and colors.

**Core CSS:**
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;
  gap: 12px;
  background: #0A0A0A;  /* Dark page background */
  padding: 12px;
}

/* Size variants */
.bento-wide  { grid-column: span 2; }   /* Featured horizontal */
.bento-tall  { grid-row: span 2; }       /* Featured vertical */
.bento-large { grid-column: span 2; grid-row: span 2; }  /* Hero card */

/* Card treatments */
.bento-dark    { background: #111111; }
.bento-accent  { background: #1A1A2E; }
.bento-light   { background: #F5F5F5; color: #111; }

.bento-card {
  border-radius: 16px;
  padding: 24px;
  overflow: hidden;
  transition: transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1);
}
@media (hover: hover) {
  .bento-card:hover { transform: scale(1.02); }
}

/* Mobile: collapse to single column */
@media (max-width: 767px) {
  .bento-grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
  .bento-wide, .bento-tall, .bento-large { grid-column: auto; grid-row: auto; }
}
```

**Bento Card Mix Formula:** 1 large (2x2) + 1 wide (2x1) + 1 tall (1x2) + 4 small (1x1) = natural hierarchy.

**AI Prompt:**
> "Build a bento grid on #0A0A0A. 3-column CSS grid, auto rows 200px, 12px gap. 6 cards: one 2-column featured with product screenshot, one tall 2-row with bold stat '10x faster', four smaller feature cards. Dark cards #111111, accent cards #1A1A2E. 16px border-radius. Hover scale(1.02) with spring easing. Single column on mobile."

**Reference sites:**
- apple.com/mac (the gold standard)
- linear.app (dark bento SaaS)
- framer.com
- dribbble.com/tags/bento

---

## 1.6 Dark Luxury

**What it is:** Near-black backgrounds, single accent color, premium SaaS and high-end brand aesthetic.

**Core CSS:**
```css
/* Near-black — NOT pure black (#000) */
:root {
  --luxury-bg:      #0A0A0A;   /* Page */
  --luxury-bg-2:    #111111;   /* Cards */
  --luxury-bg-3:    #1A1A2E;   /* Accent sections */
  --luxury-border:  rgba(255, 255, 255, 0.08);
  --luxury-text:    #F1F1EE;
  --luxury-muted:   rgba(241, 241, 238, 0.6);
  --luxury-accent:  #0066FF;   /* Or: #F59E0B amber, #8B5CF6 purple */
}

.luxury-card {
  background: var(--luxury-bg-2);
  border: 1px solid var(--luxury-border);
  border-radius: 12px;
}

/* Thin divider lines */
.luxury-divider {
  border: none;
  height: 1px;
  background: var(--luxury-border);
}

/* Accent used ONLY for CTAs, icons, highlights */
.luxury-cta {
  background: var(--luxury-accent);
  color: white;
}

/* Glow effect on accent elements */
.luxury-glow {
  box-shadow: 0 0 30px rgba(0, 102, 255, 0.3);
}
```

**AI Prompt:**
> "Build a dark luxury SaaS landing page. Background #0A0A0A (NOT pure black). Cards #111111. Single accent: electric blue #0066FF (used only for CTA buttons and icons). Typography: white #F1F1EE, muted rgba(241,241,238,0.6). Borders: rgba(255,255,255,0.08). Thin dividers throughout. Hero headline 80px white, tight letter-spacing -0.025em."

**Reference sites:**
- stripe.com (dark luxury fintech)
- vercel.com
- linear.app/dark-theme

---

## 1.7 Claymorphism

**What it is:** Inflated 3D-looking UI — pastel colors, thick inner shadows, rounded corners.

**Core CSS:**
```css
.clay-card {
  background: #74b9ff;  /* Pastel base */
  border-radius: 24px;
  box-shadow:
    inset 0 -8px 0 rgba(0,0,0,0.12),   /* Bottom inner shadow = depth */
    0 8px 16px rgba(0,0,0,0.12),         /* Outer shadow */
    inset 0 4px 0 rgba(255,255,255,0.4); /* Top highlight */
}

.clay-btn {
  background: #6c5ce7;
  border-radius: 16px;
  padding: 12px 24px;
  box-shadow:
    inset 0 -4px 0 rgba(0,0,0,0.2),
    0 4px 12px rgba(108, 92, 231, 0.4);
  transition: transform 150ms, box-shadow 150ms;
}
.clay-btn:active {
  transform: translateY(4px);
  box-shadow: inset 0 -1px 0 rgba(0,0,0,0.2), 0 1px 4px rgba(108,92,231,0.3);
}
```

**Pastel palette:** `#74b9ff` blue, `#a29bfe` purple, `#55efc4` mint, `#fd79a8` pink, `#fdcb6e` yellow.

---

## 1.8 Y2K / Retro-Futurism

**What it is:** Chrome effects, neon accents, pixel elements, Windows 98 nostalgia meets sci-fi.

**Core CSS:**
```css
/* Chrome text effect */
.y2k-chrome {
  background: linear-gradient(180deg, #e8e8e8 0%, #b0b0b0 30%, #f0f0f0 60%, #888 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
}

/* Scanline overlay */
.y2k-scanlines {
  position: relative;
}
.y2k-scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 3px);
  pointer-events: none;
}

/* Neon glow */
.y2k-neon {
  color: #00ff88;
  text-shadow: 0 0 10px #00ff88, 0 0 20px #00ff88, 0 0 40px #00ff8840;
}

/* Pixel border */
.y2k-pixel {
  border: 2px solid #00ff88;
  image-rendering: pixelated;
  box-shadow: inset 0 0 0 1px #000;
}
```

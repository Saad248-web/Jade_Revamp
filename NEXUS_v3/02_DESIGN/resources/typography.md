# Typography System — Font Joy 3-Tier Reference
## Display / Subhead / Body · Contrast Spectrum · Brand Personality Map

**Philosophy (Font Joy):** Good pairings share a theme but contrast in a specific dimension.
Contrast spectrum: **Low** (cohesive, subtle) → **Medium** (balanced, versatile) → **High** (editorial, bold)

---

## The 3-Tier System

Every design gets exactly 3 tiers. Never just a pair.

```css
/* Apply in global.css — override per project */
--font-display:  '[Display Font]', fallback;   /* Headlines, hero, large numbers */
--font-subhead:  '[Subhead Font]', fallback;   /* Section titles, labels, nav */
--font-body:     '[Body Font]',    fallback;   /* Paragraphs, UI text, captions */
```

**Usage rules:**
- Display: hero headlines, oversized numbers, pull quotes only
- Subhead: H2/H3 headings, navigation, cards, labels
- Body: all readable prose, UI text, form elements, captions
- Max 3 families total — never mix display into body or vice versa

---

## Pairings by Brand Personality

### Luxury / Premium

| # | Display | Subhead | Body | Contrast | Use |
|---|---------|---------|------|----------|-----|
| L1 | Cormorant Garamond | DM Sans | DM Sans Light | High | Fashion, jewelry, perfume |
| L2 | Playfair Display | Lato | Lato Light | High | Hospitality, real estate |
| L3 | Cinzel | Raleway | Raleway Light | High | Watches, premium services |
| L4 | EB Garamond | Mulish | Mulish Light | Medium | Publishing, editorial |
| L5 | Libre Baskerville | Source Serif 4 | Source Sans 3 | Low | Legal, finance (premium) |

```css
/* L1 — Most versatile luxury */
--font-display:  'Cormorant Garamond', Georgia, serif;
--font-subhead:  'DM Sans', system-ui, sans-serif;
--font-body:     'DM Sans', system-ui, sans-serif;
/* Load: weights 300, 400, 500, 600 for DM Sans; 300, 400, 500, 600, 700 for Cormorant */
```

---

### Modern Tech / SaaS

| # | Display | Subhead | Body | Contrast | Use |
|---|---------|---------|------|----------|-----|
| T1 | Bricolage Grotesque | Inter | Inter | Low | Tech startup, tool |
| T2 | Cabinet Grotesk | Plus Jakarta Sans | Plus Jakarta Sans | Low | B2B SaaS |
| T3 | Syne | Space Grotesk | Space Mono | Medium | Dev tools, technical |
| T4 | General Sans | Geist | Geist Mono | Low | Developer platform |
| T5 | Outfit | Manrope | Manrope | Low | Clean SaaS |

```css
/* T1 — Default modern SaaS */
--font-display:  'Bricolage Grotesque', system-ui, sans-serif;
--font-subhead:  'Inter', system-ui, sans-serif;
--font-body:     'Inter', system-ui, sans-serif;
```

---

### Bold / Editorial

| # | Display | Subhead | Body | Contrast | Use |
|---|---------|---------|------|----------|-----|
| E1 | Fraunces | Libre Baskerville | Source Serif 4 | High | News, magazine |
| E2 | Clash Display | Clash Grotesk | Satoshi | High | Agency, creative |
| E3 | Anton | Roboto Condensed | Roboto | High | Sports, energy |
| E4 | Bebas Neue | Oswald | Open Sans | High | Bold marketing |
| E5 | Righteous | Nunito | Nunito | Medium | Gaming, entertainment |

---

### Playful / Consumer

| # | Display | Subhead | Body | Contrast | Use |
|---|---------|---------|------|----------|-----|
| P1 | Nunito | Nunito Sans | Nunito Sans | Low | Kids, wellness, food |
| P2 | Poppins | Poppins | Poppins Light | Low | Consumer app, lifestyle |
| P3 | Quicksand | Quicksand | Quicksand | Low | Health, beauty, soft |
| P4 | Baloo 2 | DM Sans | DM Sans | Medium | Food delivery, social |

---

### Creative Studio / Agency

| # | Display | Subhead | Body | Contrast | Use |
|---|---------|---------|------|----------|-----|
| C1 | Playfair Display | Satoshi | Satoshi | Medium | Portfolio, creative agency |
| C2 | Abril Fatface | Lato | Lato | High | Art direction, fashion |
| C3 | Yeseva One | Josefin Sans | Josefin Sans | High | Design studio |
| C4 | Tenor Sans | Work Sans | Work Sans | Medium | Minimal creative |

---

### Dark / Ambient / Cinematic

| # | Display | Subhead | Body | Contrast | Use |
|---|---------|---------|------|----------|-----|
| D1 | Syne | Space Grotesk | Space Mono | Medium | Dark app, ambient |
| D2 | Bebas Neue | Space Grotesk | Space Grotesk | High | Cinematic, film |
| D3 | Cinzel Decorative | Cinzel | Raleway | Medium | Fantasy, luxury dark |
| D4 | Orbitron | Exo 2 | Exo 2 Light | High | Sci-fi, tech futurism |

---

### Startup / Clean / Minimal

| # | Display | Subhead | Body | Contrast | Use |
|---|---------|---------|------|----------|-----|
| S1 | Cabinet Grotesk | Plus Jakarta Sans | Plus Jakarta Sans | Low | Early-stage startup |
| S2 | DM Serif Display | DM Sans | DM Sans | High | Elegant startup |
| S3 | Unbounded | Jost | Jost | Medium | Web3, modern startup |
| S4 | Epilogue | Epilogue | Epilogue Light | Low | Minimal app |

---

### Healthcare / Trust

| # | Display | Subhead | Body | Contrast | Use |
|---|---------|---------|------|----------|-----|
| H1 | Nunito | Mulish | Mulish | Low | Healthcare, wellness |
| H2 | Source Serif 4 | Lato | Lato | Medium | Medical, clinical |
| H3 | Merriweather | Open Sans | Open Sans | Medium | Hospital, NGO |

---

### Financial / Enterprise

| # | Display | Subhead | Body | Contrast | Use |
|---|---------|---------|------|----------|-----|
| F1 | Lato | Source Serif 4 | Source Serif 4 | Medium | Finance, banking |
| F2 | IBM Plex Serif | IBM Plex Sans | IBM Plex Sans | Medium | Enterprise, B2B |
| F3 | Merriweather | Roboto | Roboto | Medium | Legal, insurance |

---

## Loading Patterns

### Next.js (zero layout shift — preferred)
```tsx
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

// In layout.tsx:
// <html className={`${display.variable} ${body.variable}`}>
```

### HTML (Google Fonts CDN)
```html
<!-- Load only used weights -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
```

### Fontsource (npm — for any framework)
```bash
npm install @fontsource/cormorant-garamond @fontsource/dm-sans
```
```tsx
import '@fontsource/cormorant-garamond/400.css';
import '@fontsource/cormorant-garamond/600.css';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
```

---

## Font Validation Checklist

Before finalizing font choice:
```
□ Tested at all 4 viewport sizes (375 / 768 / 1280 / 1920)
□ Body text readable at 16px base size
□ Display font legible at both large (hero) and medium (card title) sizes
□ Fallback fonts specified (never leave blank)
□ font-display: swap always set
□ Only needed weights loaded
□ fontjoy.com validates the pairing (check contrast slider)
□ Not using Inter/Roboto/Arial as creative choice (only as fallback)
```

---

## Type Scale Application

```css
/* Map global.css scale to semantic roles */
.hero-headline   { font-family: var(--font-display); font-size: var(--text-hero);   font-weight: 700; letter-spacing: -0.025em; }
.page-title      { font-family: var(--font-display); font-size: var(--text-5xl);    font-weight: 700; }
.section-title   { font-family: var(--font-subhead); font-size: var(--text-4xl);   font-weight: 600; }
.card-title      { font-family: var(--font-subhead); font-size: var(--text-xl);    font-weight: 600; }
.label           { font-family: var(--font-subhead); font-size: var(--text-sm);    font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; }
.body-text       { font-family: var(--font-body);    font-size: var(--text-base);   line-height: 1.7; }
.body-lead       { font-family: var(--font-body);    font-size: var(--text-lg);     line-height: 1.6; }
.caption         { font-family: var(--font-body);    font-size: var(--text-xs);     color: var(--color-text-tertiary); }
```

# Color System — 60+ Curated Palettes
## Inline reference — no scripts needed

**The 60-30-10 Rule:** 60% base (backgrounds), 30% secondary (cards, sections), 10% accent (CTAs, highlights)

---

## By Product Type

### SaaS / Tech

| Name | Base | Secondary | Accent | Tone |
|------|------|-----------|--------|------|
| **Linear Dark** | #0A0A0A | #111111 | #5B6AD0 | Premium dark |
| **Vercel** | #000000 | #111111 | #FFFFFF | Minimal dark |
| **Stripe** | #F6F9FC | #FFFFFF | #635BFF | Clean blue |
| **Notion** | #FFFFFF | #F7F7F5 | #000000 | Editorial |
| **GitHub Dark** | #0D1117 | #161B22 | #238636 | Dev dark |
| **Figma** | #1E1E1E | #2C2C2C | #FF7262 | Creative dark |
| **Supabase** | #0F0F0F | #1C1C1C | #3ECF8E | Green dark |
| **Loom** | #FFFFFF | #F5F5F5 | #625DF5 | Purple light |

### E-commerce / Retail

| Name | Base | Secondary | Accent | Tone |
|------|------|-----------|--------|------|
| **Shopify** | #FFFFFF | #F6F6F7 | #96BF48 | Clean green |
| **Premium Dark** | #0A0A0A | #141414 | #F59E0B | Amber luxury |
| **Luxury White** | #FAFAF8 | #F0EDE8 | #C9A96E | Gold warm |
| **Bold Commerce** | #FFFFFF | #F5F5F5 | #E53E3E | Red bold |

### Healthcare / Wellness

| Name | Base | Secondary | Accent | Tone |
|------|------|-----------|--------|------|
| **Calm** | #F8FFFE | #EBF8F5 | #38A169 | Mint green |
| **Clinical** | #FFFFFF | #F7FAFC | #3182CE | Trust blue |
| **Warm Health** | #FFFDF7 | #FFF8E7 | #D69E2E | Warm amber |
| **Mindful** | #FAFBFF | #EFF6FF | #6366F1 | Lavender calm |

### Finance / Fintech

| Name | Base | Secondary | Accent | Tone |
|------|------|-----------|--------|------|
| **Goldman** | #0A0A0A | #141414 | #B8955A | Gold dark |
| **Robinhood** | #FFFFFF | #F5F5F5 | #00C805 | Green bold |
| **Wise** | #FFFFFF | #F4F4F4 | #9FE870 | Lime modern |
| **Mercury** | #FAFAFA | #F5F5F5 | #0052FF | Navy clean |

### Creative / Agency

| Name | Base | Secondary | Accent | Tone |
|------|------|-----------|--------|------|
| **Editorial Dark** | #0C0C0C | #141414 | #FF4D00 | Orange fire |
| **Art Studio** | #F5F0E8 | #EBE5D9 | #2D2D2D | Warm paper |
| **Portfolio** | #FAFAFA | #F0F0F0 | #111111 | Minimal clean |
| **Bold Agency** | #FFFFFF | #F8F8F8 | #FF0066 | Pink bold |

---

## Glassmorphism Gradient Backgrounds

```css
/* Purple-Blue (most popular) */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

/* Warm Sunset */
background: linear-gradient(135deg, #f093fb 0%, #f5576c 50%, #fda085 100%);

/* Cool Ocean */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Forest */
background: linear-gradient(135deg, #0ba360 0%, #3cba92 100%);

/* Gold Luxury */
background: linear-gradient(135deg, #f7971e 0%, #ffd200 100%);

/* Midnight */
background: linear-gradient(135deg, #0c0c1d 0%, #1a1a4e 50%, #0d0d2b 100%);

/* Rose */
background: linear-gradient(135deg, #f5576c 0%, #f093fb 100%);

/* Dark Mesh (for bento grids) */
background: radial-gradient(ellipse at 20% 50%, rgba(120, 50, 190, 0.3) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 20%, rgba(37, 99, 235, 0.3) 0%, transparent 50%),
            #0A0A0A;
```

---

## Dark Mode Palette Pairs

Every accent needs a dark-mode-adapted version:

| Light accent | Dark accent | Notes |
|-------------|-------------|-------|
| #2563EB (blue) | #3B82F6 | +1 shade lighter |
| #DC2626 (red) | #EF4444 | +1 shade lighter |
| #16A34A (green) | #22C55E | +1 shade lighter |
| #D97706 (amber) | #F59E0B | +1 shade lighter |
| #7C3AED (purple) | #8B5CF6 | +1 shade lighter |
| #0891B2 (cyan) | #06B6D4 | +1 shade lighter |

**Rule:** In dark mode, accents should be 1–2 shades lighter to maintain contrast on dark backgrounds.

---

## Neutral Scale (full 11-step)

```css
/* Use these when project has no defined brand neutrals */
--neutral-50:  #FAFAFA;
--neutral-100: #F5F5F5;
--neutral-200: #E5E5E5;
--neutral-300: #D4D4D4;
--neutral-400: #A3A3A3;
--neutral-500: #737373;
--neutral-600: #525252;
--neutral-700: #404040;
--neutral-800: #262626;
--neutral-900: #171717;
--neutral-950: #0A0A0A;
```

---

## Accessibility — Contrast Checker

Quick reference for common combos:

| Foreground | Background | Ratio | Pass |
|-----------|-----------|-------|------|
| #111111 | #FFFFFF | 19.1:1 | ✅ AAA |
| #374151 | #FFFFFF | 9.7:1 | ✅ AAA |
| #6B7280 | #FFFFFF | 4.6:1 | ✅ AA |
| #9CA3AF | #FFFFFF | 2.9:1 | ❌ Fail |
| #F1F5F9 | #0F172A | 15.8:1 | ✅ AAA |
| #94A3B8 | #0F172A | 5.9:1 | ✅ AA |
| #FFFFFF | #2563EB | 4.6:1 | ✅ AA |
| #FFFFFF | #1D4ED8 | 5.9:1 | ✅ AA |
| #000000 | #F59E0B | 8.5:1 | ✅ AAA |

**Tool:** Use https://webaim.org/resources/contrastchecker/ to verify any custom combination.
Minimum: 4.5:1 for body text · 3:1 for large text (18px+ bold) and UI components.

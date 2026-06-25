# Jade Hospitainment — ReVamp

Marketing and booking platform for **Jade Hospitainment**: luxury private retreats, destination weddings, corporate offsites, and curated experiences near Bangalore. The site is a **Next.js 14** App Router application with typed retreat data in the repo, **MongoDB** for bookings/leads/CMS/users, optional **Razorpay** checkout, **Jade Host** staff dashboard (NextAuth RBAC), and a strong **SEO / GEO** layer (`sitemap`, `robots`, JSON-LD, `llms.txt`).

**Revision:** 2026-06-25 — Jade Host PMS + dashboard deploy

---

## What this repo delivers

| Area | Summary |
|------|---------|
| **Marketing** | Home, villa directory + detail, experience category pages, blogs, about, contact, careers |
| **Conversion** | Global enquire overlay, wedding/Rathaa/partner flows, `/book` + success + Razorpay |
| **Operations** | Jade Host `/dashboard` (NextAuth RBAC), booking APIs, Axis Rooms integration stubs, optional Resend notifications |
| **Discovery** | Per-villa metadata, spaces galleries, IndexNow hook, AI-oriented `public/llms.txt` |
| **UX** | Lenis smooth scroll, GSAP/Framer sections, venue overlays with section tabs + scroll spy |

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js **14.2.4** (App Router), React 18, TypeScript 5 |
| Styling | Tailwind CSS 3, container queries |
| Motion | GSAP, Framer Motion (`MotionConfig` + `prefers-reduced-motion`), Lenis |
| Media | `next/image`, prebuild blur manifest (`sharp` in scripts) |
| Database | MongoDB via Mongoose (`MONGODB_URI`) |
| Payments | Razorpay (order API + signed webhook) |
| Email | Resend (optional) |
| Observability | Sentry (`@sentry/nextjs`, optional DSN) |
| Tests | Vitest (unit), Playwright (E2E smoke) |
| CI | GitHub Actions — `npm test` + `npm run build` |

---

## Project structure

```text
Jade_ReVamp/
├── src/
│   ├── app/                    # App Router: pages, layouts, metadata routes
│   │   ├── api/                # REST handlers (bookings, leads, payments, media, IndexNow)
│   │   ├── book/               # Booking wizard + success (Razorpay hand-off)
│   │   ├── villas/[id]/        # Villa detail + /spaces gallery
│   │   ├── template.tsx        # Per-navigation remount; manual scroll restoration
│   │   ├── providers.tsx       # Lenis, overlays, booking/wishlist context, GA
│   │   ├── layout.tsx          # Global metadata, fonts, JSON-LD graph
│   │   ├── robots.ts / sitemap.ts
│   │   └── …                   # Category pages, blogs, legal, admin, menu
│   ├── components/             # UI (~88 TSX modules)
│   │   ├── experience/         # Villa overlay layout, pricing blocks, FAQ
│   │   ├── villa/              # Detail sections, sticky tabs, carousels
│   │   ├── menu/               # MenuPanelTabs (villa directory UX)
│   │   ├── ui/                 # JadeImage, MeanderStrip, carousels, EmptyState
│   │   └── booking/            # Shared booking form fields
│   ├── lib/                    # DB, payments, scroll spy, Lenis, validation, SEO helpers
│   ├── data/                   # Retreats, blogs, overlay pricing/villa maps
│   ├── context/                # Animation, booking, wishlist
│   └── generated/              # mediaManifest.ts (prebuild; gitignored output pattern)
├── public/                     # Large WebP/image tree + llms.txt + og-default.jpg
├── scripts/                    # Media manifest, favicons, OG, DB reset, setup checks
├── e2e/                        # Playwright smoke + lead-surface specs
├── schema.sql                  # Base Postgres schema (Docker first boot)
├── schema_migration_leads_rathaa_partner_payments.sql
├── docker-compose.db.yml
├── next.config.mjs             # Security headers, images, Sentry wrapper
├── src/middleware.ts           # Edge guard for /api/*
├── AGENTS.md / NEXUS_v4_APEX/  # AI agent orchestration (optional for humans)
├── audit-report.md             # Stakeholder audit (status + backlog)
└── WEBDEV-Audit.md             # Engineering audit (APIs, limits, evidence)
```

---

## Architecture highlights

### Scroll and navigation (2026-05)

- **`SmoothScroll`** — single global Lenis instance in `providers.tsx`; respects `prefers-reduced-motion`.
- **`ScrollToTopOnNavigate`** — resets scroll on route/search changes and browser back/forward (`scrollToPageTopWithRetries`).
- **`src/app/template.tsx`** — sets `history.scrollRestoration = "manual"` (avoids fighting Lenis).
- **Venue overlays** (`VenueOverlay`, `PartyVenueOverlay`, `CorporateVenueOverlay`) — shared hooks: `useVenueOverlaySectionNav`, `useSectionScrollSpy`, `useScrollTabIntoView`, `scrollToOverlaySection`.
- **Villa detail** — `VillaDetailStickyTabs` + `villaDetailSectionNav` + section scroll spy on `/villas/[id]`.
- **Chrome hide on scroll** — `useScrollHide` / `useOverlayScrollChromeHide` + `batchScrollUpdate` for batched listeners.

### Data model

- Villas and experiences are **TypeScript modules** under `src/data/retreats/` (not CMS-driven).
- `src/data/retreats/index.ts` exports `VILLAS`, `CATEGORIES`, and per-property records used by listings, overlays, and booking allowlists.
- Overlay-specific villa/pricing maps live under `src/data/overlays_data/{wedding,party,corporate,weekend}/`.

### Global overlays (client)

Mounted once in `providers.tsx`:

- `EnquireOverlay` → `POST /api/leads` (`general_enquiry`)
- `RathaaOverlay` → `POST /api/leads` (`rathaa_enquiry`)
- `PartnerOverlay` → `POST /api/leads/partner` (multipart)

Booking UI uses `/book` and `ReservationOverlay` on the villas carousel — not a legacy monolithic booking overlay.

---

## Getting started

### Prerequisites

- **Node.js 20** LTS (CI uses 20)
- **Docker Desktop** for local PostgreSQL (`npm run db:up`)
- Copy **`.env.example`** → **`.env.local`** (never commit `.env.local`)

### Install and run

```bash
npm install
npm run db:up          # Postgres; first start applies schema.sql via compose mount
npm run db:migrate     # Phase 2: idempotent migrations on existing DB
npm run dev            # http://localhost:3000
```

**Phase 2 (live leads + careers):** set `NEXT_PUBLIC_ENQUIRY_DEMO_MODE=false` and `NEXT_PUBLIC_CAREERS_DEMO_MODE=false` in `.env.local`, restart dev, then:

```bash
npm run api:smoke      # Expect 201 from /api/leads and /api/careers/apply
```

Verify local setup:

```bash
npm run setup:check    # Node, deps, .env.local, DB port, demo flags
npm run setup:guide    # Opens docs/local-dev-setup-guide.html
```

Production build (runs `prebuild` media manifest):

```bash
npm run build
npm start
```

---

## Environment variables

Full template: [`.env.example`](.env.example).

| Variable | Required | Purpose |
|----------|----------|---------|
| `MONGODB_URI` | Bookings + leads + CMS | Single MongoDB via `connectDB()` in `src/lib/db.ts` |
| `ADMIN_PASSWORD` | Staff login | Legacy `/login` + `x-admin-password` on admin APIs |
| `NEXTAUTH_SECRET` | Dashboard RBAC | NextAuth JWT (Phase 2b) |
| `CRON_SECRET` | Cron routes | `Authorization: Bearer` on `/api/cron/*` |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Payments | `POST /api/payments/razorpay-order` |
| `RAZORPAY_WEBHOOK_SECRET` | Webhook | HMAC verify on `POST /api/webhooks/razorpay` |
| `NEXT_PUBLIC_PAYMENT_GATEWAY_KEY` | Checkout UI | Razorpay Checkout on `/book/success` |
| `RESEND_API_KEY` + `RESEND_FROM` | Optional email | Lead/career/booking notifications |
| `LEADS_NOTIFY_EMAIL` / `CAREERS_NOTIFY_EMAIL` / `BOOKING_NOTIFY_EMAIL` | Optional | Inbox routing |
| `NEXT_PUBLIC_GA_ID` | Optional | `GoogleAnalytics` in providers |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Sentry client + server |
| `INDEXNOW_KEY` / `INDEXNOW_HOST` / `INDEXNOW_API_SECRET` | IndexNow | Production Bearer on `POST /api/indexnow` |
| `NEXT_PUBLIC_API_BASE_URL` | Future | Reserved in `lib/api.ts` for external API switch |
| `NEXT_PUBLIC_ENQUIRY_DEMO_MODE` | Phase 2 | `false` = Enquire + Footer POST `/api/leads` |
| `NEXT_PUBLIC_CAREERS_DEMO_MODE` | Phase 2 | `false` = Careers Apply POST `/api/careers/apply` |

---

## NPM scripts

| Script | Description |
|--------|-------------|
| `dev` | Next.js development server |
| `build` / `start` | Production build and server (`prebuild` → media manifest) |
| `lint` | `next lint` |
| `test` | Vitest — `bookingDetailsValidation`, `paymentService` |
| `test:e2e` | Playwright vs dev server |
| `test:e2e:ci` | `build` + production server + Playwright (`CI=true`) |
| `db:up` / `db:down` / `db:reset` | **Legacy** Docker Compose PostgreSQL (deprecated — use Atlas/local Mongo) |
| `db:seed` | `node scripts/seed-villas.mjs` — seed confirmed villas |
| `db:migrate` | Apply SQL migrations (weekend source, careers indexing, etc.) |
| `db:reset:schema` | `scripts/reset-local-db.mjs` |
| `api:smoke` | Phase 2 smoke: POST leads + careers apply (dev server running) |
| `setup:check` / `setup:guide` | Local environment verification |
| `optimize-images` / `optimize-images:dry-run` | `scripts/optimize_public_images.mjs` |
| `generate-favicons` | `scripts/generate_favicons.mjs` |

---

## Routes (App Router)

| Path | Role |
|------|------|
| `/` | Landing (splash + scroll sections) |
| `/villas`, `/villas/[id]`, `/villas/[id]/spaces` | Directory, detail, gallery |
| `/weddings`, `/corporate-retreats`, `/weekend-getaways`, `/party-villas` | Experience category + venue overlays |
| `/experiences` | Experiences hub |
| `/caravans` | Caravan experience + Rathaa CTA |
| `/blogs`, `/blogs/[slug]` | Editorial |
| `/book`, `/book/success` | Booking + payment |
| `/menu` | Full-screen villa/experience directory |
| `/about`, `/contact`, `/careers` | Brand, contact, hiring |
| `/wishlist` | Saved villas (`noindex`) |
| `/admin` | Booking admin UI (`noindex`) |
| `/privacy-policy`, `/terms-conditions`, `/refund-policy` | Legal |

Metadata routes: `robots.ts`, `sitemap.ts`, `manifest.ts`.

---

## API routes (overview)

| Method | Route | Purpose |
|--------|-------|---------|
| `POST` | `/api/bookings` | Create booking + overlap check |
| `GET` | `/api/bookings` | Admin list (`x-admin-password`) |
| `GET` / `PATCH` / `DELETE` | `/api/bookings/[id]` | Admin CRUD |
| `GET` | `/api/bookings/availability` | Monthly occupancy by villa |
| `POST` | `/api/leads` | `general_enquiry`, `rathaa_enquiry`, `wedding_enquiry` |
| `POST` | `/api/leads/partner` | Partner multipart + photos |
| `POST` | `/api/careers/apply` | Résumé multipart |
| `POST` | `/api/payments/razorpay-order` | Create order; links `booking_uuid` |
| `POST` | `/api/webhooks/razorpay` | Signed payment events |
| `POST` | `/api/indexnow` | URL submission (Bearer in prod) |
| `GET` | `/api/instagram/oembed` | Bounded oEmbed proxy |
| `GET` | `/api/villas/[id]/media` | Villa media JSON |
| `GET` | `/api/experiences/[slug]/media` | Experience media JSON |

Edge middleware on **`/api/*`**: verb allowlist, **600 req / 60 s / IP**, `Cross-Origin-Resource-Policy: same-site`. Per-route limits are documented in [`WEBDEV-Audit.md`](./WEBDEV-Audit.md).

---

## Testing

```bash
npm test                 # Vitest unit tests
npm run test:e2e         # Playwright (starts dev)
npm run test:e2e:ci      # build + start + Playwright
```

E2E coverage today:

- `e2e/smoke.spec.ts` — home title, `/book` shell
- `e2e/lead-surfaces.spec.ts` — `/careers`, `/contact` heroes

CI (`.github/workflows/ci.yml`): `npm ci` → `npm test` → `npm run build` on `main` / `master` PRs and pushes. Playwright is local/optional in CI (not in workflow) due to weight.

---

## Performance and assets

- `prebuild` writes `src/generated/mediaManifest.ts` with LQIP blur data for gallery performance.
- `next.config.mjs` enables AVIF/WebP, remote patterns, long-cache `_next/image`, production security headers (HSTS, COOP, Permissions-Policy).
- `public/` is large by design; use `npm run optimize-images` before big media commits; consider CDN/object storage at scale.

---

## Documentation and audits

| File | Audience |
|------|----------|
| [`audit-report.md`](./audit-report.md) | Stakeholders — shipped vs backlog, SEO story, risks |
| [`WEBDEV-Audit.md`](./WEBDEV-Audit.md) | Engineers — API truth, rate limits, evidence paths |

---

## AI-assisted development

This repo uses **NEXUS APEX v4.0** (`NEXUS_v4_APEX/`, [`AGENTS.md`](./AGENTS.md)):

1. Run the engine loop in `AGENTS.md` before non-trivial changes.
2. Read the relevant `NEXUS_v4_APEX/<ENGINE>/SKILL.md` (UI → `07_COMPONENTS`, API → `10_API`, SEO → `21_SEO`, etc.).
3. Apply `0A_ANTISLOP` guardrails before finishing.

Note: NEXUS `09_BUILD` targets Next.js 15 patterns; **this project stays on Next 14** — follow existing `src/` conventions.

---

## License

Private — Jade Hospitainment. All rights reserved.

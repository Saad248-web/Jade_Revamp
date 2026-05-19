# Jade Hospitainment — ReVamp

Marketing and booking platform for **Jade Hospitainment** — luxury private retreats, destination weddings, corporate offsites, and curated experiences near Bangalore. Built as a performance- and SEO-first **Next.js 14** application with typed retreat data, PostgreSQL-backed bookings, and Razorpay payments.

## Features

- **Retreat portfolio** — Villa and experience pages driven by typed data in `src/data/retreats/`
- **Booking flow** — Availability checks, enquiry capture, admin management (`/admin`, `/book`)
- **Payments** — Razorpay order creation and webhook handling
- **Leads & careers** — Contact, partner, and multipart career applications (optional Resend email)
- **SEO / GEO** — Dynamic metadata, JSON-LD, `sitemap.ts` / `robots.ts`, and `public/llms.txt` for AI crawlers
- **Motion & UX** — GSAP, Framer Motion, Lenis smooth scroll, Rive where used

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS |
| Animation | GSAP, Framer Motion, Lenis |
| Database | PostgreSQL (`pg`) — local via Docker |
| Payments | Razorpay |
| Observability | Sentry (optional) |
| Tests | Vitest (unit), Playwright (E2E) |

## Project structure

```text
├── src/
│   ├── app/              # Routes, layouts, metadata, API handlers
│   │   └── api/          # Bookings, leads, payments, webhooks, IndexNow
│   ├── components/       # UI (sections, forms, analytics)
│   ├── lib/              # DB, API clients, payment helpers
│   ├── data/             # Retreats, blogs, static content models
│   └── context/          # Client state (animation, UI)
├── public/               # Images, video, llms.txt (large asset tree)
├── scripts/              # Media manifest, image/video optimization, setup checks
├── schema.sql            # PostgreSQL schema (applied on first Docker DB start)
├── NEXUS_v4_APEX/        # AI agent engine skills (see AGENTS.md)
├── AGENTS.md             # Orchestrator routing for AI-assisted development
└── .env.example          # Environment variable template
```

## Getting started

### Prerequisites

- **Node.js** 20 LTS (or current LTS)
- **Docker Desktop** — for local PostgreSQL (`npm run db:up`)
- Copy **`.env.example`** → **`.env.local`** and fill in values (never commit `.env.local`)

### Install and run

```bash
npm install
npm run db:up          # start Postgres (first run applies schema.sql)
npm run dev            # http://localhost:3000
```

Verify your machine is ready:

```bash
npm run setup:check    # Node, deps, .env.local, DB port
npm run setup:guide    # opens docs/local-dev-setup-guide.html
```

Production build (runs media manifest generation via `prebuild`):

```bash
npm run build
npm start
```

## Environment variables

See [`.env.example`](.env.example) for the full list. Common groups:

| Group | Purpose |
|-------|---------|
| `POSTGRES_*` | Local or hosted PostgreSQL for bookings |
| `RAZORPAY_*` | Order API and webhook signing |
| `ADMIN_PASSWORD` | `x-admin-password` header for admin booking APIs |
| `RESEND_*` | Optional transactional email |
| `NEXT_PUBLIC_GA_ID` | Google Analytics |
| `NEXT_PUBLIC_SENTRY_DSN` | Error reporting (optional locally) |
| `INDEXNOW_*` | Search-engine URL submission hook |

## NPM scripts

| Script | Description |
|--------|-------------|
| `dev` | Next.js development server |
| `build` / `start` | Production build and server |
| `lint` | ESLint (Next.js config) |
| `test` | Vitest unit tests |
| `test:e2e` | Playwright against dev server |
| `test:e2e:ci` | Build + Playwright (CI-style) |
| `db:up` / `db:down` / `db:reset` | Docker Compose PostgreSQL |
| `db:reset:schema` | Reset schema via script |
| `setup:check` / `setup:guide` | Local environment verification |
| `optimize-images` | Compress images under `public/` |
| `optimize-hero-video` | Hero video optimization |
| `generate-favicons` | Regenerate favicon assets |

## API routes (overview)

| Route | Purpose |
|-------|---------|
| `POST /api/bookings` | Create booking / enquiry |
| `GET /api/bookings/availability` | Date availability |
| `GET/PATCH/DELETE /api/bookings/[id]` | Admin booking operations |
| `POST /api/payments/razorpay-order` | Create Razorpay order |
| `POST /api/webhooks/razorpay` | Payment webhook |
| `POST /api/leads` | General lead capture |
| `POST /api/leads/partner` | Partner enquiries |
| `POST /api/careers/apply` | Career applications |
| `POST /api/indexnow` | IndexNow URL submission |
| `GET /api/villas/[id]/media` | Villa media manifest |
| `GET /api/experiences/[slug]/media` | Experience media manifest |

Booking and payment flows require a running database and valid Razorpay credentials for full end-to-end testing.

## Testing

```bash
npm test                 # Vitest
npm run test:e2e         # Playwright (starts dev server)
npm run test:e2e:ci      # build + start + Playwright
```

Optional: `PLAYWRIGHT_BASE_URL` in `.env.local` for a custom base URL.

## Performance and assets

- Images served as WebP/AVIF where configured in `next.config.mjs`
- `prebuild` generates a media manifest: `scripts/generate_media_manifest.mjs`
- Heavy UI (carousels, GSAP sections) uses dynamic imports where applied in code
- Run `npm run optimize-images` before large media commits when adding assets

## AI-assisted development

This repo uses **NEXUS APEX v4.0** under `NEXUS_v4_APEX/`. If you use Cursor or other AI agents:

1. Read [`AGENTS.md`](AGENTS.md) for the engine loop and Jade-specific routing.
2. Load the relevant `NEXUS_v4_APEX/<ENGINE>/SKILL.md` before UI, API, or SEO changes.
3. Run `npm run gate` from `NEXUS_v4_APEX/` when changing framework contracts (if configured).

Human backlog and API inventory notes live in `audit-report.md` and `WEBDEV-Audit.md`.

## License

Private — Jade Hospitainment. All rights reserved.

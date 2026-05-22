# Jade_ReVamp — End-to-End Project Audit

**Generated / revised:** 2026-05-20  
**Workspace:** `Jade_ReVamp`  
**Stack:** Next.js **14.2.4** (App Router) · TypeScript · Tailwind · GSAP / Framer Motion / Lenis · PostgreSQL (`pg`) · Razorpay · Resend (optional)

### Report packs (which file to open)

| Pack | File | Audience |
|------|------|----------|
| **Client / stakeholder confirmation** | [`audit-report.md`](./audit-report.md) (this document) | Directional status, SEO story, UX wins, prioritized backlog. |
| **Engineering / WEBDEV** | [`WEBDEV-Audit.md`](./WEBDEV-Audit.md) | Full API inventory, rate limits, scroll architecture, evidence paths. |
| **Developer onboarding** | [`README.md`](./README.md) | Install, env, scripts, route map. |

> HTML audit exports were removed from the repo (2026-05-20); **Markdown is canonical.**

---

## Executive summary

Jade_ReVamp is a **production-shaped luxury hospitality marketing site** with a real booking backend, lead capture, optional payments, and an unusually strong **SEO + GEO** layer for a brochure-class product. The application code for core funnels is **largely complete**; remaining work is mostly **operations** (database migrations, Razorpay live config, notification inboxes) and **scale/polish** (CDN, CSP, broader automated QA, accessibility pass).

### At a glance

| Dimension | Status |
|-----------|--------|
| Marketing routes & brand UX | **Strong** — full page set, motion, overlays, villa depth |
| Booking persistence | **Strong** — Postgres, conflict checks, admin UI |
| Lead & careers capture | **Strong** — APIs wired from UI |
| Payments | **Code-complete** — needs live keys + webhook + policy on status fields |
| SEO / LLM discovery | **Strong** — sitemap, robots, JSON-LD, `llms.txt`, per-villa metadata |
| Automated tests | **Baseline** — Vitest on critical libs; light Playwright smoke |
| Code hygiene | **Improved (2026-05-20)** — large unused overlay and orphan components removed |

---

## What’s already done (high confidence)

### Application foundation

- **Next.js 14 App Router** under `src/app/*` with TypeScript, Tailwind, and shared design tokens in `globals.css`.
- **~88 React components** focused on marketing sections, villa detail, venue overlays, and booking — after removal of legacy/unused modules (see [Code hygiene](#code-hygiene-2026-05-20)).
- **Typed content** in `src/data/retreats/` (16+ villa records + categories) and `src/data/blogs.ts` for editorial.

### Core pages (live routes)

- **Home** — Splash, landing scroll sections, featured villas, experiences.
- **Villa Retreats** — Directory, detail (`/villa-retreats/[id]`), spaces gallery (`/villa-retreats/[id]/spaces`).
- **Experiences** — Weddings, corporate retreats, weekend getaways, party villas, caravans, experiences hub, demo scroll page (`/experiences/another-experience-1`).
- **Utility** — Menu directory, wishlist, about, contact, careers.
- **Booking** — `/book`, `/book/success` (Razorpay hand-off when configured).
- **Legal** — Privacy, terms, refund.
- **Admin** — `/admin` (password-gated; `noindex`).

### UX and navigation (2026-05 uplift)

- **Lenis smooth scroll** globally via `SmoothScroll` in `providers.tsx`, with **`prefers-reduced-motion`** respect.
- **Scroll-to-top on every navigation** — `ScrollToTopOnNavigate` + `template.tsx` manual `scrollRestoration` so route changes always open at the hero/first section (fixes back/forward and deep-link residue).
- **Venue “know more” overlays** (wedding/party/corporate) — sticky section tabs, scroll spy, and programmatic section jumps (`MeanderStrip` dividers using `Sep_bar_design.svg`).
- **Villa detail** — sticky in-page tabs aligned to amenities, pricing, location, walkthrough, FAQ-style blocks.
- **Menu page** — dedicated villa/experience directory with category chips (`MenuPanelTabs`).

### SEO and GEO (elite tier for this category)

- **Metadata** — Root `layout.tsx` title template, `metadataBase`, OG/Twitter with **`/og-default.jpg`** (1200×630).
- **Robots + sitemap** — `src/app/robots.ts`, `src/app/sitemap.ts` (static routes, all villas, `/spaces`, blogs, legal).
- **JSON-LD** — Global `WebSite` / `Organization` / `LodgingBusiness`; per-villa `VacationRental`; breadcrumbs on spaces layouts.
- **`public/llms.txt`** — Machine-facing site map and citation rules for AI assistants.
- **AI crawler rules** — Dedicated `robots` entries for GPTBot, Claude, Perplexity, Google-Extended, etc., aligned with marketing allow/disallow policy.
- **IndexNow** — API route + key file; production Bearer auth.
- **Crawler policy** — `noindex` on `/wishlist`, `/admin`; disallow on `/api/`, `/book`, `/menu`, etc., as intentional.

### Backend and integrations

- **Bookings** — `POST /api/bookings` with overlap detection; availability by month; admin list/get/patch/delete with timing-safe password check.
- **Leads** — General, Rathaa, wedding enquiry types; partner multipart with photo storage.
- **Careers** — Multipart résumé upload from `/careers`.
- **Payments** — Razorpay order creation with `booking_uuid` notes; webhook signature verification updating gateway fields.
- **Email** — Optional Resend notifications for leads, careers, bookings when env is set.
- **Analytics** — GA4 component when `NEXT_PUBLIC_GA_ID` is set.
- **Errors** — `error.tsx` / `global-error.tsx`; optional Sentry when DSN is set.

### Operational resilience

- **Security baseline** — Edge middleware on APIs, security headers in `next.config.mjs`, safe JSON parsing, villa allowlists, IndexNow URL allowlist.
- **CI** — GitHub Actions runs unit tests + production build on `main` / `master`.
- **Local DX** — Docker Postgres, `setup:check`, setup guide script, `.env.example`.

### Media and build pipeline

- Large curated **`public/`** library (villas, experiences, home sections) — **not pruned** in this pass (by design).
- **`prebuild`** generates blur manifest for faster image paint (`scripts/generate_media_manifest.mjs`).
- Optional **`npm run optimize-images`** for compression before heavy commits.

---

## Code hygiene (2026-05-20)

A dedicated cleanup removed **dead code and stale artefacts** without touching `public/` assets:

- Deleted **legacy `GlobalBookingOverlay`** (~52 KB) — booking now flows through `/book` and carousel `ReservationOverlay`.
- Removed **orphan components** never imported (old menu overlay, unused carousels/sections, duplicate UI primitives).
- Removed **unused libs** (`overlayPricing`, `siteAssets`) and **Pages Router** `_document.tsx`.
- Removed **one-off Python/shell migration scripts** and **generated HTML audit files** from the repo root.
- **Retained** engineering Markdown audits and NEXUS agent docs.

**Result:** Smaller `src/components` surface, clearer ownership of booking UX, successful `npm run build` after cleanup.

---

## What’s missing, risky, or ops-dependent

### Requires environment / dashboard (not “more app code”)

| Item | Owner | Notes |
|------|-------|-------|
| **Production Postgres** | DevOps | Run `schema.sql` or `schema_migration_leads_rathaa_partner_payments.sql` |
| **Razorpay live** | Finance/DevOps | Keys, webhook URL, `RAZORPAY_WEBHOOK_SECRET` |
| **Resend / notify emails** | Ops | `RESEND_*`, `LEADS_NOTIFY_EMAIL`, `BOOKING_NOTIFY_EMAIL`, etc. |
| **IndexNow secret** | Ops | `INDEXNOW_API_SECRET` for production POST |
| **Sentry DSN** | Ops | Optional `NEXT_PUBLIC_SENTRY_DSN` |
| **Booking status policy** | Business | When `bookings.status` vs `payment_gateway_state` means “confirmed” |

### Technical risks (prioritized)

| Risk | Severity | Mitigation |
|------|----------|------------|
| **In-memory rate limits** | Medium at scale | Redis/Upstash when running multiple instances |
| **Large `public/` tree** | Medium for deploy/LCP | CDN or object storage; keep `optimize-images` discipline |
| **`next/image` unoptimized flags** | Low–medium | Audit intentional bypass vs transfer size |
| **Limited E2E coverage** | Medium | Expand Playwright beyond smoke/lead surfaces |
| **Accessibility on overlays** | Medium | Planned WCAG 2.2 pass (focus, labels, motion) |
| **No strict CSP yet** | Low–medium | Add nonce CSP when threat model requires |

### Policy / legal (human decisions)

- Partner photo retention, marketing consent, refund semantics, and lead SLAs remain **business/legal** — not enforced by code alone.

---

## Holistic backlog

### Already differentiated (keep investing)

| Area | Why it matters |
|------|----------------|
| **Booking → PostgreSQL** | Real availability and conflict logic — rare for marketing rebuilds. |
| **Admin surface** | Functional `/admin` on password APIs. |
| **SEO / GEO** | `llms.txt`, villa graphs, AI robots mirrors — ahead of typical competitors. |
| **Section-aware overlays** | Wedding/party/corporate know-more UX with tab sync — supports long-form conversion. |

### P0 — resolved in code (historical → current)

| Gap (historical) | Current status |
|------------------|----------------|
| Enquiry forms “UI only” | **Resolved** — `EnquireOverlay`, wedding form → `/api/leads` |
| Careers fake upload | **Resolved** — `POST /api/careers/apply` |
| No booking email | **Resolved when Resend set** — `notifyBookingCreated` |
| Monolithic booking overlay | **Resolved** — removed; `/book` is canonical |
| Scroll position on navigation | **Resolved (2026-05)** — `ScrollToTopOnNavigate` + template |

### P1 — Revenue, measurement, observability

| Item | Status | Notes |
|------|--------|-------|
| Paid checkout UX | **Done (code)** | Success screen → Razorpay Checkout |
| Payment ↔ booking link | **Done (code)** | `booking_uuid` on order + webhook notes |
| GA4 | **Ready** | Set `NEXT_PUBLIC_GA_ID`; add conversions/consent when campaigns scale |
| Sentry | **Optional** | DSN-driven |
| Status vs payment fields | **Ops** | Define with finance |

### P2 — Engineering durability

| Item | Status | Notes |
|------|--------|-------|
| Unit tests | **Baseline** | Validation + payment service |
| E2E | **Light** | Home, book shell, careers, contact |
| CI build gate | **Done** | GitHub Actions |
| CI Playwright | **Stretch** | Not in workflow (weight) |
| Dead code | **Improved** | 2026-05-20 cleanup |

### P3 — UX, accessibility, compliance

| Item | Notes |
|------|-------|
| **WCAG 2.2** | Overlays, carousels, custom inputs, motion |
| **Cookie consent** | If additional marketing pixels ship |
| **i18n** | Single locale (`en-IN`) today |

---

## Route inventory

Detected App Router pages (`src/app/**/page.tsx`):

| Route | Purpose |
|-------|---------|
| `/` | Landing |
| `/villa-retreats`, `/villa-retreats/[id]`, `/villa-retreats/[id]/spaces` | Portfolio |
| `/blogs`, `/blogs/[slug]` | Editorial |
| `/weddings`, `/corporate-retreats`, `/weekend-getaways`, `/party-villa-retreats` | Experience marketing |
| `/experiences`, `/experiences/another-experience-1` | Experiences + scroll demo |
| `/caravans` | Caravan + Rathaa |
| `/about`, `/contact`, `/careers` | Brand & conversion |
| `/book`, `/book/success` | Booking & payment |
| `/menu` | Directory overlay page |
| `/wishlist` | Saved villas (`noindex`) |
| `/admin` | Operations (`noindex`) |
| `/privacy-policy`, `/terms-conditions`, `/refund-policy` | Legal |

---

## Broken links and assets

**Current status:** Internal marketing links and policy routes point at canonical paths (`/privacy-policy`, etc.). Redirects for legacy `/privacy`, `/terms`, `/refund` and `/blog/*` → `/blogs/*` live in `next.config.mjs`.

**Ongoing:** Villa media naming consistency is tracked in `public/Villa_Retreats_Tree.html` (artefact in `public/` — not removed in hygiene pass).

**Global social preview:** `public/og-default.jpg` + root Open Graph metadata.

---

## SEO + indexing (detail)

### Implemented

- Dynamic **sitemap** with villas, spaces, blogs, legal URLs.
- **Robots** disallow for transactional/sensitive paths; AI bot mirrors.
- **Canonical** discipline on villas, spaces, legal layouts.
- **Structured data** at site and property level.
- **`llms.txt`** for assistant routing and anti-hallucination guidance.
- **Villa layouts** use `dynamic = "force-dynamic"` where client hooks require it — metadata and JSON-LD still emit server-side per request.

### Next polish (optional)

- More **`FAQPage`** JSON-LD on blogs/guides where FAQ copy exists.
- Additional **301 redirects** as legacy URLs are confirmed.
- Explicit **`hreflang`** only if multi-locale launch.
- **VideoObject** schema if hero video becomes a primary citation target.

---

## GEO / LLM citation optimization

| Signal | Implementation |
|--------|----------------|
| **`llms.txt`** | Canonical URLs, “do not hallucinate pricing” guidance, sitemap pointers |
| **AI robots** | Parallel rules for major crawlers |
| **Entity graph** | Linked Organization ↔ LodgingBusiness ↔ WebSite |
| **Quotable pages** | Each villa = unique URL + title + description + hero OG |
| **Gallery depth** | `/spaces` breadcrumbs + metadata |
| **Hygiene** | `noindex` + robots block on wishlist/admin |

**Off-site GEO:** YouTube, Reddit, Wikipedia-class mentions still dominate third-party citation studies — this codebase makes **on-site facts unambiguous**; brand mentions elsewhere remain a separate marketing workstream.

---

## Performance and UX

### Strengths

- Image formats (AVIF/WebP) configured in Next.
- Prebuild blur manifest for galleries.
- Dynamic imports on heavy home sections where applied.
- Lenis + batched scroll listeners to avoid jank on chrome hide/show.

### Watch items

- Very large **`public/`** footprint — monitor deploy time and LCP on hero assets.
- Some **`unoptimized`** `next/image` usages — validate against already-compressed WebP sources.
- Motion-heavy pages — ensure reduced-motion path is tested on key flows.

---

## Data and backend (bookings)

### Implemented

- PostgreSQL pool, overlap prevention, admin CRUD with timing-safe auth.
- Server validation aligned with booking UI (`bookingDetailsValidation`).
- Edge + per-route rate limits (see WEBDEV audit table).
- Razorpay order + webhook updating gateway columns when notes include `booking_uuid`.

### Optional next steps

- JWT/session admin or IP allowlist + audit log.
- Max stay length / guest caps tied to villa rules in data model.
- Horizontal rate-limit store (Redis).

---

## Content and media

- **Blogs** support rich sections, CTAs, FAQ blocks in `src/data/blogs.ts`.
- **Villa Retreats** use structured retreat modules with spaces, experiences, perfect-for tags.
- **Brochure PDF** referenced inline on villa CTAs: `/All Properties - Jade Hospitainment.pdf` (in `public/`).

---

## Action plan (phased)

### Done (foundation)

- Core routes, booking API, leads, careers, partner flow.
- SEO/GEO layer, IndexNow hook, security header baseline.
- Post-book Razorpay Checkout path.
- Scroll/navigation consistency (2026-05).
- Dead-code cleanup (2026-05-20).
- CI: test + build.

### This sprint (ops)

1. Apply DB schema/migration on production.  
2. Configure Razorpay live + webhook secret.  
3. Set Resend + notify inboxes.  
4. Confirm `INDEXNOW_API_SECRET` and GA/Sentry DSNs per environment.  
5. Document booking **status** semantics with operations team.

### Next quarter (stretch)

1. CDN for `public/` heavy media.  
2. Expand Playwright + optional CI job.  
3. WCAG audit on overlays and booking.  
4. CSP with nonces; Redis rate limits if multi-region.  
5. FAQ/HowTo schema on top blog URLs.

---

## Evidence (key files reviewed)

- **Config:** `package.json`, `next.config.mjs`, `tsconfig.json`, `.env.example`, `.github/workflows/ci.yml`
- **App shell:** `src/app/layout.tsx`, `providers.tsx`, `template.tsx`, `middleware.ts`
- **Booking / pay:** `src/app/book/**`, `src/lib/paymentService.ts`, `src/lib/payments/razorpayCheckout.ts`
- **Funnel:** `EnquireOverlay`, `RathaaOverlay`, `PartnerOverlay`, `WeddingVenueEnquiryForm`, `careers/page.tsx`
- **Scroll:** `ScrollToTopOnNavigate`, `scrollToPageTop.ts`, `useVenueOverlaySectionNav.ts`, `MeanderStrip.tsx`
- **SEO / GEO:** `public/llms.txt`, `robots.ts`, `sitemap.ts`, villa/spaces layouts, `src/lib/seo/meta.ts`
- **DB:** `schema.sql`, `schema_migration_leads_rathaa_partner_payments.sql`, `src/lib/db.ts`
- **Tests:** `*.test.ts`, `e2e/*.spec.ts`, `playwright.config.ts`

---

*For rate limits, API parameters, and module-level evidence, use [`WEBDEV-Audit.md`](./WEBDEV-Audit.md). For install and env setup, use [`README.md`](./README.md).*

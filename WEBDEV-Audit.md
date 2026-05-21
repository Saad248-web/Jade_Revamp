# WEBDEV Audit — Jade_ReVamp

**Audience:** Engineering, DevOps, security review, and delivery leads  
**Companion (stakeholder):** [`audit-report.md`](./audit-report.md)  
**Revision:** **2026-05-20** (full resync to repo)  
**Stack:** Next.js **14.2.4** App Router · TypeScript · Tailwind · PostgreSQL (`pg`) · Razorpay · Resend (optional) · Sentry (optional)

> **Note:** HTML audit exports (`audit-report.html`, `WEBDEV-Audit.html`) were removed from the repo; **this Markdown file is the canonical engineering audit.**

---

## 1. How to use this document

| Document | Purpose |
|----------|---------|
| **`audit-report.md`** | Executive / stakeholder view — what shipped, polish backlog, SEO narrative, risks in plain language. |
| **`WEBDEV-Audit.md` (this file)** | Technical inventory — APIs, middleware, scroll architecture, DB, tests, env, precise done vs ops vs stretch. |
| **`README.md`** | Onboarding — install, scripts, routes, env groups. |

---

## 2. Re-audit snapshot (2026-05-20)

**Method:** Pass over `src/app/api/**`, `src/middleware.ts`, `next.config.mjs`, `src/app/providers.tsx`, scroll/overlay libs, overlays/forms, `.env.example`, `schema.sql`, `package.json`, CI workflow; production `npm run build` verified after dead-code cleanup.

### 2.1 Maturity strip (from code — not penetration-tested)

```
[████████████████████░░░░]  Core marketing + villa UX        ~ strong
[████████████████░░░░░░░░]  Booking + Postgres               ~ production-shaped
[████████████████░░░░░░░░]  Leads / careers / partner APIs   ~ implemented
[████████████████░░░░░░░░]  Payments (order + webhook + UI)  ~ code-complete; ops keys
[████████████░░░░░░░░░░░░]  Automated QA                     ~ Vitest + light Playwright
[██████████░░░░░░░░░░░░░░]  Horizontal scale hardening       ~ in-memory rate limits
```

### 2.2 Status legend

| Badge | Meaning |
|-------|---------|
| **Done (code)** | Implemented in repo; may still need env/DB on the host. |
| **Ops** | Keys, migrations, Razorpay dashboard, or runtime policy. |
| **Stretch** | Recommended hardening/polish; not blocking launch. |

### 2.3 Codebase hygiene (2026-05-20)

Removed unused artefacts ( **`public/` untouched** ):

| Removed | Reason |
|---------|--------|
| `GlobalBookingOverlay.tsx` (~52 KB) | Superseded by `/book` + `ReservationOverlay` |
| Orphan components | `MenuOverlay`, `StickyScrollWrapper`, `FloatingBottomAction`, `ExperiencesSection`, `HospitainmentDefinition`, `VillaRetreats`, `VillasCarouselSection`, `WeddingVenuesCarousel`, `SharedHeroSplitSection`, unused `ui/*` primitives |
| `overlayPricing.ts`, `siteAssets.ts` | Zero imports |
| `src/pages/_document.tsx` | Pages Router leftover |
| Root/scripts one-offs | `check_overlays.py`, `rename_hero.py`, `add_categorized_spaces.mjs`, dev-only patch/migrate scripts |
| HTML audit exports | Stale generated HTML; Markdown audits retained |

**Active scripts** (`scripts/`): `generate_media_manifest.mjs`, `generate_favicons.mjs`, `generate_og_default.mjs`, `optimize_public_images.mjs`, `reset-local-db.mjs`, `verify-local-setup.mjs`, `open-setup-guide.mjs`.

---

## 3. Edge middleware (`src/middleware.ts`)

**Matcher:** `/api/:path*`

| Control | Value |
|---------|--------|
| Allowed methods | `GET`, `POST`, `HEAD`, `OPTIONS`, `PATCH`, `DELETE` |
| Coarse rate limit | **600** requests / IP / **60 s** (`key: edge:api:<ip>`) |
| Response headers | `Cross-Origin-Resource-Policy: same-site`, `X-DNS-Prefetch-Control: off`, `Cache-Control: no-store` on JSON errors |

Per-route limits below **stack** with this edge bucket.

---

## 4. API route inventory (`src/app/api`)

| Route | Role | Handler limit (IP · window) | Auth / extras | Notes |
|-------|------|-----------------------------|---------------|-------|
| `POST /api/bookings` | Create + overlap check | **20** · 10 min | — | `notifyBookingCreated` when Resend set. |
| `GET /api/bookings` | Admin list | **60** · 10 min | `x-admin-password` · **`ADMIN_PASSWORD`** | 503 if admin secret unset. |
| `GET /api/bookings/[id]` | Admin fetch one | **120** · 10 min | `x-admin-password` | Timing-safe compare. |
| `PATCH /api/bookings/[id]` | Admin update | **60** · 10 min | `x-admin-password` | — |
| `DELETE /api/bookings/[id]` | Admin delete | **30** · 10 min | `x-admin-password` | — |
| `GET /api/bookings/availability` | Monthly occupancy | **120** · 5 min | — | Villa allowlisted. |
| `POST /api/leads` | JSON leads | **20** · 60 min | — | `general_enquiry`, `rathaa_enquiry`, `wedding_enquiry`. |
| `POST /api/leads/partner` | Partner + photos | **10** · 60 min | multipart | `partner_leads` + `partner_lead_photos`. |
| `POST /api/careers/apply` | Résumé upload | **8** · 60 min | multipart | Persist + notify. |
| `POST /api/payments/razorpay-order` | Razorpay order | **30** · 10 min | — | `booking_uuid` / `bookingId` in body. |
| `POST /api/webhooks/razorpay` | Payment events | *Edge only* | HMAC **`X-Razorpay-Signature`** · raw body | No handler `rateLimit`; **`RAZORPAY_WEBHOOK_SECRET`**. |
| `POST /api/indexnow` | Index ping | **20** · 10 min | Bearer + host allowlist | **`INDEXNOW_API_SECRET`** in prod. |
| `GET /api/instagram/oembed` | oEmbed proxy | **60** · 10 min | — | Bounded params. |
| `GET /api/experiences/[slug]/media` | Media JSON | *Edge only* | — | No handler limiter. |
| `GET /api/villas/[id]/media` | Media JSON | *Edge only* | — | No handler limiter. |

---

## 5. Frontend → backend funnel (verified)

| Surface | Wired? | Destination |
|---------|--------|-------------|
| `EnquireOverlay` | Yes | `POST /api/leads` (`general_enquiry`) |
| `WeddingVenueEnquiryForm` | Yes | `POST /api/leads` (`wedding_enquiry`) |
| `RathaaOverlay` | Yes | `POST /api/leads` (`rathaa_enquiry`) |
| `PartnerOverlay` | Yes | `POST /api/leads/partner` (multipart) |
| Careers `/careers` | Yes | `POST /api/careers/apply` |
| Booking `/book` | Yes | `POST /api/bookings` |
| `/book/success` | Yes | `initiatePayment(..., { bookingUuid })` → `POST /api/payments/razorpay-order` → Razorpay Checkout (`razorpayCheckout.ts`) |
| `/admin` | Yes | Admin APIs via `x-admin-password` |
| `ReservationOverlay` (villas carousel) | Yes | Booking search hand-off (not legacy global overlay) |

---

## 6. Scroll, Lenis, and section navigation (2026-05)

| Module | Role |
|--------|------|
| `src/components/SmoothScroll.tsx` | Global Lenis; GSAP sync; `prefers-reduced-motion` bypass |
| `src/lib/lenis.ts` / `useLenis.ts` | Instance typing + `emitLenisScroll` bridge |
| `src/lib/scrollToPageTop.ts` | Imperative scroll reset (window + Lenis) |
| `src/components/ScrollToTopOnNavigate.tsx` | Route-keyed reset; `popstate` / `pageshow` |
| `src/app/template.tsx` | `scrollRestoration = manual` on template remount |
| `src/lib/batchScrollUpdate.ts` | rAF-batched scroll listeners |
| `src/lib/useScrollHide.ts` | Navbar hide past threshold |
| `src/lib/useOverlayScrollChromeHide.ts` | Overlay chrome hide |
| `src/lib/useSectionScrollSpy.ts` | Active section from scroll position |
| `src/lib/useScrollTabIntoView.ts` | Horizontal tab strip scroll-into-view |
| `src/lib/venueOverlaySectionNav.ts` | Tab ↔ section id map for venue overlays |
| `src/lib/useVenueOverlaySectionNav.ts` | Combines spy + `scrollToOverlaySection` |
| `src/lib/villaDetailSectionNav.ts` | Villa detail section ids |
| `src/components/ui/MeanderStrip.tsx` | Section divider (`Sep_bar_design.svg`) |
| `src/components/menu/MenuPanelTabs.tsx` | Menu page chip tabs + villa/experience switcher |

**Consumers:** `VenueOverlay`, `PartyVenueOverlay`, `CorporateVenueOverlay`, `VillaExperienceOverlayLayout`, `VillaDetailStickyTabs`, `src/app/villas/[id]/page.tsx`, `Navbar` / `VillasCarousel` (`useScrollHide`).

---

## 7. Payments — technical truth

| Layer | Status |
|-------|--------|
| Razorpay order (server) | **Done** — `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` required. |
| Order ↔ booking linkage | **Done** when body includes UUID and DB columns exist. |
| Webhook verification | **Done** — configure URL + `RAZORPAY_WEBHOOK_SECRET`. |
| `paymentService.ts` | **Done** — sends `booking_uuid` when `opts.bookingUuid` set. |
| Post-booking Checkout UX | **Done** on `/book/success`; **501** path explains offline follow-up when unset. |
| `bookings.status` vs `payment_gateway_state` | **Ops/policy** — not auto-reconciled beyond gateway fields on webhook. |

---

## 8. SEO / technical checklist

| Category | Observation |
|----------|-------------|
| **Crawlability** | `src/app/robots.ts` + `src/app/sitemap.ts`; transactional paths disallowed by design. |
| **Indexability** | Canonical/metadata on villas, spaces, legal; `noindex` on wishlist/admin. |
| **Structured data** | `WebSite` + `Organization` + `LodgingBusiness` in `layout.tsx`; `VacationRental` per villa; breadcrumbs on `/spaces`. |
| **GEO / AI** | `public/llms.txt` + mirrored AI user-agents in robots. |
| **IndexNow** | `POST /api/indexnow` + key file in `public/`; Bearer in production. |
| **OG** | `public/og-default.jpg` (1200×630) + per-villa hero previews. |
| **Security headers** | `next.config.mjs`: nosniff, frame options, COOP, Permissions-Policy, prod HSTS. |
| **Stretch** | Nonce CSP, Redis rate limits, JWT admin session. |

---

## 9. Database

| Artifact | Use |
|----------|-----|
| `schema.sql` | Base `bookings`, partner tables, leads, careers, payment columns |
| `schema_migration_leads_rathaa_partner_payments.sql` | Incremental migration for existing DBs |
| `src/lib/db.ts` | Pool + query helper |
| `docker-compose.db.yml` | Local Postgres; schema on first init |

**Ops:** Run appropriate schema on production before enabling payments/leads.

---

## 10. Security helpers (reference)

| Layer | Path |
|-------|------|
| Config headers | `next.config.mjs` |
| Edge API guard | `src/middleware.ts` |
| JSON body limits | `src/lib/security/safeJson.ts` |
| Admin auth | `src/lib/security/adminAuth.ts`, `timingSafe.ts` |
| Villa allowlist | `src/lib/security/villaId.ts`, `ids.ts` |
| Booking validation | `src/lib/bookingDetailsValidation.ts` |
| Rate limiting | `src/lib/rateLimit.ts` (in-memory) |
| Razorpay webhook | `src/lib/payments/razorpayWebhookVerify.ts` |

---

## 11. Tests and CI

| Asset | Coverage |
|-------|----------|
| `src/lib/bookingDetailsValidation.test.ts` | Form/API validation rules |
| `src/lib/paymentService.test.ts` | Payment client behaviour |
| `e2e/smoke.spec.ts` | `/`, `/book` shell |
| `e2e/lead-surfaces.spec.ts` | `/careers`, `/contact` |
| `.github/workflows/ci.yml` | `npm ci` → `npm test` → `npm run build` |

**Stretch:** Playwright in CI; DB-backed booking e2e; broader route smoke matrix.

---

## 12. Still open (ops / stretch)

1. **Ops:** Apply `schema.sql` or migration SQL on production Postgres.  
2. **Ops:** Razorpay Dashboard — webhook URL + live keys + `RAZORPAY_WEBHOOK_SECRET`.  
3. **Policy:** Define `bookings.status` transitions vs `payment_gateway_state` / paid semantics.  
4. **Stretch — QA:** Expand Vitest/Playwright; optional form POST e2e with test DB.  
5. **Stretch — Performance:** CDN/object storage if `public/` deploy weight or TTFB hurts.  
6. **Stretch — Security:** CSP nonces, Redis-backed rate limits, JWT admin.  
7. **Stretch — A11y:** WCAG pass on overlays, focus traps, reduced-motion audit beyond Lenis bypass.

---

## 13. Evidence index

| Topic | Paths |
|-------|-------|
| APIs | `src/app/api/**` |
| Middleware | `src/middleware.ts` |
| Book + pay | `src/app/book/**`, `src/lib/paymentService.ts`, `src/lib/payments/razorpayCheckout.ts` |
| Funnel UI | `src/components/EnquireOverlay.tsx`, `RathaaOverlay.tsx`, `PartnerOverlay.tsx`, `experience/WeddingVenueEnquiryForm.tsx`, `src/app/careers/page.tsx` |
| Scroll | `src/app/providers.tsx`, `template.tsx`, `ScrollToTopOnNavigate.tsx`, `src/lib/scrollToPageTop.ts`, `useVenueOverlaySectionNav.ts`, `useSectionScrollSpy.ts` |
| Email | `src/lib/email/*` |
| SEO / GEO | `public/llms.txt`, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx`, `src/app/villas/[id]/layout.tsx` |
| Observability | `src/instrumentation.ts`, `src/instrumentation-client.ts`, `sentry.*.config.ts`, `withSentryConfig` in `next.config.mjs` |
| Types | `src/lib/types.ts` (shared booking/enquiry contracts) |
| CI | `.github/workflows/ci.yml`, `vitest.config.ts`, `playwright.config.ts` |

---

*Developer companion to [`audit-report.md`](./audit-report.md). For onboarding commands and env tables, see [`README.md`](./README.md).*

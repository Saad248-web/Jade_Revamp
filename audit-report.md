# Jade_ReVamp — End-to-End Project Audit (Concise + Detailed)

Generated / revised: **2026-05-04** · **SEO + GEO uplift (2026-05-01)** · **Checkout + QA + CI pass (2026-05-04)**  
Workspace: `c:\Users\Admin\Desktop\Jade_ReVamp`  
Stack: **Next.js 14 (App Router) + TypeScript + Tailwind + GSAP/Framer/Rive + PostgreSQL (`pg`)**

### Report packs (which file to open)

| Pack | Files | Audience |
|------|-------|----------|
| **Client / stakeholder confirmation** | [`audit-report.md`](./audit-report.md), [`audit-report.html`](./audit-report.html) | Directional status, SEO story, backlog in plain language. |
| **Engineering / WEBDEV audit** | [`WEBDEV-Audit.md`](./WEBDEV-Audit.md), [`WEBDEV-Audit.html`](./WEBDEV-Audit.html) | Full API inventory, funnel verification, diagrams, mobile-first HTML. Alias stem: **`WEBDEVAudit`** → canonical hyphenated filenames (Windows-safe). |

---

## Executive summary (what’s done vs what’s missing)

### What’s already done (high confidence)
- **Modern app foundation**: Next.js 14 App Router structure (`src/app/*`) with typed TS config.
- **Core pages implemented**: Home, Villas, Villa Details, Blogs, Weddings, Experiences, Corporate Retreats, Weekend Getaways, Party Villas, Caravans, About, Contact, Careers, Wishlist, Menu, Booking flow (`/book`, `/book/success`), plus legal pages (`/privacy-policy`, `/terms-conditions`, `/refund-policy`).
- **SEO basics implemented**:
  - **Metadata base + OG/Twitter config** in `src/app/layout.tsx`.
  - **robots** + **sitemap** via metadata routes (`src/app/robots.ts`, `src/app/sitemap.ts`).
  - **Blog sitemap integration** using `getPublishedPosts()` from `src/data/blogs.ts`.
  - JSON-LD helper components (`src/components/SchemaMarkup.tsx`, `src/components/seo/JsonLd.tsx`).
- **Elite SEO + LLM / GEO layer (2026-05-01)**:
  - **`public/llms.txt`**: machine-facing site map, brand facts, assistant routing rules (`/`, `/villas`, category pages, blogs), and citation guidance (prefer villa canonical URLs for capacity/amenities).
  - **`robots.txt`**: explicit **AI assistant user-agents** (GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-Web, PerplexityBot, Google-Extended) mirrored to the global policy — **disallow** transactional/sensitive zones: **`/api/`**, **`/book`**, **`/menu`**, **`/admin`**, **`/wishlist`** (plus existing patterns).
  - **Sitemap** now lists **every villa** (`/villas/{id}`) and **`/spaces` gallery** sibling URLs plus **privacy / terms / refund**.
  - **Global JSON-LD graph**: **`WebSite`** with `@id` + `inLanguage: en-IN` + **`publisher`** link; **`Organization`** + **`LodgingBusiness`** with **`@id`**, **`sameAs`**, **`knowsAbout`**, **`parentOrganization`** wiring for entity clarity.
  - **Per-villa server layouts** (`src/app/villas/[id]/layout.tsx`): unique **title/description/keywords**, **canonical**, **OG/Twitter** previews from hero imagery; **`VacationRental`** JSON-LD (address/coords when known, brand linkage); segment uses **`dynamic = "force-dynamic"`** so the client villa page’s **`useSearchParams()`** hook does not break the production build—**metadata + JSON-LD are still emitted server-side on every request** (healthy for crawlers).
  - **Spaces galleries** (`src/app/villas/[id]/spaces/layout.tsx`): canonical + **`BreadcrumbList`** JSON-LD (same **force-dynamic** rationale).
  - **Legal + utility**: **`terms`** / **`refund`** layout metadata; **`privacy-policy`** richer meta; **`wishlist`** + **`admin`** **`noindex`** (aligned with crawler policy).
- **Bookings backend**:
  - `POST /api/bookings` creates bookings with conflict checking.
  - `GET /api/bookings/availability` returns booked dates by month.
  - `GET /api/bookings` admin listing (protected via `x-admin-password` header).
  - PostgreSQL pool + query wrapper in `src/lib/db.ts`.
- **Indexing support**: `POST /api/indexnow` pings IndexNow endpoints; key file exists in `public/` (`a8f9c1b2d4e64f789012345678abcdef.txt`). Production requires **`INDEXNOW_API_SECRET`** + Bearer auth; URLs restricted to configured host (**https** only).
- **Lead capture + hiring (API-backed)**:
  - `POST /api/leads` (**`general_enquiry`**, **`rathaa_enquiry`**, **`wedding_enquiry`**) + `POST /api/leads/partner` (multipart) + **`LEADS_NOTIFY_EMAIL`** / Resend when configured.
  - `POST /api/careers/apply` (multipart résumé) wired from **`/careers`**.
- **GA4 readiness**: **`src/components/analytics/GoogleAnalytics.tsx`** mounted from **`providers.tsx`** when **`NEXT_PUBLIC_GA_ID`** is set.
- **Payments (server rails)**: `POST /api/payments/razorpay-order` with optional **`booking_uuid`** / **`bookingId`** metadata on Razorpay orders; **`POST /api/webhooks/razorpay`** verifies signatures and updates **`payment_gateway_state`** when `notes.booking_uuid` is present.
- **Operational resilience UX**: **`src/app/error.tsx`**, **`src/app/global-error.tsx`** (Sentry capture when DSN set); **`npm run test`** → Vitest (`bookingDetailsValidation`, `paymentService`); Playwright smoke (`e2e/smoke.spec.ts`, `e2e/lead-surfaces.spec.ts`); **`npm run test:e2e:ci`** for production-server e2e; **GitHub Actions** **`.github/workflows/ci.yml`** runs test + build on push/PR.
- **Media/asset organization work started**:
  - Large curated `public/` media library (villas, experiences, home page sections).
  - A dedicated **Villa Retreats folder tree audit** already present: `public/Villa_Retreats_Tree.html`.
  - Build step generates `MEDIA_MANIFEST` (`scripts/generate_media_manifest.mjs` referenced in `package.json`).

### What’s missing / risky (prioritized) — **updated 2026-05-04**

- **Checkout hand-off**: **Shipped in repo** — booking success screen calls **`initiatePayment(..., { bookingUuid })`**, opens Razorpay Checkout when keys exist; **Ops** still wires live Razorpay keys + webhook URL + **`RAZORPAY_WEBHOOK_SECRET`**, and applies **Postgres migrations** on production.  
- **Policy**: reconcile **`bookings.status`** vs **`payment_gateway_state`** with finance/ops (not enforced by code alone).  

### What remains risky or incomplete (infra + polish)
- **Redirect strategy**: policy + `/blog/:slug` → `/blogs/:slug` are mapped; extend `next.config.mjs` once more legacy URLs are confirmed.
- **Security — next tier** (baseline is strong): JWT/session admin or IP allowlist + audit logging; Redis/Upstash for rate limiting across instances; optional **strict CSP with nonces** (HSTS + COOP already in prod).
- **Performance at scale**: very large `public/` tree — optional CDN/object storage for heavy media.

---

## Holistic backlog (what needs doing)

Lead capture overlays, Rathaa/Partner endpoints, Careers apply multipart, Razorpay order + webhook scaffolding, **`GoogleAnalytics`** in `providers.tsx`, **`error.tsx`** / **`global-error.tsx`**, and **booking notifications** (`notifyBookingCreated`) are **implemented in code** subject to migrations and secrets (see subsection *Requires manual setup* below). The narrative below focuses on **what is still intentionally open**.

### Already differentiated (keep investing here)
| Area | Why it counts |
|------|----------------|
| **Booking → PostgreSQL** | Real **`POST /api/bookings`**, conflict checks, availability endpoint, hardened validation — this is production-shaped. |
| **Admin surface** | Password-gated **`/admin`** wired to **`x-admin-password`** APIs (UX is basic but functional). |
| **SEO / GEO** | **`llms.txt`**, crawler-specific **`robots`**, villa **`VacationRental`** + **`/spaces`** breadcrumbs, expansive **sitemap** — unusually strong vs typical brochure sites. |
| **Defense in depth** | Middleware on **`/api/*`**, safe JSON ingestion, timing-safe admin, IndexNow Bearer + URL allowlist. |

### Previously P0 funnel items — status (**2026-05-04**)
| Gap (historical) | Current status |
|------------------|----------------|
| General enquiry / wedding forms “UI-only” | **Resolved** — `fetch("/api/leads")` from `EnquireOverlay` / `WeddingVenueEnquiryForm`. |
| Careers apply fake upload | **Resolved** — `POST /api/careers/apply` + success path in `careers/page.tsx`. |
| No booking transactional email | **Implemented when Resend env set** — `notifyBookingCreated` from `POST /api/bookings`. |

### P1 — Revenue checkout + measurement + observability  
| Gap | Notes |
|-----|--------|
| **Paid checkout UX** | **Done (code)** — **`/book`** success screen → **`initiatePayment`** with **`bookingUuid`** → Razorpay Checkout; align **`status`** vs **`payment_gateway_state`** with ops. |
| **Payment helper** | **Done** — `paymentService.ts` sends **`booking_uuid`** when `opts.bookingUuid` is set. |
| **Analytics maturity** | GA4 via **`NEXT_PUBLIC_GA_ID`**; add conversions + consent mode when campaigns expand. |
| **APM / errors** | **Sentry optional** — **`@sentry/nextjs`** + **`NEXT_PUBLIC_SENTRY_DSN`**; errors captured in **`error.tsx`** / **`global-error.tsx`** when configured. |

### P2 — Engineering durability
| Gap | Notes |
|-----|--------|
| **Automated tests** | Vitest (`bookingDetailsValidation`, `paymentService`); Playwright **`smoke`** + **`lead-surfaces`**; **`test:e2e:ci`**; CI workflow runs test + build. |
| **Error boundaries** | Root **`error.tsx`** + **`global-error.tsx`** + optional Sentry. |
| **Legacy `src/pages/_document.tsx`** | Keep only if Pages Router artefacts required; clarify and delete if unused. |

### P3 — UX, accessibility, compliance
| Gap | Notes |
|-----|--------|
| **Accessibility** | Heavy motion, overlays, custom inputs — plan a **WCAG 2.2** pass (focus traps, labels, contrast, `prefers-reduced-motion`). |
| **Cookie / consent** | If analytics/marketing pixels ship later, add **consent banner** aligned with privacy policy regions you serve. |
| **i18n** | Single-locale today (`en` / `en-IN` implied) — fine until you expand markets. |

### Implemented automatically in-repo (holistic backlog — code)

Updates below were **implemented in application code**; they still rely on DB migrations and secrets (next subsection).

| Item | Behaviour |
|------|-----------|
| **Lead API** | `POST /api/leads` accepts `general_enquiry`, **`rathaa_enquiry`**, and `wedding_enquiry`; persists to `leads` and notifies **`LEADS_NOTIFY_EMAIL`** when Resend is configured. |
| **Partner uploads** | `POST /api/leads/partner` accepts multipart `meta` + `photos[]` → **`partner_leads`** + **`partner_lead_photos`**; **`PartnerOverlay`** submits end-to-end. |
| **Rathaa overlay** | **`RathaaOverlay`** posts **`rathaa_enquiry`** to `/api/leads`. |
| **Razorpay order link** | `POST /api/payments/razorpay-order` accepts **`booking_uuid`** / **`bookingId`**, attaches **`notes.booking_uuid`** on the Razorpay order, and updates the booking row with **`razorpay_order_id`** + **`payment_gateway_state`** when columns exist. |
| **Razorpay webhook** | `POST /api/webhooks/razorpay` verifies **`X-Razorpay-Signature`** with **`RAZORPAY_WEBHOOK_SECRET`**; handles **`payment.captured`** / **`payment.failed`** when payment **`notes`** include **`booking_uuid`**. |

### Requires manual setup, keys, or human judgment (cannot be “just code”)

| Item | Why a human / operator is required |
|------|-------------------------------------|
| **Database** | Apply **`schema.sql`** on a new database, or run **`schema_migration_leads_rathaa_partner_payments.sql`** (or equivalent) on **existing** Postgres so `leads.source`, partner tables, and booking payment columns match the app. |
| **Razorpay dashboard** | Create/configure the **webhook URL** (production host + `/api/webhooks/razorpay`), paste the **webhook signing secret** into **`RAZORPAY_WEBHOOK_SECRET`**, and align **test vs live** keys. |
| **Checkout / policy** | **UI path is implemented** (success screen pays with **`booking_uuid`**). **You** still define what **`bookings.status`** vs **`payment_gateway_state`** mean operationally (e.g. hold vs confirmed). |
| **Policy / compliance** | Partner photo **retention**, **GDPR** / marketing consent wording, refund rules, and lead SLAs remain **business and legal** decisions—not enforced by this repo alone. |

### Work that genuinely needs ongoing human input

- Operational follow-up tone and timing for partner and Rathaa leads, stakeholder sign-off on payment vs confirmation semantics, and periodic review of notify inboxes (`LEADS_NOTIFY_EMAIL`, etc.).

### What you are *not* fundamentally lacking
- **Route coverage** and **visual experience** for a luxury hospitality brand.
- **Core booking persistence** and **admin read/update** path.
- **Technical SEO + LLM discovery** depth most competitors skip.

---

## Route inventory (what the app claims to serve)

Detected App Router routes (from `src/app/**/page.tsx`):

- `/`, `/villas`, `/villas/[id]`, `/villas/[id]/spaces`
- `/blogs`, `/blogs/[slug]`
- `/weddings`, `/experiences`, `/corporate-retreats`, `/weekend-getaways`, `/party-villas`, `/caravans`
- `/about`, `/contact`, `/careers`
- `/book`, `/book/success`
- `/wishlist`, `/menu`, `/admin`
- `/privacy-policy`, `/terms-conditions`, `/refund-policy`

---

## Broken links, missing files, and redirect gaps

### Broken internal routes / missing assets
Status: **Fixed** (internal scan now reports `missingAssets=0` and `brokenRoutes=0`).

What was fixed:
- Menu links: `/privacy`, `/terms`, `/refund` now point to canonical routes.
- Added 301 redirects for `/privacy`, `/terms`, `/refund` in `next.config.mjs`.
- Removed all `/X/...` image references (since `public/X` doesn’t exist) and replaced with real images under `public/Villa_Retreats/...`.
- **Global social preview:** dedicated **`public/og-default.jpg`** (1200×630) is generated and referenced from **`src/app/layout.tsx`** Open Graph / Twitter (replaces prior placeholder-style references).

---

## SEO + Indexing audit

### Implemented
- **Sitemap**: `src/app/sitemap.ts` outputs static routes (**including villas, villa `/spaces`, legal URLs**) + dynamic blog posts.
- **Robots**: `src/app/robots.ts` allows `/` for indexable marketing; **`disallow`**: `/book`, `/menu`, `/api/`, **`/admin`**, **`/wishlist`**; **dedicated duplicate rules for major AI crawlers** (see GEO section).
- **Structured data**: **`WebSite` + `Organization` + `LodgingBusiness`** in `src/app/layout.tsx`; Home still emits supplemental **Organization** via `JsonLd`; **vacation rental** schema per villa; **breadcrumb** schema on **`/spaces`**.
- **IndexNow**: `POST /api/indexnow` + key file in `public/`. Bearer **`INDEXNOW_API_SECRET`** + **`INDEXNOW_HOST`** allowlist (**see `.env.example`**).
- **OG/social**: Root defaults retained; **villa routes** inherit **large-image** previews from villa hero URLs (relative paths resolved via **`metadataBase`**).
- **`llms.txt`**: Served at **`/llms.txt`** for crawler and assistant discovery (**`public/llms.txt`**).

### Missing / improvements (next polish)
- **OG master asset**: **Done** — **`public/og-default.jpg`** (1200×630) + root metadata (per-villa shares still use hero imagery).
- **Redirects**: Expand beyond policy + **`/blog` → `/blogs`** when legacy slugs are confirmed.
- **`hreflang`**: Only **`en-IN`** is implied today; add explicit alternates only if multi-locale rollout happens.
- **Passage tuning for AI**: Blogs and long guides are your best quotable corpus — periodically add/update **FAQ** blocks (`FAQPage` JSON-LD) on high-intent URLs when copy exists.

---

## GEO / LLM citation optimization (elite technical tier)

Traditional SEO fixes rankings; **GEO** fixes **whether models can cite you accurately**. Implemented items target **SSR HTML** (already App Router defaults), **crawler clarity**, **entity graphs**, and **machine-readable intent**.

| Signal | Implementation |
|--------|------------------|
| **`llms.txt`** | **`public/llms.txt`** maps assistants to canonical marketing URLs, spells **what not to hallucinate** (live price/availability), and points at **`sitemap.xml` / `robots.txt`** |
| **AI crawlers (`robots.txt`)** | Parallel rules for **`GPTBot`**, **`OAI-SearchBot`**, **`ChatGPT-User`**, **`ClaudeBot`**, **`Claude-Web`**, **`PerplexityBot`**, **`Google-Extended`** aligned to the site policy (no accidental blanket blocks) |
| **Entity graph** | **`@id`-linked** `Organization` ↔ `LodgingBusiness` ↔ `WebSite` in `layout.tsx` + property-level **`VacationRental`** |
| **Quotable detail pages** | Each villa is a **standalone URL** with **unique `<title>` + meta description + hero OG image** distilled from **`Villa.description`** |
| **Gallery depth** | `/villas/[id]/spaces` gains **breadcrumb JSON-LD** + metadata for secondary long-tail retrieval |
| **Utility hygiene** | **`/wishlist`** + **`/admin`** **`noindex`** and blocked in **`robots.txt`** → fewer thin or sensitive URLs competing for embeddings |
| **Build-safe SSR metadata** | **`dynamic = "force-dynamic"`** on villa + spaces layouts (client **`useSearchParams()`** compatibility); **`<head>` + JSON-LD still render on each request** |

### Off-site GEO (not in repo)

Studies through early 2026 still show outsized citation lift from **YouTube**, **Reddit**, and **Wikipedia-class** corroboration. Treat this codebase as **making on-site retrieval unambiguous**; **brand mentions elsewhere** remain a separate roadmap.

### Optional futures

- **`FAQPage`** / **`HowTo`** JSON-LD on blogs and pillar pages.
- **`RSL 1.0`-style licensing** headers if/when hosting supports them.
- **VideoObject** markup for pinned hero YouTube assets on villas.

---

## Performance + UX audit

### Implemented
- Next.js image optimization settings in `next.config.mjs` (AVIF/WebP, breakpoints, remotePatterns).
- Many local images use `next/image` with explicit sizes and `loading="lazy"` patterns.
- Prebuild step generating media manifest suggests work toward stable, fast galleries.

### Risks / missing
- Many `next/image` usages set **`unoptimized`**, which can bypass Next’s image pipeline and increase transfer size. If intentional (because assets are already optimized), enforce and verify.
- Large `public/` assets (media library) can affect repo size and CI/CD times; consider an object storage + CDN for heavy media.

---

## Data + backend audit (bookings)

### Implemented
- PostgreSQL-backed booking create + availability.
- Conflict detection query prevents overlapping bookings.
- Admin list / single-record **GET**, **PATCH**, **DELETE** use **`verifyAdminPassword`** (`timingSafeStringEqual`); **`ADMIN_PASSWORD` required** — otherwise **503** for admin endpoints.
- **POST `/api/bookings`**: JSON body capped (~48KB), **`application/json`** enforced; **`villaId` allowlisted** via `src/lib/mockData` villas; contact fields validated with **`bookingDetailsFieldErrors`** (aligned with the booking UI); `Cache-Control: no-store` on JSON responses where appropriate.
- **GET `/api/bookings/availability`**: **`villaId`** must match a registered villa; **year/month** range validated.
- **Edge middleware** (`src/middleware.ts`): **`/api/*`** verb allowlist **+** coarse per-IP rate limit **+** `Cross-Origin-Resource-Policy: same-site`; per-route rate limits still apply in handlers.

### Missing / improvements
- **Auth model**: Shared secret header hardened (timing-safe, misconfig detection); optional next steps: JWT/admin session **or** IP allowlist + audit log.
- **Validation**: Extended on server for name/phone/email/notes, villa existence, bounded add-ons array. Optional: max stay length, guest caps tied to villa rules.
- **Payments (ops)**: **Checkout UX shipped** — success screen passes UUID and opens Checkout when Razorpay env is set; **production** still needs keys, webhook URL, DB migration; reconcile **`bookings.status`** with **`payment_gateway_state`** for your policy.

---

## Content + media hygiene audit

### Implemented
- Strong content modeling for blogs (`src/data/blogs.ts` includes sections, CTA, FAQ, tables).
- Villa asset organization work tracked via `public/Villa_Retreats_Tree.html` and scripts/logs.

### Missing / improvements
- Asset naming consistency and folder completeness is still an open issue (as documented in `public/Villa_Retreats_Tree.html`).
- Ensure every route has “finished” copy: CTAs, hero sections, and consistent brand assets (logos/OG).

---

## Action plan (end-to-end, minimal-to-complete)

### P0 (today) — stop 404s
- **Done**: Menu links fixed and redirects added for `/privacy`, `/terms`, `/refund`.
- **Done**: Removed `/X/...` image references and replaced with existing `public/Villa_Retreats/...` images.
- **Done**: Global **`og-default.jpg`** (1200×630) + layout metadata for link previews.

### P1 (this week) — SEO + migrations
- **Done (common case)**: `/blog/:slug*` → `/blogs/:slug*` redirect added.
- **Done (elite SEO)**: Sitemap expanded with **villas**, **`/spaces`**, **legal URLs** + **`public/llms.txt`** + **AI crawler `robots` mirrors**.
- Populate real redirects in `next.config.mjs` for any other legacy URL patterns beyond blog + legal shortcuts.
- **Done**: **Canonical discipline** on **villas + spaces**, **legal layouts**, **`wishlist`**, **`admin`** (homepage + keyed layouts already had paths).

### P2 (next) — security + reliability
- **Done (2026-05-01 — elite baseline)**: Middleware + hardened `next.config` headers (production **HSTS**, **COOP** `same-origin-allow-popups`, expanded Permissions-Policy, **`productionBrowserSourceMaps: false`**); safe JSON ingestion; villa allowlists; timing-safe admin password; IndexNow Bearer + URL allowlist; tighter Instagram/availability payloads.
- Optional uplift: JWT/session admin, IP allowlist, audit log for admin actions.
- **Rate limiting storage**: global + route limits remain **in-memory**; migrate to Redis/Upstash when scaling horizontally.
- **CSP**: add a **nonce-based** Content-Security-Policy when ready (HSTS already set in prod via `next.config`).

---

## Security hardening (reference — implemented 2026-05-01)

| Layer | Implementation |
|--------|------------------|
| Config | `next.config.mjs`: security headers + production HSTS + COOP + DNS prefetch control + cross-domain policy |
| Edge | `src/middleware.ts`: matcher `/api/*`, verb filter, coarse rate limit, CORP |
| Parsing | `src/lib/security/safeJson.ts`: `readJsonBody` max bytes + JSON Content-Type |
| Admin | `src/lib/security/adminAuth.ts` + `timingSafe.ts` |
| Booking input | Villa registry check (`src/lib/security/villaId.ts`), booking id hygiene (`ids.ts`) |
| API routes | Booking create/admin/availability/indexnow/oembed tightened as above |

---

## Other remaining issues (recommended next)

**(For P0–P3 prioritized gaps — especially lead capture, payments, and analytics — see [Holistic backlog](#holistic-backlog-what-needs-doing) above.)**

### Security
- **Admin auth**: shared secret is timing-safe and required for admin APIs; JWT/session remains optional hardening for teams and revocation.
- **Rate limiting storage**: in-memory limiter won’t converge across multi-instance/serverless regions; use Redis/Upstash.
- **Strict CSP**: add nonce/hash-based CSP in addition to current headers if threat model warrants it.

### SEO / Social
- **OG image quality**: **Done** — `public/og-default.jpg` (1200×630) for global shares; villas still use **hero-based** previews on detail routes.
- **Redirect mapping**: extend redirects beyond policy + blog legacy once old URLs are known.
- **FAQ / HowTo structured data**: add on top blogs guides when FAQs exist in copy (**not yet automated**).

### Backend reliability
- **Payments flow**: webhook verification + gateway fields are coded; **ops** confirms live Razorpay + DB; define **status** transitions with finance.
- **Validation additions** (done on API): aligned phone/name/email notes with booking form validators; **`villaId`** registered-villa allowlist. Optional extras: max stay length, tighter guest caps.

### Performance / Ops
- **Media delivery**: consider object storage + CDN for the large `public/` library.
- **Monitoring**: **Sentry optional** — set **`NEXT_PUBLIC_SENTRY_DSN`** for client/server error capture (see **WEBDEV-Audit** for file paths).

---

## Evidence (key files reviewed)
- `package.json`, `next.config.mjs`, `tsconfig.json`, `src/middleware.ts`, **`.github/workflows/ci.yml`**
- Funnel + booking pay: **`src/app/book/page.tsx`**, **`src/lib/paymentService.ts`**, **`src/lib/payments/razorpayCheckout.ts`**, **`src/components/EnquireOverlay.tsx`**, **`src/components/experience/WeddingVenueEnquiryForm.tsx`**, **`src/app/careers/page.tsx`**, **`src/app/api/bookings/route.ts`**
- Tests: **`src/lib/*.test.ts`**, **`e2e/smoke.spec.ts`**, **`e2e/lead-surfaces.spec.ts`**, **`playwright.config.ts`**
- GEO / SEO: **`public/llms.txt`**, `src/app/robots.ts`, `src/app/sitemap.ts`, `src/app/layout.tsx`, `src/app/villas/[id]/layout.tsx`, `src/app/villas/[id]/spaces/layout.tsx`, `src/lib/seo/meta.ts`, legal **`layout.tsx`** segments, **`wishlist`**, **`admin`** layouts
- Routes: `src/app/**/page.tsx`
- Booking APIs: `src/app/api/bookings/**`, DB: `src/lib/db.ts`
- Security helpers: `src/lib/security/*.ts`, `src/lib/bookingDetailsValidation.ts`, `src/lib/rateLimit.ts`
- Blog data: `src/data/blogs.ts`
- Existing media audit artifact: `public/Villa_Retreats_Tree.html`


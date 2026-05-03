# WEBDEV Audit — Jade_ReVamp

**Audience:** Engineering, DevOps, and delivery leads · **Companion to client-facing pack:** [`audit-report.md`](./audit-report.md) / [`audit-report.html`](./audit-report.html)  
**Filesystem note:** Alternate name `WEBDEV:Audit` is represented as **`WEBDEV-Audit`** (hyphen avoids `:` issues on Windows). See also [`WEBDEVAudit.md`](./WEBDEVAudit.md).  
**Revision:** **2026-05-03** (synced to repo) · **Stack:** Next.js 14 App Router · TypeScript · Tailwind · PostgreSQL (`pg`) · Resend/Razorpay (optional env)

---

## 1. How to use this vs the client audit

| Document | Purpose |
|----------|---------|
| **`audit-report.md` / `.html`** | Executive / stakeholder confirmation — what shipped, polish items, SEO story. |
| **`WEBDEV-Audit.md` / `.html` (this pack)** | Technical inventory, API truth, infra checklist, diagrams, precise “done vs ops vs stretch”. |

For a visual, responsive layout open **`WEBDEV-Audit.html`** in a browser — it now mirrors **§1–§8** of this Markdown file (full API table, legend, payments split, SEO table, env/DB, backlog, evidence) plus SVG diagrams and maturity bars.

---

## 2. Re-audit snapshot (2026-05-02)

Method: fresh pass over `src/app/api/**`, `src/middleware.ts`, `next.config.mjs`, overlays/forms, `.env.example`, `schema*.sql`; cross-check with **technical SEO** categories (crawlability, indexability, security headers, robots/sitemap discipline — aligned with SEO technical checklist).

### 2.1 Maturity strip (readable from code — not penetration-tested)

```
[████████████████████░░░░]  Core app & SSR marketing     ~ strong
[████████████████░░░░░░░░]  Booking + Postgres          ~ production-shaped
[██████████████░░░░░░░░░░]  Leads / careers APIs        ~ implemented
[████████████████░░░░░░░░]  Payments rails              ~ order + webhook + post-book checkout UI
[████████████░░░░░░░░░░░░]  Test / observability        ~ Vitest + Playwright smoke; Sentry optional (DSN)
```

### 2.2 Status legend

| Badge | Meaning |
|-------|---------|
| **Done (code)** | Implemented in repo; may still require env/DB on the host. |
| **Ops** | Requires keys, migrations, Razorpay dashboard, or runtime policy choice. |
| **Stretch** | Recommended hardening/polish, not blocking launch. |

---

## 3. API route inventory (`src/app/api`)

**Edge (applies before every route):** **`src/middleware.ts`** — **`600`** requests per IP per **`60 s`** window (`key: edge:api:<ip>`), HTTP verb allowlist, `Cross-Origin-Resource-Policy: same-site`. Routes below add **tighter** handler limits when listed.

| Route | Role | Handler limit (IP · window) | Auth / extras | Notes |
|-------|------|-----------------------------|---------------|-------|
| `POST /api/bookings` | Create + overlap check | **20** · 10 min | — | `notifyBookingCreated` when Resend set. |
| `GET /api/bookings` | Admin list | **60** · 10 min | `x-admin-password` · **`ADMIN_PASSWORD`** | — |
| `GET /api/bookings/[id]` | Admin fetch one | **120** · 10 min | `x-admin-password` | Timing-safe compare. |
| `PATCH /api/bookings/[id]` | Admin update | **60** · 10 min | `x-admin-password` | — |
| `DELETE /api/bookings/[id]` | Admin delete | **30** · 10 min | `x-admin-password` | — |
| `GET /api/bookings/availability` | Monthly occupancy | **120** · 5 min | — | Villa allowlisted. |
| `POST /api/leads` | JSON leads | **20** · 60 min | — | `general_enquiry`, **`rathaa_enquiry`**, `wedding_enquiry`. |
| `POST /api/leads/partner` | Partner + photos | **10** · 60 min | multipart | **`partner_leads`** + **`partner_lead_photos`**. |
| `POST /api/careers/apply` | Résumé upload | **8** · 60 min | multipart | Persist + notify. |
| `POST /api/payments/razorpay-order` | Razorpay order | **30** · 10 min | — | **`booking_uuid`** / **`bookingId`** in body. |
| `POST /api/webhooks/razorpay` | Payment events | *Edge only* | HMAC **`X-Razorpay-Signature`** · raw body | No handler `rateLimit`; **`RAZORPAY_WEBHOOK_SECRET`**. |
| `POST /api/indexnow` | Index ping | **20** · 10 min | Bearer + host allowlist | **`INDEXNOW_API_SECRET`** in prod. |
| `GET /api/instagram/oembed` | oEmbed proxy | **60** · 10 min | — | Bounded params. |
| `GET /api/experiences/[slug]/media` | Media JSON | *Edge only* | — | No handler limiter. |
| `GET /api/villas/[id]/media` | Media JSON | *Edge only* | — | No handler limiter. |

---

## 4. Frontend → backend funnel (verified)

| Surface | Wired? | Destination |
|---------|--------|-------------|
| `EnquireOverlay` | Yes | `POST /api/leads` (`general_enquiry`). |
| `WeddingVenueEnquiryForm` | Yes | `POST /api/leads` (`wedding_enquiry`). |
| `RathaaOverlay` | Yes | `POST /api/leads` (`rathaa_enquiry`). |
| `PartnerOverlay` | Yes | `POST /api/leads/partner` (multipart). |
| Careers apply | Yes | `POST /api/careers/apply`. |
| Booking flow `/book` | Yes | `POST /api/bookings`; success screen calls **`initiatePayment(..., { bookingUuid })`** → **`POST /api/payments/razorpay-order`** then **Razorpay Checkout** (`src/app/book/page.tsx`, `src/lib/payments/razorpayCheckout.ts`). |

---

## 5. Payments — technical truth

| Layer | Status |
|-------|--------|
| Razorpay order (server) | **Done** — keys required. |
| Order ↔ booking linkage | **Done** when request includes UUID and DB columns exist. |
| Webhook verification | **Done** — configure secret + URL in Razorpay. |
| **`paymentService.ts`** (`initiatePayment`) | **Done** — POST body includes **`booking_uuid`** when `opts.bookingUuid` is set (success screen passes booking id). |
| Post-booking Checkout UX | **Done** — success screen opens Razorpay Checkout when the order API returns keys; if payments are not configured (**501**), copy explains offline follow-up. |
| **`bookings.status` vs `payment_gateway_state`** | **Ops/policy** — not auto-synced beyond gateway fields on webhook. |

---

## 6. SEO / technical checklist (abbreviated second pass)

| Category | Observation |
|---------|--------------|
| **Crawlability** | `robots.ts` + `sitemap.ts`; transactional paths disallowed intentionally. |
| **Indexability** | Canonical/metadata on villas, spaces, legal; `noindex` on wishlist/admin. |
| **Security (transport/config)** | HSTS prod, nosniff, frame options, COOP, Permissions-Policy; admin timing-safe compare. |
| **Security (stretch)** | CSP with nonces, Redis-backed rate limits, JWT admin — recommended at scale. |
| **GEO / AI crawlers** | Mirrored rules + `llms.txt` — strong vs peers. |
| **JS rendering** | Marketing largely SSR; heavy motion on client — crawlers still get core copy from App Router defaults. |

---

## 7. Still open (ops / stretch — code-complete items removed)

**Shipped in repo since prior audit:** post-book **`booking_uuid`** + Razorpay Checkout on the booking success screen; **`initiatePayment`** optional **`bookingUuid`**; **`@sentry/nextjs`** (enabled when **`NEXT_PUBLIC_SENTRY_DSN`** set); global **`og-default.jpg`** (1200×630) + **`layout.tsx`** Open Graph; Vitest (**`paymentService`**, **`bookingDetailsValidation`**) + Playwright smoke (**`npm run test:e2e`** / **`test:e2e:ci`**).

1. **Ops:** Run **`schema.sql`** or **`schema_migration_leads_rathaa_partner_payments.sql`** on production DB.  
2. **Ops:** Razorpay Dashboard — webhook URL + **`RAZORPAY_WEBHOOK_SECRET`**; live keys in env.  
3. **Policy:** Define when **`bookings.status`** flips vs **`payment_gateway_state`** / paid semantics.  
4. **Stretch — QA:** More Vitest; optional **form POST** e2e with a test database. **Page smoke** for `/careers` and `/contact` is in **`e2e/lead-surfaces.spec.ts`**.  
5. **Stretch — Performance:** CDN / object storage if **`public/`** hurts deploy size or TTFB.  
6. **Stretch — Security:** CSP with nonces, Redis-backed rate limits, JWT admin (see §6).  

---

## 8. Evidence index (quick pointers)

- APIs: `src/app/api/**`  
- Security: `src/middleware.ts`, `src/lib/security/*`, `next.config.mjs`  
- Email: `src/lib/email/*`  
- DB: `schema.sql`, `schema_migration_leads_rathaa_partner_payments.sql`, `src/lib/db.ts`  
- Funnel UI: `src/components/EnquireOverlay.tsx`, `RathaaOverlay.tsx`, `PartnerOverlay.tsx`, `experience/WeddingVenueEnquiryForm.tsx`, `src/app/careers/page.tsx`  
- Book + pay: `src/app/book/page.tsx`, `src/lib/paymentService.ts`, `src/lib/payments/razorpayCheckout.ts`  
- Observability: `src/instrumentation.ts`, `src/instrumentation-client.ts`, `sentry.*.config.ts` under `src/`, `withSentryConfig` in `next.config.mjs`  
- Tests: `src/lib/*.test.ts`, `e2e/smoke.spec.ts`, `playwright.config.ts`  

---

*Generated as a developer companion to the client audit pack. For rendered infographics and mobile layout, open **`WEBDEV-Audit.html`**.*

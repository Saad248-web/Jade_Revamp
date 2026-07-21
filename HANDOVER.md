# Jade Hospitainment — Project Handover

> **Audience:** the incoming development team.
> **Purpose:** everything you need to take ownership of the **Jade Hospitainment / Jade Retreats** platform — run it locally, understand the architecture, deploy it, and know exactly what is done vs. still pending.
>
> **Read this file first**, then use the [Documentation index](#12-documentation-index) to go deeper.

**Prepared:** 2026-07-21 · **Repo:** `github.com/Saad248-web/Jade_Revamp` (branch `main`) · **Stack:** Next.js 14 App Router + MongoDB

---

## Table of contents

1. [One-minute orientation](#1-one-minute-orientation)
2. [What is in this handover package](#2-what-is-in-this-handover-package)
3. [Day 1 — run it locally](#3-day-1--run-it-locally)
4. [Repository map](#4-repository-map)
5. [Architecture & key flows](#5-architecture--key-flows)
6. [Data model](#6-data-model)
7. [Environment variables](#7-environment-variables)
8. [External accounts & services to transfer](#8-external-accounts--services-to-transfer)
9. [Deployment (Vercel)](#9-deployment-vercel)
10. [Testing & CI](#10-testing--ci)
11. [Known issues, gaps & pending work](#11-known-issues-gaps--pending-work)
12. [Documentation index](#12-documentation-index)
13. [Security must-dos at handover](#13-security-must-dos-at-handover)
14. [Handover checklist](#14-handover-checklist)
15. [Contacts](#15-contacts)

---

## 1. One-minute orientation

**Product.** Marketing + booking platform for **Jade Hospitainment**: luxury private villa retreats, destination weddings, corporate offsites, and curated experiences near Bangalore. Guests browse villas, enquire, book, and pay; staff manage everything from an in-app dashboard (**Jade Host PMS**).

**Stack (authoritative — trust this over any older note that says PostgreSQL/STAAH).**

| Layer | Technology |
|-------|------------|
| Framework | **Next.js 14.2.4** (App Router, RSC), React 18, TypeScript 5 |
| Styling | Tailwind CSS 3 (+ container queries) |
| Motion | GSAP, Framer Motion, Lenis smooth scroll |
| Database | **MongoDB** via Mongoose (single `MONGODB_URI`) |
| Auth | NextAuth (JWT, role-based) — staff dashboard only |
| Payments | Razorpay (order API + signed webhook) |
| Email | Resend (transactional; optional) |
| Channel manager | **Axis Rooms** (OTA sync — sandbox integrated, production pending) |
| Editor / CMS | TipTap (blogs), custom dashboard modules |
| Observability | Sentry (optional DSN) |
| Tests | Vitest (unit) + Playwright (E2E) |
| Hosting | Vercel |

**Live/reference URLs**

- Production marketing domain: `https://jadehospitainment.com`
- Email/brand domain (Resend sender + guest-facing links): `https://jaderetreats.com`
- Vercel app: `https://jade-revamp.vercel.app`

---

## 2. What is in this handover package

| Item | Where | Notes |
|------|-------|-------|
| **Source code** | `Jade_ReVamp_Handover_<date>.zip` | Clean export of the git working tree. **No** `node_modules`, `.next`, secrets, or AI tooling. |
| **This handover guide** | `HANDOVER.md` (in the ZIP) | Start here. |
| **Project docs** | `README.md`, `NEEDS_FROM_USER.md`, `SECURITY-AUDIT.md`, `docs/` (in the ZIP) | See [doc index](#12-documentation-index). |
| **Credentials & secrets** | `CREDENTIALS.md` — **shared separately** (secure channel) | **Not** in the repo or the ZIP. Real keys + accounts to transfer. |

**Deliberately excluded from the ZIP** (and why):

- `node_modules/`, `.next/`, `test-results/`, `logs/`, `tmp/` — regenerated on install/build.
- `.env.local`, `.env*.local`, `.env.vercel*` — **live secrets**. Use `.env.example` as the template; real values are in the separately shared `CREDENTIALS.md`.
- `NEXUS_v4_APEX/`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` — internal AI-assistant tooling, not part of the product.
- `.vercel/`, `.postman/`, `postman/` — local/CLI workspace state.

> The `.env.example` file **is** included — it is the safe, no-secret template.

---

## 3. Day 1 — run it locally

### Prerequisites

- **Node.js 20 LTS** (CI target; Node 22 also works).
- **MongoDB** — a connection string in `MONGODB_URI`. Options:
  - MongoDB **Atlas** free tier (`mongodb+srv://…`), or
  - Local self-hosted replica set — `npm run db:start` helper is provided.
- Git.

### Steps

```bash
# 1. Install dependencies
npm install

# 2. Create your local env from the template, then fill values (see §7 + CREDENTIALS.md)
cp .env.example .env.local      # PowerShell: Copy-Item .env.example .env.local

# 3. (Local Mongo only) start a local MongoDB
npm run db:start

# 4. Seed staff users + villa catalogue into MongoDB
npm run db:seed:users           # staff accounts — ROTATE the default password
npm run db:seed                 # villa catalogue

# 5. Run the dev server
npm run dev                     # http://localhost:3000
```

### Verify the setup

```bash
npm run setup:check    # checks Node, deps, .env.local, DB reachability
npm run db:test        # MongoDB connectivity smoke
npm run api:smoke      # POST /api/leads + /api/careers/apply (dev server must be running)
npm run email:test     # sends a test email (needs RESEND_API_KEY + verified domain)
```

- Public site: `http://localhost:3000`
- Staff dashboard: `http://localhost:3000/login` → `/dashboard` (seeded credentials — see `CREDENTIALS.md`, rotate immediately).

### Payments locally (no Razorpay keys needed)

Set `PAYMENT_GATEWAY_MODE=test` (and `NEXT_PUBLIC_PAYMENT_GATEWAY_MODE=test`) to use the **simulated** pay button for local UAT. Switch to `razorpay_test` then `production` as keys become available — full walkthrough in [`NEEDS_FROM_USER.md`](./NEEDS_FROM_USER.md#payment-gateway-modes-temporary-test--production).

---

## 4. Repository map

```text
Jade_ReVamp/
├── src/
│   ├── app/                 # App Router: pages, layouts, metadata routes
│   │   ├── api/             # 81 route handlers (public + /dashboard + webhooks + cron)
│   │   ├── dashboard/       # Jade Host PMS (staff CMS/PMS) — NextAuth-guarded
│   │   ├── book/            # Booking wizard + success (Razorpay hand-off)
│   │   ├── villas/[id]/     # Villa detail + /spaces gallery
│   │   ├── (marketing)      # weddings, corporate, weekend, party, experiences, caravans, blogs…
│   │   ├── layout.tsx       # Global metadata, fonts, JSON-LD graph
│   │   ├── providers.tsx    # Lenis, overlays, booking/wishlist context, GA
│   │   ├── template.tsx     # Per-navigation remount; manual scroll restoration
│   │   ├── robots.ts / sitemap.ts / manifest.ts
│   │   └── middleware.ts    # (src/middleware.ts) edge guard for /api/*
│   ├── components/          # ~88 UI modules (experience, villa, menu, ui, booking, dashboard)
│   ├── lib/                 # DB, payments, auth/permissions, validation, SEO, scroll/Lenis
│   ├── data/                # Typed retreats/villas, blogs, overlay pricing maps
│   ├── models/              # 17 Mongoose schemas (see §6)
│   ├── context/             # Animation, booking, wishlist providers
│   ├── emails/              # React Email templates (Resend)
│   ├── generated/           # mediaManifest.ts (prebuild output)
│   ├── styles/              # Global + dashboard CSS
│   ├── types/               # Shared TypeScript types
│   ├── Jade Property Data/  # Canonical property data source (Jade_Property_Data.md)
│   └── sentry.*.config.ts / instrumentation*.ts
├── public/                  # Large WebP/image tree + llms.txt + og-default.jpg
├── scripts/                 # Media manifest, favicons, seeds, migrations, Axis + setup tooling
├── e2e/                     # Playwright specs
├── docs/                    # Deep-dive docs (Axis API, Mongo migration, UAT)
├── next.config.mjs          # Security headers, image config, Sentry wrapper
├── vercel.json              # Cron schedules
├── .env.example             # Env template (copy to .env.local)
├── README.md                # Full technical README
├── NEEDS_FROM_USER.md       # Credentials + UAT checklist (operational truth)
└── SECURITY-AUDIT.md        # Point-in-time security review
```

---

## 5. Architecture & key flows

### Rendering, scroll & navigation

- Single global **Lenis** smooth-scroll instance in `providers.tsx`; respects `prefers-reduced-motion`.
- `src/app/template.tsx` sets `history.scrollRestoration = "manual"` so it doesn't fight Lenis; `ScrollToTopOnNavigate` resets scroll on route change.
- Venue overlays (`VenueOverlay`, `PartyVenueOverlay`, `CorporateVenueOverlay`) and villa detail use shared section-nav + scroll-spy hooks.

### Content / data source

- Villas and experiences are **typed TypeScript modules** under `src/data/retreats/` (the marketing catalogue), while **bookings, leads, CMS content, media, and users live in MongoDB**.
- Canonical property facts live in `src/Jade Property Data/Jade_Property_Data.md`; the seed script only seeds the **confirmed** subset and warns on `[CONFLICT]`/`[TBD]` items.

### Public conversion flows

| Flow | Entry | API |
|------|-------|-----|
| General / Rathaa / wedding enquiry | Global `EnquireOverlay`, `RathaaOverlay` | `POST /api/leads` |
| Partner programme (multipart + photos) | `PartnerOverlay` | `POST /api/leads/partner` |
| Careers application (résumé upload) | `/careers` | `POST /api/careers/apply` |
| Booking → payment | `/book` → `/book/success` | `POST /api/bookings` → `POST /api/payments/razorpay-order` → `POST /api/webhooks/razorpay` |

### Jade Host PMS (staff dashboard, NextAuth-guarded, `noindex`)

`/dashboard` modules: **bookings** + calendar, **leads**, **careers**, **payments**, **conflicts**, **media** library, **blocks**, **staff** + roles, **housekeeping**, **SEO** (blogs/TipTap editor, redirects, sitemap, robots, analytics), **settings** (villas quick-edit, **Axis Rooms**), and **dev** tools (system, logs, database). RBAC is defined in `src/lib/**/permissions.ts` and enforced by `middleware.ts` + per-route guards.

### Integrations

| Integration | Status | Notes |
|-------------|--------|-------|
| **MongoDB** | ✅ Live | Single DB via `connectDB()` in `src/lib/db.ts`; night-lock concurrency + transactions on booking create. |
| **Razorpay** | ✅ Code complete | Order API + **signature-verified**, idempotent webhook. Needs live keys at go-live. |
| **Resend** | ✅ Live | Staff + guest transactional email; domain `jaderetreats.com` verified. Forms still save if unset (email skipped). |
| **Axis Rooms** (channel manager) | ⚠️ Sandbox | 12 of 15 APIs integrated; APIs 1/2/6/7/9 wired. **Inbound persistence + villa-by-CM-ID lookup are the key open items** (see §11). |
| **Sentry** | ⚙️ Optional | Enabled when `NEXT_PUBLIC_SENTRY_DSN` set. |
| **IndexNow** | ⚙️ Optional | `POST /api/indexnow`; Bearer-protected in production. |
| **Google Analytics** | ⚙️ Optional | `NEXT_PUBLIC_GA_ID`. |

**Cron jobs** (`vercel.json`, `Authorization: Bearer <CRON_SECRET>`): scheduled-blog publish (06:00 UTC), trashed-blog purge (03:00 UTC), Axis nightly pull (02:00 UTC). Sub-daily jobs (`expire-pending-bookings`, `axisrooms-retry`) require Vercel Pro or an external cron — see `NEEDS_FROM_USER.md`.

**Edge middleware** on `/api/*`: verb allowlist, **600 req / 60 s / IP** rate limit, `Cross-Origin-Resource-Policy: same-site`.

---

## 6. Data model

MongoDB collections (Mongoose schemas in `src/models/`):

| Model | Purpose |
|-------|---------|
| `Booking` | Guest bookings, payment state, Axis CM sync fields |
| `VillaNightlock` | Per-villa/date lock — prevents double-booking (unique index) |
| `Villa` / `VillaContent` / `VillaBlock` | Villa records, CMS content, availability blocks |
| `Lead` / `PartnerLead` | Enquiries and partner-programme submissions |
| `Career` | Job applications + résumé references |
| `User` | Staff accounts (roles: admin, staff, team, seo, dev) |
| `WebhookEvent` | Idempotency ledger (Razorpay; Axis inbound pending) |
| `AuditLog` | Booking/mutation audit trail |
| `MediaAsset` / `MediaFolder` | Media library |
| `ContentPage` | CMS pages / blogs |
| `SeoRedirect` / `SeoSiteSettings` | SEO redirects + site settings |
| `RateLimitBucket` | Persistent rate-limit buckets |

Seeders: `npm run db:seed` (villas), `npm run db:seed:users` (staff). Migration helpers: `scripts/migrate-mongo.mjs`, `scripts/migrate-staah-to-axisrooms.mjs`.

---

## 7. Environment variables

Full template: [`.env.example`](./.env.example). Real values are in the separately shared **`CREDENTIALS.md`**.

| Variable | Required? | Purpose |
|----------|-----------|---------|
| `MONGODB_URI` | **Yes** | Single MongoDB (bookings, leads, CMS, users) |
| `NEXTAUTH_SECRET` | **Yes** (dashboard) | NextAuth JWT signing |
| `NEXTAUTH_URL` | **Yes** (deployed) | Canonical auth URL (no trailing slash) |
| `NEXT_PUBLIC_SITE_URL` | **Yes** (deployed) | Absolute links in SEO + emails (never `localhost` on deploy) |
| `CRON_SECRET` | Yes (crons) | Bearer token on `/api/cron/*` |
| `PAYMENT_GATEWAY_MODE` / `NEXT_PUBLIC_PAYMENT_GATEWAY_MODE` | Yes | `test` \| `razorpay_test` \| `production` (keep in sync) |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Payments | Create order |
| `RAZORPAY_WEBHOOK_SECRET` | Payments | HMAC verify webhook |
| `NEXT_PUBLIC_PAYMENT_GATEWAY_KEY` | Payments | Razorpay Checkout key (client) |
| `RESEND_API_KEY` / `RESEND_FROM` / `STAFF_NOTIFY_EMAIL` | Email | Transactional email (staff inbox = `Enquiry@jaderetreats.com`) |
| `AXIS_ROOMS_*` | Channel mgr | Base URL, channel id, API key, PMS name, test ids |
| `INDEXNOW_KEY` / `INDEXNOW_HOST` / `INDEXNOW_API_SECRET` | Prod SEO | IndexNow submission |
| `NEXT_PUBLIC_SENTRY_DSN` | Optional | Sentry |
| `NEXT_PUBLIC_GA_ID` | Optional | Google Analytics |
| `SEED_USER_PASSWORD` | Seeding | Overrides default seed password (**set before prod**) |

> Keep `PAYMENT_GATEWAY_MODE` and `NEXT_PUBLIC_PAYMENT_GATEWAY_MODE` identical, and never deploy with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.

---

## 8. External accounts & services to transfer

These accounts back the running product. Transfer ownership (or add the new team) and **rotate credentials** — real values/logins are in `CREDENTIALS.md`.

| Service | What it is used for | Handover action |
|---------|---------------------|-----------------|
| **GitHub** — `Saad248-web/Jade_Revamp` | Source of truth, CI | Add new team; transfer repo or fork |
| **Vercel** — team `saads-projects-eebe297b`, project `jade-revamp` | Hosting, env vars, crons | Add team; move env vars; verify deploy hook |
| **MongoDB** — Atlas cluster and/or VPS Mongo (`200.97.161.24:27017`) | Primary database | Transfer/duplicate; rotate DB user password; set network access |
| **Razorpay** | Payments | Transfer merchant account; issue new test + live keys + webhook secret |
| **Resend** — domain `jaderetreats.com` | Transactional email | Transfer account; **rotate `RESEND_API_KEY`**; keep DNS verified |
| **Axis Rooms** (channel manager) | OTA inventory/rate sync | Reassign PMS `Jade Host PMS` (channel `227`); get production keys after UAT |
| **Domain / DNS** — Hostinger (`jaderetreats.com`, `jadehospitainment.com`) | Domains, email DNS | Transfer registrar/DNS access |
| **Sentry** (optional) | Error monitoring | Transfer project + DSN |
| **Google Analytics** (optional) | Web analytics | Transfer property |

---

## 9. Deployment (Vercel)

- Production branch: **`main`** → Vercel project **`jade-revamp`**. Push to `main` triggers a deploy (a deploy hook / `.github/workflows/vercel-production.yml` is used if the Git webhook goes stale — see README).
- **Production env vars** to set in Vercel → Settings → Environment Variables: `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_SITE_URL`, Razorpay keys, `RESEND_API_KEY` + `RESEND_FROM` + `STAFF_NOTIFY_EMAIL`, `CRON_SECRET`, `INDEXNOW_KEY`, Axis vars. **Redeploy** after changing env vars.
- Without `MONGODB_URI` on Vercel, dashboard APIs return **503**.
- `prebuild` regenerates `src/generated/mediaManifest.ts` (LQIP blur data) — runs automatically on `npm run build`.
- Full production checklist: [`NEEDS_FROM_USER.md`](./NEEDS_FROM_USER.md).

---

## 10. Testing & CI

```bash
npm test                 # Vitest unit tests (validation, pricing, payment service, …)
npm run test:e2e         # Playwright (starts dev server)
npm run test:e2e:ci      # build + start + Playwright (CI=true)
npm run lint             # next lint
```

- CI (`.github/workflows/ci.yml`): `npm ci` → `npm test` → `npm run build` on `main` PRs/pushes. Playwright is local/optional (weight).
- E2E specs live in `e2e/` (`smoke.spec.ts`, `lead-surfaces.spec.ts`).

---

## 11. Known issues, gaps & pending work

**Source of truth:** [`SECURITY-AUDIT.md`](./SECURITY-AUDIT.md) (severity-ranked) and the unchecked gates in [`NEEDS_FROM_USER.md`](./NEEDS_FROM_USER.md). Highlights:

**Blockers before OTA go-live (Axis Rooms):**
- `CM-01` **(Critical)** — inbound Axis webhook does not yet create/update/cancel bookings.
- `CM-02` **(Critical)** — no villa lookup by channel-manager `propertyId`/`roomTypeId`.
- `CM-03` **(High)** — no idempotency key on Axis inbound events.
- 3 of 15 Axis APIs still pending; API 15 is production-only. Real API 9 JSON samples (confirmed + cancelled) still needed from Axis.

**Security / auth:**
- `AUTH-01` **(High)** — rotate the seeded staff passwords (do **not** rely on the default `JadeHost2026!`); enforce `SEED_USER_PASSWORD` in prod.
- `PAY-01` **(High)** — manual "external" bookings skip payment verification; add manager approval + audit reason.
- `DATA-01` **(High)** — audit `console.error` paths for guest PII before shipping logs.
- CSP review: `next.config.mjs` uses `unsafe-inline` (Razorpay) — documented accepted risk to revisit.

**Verification still owed (see `NEEDS_FROM_USER.md`):** full booking→pay→webhook E2E, double-booking 409, cron soft-expire, Resend email UAT across all forms, Axis sandbox UAT.

> This is normal handover honesty: the marketing site + PMS + payments are functionally complete; **Axis OTA inbound is the main unfinished workstream.**

---

## 12. Documentation index

| Doc | Audience | Contents |
|-----|----------|----------|
| [`HANDOVER.md`](./HANDOVER.md) | **New team** | This guide — start here |
| [`README.md`](./README.md) | Engineers | Full technical reference (routes, scripts, architecture) |
| [`NEEDS_FROM_USER.md`](./NEEDS_FROM_USER.md) | Ops / lead | Credentials to provide, payment modes, Axis + Resend setup, UAT checklists |
| [`SECURITY-AUDIT.md`](./SECURITY-AUDIT.md) | Engineers | Point-in-time security review + remediation roadmap |
| [`docs/axisrooms-api-reference.md`](./docs/axisrooms-api-reference.md) | Integrators | Axis Rooms API contract |
| [`docs/mongodb-migration-vercel.md`](./docs/mongodb-migration-vercel.md) | DevOps | MongoDB on Vercel notes |
| [`docs/vercel-axis-sandbox-env.md`](./docs/vercel-axis-sandbox-env.md) | DevOps | Axis sandbox env on Vercel |
| [`docs/axisrooms-uat-session-2026-07-09.md`](./docs/axisrooms-uat-session-2026-07-09.md) | QA | Axis UAT session log |
| `jade-axisrooms-status.html`, `jade-dashboard-client-audit.html`, `Overall-Axis-API-Integration-Testing.html` | Stakeholders | Generated status reports (open in a browser) |
| `src/Jade Property Data/Jade_Property_Data.md` | Content/data | Canonical property facts (pricing, capacity) |

---

## 13. Security must-dos at handover

Before/at transfer (details in `CREDENTIALS.md`):

- [ ] **Rotate every shared secret** after transfer: `RESEND_API_KEY`, `NEXTAUTH_SECRET`, `CRON_SECRET`, MongoDB user password, Razorpay keys + webhook secret, Axis API key.
- [ ] **Rotate all seeded staff passwords** (`SEED_USER_PASSWORD` + force change on first login).
- [ ] Share `CREDENTIALS.md` over a **secure channel** (password manager / encrypted note) — **not** plain email.
- [ ] Confirm MongoDB **network access** is restricted (Atlas IP allowlist / VPS firewall) once the new team's egress IPs are known.
- [ ] Revoke the outgoing team's access to Vercel, GitHub, Atlas, Razorpay, Resend after cutover.
- [ ] Set `INDEXNOW_KEY` and production Razorpay keys only at go-live.

---

## 14. Handover checklist

**Outgoing team**
- [ ] Repo pushed to `main`, working tree clean, CI green.
- [ ] `CREDENTIALS.md` completed and shared securely.
- [ ] Source ZIP generated and attached (or repo access granted).
- [ ] Open items in §11 confirmed accurate.

**Incoming team**
- [ ] Clone/unzip, `npm install`, `.env.local` filled, app runs (`npm run dev`).
- [ ] `npm run setup:check` + `npm run db:test` pass.
- [ ] Can log into `/dashboard` and see seeded villas/bookings.
- [ ] Own Vercel deploy succeeds with your env vars.
- [ ] Secrets rotated; old access revoked.

---

## 15. Contacts

| Role | Name / handle | Contact |
|------|---------------|---------|
| Outgoing dev / owner | _<fill in>_ | _<email>_ |
| Client / business owner (Jade) | _<fill in>_ | `Enquiry@jaderetreats.com` |
| Axis Rooms integration contact | Rohith Kumar (Axis Rooms) | _<from Axis onboarding email>_ |
| Incoming dev lead | _<fill in>_ | _<email>_ |

---

*Prepared for project handover, 2026-07-21. Questions on anything above? Cross-reference `README.md` and `NEEDS_FROM_USER.md` first — they carry the operational detail.*

# NEEDS_FROM_USER — Jade Host PMS

Items the agent **cannot** complete without your input. Build passes with stubs; **Phase 1 E2E gates require Tier 1 credentials**.

**Last updated:** 2026-07-01

---

## Quick reference — what you need to do next

| Priority | Action | Where |
|----------|--------|--------|
| **Blocker** | Set `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL` on Vercel Production | Vercel env + redeploy |
| **Blocker** | Seed Atlas + rotate staff passwords | `npm run db:seed:users` · `npm run db:seed` |
| **Blocker** | Razorpay test keys + webhook → `/api/webhooks/razorpay` | Razorpay dashboard |
| **High** | Add Axis sandbox vars to `.env.local` / Vercel; run `node scripts/seed-axis-sandbox.mjs` + `npm run axis:test` | See Axis section below |
| **High** | Share API 9 webhook URL with Axis; register inbound bookings | `/api/webhooks/axisrooms` |
| **High** | Set `CRON_SECRET`; enable crons (Vercel Pro or external for sub-daily jobs) | See Cron section |
| **High** | Resend: verify domain, set `RESEND_API_KEY` + notify emails | resend.com |
| **UAT** | Flip mapped portfolio villas to **channel_managed** in Quick Edit | `/dashboard/villas` |
| **UAT** | Test enquiry forms per page source → `/dashboard/leads` | Public site + dashboard |
| **UAT** | Test careers apply → `/dashboard/careers` + résumé download | `/careers` + dashboard |
| **Cutover** | Production Razorpay keys, `INDEXNOW_KEY` | At go-live |

**Dashboard modules (staff CMS):** `/dashboard/leads` · `/dashboard/careers` · `/dashboard/settings/axis-rooms`

**Status reports:** `jade-dashboard-client-audit.html` · `jade-axisrooms-status.html` (12 of 15 Axis APIs integrated in code)

---

## Vercel production (required for live dashboard)

After pushing to `main`, set these in **Vercel → jade-revamp → Settings → Environment Variables → Production**:

| Variable | Value |
|----------|--------|
| `MONGODB_URI` | Same Atlas connection string as `.env.local` — prefer **`mongodb+srv://...`** from Atlas → Connect → Drivers (not the expanded `mongodb://host1,host2,...` list) |
| `NEXTAUTH_SECRET` | Same as local (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://jade-revamp.vercel.app` (no trailing slash) |
| `NEXT_PUBLIC_SITE_URL` | `https://jade-revamp.vercel.app` — **not** `http://localhost:3000` (email dashboard links use this) |

Then **Redeploy** (Deployments → ⋯ → Redeploy) so env vars apply.

Atlas **Network Access** must allow Vercel (you already have `0.0.0.0/0` — OK).

Seed production DB once from your machine (with `MONGODB_URI` pointing at Atlas):

```bash
npm run db:seed:users
npm run db:seed
```

Without `MONGODB_URI` on Vercel, dashboard APIs return **503** (blogs, SEO, bookings, villas all empty/error).

---

## Tier 1 — verify Phase 1 (free / test)

| Variable | Purpose | Status |
|----------|---------|--------|
| `MONGODB_URI` | Atlas free tier (replica set) or local Docker `rs.initiate()` | **Required for live booking** |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Razorpay **test** mode | **Required for pay flow** |
| `RAZORPAY_WEBHOOK_SECRET` | Test webhook → `POST /api/webhooks/razorpay` | **Required for confirm gate** |
| `NEXTAUTH_SECRET` | Staff JWT sessions | **Required for dashboard** |

**Setup steps**

1. Copy `.env.example` → `.env.local` and fill Tier 1 vars.
2. Seed users: `npm run db:seed:users` (rotate `SEED_USER_PASSWORD` before production).
3. Seed villas: `node scripts/seed-villas.mjs`.
4. Run migration once if upgrading: `node scripts/migrate-staah-to-axisrooms.mjs`.
5. Book → pay → confirm (see **Payment gateway modes** below).

---

## Payment gateway modes (temporary test → production)

Three modes controlled by `PAYMENT_GATEWAY_MODE` and `NEXT_PUBLIC_PAYMENT_GATEWAY_MODE` (keep both in sync):

| Mode | Env value | Pay button behaviour |
|------|-----------|----------------------|
| **Simulated test** | `test` | Instant confirm — no Razorpay keys needed. Updates dashboard bookings, calendar, payments, emails. **Local/dev only** (disabled on production deploy). |
| **Razorpay sandbox** | `razorpay_test` | Opens Razorpay Checkout with **test** keys. Webhook confirms booking. |
| **Production** | `production` | Live Razorpay keys + webhook. Use at go-live only. |

### Local UAT (no Razorpay yet)

```env
PAYMENT_GATEWAY_MODE=test
NEXT_PUBLIC_PAYMENT_GATEWAY_MODE=test
```

1. Book a villa → click **PAY … (TEST)** on the confirmation screen.
2. Check `/dashboard/bookings`, `/dashboard/payments`, and calendar — status should be **confirmed**.

### Switch to Razorpay sandbox

```env
PAYMENT_GATEWAY_MODE=razorpay_test
NEXT_PUBLIC_PAYMENT_GATEWAY_MODE=razorpay_test
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
NEXT_PUBLIC_PAYMENT_GATEWAY_KEY=rzp_test_...
RAZORPAY_WEBHOOK_SECRET=...   # optional but needed for auto-confirm without manual step
```

### Revert to production (go-live)

```env
PAYMENT_GATEWAY_MODE=production
NEXT_PUBLIC_PAYMENT_GATEWAY_MODE=production
# Replace with live Razorpay keys + webhook secret on Vercel
```

**Smoke:** `npm run email:test` (email) · Book → Pay (test or Razorpay) · verify dashboard.

---

## Transactional email (Resend) — bookings, leads, careers, partner, conflicts

Staff notifications use [Resend](https://resend.com). **SMS/WhatsApp is not wired** — email only.

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Resend API key — **rotate immediately** if pasted in chat or committed; store only in `.env.local` / Vercel |
| `RESEND_FROM` | Verified sender, e.g. `Jade Retreats <bookings@jaderetreats.com>` |
| `STAFF_NOTIFY_EMAIL` | **Single staff inbox** — always `Enquiry@jaderetreats.com` (bookings, leads, careers, partner, conflicts) |

Legacy `BOOKING_NOTIFY_EMAIL`, `LEADS_NOTIFY_EMAIL`, etc. are **ignored** — staff mail goes only to `STAFF_NOTIFY_EMAIL` / `Enquiry@jaderetreats.com`.

**Dashboard CMS:** `/dashboard/leads` (enquiries + partner leads) · `/dashboard/careers` (applications + résumé download).

Without `RESEND_API_KEY`, forms still save to MongoDB; emails are skipped (logged).

### Resend setup (one-time)

1. Create account at [resend.com](https://resend.com).
2. **Domains** → `jaderetreats.com` — **verified** (DNS on Hostinger, Jul 2026).
3. **API Keys** → create key → paste into `RESEND_API_KEY` on Vercel and local `.env.local` only.
4. Set `RESEND_FROM=Jade Retreats <bookings@jaderetreats.com>` (verified domain).
5. Set `STAFF_NOTIFY_EMAIL=Enquiry@jaderetreats.com` on Vercel production.

### Temporary testing (before domain verified) — done

`jaderetreats.com` is verified. Use production inboxes below (not `jade735pics@gmail.com` / `onboarding@resend.dev`).

### Example `.env.local` block (email)

```env
RESEND_API_KEY=re_xxxxxxxx
RESEND_FROM=Jade Retreats <bookings@jaderetreats.com>
STAFF_NOTIFY_EMAIL=Enquiry@jaderetreats.com
# BOOKING_GUEST_CONFIRM_EMAIL=false
```

### Smoke test

```bash
npm run email:test
```

Sends a simple HTML message to `STAFF_NOTIFY_EMAIL` (requires `RESEND_API_KEY` + verified domain).

### UAT checklist (email)

- [ ] Rotate `RESEND_API_KEY` if it was ever exposed; set `STAFF_NOTIFY_EMAIL=Enquiry@jaderetreats.com` on Vercel
- [ ] `npm run email:test` → message arrives at `Enquiry@jaderetreats.com`
- [ ] Submit enquiry from Weddings page → `/dashboard/leads` + staff email to `Enquiry@jaderetreats.com`
- [ ] Submit Party Villas / Corporate enquiry → correct source tag + staff inbox
- [ ] Apply on Careers page → `/dashboard/careers` + staff email with résumé attachment
- [ ] Partner programme submit → staff email with photo attachments
- [ ] `/book` → pay → **one** staff email + **one** guest confirmation (not on pending create)
- [ ] Manual hold → confirm in dashboard → staff + guest emails
- [ ] OTA sandbox booking (confirmed) → staff email at `Enquiry@jaderetreats.com`
- [ ] OTA conflict → staff conflict alert at `Enquiry@jaderetreats.com`

---

## Tier 2 — production cutover

| Variable | When |
|----------|------|
| Production `MONGODB_URI` | Cutover |
| Production Razorpay keys + webhook secret | Cutover |
| `CRON_SECRET` | Vercel/host cron (`vercel.json` ships daily schedules) |
| `RESEND_API_KEY` + `RESEND_FROM` + `STAFF_NOTIFY_EMAIL` | Before staff rely on alerts |
| `AXIS_ROOMS_API_KEY` + villa mapping | Channel manager push (sandbox first) |
| `AXIS_ROOMS_WEBHOOK_SECRET` | Inbound OTA webhooks (if Axis requires) |
| `INDEXNOW_KEY` | Required in production (no default) |

---

## Axis Rooms — sandbox credentials (received 2026-07-01)

**PMS name to give Axis:** `Jade Host PMS` (env: `AXIS_ROOMS_PMS_NAME`)

Copy into `.env.local` (sandbox only — production keys come after UAT):

| Variable | Sandbox value |
|----------|----------------|
| `AXIS_ROOMS_API_BASE_URL` | `https://sandbox2.axisrooms.com` |
| `AXIS_ROOMS_CHANNEL_ID` | `227` |
| `AXIS_ROOMS_API_KEY` | `227ssaTsivanoS34DasseNav` *(from Rohith Kumar / Axis Rooms email)* |
| `AXIS_ROOMS_PMS_NAME` | `Jade Host PMS` |

**Test property mapping (Axis sandbox hotel):**

| Field | Value |
|-------|--------|
| `hotelId` | `12123` |
| `roomId` | `1` or `2` |
| `ratePlanId` | `1` or `2` |

**Setup commands:**

```bash
# 1. Add Axis vars to .env.local (see table above)
# 2. Map Diamond (or another villa) to sandbox hotel:
node scripts/seed-axis-sandbox.mjs
# Optional second room: node scripts/seed-axis-sandbox.mjs --slug=jade-735 --room=2 --rate=2
# 3. Smoke-test APIs 1, 2, 6, 7:
npm run axis:test
```

**Inbound webhook URL (API 9) — share with Axis after outbound APIs pass:**

```
https://jadehospitainment.com/api/webhooks/axisrooms
```

(Use your Vercel preview URL during staging, e.g. `https://jade-revamp.vercel.app/api/webhooks/axisrooms`.)

**Implementation order (per Axis):** API 1, 2, 6, 7 → then 3, 4 → share API 9 URL → API 15 in **production only** (not testable in sandbox).

Dashboard: `/dashboard/settings/axis-rooms` · Quick Edit → Axis Rooms IDs + **channel mode** per villa.

### Channel mode

| Mode | Behaviour |
|------|-----------|
| `website_only` (default) | Public site only; **no** Axis outbound sync (safe for custom properties) |
| `channel_managed` | Syncs inventory/price to OTAs when property + room IDs are set |

**Important:** Existing mapped villas stay `website_only` until you flip them in Quick Edit. Flip portfolio villas to `channel_managed` only after Axis mapping UAT passes.

### Dashboard features (built)

- Connected OTAs list (API 13)
- Per-OTA pause/resume (API 3/4)
- Verify OTA state (API 5/8)
- Sync log (audit trail)
- Nightly pull reconciliation (API 12) — `GET /api/cron/axisrooms-pull` at **02:00 UTC** in `vercel.json`

### Still needed from Axis

- [ ] Real API 9 JSON samples — one **confirmed** + one **cancelled** booking (parser hardening)
- [ ] OTA integer id map (which id = Airbnb, Booking.com, …) if not in sandbox docs
- [ ] Production API keys after sandbox sign-off

See `jade-axisrooms-status.html` for full API matrix (12 of 15 integrated).

---

## Razorpay — Package B (you provide)

- Test then production keys + `RAZORPAY_WEBHOOK_SECRET`
- Webhook URL: `https://<domain>/api/webhooks/razorpay`

---

## Security checklist (before production)

- [ ] Rotate all seeded staff passwords (do not rely on default `JadeHost2026!`)
- [ ] Set `CRON_SECRET`, `NEXTAUTH_SECRET`, all webhook secrets
- [ ] Set `RESEND_API_KEY` on production (not in repo)
- [ ] Set `INDEXNOW_KEY` (hardcoded fallback removed in production)
- [x] Legacy `/admin` route removed — `/admin` redirects to `/dashboard` via `next.config.mjs`; staff use NextAuth at `/login`
- [ ] Review CSP accepted risk (`unsafe-inline` / Razorpay) in `next.config.mjs`

---

## Property data — `[CONFLICT]` / `[TBD]`

Canonical source: `src/Jade Property Data/Jade_Property_Data.md`

- Seed script **warns** on `[CONFLICT]`/`[TBD]` and seeds only the **confirmed subset**.
- Confirm wedding tier `pricePaise` (GST-exclusive), extra-pax rates, cancellation policy before full seed.

---

## Decisions (locked)

1. **Refunds** — manual staff action on folio until cancellation policy is confirmed.
2. **Manual bookings** — full staff flow (guest, dates, external payment or comp).
3. **Deposit vs full pay** — `/book` defaults to `full`; deposit plan wired server-side.
4. **Notifications** — email only (Resend); no SMS/WhatsApp in scope.

---

## Unchecked gates (need your verification)

### Booking & payments

- [ ] E2E: `/book` → pending booking → Razorpay test pay → webhook → `confirmed`
- [ ] Double-booking: two concurrent POSTs same villa/nights → one `409`
- [ ] Cron soft-expire: pending past 15 min → `expired`
- [ ] NextAuth users seeded (roles: admin, staff, team, seo, dev)

### Axis Rooms (sandbox UAT)

- [ ] `npm run axis:test` passes with sandbox keys in `.env.local`
- [ ] Villa mapped + `channel_managed` → save triggers API 6 price push
- [ ] Axis registers API 9 webhook; inbound test booking appears in dashboard
- [ ] Nightly pull cron authorized with `CRON_SECRET` (or manual `GET /api/cron/axisrooms-pull`)

### Email & CMS

- [ ] Resend domain verified; test enquiry + booking emails received
- [ ] Leads dashboard: status/notes/handled-by workflow
- [ ] Careers dashboard: résumé download works for admin/staff

---

## Cron routes (set `CRON_SECRET`)

All routes expect: `Authorization: Bearer <CRON_SECRET>`

```
GET /api/cron/expire-pending-bookings   # every 5 min — needs Vercel Pro or external cron
GET /api/cron/axisrooms-retry           # every 15 min — needs Vercel Pro or external cron
GET /api/cron/axisrooms-pull            # daily 02:00 UTC — in vercel.json
GET /api/cron/publish-scheduled-blogs   # daily 06:00 UTC — in vercel.json
GET /api/cron/purge-trashed-blogs       # daily 03:00 UTC — in vercel.json
```

**Vercel Hobby:** only **once-per-day** crons are allowed in `vercel.json` (`axisrooms-pull` 02:00 UTC, trash purge 03:00 UTC, scheduled blogs 06:00 UTC). Sub-daily jobs (`expire-pending-bookings` every 5m, `axisrooms-retry` every 15m) need **Vercel Pro** or an external cron (e.g. [cron-job.org](https://cron-job.org)) hitting those URLs with `Authorization: Bearer <CRON_SECRET>`.

## DPDP erasure (ops-only)

```
POST /api/privacy/erasure
Authorization: Bearer <CRON_SECRET>
{ "email": "guest@example.com", "confirm": true }
```

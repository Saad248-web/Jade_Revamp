# NEEDS_FROM_USER — Jade Host PMS

Items the agent **cannot** complete without your input. Build passes with stubs; **Phase 1 E2E gates require Tier 1 credentials**.

---

## Vercel production (required for live dashboard)

After pushing to `main`, set these in **Vercel → jade-revamp → Settings → Environment Variables → Production**:

| Variable | Value |
|----------|--------|
| `MONGODB_URI` | Same Atlas connection string as `.env.local` |
| `NEXTAUTH_SECRET` | Same as local (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://jade-revamp.vercel.app` (or your custom domain) |

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
5. Book → pay → confirm via Razorpay test webhook.

---

## Tier 2 — production cutover

| Variable | When |
|----------|------|
| Production `MONGODB_URI` | Cutover |
| Production Razorpay keys + webhook secret | Cutover |
| `CRON_SECRET` | Vercel/host cron (`vercel.json` ships schedules) |
| `AXIS_ROOMS_API_KEY` + villa mapping | Channel manager push |
| `AXIS_ROOMS_WEBHOOK_SECRET` | Inbound OTA webhooks |
| `INDEXNOW_KEY` | Required in production (no default) |

---

## Axis Rooms — Package A (you provide)

- `AXIS_ROOMS_API_KEY` + sandbox base URL (`AXIS_ROOMS_API_BASE_URL` optional)
- `AXIS_ROOMS_WEBHOOK_SECRET` (or confirm their signing method)
- Property / room / rate mapping per villa (`Villa.axisRooms`)
- Inbound webhook JSON samples (create, modify, cancel)
- Outbound reservation + cancel API docs
- Register webhook: `https://<domain>/api/webhooks/axisrooms`

Dashboard mapping UI: `/dashboard/settings/axis-rooms`

---

## Razorpay — Package B (you provide)

- Test then production keys + `RAZORPAY_WEBHOOK_SECRET`
- Webhook URL: `https://<domain>/api/webhooks/razorpay`

---

## Security checklist (before production)

- [ ] Rotate all seeded staff passwords (do not rely on default `JadeHost2026!`)
- [ ] Set `CRON_SECRET`, `NEXTAUTH_SECRET`, all webhook secrets
- [ ] Set `INDEXNOW_KEY` (hardcoded fallback removed in production)
- [ ] Confirm `ADMIN_PASSWORD` legacy path removed — staff use NextAuth only
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

---

## Unchecked gates (need your verification)

- [ ] E2E: `/book` → pending booking → Razorpay test pay → webhook → `confirmed`
- [ ] Double-booking: two concurrent POSTs same villa/nights → one `409`
- [ ] Cron soft-expire: pending past 15 min → `expired`
- [ ] Axis Rooms push with live API key (stub until credentials)
- [ ] NextAuth users seeded (roles: admin, staff, team, seo, dev)

---

## Cron routes (set `CRON_SECRET`)

```
GET /api/cron/expire-pending-bookings   Authorization: Bearer <CRON_SECRET>
GET /api/cron/axisrooms-retry           Authorization: Bearer <CRON_SECRET>
GET /api/cron/publish-scheduled-blogs   Authorization: Bearer <CRON_SECRET>
GET /api/cron/purge-trashed-blogs       Authorization: Bearer <CRON_SECRET>
```

**Vercel Hobby:** only **once-per-day** crons are allowed in `vercel.json` (scheduled blogs 06:00 UTC, trash purge 03:00 UTC). Sub-daily jobs (`expire-pending-bookings` every 5m, `axisrooms-retry` every 15m) need **Vercel Pro** or an external cron (e.g. [cron-job.org](https://cron-job.org)) POSTing to those URLs with `Authorization: Bearer <CRON_SECRET>`.

## DPDP erasure (ops-only)

```
POST /api/privacy/erasure
Authorization: Bearer <CRON_SECRET>
{ "email": "guest@example.com", "confirm": true }
```

---

## PostgreSQL legacy

`scripts/run-db-migrations.mjs` / `reset-local-db.mjs` remain for reference. **The app uses MongoDB only** (`MONGODB_URI`).

# Jade ReVamp — Security Audit Report

**Date:** 2026-06-22  
**Scope:** Dashboard PMS, public booking APIs, webhooks, auth, channel manager stubs, MongoDB data layer.

This report lists current controls, identified gaps, and recommended fixes. Severity: **Critical** · **High** · **Medium** · **Low**.

---

## Executive summary

The codebase has a solid foundation: NextAuth JWT sessions, role-based API guards, Zod validation on booking payloads, Razorpay webhook idempotency, night-lock concurrency, rate limiting on sensitive routes, and timing-safe webhook secret comparison. **Main risks** are incomplete Axis Rooms inbound processing (OTA bookings not persisted), missing villa lookup by channel-manager IDs, permissive guest caps until recently fixed, seed default passwords, and dashboard mobile UX that can obscure validation errors.

---

## 1. Authentication & authorization

| Control | Status |
|--------|--------|
| NextAuth JWT for dashboard | ✅ Implemented (`middleware.ts`, `requireRole`) |
| RBAC per route (`canAccess`, roles) | ✅ `permissions.ts` + nav config |
| Team role villa scoping | ✅ Calendar API filters by `assignedVillas` |
| Guest PII redaction for team | ✅ `redactBookingForTeam` on calendar |
| Staff cookie / legacy admin | ⚠️ Review `staff-login` route if still enabled |

### Gaps

| ID | Severity | Issue | Recommendation |
|----|----------|-------|----------------|
| AUTH-01 | **High** | Default seed password documented (`JadeHost2026!`) | Force `SEED_USER_PASSWORD` in prod; require password change on first login |
| AUTH-02 | **Medium** | No MFA for admin/owner roles | Add TOTP or SSO before production |
| AUTH-03 | **Medium** | Session expiry / idle timeout not documented in UI | Configure NextAuth `maxAge`; show session warning in dashboard |
| AUTH-04 | **Low** | API permission matrix not exported for audits | Generate machine-readable policy from `permissions.ts` in CI |

---

## 2. Input validation & business rules

| Control | Status |
|--------|--------|
| Zod `createBookingSchema` on public + manual booking | ✅ |
| Plain-object guard on JSON bodies | ✅ `assertPlainObject` |
| Body size limits | ✅ e.g. 48KB on manual booking |
| Villa `stayMaxPax` enforced in pricing | ✅ `computeBookingPricing` |
| Manual booking client validation | ✅ **Fixed this pass** (`formValidation.ts`) |
| Server `guests <= stayMaxPax` on manual booking | ✅ **Fixed this pass** |

### Gaps

| ID | Severity | Issue | Recommendation |
|----|----------|-------|----------------|
| VAL-01 | **Medium** | Public `/api/bookings` may still accept `guests` up to Zod max (500) before villa cap | Add same `stayMaxPax` check in public booking route |
| VAL-02 | **Medium** | Phone format not normalized server-side on manual booking | Trim/normalize phone in API before persist |
| VAL-03 | **Medium** | User management form (`UserFormModal`) — verify email/password rules | Align with Zod + min password entropy |
| VAL-04 | **Low** | Block overlap with existing bookings — relies on store only | Return field-level 409 messages to UI |
| VAL-05 | **Low** | `type="number"` allows leading zeros in some browsers | Client now clamps; server already uses `z.number().int()` |

---

## 3. Channel manager (Axis Rooms)

| Control | Status |
|--------|--------|
| Outbound push/cancel client | ⚠️ Stub — HTTP when key set |
| Inbound webhook auth | ✅ Bearer secret / API key, timing-safe |
| Inbound blocked without API key | ✅ 503 |
| Cron retry with `CRON_SECRET` | ✅ |
| Booking CM fields on schema | ✅ `axisRooms*` fields |
| Webhook idempotency model | ✅ `WebhookEvent` (razorpay); axisrooms inbound does not yet write events |

### Gaps

| ID | Severity | Issue | Recommendation |
|----|----------|-------|----------------|
| CM-01 | **Critical** | Inbound webhook does not create/update/cancel bookings | Implement upsert using `parseInbound` + villa lookup |
| CM-02 | **Critical** | **No villa lookup by `propertyId` / `roomTypeId`** | Add indexed query + seed mapping per villa |
| CM-03 | **High** | No idempotency key on axisrooms inbound | Store `eventId` in `WebhookEvent` before processing |
| CM-04 | **High** | Outbound payload minimal (ids + dates only) | Map full guest/pricing per Axis Rooms certified spec |
| CM-05 | **Medium** | `axisRoomsCancelSynced` defaults `true` on schema | New bookings should default `false` when CM enabled |
| CM-06 | **Low** | `staah/*` paths absent (renamed to axisRooms) | Use `jade-axisrooms-integration-surface.html` as contract doc |

**Reference:** `jade-axisrooms-integration-surface.html` at repo root.

---

## 4. Payments (Razorpay)

| Control | Status |
|--------|--------|
| Webhook signature verification | ✅ (verify in `webhooks/razorpay`) |
| Idempotent `confirmPayment` via `WebhookEvent` | ✅ |
| Unique `processedPaymentId` index | ✅ |

### Gaps

| ID | Severity | Issue | Recommendation |
|----|----------|-------|----------------|
| PAY-01 | **High** | Manual "external" bookings skip payment verification | Require manager role + audit reason code |
| PAY-02 | **Medium** | Refund flow — verify `refund.ts` is wired to dashboard actions | E2E test cancel + partial refund |

---

## 5. API security

| Control | Status |
|--------|--------|
| Middleware RBAC on `/api/dashboard/*` | ✅ |
| Rate limiting (`rateLimit`, persistent buckets) | ✅ on selected routes |
| `Cache-Control: no-store` on auth JSON | ✅ |
| Safe JSON parse / size limits | ✅ |

### Gaps

| ID | Severity | Issue | Recommendation |
|----|----------|-------|----------------|
| API-01 | **Medium** | CSP / HSTS — check `next.config.mjs` for production headers | Add strict CSP; document inline script exceptions |
| API-02 | **Medium** | Cron endpoints only Bearer check — no IP allowlist | Restrict cron invokers (Vercel cron secret + edge) |
| API-03 | **Low** | Dev log routes expose webhook/error payloads | Ensure `dev/*` routes require owner role only |

---

## 6. Data protection & privacy

| Control | Status |
|--------|--------|
| Erasure API (`/api/privacy/erasure`) | ✅ Present |
| Soft delete on bookings | ✅ |
| Audit log on booking mutations | ✅ |

### Gaps

| ID | Severity | Issue | Recommendation |
|----|----------|-------|----------------|
| DATA-01 | **High** | Guest email/phone in logs — audit `console.error` paths | Redact PII in server logs |
| DATA-02 | **Medium** | MongoDB connection string in env — no field-level encryption | Atlas encryption at rest; restrict network access |
| DATA-03 | **Medium** | Backup / retention policy not in repo | Document RPO/RTO and GDPR retention |

---

## 7. Concurrency & integrity

| Control | Status |
|--------|--------|
| Night locks per villa/date | ✅ Unique index |
| Transaction wrapper for booking create | ✅ `withTransaction` |
| Date conflict detection | ✅ overlap checks |

### Gaps

| ID | Severity | Issue | Recommendation |
|----|----------|-------|----------------|
| CONC-01 | **Low** | Axis Rooms inbound + website book race on same nights | Use same lock acquisition in inbound handler |

---

## 8. Frontend / dashboard UX (security-adjacent)

| Control | Status |
|--------|--------|
| Manual booking field errors + ARIA | ✅ **Fixed this pass** |
| Mobile modal (bottom sheet) | ✅ **Improved this pass** |
| Guest max hint per villa | ✅ |

### Gaps

| ID | Severity | Issue | Recommendation |
|----|----------|-------|----------------|
| UX-01 | **Medium** | Calendar grid horizontal scroll on small screens | **Addressed** — sticky villa column, clamped day cells, bordered toolbar, landscape scroll caps, modal full-viewport rules (2026-06 mobile component pass) |
| UX-02 | **Low** | Gold-on-dark contrast on labels | **Addressed** — fluid type tokens, `--dash-text-secondary`/`--dash-text-muted` tuned; `#EFCD62` migrated to `--dash-accent` in dashboard components; focus-visible rings |

---

## 9. Dependencies & supply chain

| ID | Severity | Issue | Recommendation |
|----|----------|-------|----------------|
| DEP-01 | **Medium** | No automated `npm audit` in CI | Add to `npm run gate` |
| DEP-02 | **Low** | Next.js 14 (NEXUS docs target 15) | Plan upgrade after PMS stabilizes |

---

## 10. Testing & monitoring

| Control | Status |
|--------|--------|
| Vitest unit tests | ✅ 104+ tests |
| Playwright E2E | ⚠️ Needs env/credentials per `NEEDS_FROM_USER.md` |
| Sentry optional | ⚠️ `NEXT_PUBLIC_SENTRY_DSN` |

### Gaps

| ID | Severity | Issue | Recommendation |
|----|----------|-------|----------------|
| TEST-01 | **High** | No integration test for axisrooms webhook | Add test with signed payload fixture |
| TEST-02 | **Medium** | Manual booking validation tests added | Extend to public booking API |
| OBS-01 | **Medium** | No alert on `axisRoomsSyncAttempts` threshold | Cron metric + Slack/email |

---

## Priority remediation roadmap

### Phase A — Before OTA go-live (blockers)
1. **CM-01 + CM-02:** Villa lookup by CM IDs + inbound booking upsert/cancel.
2. **CM-03:** Webhook idempotency for axisrooms.
3. **AUTH-01:** Rotate seed passwords; disable default in production.

### Phase B — Hardening (2 weeks)
4. **VAL-01, VAL-02:** Public booking parity with manual validation.
5. **PAY-01:** External payment approval workflow.
6. **API-01, API-02:** Production security headers + cron network policy.

### Phase C — Operational excellence
7. **TEST-01, OBS-01:** Webhook integration tests + sync failure alerts.
8. **UX-01:** Full dashboard mobile responsive audit.

---

## Files changed in this validation/UI pass

- `src/lib/dashboard/formValidation.ts` — shared client validation
- `src/components/dashboard/ManualBookingModal.tsx` — field errors, caps, mobile layout classes
- `src/components/dashboard/BlockFormModal.tsx` — block validation
- `src/app/api/dashboard/bookings/route.ts` — server guest cap + pricing errors
- `src/app/api/dashboard/calendar/route.ts` — expose `stayMaxPax`
- `src/styles/dashboard.css` — mobile modals, field error style
- `jade-axisrooms-integration-surface.html` — integration contract (generated)

---

*This document is a point-in-time audit. Re-run after Axis Rooms certification and before production cutover.*

# Vercel — Axis Rooms preprod environment

Set these on **Vercel → Project → Settings → Environment Variables → Production** (and Preview if needed), then **Redeploy**.

**Source:** Rohith Kumar K email — 22 Sep 2026 (preprod testing window — complete quickly).

| Variable | Value |
|----------|-------|
| `AXIS_ROOMS_API_KEY` | `229pms202Jadehdyjhvad` |
| `AXIS_ROOMS_CHANNEL_ID` | `229` |
| `AXIS_ROOMS_API_BASE_URL` | `https://preprod1.axisrooms.com` |
| `AXIS_ROOMS_PMS_NAME` | `Jade Host PMS` |
| `AXIS_TEST_HOTEL_ID` | `1234` |
| `AXIS_TEST_ROOM_ID` | `1` (also valid: `2`) |
| `AXIS_TEST_RATE_PLAN_ID` | `1` (also valid: `2`) |

**Do not use API 5 on inbound.** Jade webhook path: API 9 auth + local hotel/room validation → save → API 2 inventory ack. Allowed CM APIs: **1, 2, 6, 7, 9**.

Remove obsolete `AXIS_ROOMS_INBOUND_VERIFY_AXIS` from Vercel if present (no longer read).

## CLI (after `npx vercel login`)

```powershell
.\scripts\set-vercel-axis-env.ps1
.\scripts\set-vercel-axis-env.ps1 -Redeploy
```

## Seed production villa mappings

Map at least one villa to Axis hotel `1234` / room `1` / rate `1`, then flip to `channel_managed`.

Vercel reads MongoDB on the VPS (`200.97.161.24`), not local `127.0.0.1`:

```powershell
$env:MONGODB_URI="mongodb://jadeapp_user:Stack%402026@200.97.161.24:27017/jadeapp?authSource=jadeapp"
# Example seed (adjust slug if needed):
node scripts/seed-axis-sandbox.mjs --slug=jade-735 --hotel=1234 --room=1 --rate=1
npm run axis:export-csv
```

## Smoke tests

```bash
npm run axis:test                    # outbound API 1/2/6/7 against preprod1
npm run axis:uat-report              # full API 9 matrix + HTML report
WEBHOOK_BASE_URL=https://jade-revamp.vercel.app npm run axis:inbound-test -- --hotel=1234
```

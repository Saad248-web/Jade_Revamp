# Vercel — Axis Rooms sandbox environment

Set these on **Vercel → Project → Settings → Environment Variables → Production** (and Preview if needed), then **Redeploy**.

| Variable | Value |
|----------|-------|
| `AXIS_ROOMS_API_KEY` | `227As8u5RA3v1CH8o6uBE6YdhassenaVayyy` |
| `AXIS_ROOMS_CHANNEL_ID` | `227` |
| `AXIS_ROOMS_API_BASE_URL` | `https://sandbox2.axisrooms.com` |
| `AXIS_ROOMS_PMS_NAME` | `Jade Host PMS` |

**Do not use API 5 on inbound.** Jade webhook path: API 9 auth + local hotel/room validation → save → API 2 inventory ack. Allowed CM APIs: **1, 2, 6, 7, 9**.

Remove obsolete `AXIS_ROOMS_INBOUND_VERIFY_AXIS` from Vercel if present (no longer read).

## CLI (after `npx vercel login`)

```powershell
.\scripts\set-vercel-axis-env.ps1
.\scripts\set-vercel-axis-env.ps1 -Redeploy
```

## Seed production villa mappings

Vercel reads MongoDB on the VPS (`200.97.161.24`), not local `127.0.0.1`:

```powershell
$env:MONGODB_URI="mongodb://jadeapp_user:Stack%402026@200.97.161.24:27017/jadeapp?authSource=jadeapp"
npm run axis:seed-all
npm run axis:export-csv
```

Property CSV: `docs/jade-axisrooms-properties.csv`

## Smoke tests

```bash
npm run axis:test                    # outbound API 1/2/6/7
npm run axis:uat-report              # full API 9 matrix + HTML report
WEBHOOK_BASE_URL=https://jade-revamp.vercel.app npm run axis:inbound-test -- --hotel=1303
```

# MongoDB migration — Vercel & VPS cutover

**VPS public IP:** `200.97.161.24`  
**Database:** `jadeapp` · **User:** `jadeapp_user` · **authSource:** `jadeapp`

## Status (2026-07-10)

| Step | Status |
|------|--------|
| Atlas → local `jadeapp` | Done |
| Atlas → VPS `jadeapp` (`200.97.161.24`) | Done — 333 docs, counts verified |
| VPS Mongo reachable externally | Done (connection test passed) |
| Vercel `MONGODB_URI` update | **You** — see below |
| Vercel redeploy | **You** — after env change |

---

## Vercel — copy this exactly

**Settings → Environment Variables → `MONGODB_URI`**

Production, Preview, and Development (as needed):

```
mongodb://jadeapp_user:Stack%402026@200.97.161.24:27017/jadeapp?authSource=jadeapp
```

**Do not use** `127.0.0.1` on Vercel — that only works on the VPS itself.

Then: **Deployments → ⋮ → Redeploy** (production).

Smoke-test after redeploy:

- https://jade-revamp.vercel.app — villa pages load
- https://jade-revamp.vercel.app/login — dashboard login
- Dashboard → bookings, media library

---

## Local dev

1. Start local Mongo: `npm run db:start` (keep terminal open)
2. `.env.local` uses `127.0.0.1` — correct for local only
3. `npm run dev`

---

## VPS scripts (SSH)

If Mongo stops accepting external connections, temporarily expose for Vercel:

```bash
sudo bash scripts/vps-mongo-expose.sh
sudo ufw allow 27017/tcp   # if not already open
sudo systemctl restart mongod
```

After Next.js runs on the same VPS, lock down:

```bash
sudo bash scripts/vps-mongo-lockdown.sh
sudo ufw delete allow 27017/tcp   # optional
```

Final production on VPS — `.env` on server:

```
MONGODB_URI=mongodb://jadeapp_user:Stack%402026@127.0.0.1:27017/jadeapp?authSource=jadeapp
```

---

## Re-run migration (if needed)

Direct Atlas → VPS:

```powershell
$env:MONGODB_URI="<atlas-uri>"
$env:MONGODB_URI_TARGET="mongodb://jadeapp_user:Stack%402026@200.97.161.24:27017/jadeapp?authSource=jadeapp"
npm run db:migrate
npm run db:migrate:verify
```

Or from `.env.local` VPS var:

```powershell
$env:MONGODB_URI_TARGET=$env:MONGODB_URI_VPS   # after loading .env.local in script
```

---

## Security

- Rotate `jadeapp_user` password if exposed in chat
- Close public `27017` when Vercel is no longer needed
- Keep Atlas `JadeDB` as backup 1–2 weeks before deleting

## npm scripts

| Script | Action |
|--------|--------|
| `npm run db:start` | Local Mongo |
| `npm run db:migrate` | Copy source → target |
| `npm run db:migrate:verify` | Compare counts |
| `npm run db:migrate:smoke` | Villas/users/bookings check |
| `npm run db:test` | Connection test |

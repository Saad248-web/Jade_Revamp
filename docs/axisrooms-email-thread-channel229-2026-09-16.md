# AxisRooms email thread tracker — Channel 229 / preprod1

| Field | Value |
|-------|--------|
| **Last update** | 2026-09-22 (mapping reset) |
| **From (Jade)** | Saad — reassigned integration owner |
| **Axis** | Rohith Kumar K `<rohith.kumar@axisrooms.com>` |
| **Cc** | enquiry@jaderetreats.com, Tharun, Vanessa, etc. |
| **Attachment** | `jade-axisrooms-channel229-uat-2026-09-16.html` |

## Active credentials (Rohith 22 Sep 2026)

| Item | Value |
|------|--------|
| Base URL | `https://preprod1.axisrooms.com` |
| Channel ID | `229` |
| Access Key | `229pms202Jadehdyjhvad` |
| Hotel ID | `1234` |
| Room / Rate (active UAT) | **`2` / `2`** (Rohith push used these) |
| Mapped villas (UAT only) | `diamond` → 1234 / **room 1 / rate 1** · `jade-735` → 1234 / **room 2 / rate 2** · both `channel_managed` |
| All other villas | Unmapped · `website_only` |

## Jade actions completed (22 Sep)

- [x] `.env.local` + `.env.example` updated to preprod1 / hotel 1234
- [x] Vercel Production env overridden (all AXIS_* + test IDs) + redeploy
- [x] Cleared **all** old Axis villa mappings on production Mongo
- [x] Mapped **only** `diamond` → `1234` / room `2` / rate `2` / `channel_managed`
- [x] Vercel `AXIS_TEST_ROOM_ID` + `AXIS_TEST_RATE_PLAN_ID` set to `2`
- [ ] Ask Rohith to **re-push** booking `ARK0062LQ8Y8` (or new test)
- [ ] Confirm Success on webhook + booking in dashboard
- [ ] Then §3.1/3.2 outbound smoke after channel fully live

## Known failure (before mapping fix)

Rohith push log: `Unknown hotelId/roomId: 1234/2` — fixed by UAT-only mapping above.

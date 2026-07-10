# Email to Rohit — Axis Rooms Sandbox Onboarding

| | |
|---|---|
| **To** | Rohit Kumar K \<rohit@axisrooms.com\> |
| **Cc** | saad@helloerrors.in, Enquiry@jaderetreats.com |
| **Subject** | Jade Host PMS — Sandbox Registration Details (Property IDs + API 9 Webhook) |
| **Attachment** | `jade-axisrooms-properties.csv` |

---

Hi Rohit,

Please find Jade Host PMS sandbox registration details below.

## 1. PMS Details

| Field | Value |
|-------|-------|
| PMS Name | Jade Host PMS |
| Sandbox Base URL | https://sandbox2.axisrooms.com |
| channelId / pmsId | 227 |
| accessKey | 227As8u5RA3v1CH8o6uBE6YdhassenaVayyy |

## 2. API 9 Webhook

| Field | Value |
|-------|-------|
| Webhook URL | https://jade-revamp.vercel.app/api/webhooks/axisrooms |
| Method | POST |
| Authentication | `accessKey` in JSON body |

## 3. Property IDs (16 Villas)

| Field | Value |
|-------|-------|
| Model | Whole-villa — 1 property = 1 room |
| noOfRooms | 1 (all properties) |
| roomId | 1 (all properties) |
| ratePlanId | 1 (all properties) |
| ratePlanName | Best Available Rate (all properties) |
| hotelId range | 1301–1316 |
| UAT sample | hotelId **1303** · dates **2026-08-03 → 2026-08-04** |

| # | hotelId | Property | roomId | ratePlanId | ratePlanName |
|---|---------|----------|--------|------------|--------------|
| 1 | 1301 | Diamond Pavilion by Jade | 1 | 1 | Best Available Rate |
| 2 | 1302 | Dome Villas by Jade — Blue Dome | 1 | 1 | Best Available Rate |
| 3 | 1303 | Dome Villas by Jade — Red Dome | 1 | 1 | Best Available Rate |
| 4 | 1304 | Dome Villas by Jade — Yellow Dome | 1 | 1 | Best Available Rate |
| 5 | 1305 | Emerald by Jade | 1 | 1 | Best Available Rate |
| 6 | 1306 | Haven by Jade | 1 | 1 | Best Available Rate |
| 7 | 1307 | Jade 735 by Jade | 1 | 1 | Best Available Rate |
| 8 | 1308 | Lemon Tree by Jade | 1 | 1 | Best Available Rate |
| 9 | 1309 | Lounge Fly by Jade | 1 | 1 | Best Available Rate |
| 10 | 1310 | Magnolia by Jade | 1 | 1 | Best Available Rate |
| 11 | 1311 | Palatio by Jade | 1 | 1 | Best Available Rate |
| 12 | 1312 | Retreat on the Ridge by Jade | 1 | 1 | Best Available Rate |
| 13 | 1313 | Royalty by Jade | 1 | 1 | Best Available Rate |
| 14 | 1314 | Tranquil Woods by Jade | 1 | 1 | Best Available Rate |
| 15 | 1315 | Vannani by Jade | 1 | 1 | Best Available Rate |
| 16 | 1316 | Wonderland by Jade | 1 | 1 | Best Available Rate |

## 4. Inventory Sync

| Event | Jade action | Axis API |
|-------|-------------|----------|
| OTA booking (API 9) | Save booking + block nights | API 2 · `availability: 0` |
| OTA modify (API 9) | Update dates | API 2 · open old + close new |
| OTA cancel (API 9) | Cancel + release nights | API 2 · `availability: 1` |
| Direct / website / manual booking | Confirm in PMS | API 1 · `free: 0` per night |
| Staff cancel / date change | Update calendar | API 1 · open / modify |

Invalid `hotelId`, `roomId`, or `ratePlanId` in API 9 payloads return **HTTP 422** — no booking saved, no inventory push.

## 5. Action Required from Axis

| # | Action |
|---|--------|
| 1 | Register attached property CSV and webhook URL on sandbox |
| 2 | Activate accessKey `227As8u5RA3v1CH8o6uBE6YdhassenaVayyy` for outbound APIs (API 1/2/5) |
| 3 | Confirm API 2 inventory ack appears in logs after API 9 push |

Once the key is active, we can run joint UAT with **hotelId 1303**, **roomId 1**, **ratePlanId 1**.

---

Best regards,  
Mohammed Saad  
Jade Host PMS · saad@helloerrors.in

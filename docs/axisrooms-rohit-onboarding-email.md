# Email to Rohit — Axis Rooms Sandbox Onboarding

**To:** Rohit Kumar K \<rohit@axisrooms.com\>  
**Cc:** saad@helloerrors.in, Enquiry@jaderetreats.com  
**Subject:** Jade Host PMS — Sandbox Registration Details (Property IDs + API 9 Webhook)

---

Hi Rohit,

Please find Jade Host PMS sandbox registration details below.

**PMS name:** Jade Host PMS  
**Sandbox base URL:** `https://sandbox2.axisrooms.com`  
**channelId / pmsId:** `227`

**API 9 webhook (inbound bookings):**  
`https://jade-revamp.vercel.app/api/webhooks/axisrooms`  
Method: `POST` · Auth: `accessKey` in JSON body

**Finalized accessKey:**  
`227As8u5RA3v1CH8o6uBE6YdhassenaVayyy`

**Property IDs (whole-villa model — 1 room per property, `noOfRooms: 1`):**  
Attached: `jade-axisrooms-properties.csv` (16 villas, hotelId 1301–1316).

| hotelId | Property | roomId | ratePlanId | ratePlanName |
|---------|----------|--------|------------|--------------|
| 1301 | Diamond Pavilion by Jade | 1 | 1 | Best Available Rate |
| 1302 | Dome Villas by Jade — Blue Dome | 1 | 1 | Best Available Rate |
| 1303 | Dome Villas by Jade — Red Dome | 1 | 1 | Best Available Rate |
| 1304 | Dome Villas by Jade — Yellow Dome | 1 | 1 | Best Available Rate |
| 1305 | Emerald by Jade | 1 | 1 | Best Available Rate |
| 1306 | Haven by Jade | 1 | 1 | Best Available Rate |
| 1307 | Jade 735 by Jade | 1 | 1 | Best Available Rate |
| 1308 | Lemon Tree by Jade | 1 | 1 | Best Available Rate |
| 1309 | Lounge Fly by Jade | 1 | 1 | Best Available Rate |
| 1310 | Magnolia by Jade | 1 | 1 | Best Available Rate |
| 1311 | Palatio by Jade | 1 | 1 | Best Available Rate |
| 1312 | Retreat on the Ridge by Jade | 1 | 1 | Best Available Rate |
| 1313 | Royalty by Jade | 1 | 1 | Best Available Rate |
| 1314 | Tranquil Woods by Jade | 1 | 1 | Best Available Rate |
| 1315 | Vannani by Jade | 1 | 1 | Best Available Rate |
| 1316 | Wonderland by Jade | 1 | 1 | Best Available Rate |

*Note: IDs are assigned alphabetically by villa name. Your test curl used `hotelId: 1303` → **Red Dome**. UAT sample dates: 2026-08-03 → 2026-08-04.*

**Inventory sync confirmation:**

| Event | Jade action | Axis API |
|-------|-------------|----------|
| OTA booking (API 9 inbound) | Save booking + block nights | **API 2** `availability: 0` on stay dates |
| OTA modify (API 9) | Update dates | **API 2** open old + close new |
| OTA cancel (API 9) | Cancel + release nights | **API 2** `availability: 1` |
| Direct / website / manual booking | Confirm in PMS | **API 1** `free: 0` per night |
| Staff cancel / date change | Update calendar | **API 1** open / modify |

Every API 9 request is **critically validated** against our registered property table before any booking is saved or inventory is pushed. Invalid `hotelId`, `roomId`, or `ratePlanId` returns HTTP **422** with no side effects. Only after validation succeeds does Jade save the booking and call API 2.

**Action needed from Axis:**

1. Register the attached property CSV and webhook URL on sandbox.
2. **Activate** `accessKey` `227As8u5RA3v1CH8o6uBE6YdhassenaVayyy` for outbound APIs (API 1/2/5) — we currently receive `401 Authorization Failed.Invalid accessKey` on sandbox.
3. Confirm API 2 inventory ack appears in your logs after API 9 push.

Once the key is active, we can run a joint test with `hotelId 1303`, `roomId 1`, `ratePlanId 1`, dates 2026-08-03 → 2026-08-04.

Best regards,  
Mohammed Saad  
Jade Host PMS · saad@helloerrors.in

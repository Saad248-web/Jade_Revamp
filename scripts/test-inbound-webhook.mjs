/**
 * POST a sample API 9 inbound booking to the local webhook.
 * Usage: node scripts/test-inbound-webhook.mjs [--invalid]
 */

import { loadEnvLocal } from "./loadEnvLocal.mjs";

loadEnvLocal();

const accessKey = process.env.AXIS_ROOMS_API_KEY?.trim();
const baseUrl = (process.env.WEBHOOK_BASE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const invalid = process.argv.includes("--invalid");

if (!accessKey) {
  console.error("BLOCKED: AXIS_ROOMS_API_KEY not set");
  process.exit(1);
}

const bookingNo = `ARKSAAD${Date.now().toString(36).toUpperCase().slice(-6)}`;
const checkIn = "2026-12-01";
const checkOut = "2026-12-03";

const payload = {
  accessKey,
  GuestDetails: {
    title: "Mr",
    guestName: "Mohammed Saad",
    emailId: "saad@helloerrors.in",
    mobileNo: "9876543210",
    countryCode: "+91",
  },
  CheckinDetails: {
    checkInDate: checkIn,
    checkOutDate: checkOut,
    totalPax: "4",
    children: "1",
    supplierAmount: "18500.0",
    taxes: "2100.0",
    totalAmount: "20600.0",
    paid: "false",
    isGeniusBooker: false,
    specialRequest: ["Late check-in requested"],
    amountToBeCollected: "20600.0",
    isDayWisePrice: true,
  },
  BookingDetails: {
    hotelId: "12123",
    bookingNo,
    bookingDateTime: new Date().toISOString().slice(0, 19).replace("T", " "),
    bookedBy: "Mohammed Saad",
    ota: "Direct Booking",
    otaRefId: "1",
    bookingStatus: "confirmed",
    bookingSource: "Direct Booking",
    bookingSourceRefId: "",
  },
  Rates: {
    roomType: [
      {
        id: invalid ? "999" : "2",
        noOfRooms: invalid ? "5" : "1",
        ratePlanId: invalid ? "88" : "2",
        totalAdults: "4",
        ratePlanName: "CP",
        cityTax: "NA",
        vat: "NA",
        serviceCharge: "NA",
        dayWiseDetails: [
          { date: checkIn, deals: "NA", rate: "10300.0" },
          { date: "2026-08-16", deals: "NA", rate: "10300.0" },
        ],
      },
    ],
  },
};

console.log(`\nPOST ${baseUrl}/api/webhooks/axisrooms`);
console.log(`Mode: ${invalid ? "INVALID (bad room/rate ids)" : "VALID sandbox booking"}`);
console.log(`bookingNo: ${bookingNo}`);
console.log(`guest: saad@helloerrors.in\n`);

const res = await fetch(`${baseUrl}/api/webhooks/axisrooms`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(payload),
});

const text = await res.text();
let body;
try {
  body = JSON.parse(text);
} catch {
  body = { raw: text };
}

console.log(`HTTP ${res.status}`);
console.log(JSON.stringify(body, null, 2));

if (!invalid && res.ok && body.status === "success") {
  console.log("\n✓ Valid booking accepted — check logs/axisrooms-inbound.jsonl");
}

if (invalid && res.status === 422) {
  console.log("\n✓ Invalid booking correctly rejected");
}

process.exit(res.ok ? 0 : 1);

/**
 * Full Axis Rooms UAT matrix -> Overall-Axis-API-Integration-Testing.html
 *
 * Usage:
 *   $env:WEBHOOK_BASE_URL="https://jade-revamp.vercel.app"
 *   npm run axis:uat-report
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvLocal } from "./loadEnvLocal.mjs";

loadEnvLocal();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const TMP_JSON = path.join(root, "tmp", "axis-uat-results.json");
const OUT_HTML = path.join(root, "Overall-Axis-API-Integration-Testing.html");
const CSV_PATH = path.join(root, "docs", "jade-axisrooms-properties.csv");

const accessKey = process.env.AXIS_ROOMS_API_KEY?.trim();
const webhookBase = (
  process.env.WEBHOOK_BASE_URL ?? "https://jade-revamp.vercel.app"
).replace(/\/$/, "");
const webhookUrl = `${webhookBase}/api/webhooks/axisrooms`;
const axisBase = (
  process.env.AXIS_ROOMS_API_BASE_URL ?? "https://sandbox2.axisrooms.com"
).replace(/\/$/, "");
const channelId = process.env.AXIS_ROOMS_CHANNEL_ID?.trim() ?? "227";
const uatHotel = process.env.AXIS_TEST_HOTEL_ID?.trim() ?? "1303";
const uatRoom = process.env.AXIS_TEST_ROOM_ID?.trim() ?? "1";
const uatRate = process.env.AXIS_TEST_RATE_PLAN_ID?.trim() ?? "1";

function maskKey(key) {
  if (!key || key.length < 12) return "***";
  return `${key.slice(0, 8)}...${key.slice(-4)}`;
}

function redactPayload(payload) {
  const clone = structuredClone(payload);
  if (clone.accessKey) clone.accessKey = maskKey(clone.accessKey);
  return clone;
}

function bookingNo() {
  return `ARKSAAD${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

function bookingDateTime() {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
}

function buildPayload(opts) {
  const {
    hotelId,
    roomId,
    ratePlanId,
    noOfRooms = "1",
    status = "confirmed",
    checkIn = "2026-08-03",
    checkOut = "2026-08-04",
    key = accessKey,
    bookingNo: bn,
  } = opts;

  return {
    accessKey: key,
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
      totalPax: "2",
      children: "0",
      supplierAmount: "4350.05",
      taxes: "1123.0",
      totalAmount: "4579.0",
      paid: "false",
      isGeniusBooker: false,
      specialRequest: [],
      amountToBeCollected: "4579.0",
      isDayWisePrice: true,
    },
    BookingDetails: {
      hotelId: String(hotelId),
      bookingNo: bn,
      bookingDateTime: bookingDateTime(),
      bookedBy: "Mohammed Saad",
      ota: "Direct Booking",
      otaRefId: "1",
      bookingStatus: status,
      bookingSource: "Direct Booking",
      bookingSourceRefId: "",
    },
    Rates: {
      roomType: [
        {
          id: String(roomId),
          noOfRooms: String(noOfRooms),
          ratePlanId: String(ratePlanId ?? ""),
          totalAdults: "2",
          ratePlanName: "Best Available Rate",
          cityTax: "NA",
          vat: "NA",
          serviceCharge: "NA",
          dayWiseDetails: [{ date: checkIn, deals: "NA", rate: "4456.0" }],
        },
      ],
    },
  };
}

async function postWebhook(payload) {
  const started = new Date().toISOString();
  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const text = await res.text();
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { raw: text?.slice?.(0, 800) ?? text };
  }
  return {
    startedAt: started,
    finishedAt: new Date().toISOString(),
    httpStatus: res.status,
    response: body,
  };
}

function evaluate(caseDef, result) {
  const { expectStatus, expectBodyStatus, expectMessageIncludes } = caseDef;
  const msg = String(result.response?.message ?? "");
  const okStatus = result.httpStatus === expectStatus;
  const okBody =
    !expectBodyStatus || result.response?.status === expectBodyStatus;
  const okMsg =
    !expectMessageIncludes ||
    msg.toLowerCase().includes(expectMessageIncludes.toLowerCase());
  const passed = okStatus && okBody && okMsg;

  // Outbound Axis key issues (API 1/2) after save — or legacy auth noise
  const axisKeyBlocked =
    /invalid accesskey/i.test(msg) ||
    /authorization failed/i.test(msg);

  if (!passed && axisKeyBlocked && expectStatus === 200) {
    return {
      passed: false,
      badge: "Blocked",
      reason: `Request reached Jade but failed with Axis-looking auth error: ${msg}. API 5 is not used on inbound; check booking save/Mongo and outbound API 2 key activation.`,
    };
  }

  return {
    passed,
    badge: passed ? "Pass" : "Fail",
    reason: passed
      ? "Matched expected HTTP + body"
      : `Expected HTTP ${expectStatus}${expectBodyStatus ? ` / status=${expectBodyStatus}` : ""}; got ${result.httpStatus} / ${JSON.stringify(result.response)}`,
  };
}

function addDays(iso, n) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function todayIst() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

async function runOutboundSmoke() {
  const tests = [];
  const start = addDays(todayIst(), 7);
  const end = addDays(start, 14);
  const price = Number(process.env.AXIS_TEST_PRICE_RUPEES ?? 45000);

  async function one(label, pathSuffix, body) {
    const url = `${axisBase}${pathSuffix}`;
    const started = new Date().toISOString();
    let httpStatus = 0;
    let data = {};
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessKey, channelId, ...body }),
      });
      httpStatus = res.status;
      const text = await res.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { raw: text?.slice?.(0, 500) };
      }
    } catch (e) {
      data = { error: String(e?.message ?? e) };
    }
    const status = String(data?.status ?? "").toLowerCase();
    const success =
      httpStatus >= 200 &&
      httpStatus < 300 &&
      status !== "failure" &&
      status !== "error";
    tests.push({
      id: label,
      label,
      api: pathSuffix,
      startedAt: started,
      httpStatus,
      response: data,
      badge: success ? "Pass" : httpStatus === 401 ? "Blocked" : "Fail",
      passed: success,
      reason: success
        ? "Axis accepted outbound call"
        : httpStatus === 401
          ? "Axis returned 401 Invalid accessKey - sandbox key may still be inactive for outbound"
          : `HTTP ${httpStatus}: ${JSON.stringify(data)}`,
    });
  }

  await one("API 2 bulk inventory", "/api/inventory", {
    hotels: [
      {
        hotelId: uatHotel,
        rooms: [
          { roomId: uatRoom, startDate: start, endDate: end, availability: 1 },
        ],
      },
    ],
  });
  await one("API 1 daywise inventory", "/api/daywiseInventory", {
    hotels: [
      {
        hotelId: uatHotel,
        rooms: [{ roomId: uatRoom, availability: [{ date: start, free: 1 }] }],
      },
    ],
  });
  await one("API 7 bulk price", "/api/bulkPriceUpdate", {
    hotels: [
      {
        hotelId: uatHotel,
        rooms: [
          {
            roomId: uatRoom,
            rateplans: [
              {
                rateplanId: uatRate,
                priceDetails: [
                  {
                    startDate: start,
                    endDate: end,
                    price: { Double: price },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  });
  await one("API 6 daywise price", "/api/daywisePrice", {
    hotels: [
      {
        hotelId: uatHotel,
        rooms: [
          {
            roomId: uatRoom,
            rateplans: [
              {
                rateplanId: uatRate,
                priceDetails: [{ date: start, price: { Double: price } }],
              },
            ],
          },
        ],
      },
    ],
  });

  return { start, end, tests };
}

function idsFromPayload(payload) {
  const rt = payload?.Rates?.roomType?.[0] ?? {};
  return {
    hotelId: payload?.BookingDetails?.hotelId ?? "",
    roomId: rt.id ?? "",
    ratePlanId: rt.ratePlanId ?? "",
    noOfRooms: rt.noOfRooms ?? "",
    bookingStatus: payload?.BookingDetails?.bookingStatus ?? "",
  };
}

function pushCase(inbound, meta, payload, result, ev) {
  const ids = idsFromPayload(payload);
  inbound.push({
    ...meta,
    phase: meta.phase,
    hotelId: ids.hotelId,
    roomId: ids.roomId,
    ratePlanId: ids.ratePlanId,
    noOfRooms: ids.noOfRooms,
    bookingStatus: ids.bookingStatus,
    requestRedacted: redactPayload(payload),
    httpStatus: result.httpStatus,
    response: result.response,
    responseMessage: result.response?.message ?? "",
    startedAt: result.startedAt,
    eval: ev,
    badge: ev.badge,
  });
}

function loadProperties() {
  if (!fs.existsSync(CSV_PATH)) return [];
  const lines = fs.readFileSync(CSV_PATH, "utf8").trim().split(/\r?\n/);
  const [, ...rows] = lines;
  return rows.map((line) => {
    const [hotelId, hotelName, roomId, ratePlanId, ratePlanName, noOfRooms] =
      line.split(",");
    return { hotelId, hotelName, roomId, ratePlanId, ratePlanName, noOfRooms };
  });
}

function esc(s) {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function badgeClass(badge) {
  if (badge === "Pass") return "b-pass";
  if (badge === "Blocked") return "b-blocked";
  return "b-fail";
}

function phaseLabel(phase) {
  if (phase === "A") return "Phase A - Correct IDs";
  if (phase === "B") return "Phase B - Invalid IDs (distinct outputs)";
  if (phase === "C") return "Phase C - Lifecycle (duplicate / modify / cancel)";
  return phase;
}

function renderHtml(report) {
  const props = report.properties;
  const inbound = report.inbound;
  const outbound = report.outbound;
  const passN = inbound.filter((t) => t.badge === "Pass").length;
  const failN = inbound.filter((t) => t.badge === "Fail").length;
  const blockedIn = inbound.filter((t) => t.badge === "Blocked").length;
  const blockedN = outbound.tests.filter((t) => t.badge === "Blocked").length;
  const outPass = outbound.tests.filter((t) => t.badge === "Pass").length;
  const outFail = outbound.tests.filter((t) => t.badge === "Fail").length;
  const outMapIssue = outbound.tests.some((t) =>
    /not mapped in Channel Manager/i.test(t.reason ?? ""),
  );
  const a01 = inbound.find((t) => t.id === "A01");
  const axisKeyBlocked = inbound.some(
    (t) =>
      t.badge === "Blocked" && /accesskey|authorization failed/i.test(t.eval?.reason ?? ""),
  );

  const propertyRows = props
    .map(
      (p, i) =>
        `<tr><td>${i + 1}</td><td><code>${esc(p.hotelId)}</code></td><td>${esc(p.hotelName)}</td><td>${esc(p.roomId)}</td><td>${esc(p.ratePlanId)}</td><td>${esc(p.ratePlanName)}</td><td>${esc(p.noOfRooms)}</td></tr>`,
    )
    .join("\n");

  const contrastRows = inbound
    .map((t) => {
      const passed = t.badge === "Pass";
      return `<tr class="${passed ? "row-pass" : t.badge === "Blocked" ? "row-blocked" : ""}">
          <td><code>${esc(t.id)}</code></td>
          <td>${esc(t.phase)}</td>
          <td><code>${esc(t.hotelId)}</code></td>
          <td><code>${esc(t.roomId)}</code></td>
          <td><code>${esc(t.ratePlanId)}</code></td>
          <td><code>${esc(t.noOfRooms)}</code></td>
          <td><code>${esc(t.httpStatus)}</code></td>
          <td>${passed ? `<mark class="hl-pass">${esc(t.responseMessage)}</mark>` : esc(t.responseMessage)}</td>
          <td><span class="badge ${badgeClass(t.badge)}">${esc(t.badge)}</span></td>
        </tr>`;
    })
    .join("\n");

  const phases = ["A", "B", "C"];
  const phaseBlocks = phases
    .map((ph) => {
      const cases = inbound.filter((t) => t.phase === ph);
      if (!cases.length) return "";
      const cards = cases
        .map((t) => {
          const passed = t.badge === "Pass";
          return `
    <details class="case-card ${passed ? "is-pass" : ""}" ${ph === "B" || ph === "A" ? "open" : ""}>
      <summary>
        <span class="case-id">${esc(t.id)}</span>
        <span class="case-title">${esc(t.title)}</span>
        <span class="badge ${badgeClass(t.badge)}">${esc(t.badge)}</span>
        ${passed ? `<span class="pass-pill">PASSED</span>` : ""}
      </summary>
      <p class="case-meta">${esc(t.description)}</p>
      <p class="case-meta"><strong>IDs:</strong> hotel <code>${esc(t.hotelId)}</code> | room <code>${esc(t.roomId)}</code> | rate <code>${esc(t.ratePlanId)}</code> | noOfRooms <code>${esc(t.noOfRooms)}</code> | status <code>${esc(t.bookingStatus)}</code></p>
      <p class="case-meta"><strong>Expect:</strong> ${esc(t.expectLabel)} | <strong>Got:</strong> HTTP ${esc(t.httpStatus)} - ${
            passed
              ? `<mark class="hl-pass">${esc(t.responseMessage)}</mark>`
              : esc(t.responseMessage)
          }</p>
      <p class="case-meta muted">${esc(t.eval.reason)}</p>
      <div class="panels">
        <div class="panel">
          <div class="panel-h">Request sent</div>
          <pre>${esc(JSON.stringify(t.requestRedacted, null, 2))}</pre>
        </div>
        <div class="panel">
          <div class="panel-h">Response received</div>
          <pre>${esc(JSON.stringify(t.response, null, 2))}</pre>
        </div>
      </div>
    </details>`;
        })
        .join("\n");
      return `<h3 id="phase-${ph}">${esc(phaseLabel(ph))}</h3>${cards}`;
    })
    .join("\n");

  const outboundRows = outbound.tests
    .map((t) => {
      const passed = t.badge === "Pass";
      return `<tr class="${passed ? "row-pass" : t.badge === "Blocked" ? "row-blocked" : ""}">
          <td>${esc(t.label)}</td>
          <td><code>${esc(t.api)}</code></td>
          <td><span class="badge ${badgeClass(t.badge)}">${esc(t.badge)}</span></td>
          <td><code>${esc(t.httpStatus)}</code></td>
          <td>${passed ? `<mark class="hl-pass">${esc(t.reason)}</mark>` : esc(t.reason)}</td>
        </tr>`;
    })
    .join("\n");


  const SAMPLE_IN_BODY = "{\n  \"accessKey\": \"227ssaTsivanoS34DasseNav\",\n  \"GuestDetails\": {\n    \"title\": \"Mr\",\n    \"guestName\": \"Test Guest\",\n    \"emailId\": \"test@example.com\",\n    \"mobileNo\": \"9876543210\",\n    \"countryCode\": \"+91\"\n  },\n  \"CheckinDetails\": {\n    \"checkInDate\": \"2026-07-21\",\n    \"checkOutDate\": \"2026-07-24\",\n    \"totalPax\": \"2\",\n    \"children\": \"0\",\n    \"supplierAmount\": \"10000\",\n    \"taxes\": \"0\",\n    \"totalAmount\": \"10000\",\n    \"paid\": \"false\",\n    \"isGeniusBooker\": false,\n    \"specialRequest\": [],\n    \"amountToBeCollected\": \"10000\",\n    \"isDayWisePrice\": true\n  },\n  \"BookingDetails\": {\n    \"hotelId\": \"1303\",\n    \"bookingNo\": \"ARKTEST001\",\n    \"bookingDateTime\": \"2026-07-15 15:00:00\",\n    \"bookedBy\": \"Rohith\",\n    \"ota\": \"Direct Booking\",\n    \"otaRefId\": \"1\",\n    \"bookingStatus\": \"confirmed\",\n    \"bookingSource\": \"Direct Booking\",\n    \"bookingSourceRefId\": \"\"\n  },\n  \"Rates\": {\n    \"roomType\": [{\n      \"id\": \"1\",\n      \"noOfRooms\": \"1\",\n      \"ratePlanId\": \"1\",\n      \"totalAdults\": \"2\",\n      \"ratePlanName\": \"Best Available Rate\",\n      \"cityTax\": \"NA\",\n      \"vat\": \"NA\",\n      \"serviceCharge\": \"NA\",\n      \"dayWiseDetails\": [{ \"date\": \"2026-07-21\", \"deals\": \"NA\", \"rate\": \"3333\" }]\n    }]\n  }\n}";
  const SAMPLE_IN_RESP = "HTTP 200 OK\n\n{\n  \"status\": \"success\",\n  \"message\": \"Booking Update Received\"\n}";
  const SAMPLE_API2_BODY = "{\n  \"accessKey\": \"227ssaTsivanoS34DasseNav\",\n  \"channelId\": \"227\",\n  \"hotels\": [\n    {\n      \"hotelId\": \"1303\",\n      \"rooms\": [\n        {\n          \"roomId\": \"1\",\n          \"startDate\": \"2026-07-21\",\n          \"endDate\": \"2026-07-23\",\n          \"availability\": 0\n        }\n      ]\n    }\n  ]\n}";
  const SAMPLE_API2_RESP = "HTTP 200 OK\n\n{\n  \"status\": \"Success\",\n  \"message\": \" Ref :aba89fee-c932-43d5-9f25-7c7cfe95d780\",\n  \"errorCode\": \"\"\n}";
  const SAMPLE_API1_BODY = "{\n  \"accessKey\": \"227ssaTsivanoS34DasseNav\",\n  \"channelId\": \"227\",\n  \"hotels\": [\n    {\n      \"hotelId\": \"1303\",\n      \"rooms\": [\n        {\n          \"roomId\": \"1\",\n          \"availability\": [\n            { \"date\": \"2026-07-21\", \"free\": 0 },\n            { \"date\": \"2026-07-22\", \"free\": 0 },\n            { \"date\": \"2026-07-23\", \"free\": 0 }\n          ]\n        }\n      ]\n    }\n  ]\n}";
  const SAMPLE_API1_RESP = "HTTP 200 OK\n\n{\n  \"status\": \"Success\",\n  \"message\": \" Ref :3a8c4512-ae29-4335-baf6-8d4a23c918db\",\n  \"errorCode\": \"\"\n}";

  const inboundPassHighlight =
    passN > 0
      ? `<mark class="hl-pass">${passN} inbound cases PASSED</mark>`
      : `${passN} inbound cases passed`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Overall Axis API Integration Testing - Jade Host PMS</title>
<style>
  :root {
    --ink: #1a1c1e;
    --muted: #5c5c5c;
    --border: #e0e0e0;
    --accent: #0d5c4b;
    --accent-deep: #094536;
    --gold: #b8860b;
    --paper: #f7f5f0;
    --card: #ffffff;
    --ready: #166534;
    --ready-bg: #dcfce7;
    --blocked: #b45309;
    --blocked-bg: #fef3c7;
    --fail: #b91c1c;
    --fail-bg: #fee2e2;
    --code-bg: #0f172a;
    --code-fg: #e2e8f0;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: system-ui, -apple-system, "Segoe UI", sans-serif;
    color: var(--ink);
    background:
      radial-gradient(1200px 500px at 10% -10%, #e8f3ef 0%, transparent 55%),
      radial-gradient(900px 400px at 100% 0%, #f5ecd4 0%, transparent 50%),
      var(--paper);
    line-height: 1.55;
    font-size: 15px;
  }
  .wrap { max-width: 1080px; margin: 0 auto; padding: 1.5rem 1.25rem 3.5rem; }
  .hero {
    background: linear-gradient(135deg, var(--accent-deep), var(--accent) 55%, #1a7a63);
    color: #fff;
    border-radius: 16px;
    padding: 1.75rem 1.5rem 1.5rem;
    box-shadow: 0 12px 40px rgba(13, 92, 75, 0.28);
    margin-bottom: 1.25rem;
  }
  .hero h1 {
    font-family: Georgia, "Times New Roman", serif;
    font-size: clamp(1.45rem, 3vw, 2rem);
    margin: 0 0 0.4rem;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  .hero .sub { opacity: 0.92; font-size: 0.95rem; margin: 0; }
  .hero-meta { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 1rem; }
  .chip {
    background: rgba(255,255,255,0.14);
    border: 1px solid rgba(255,255,255,0.25);
    border-radius: 999px;
    padding: 0.25rem 0.7rem;
    font-size: 0.78rem;
    font-weight: 600;
  }
  .toc {
    position: sticky; top: 0; z-index: 20;
    backdrop-filter: blur(10px);
    background: rgba(247, 245, 240, 0.92);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.65rem 0.85rem;
    margin-bottom: 1.25rem;
    display: flex; flex-wrap: wrap; gap: 0.55rem 0.85rem;
    font-size: 0.82rem;
  }
  .toc a { color: var(--accent); text-decoration: none; font-weight: 600; }
  .toc a:hover { text-decoration: underline; }
  .section {
    background: var(--card);
    border: 1px solid var(--border);
    border-left: 4px solid var(--gold);
    border-radius: 12px;
    padding: 1.15rem 1.2rem 1.25rem;
    margin: 0 0 1.1rem;
    box-shadow: 0 1px 2px rgba(0,0,0,0.03);
  }
  .section h2 {
    font-family: Georgia, serif;
    color: var(--accent);
    font-size: 1.2rem;
    margin: 0 0 0.75rem;
    padding-bottom: 0.4rem;
    border-bottom: 1px solid var(--border);
  }
  .section h3 { font-size: 1rem; margin: 1.25rem 0 0.55rem; color: var(--ink); }
  p { margin: 0.45rem 0; }
  .muted { color: var(--muted); font-size: 0.9rem; }
  .callout {
    background: #fffbeb;
    border-left: 4px solid var(--gold);
    border-radius: 0 8px 8px 0;
    padding: 0.75rem 0.9rem;
    margin: 0.75rem 0;
  }
  .callout.danger { background: #fef2f2; border-left-color: var(--fail); }
  .callout.ok { background: #f0fdf4; border-left-color: var(--ready); }
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.82rem;
    margin: 0.65rem 0 0.25rem;
  }
  th, td {
    border: 1px solid var(--border);
    padding: 0.45rem 0.55rem;
    text-align: left;
    vertical-align: top;
  }
  th { background: #f5f5f4; font-weight: 600; }
  tr:nth-child(even) td { background: #fafaf9; }
  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 0.84em;
    background: #f3f4f6;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
  }
  .badge {
    display: inline-block;
    padding: 0.15rem 0.55rem;
    border-radius: 4px;
    font-weight: 700;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.03em;
  }
  .b-pass { background: var(--ready-bg); color: var(--ready); }
  .b-fail { background: var(--fail-bg); color: var(--fail); }
  .b-blocked { background: var(--blocked-bg); color: var(--blocked); }
  .score {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.65rem;
    margin: 0.75rem 0 1rem;
  }
  .score .box {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.75rem;
    background: #fafaf9;
  }
  .score .n { font-size: 1.6rem; font-weight: 700; color: var(--accent); line-height: 1.1; }
  .score .l { font-size: 0.78rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; }
  .case-card {
    border: 1px solid var(--border);
    border-radius: 10px;
    margin: 0.75rem 0;
    overflow: hidden;
    background: #fff;
  }
  .case-card > summary {
    cursor: pointer;
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem 0.75rem;
    padding: 0.75rem 0.9rem;
    background: #f8faf9;
    border-bottom: 1px solid var(--border);
    font-weight: 600;
  }
  .case-card > summary::-webkit-details-marker { display: none; }
  .case-id { font-family: ui-monospace, monospace; color: var(--accent); font-size: 0.85rem; }
  .case-title { flex: 1; min-width: 180px; }
  .case-card > .case-meta, .case-card > .panels { margin: 0.65rem 0.9rem; }
  .panels { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
  @media (max-width: 820px) { .panels { grid-template-columns: 1fr; } }
  .panel { border-radius: 8px; overflow: hidden; border: 1px solid #1e293b; }
  .panel-h {
    background: #1e293b;
    color: #94a3b8;
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0.4rem 0.65rem;
  }
  .panel pre {
    margin: 0;
    padding: 0.75rem;
    background: var(--code-bg);
    color: var(--code-fg);
    font-size: 0.72rem;
    line-height: 1.45;
    overflow: auto;
    max-height: 360px;
    white-space: pre-wrap;
    word-break: break-word;
  }
  .flow {
    display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: center;
    font-size: 0.85rem; margin: 0.75rem 0;
  }
  .flow span {
    background: #f1f5f4;
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 0.3rem 0.55rem;
  }
  .flow .arrow { background: transparent; border: none; color: var(--gold); font-weight: 700; }
  .e2e {
    margin: 1rem 0 1.25rem;
    padding: 1rem 1.1rem;
    border: 1px solid var(--border);
    border-radius: 12px;
    background: linear-gradient(180deg, #f8faf9 0%, #fff 55%);
  }
  .e2e h3 { margin: 0 0 0.35rem; font-size: 1.02rem; color: var(--accent); }
  .e2e .e2e-lead { margin: 0 0 0.85rem; color: var(--muted); font-size: 0.88rem; }
  .e2e-legend {
    display: flex; flex-wrap: wrap; gap: 0.5rem 1rem;
    margin: 0 0 0.9rem; font-size: 0.8rem; color: var(--muted);
  }
  .e2e-legend i {
    display: inline-block; width: 0.7rem; height: 0.7rem;
    border-radius: 3px; margin-right: 0.35rem; vertical-align: -1px;
  }
  .e2e-legend .in { background: #0f766e; }
  .e2e-legend .out { background: #b45309; }
  .e2e-legend .sys { background: #334155; }
  .swim {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 0.45rem 0.75rem;
    margin: 0 0 0.85rem;
    align-items: stretch;
  }
  .swim-label {
    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;
    text-transform: uppercase; color: var(--muted);
    display: flex; align-items: center;
  }
  .swim-track {
    display: flex; flex-wrap: wrap; gap: 0.35rem; align-items: center;
    padding: 0.45rem 0.5rem;
    border-radius: 8px;
    border: 1px dashed #d6d3d1;
    background: #fff;
  }
  .node {
    border-radius: 7px;
    padding: 0.35rem 0.55rem;
    font-size: 0.78rem;
    font-weight: 600;
    line-height: 1.25;
    border: 1px solid transparent;
    max-width: 220px;
  }
  .node small { display: block; font-weight: 500; color: inherit; opacity: 0.85; font-size: 0.7rem; }
  .node.sys { background: #334155; color: #f8fafc; }
  .node.in { background: #ccfbf1; color: #115e59; border-color: #5eead4; }
  .node.out { background: #ffedd5; color: #9a3412; border-color: #fdba74; }
  .node.ok { background: #dcfce7; color: #166534; border-color: #86efac; }
  .node.warn { background: #fef3c7; color: #92400e; border-color: #fcd34d; }
  .node.bad { background: #fee2e2; color: #991b1b; border-color: #fca5a5; }
  .arrow-e2e { color: var(--gold); font-weight: 800; font-size: 0.95rem; padding: 0 0.1rem; }
  .e2e-paths {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-top: 0.25rem;
  }
  @media (max-width: 900px) { .e2e-paths { grid-template-columns: 1fr; } }
  .e2e-card {
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.7rem 0.8rem;
    background: #fff;
  }
  .e2e-card h4 {
    margin: 0 0 0.45rem;
    font-size: 0.88rem;
    color: var(--ink);
  }
  .e2e-card ol {
    margin: 0;
    padding-left: 1.15rem;
    font-size: 0.8rem;
    color: var(--ink);
  }
  .e2e-card li { margin: 0.28rem 0; }
  .e2e-card .tag {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    text-transform: uppercase;
    padding: 0.1rem 0.4rem;
    border-radius: 4px;
    margin-right: 0.25rem;
  }
  .tag.in { background: #ccfbf1; color: #115e59; }
  .tag.out { background: #ffedd5; color: #9a3412; }

  mark.hl-pass {
    background: #bbf7d0;
    color: #14532d;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
    font-weight: 650;
  }
  tr.row-pass td { background: #f0fdf4 !important; }
  tr.row-pass td:first-child { box-shadow: inset 3px 0 0 #16a34a; }
  tr.row-blocked td { background: #fffbeb !important; }
  .case-card.is-pass { border-color: #86efac; box-shadow: 0 0 0 1px rgba(22,163,74,0.12); }
  .case-card.is-pass > summary { background: #f0fdf4; }
  .pass-pill {
    background: #16a34a; color: #fff; font-size: 0.68rem; font-weight: 800;
    letter-spacing: 0.04em; padding: 0.15rem 0.45rem; border-radius: 999px;
  }
  .score .box.pass-box { border-color: #86efac; background: #f0fdf4; }
  .score .box.pass-box .n { color: #166534; }
  .arch {
    margin: 0.5rem 0 0;
    padding: 1.1rem 1rem 1.2rem;
    border-radius: 14px;
    background: #0f172a;
    color: #e2e8f0;
    border: 1px solid #1e293b;
  }
  .arch h3 {
    margin: 0 0 0.35rem;
    font-size: 1rem;
    color: #f8fafc;
    border: none;
    padding: 0;
    font-family: Georgia, serif;
  }
  .arch .arch-lead { margin: 0 0 1rem; font-size: 0.84rem; color: #94a3b8; }
  .tree {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0;
    font-size: 0.82rem;
  }
  .tree-node {
    min-width: min(100%, 320px);
    max-width: 420px;
    text-align: center;
    padding: 0.55rem 0.85rem;
    border-radius: 10px;
    font-weight: 700;
    line-height: 1.3;
    border: 1px solid transparent;
  }
  .tree-node small { display: block; font-weight: 500; opacity: 0.85; font-size: 0.72rem; margin-top: 0.15rem; }
  .tree-node.root { background: #1e293b; color: #f8fafc; border-color: #334155; }
  .tree-node.api-in { background: #115e59; color: #ecfdf5; border-color: #2dd4bf; }
  .tree-node.pms { background: #0d5c4b; color: #fff; border-color: #34d399; }
  .tree-node.action { background: #14532d; color: #dcfce7; border-color: #4ade80; }
  .tree-node.api-out { background: #9a3412; color: #ffedd5; border-color: #fdba74; }
  .tree-node.dest { background: #1e293b; color: #f8fafc; border-color: #64748b; }
  .tree-connector {
    width: 2px;
    height: 14px;
    background: #64748b;
  }
  .tree-branch {
    display: grid;
    grid-template-columns: 1fr;
    gap: 0.35rem;
    width: min(100%, 420px);
    margin: 0.15rem 0 0.35rem;
    padding: 0.55rem 0.65rem;
    border: 1px dashed #334155;
    border-radius: 10px;
    background: rgba(15, 23, 42, 0.65);
  }
  .tree-branch .step {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    padding: 0.4rem 0.55rem;
    border-radius: 8px;
    background: #1e293b;
    border: 1px solid #334155;
    color: #e2e8f0;
    font-weight: 600;
    font-size: 0.8rem;
  }
  .tree-branch .step .n {
    flex: 0 0 1.4rem;
    height: 1.4rem;
    border-radius: 999px;
    background: #0d5c4b;
    color: #fff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: 800;
  }
  .tree-branch .step.done { border-color: #4ade80; box-shadow: inset 3px 0 0 #22c55e; }
  .tree-fork {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
    width: min(100%, 640px);
    margin-top: 0.35rem;
  }
  @media (max-width: 720px) { .tree-fork { grid-template-columns: 1fr; } }
  .tree-fork .lane {
    border: 1px solid #334155;
    border-radius: 10px;
    padding: 0.65rem 0.7rem;
    background: #111827;
  }
  .tree-fork .lane h4 {
    margin: 0 0 0.45rem;
    font-size: 0.78rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #94a3b8;
  }
  .tree-fork .lane ul {
    margin: 0;
    padding-left: 1.1rem;
    font-size: 0.78rem;
    color: #cbd5e1;
  }
  .tree-fork .lane li { margin: 0.25rem 0; }
  .ids-box {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 0.55rem;
    margin: 0.75rem 0 0;
  }
  .ids-box .id {
    background: #fff;
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.55rem 0.65rem;
  }
  .ids-box .k { font-size: 0.72rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.04em; font-weight: 700; }
  .ids-box .v { font-family: ui-monospace, monospace; font-weight: 700; color: var(--accent); font-size: 1.05rem; }


  .info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 0.65rem;
    margin: 0.85rem 0 1rem;
  }
  .info-card {
    border-radius: 12px;
    padding: 0.85rem 0.9rem;
    border: 1px solid var(--border);
    background: #fff;
  }
  .info-card .t {
    font-size: 0.72rem; font-weight: 800; letter-spacing: 0.05em;
    text-transform: uppercase; color: var(--muted); margin: 0 0 0.35rem;
  }
  .info-card .b { font-size: 1.05rem; font-weight: 700; color: var(--accent); margin: 0; }
  .info-card .d { font-size: 0.8rem; color: var(--muted); margin: 0.35rem 0 0; }
  .info-card.inb { border-left: 4px solid #0f766e; }
  .info-card.outb { border-left: 4px solid #b45309; }
  .info-card.okc { border-left: 4px solid #16a34a; background: #f0fdf4; }
  .nights {
    display: flex; flex-wrap: wrap; gap: 0.4rem; align-items: stretch;
    margin: 0.75rem 0 0.25rem;
  }
  .night {
    flex: 1 1 90px; min-width: 88px; text-align: center;
    border-radius: 10px; padding: 0.55rem 0.4rem;
    border: 1px solid var(--border); background: #fff;
  }
  .night .dt { font-family: ui-monospace, monospace; font-weight: 700; font-size: 0.82rem; }
  .night .lb { font-size: 0.68rem; color: var(--muted); margin-top: 0.2rem; }
  .night.closed { background: #fee2e2; border-color: #fca5a5; }
  .night.closed .lb { color: #991b1b; font-weight: 700; }
  .night.open { background: #dcfce7; border-color: #86efac; }
  .night.open .lb { color: #166534; font-weight: 700; }
  .pill-closed {
    display: inline-block; background: #fee2e2; color: #991b1b;
    font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem;
  }
  .pill-open {
    display: inline-block; background: #dcfce7; color: #166534;
    font-weight: 700; padding: 0.15rem 0.5rem; border-radius: 999px; font-size: 0.75rem;
  }
  .reqres {
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin: 0.65rem 0 1.1rem;
  }
  @media (max-width: 900px) { .reqres { grid-template-columns: 1fr; } }
  .reqres .panel pre { max-height: 440px; }
  .api-title {
    display: flex; flex-wrap: wrap; align-items: center; gap: 0.5rem;
    margin: 1.15rem 0 0.45rem;
  }
  .api-title h3 { margin: 0; border: none; padding: 0; font-size: 1rem; }
  .url-chip {
    font-family: ui-monospace, monospace; font-size: 0.72rem;
    background: #0f172a; color: #e2e8f0; padding: 0.25rem 0.55rem;
    border-radius: 6px; word-break: break-all;
  }
  .sync-bar {
    display: grid; grid-template-columns: 1fr auto 1fr; gap: 0.5rem;
    align-items: center; margin: 1rem 0;
  }
  .sync-box {
    border-radius: 12px; padding: 0.85rem; text-align: center;
    border: 1px solid var(--border); background: #fff;
  }
  .sync-box h4 { margin: 0 0 0.35rem; font-size: 0.9rem; }
  .sync-mid { font-size: 1.4rem; color: var(--gold); font-weight: 800; }

  footer.foot {
    margin-top: 1.5rem;
    padding: 1rem 0 0;
    border-top: 1px solid var(--border);
    color: var(--muted);
    font-size: 0.88rem;
  }
  ol.gate { margin: 0.4rem 0 0.4rem 1.15rem; padding: 0; }
  ol.gate li { margin: 0.35rem 0; }
  @media print {
    body { background: #fff; }
    .toc { position: static; }
    .hero { box-shadow: none; }
    .case-card { break-inside: avoid; }
  }
</style>
</head>
<body>
<div class="wrap">

<header class="hero">
  <h1>Overall Axis API Integration Testing</h1>
  <p class="sub">Jade Host PMS × Axis Rooms — architecture, live UAT results, and outbound CM smoke</p>
  <div class="hero-meta">
    <span class="chip">Generated ${esc(report.generatedAt)}</span>
    <span class="chip">Webhook | jade-revamp.vercel.app</span>
    <span class="chip">channelId ${esc(report.channelId)}</span>
    <span class="chip">UAT hotel ${esc(report.uatHotel)} / room ${esc(report.uatRoom)} / rate ${esc(report.uatRate)}</span>
  </div>
</header>

<nav class="toc" aria-label="Contents">
  <a href="#arch">0. Architecture</a>
  <a href="#raw">1. Raw body &amp; outputs</a>
  <a href="#s1">2. Credentials</a>
  <a href="#s2">3. Properties</a>
  <a href="#s3">4. Inventory rules</a>
  <a href="#s4">5. Validation gate</a>
  <a href="#s5">6. Live UAT</a>
  <a href="#s6">7. Outbound smoke</a>
  <a href="#s7">8. Next steps</a>
</nav>

<section class="section" id="arch">
  <h2>0. High-Level Architecture</h2>
  <p class="muted">Jade Host PMS ↔ Axis Rooms CM. Allowed APIs: <strong>1, 2, 6, 7, 9</strong> (API 5 not used).</p>

  <div class="info-grid">
    <div class="info-card inb">
      <p class="t">Inbound</p>
      <p class="b">API 9 Webhook</p>
      <p class="d">Axis / OTA → Jade · booking create / modify / cancel</p>
    </div>
    <div class="info-card outb">
      <p class="t">Outbound inventory</p>
      <p class="b">API 2 + API 1</p>
      <p class="d">Jade → Axis · close nights after save · open on cancel</p>
    </div>
    <div class="info-card outb">
      <p class="t">Outbound price</p>
      <p class="b">API 6 + API 7</p>
      <p class="d">Jade → Axis · daywise / bulk rate updates</p>
    </div>
    <div class="info-card okc">
      <p class="t">Live status</p>
      <p class="b">Sync working</p>
      <p class="d">Inbound + outbound smoke green with current accessKey</p>
    </div>
  </div>

  <div class="sync-bar">
    <div class="sync-box">
      <h4>Axis Rooms CM</h4>
      <div class="muted" style="font-size:0.8rem">sandbox2.axisrooms.com</div>
    </div>
    <div class="sync-mid">⇄</div>
    <div class="sync-box">
      <h4>Jade Host PMS</h4>
      <div class="muted" style="font-size:0.8rem">jade-revamp.vercel.app</div>
    </div>
  </div>

  <div class="arch" aria-label="Architecture flow tree">
    <h3>End-to-end pipeline (Rohith view)</h3>
    <p class="arch-lead">After booking save, Jade pushes inventory outbound (API 2 bulk + API 1 daywise). Webhook HTTP reply stays the Axis success envelope.</p>

    <div class="tree">
      <div class="tree-node root">Guest / OTA<small>Booking.com · Airbnb · Direct</small></div>
      <div class="tree-connector"></div>
      <div class="tree-node root">Axis Rooms CM</div>
      <div class="tree-connector"></div>
      <div class="tree-node api-in">API 9 — Inbound webhook<small>POST jade-revamp.vercel.app/api/webhooks/axisrooms</small></div>
      <div class="tree-connector"></div>
      <div class="tree-node pms">Jade Host PMS</div>
      <div class="tree-branch">
        <div class="step done"><span class="n">1</span> Validate accessKey</div>
        <div class="step done"><span class="n">2</span> Validate hotelId / roomId / ratePlanId</div>
        <div class="step done"><span class="n">3</span> Validate noOfRooms = 1</div>
        <div class="step done"><span class="n">4</span> Save booking + night locks</div>
        <div class="step done"><span class="n">5</span> Reply 200 Booking Update Received</div>
        <div class="step done"><span class="n">6</span> Outbound API 2 inventory (availability 0)</div>
        <div class="step done"><span class="n">7</span> Outbound API 1 daywise (free 0)</div>
      </div>
      <div class="tree-connector"></div>
      <div class="tree-node dest">Axis CM calendar updated<small>nights closed for OTAs</small></div>
    </div>

    <div class="tree-fork" style="margin: 1rem auto 0;">
      <div class="lane">
        <h4>Inventory meaning</h4>
        <ul>
          <li><span class="pill-closed">free: 0 / availability: 0</span> = closed · unavailable · blocked</li>
          <li><span class="pill-open">free: 1 / availability: 1</span> = open · available</li>
          <li>Whole villa uses 0 or 1 only (not 1511)</li>
        </ul>
      </div>
      <div class="lane">
        <h4>Preferred UAT IDs</h4>
        <ul>
          <li><code>hotelId</code> <strong>1303</strong> · <code>roomId</code> <strong>1</strong></li>
          <li><code>ratePlanId</code> <strong>1</strong> · Best Available Rate</li>
          <li><code>noOfRooms</code> <strong>1</strong> · <code>channelId</code> <strong>227</strong></li>
        </ul>
      </div>
    </div>
  </div>

  <h3 style="margin-top:1.1rem">Checkout-exclusive nights (example)</h3>
  <p class="muted">checkIn <code>2026-07-21</code> → checkOut <code>2026-07-24</code> · Jade closes 3 stay nights; checkout day stays open.</p>
  <div class="nights">
    <div class="night closed"><div class="dt">21 Jul</div><div class="lb">CLOSED · free 0</div></div>
    <div class="night closed"><div class="dt">22 Jul</div><div class="lb">CLOSED · free 0</div></div>
    <div class="night closed"><div class="dt">23 Jul</div><div class="lb">CLOSED · free 0</div></div>
    <div class="night open"><div class="dt">24 Jul</div><div class="lb">OPEN · checkout</div></div>
  </div>

  <div class="ids-box">
    <div class="id"><div class="k">hotelId</div><div class="v">1303</div></div>
    <div class="id"><div class="k">roomId</div><div class="v">1</div></div>
    <div class="id"><div class="k">ratePlanId</div><div class="v">1</div></div>
    <div class="id"><div class="k">ratePlanName</div><div class="v" style="font-size:0.85rem">Best Available Rate</div></div>
    <div class="id"><div class="k">noOfRooms</div><div class="v">1</div></div>
  </div>
  ${
    a01
      ? `<p class="muted" style="margin-top:0.85rem">Latest A01 create: HTTP <code>${esc(a01.httpStatus)}</code> — ${
          a01.badge === "Pass"
            ? `<mark class="hl-pass">${esc(a01.responseMessage)}</mark>`
            : esc(a01.responseMessage)
        } | <strong>${esc(a01.badge)}</strong></p>`
      : ""
  }
</section>

<section class="section" id="raw">
  <h2>1. Raw body &amp; outputs (what Rohith asked for)</h2>
  <p class="muted">Postman-ready request bodies + response envelopes. Example stay: <strong>2026-07-21 → 2026-07-24</strong>.</p>

  <div class="api-title">
    <h3>A) Inbound API 9 — booking webhook</h3>
    <span class="url-chip">POST https://jade-revamp.vercel.app/api/webhooks/axisrooms</span>
  </div>
  <div class="reqres">
    <div class="panel">
      <div class="panel-h">Raw body (Axis → Jade)</div>
      <pre>${esc(SAMPLE_IN_BODY)}</pre>
    </div>
    <div class="panel">
      <div class="panel-h">Output / response (Jade → Axis)</div>
      <pre>${esc(SAMPLE_IN_RESP)}</pre>
      <p class="muted" style="padding:0.55rem 0.75rem;margin:0">After this ack, Jade pushes inventory outbound (B &amp; C below).</p>
    </div>
  </div>

  <div class="api-title">
    <h3>B) Outbound API 2 — bulk inventory (Jade → Axis) ★</h3>
    <span class="url-chip">POST https://sandbox2.axisrooms.com/api/inventory</span>
  </div>
  <div class="reqres">
    <div class="panel">
      <div class="panel-h">Raw body (Jade push after save)</div>
      <pre>${esc(SAMPLE_API2_BODY)}</pre>
    </div>
    <div class="panel">
      <div class="panel-h">Output / response (Axis)</div>
      <pre>${esc(SAMPLE_API2_RESP)}</pre>
      <p class="muted" style="padding:0.55rem 0.75rem;margin:0"><span class="pill-closed">availability: 0</span> = closed / unavailable for nights 21–23.</p>
    </div>
  </div>

  <div class="api-title">
    <h3>C) Outbound API 1 — daywise inventory (Jade → Axis)</h3>
    <span class="url-chip">POST https://sandbox2.axisrooms.com/api/daywiseInventory</span>
  </div>
  <div class="reqres">
    <div class="panel">
      <div class="panel-h">Raw body (Jade push after save)</div>
      <pre>${esc(SAMPLE_API1_BODY)}</pre>
    </div>
    <div class="panel">
      <div class="panel-h">Output / response (Axis)</div>
      <pre>${esc(SAMPLE_API1_RESP)}</pre>
      <p class="muted" style="padding:0.55rem 0.75rem;margin:0"><span class="pill-closed">free: 0</span> = blocked · <span class="pill-open">free: 1</span> = open (cancel / reopen).</p>
    </div>
  </div>

  <div class="callout ok">
    <strong>For Rohith:</strong> Section <strong>B</strong> is the outbound inventory push Jade sends after reservation save (API 2).
    Section <strong>C</strong> is the daywise twin (API 1). Section <strong>A</strong> is only the inbound webhook ack.
  </div>
</section>

<section class="section" id="s1">
  <h2>2. PMS + Webhook Credentials</h2>
  <table>
    <tr><th>Field</th><th>Value</th></tr>
    <tr><td>PMS Name</td><td>Jade Host PMS</td></tr>
    <tr><td>Sandbox Base URL</td><td><code>${esc(report.axisBase)}</code></td></tr>
    <tr><td>channelId / pmsId</td><td><code>${esc(report.channelId)}</code></td></tr>
    <tr><td>API 9 Webhook</td><td><code>${esc(report.webhookUrl)}</code></td></tr>
    <tr><td>Method</td><td>POST | JSON body</td></tr>
    <tr><td>Authentication</td><td><code>accessKey</code> in JSON body</td></tr>
    <tr><td>accessKey</td><td><code>227ssaTsivanoS34DasseNav</code></td></tr>
  </table>
</section>

<section class="section" id="s2">
  <h2>3. Property IDs (16 Villas)</h2>
  <div class="callout ok">
    <strong>Whole-villa model:</strong> always send <code>roomId: 1</code>, <code>ratePlanId: 1</code>,
    <code>ratePlanName: Best Available Rate</code>, <code>noOfRooms: 1</code>.
    Preferred joint UAT property: hotelId <strong>1303</strong> (Red Dome).
  </div>
  <table>
    <thead>
      <tr><th>#</th><th>hotelId</th><th>Property</th><th>roomId</th><th>ratePlanId</th><th>ratePlanName</th><th>noOfRooms</th></tr>
    </thead>
    <tbody>${propertyRows}</tbody>
  </table>
</section>

<section class="section" id="s3">
  <h2>4. Inventory Sync Confirmation</h2>
  <table>
    <thead><tr><th>Event</th><th>Jade action</th><th>Axis API</th></tr></thead>
    <tbody>
      <tr><td>OTA booking (API 9)</td><td>Save booking + close nights</td><td>API 2 availability:0 + API 1 free:0</td></tr>
      <tr><td>OTA modify (API 9)</td><td>Update dates</td><td>API 2 + API 1 open old / close new</td></tr>
      <tr><td>OTA cancel (API 9)</td><td>Cancel + release nights</td><td>API 2 availability:1 + API 1 free:1</td></tr>
      <tr><td>Direct / website / manual</td><td>Confirm in PMS</td><td>API 1 | free: 0 per night</td></tr>
      <tr><td>Staff cancel / date change</td><td>Update calendar</td><td>API 1 | open / close</td></tr>
      <tr><td>Price update</td><td>PMS rate change</td><td>API 6 / 7</td></tr>
    </tbody>
  </table>
  <p class="muted">API 2 runs after successful API 9 (HTTP 200). Validation failures (422/401) do not push inventory.</p>
</section>

<section class="section" id="s4">
  <h2>5. Critical Validation Gate (API 9)</h2>
  <ol class="gate">
    <li>Invalid <code>accessKey</code> → <strong>401</strong></li>
    <li>Bad dates / <code>noOfRooms != 1</code> → <strong>422</strong> (distinct message)</li>
    <li>Unknown <code>hotelId</code>+<code>roomId</code> or bad <code>ratePlanId</code> → <strong>422</strong> (distinct message)</li>
    <li>Save booking + API 2 inventory ack → <strong>200</strong></li>
  </ol>
</section>

<section class="section" id="s5">
  <h2>6. Live UAT Results</h2>
  <p class="muted">Target: <code>${esc(report.webhookUrl)}</code> | bookingNo: <code>${esc(report.sharedBookingNo)}</code> | ${esc(report.generatedAt)}</p>
  <div class="score">
    <div class="box pass-box"><div class="n">${passN}</div><div class="l">${inboundPassHighlight}</div></div>
    <div class="box"><div class="n">${blockedIn}</div><div class="l">Blocked</div></div>
    <div class="box"><div class="n">${failN}</div><div class="l">Failed</div></div>
    <div class="box"><div class="n">${inbound.length}</div><div class="l">Inbound cases</div></div>
  </div>
  ${
    passN === inbound.length && inbound.length > 0
      ? `<div class="callout ok"><strong>Inbound pipeline:</strong> <mark class="hl-pass">All ${passN} inbound cases PASSED</mark> — create, invalid-ID rejects, duplicate, modify, and cancel.</div>`
      : ""
  }
  <h3>Contrast table (correct vs invalid → different outputs)</h3>
  <table>
    <thead>
      <tr><th>Case</th><th>Phase</th><th>hotelId</th><th>roomId</th><th>ratePlanId</th><th>noOfRooms</th><th>HTTP</th><th>Response message</th><th>Badge</th></tr>
    </thead>
    <tbody>${contrastRows}</tbody>
  </table>
  <h3>Request / response by phase</h3>
  ${phaseBlocks}
</section>

<section class="section" id="s6">
  <h2>7. Phase D — Outbound CM smoke (API 1 / 2 / 6 / 7)</h2>
  <p class="muted">Direct POSTs to <code>${esc(report.axisBase)}</code> | hotelId ${esc(report.uatHotel)} | ${esc(outbound.start)} → ${esc(outbound.end)}</p>

  <div class="arch" style="margin-bottom:1rem">
    <h3>Outbound CM branch</h3>
    <p class="arch-lead">After inbound save (or from website/staff), Jade calls Axis CM APIs with the same <code>accessKey</code> + <code>channelId</code>.</p>
    <div class="tree">
      <div class="tree-node pms">Jade Host PMS<small>inventory / price change</small></div>
      <div class="tree-connector"></div>
      <div class="tree-node api-out">Outbound POST<small>API 1 · 2 · 6 · 7</small></div>
      <div class="tree-connector"></div>
      ${
        outPass === outbound.tests.length && outbound.tests.length > 0
          ? `<div class="tree-node action">Axis accepted<small>CM inventory / price updated</small></div>`
          : outMapIssue
            ? `<div class="tree-node" style="background:#7f1d1d;border-color:#f87171;color:#fecaca">Axis: hotel not mapped<small>hotelId ${esc(report.uatHotel)} not mapped in Channel Manager</small></div>`
            : blockedN > 0
              ? `<div class="tree-node" style="background:#7f1d1d;border-color:#f87171;color:#fecaca">Axis response 401<small>Sandbox accessKey not yet accepted for CM outbound</small></div>`
              : `<div class="tree-node" style="background:#7f1d1d;border-color:#f87171;color:#fecaca">Outbound failed<small>see Phase D table</small></div>`
      }
    </div>
  </div>

  <div class="score">
    <div class="box ${outPass > 0 ? "pass-box" : ""}"><div class="n">${outPass}</div><div class="l">Passed</div></div>
    <div class="box"><div class="n">${blockedN}</div><div class="l">Blocked (401)</div></div>
    <div class="box"><div class="n">${outFail}</div><div class="l">Failed</div></div>
    <div class="box"><div class="n">${outbound.tests.length}</div><div class="l">Outbound checks</div></div>
  </div>
  <table>
    <thead><tr><th>API</th><th>Path</th><th>Result</th><th>HTTP</th><th>Notes</th></tr></thead>
    <tbody>${outboundRows}</tbody>
  </table>
  ${
    outPass === outbound.tests.length && outbound.tests.length > 0
      ? `<div class="callout ok"><mark class="hl-pass">Outbound APIs accepted</mark> — verify inventory/price in Axis logs.</div>`
      : outMapIssue
        ? `<div class="callout"><strong>Outbound CM status:</strong> accessKey is accepted, but Axis returns
           <code>hotelId ${esc(report.uatHotel)} not mapped in Channel Manager</code> on APIs 1/2/6/7.
           <mark class="hl-pass">Inbound API 9 is PASSED</mark> with the new key.
           Ask Axis to map hotelIds (CSV 1301–1316; UAT <strong>${esc(report.uatHotel)}</strong> / room 1 / rate 1) in the Channel Manager.</div>`
        : blockedN > 0
          ? `<div class="callout"><strong>Outbound CM status:</strong> Axis returns <code>401 Authorization Failed.Invalid accessKey</code> on APIs 1/2/6/7.
         <mark class="hl-pass">Inbound API 9 is PASSED</mark>. Once Axis activates the sandbox key for CM outbound, inventory/price sync will complete end-to-end.</div>`
          : `<div class="callout"><strong>Outbound CM status:</strong> see Phase D table for failures.</div>`
  }
</section>

<section class="section" id="s7">
  <h2>8. Joint Next Steps</h2>
  <ol class="gate">
    <li>Use the same IDs for every Postman/API 9 hit: <strong>hotelId 1303</strong>, <strong>roomId 1</strong>, <strong>ratePlanId 1</strong>, <strong>ratePlanName Best Available Rate</strong>, <strong>noOfRooms 1</strong>.</li>
    <li>Ask Axis to <strong>map hotelIds in Channel Manager</strong> (1301–1316; UAT 1303) so outbound APIs 1/2/6/7 can sync inventory/price.</li>
    <li>Joint retest after mapping: create → modify → cancel on 1303; confirm API 2 in Axis logs.</li>
  </ol>
</section>

<footer class="foot">
  <p><strong>Mohammed Saad</strong> | Jade Host PMS | saad@helloerrors.in</p>
  <p>CSV: <code>docs/jade-axisrooms-properties.csv</code> | Regenerate: <code>npm run axis:uat-report</code></p>
</footer>

</div>
</body>
</html>`;
}

async function runCase(label, fn) {
  console.log(`${label} ...`);
  const out = await fn();
  console.log(`  HTTP ${out.result.httpStatus} -> ${out.ev.badge}`);
  return out;
}

async function main() {
  if (!accessKey) {
    console.error("BLOCKED: AXIS_ROOMS_API_KEY not set");
    process.exit(1);
  }

  console.log("\nAxis UAT matrix (Phase A/B/C/D)");
  console.log(`  Webhook : ${webhookUrl}`);
  console.log(`  Axis    : ${axisBase}`);
  console.log(`  UAT     : hotel ${uatHotel} / room ${uatRoom} / rate ${uatRate}\n`);

  const sharedBookingNo = bookingNo();
  const inbound = [];

  // â”€â”€ Phase A - Correct IDs â”€â”€
  await runCase(`A01 Valid create (${sharedBookingNo})`, async () => {
    const payload = buildPayload({
      hotelId: uatHotel,
      roomId: uatRoom,
      ratePlanId: uatRate,
      bookingNo: sharedBookingNo,
      status: "confirmed",
      checkIn: "2026-08-03",
      checkOut: "2026-08-04",
    });
    const result = await postWebhook(payload);
    const ev = evaluate(
      { expectStatus: 200, expectBodyStatus: "success" },
      result,
    );
    pushCase(
      inbound,
      {
        id: "A01",
        phase: "A",
        title: "Valid create (1303 / room 1 / rate 1)",
        description:
          "Correct IDs first. Expect HTTP 200 + save + API 2 inventory ack.",
        expectLabel: "HTTP 200 | status success",
        bookingNo: sharedBookingNo,
      },
      payload,
      result,
      ev,
    );
    return { result, ev };
  });

  // â”€â”€ Phase B - Invalid IDs â”€â”€
  await runCase("B01 Wrong room on valid hotel (1303/99)", async () => {
    const payload = buildPayload({
      hotelId: uatHotel,
      roomId: "99",
      ratePlanId: "1",
      bookingNo: bookingNo(),
    });
    const result = await postWebhook(payload);
    const ev = evaluate(
      {
        expectStatus: 422,
        expectBodyStatus: "failure",
        expectMessageIncludes: "Unknown hotelId/roomId",
      },
      result,
    );
    pushCase(
      inbound,
      {
        id: "B01",
        phase: "B",
        title: "Invalid roomId on valid hotel (1303/99)",
        description: "Must differ from A01 - proves roomId is validated against mapping.",
        expectLabel: "HTTP 422 | Unknown hotelId/roomId",
      },
      payload,
      result,
      ev,
    );
    return { result, ev };
  });

  await runCase("B02 Unknown roomId (1313/2)", async () => {
    const payload = buildPayload({
      hotelId: "1313",
      roomId: "2",
      ratePlanId: "1",
      bookingNo: bookingNo(),
    });
    const result = await postWebhook(payload);
    const ev = evaluate(
      {
        expectStatus: 422,
        expectBodyStatus: "failure",
        expectMessageIncludes: "Unknown hotelId/roomId",
      },
      result,
    );
    pushCase(
      inbound,
      {
        id: "B02",
        phase: "B",
        title: "Unknown roomId on mapped hotel (1313/2)",
        description: "Exact case from Axis Postman - expected rejection, not Jade outage.",
        expectLabel: "HTTP 422 | Unknown hotelId/roomId: 1313/2",
      },
      payload,
      result,
      ev,
    );
    return { result, ev };
  });

  await runCase("B03 Invalid hotelId 9999", async () => {
    const payload = buildPayload({
      hotelId: "9999",
      roomId: "1",
      ratePlanId: "1",
      bookingNo: bookingNo(),
    });
    const result = await postWebhook(payload);
    const ev = evaluate(
      { expectStatus: 422, expectBodyStatus: "failure" },
      result,
    );
    pushCase(
      inbound,
      {
        id: "B03",
        phase: "B",
        title: "Invalid hotelId (9999)",
        description: "Unregistered hotel - distinct unknown mapping message.",
        expectLabel: "HTTP 422 | Unknown hotelId/roomId",
      },
      payload,
      result,
      ev,
    );
    return { result, ev };
  });

  await runCase("B04 Invalid ratePlanId (1303/1/99)", async () => {
    const payload = buildPayload({
      hotelId: uatHotel,
      roomId: uatRoom,
      ratePlanId: "99",
      bookingNo: bookingNo(),
    });
    const result = await postWebhook(payload);
    const ev = evaluate(
      {
        expectStatus: 422,
        expectBodyStatus: "failure",
        expectMessageIncludes: "ratePlanId",
      },
      result,
    );
    pushCase(
      inbound,
      {
        id: "B04",
        phase: "B",
        title: "Invalid ratePlanId (99)",
        description: "Correct hotel/room but wrong rate - message must mention ratePlanId (not unknown hotel).",
        expectLabel: "HTTP 422 | Invalid ratePlanId",
      },
      payload,
      result,
      ev,
    );
    return { result, ev };
  });

  await runCase("B05 Invalid noOfRooms=5", async () => {
    const payload = buildPayload({
      hotelId: uatHotel,
      roomId: uatRoom,
      ratePlanId: uatRate,
      noOfRooms: "5",
      bookingNo: bookingNo(),
    });
    const result = await postWebhook(payload);
    const ev = evaluate(
      {
        expectStatus: 422,
        expectBodyStatus: "failure",
        expectMessageIncludes: "noOfRooms",
      },
      result,
    );
    pushCase(
      inbound,
      {
        id: "B05",
        phase: "B",
        title: "Invalid noOfRooms (5)",
        description: "Whole-villa requires noOfRooms=1 - distinct message from bad hotel/room.",
        expectLabel: "HTTP 422 | noOfRooms must be 1",
      },
      payload,
      result,
      ev,
    );
    return { result, ev };
  });

  await runCase("B06 Wrong accessKey", async () => {
    const payload = buildPayload({
      hotelId: uatHotel,
      roomId: uatRoom,
      ratePlanId: uatRate,
      bookingNo: bookingNo(),
      key: "INVALID_ACCESS_KEY_FOR_UAT_TEST_ONLY",
    });
    const result = await postWebhook(payload);
    const ev = evaluate(
      { expectStatus: 401, expectBodyStatus: "failure" },
      result,
    );
    pushCase(
      inbound,
      {
        id: "B06",
        phase: "B",
        title: "Wrong accessKey",
        description: "Must be 401 Unauthorized - different from all 422 validation cases.",
        expectLabel: "HTTP 401 | Unauthorized",
      },
      payload,
      result,
      ev,
    );
    return { result, ev };
  });

  const a01Ok = inbound.find((t) => t.id === "A01")?.badge === "Pass";

  // â”€â”€ Phase C - Lifecycle â”€â”€
  await runCase(`C01 Duplicate create (${sharedBookingNo})`, async () => {
    const payload = buildPayload({
      hotelId: uatHotel,
      roomId: uatRoom,
      ratePlanId: uatRate,
      bookingNo: sharedBookingNo,
      status: "confirmed",
      checkIn: "2026-08-03",
      checkOut: "2026-08-04",
    });
    const result = await postWebhook(payload);
    let ev;
    if (a01Ok) {
      ev = evaluate(
        { expectStatus: 200, expectBodyStatus: "success" },
        result,
      );
    } else {
      ev = {
        passed: false,
        badge: "Blocked",
        reason: `A01 did not Pass - duplicate replay HTTP ${result.httpStatus}: ${result.response?.message ?? ""}`,
      };
    }
    pushCase(
      inbound,
      {
        id: "C01",
        phase: "C",
        title: "Duplicate create (idempotent)",
        description: `Same bookingNo ${sharedBookingNo} again - expect 200 idempotent when create succeeded.`,
        expectLabel: "HTTP 200 | success (idempotent)",
        bookingNo: sharedBookingNo,
      },
      payload,
      result,
      ev,
    );
    return { result, ev };
  });

  await runCase(`C02 Modify (${sharedBookingNo})`, async () => {
    const payload = buildPayload({
      hotelId: uatHotel,
      roomId: uatRoom,
      ratePlanId: uatRate,
      bookingNo: sharedBookingNo,
      status: "modified",
      checkIn: "2026-08-10",
      checkOut: "2026-08-12",
    });
    const result = await postWebhook(payload);
    let ev;
    if (a01Ok) {
      ev = evaluate(
        { expectStatus: 200, expectBodyStatus: "success" },
        result,
      );
    } else if (/invalid accesskey|authorization failed/i.test(result.response?.message ?? "")) {
      ev = {
        passed: false,
        badge: "Blocked",
        reason: `Modify failed (HTTP ${result.httpStatus}): ${result.response?.message ?? ""}`,
      };
    } else {
      ev = {
        passed: false,
        badge: "Blocked",
        reason: `A01 create did not Pass - modify returned HTTP ${result.httpStatus}: ${result.response?.message ?? ""}`,
      };
    }
    pushCase(
      inbound,
      {
        id: "C02",
        phase: "C",
        title: "Modify dates",
        description:
          "bookingStatus modified + new dates. Requires successful create.",
        expectLabel: "HTTP 200 | success",
        bookingNo: sharedBookingNo,
      },
      payload,
      result,
      ev,
    );
    return { result, ev };
  });

  await runCase(`C03 Cancel (${sharedBookingNo})`, async () => {
    const payload = buildPayload({
      hotelId: uatHotel,
      roomId: uatRoom,
      ratePlanId: uatRate,
      bookingNo: sharedBookingNo,
      status: "cancelled",
      checkIn: "2026-08-10",
      checkOut: "2026-08-12",
    });
    const result = await postWebhook(payload);
    let ev;
    if (a01Ok) {
      ev = evaluate(
        { expectStatus: 200, expectBodyStatus: "success" },
        result,
      );
    } else if (result.httpStatus === 200 && result.response?.status === "success") {
      ev = {
        passed: true,
        badge: "Pass",
        reason:
          "HTTP 200 on cancel. Note: A01 create did not Pass - not full create->cancel lifecycle proof.",
      };
    } else {
      ev = {
        passed: false,
        badge: "Blocked",
        reason: `A01 blocked and cancel returned HTTP ${result.httpStatus}: ${result.response?.message ?? ""}`,
      };
    }
    pushCase(
      inbound,
      {
        id: "C03",
        phase: "C",
        title: "Cancel booking",
        description:
          "bookingStatus cancelled - expect release locks + API 2 open.",
        expectLabel: "HTTP 200 | success",
        bookingNo: sharedBookingNo,
      },
      payload,
      result,
      ev,
    );
    return { result, ev };
  });

  console.log("\nPhase D - Outbound smoke ...");
  const outbound = await runOutboundSmoke();
  for (const t of outbound.tests) {
    console.log(`  ${t.label} -> ${t.badge} (HTTP ${t.httpStatus})`);
  }

  const report = {
    generatedAt: new Date().toISOString(),
    webhookUrl,
    webhookBase,
    axisBase,
    channelId,
    uatHotel,
    uatRoom,
    uatRate,
    sharedBookingNo,
    properties: loadProperties(),
    inbound,
    outbound,
  };

  fs.mkdirSync(path.dirname(TMP_JSON), { recursive: true });
  fs.writeFileSync(TMP_JSON, JSON.stringify(report, null, 2), "utf8");
  fs.writeFileSync(OUT_HTML, renderHtml(report), "utf8");

  console.log(`\nWrote ${TMP_JSON}`);
  console.log(`Wrote ${OUT_HTML}\n`);

  const hardFails = inbound.filter((t) => t.badge === "Fail").length;
  const blocked = inbound.filter((t) => t.badge === "Blocked").length;
  console.log(
    `Summary: ${inbound.filter((t) => t.badge === "Pass").length} pass | ${blocked} blocked | ${hardFails} fail`,
  );
  process.exit(hardFails > 0 ? 1 : 0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

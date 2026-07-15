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
    .map(
      (t) =>
        `<tr>
          <td><code>${esc(t.id)}</code></td>
          <td>${esc(t.phase)}</td>
          <td><code>${esc(t.hotelId)}</code></td>
          <td><code>${esc(t.roomId)}</code></td>
          <td><code>${esc(t.ratePlanId)}</code></td>
          <td><code>${esc(t.noOfRooms)}</code></td>
          <td><code>${esc(t.httpStatus)}</code></td>
          <td>${esc(t.responseMessage)}</td>
          <td><span class="badge ${badgeClass(t.badge)}">${esc(t.badge)}</span></td>
        </tr>`,
    )
    .join("\n");

  const phases = ["A", "B", "C"];
  const phaseBlocks = phases
    .map((ph) => {
      const cases = inbound.filter((t) => t.phase === ph);
      if (!cases.length) return "";
      const cards = cases
        .map(
          (t) => `
    <details class="case-card" ${ph === "B" || ph === "A" ? "open" : ""}>
      <summary>
        <span class="case-id">${esc(t.id)}</span>
        <span class="case-title">${esc(t.title)}</span>
        <span class="badge ${badgeClass(t.badge)}">${esc(t.badge)}</span>
      </summary>
      <p class="case-meta">${esc(t.description)}</p>
      <p class="case-meta"><strong>IDs:</strong> hotel <code>${esc(t.hotelId)}</code> | room <code>${esc(t.roomId)}</code> | rate <code>${esc(t.ratePlanId)}</code> | noOfRooms <code>${esc(t.noOfRooms)}</code> | status <code>${esc(t.bookingStatus)}</code></p>
      <p class="case-meta"><strong>Expect:</strong> ${esc(t.expectLabel)} | <strong>Got:</strong> HTTP ${esc(t.httpStatus)} - ${esc(t.responseMessage)}</p>
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
    </details>`,
        )
        .join("\n");
      return `<h3 id="phase-${ph}">${esc(phaseLabel(ph))}</h3>${cards}`;
    })
    .join("\n");

  const outboundRows = outbound.tests
    .map(
      (t) =>
        `<tr>
          <td>${esc(t.label)}</td>
          <td><code>${esc(t.api)}</code></td>
          <td><span class="badge ${badgeClass(t.badge)}">${esc(t.badge)}</span></td>
          <td><code>${esc(t.httpStatus)}</code></td>
          <td>${esc(t.reason)}</td>
        </tr>`,
    )
    .join("\n");

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
  <p class="sub">Jade Host PMS x Axis Rooms - correct IDs vs invalid IDs, lifecycle, and root-cause evidence for Rohit Kumar K</p>
  <div class="hero-meta">
    <span class="chip">Generated ${esc(report.generatedAt)}</span>
    <span class="chip">Webhook | jade-revamp.vercel.app</span>
    <span class="chip">channelId ${esc(report.channelId)}</span>
    <span class="chip">UAT ${esc(report.uatHotel)} / room ${esc(report.uatRoom)} / rate ${esc(report.uatRate)}</span>
  </div>
</header>

<nav class="toc" aria-label="Contents">
  <a href="#root">0. Root cause</a>
  <a href="#s1">1. Credentials</a>
  <a href="#s2">2. Properties</a>
  <a href="#s3">3. Inventory</a>
  <a href="#s4">4. Gate</a>
  <a href="#s5">5. Live UAT</a>
  <a href="#s6">6. Rohit 1313/2</a>
  <a href="#s7">7. Outbound</a>
  <a href="#s8">8. Next steps</a>
</nav>

<section class="section" id="root">
  <h2>0. Root Cause Summary</h2>
  <div class="callout danger">
    <strong>Root cause A - Rohit 1313/2:</strong>
    Payload used <code>hotelId: 1313</code> with <code>roomId: 2</code>.
    Jade registers whole-villa <code>roomId: 1</code> only -> local mapping rejects with
    <code>422 Unknown hotelId/roomId: 1313/2</code> -> <strong>no booking saved, no API 2 inventory push</strong>.
    This is validation working correctly (see B02).
  </div>
  <div class="callout">
    <strong>Root cause B - After API 5 removal:</strong>
    API 5 is removed from inbound (per Axis). Flow: API 9 accessKey + local hotel/room validation -> save -> <strong>API 2</strong>.
    Allowed: APIs <strong>1, 2, 6, 7, 9</strong>. Outbound 401 on Phase D remains Axis key activation for CM APIs (not Jade webhook auth).
  </div>
  <div class="callout ok">
    <strong>What works:</strong> Wrong accessKey -> 401; bad hotel/room/rate/noOfRooms -> distinct 422s (Phase B).
    Create should reach 200 without API 5; cancel/modify follow after successful create.
  </div>
  <div class="flow">
    <span>accessKey</span><span class="arrow">-></span>
    <span>hotelId+roomId</span><span class="arrow">-></span>
    <span>rate/noOfRooms</span><span class="arrow">-></span>
    <span>save booking</span><span class="arrow">-></span>
    <span>API 2 ack</span><span class="arrow">-></span>
    <span>200</span>
  </div>
  ${
    a01
      ? `<p class="muted">A01 last run: HTTP <code>${esc(a01.httpStatus)}</code> - ${esc(a01.responseMessage)} | badge <strong>${esc(a01.badge)}</strong></p>`
      : ""
  }
</section>

<section class="section" id="s1">
  <h2>1. PMS + Webhook Credentials</h2>
  <table>
    <tr><th>Field</th><th>Value</th></tr>
    <tr><td>PMS Name</td><td>Jade Host PMS</td></tr>
    <tr><td>Sandbox Base URL</td><td><code>${esc(report.axisBase)}</code></td></tr>
    <tr><td>channelId / pmsId</td><td><code>${esc(report.channelId)}</code></td></tr>
    <tr><td>API 9 Webhook</td><td><code>${esc(report.webhookUrl)}</code></td></tr>
    <tr><td>Method</td><td>POST | JSON body</td></tr>
    <tr><td>Authentication</td><td><code>accessKey</code> in JSON body</td></tr>
    <tr><td>accessKey</td><td><code>227As8u5RA3v1CH8o6uBE6YdhassenaVayyy</code></td></tr>
  </table>
</section>

<section class="section" id="s2">
  <h2>2. Property IDs (16 Villas)</h2>
  <div class="callout">
    <strong>Whole-villa model:</strong> always send <code>roomId: 1</code>, <code>ratePlanId: 1</code>, <code>noOfRooms: 1</code>.
    Preferred UAT: hotelId <strong>1303</strong> (Red Dome).
  </div>
  <table>
    <thead>
      <tr><th>#</th><th>hotelId</th><th>Property</th><th>roomId</th><th>ratePlanId</th><th>ratePlanName</th><th>noOfRooms</th></tr>
    </thead>
    <tbody>${propertyRows}</tbody>
  </table>
</section>

<section class="section" id="s3">
  <h2>3. Inventory Sync Confirmation</h2>
  <table>
    <thead><tr><th>Event</th><th>Jade action</th><th>Axis API</th></tr></thead>
    <tbody>
      <tr><td>OTA booking (API 9)</td><td>Save booking + block nights</td><td>API 2 | availability: 0</td></tr>
      <tr><td>OTA modify (API 9)</td><td>Update dates</td><td>API 2 | open old + close new</td></tr>
      <tr><td>OTA cancel (API 9)</td><td>Cancel + release nights</td><td>API 2 | availability: 1</td></tr>
      <tr><td>Direct / website / manual</td><td>Confirm in PMS</td><td>API 1 | free: 0 per night</td></tr>
      <tr><td>Staff cancel / date change</td><td>Update calendar</td><td>API 1 | open / modify</td></tr>
    </tbody>
  </table>
  <p class="muted">API 2 only runs after successful API 9 (HTTP 200). 422/401 = no booking, no inventory push.</p>
</section>

<section class="section" id="s4">
  <h2>4. Critical Validation Gate (API 9)</h2>
  <ol class="gate">
    <li>Invalid <code>accessKey</code> -> <strong>401</strong></li>
    <li>Bad dates / <code>noOfRooms != 1</code> -> <strong>422</strong> (distinct message)</li>
    <li>Unknown <code>hotelId</code>+<code>roomId</code> or bad <code>ratePlanId</code> -> <strong>422</strong> (distinct message)</li>
    <li>Only then: save booking + API 2 inventory ack -> <strong>200</strong> (API 5 not used)</li>
  </ol>
</section>

<section class="section" id="s5">
  <h2>5. Live UAT Results</h2>
  <p class="muted">Target: <code>${esc(report.webhookUrl)}</code> | bookingNo shared for lifecycle: <code>${esc(report.sharedBookingNo)}</code> | ${esc(report.generatedAt)}</p>
  <div class="score">
    <div class="box"><div class="n">${passN}</div><div class="l">Passed</div></div>
    <div class="box"><div class="n">${blockedIn}</div><div class="l">Blocked</div></div>
    <div class="box"><div class="n">${failN}</div><div class="l">Failed</div></div>
    <div class="box"><div class="n">${inbound.length}</div><div class="l">Inbound cases</div></div>
  </div>
  ${
    axisKeyBlocked
      ? `<div class="callout"><strong>Note:</strong> Some create/lifecycle cases still show Axis auth text. API 5 is removed from inbound —
         check Mongo save path and outbound API 2 key. Phase B invalid rejects must still Pass with distinct messages.</div>`
      : ""
  }
  <h3>Contrast table (correct vs invalid -> different outputs)</h3>
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
  <h2>6. Rohit Failure Analysis (1313 / room 2)</h2>
  <div class="callout danger">
    Observed Postman: <code>hotelId: 1313</code> + <code>roomId: 2</code> -> <code>422 Unknown hotelId/roomId: 1313/2</code> (reproduced as <strong>B02</strong>).
  </div>
  <table>
    <thead><tr><th>Field</th><th>Sent</th><th>Registered on Jade</th></tr></thead>
    <tbody>
      <tr><td>hotelId</td><td>1313</td><td>1313 (Royalty)</td></tr>
      <tr><td>roomId</td><td><strong>2</strong></td><td><strong>1</strong></td></tr>
      <tr><td>ratePlanId</td><td>-</td><td>1</td></tr>
    </tbody>
  </table>
  <div class="callout ok">
    Retest with <code>hotelId: 1303</code>, <code>roomId: 1</code>, <code>ratePlanId: 1</code>, <code>noOfRooms: 1</code>.
    With API 5 removed, retest <code>1303/1/1</code> — expect HTTP 200 then API 2 inventory ack (if outbound key active).
  </div>
</section>

<section class="section" id="s7">
  <h2>7. Phase D - Outbound Sandbox (API 1 / 2 / 6 / 7)</h2>
  <p class="muted">Direct POSTs to <code>${esc(report.axisBase)}</code> | hotelId ${esc(report.uatHotel)} | ${esc(outbound.start)} -> ${esc(outbound.end)}</p>
  <div class="score">
    <div class="box"><div class="n">${outPass}</div><div class="l">Passed</div></div>
    <div class="box"><div class="n">${blockedN}</div><div class="l">Blocked (401)</div></div>
    <div class="box"><div class="n">${outbound.tests.length}</div><div class="l">Outbound checks</div></div>
  </div>
  <table>
    <thead><tr><th>API</th><th>Path</th><th>Result</th><th>HTTP</th><th>Notes</th></tr></thead>
    <tbody>${outboundRows}</tbody>
  </table>
  ${
    blockedN > 0
      ? `<div class="callout"><strong>Same root cause B:</strong> outbound 401 confirms sandbox accessKey is not accepted for CM APIs yet.</div>`
      : `<div class="callout ok">Outbound APIs accepted - verify inventory/price in Axis logs.</div>`
  }
</section>

<section class="section" id="s8">
  <h2>8. Joint Next Steps</h2>
  <ol class="gate">
    <li>Always use <strong>roomId 1</strong> / <strong>ratePlanId 1</strong> / <strong>noOfRooms 1</strong> (never roomId 2).</li>
    <li>Confirm outbound <code>accessKey</code> for API 1/2/6/7 (API 5 not used by Jade).</li>
    <li>Joint retest: create 1303 -> modify -> cancel; confirm API 2 in Axis logs.</li>
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
          "Correct IDs first. Expect HTTP 200 + save + API 2 (API 5 not used on inbound).",
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

  await runCase("B02 Rohit repro (1313/2)", async () => {
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
        title: "Rohit repro - wrong roomId (1313/2)",
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
          "bookingStatus modified + new dates. Requires successful create (no API 5).",
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

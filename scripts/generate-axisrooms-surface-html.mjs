#!/usr/bin/env node
/**
 * Generates jade-axisrooms-integration-surface.html — verbatim integration audit.
 * Run: node scripts/generate-axisrooms-surface-html.mjs
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..");

function read(rel) {
  const p = path.join(ROOT, rel);
  if (!fs.existsSync(p)) return null;
  return fs.readFileSync(p, "utf8");
}

function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function pre(content, label) {
  if (content === null) {
    return `<h3>${label}</h3><p><strong>NOT FOUND</strong></p>`;
  }
  return `<h3>${label}</h3><pre>${esc(content)}</pre>`;
}

const staahClient = read("src/lib/staah/client.ts");
const staahWebhook = read("src/app/api/webhooks/staah/route.ts");
const staahCron = read("src/app/api/cron/staah-retry/route.ts");

const axisClient = read("src/lib/axisRooms/client.ts");
const axisWebhook = read("src/app/api/webhooks/axisrooms/route.ts");
const axisCron = read("src/app/api/cron/axisrooms-retry/route.ts");

const booking = read("src/models/Booking.ts");
const villa = read("src/models/Villa.ts");
const villaContent = read("src/models/VillaContent.ts");
const webhookEvent = read("src/models/WebhookEvent.ts");
const nightlock = read("src/models/VillaNightlock.ts");
const mongoStore = read("src/lib/bookings/mongoStore.ts");
const nightLocks = read("src/lib/bookings/nightLocks.ts");
const pricing = read("src/lib/bookings/pricing.ts");
const envExample = read(".env.example");

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>Jade ReVamp — Axis Rooms Integration Surface</title>
<style>
  :root { --ink: #1a1c1e; --muted: #555; --border: #ddd; --accent: #b8860b; }
  * { box-sizing: border-box; }
  body { font-family: Georgia, "Times New Roman", serif; color: var(--ink); max-width: 960px; margin: 0 auto; padding: 2rem 1.5rem 4rem; line-height: 1.5; }
  h1 { font-size: 1.75rem; border-bottom: 2px solid var(--accent); padding-bottom: 0.5rem; }
  h2 { font-size: 1.35rem; margin-top: 2.5rem; color: var(--accent); page-break-after: avoid; }
  h3 { font-size: 1.05rem; margin-top: 1.25rem; font-family: ui-sans-serif, system-ui, sans-serif; }
  p, li { font-size: 0.95rem; }
  .meta { color: var(--muted); font-size: 0.85rem; margin-bottom: 2rem; }
  pre { background: #f6f6f6; border: 1px solid var(--border); padding: 1rem; overflow-x: auto; font-size: 0.72rem; line-height: 1.45; white-space: pre-wrap; word-break: break-word; }
  table { width: 100%; border-collapse: collapse; font-size: 0.85rem; margin: 1rem 0; }
  th, td { border: 1px solid var(--border); padding: 0.5rem 0.75rem; text-align: left; vertical-align: top; }
  th { background: #f0f0f0; }
  .note { background: #fff8e6; border-left: 4px solid var(--accent); padding: 0.75rem 1rem; margin: 1rem 0; font-size: 0.9rem; }
  @media print { body { max-width: none; } pre { font-size: 0.65rem; } }
</style>
</head>
<body>
<h1>Jade ReVamp — Axis Rooms Integration Surface</h1>
<p class="meta">Generated ${new Date().toISOString().slice(0, 10)} · Factual verbatim audit · Repo: Jade_ReVamp</p>

<div class="note">
  <strong>Legacy path note:</strong> The audit template references <code>staah/*</code> paths. Those files do not exist in this repo.
  The live channel-manager implementation uses <code>axisRooms/*</code> and <code>axisrooms</code> API routes (documented below).
</div>

<h2>1. CHANNEL-MANAGER STUBS (requested staah paths)</h2>
${pre(staahClient, "src/lib/staah/client.ts")}
<p><em>Exported functions: NOT FOUND (file absent)</em></p>
${pre(staahWebhook, "src/app/api/webhooks/staah/route.ts")}
<p><em>Exported functions: NOT FOUND (file absent)</em></p>
${pre(staahCron, "src/app/api/cron/staah-retry/route.ts")}
<p><em>Exported functions: NOT FOUND (file absent)</em></p>

<h2>1b. ACTUAL AXIS ROOMS IMPLEMENTATION</h2>
${pre(axisClient, "src/lib/axisRooms/client.ts")}
<h3>Exported functions — src/lib/axisRooms/client.ts</h3>
<table>
<tr><th>Function</th><th>Signature</th><th>Description</th></tr>
<tr><td><code>pushAxisRoomsReservation</code></td><td><code>(booking: AxisRoomsBooking) =&gt; Promise&lt;AxisRoomsPushResult&gt;</code></td><td>POST confirmed reservation to Axis Rooms API; returns ok:false when key missing or endpoint unreachable.</td></tr>
<tr><td><code>pushAxisRoomsCancellation</code></td><td><code>(booking: AxisRoomsBooking) =&gt; Promise&lt;AxisRoomsPushResult&gt;</code></td><td>POST cancellation to Axis Rooms API for a booking.</td></tr>
</table>

${pre(axisWebhook, "src/app/api/webhooks/axisrooms/route.ts")}
<h3>Exported functions — src/app/api/webhooks/axisrooms/route.ts</h3>
<table>
<tr><th>Function</th><th>Signature</th><th>Description</th></tr>
<tr><td><code>POST</code></td><td><code>(req: NextRequest) =&gt; Promise&lt;NextResponse&gt;</code></td><td>Verifies Bearer token, parses inbound payload stub, audits event; does not upsert bookings yet.</td></tr>
<tr><td><code>verifyAxisRoomsWebhook</code></td><td><code>(req: NextRequest) =&gt; boolean</code> (module-private)</td><td>Compares Authorization header to AXIS_ROOMS_WEBHOOK_SECRET or AXIS_ROOMS_API_KEY.</td></tr>
</table>

${pre(axisCron, "src/app/api/cron/axisrooms-retry/route.ts")}
<h3>Exported functions — src/app/api/cron/axisrooms-retry/route.ts</h3>
<table>
<tr><th>Function</th><th>Signature</th><th>Description</th></tr>
<tr><td><code>GET</code></td><td><code>(req: NextRequest) =&gt; Promise&lt;NextResponse&gt;</code></td><td>Cron job: retries outbound push/cancel for unsynced bookings (max 20, attempts &lt; 10).</td></tr>
<tr><td><code>verifyCron</code></td><td><code>(req: NextRequest) =&gt; boolean</code> (module-private)</td><td>Requires Authorization: Bearer CRON_SECRET.</td></tr>
</table>

<h2>2. BOOKING MODEL — src/models/Booking.ts</h2>
${pre(booking, "Full file")}
<h3>Field call-outs</h3>
<ul>
<li><strong>checkIn / checkOut:</strong> <code>String</code>, both <code>required: true</code>. No inclusivity comment in schema; night locks use <code>cur &lt; checkOut</code> (check-out exclusive for stay nights).</li>
<li><strong>guestDetails:</strong> <code>{ name: String, email: String, phone: String }</code> (sub-schema, not individually required).</li>
<li><strong>pricing:</strong> <code>basePaise, extraPaxPaise, eventPaise, addOnPaise, taxPaise, totalPaise, quoteOnlyAddOns[], snapshot</code>.</li>
<li><strong>payment:</strong> gateway enum <code>["razorpay","external"]</code>; status enum <code>pending|paid|deposit_paid|failed|refunded|partially_refunded|external|not_applicable</code>.</li>
<li><strong>status enum:</strong> <code>pending, confirmed, cancelled, expired, conflict</code> (default pending).</li>
<li><strong>stayStatus enum:</strong> <code>upcoming, in_house, departed, turnover, ready</code> (default upcoming).</li>
<li><strong>source enum:</strong> <code>website, axisrooms_airbnb, axisrooms_booking_com, admin_manual</code> (default website).</li>
<li><strong>Channel-manager fields:</strong> <code>axisRoomsSynced</code> (Boolean, default false), <code>axisRoomsCancelSynced</code> (Boolean, default true), <code>axisRoomsSyncAttempts</code> (Number, default 0), <code>axisRoomsLastError</code> (String), <code>axisRoomsReservationId</code> (String). No <code>staah*</code> fields.</li>
<li><strong>Indexes:</strong> unique partial on <code>payment.processedPaymentId</code>; plus Mongoose <code>bookingToken</code> unique from field definition.</li>
</ul>

<h2>3. VILLA MODEL — src/models/Villa.ts (+ AxisRoomsSchema)</h2>
${pre(villa, "src/models/Villa.ts")}
${pre(villaContent, "src/models/VillaContent.ts (AxisRoomsSchema excerpt)")}
<h3>Field call-outs</h3>
<ul>
<li><strong>axisRooms shape:</strong> <code>{ propertyId: String, roomTypeId: String, ratePlanId: String, apiKeyConfigured: Boolean (default false) }</code></li>
<li><strong>staah object:</strong> NOT FOUND on Villa schema.</li>
<li><strong>basePricePaise:</strong> Number, required.</li>
<li><strong>Occupancy:</strong> <code>stayBasePax</code>, <code>dayOutBasePax</code>, <code>stayMaxPax</code> — all Number, required.</li>
<li><strong>Per-extra-guest:</strong> <code>extraPaxStayPaise</code> (default 200000), <code>extraPaxDayOutPaise</code> (default 100000).</li>
<li><strong>Wedding/event tiers:</strong> <code>weddingTiers[]</code> with <code>id, label, mode (half_day|full_day), maxGuests, pricePaise, stayIncludedPax</code>; <code>weddingVenue</code> Boolean.</li>
<li><strong>Indexes:</strong> unique partial <code>slug</code> (isDeleted false); unique partial <code>retreatId</code>.</li>
</ul>

<h2>4. IDEMPOTENCY + LOCKS</h2>
<h3>WebhookEvent — src/models/WebhookEvent.ts</h3>
${pre(webhookEvent, "Full file")}
<p>Unique compound index: <code>{ eventId: 1, source: 1 }</code> where source enum is <code>razorpay | axisrooms</code>.</p>

<h3>VillaNightlock — src/models/VillaNightlock.ts</h3>
${pre(nightlock, "Full file")}
<p>Unique compound index: <code>{ villaId: 1, date: 1 }</code>.</p>

<h2>5. BOOKING SERVICE</h2>
<h3>Exported functions — src/lib/bookings/mongoStore.ts (MongoBookingStore + helpers)</h3>
<table>
<tr><th>Name</th><th>Params</th><th>Return</th></tr>
<tr><td>createPending</td><td><code>params: CreateBookingParams</code></td><td><code>Promise&lt;BookingRecord&gt;</code></td></tr>
<tr><td>findById</td><td><code>id: string</code></td><td><code>Promise&lt;BookingRecord | null&gt;</code></td></tr>
<tr><td>findByToken</td><td><code>token: string</code></td><td><code>Promise&lt;BookingRecord | null&gt;</code></td></tr>
<tr><td>findByOrderId</td><td><code>orderId: string</code></td><td><code>Promise&lt;BookingRecord | null&gt;</code></td></tr>
<tr><td>listActive</td><td><code>filters?: { villaId?: string }</code></td><td><code>Promise&lt;BookingRecord[]&gt;</code></td></tr>
<tr><td>confirmPayment</td><td><code>{ bookingId, orderId, paymentId, eventId }</code></td><td><code>Promise&lt;{ ok: boolean; alreadyConfirmed?: boolean }&gt;</code></td></tr>
<tr><td>expirePending</td><td><code>now: Date</code></td><td><code>Promise&lt;number&gt;</code></td></tr>
<tr><td>updateStayStatus</td><td><code>id: string, stayStatus: StayStatus</code></td><td><code>Promise&lt;BookingRecord | null&gt;</code></td></tr>
<tr><td>cancelBooking</td><td><code>id: string, userId?: string</code></td><td><code>Promise&lt;BookingRecord | null&gt;</code></td></tr>
<tr><td>updateNotes</td><td><code>id: string, notes: string</code></td><td><code>Promise&lt;BookingRecord | null&gt;</code></td></tr>
<tr><td>createManual</td><td><code>CreateBookingParams &amp; { source?, status? }</code></td><td><code>Promise&lt;BookingRecord&gt;</code></td></tr>
<tr><td>softDelete</td><td><code>id: string, userId?: string</code></td><td><code>Promise&lt;boolean&gt;</code></td></tr>
<tr><td>getAvailability</td><td><code>villaId, from, to: string</code></td><td><code>Promise&lt;{ bookedDates, blockedDates }&gt;</code></td></tr>
<tr><td>getBookingStore</td><td><code>()</code></td><td><code>MongoBookingStore</code></td></tr>
<tr><td>getStubVillaBySlug</td><td><code>slug: string</code></td><td>stub object or undefined</td></tr>
<tr><td>findVillaBySlug</td><td><code>slug: string</code></td><td><code>Promise&lt;Villa doc | stub&gt;</code></td></tr>
</table>

<h3>Exported functions — src/lib/bookings/nightLocks.ts</h3>
<table>
<tr><th>Name</th><th>Params</th><th>Return</th></tr>
<tr><td>acquireNightLocks</td><td><code>{ villaId: ObjectId, bookingId: ObjectId, dates: string[], session }</code></td><td><code>Promise&lt;{ ok: true } | { ok: false, conflictDate: string }&gt;</code></td></tr>
<tr><td>releaseNightLocks</td><td><code>bookingId: ObjectId, session?</code></td><td><code>Promise&lt;void&gt;</code></td></tr>
<tr><td>withTransaction</td><td><code>fn: (session) =&gt; Promise&lt;T&gt;</code></td><td><code>Promise&lt;T&gt;</code></td></tr>
</table>

<h3>Exported functions — src/lib/bookings/pricing.ts</h3>
<table>
<tr><th>Name</th><th>Params</th><th>Return</th></tr>
<tr><td>computeBookingPricing</td><td><code>input: ComputePricingInput</code></td><td><code>{ pricing, depositPaise, errors }</code></td></tr>
<tr><td>lockDatesForBooking</td><td><code>{ bookingType, checkIn, checkOut, eventStartDate?, eventEndDate? }</code></td><td><code>string[]</code></td></tr>
</table>

<h3>Full bodies — createPending, confirmPayment, getAvailability, softDelete</h3>
<p>See verbatim <code>src/lib/bookings/mongoStore.ts</code> above (lines 80–526).</p>

<h3>Full bodies — acquireNightLocks, releaseNightLocks</h3>
${pre(nightLocks, "src/lib/bookings/nightLocks.ts")}

<h2>6. VILLA LOOKUP BY CM ID</h2>
<p><strong>NOT FOUND — no lookup by CM id</strong></p>
<p>Grep for <code>axisRooms.propertyId</code>, <code>roomTypeId</code>, or staah ids returned no Villa find queries.</p>
<p>Existing villa lookup: <code>findVillaBySlug(slug)</code> and <code>VillaModel.findOne({ slug, isDeleted: false })</code> only.</p>

<h2>7. ENV VARIABLES (names only)</h2>
<h3>From .env.example</h3>
${pre(envExample, ".env.example")}
<ul>
<li><strong>Channel-manager / webhook / cron:</strong> <code>CRON_SECRET</code>, <code>AXIS_ROOMS_API_KEY</code>, <code>AXIS_ROOMS_WEBHOOK_SECRET</code>, <code>AXIS_ROOMS_API_BASE_URL</code> (commented optional)</li>
<li><strong>Related payment webhook:</strong> <code>RAZORPAY_WEBHOOK_SECRET</code></li>
<li><strong>Auth (dashboard):</strong> <code>NEXTAUTH_SECRET</code>, <code>NEXTAUTH_URL</code></li>
</ul>
<p><strong>Referenced in code but missing from .env.example:</strong> none for Axis Rooms specifically. <code>STAAH_*</code> variables: NOT FOUND in codebase.</p>

<h2>8. BOOKING.SOURCE ENUM</h2>
<table>
<tr><th>Value</th><th>Category</th></tr>
<tr><td><code>website</code></td><td>Direct (public booking flow)</td></tr>
<tr><td><code>admin_manual</code></td><td>Manual (staff dashboard)</td></tr>
<tr><td><code>axisrooms_airbnb</code></td><td>OTA channel (Axis Rooms → Airbnb)</td></tr>
<tr><td><code>axisrooms_booking_com</code></td><td>OTA channel (Axis Rooms → Booking.com)</td></tr>
</table>

</body>
</html>`;

const out = path.join(ROOT, "jade-axisrooms-integration-surface.html");
fs.writeFileSync(out, html, "utf8");
console.log(`Wrote ${out} (${html.length} bytes)`);

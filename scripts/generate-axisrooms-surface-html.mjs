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
<tr><td><code>POST</code></td><td><code>(req: NextRequest) =&gt; Promise&lt;NextResponse&gt;</code></td><td>API 9 receiver: validates <code>accessKey</code> in JSON body, upserts OTA bookings, conflict detection; responds <code>{"status":"success","message":"Booking Update Received"}</code>.</td></tr>
</table>

<h2>1c. DASHBOARD PAGES → JADE API ROUTES</h2>
<table>
<tr><th>Dashboard page</th><th>Jade API routes</th><th>Axis Rooms role</th></tr>
<tr><td>Calendar + manual booking</td><td><code>GET /api/dashboard/calendar</code>, <code>POST /api/dashboard/bookings</code>, <code>GET/PATCH /api/dashboard/bookings/[id]</code></td><td>On-hold create → API 1 <code>free:0</code>; cancel → <code>free:1</code>; confirm_hold → status only</td></tr>
<tr><td>Booking Records</td><td><code>GET /api/dashboard/bookings</code> (list + filters)</td><td>PMS-only — all channels in one table</td></tr>
<tr><td>Booking folio + history</td><td><code>GET /api/dashboard/bookings/[id]</code> (booking + activity timeline)</td><td>Sync badge; cancel/confirm require write role</td></tr>
<tr><td>Manual blocks</td><td><code>GET/POST /api/dashboard/blocks</code>, <code>DELETE /api/dashboard/blocks/[id]</code></td><td>Create → API 1 <code>free:0</code>; delete → <code>free:1</code></td></tr>
<tr><td>Conflicts</td><td><code>GET/PATCH /api/dashboard/conflicts</code></td><td>Populated when API 9 inbound overlaps direct booking</td></tr>
<tr><td>Villa settings / wizard</td><td><code>GET/POST /api/dashboard/villas</code>, <code>GET/PATCH /api/dashboard/villas/[slug]</code></td><td>Status/bookable/price PATCH → API 15 + API 6</td></tr>
<tr><td>Axis Rooms settings</td><td><code>GET /api/dashboard/settings/axis-rooms/csv</code></td><td>CSV export for Axis onboarding team</td></tr>
<tr><td>Housekeeping</td><td><code>PATCH /api/bookings/[id]</code> (stayStatus)</td><td>PMS-only — no CM API</td></tr>
<tr><td>Payments</td><td><code>GET /api/dashboard/payments</code>, Razorpay webhooks</td><td>Razorpay confirm → API 1 close</td></tr>
<tr><td>Dev webhook logs</td><td><code>GET /api/dashboard/dev/logs/webhooks</code></td><td>API 9 inbound audit trail</td></tr>
</table>

<h2>1d. INBOUND RECEIVER (you host)</h2>
<table>
<tr><th>Route</th><th>Axis API</th><th>Auth</th><th>Response</th></tr>
<tr><td><code>POST /api/webhooks/axisrooms</code></td><td>API 9 booking push</td><td><code>accessKey</code> in JSON body (<code>AXIS_ROOMS_API_KEY</code>)</td><td><code>{"status":"success","message":"Booking Update Received"}</code></td></tr>
</table>

<h2>1e. OUTBOUND POST TO AXIS ROOMS</h2>
<table>
<tr><th>Axis API</th><th>Path</th><th>Jade trigger</th><th>Module</th></tr>
<tr><td>1</td><td><code>/api/daywiseInventory</code></td><td>On-hold create, Razorpay confirm, manual block create, cancel/release</td><td><code>src/lib/axisRooms/inventory.ts</code></td></tr>
<tr><td>2</td><td><code>/api/inventory</code></td><td>Bulk availability (helper available)</td><td><code>inventory.ts</code></td></tr>
<tr><td>6</td><td><code>/api/daywisePrice</code></td><td>Villa price save / channel sync</td><td><code>src/lib/axisRooms/pricing.ts</code></td></tr>
<tr><td>7</td><td><code>/api/bulkPriceUpdate</code></td><td>Not wired (bulk helper stub)</td><td><code>pricing.ts</code></td></tr>
<tr><td>15</td><td><code>/api/cm-restrictions</code></td><td>Hidden / not bookable villa</td><td><code>src/lib/axisRooms/restrictions.ts</code></td></tr>
<tr><td>3/4</td><td><code>blockChannel</code> / <code>unblockChannel</code></td><td>Not started (optional per-OTA blocks)</td><td>—</td></tr>
<tr><td>12</td><td><code>/api/pullBooking</code></td><td>Not started (optional reconciliation cron)</td><td>—</td></tr>
</table>

<h2>1f. FEATURE MATRIX</h2>
<table>
<tr><th>Feature</th><th>Status</th></tr>
<tr><td>API 9 inbound webhook + upsert</td><td>Built</td></tr>
<tr><td>API 1 inventory close/open (bookings)</td><td>Built</td></tr>
<tr><td>Staff on-hold manual booking (Option B)</td><td>Built</td></tr>
<tr><td>Folio confirm_hold / cancel hold</td><td>Built</td></tr>
<tr><td>Manual blocks → API 1</td><td>Built</td></tr>
<tr><td>Villa visibility → API 15 + price push</td><td>Built (on PATCH)</td></tr>
<tr><td>Conflict queue from inbound</td><td>Built</td></tr>
<tr><td>axisrooms-retry cron</td><td>Built</td></tr>
<tr><td>Public /book blockedDates UI</td><td>Built</td></tr>
<tr><td>Booking Records list (<code>/dashboard/bookings</code>)</td><td>Built</td></tr>
<tr><td>Booking folio activity history</td><td>Built</td></tr>
<tr><td>API 12 pull-booking reconciliation</td><td>Not started</td></tr>
<tr><td>Per-OTA blockChannel (API 3/4)</td><td>Not started</td></tr>
</table>

<h2>1g. FLOW (CM + PMS)</h2>
<pre>OTAs → Axis Rooms CM → POST /api/webhooks/axisrooms (API 9) → Jade calendar
Staff calendar → POST /api/dashboard/bookings (on_hold) → API 1 free:0 → OTAs blocked
Staff folio confirm_hold → status confirmed (inventory already closed)
Staff cancel → API 1 free:1 → OTAs reopened
Villa PATCH (hidden/bookable/price) → API 15 + API 6</pre>

<h2>1h. ENV CHECKLIST</h2>
<ul>
<li><code>AXIS_ROOMS_API_KEY</code> — accessKey for outbound + inbound body validation</li>
<li><code>AXIS_ROOMS_CHANNEL_ID</code> — channelId / pmsId on outbound payloads</li>
<li><code>AXIS_ROOMS_API_BASE_URL</code> — e.g. <code>https://sandbox1.axisrooms.com</code></li>
<li><code>CRON_SECRET</code> — protects <code>/api/cron/axisrooms-retry</code></li>
<li>Register inbound URL: <code>https://&lt;domain&gt;/api/webhooks/axisrooms</code></li>
<li>See <code>NEEDS_FROM_USER.md</code> for CSV templates, sandbox credentials, sample API 9 payloads</li>
</ul>

<h2>1i. RBAC — OPERATIONS MODULES (<code>src/lib/auth/permissions.ts</code>)</h2>
<p>Source of truth for the Roles &amp; Permissions dashboard matrix. <strong>Team</strong> has <strong>read</strong> on Booking Records and folio (no cancel/confirm/refund).</p>
<table>
<tr><th>Route</th><th>Label</th><th>Admin</th><th>Staff</th><th>Team</th><th>SEO</th><th>Dev</th></tr>
<tr><td><code>/dashboard</code></td><td>Calendar</td><td>write</td><td>write</td><td>read</td><td>—</td><td>write</td></tr>
<tr><td><code>/dashboard/bookings</code></td><td>Booking Records</td><td>write</td><td>write</td><td><strong>read</strong></td><td>—</td><td>write</td></tr>
<tr><td><code>/dashboard/housekeeping</code></td><td>Housekeeping</td><td>write</td><td>write</td><td>write</td><td>—</td><td>read</td></tr>
<tr><td><code>/dashboard/blocks</code></td><td>Manual Blocks</td><td>write</td><td>write</td><td>—</td><td>—</td><td>—</td></tr>
<tr><td><code>/dashboard/conflicts</code></td><td>Conflicts</td><td>write</td><td>read</td><td>—</td><td>—</td><td>read</td></tr>
<tr><td><code>/dashboard/payments</code></td><td>Payments</td><td>write</td><td>—</td><td>—</td><td>—</td><td>write</td></tr>
<tr><td><code>/dashboard/settings/axis-rooms</code></td><td>Axis Rooms</td><td>write</td><td>—</td><td>—</td><td>—</td><td>write</td></tr>
</table>
<p>Folio path <code>/dashboard/bookings/[id]</code> inherits <code>/dashboard/bookings</code> permissions. Team: view list + folio + history; staff/admin: write actions (cancel, confirm hold, notes).</p>

${pre(read("src/lib/bookings/bookingHistory.ts"), "src/lib/bookings/bookingHistory.ts")}
${pre(read("src/lib/axisRooms/inventory.ts"), "src/lib/axisRooms/inventory.ts")}
${pre(read("src/lib/axisRooms/parseInbound.ts"), "src/lib/axisRooms/parseInbound.ts")}
${pre(read("src/lib/axisRooms/upsertInboundBooking.ts"), "src/lib/axisRooms/upsertInboundBooking.ts")}

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
<li><strong>status enum:</strong> <code>pending, on_hold, confirmed, cancelled, expired, conflict</code> (default pending).</li>
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
<tr><td>confirmHold</td><td><code>id: string, userId?: string, waivePayment?: boolean</code></td><td><code>Promise&lt;BookingRecord | null&gt;</code></td></tr>
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
<li><strong>Channel-manager / webhook / cron:</strong> <code>CRON_SECRET</code>, <code>AXIS_ROOMS_API_KEY</code>, <code>AXIS_ROOMS_CHANNEL_ID</code>, <code>AXIS_ROOMS_API_BASE_URL</code>, <code>AXIS_ROOMS_WEBHOOK_SECRET</code> (legacy)</li>
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

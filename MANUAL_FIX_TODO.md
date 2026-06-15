# Jade_ReVamp — Manual fix tracker

**Policy:** All fixes are implemented **manually by a developer**. No AI-generated layout, spacing, styling, or interaction changes.

**Mark done:** Check `[ ]` → `[x]` only when the **Done when** sentence is true in the browser (desktop items = **1440px** width unless noted).

**Per item:** Figma measure → one file/class change → refresh → verify → commit (one intent per commit).

**Workflow:** One Phase 4 task at a time. Do not start the next ID until the current one is verified and logged below.

---

## Work queue — Phase 4

| | ID | Status |
|---|-----|--------|
| **Current** | V-01 | Pending |
| **Next** | V-01 → MP-01 → AB-01 → UI-01 → UI-02 → QA-01 | |

| ID | Task | Status |
|----|------|--------|
| M-01 | Menu page horizontal scroll (mobile) | [x] |
| M-02 | Featured Villas carousel swipe sensitivity | [x] |
| O-01 | FAQ behaviour consistency | [x] |
| O-02 | Overlay bottom action bar | [x] |
| O-03 | Success overlay consistency | [x] |
| O-04 | Career form success close (X) | [x] |
| O-05 | Overlay typography consistency | [ ] |
| F-01 | Mobile input zoom | [x] |
| V-01 | Villa category navigation glitch | [ ] |
| MP-01 | Menu page design refinements | [ ] |
| AB-01 | About Section 3 background | [ ] |
| CR-01 | Careers remove dot patterns | [x] |
| UI-01 | Header layout shift | [ ] |
| UI-02 | Section spacing & vertical rhythm | [ ] |
| BTN-01 | Global button height & width standardization | [ ] |
| QA-01 | Mobile browser consistency | [ ] |

---

# PHASE 4 — MOBILE, OVERLAY & UX FIXES

## Mobile Scrolling & Interaction

### M-01 — Menu Page Horizontal Scroll Not Working on Mobile

- [x] On the Menu page, the Experience and Villa image carousels are not horizontally scrollable on iOS and Android devices.

**Expected Result:**

- Users should be able to smoothly swipe through all image carousels.
- Horizontal scrolling should work consistently across all supported mobile browsers.

**Verify On:**

- iPhone Safari
- Chrome Android
- Samsung Internet

**Done when:** User can smoothly swipe through every Villa and Experience image rail on `/menu` mobile panels; vertical panel scroll still works.

**Files:** `src/app/menu/page.tsx`, `src/app/globals.css` (`.menu-mobile-hscroll-shell`)

**Fix:** Removed `touch-pan-y` from mobile Villas/Experiences vertical scroll wrappers (parent `touch-action: pan-y` blocked nested horizontal rails). Reinforced `touch-action: pan-x pan-y` on menu mobile h-scroll tracks for coarse pointers.

---

### M-02 — Featured Villas Carousel Swipe Sensitivity

- [x] The Featured Villas carousel currently requires excessive swipe movement before transitioning to the next card.

**Current Issue:**

- Swipe responsiveness feels slow and unresponsive.
- Users must drag too far before the next card is triggered.

**Expected Result:**

- Carousel should respond to smaller swipe gestures.
- Swipe interaction should feel smooth, natural, and responsive.
- Avoid accidental triggers while reducing the current swipe threshold.

**Done when:** On mobile/tablet, a light vertical scroll in Featured Villas snaps to the next villa card quickly. On desktop (lg+), section scroll is smooth/free with no snap; image carousel uses corner arrows only (no drag lock).

**Files:** `src/lib/useScrollLinkedSectionProgress.ts`, `src/components/FeaturedVillas.tsx`, `src/components/ui/CarouselNavImageFrame.tsx`

**Verify:** Home — mobile: small scroll flick advances villa card with snap animation. Desktop 1440px: continuous scroll through section; drag on image frame does not grab.

**Fix:** Mobile snap zone 200vh + **12vh exit** after CTA; dwell **0.18** (slight stick per card). CTA at end of horizontal track.

---

### O-01 — FAQ Behaviour Consistency

#### Experience / Venue Overlay

- [x] Clicking **View More** within the FAQ section should expand the remaining FAQ content within the same overlay.

#### Villa Detail Page

- [x] FAQ behaviour should follow the approved Villa Detail page design.

**Expected Result:**

- Overlay FAQ and Villa Detail FAQ should follow their respective approved designs.
- Both experiences should remain consistent and predictable.

**Done when:** Overlay FAQ VIEW MORE expands inline in Wedding/Party/Corporate overlays; villa detail `/villas/[id]` still opens FAQ drawer.

**Files:** `src/components/villa/VillaDetailFaqList.tsx`, `src/components/villa/VillaOverlayFaqPolicies.tsx`

**Verify:** Open venue overlay → FAQ → VIEW MORE shows remaining Q&A in same sheet (no second modal). Villa detail FAQ → VIEW MORE opens DetailsDrawer.

**Fix:** Overlay FAQ `expandInPlace`; villa detail drawers match Property Details sheet (chrome bar + green panel + diamond list).

---

### O-02 — Overlay Bottom Action Bar

- [x] Overlay bottom action bar positioning is inconsistent on iOS and Android devices.

**Current Issue:**

- The mobile browser navigation bar and the overlay pricing/action bar appear simultaneously.
- This creates overlapping UI and reduces usable screen space.

**Expected Result:**

- Overlay action bar should remain correctly positioned.
- No overlap with device browser navigation controls.
- Behaviour should remain stable during scroll, keyboard open/close, and browser UI transitions.

**Done when:** Venue overlay booking bar and form overlay CTAs sit above browser chrome + home indicator; site mobile nav hidden while any overlay is open.

**Files:** `src/lib/overlayMobileChrome.ts`, `src/lib/useOverlayMobileChrome.ts`, `src/lib/experienceOverlayTheme.ts`, `src/components/experience/VillaExperienceOverlayLayout.tsx`, `src/components/overlays/FormOverlayLayout.tsx`, `src/components/MobileBottomNav.tsx`

**Verify:** iPhone Safari + Chrome Android — open Wedding/Party venue overlay → pricing bar clears browser nav; no double bottom bars. Enquire/Partner overlay submit button not clipped.

**Fix:** visualViewport `--jade-overlay-browser-bottom-inset` sync; shared action-bar padding + scroll spacers; hide `MobileBottomNav` while overlays open.

---

### O-03 — Success Overlay Consistency

- [x] All successful form submissions should display a dedicated success overlay on Know More / venue overlays (Wedding, Corporate, Party).

**Expected Result:**

- Appears above all content.
- Background is dimmed.
- Matches approved design.
- Consistent across all overlay forms.
- Behaviour remains identical across mobile and desktop devices.

**Done when:** Venue Know More enquiry submit shows dimmed full-screen success (Partner pattern); OKAY dismisses overlay.

**Files:** `src/components/overlays/OverlayEnquirySuccessLayer.tsx`, `OverlayEnquirySuccessContent.tsx`, venue overlays, `PartnerOverlay.tsx`, `EnquireOverlay.tsx`

**Verify:** Party overlay → Plan Your Celebration → ENQUIRE NOW → success above dimmed content with social + OKAY.

**Fix:** Shared `OverlayEnquirySuccessLayer` uses Know More shell — mobile 92svh `bg-jade-green` sheet below 8svh band; desktop dimmed green modal. Matches Partner reference.

---

### O-04 — Career Form Success Screen Close Action

- [x] Career application success screen is missing a close (X) button.

**Expected Result:**

- Close button should be visible.
- Clicking close should dismiss the success state.
- User should remain on the Careers page after closing.

**Done when:** Mobile + desktop career apply success show active X; tap X closes modal and user stays on `/careers`.

**Files:** `src/app/careers/page.tsx`

**Verify:** Careers → Apply Now → submit (demo OK) → success shows X → tap X → modal closed, still on `/careers`. OKAY still navigates via `resolveEnquiryOkayReturnPath()`.

**Fix:** `handleApplyModalDismiss` closes on success; mobile `FormOverlayLayout` `canDismiss={canClose}`; desktop X no longer disabled on success.

---

### O-05 — Overlay Typography Consistency

- [ ] Typography inside overlays does not fully match the Villa Detail page.

**Expected Result:**

- Font sizes, line heights, spacing, and hierarchy should match the Villa Detail design system.
- Typography should remain consistent across all overlays.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

---

## Forms & Mobile Input Behaviour

### F-01 — Mobile Input Zoom Issue

- [x] Input fields trigger browser zoom on iOS and some Android devices.

**Current Issue:**

- Tapping an input field causes unwanted browser zoom.
- Zoom level does not properly reset after interaction.

**Expected Result:**

- No unwanted zoom behaviour.
- Consistent form interaction across all mobile devices.

**Scope:**

- Enquiry Forms
- Partner Forms
- Career Forms
- Footer Forms
- Overlay Forms
- Any remaining site-wide input fields

**Done when:** Tapping any input on mobile does not zoom the page; no stuck zoom after keyboard dismiss.

**Files:** `src/app/layout.tsx` (viewport export)

**Verify:** iPhone Safari + Chrome Android — Enquire, Partner, Footer, Careers, `/book`, venue overlays; tap fields → no page zoom. Note: pinch-zoom disabled site-wide (accepted tradeoff).

**Fix:** Viewport lock — `maximumScale: 1`, `userScalable: false` on root viewport meta. No font/UI changes.

---

## Villa Page Improvements

### V-01 — Category Navigation Glitch

- [ ] Villa category navigation is behaving incorrectly.

**Current Issue:**

- Clicking a category tab scrolls users back to the hero section.

**Expected Result:**

- Page position remains unchanged.
- Selected category updates instantly.
- Villa cards update dynamically.
- No jump-to-top behaviour.
- Category switching should feel seamless.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

---

## Menu Page

### MP-01 — Menu Page Design Refinements

- [ ] Menu page requires additional updates to match the latest approved design.

**Expected Result:**

- Layout matches design.
- Spacing matches design.
- Typography matches design.
- Interaction behaviour matches design.
- Mobile and desktop experiences remain consistent.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

---

## About Page

### AB-01 — Section 3 Background Update

- [ ] Remove the decorative dot pattern from Section 3.

**Replace With:**

- Green background treatment.
- Same visual fade treatment used in the Featured Villas section.
- Matching top fade.
- Matching bottom fade.

**Expected Result:**

- Section styling remains visually consistent with the Featured Villas design language.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

---

## Careers Page

### CR-01 — Remove Dot Patterns

- [x] Remove decorative dot patterns from the Careers page.

**Scope:**

- Career dropdown sections.
- Career detail panels.
- Any remaining decorative dot pattern elements on the Careers page.

**Expected Result:**

- Careers page should not contain decorative dot patterns unless explicitly specified in Figma.

**Done when:** Jobs section green fill is solid `#0B2C23` with no dot grid overlay.

**Files:** `src/app/careers/page.tsx`

**Verify:** `/careers` → scroll to Current Opportunities — no dotted pattern on green background.

**Fix:** Removed jobs section “Diamond Pattern Overlay” radial-gradient dot grid.

---

## Header & Layout Stability

### UI-01 — Prevent Layout Shift When Header Appears

- [ ] Page layout shifts when the header becomes visible.

**Current Issue:**

- Background and page content move slightly when the header appears.
- Creates an unstable visual experience.

**Expected Result:**

- Background remains fixed.
- Content remains static.
- Header appears without affecting page layout.
- No visual jumping or shifting.

**Reference:**

- StayVista navigation behaviour.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

---

## Global Spacing Review

### UI-02 — Section Spacing & Vertical Rhythm

- [ ] Review spacing between all major sections across mobile devices.

**Current Issue:**

- Some lower aspect-ratio devices display overly compact spacing.
- Vertical spacing is inconsistent between sections.

**Expected Result:**

- Balanced spacing throughout the website.
- Consistent visual rhythm across all pages.
- Mobile spacing should follow a standardized spacing system.
- Sections should not feel visually compressed on smaller screens.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

---

### BTN-01 — Global Button Height & Width Standardization

- [ ] Verify all primary CTAs use the shared 48px height token (`JADE_BTN_HEIGHT` via `PrimaryButton`).

**Standard:**

- Form/modal submits, section CTAs, success OKAY, booking footer actions: **48px** height (`width="form"` | `"section"` | `"compact"` as appropriate).
- Navbar BOOK: **44px** chrome exception (`JADE_BTN_CHROME_HEIGHT` via `size="chrome"`).
- Villa card VIEW / BOOK / ENQUIRE row: **48px** height, compact horizontal padding.

**Manual QA matrix (430px mobile, 768px tablet, 1440px desktop):**

| Surface | Check |
|---------|--------|
| Careers apply form | Submit Application matches Apply Now (48px) |
| Enquire / Partner / venue enquiry | Full-width form submit (48px) |
| Success overlays | OKAY button full-width (48px) |
| Section CTAs (weekend/party pages) | Section width profile on desktop |
| Villa card footer row | VIEW / BOOK / ENQUIRE aligned at 48px |
| Navbar BOOK | Still 44px, aligned to icon row |
| Book flow | PAY / NEXT / CONTINUE / PAY NOW at 48px |

**Browsers:** Chrome, Safari iOS, Firefox, Edge.

**Files:** `src/lib/jadeButtonTokens.ts`, `src/components/PrimaryButton.tsx`, migrated CTA consumers across `src/components/*`, `src/app/*`.

**Verify:** Spot-check bounding box height === 48px on form submits; navbar BOOK === 44px.

---

## Cross-Platform Quality Assurance

### QA-01 — Mobile Browser Consistency

- [ ] Verify all implemented fixes across supported mobile browsers.

**Required Platforms:**

- iPhone Safari
- Chrome Android
- Samsung Internet

**Expected Result:**

- Behaviour, spacing, animations, forms, overlays, and interactions should feel consistent across all supported mobile browsers.
- Experience should be comparable to Chrome reference behaviour wherever technically possible.

**Files:** N/A (verification pass)

**Verify:** Run after each Phase 4 fix batch; final pass when M-01–UI-02 complete.

---

## Phase 2 — Live backend (parallel track)

| Step | Command / action | Done |
|------|------------------|------|
| 1 | Install **Docker Desktop**, start it | [ ] |
| 2 | `npm run db:up` — Postgres on `5432` | [ ] |
| 3 | `npm run db:migrate` — Rathaa/partner, weekend source, careers indexing | [ ] |
| 4 | `.env.local`: `POSTGRES_PASSWORD=jade_local_dev_2026` (matches compose) | [ ] |
| 5 | `.env.local`: `NEXT_PUBLIC_ENQUIRY_DEMO_MODE=false` | [ ] |
| 6 | `.env.local`: `NEXT_PUBLIC_CAREERS_DEMO_MODE=false` (optional; follows enquiry if unset) | [ ] |
| 7 | Restart `npm run dev` | [ ] |
| 8 | `npm run api:smoke` → **201** from `/api/leads` + `/api/careers/apply` | [ ] |
| 9 | Browser: footer + Enquire submit → Network shows **201**, row in DB | [ ] |

**Scripts:** `npm run db:up` · `npm run db:migrate` · `npm run api:smoke` · `npm run setup:check`

**Migrations (order):** `schema_migration_leads_rathaa_partner_payments.sql` → `schema_migration_leads_weekend_source.sql` → `schema_migration_career_applications_indexing.sql`

---

## Figma reference table (fill in)

| Screen | Figma frame | Route |
|--------|-------------|-------|
| Home | | `/` |
| Villa detail | | `/villas/[id]` |
| Spaces | | `/villas/[id]/spaces` |
| Menu | | `/menu` |
| Contact | | `/contact` |
| About | | `/about` |
| Weekend getaways | | `/weekend-getaways` |
| Careers | | `/careers` |

---

## Commit log (Phase 4)

| Date | Commit | IDs |
|------|--------|-----|
| 2026-06-04 | `5eb731d` | M-01 |

---

## Notes / blockers

### Phase 2 backend

**Demo off:** `NEXT_PUBLIC_ENQUIRY_DEMO_MODE=false` and `NEXT_PUBLIC_CAREERS_DEMO_MODE=false` in `.env.local`; restart dev server.

**Verify:** `POST /api/leads` and `POST /api/careers/apply` return **201**; Enquire/Footer/Careers Apply persist rows (not demo-only success).

### Dev console (informational)

| Message | Cause | Mitigation in repo |
|---------|--------|-------------------|
| `Extra attributes: crxlauncher` | Browser extension on `<html>` | `suppressHydrationWarning` on `<html>` / `<body>` in `layout.tsx` |
| Sentry “browser extension” | Extension / URL context | Guard in `instrumentation-client.ts` |
| Logo preload warning | Duplicate navbar `priority` images | Removed `priority` from `Navbar.tsx` logos |
| `/api/villas/.../media` 500 | Often corrupt `.next` cache during dev | Delete `.next`, restart `npm run dev` |

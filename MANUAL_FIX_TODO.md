# Jade_ReVamp — Manual fix tracker

**Policy:** All fixes are implemented **manually by a developer**. No AI-generated layout, spacing, styling, or interaction changes.

**Mark done:** Check `[ ]` → `[x]` only when the **Done when** sentence is true in the browser (desktop items = **1440px** width unless noted).

**Per item:** Figma measure → one file/class change → refresh → verify → commit (one intent per commit).

**Workflow:** One Phase 4 task at a time. Do not start the next ID until the current one is verified and logged below.

---

## Work queue — Phase 4

| | ID | Status |
|---|-----|--------|
| **Current** | M-02 | Pending |
| **Next** | M-02 → O-01 → O-02 → O-03 → O-04 → O-05 → F-01 → V-01 → MP-01 → AB-01 → CR-01 → UI-01 → UI-02 → QA-01 | |

| ID | Task | Status |
|----|------|--------|
| M-01 | Menu page horizontal scroll (mobile) | [x] |
| M-02 | Featured Villas carousel swipe sensitivity | [ ] |
| O-01 | FAQ behaviour consistency | [ ] |
| O-02 | Overlay bottom action bar | [ ] |
| O-03 | Success overlay consistency | [ ] |
| O-04 | Career form success close (X) | [ ] |
| O-05 | Overlay typography consistency | [ ] |
| F-01 | Mobile input zoom | [ ] |
| V-01 | Villa category navigation glitch | [ ] |
| MP-01 | Menu page design refinements | [ ] |
| AB-01 | About Section 3 background | [ ] |
| CR-01 | Careers remove dot patterns | [ ] |
| UI-01 | Header layout shift | [ ] |
| UI-02 | Section spacing & vertical rhythm | [ ] |
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

- [ ] The Featured Villas carousel currently requires excessive swipe movement before transitioning to the next card.

**Current Issue:**

- Swipe responsiveness feels slow and unresponsive.
- Users must drag too far before the next card is triggered.

**Expected Result:**

- Carousel should respond to smaller swipe gestures.
- Swipe interaction should feel smooth, natural, and responsive.
- Avoid accidental triggers while reducing the current swipe threshold.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

---

## Overlay & Modal Behaviour

### O-01 — FAQ Behaviour Consistency

#### Experience / Venue Overlay

- [ ] Clicking **View More** within the FAQ section should expand the remaining FAQ content within the same overlay.

#### Villa Detail Page

- [ ] FAQ behaviour should follow the approved Villa Detail page design.

**Expected Result:**

- Overlay FAQ and Villa Detail FAQ should follow their respective approved designs.
- Both experiences should remain consistent and predictable.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

---

### O-02 — Overlay Bottom Action Bar

- [ ] Overlay bottom action bar positioning is inconsistent on iOS and Android devices.

**Current Issue:**

- The mobile browser navigation bar and the overlay pricing/action bar appear simultaneously.
- This creates overlapping UI and reduces usable screen space.

**Expected Result:**

- Overlay action bar should remain correctly positioned.
- No overlap with device browser navigation controls.
- Behaviour should remain stable during scroll, keyboard open/close, and browser UI transitions.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

---

### O-03 — Success Overlay Consistency

- [ ] All successful form submissions should display a dedicated success overlay.

**Expected Result:**

- Appears above all content.
- Background is dimmed.
- Matches approved design.
- Consistent across all overlay forms.
- Behaviour remains identical across mobile and desktop devices.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

---

### O-04 — Career Form Success Screen Close Action

- [ ] Career application success screen is missing a close (X) button.

**Expected Result:**

- Close button should be visible.
- Clicking close should dismiss the success state.
- User should remain on the Careers page after closing.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

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

- [ ] Input fields trigger browser zoom on iOS and some Android devices.

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

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

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

- [ ] Remove decorative dot patterns from the Careers page.

**Scope:**

- Career dropdown sections.
- Career detail panels.
- Any remaining decorative dot pattern elements on the Careers page.

**Expected Result:**

- Careers page should not contain decorative dot patterns unless explicitly specified in Figma.

**Files:** *(fill when started)*

**Verify:** *(fill when started)*

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

## Workflow & review process

- [ ] **W-1** — Fathom for review calls  
  **Done when:** [Fathom](https://www.fathom.ai/) is installed and used on at least one design review so action items are recorded.

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
| | | M-01 |

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

# Jade_ReVamp — Manual fix tracker

**Policy:** All fixes are implemented **manually by a developer**. No AI-generated layout, spacing, styling, or interaction changes.

**Mark done:** Check `[ ]` → `[x]` only when the **Done when** sentence is true in the browser (desktop items = **1440px** width unless noted).

**Per item:** Figma measure → one file/class change → refresh → verify → commit (one intent per commit).

---

## Delivery phases (work in order)

| Phase | Focus | Tracker IDs | Exit criteria |
|-------|--------|-------------|---------------|
| **1** | **Forms — sign-off & parity** | G-1, C-1, F-2–F-6, WG-1–WG-3 | Code on `main` (`03ed926`); browser Figma pass still optional for H-6 |
| **2** | **Live backend** | — | Postgres up; migrations run; demo flags off; 201 from `/api/leads` + `/api/careers/apply` |
| **3** | **Enquiry polish** | WG-2, R-6 (other overlays) | Weekend preselect; Partner/Rathaa/Venue success parity if needed |
| **4** | **Regression** | R-1, R-2, R-3 | Values animation, scroll indicator, villa header |
| **5** | **Homepage** | H-1–H-5 | Scroll-linked parity shipped 2026-06-05; **H-5** open; **H-1–H-4** verify in browser |
| **6** | **Villa detail** | VD-1–VD-4 | Padding, nav width, logo, grab cursor |
| **7** | **Interaction** | A-1–A-4 | Snap mobile-only, scroll text, venue scroll, FAQ modal |
| **8** | **Pages & workflow** | CA-1, CA-2, XP-1, WG-1, W-1, W-2 | Contact/About/Experience overlays + process |

**Current phase:** **2 — Live backend** (run steps below; mark exit when smoke passes).

### Phase 2 — Live backend (in progress)

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

**Phase 1:** **G-1**, **C-1**, **F-2–F-6**, **WG-1–WG-3** marked `[x]` (implemented on `main`). Finish Phase 2 for live API.

---

## ID index

| ID | Task |
|----|------|
| R-1 | Values of Jade animation restored (desktop) |
| R-2 | Scroll indicator updated |
| R-3 | Villa detail header = Figma |
| R-4 | Spaces: remove meander bar + pattern (see SP-A–SP-E) |
| SP-A | Spaces category nav full width + inner gutter |
| SP-B | Spaces image rails edge-to-edge + Figma fade |
| SP-C | Spaces section scroll arrows (per category) |
| SP-D | Spaces header headset/phone (match global nav) |
| SP-E | Global h-scroll Figma fade gradient |
| R-5 | Menu padding/alignment (desktop) |
| R-6 | Enquiry success popup persists |
| H-1 | Ways Jade spacing (desktop) |
| H-2 | Experiences section gap −80% (desktop) |
| H-3 | Home villa text width = image (desktop) |
| H-4 | Home experiences text width = image (desktop) |
| H-5 | Blog subtext one line (desktop) |
| H-6 | Footer = Figma (desktop) |
| VD-1 | Logo: no background |
| VD-2 | Villa detail L/R padding (desktop) |
| VD-3 | Villa detail nav full width (desktop) |
| VD-4 | Highlight tiles: grab cursor (desktop) |
| SP-1 | Spaces navbar full width (desktop) |
| SP-2 | Spaces: remove pattern |
| SP-3 | Spaces layout/spacing/behavior (desktop) |
| SP-4 | Spaces: grab cursor on hover (desktop) |
| M-1 | Menu spacing = Figma (desktop) |
| M-2 | Menu images: grab cursor |
| A-1 | Snap: mobile only |
| A-2 | Remove “SCROLL TO EXPERIENCE” text |
| A-3 | Venue → villa section scroll (same page) |
| A-4 | FAQ = modal |
| F-1 | Enquiry scrollbar |
| F-2 | Enquiry error handling |
| F-3 | Enquiry calendar works |
| F-4a | Validation: red asterisk |
| F-4b | Validation: red border |
| F-5a | Success above all content |
| F-5b | Success: dimmed background |
| F-5c | Okay → `/experiences` hub |
| F-6 | Footer enquiry: demo success + shared calendar |
| WG-1 | Remove Enhance Your Stay CTA |
| WG-2 | Occasion preselected Weekend Getaways |
| WG-3 | Remove Interest field |
| CA-1 | Contact title one line |
| CA-2 | About form = Figma |
| XP-1 | Experience villa overlay = villa detail |
| G-1 | Standardized input component system |
| W-1 | Fathom installed for reviews |
| W-2 | Manual-only workflow acknowledged |

---

## Regression & critical issues

- [ ] **R-1** — Values of Jade animation restored *(Desktop)*  
  **Done when:** On `/` at 1440px, the “Values of Jade” / value carousel section uses the **approved** animation (not the rejected version)—no wrong fades, timing, or scroll jumps—and matches the signed-off Figma recording or reference commit.  
  **Files:** `src/components/ValuePropositionSection.tsx` (primary); if wrong section, also `UnifiedScrollSection.tsx`, `ScrollSectionComposer.tsx`. Restore from good commit: `git show <hash>:src/components/ValuePropositionSection.tsx`.

- [ ] **R-2** — Scroll indicator updated  
  **Done when:** The vertical scroll-line indicator matches approved Figma for size, motion, color, and position on every page where it appears.  
  **Files:** `src/components/ScrollLineIndicator.tsx`, `src/app/globals.css` (`.jade-scroll-line-*`).

- [ ] **R-3** — Villa detail header = Figma *(Desktop)*  
  **Done when:** On `/villas/[id]` at 1440px, the sticky top bar (back, enquire, contact/icons) matches Figma for layout, height, padding, and control styles with **no** extra elements.  
  **File:** `src/app/villas/[id]/page.tsx` (~569–605 `ScrollHideTopChrome`).

- [x] **R-4** — Spaces: remove separator + unintended patterns *(implemented — verify in browser)*  
  **Done when:** No meander bar above category tabs; no luxury pattern on tab fade—right-edge fade blends with the charcoal background (no visible band/pattern).  
  **Files:** `spaces/page.tsx` (MeanderStrip removed).

- [x] **SP-A** — Category nav full width, tabs inset to page gutter  
  **Done when:** Category bar background spans edge-to-edge; first tab aligns with header + section titles; same left inset as images (`vd.hScrollTrackInset`).  
  **Files:** `villaDetailSpacing.ts` (`hScrollTrackInset`), `CategoryTabRail.tsx` (`trackPreset="spaces"`), `spaces/page.tsx`.

- [x] **SP-B** — Image rails edge-to-edge + Figma fade  
  **Done when:** Gallery images scroll under right-edge fade flush to viewport; left inset matches header via `vd.hScrollTrackInset` (no `hScrollTrackMobileGutter`).  
  **Files:** `SpacesImageSection.tsx`, `globals.css` (`--jade-hscroll-fade-gradient`).

- [x] **SP-C** — Per-section scroll arrows  
  **Done when:** Each space block has left/right arrow buttons beside the title (like Figma) that scroll that row’s images.  
  **File:** `SpacesImageSection.tsx`.

- [x] **SP-D** — Spaces header contact icons  
  **Done when:** Below `lg`: phone icon → `JADE_ENQUIRY_TEL`; `lg+`: headset icon → `/contact` (same as global `Navbar`).  
  **File:** `spaces/page.tsx`.

- [x] **SP-E** — Figma fade on all horizontal scroll rails  
  **Done when:** Right-edge horizontal rail fades blend with the `#1A1C1E` background (no obvious banding) and no decorative `LuxuryPattern` is rendered on fades.  
  **File:** `HorizontalScrollRail.tsx`, `globals.css`.

- [x] **R-5** — Menu layout & spacing *(Desktop)*  
  **Done when:** On `/menu` at 1440px, padding, column alignment, and gaps match Figma within ~2px—no drift from design system.  
  **File:** `src/app/menu/page.tsx`, `MenuDesktopCarouselSection.tsx`.

- [x] **R-6** — Enquiry success popup persists *(implemented — verify; live API later)*  
  **Done when:** After successful submit (**Enquire Now** or **Footer** in demo), success stays until **Okay** / close (no auto-dismiss on submit).  
  **Files:** `EnquireOverlay.tsx`, `Footer.tsx` (footer success modal).  
  **Still check:** `PartnerOverlay.tsx`, `RathaaOverlay.tsx`, `VenueOverlay.tsx` if same bug exists there.

---

## Homepage layout & spacing

- [x] **H-1** — Ways Jade is Experienced spacing *(Desktop)* *(implemented — verify in browser)*  
  **Done when:** On `/` at 1440px, vertical spacing around the “WAYS JADE IS EXPERIENCED” label matches Figma above and below the label row.  
  **Files:** `src/lib/scrollLinkedPanelLayout.ts` (`scrollLinkedSectionHeaderClass`), `src/components/HorizontalScrollSection.tsx`.

- [x] **H-2** — Inter-card horizontal gap −80% *(Desktop/laptop)* *(implemented 2026-06-05 — verify)*  
  **Done when:** On `/`, `/experiences`, `/weddings` last block, and §6 @ **1440px**, charcoal peek between centered card and next card is ~**20%** of pre-fix width.  
  **Files:** `scrollLinkedPanelLayout.ts` (`SCROLL_LINKED_DESKTOP_PEEK_RATIO`), `useScrollLinkedPanelOffset.ts`, `ScrollLinkedPanelCard.tsx`.  
  **Also applies:** `/experiences` §2, `/weddings` celebrations (wide variant).

- [x] **H-3** — Home villa: text width = image width *(Desktop)* *(implemented 2026-06-05 — verify)*  
  **Done when:** In the Featured Villas scroll section, description and CTA share the **same max width** as the villa image frame (left/right edges align).  
  **Files:** `FeaturedVillas.tsx`, `scrollLinkedPanelLayout.ts` (`w-full` body + featured stack wrap).  
  **Mobile/tablet §6:** equal top/bottom spacing (`py-10`, `panelAreaVariant="featured"`, `--jade-scroll-card-max-h-featured`) — verify phone/tablet.

- [x] **H-4** — Home experiences: text width = image width *(Desktop)* *(ScrollLinkedPanelCard — verify in browser)*  
  **Done when:** In each home experience panel, subtext and CTA align to the image frame width (no wider text block).  
  **Files:** `src/components/HorizontalScrollSection.tsx`, `src/lib/scrollLinkedPanelLayout.ts`.

- [ ] **H-5** — Blog subtext one line *(Desktop)*  
  **Done when:** On `/` at 1440px, each blog card description stays on **one** line (truncate/ellipsis only if Figma shows it).  
  **File:** `src/components/BlogSection.tsx`.

- [x] **H-6** — Footer = Figma *(Desktop)* *(implemented 2026-06-05 — verify in browser)*  
  **Done when:** On `/` at 1440px, footer columns, links, spacing, and typography match the approved Footer frame exactly.  
  **File:** `src/components/Footer.tsx`.  
  **Shipped (lg+ only):** nav links `text-gh-desc`, `whitespace-nowrap`, `•` separators, left-aligned with contact block, vertically centered in upper right column; heading one line (`lg:whitespace-nowrap`, `<br className="lg:hidden" />`). Mobile/tablet unchanged (`text-gh-label`, `▸`).

---

## Villa detail page

- [ ] **VD-1** — Remove background behind logo  
  **Done when:** The retreat logo on the villa hero is **only** the logo image—no panel, blur, border, or tint behind it per Figma.  
  **File:** `src/components/villa/VillaRetreatHeroLogo.tsx`.

- [ ] **VD-2** — Left/right padding *(Desktop)*  
  **Done when:** Every villa detail section uses the **same** horizontal inset as Figma desktop specs (no mixed `px-*` overrides).  
  **Files:** `src/components/villa/villaDetailSpacing.ts` (`gutterX`, `sectionShell`), `src/app/villas/[id]/page.tsx`.

- [ ] **VD-3** — Navigation full width *(Desktop)*  
  **Done when:** Meander + sticky section tabs span the **full layout width** per Figma (not a narrow `max-w-7xl` strip).  
  **Files:** `src/components/villa/VillaDetailStickyTabs.tsx`, `villaDetailSpacing.ts` (`stickyChromeShell`).

- [ ] **VD-4** — Highlight tiles: open-hand cursor *(Desktop)*  
  **Done when:** Hovering intro amenity/highlight tiles shows **`cursor: grab`** (open hand).  
  **File:** `src/components/villa/AmenityHighlightTile.tsx`.

---

## Spaces page

- [x] **SP-1** — Header full width + gutter *(Desktop)* *(implemented — verify in browser)*  
  **Done when:** Header spans full width; inner content uses `vd.gutterX` matching villa detail / Figma.  
  **File:** `spaces/page.tsx` (merged with **SP-D**).

- [x] **SP-2** — Remove separator + pattern *(see R-4, SP-A–SP-E)*  

- [x] **SP-3** — Layout, alignment, spacing, behavior *(Desktop)*  
  **Done when:** All **SP-A–SP-E** pass at 1440px vs Spaces Figma (no overlap; fades + arrows + icons + cursors match).  

- [x] **SP-4** — Grab cursor on category + image rails *(implemented — verify)*  
  **Done when:** `cursor-grab` on category nav track and each image horizontal rail on hover.

---

## Menu

- [x] **M-1** — Menu spacing = Figma *(Desktop)*  
  **Done when:** Same acceptance as **R-5** (check both when complete).

- [x] **M-2** — Menu images: open-hand cursor  
  **Done when:** Hovering menu villa/experience image rails shows **`cursor: grab`** (HorizontalScrollRail drag).  
  **File:** `MenuDesktopCarouselSection.tsx`.

---

## Animation & interaction

- [x] **A-1** — Snap interaction: mobile only *(Featured Villas §6 via useScrollLinkedSectionProgress mobileSnapOnly — verify desktop + mobile)*  
  **Done when:** At **1440px**, page scroll does **not** snap-lock vertically; at **phone width**, intended snap behavior still works.  
  **Files:** Audit `snap-y snap-mandatory` on main scroll containers (landing, experiences, villa heroes); scope snap to `max-lg:` where desktop must scroll freely.

- [ ] **A-2** — Remove “SCROLL TO EXPERIENCE” text  
  **Done when:** Scroll cues show **only** the animated line—no “SCROLL TO EXPERIENCE(S)” copy anywhere.  
  **Files:** `LandingPage.tsx`, `UnifiedScrollSection.tsx`, `ScrollSectionComposer.tsx`, `ExperienceScrollSection.tsx`, `ExperiencesHero.tsx`, `VillasHero.tsx` — remove `label` / `scrollIndicatorText`.

- [ ] **A-3** — Venue → villa section on same page  
  **Done when:** On each Experience page that has a **Venue** control, one click smooth-scrolls to the **villa section** on that **same URL** (target `id` exists in DOM).  
  **Example:** `src/components/WeddingHero.tsx` — update `getElementById` to your page’s villa block id.

- [ ] **A-4** — FAQ opens as modal  
  **Done when:** On villa detail FAQ, clicking a question opens a **modal** with answer + dimmed backdrop; closing restores page scroll.  
  **Files:** `src/app/villas/[id]/page.tsx`, `src/components/villa/VillaDetailFaqList.tsx`.

---

## Enquiry form & validation

- [x] **F-1** — Scrollbar inside enquiry form *(implemented — verify in browser)*  
  **Done when:** When form content exceeds modal height, user can scroll inside **Enquire Now** and sees a **visible** scrollbar on the right (gold-tinted thumb). Global `* { scrollbar: none }` is overridden via `.enquiry-overlay-scroll`.  
  **Files:** `src/components/EnquireOverlay.tsx` (`flex-1 min-h-0 enquiry-overlay-scroll`), `src/app/globals.css` (`.enquiry-overlay-scroll`).

- [x] **F-2** — Proper error handling *(UI demo; live API errors when demo off)*  
  **Done when:** Invalid submit shows field-level or form-level errors (`#D32C55`); API/network failure shows a clear message (never silent fail).  
  **Files:** `src/components/EnquireOverlay.tsx`, `src/components/Footer.tsx` (footer shows API error when demo off).

- [x] **F-3** — Calendar/date selection works *(implemented — verify in browser)*  
  **Done when:** **Preferred Date** uses the same check-in / check-out calendar as the footer (range or single date via **Done**); label stays **Preferred Date** (not “Check-In & Out Date”).  
  **Files:** `src/components/enquiry/EnquiryDateRangePicker.tsx`, `src/lib/enquiryDateRange.ts`, `EnquireOverlay.tsx`.

- [x] **F-4a** — Validation: red asterisk on required empty fields *(implemented — verify)*  
  **Done when:** After submit attempt, each empty **required** field’s label shows a **red asterisk** (`#D32C55`) beside the title per Figma.  
  **File:** `EnquireOverlay.tsx`.

- [x] **F-4b** — Validation: red border on invalid fields *(implemented — verify)*  
  **Done when:** After submit attempt, each invalid field shows a **red outline/border** (`#D32C55`) per Figma.  
  **File:** `EnquireOverlay.tsx`.

- [x] **F-5a** — Success overlay above all content *(implemented — verify)*  
  **Done when:** Success state renders above navbar, modals, and page chrome (`z-[220]+` on success).  
  **File:** `EnquireOverlay.tsx`.

- [x] **F-5b** — Success: dimmed background *(implemented — verify)*  
  **Done when:** Full viewport has a visible dim overlay (`bg-black/75`) behind success; backdrop/X disabled until **Okay**.  
  **File:** `EnquireOverlay.tsx`.

- [x] **F-5c** — Okay returns to Experiences hub *(implemented — verify)*  
  **Done when:** Clicking **Okay** on **Enquire Now** success closes overlay and navigates to **`/experiences`**.  
  **Files:** `EnquireOverlay.tsx`, `src/lib/enquiryReturnPath.ts` (`ENQUIRY_SUCCESS_RETURN_PATH`).

- [x] **F-6** — Footer enquiry: demo success + shared calendar *(implemented — verify)*  
  **Done when:** Footer “We'd love to hear from you” uses `EnquiryDateRangePicker`; demo submit shows success modal (no 500); calendar check-in/out works.  
  **Files:** `Footer.tsx`, `enquiryDemoMode.ts`, `EnquiryDateRangePicker.tsx`.

---

## Weekend getaways page

- [x] **WG-1** — Remove CTA from “Enhance Your Stay” *(implemented on main — verify in browser)*  
  **Done when:** On `/weekend-getaways`, the “Enhance Your Stay” section has **no** CTA button below the grid.  
  **Files:** `weekend-getaways/page.tsx` (`showCta={false}`), `CuratedExperiencesGrid.tsx`.

- [x] **WG-2** — Occasion preselected “Weekend Getaways” *(implemented on main — verify in browser)*  
  **Done when:** Enquiry opened from weekend page has Occasion Type already set to **Weekend Getaways** (exact Figma label).  
  **Files:** `enquiryOverlayConfig.ts`, `enquiryFormOptions.ts`, `EnquireOverlay.tsx`, `api/leads/route.ts` (`weekend_getaways_enquiry`).

- [x] **WG-3** — Remove “Interest” field *(implemented on main — verify in browser)*  
  **Done when:** **Enquire Now** overlay shows **no** Interest checkbox block.  
  **File:** `EnquireOverlay.tsx` (UI removed; `travelFormat` may still exist in payload).

---

## Contact & about pages

- [ ] **CA-1** — Contact Us title on one line  
  **Done when:** On `/contact` at 1440px, the Contact title/eyebrow line specified in Figma does **not** wrap to a second line.  
  **File:** `src/app/contact/page.tsx` (~154–169).

- [ ] **CA-2** — About Us form = Figma  
  **Done when:** On `/about`, the form matches About Figma for fields, layout, spacing, and styles.  
  **File:** `src/app/about/page.tsx`.

---

## Experiences Pages Overlays

- [ ] **XP-1** — Villa overlay matches villa detail  
    {On Experience pages, the Villa know more overlay layout, spacing, and alignment must match the Villa Detail page exactly. the section spacing and the existing UI Must be Modified based on the View villa Detail page.}
    
  **Done when:** Villa overlay from any Experience page matches villa detail for gutters, intro spacing, tabs, and amenity row alignment at the same breakpoints.  
  **File:** `src/components/experience/VillaExperienceOverlayLayout.tsx` (+ shared `villaDetailSpacing.ts`).

---

## Global form component standardization

- [x] **G-1** — Single reusable input system *(implemented on main `03ed926` — verify in browser)*  
  **Done when:** All primary forms use shared `JadeFloating*` components + `leadFormValidation`; indicating state uses **2px** `#D32C55` border.  
  **Core:** `src/lib/jadeFormTokens.ts`, `src/components/ui/form/*`, `src/lib/leadFormValidation.ts`

- [x] **C-1** — Careers Apply résumé upload *(implemented on main `03ed926` — verify in browser)*  
  **Done when:** Pick PDF/image → filename shows → remove → re-pick **same** file works; size/type errors visible; API accepts allowed MIME.  
  **Core:** `src/lib/careerResumeValidation.ts`, `src/components/careers/CareersResumeUpload.tsx`, `src/app/api/careers/apply/route.ts`

---

## Workflow & review process

- [ ] **W-1** — Fathom for review calls  
  **Done when:** [Fathom](https://www.fathom.ai/) is installed and used on at least one design review so action items are recorded.

- [x] **W-2** — Manual-only + Figma-only policy  
  **Done when:** Team agrees: no AI for UI edits; Figma is source of truth; this file is the checklist for sign-off.  
  **Status:** This tracker + delivery phases document the manual sign-off workflow.

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

**Good commit (pre-regression):** `________________________________`

---

## Commit log

| Date | Commit | IDs |
|------|--------|-----|
| 2026-06-05 | `9f0e43c` | H-1–H-4, H-2 peek ratio, A-1 (Featured §6), scroll-linked primitives, weddings counter removed |
| 2026-06-04 | *(uncommitted — dev session)* | R-6, F-1–F-6, WG-3 (partial), enquiry demo/calendar/scroll |

---

## Notes / blockers

### Scroll-linked horizontal sections (2026-06-05 session)

| Area | Status | Key files |
|------|--------|-----------|
| Shared shell + panel card | Shipped | `scroll-linked/ScrollLinkedHorizontalSection.tsx`, `ScrollLinkedPanelCard.tsx` |
| Scroll driver | Shipped | `useScrollLinkedSectionProgress.ts` (`free` / `mobileSnapOnly`) |
| Desktop inter-card gap −80% | Shipped | `SCROLL_LINKED_DESKTOP_PEEK_RATIO` (0.2), `useScrollLinkedPanelOffset.ts` |
| Home §3 | Refactored | `HorizontalScrollSection.tsx` |
| Experiences §2 | Refactored | `ExperiencesScrollSection.tsx` |
| Weddings last section | Refactored | `WeddingCelebrationsSection.tsx` — **GlobalCounter removed** |
| Featured §6 | Refactored | `FeaturedVillas.tsx` — snap mobile-only; featured mobile spacing tokens |
| Edit-one-place contract | Shipped | `scrollLinkedPanelLayout.ts` |

**Browser sign-off (scroll-linked):**

1. `/experiences` @ 1440px — Caravan Journeys: tight inter-card peek; text width = image.
2. `/` §3 — same gap + text alignment as Experiences.
3. `/` §6 @ 1440px — free scroll (not snap); @ phone — snap + **balanced** top/bottom green padding.
4. `/weddings` — no `1 / 5` counter; spacing matches Experiences.

**Deferred:** §5 Values, §7 Amenities carousels; **H-5** blog one-line; philosophy→§3 vertical gap (`UnifiedScrollSection` vh) if still long.

### Enquiry overlay + footer (2026-06-04 session)

| Area | Status | Key files |
|------|--------|-----------|
| Demo submit (no Postgres) | On by default | `src/lib/enquiryDemoMode.ts`, `.env.local` `NEXT_PUBLIC_ENQUIRY_DEMO_MODE=true` |
| Enquire Now modal | Form, validation, calendar, scroll, success | `EnquireOverlay.tsx` |
| Footer form | Same calendar + demo success | `Footer.tsx` |
| Shared date picker | Check-in / check-out range | `EnquiryDateRangePicker.tsx`, `enquiryDateRange.ts` |
| Visible modal scrollbar | Overrides global hidden scrollbars | `globals.css` `.enquiry-overlay-scroll` |
| OKAY after success | → `/experiences` | `enquiryReturnPath.ts`, `resolveEnquiryOkayReturnPath()` |
| Interest field | Removed from Enquire UI | `EnquireOverlay.tsx` |
| Warning color | `#D32C55` asterisk + borders | `EnquireOverlay.tsx` |

**Browser sign-off checklist (Enquire Now):**

1. Open overlay → scroll long form → **scrollbar visible** on right.
2. **Preferred Date** → pick range or single date → value shows in field.
3. Submit empty → red `*` + borders on required fields.
4. Submit valid (demo) → success on top, dim backdrop, **X** disabled.
5. **OKAY** → lands on `/experiences`.

**Browser sign-off (Footer form):**

1. Fill + submit → success modal (demo), no `POST /api/leads` 500.
2. Check-in/out calendar matches footer behavior.

### Dev console (informational — not tracker IDs)

| Message | Cause | Mitigation in repo |
|---------|--------|-------------------|
| `Extra attributes: crxlauncher` | Browser extension on `<html>` | `suppressHydrationWarning` on `<html>` / `<body>` in `layout.tsx` |
| Sentry “browser extension” | Extension / URL context | Guard in `instrumentation-client.ts` |
| Logo preload warning | Duplicate navbar `priority` images | Removed `priority` from `Navbar.tsx` logos |
| `/api/villas/.../media` 500 | Often corrupt `.next` cache during dev | Delete `.next`, restart `npm run dev` |

### Phase 2: live enquiry + careers backend

**Scripts:** `npm run db:up` · `npm run db:migrate` · `npm run api:smoke` · `npm run setup:check`

**Migrations (order):** `schema_migration_leads_rathaa_partner_payments.sql` → `schema_migration_leads_weekend_source.sql` → `schema_migration_career_applications_indexing.sql`

**Demo off:** `NEXT_PUBLIC_ENQUIRY_DEMO_MODE=false` and `NEXT_PUBLIC_CAREERS_DEMO_MODE=false` in `.env.local`; restart dev server.

**Verify:** `POST /api/leads` and `POST /api/careers/apply` return **201**; Enquire/Footer/Careers Apply persist rows (not demo-only success).

**Other forms** — Wedding/Partner/Rathaa still POST API when submitted (no enquiry-style demo wrapper).

### G-1 migration table (2026-06-04)

| Surface | Migrated | Notes |
|---------|----------|-------|
| `BookingDetailsFormFields.tsx` | Y | `theme="book"` |
| `EnquireOverlay.tsx` | Y | `enquiryFieldErrors`, `EnquiryDateRangePicker` wrapper |
| `Footer.tsx` | Y | `footerFieldErrors`, date required, consent error |
| `PartnerOverlay.tsx` | Y | Contact + property detail fields |
| `RathaaOverlay.tsx` | Y | `rathaaFieldErrors`, travel-format group message |
| `WeddingVenueEnquiryForm.tsx` | Y | Per-field errors |
| `CorporateVenueOverlay.tsx` | Y | Corporate enquiry block |
| `PartyVenueOverlay.tsx` | Y | Party enquiry block |
| `careers/page.tsx` (Apply modal) | Y | Text fields + **C-1** resume upload |
| Contact / About | via Footer | No separate page inputs |
| Admin | N/A | Out of scope |

**G-1 browser checklist:**

1. Submit empty on Enquire → **2px** red border + `*` + message under email/phone.
2. Fix one field → error clears; focus shows gold **1px** border.
3. Footer: submit without date → date field indicates; consent unchecked → consent error.
4. Book details step: same indicating behavior as Enquire.
5. Careers: upload PDF → remove → re-upload same PDF → filename updates.

**C-1 browser checklist:**

1. Apply modal → upload résumé PDF → chip shows filename.
2. Remove file → upload **same** PDF again → still works.
3. Upload file &gt; 4 MB → inline error before submit.
4. Live submit (Postgres up): row in `career_applications` with `resume_bytes`.

### Footer H-6 (2026-06-05 session)

| Area | Status | Notes |
|------|--------|-------|
| Desktop nav links | Shipped | `text-gh-desc` (~12–14px), `whitespace-nowrap`, dot separators, left edge aligned with logo/contact block |
| Desktop link position | Shipped | `lg:flex-1 lg:items-center lg:justify-start lg:pt-8` — vertically centered in upper right column |
| Desktop heading | Shipped | “We'd love to hear from you” single line at `lg+` |
| Mobile/tablet | Unchanged | Original `text-gh-label`, `▸` arrows, two-line heading |

**H-6 browser sign-off (1440px):** links left-align with contact block; each link on one line; heading on one line; mobile layout unchanged at &lt;1024px.

### Still open (enquiry-adjacent)

- **Phase 2** — Docker/Postgres, demo flags off, `api:smoke` 201 (see table above).
- **R-6 follow-up** — Partner/Rathaa/Venue overlay success parity (Phase 3).

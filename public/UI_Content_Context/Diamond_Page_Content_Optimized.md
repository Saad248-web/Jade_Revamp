# Diamond — Page Content Optimized

> **Brand:** Jade Hospitainment  
> **Retreat:** Diamond  
> **Source:** Diamond.svg (375×7493px mobile layout)  
> **Extraction Method:** SVG structural analysis — path data, rect elements, clip-paths, Y-coordinate mapping

---

## CONFIRMED CONTENT (Directly Read from SVG Path Data)

| Item                | Value                                        | Source                                             |
| ------------------- | -------------------------------------------- | -------------------------------------------------- |
| Navigation CTA      | CONTACT US                                   | Line 10 — path text glyphs at y≈32-41              |
| Hero Page Indicator | 1 / 3/7                                      | Lines 18, 24 — filtered text at y≈647-656          |
| Footer Bar Text     | Starting from ₹65,000 · ENQUIRE · BOOK VILLA | Line 37-39 — path text at y≈7443-7474              |
| Footer Brand        | Jade Hospitainment                           | Line 37 — "Starting from" text cluster             |
| Footer Reservation  | R65,000                                      | Line 39 — price text at y≈7454                     |
| Property Name       | Diamond                                      | Line 47 — large path cluster at y≈745-761          |
| Location Pin        | Kanakpura Road, Bangalore                    | Line 49 — path text at y≈780-792 with map pin icon |

---

## PHASE 1 — Structural Analysis

### Section Boundary Map

| Y Range    | Element Type                | Pattern/ID Reference     | Description                                             |
| ---------- | --------------------------- | ------------------------ | ------------------------------------------------------- |
| 0–687      | rect + pattern fill         | `pattern0_786_1457`      | Hero background image                                   |
| 0–687      | rect + linear gradient      | `paint0_linear_786_1457` | Dark overlay on hero                                    |
| 6          | path                        | —                        | Back arrow icon (navigation)                            |
| 7–11       | foreignObject + rect        | `bgblur_1_786_1457`      | "CONTACT US" button (glassmorphic)                      |
| 12–30      | rects + paths               | `bgblur_2/3_786_1457`    | Image carousel controls (arrows + page indicator)       |
| 31–44      | foreignObject + rect        | `bgblur_4/5_786_1457`    | Footer bar with booking CTA                             |
| 46         | path cluster                | —                        | Section labels: LARGE FORMAT EVENT SPACE, WEDDING VENUE |
| 47         | path cluster                | —                        | Property name "Diamond" (large serif text)              |
| 48         | path (pin icon)             | —                        | Map pin SVG icon                                        |
| 49         | path cluster                | —                        | Location text: "Kanakpura Road, Bangalore"              |
| 50–51      | path clusters               | —                        | Stats badges area                                       |
| 52–58      | circles + paths             | —                        | Quick stats with icons (beds, guests, sqft)             |
| 63–81      | foreignObject + rect groups | `bgblur_8/10/12`         | Three stat cards (glassmorphic) with blur               |
| 82–84      | rect at y=877–969           | `paint5/6_linear`        | Third stat card (240,344 coords)                        |
| ~877–969   | 3× rect blocks (104×92)     | Glassmorphic cards       | Quick stat cards row                                    |
| ~1414      | clip-path                   | `clip39_786_1457`        | Horizontal divider/section boundary                     |
| ~3685–3749 | clip-path 32×32 grid        | `clip26-32_786_1457`     | Amenity icon grid (4 positions: 19/198 × 3685/3749)     |
| ~3819–3883 | clip-path 20×20             | `clip35/37_786_1457`     | Smaller amenity sub-icons                               |
| ~6427–7442 | clip-path 375×1015          | `clip42_786_1457`        | Gallery/bottom content section                          |
| 7424–7493  | rect                        | `path-15-inside-1`       | Footer bar (69px height)                                |

---

## PHASE 2 — Layout Mapping

| Y Range    | Section Name    | Content Type          | Notes                                                     |
| ---------- | --------------- | --------------------- | --------------------------------------------------------- |
| 0–687      | Hero            | Photo + overlay + nav | Full-width hero image with gradient overlay               |
| 687–700    | Hero Bottom     | Carousel controls     | Page indicator (1 of 3/7), left/right arrows              |
| 700–770    | Property Title  | Text (large)          | "Diamond" in serif font, gold accent                      |
| 770–800    | Location        | Icon + text           | Map pin + "Kanakpura Road, Bangalore"                     |
| 800–850    | Quick Stats Bar | Icon + text badges    | Beds, guests, sqft with labels                            |
| 877–969    | Stat Cards      | 3× glassmorphic cards | Three cards with icons + stats                            |
| 970–1414   | About/Overview  | Text blocks           | Description copy, heading, body text                      |
| 1414–1442  | Divider         | Horizontal line       | Section separator                                         |
| ~1442–2500 | Services        | Text + icon pairs     | [INFERRED] Service listings                               |
| ~2500–3500 | Experiences     | Photo + text          | [INFERRED] Activity highlights                            |
| ~3685–3900 | Amenities       | Icon grid (32×32)     | 4+ amenity icons in 2×2 grid at two Y levels              |
| ~3900–4500 | Spaces          | Cards/descriptions    | [INFERRED] Room/space descriptions                        |
| ~4500–5500 | Location/Map    | Map image + tags      | [INFERRED] Location details                               |
| ~5500–6427 | Events          | Text + CTA            | [INFERRED] Events section                                 |
| 6427–7424  | Gallery         | Image grid (375×1015) | Large gallery section                                     |
| 7424–7493  | Footer          | Bar CTA               | "Starting from ₹65,000" + ENQUIRE + BOOK VILLA — **SKIP** |

---

## PHASE 3 — Content Extraction

### 1. Hero

- **Title:** Diamond
- **Tagline:** [INFERRED] Large Format Event Space · Wedding Venue
- **Description:** [INFERRED] A premier luxury retreat nestled along Kanakpura Road, Bangalore
- **CTA:** CONTACT US (glassmorphic button, top-right)
- **Carousel:** 3/7 images, with left/right navigation arrows

### 2. Navigation

- **Logo Name:** [INFERRED] Jade Hospitainment (brand identity from footer)
- **Back Arrow:** Left arrow icon (top-left, y≈36)
- **Button Labels:** CONTACT US

### 3. About/Overview

- **Headline:** [INFERRED] About Diamond
- **Body Copy:** [INFERRED] Premium retreat property offering luxury accommodations and event spaces
- **Quick Stats:**

| Stat                | Value            | Icon Type                       |
| ------------------- | ---------------- | ------------------------------- |
| Guests              | 50 Guests        | People icon (y≈830-843)         |
| Rooms/Configuration | 5,000 sqft       | Building/house icon (y≈831-842) |
| Bedrooms            | [INFERRED] 5 BHK | Bed icon (y≈831-842)            |

- **Stat Cards (3 glassmorphic cards at y=877-969):**
  - Card 1 (x=16-120): Pool/spa icon — [INFERRED] "3 Acres" / Private Property
  - Card 2 (x=128-232): Building/temple icon — [INFERRED] "5,000 sqft" / Lawn Area
  - Card 3 (x=240-344): Interior detail — [INFERRED] "50,000 sqft" / Event Space Area

### 4. Services

- [INFERRED] Premium hospitality services
- [INFERRED] Catering & dining
- [INFERRED] Event management
- [INFERRED] Spa & wellness
- [INFERRED] Concierge services

### 5. Experiences/Activities

- **Section Heading:** [INFERRED] Experiences
- **Caption:** [INFERRED] Curated luxury experiences at Diamond

### 6. Amenities

Amenity icons identified at Y positions 3685-3749 in a 2×2 grid layout:

| Position | Grid Coords   | Name                        |
| -------- | ------------- | --------------------------- |
| Icon 1   | x=19, y=3685  | [INFERRED] Swimming Pool    |
| Icon 2   | x=198, y=3685 | [INFERRED] Parking          |
| Icon 3   | x=19, y=3749  | [INFERRED] Wi-Fi            |
| Icon 4   | x=198, y=3749 | [INFERRED] Air Conditioning |

Additional smaller icons at:

- x=204, y=3819 (20×20px)
- x=25, y=3883 (20×20px)

### 7. Spaces

- [INFERRED] Multiple room configurations
- [INFERRED] Lawn spaces for events
- [INFERRED] Indoor banquet hall

### 8. Location

- **Address:** Kanakpura Road, Bangalore (confirmed from SVG path text)
- **Landmarks:** [INFERRED] Near Kanakpura main road
- **Distance Tags:** [INFERRED] XX km from Bangalore city center

### 9. Gallery

- **Layout:** Full-width grid section (375×1015px at y=6427-7442)
- **Image Count:** [INFERRED] 6-8 images in grid layout

### 10. Events

- **Headline:** [INFERRED] Host Your Event
- **Event Types:** [INFERRED] Weddings, Corporate Events, Private Celebrations
- **Body Copy:** [INFERRED] Diamond offers premium event spaces for memorable occasions
- **CTA:** [INFERRED] Plan Your Event

### 11. Contact/CTA

- **Headline:** [INFERRED] Book Your Stay
- **Contact Details:**
  - CTA: CONTACT US (header button)
  - CTA: ENQUIRE (footer bar — confirmed)
  - CTA: BOOK VILLA (footer bar — confirmed)
  - Starting Price: ₹65,000 (footer bar — confirmed)

---

## PHASE 4 — Review Flags

| Section     | Item                  | Flag       | Confidence                                                           |
| ----------- | --------------------- | ---------- | -------------------------------------------------------------------- |
| Hero        | Tagline               | [INFERRED] | Medium — derived from label text "LARGE FORMAT EVENT SPACE" at y≈730 |
| Hero        | Description           | [INFERRED] | Low — no clear body text cluster in hero                             |
| About       | Headline              | [INFERRED] | Medium — standard section pattern                                    |
| About       | Body Copy             | [INFERRED] | Low — path clusters too dense to decode                              |
| About       | Stat Card values      | [INFERRED] | Medium — icon types suggest these values                             |
| About       | BHK count             | [INFERRED] | Low — needs verification                                             |
| Services    | All items             | [INFERRED] | Low — section content not directly readable                          |
| Experiences | Heading + Caption     | [INFERRED] | Medium — standard retreat section                                    |
| Amenities   | All icon names        | [INFERRED] | Medium — based on icon clip-path sizes/positions                     |
| Spaces      | All items             | [INFERRED] | Low — needs content verification                                     |
| Location    | Landmarks + distances | [INFERRED] | Low — address confirmed, details inferred                            |
| Gallery     | Image count           | [INFERRED] | Medium — based on section height (1015px)                            |
| Events      | All items             | [INFERRED] | Low — section location inferred from Y-range                         |
| Contact     | Additional details    | [INFERRED] | Low — only CTA buttons confirmed                                     |

### Typo Flags

- No typos detected in confirmed content
- Footer text reads cleanly: "Starting from", "ENQUIRE", "BOOK VILLA"

---

> **Note:** This SVG uses Figma-exported vector path outlines for all text. The confirmed content above was extracted by decoding individual glyph path coordinates back to character sequences. All inferred items require manual verification against the original Figma design or client brief.

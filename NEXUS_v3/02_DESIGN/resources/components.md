# Component Completeness Gates
## Checklist.Design System — Required states for every component type
## A component is NOT done until ALL required states are defined.

---

## BUTTON

Required states: default · hover · active/pressed · focus · disabled · loading

```tsx
// Minimum complete button implementation
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  'aria-label'?: string;  // Required when icon-only
}

// Checklist:
// □ Default state — visible, correctly styled
// □ Hover state — visual change (@media (hover: hover) wrapper)
// □ Active/pressed state — scale(0.97) or translateY(1px)
// □ Focus-visible state — 2px outline, 2px offset
// □ Disabled state — opacity 0.5, cursor: not-allowed, pointer-events: none
// □ Loading state — spinner replaces content, remains same size, disabled
// □ Min 44px height (touch target)
// □ Min 44px width (touch target)
// □ cursor: pointer
// □ aria-label when icon-only
// □ type="button" by default (prevents accidental form submit)
```

---

## FORM / INPUT

Required states: default · focus · filled · error · disabled · success (optional)

```
INPUT CHECKLIST
□ Default — placeholder text visible, border subtle
□ Focus — border accent color, subtle box-shadow ring
□ Filled — value visible, correct contrast
□ Error — red border, error icon, error message below (not inside)
□ Disabled — gray background, cursor: not-allowed
□ Label — always visible (never placeholder as label)
□ Error message — role="alert" for screen readers
□ Required indicator — asterisk + aria-required="true"
□ Autocomplete attributes set appropriately
□ Min 44px height
□ Mobile: font-size 16px minimum (prevents iOS zoom)

FORM CHECKLIST
□ Submit prevents double-submission (disable during request)
□ Loading state on submit button
□ Success state shows confirmation (not just reset)
□ Error state shows which fields failed and why
□ Errors announced to screen readers (aria-live)
□ Tab order follows visual order
□ Form can be submitted via keyboard (Enter in last field)
□ Autofocus on first field (optional, but document if used)
```

---

## CARD

Required states: default · hover (if interactive) · loading (skeleton) · empty

```
CARD CHECKLIST
□ Default — background, border, radius, padding from tokens
□ Hover — only if clickable: translateY(-2px) + shadow increase
         Wrapped in @media (hover: hover)
□ Skeleton — skeleton animation matches card dimensions exactly
□ Image — aspect-ratio set on container (not image), object-fit: cover
□ Overflow — overflow: hidden on card when image present
□ Interactive card — entire card wrapped in <a> or has onClick
□ cursor: pointer on interactive cards
□ Link cards — entire area clickable, no nested interactive elements
□ Responsive — defines behavior at all 4 breakpoints
□ Text — title truncated with -webkit-line-clamp if needed
□ Empty/null state — no broken layout when data is missing
```

---

## NAVIGATION

Required states: default · active (current page) · hover · mobile (collapsed) · mobile (open)

```
NAV CHECKLIST
□ Current page — aria-current="page" on active link
□ Active state — visually distinct from hover
□ Hover state — @media (hover: hover) wrapper
□ Mobile hamburger — visible below 768px
□ Mobile open state — full overlay or drawer, all links accessible
□ Mobile close — Escape key + backdrop click closes
□ Body scroll lock when mobile nav is open
□ Focus trap in mobile nav when open
□ Skip-to-content link as first focusable element
□ Logo links to homepage (/)
□ Mobile min touch target 44px on all nav items
□ Sticky behavior — backdrop-filter: blur on scroll
□ Z-index from token (--z-sticky or --z-overlay)
```

---

## MODAL / DIALOG

Required states: closed · opening · open · closing · with loading · with error

```
MODAL CHECKLIST
□ Overlay — position: fixed, inset: 0, rgba bg, z-index: var(--z-modal)
□ Backdrop — click closes modal
□ Escape key — closes modal
□ Focus trap — Tab/Shift+Tab stays inside modal
□ Focus management — focus moves to modal on open, returns on close
□ aria-modal="true" on dialog element
□ aria-labelledby pointing to modal title
□ Body scroll lock when modal is open
□ Opening animation — scale(0.96) opacity:0 → scale(1) opacity:1
□ Closing animation — reverse, remove from DOM after animation
□ Responsive — full-screen on mobile (< 640px)
□ Close button — top-right, aria-label="Close", 44px touch target
□ Content scroll — modal body scrolls independently if content tall
□ Loading state — spinner, disable actions
□ Error state — inline error message
```

---

## TABLE

Required states: default · loading · empty · error · sortable columns · responsive

```
TABLE CHECKLIST
□ Responsive — horizontal scroll container on mobile, or card view
□ Loading — skeleton rows matching data rows
□ Empty state — centered message, icon, optional CTA (not just blank)
□ Error state — error message with retry option
□ Column headers — <th scope="col"> for accessibility
□ Row headers — <th scope="row"> if needed
□ Sortable — aria-sort="ascending/descending/none"
□ Selected rows — aria-selected on <tr>
□ Sticky header — stays visible on vertical scroll
□ Row hover — subtle bg change, @media (hover: hover)
□ Pagination — if applicable, always accessible
□ Responsive strategy chosen: scroll / collapse / cards
```

---

## ACCORDION / FAQ

Required states: closed · open · focus · disabled item

```
ACCORDION CHECKLIST
□ Trigger button — full width, not just text
□ Indicator — chevron rotates 180deg or + becomes ×
□ Animation — height transition (max-height: 0 → auto via JS)
□ aria-expanded on trigger button
□ aria-controls pointing to content panel
□ Content panel — role="region", aria-labelledby pointing to trigger
□ Keyboard — Enter/Space toggles, arrow keys navigate (optional)
□ Single vs multi-open — behavior consistent and documented
□ Focus state — visible on trigger
□ Disabled state — if applicable, aria-disabled
□ Nested accordions — avoid if possible, complex accessibility
```

---

## TOAST / NOTIFICATION

Required: success · error · warning · info · persistent (manual dismiss)

```
TOAST CHECKLIST
□ Position — top-right on desktop, top-center on mobile
□ Auto-dismiss — default 4s, longer for important messages
□ Manual dismiss — × button, 44px touch target
□ aria-live="polite" for info/success, "assertive" for error
□ Role="status" for info/success, "alert" for error/warning
□ Stack correctly — multiple toasts don't overlap
□ Pause on hover — auto-dismiss pauses while hovering
□ Progress indicator — optional, shows time remaining
□ Animation — slide in from edge, slide out to edge
□ Reduced motion — instant appearance, no slide animation
□ Max width — 360px, wraps text gracefully
```

---

## DROPDOWN / SELECT

Required states: closed · open · option hover · option selected · disabled · search (if applicable)

```
DROPDOWN CHECKLIST
□ Trigger — clearly indicates "opens a menu" (chevron icon)
□ Position — opens below by default, above if near viewport edge
□ Keyboard — Arrow keys navigate, Enter selects, Escape closes
□ aria-haspopup="listbox" on trigger
□ role="listbox" on options container
□ role="option" on each option
□ aria-selected on selected option
□ aria-activedescendant tracks focused option
□ Click outside — closes dropdown
□ Scroll behavior — dropdown stays within viewport
□ Search filter — if >10 items, add search input
□ Empty state — "No results" message
□ Mobile — consider native <select> for simple cases
```

---

## IMAGE / MEDIA

```
IMAGE CHECKLIST
□ alt text — descriptive for meaningful images, "" for decorative
□ loading="lazy" — on all below-fold images
□ width + height attributes — prevents CLS
□ aspect-ratio — set on container, not image
□ object-fit: cover — on images that fill containers
□ srcset — multiple sizes for responsive
□ WebP format with JPEG fallback
□ Skeleton placeholder — shows while loading
□ Error state — broken image fallback
□ Zoom/lightbox — if content image, consider lightbox
```

---

## HERO SECTION (Page-level component)

```
HERO CHECKLIST
□ Mobile-first layout (375px baseline)
□ Single clear headline — biggest, most prominent element
□ Subtext — 1–2 lines, readable at all sizes
□ Primary CTA — one clear action
□ Secondary CTA — optional, lower visual weight
□ Social proof — near CTA ("Loved by 10,000+ teams")
□ Visual element — supports message, doesn't compete
□ Background — vivid, on-brand, mobile-optimized
□ H1 tag — exactly one per page
□ LCP optimization — hero image/text loads first
□ Responsive text — clamp() on headline, wraps at 375px
□ 100dvh (not 100vh) if full-height
□ Above-the-fold CTA visible without scrolling on all 4 tiers
```

---

## RESPONSIVE VERIFICATION GATE

Run before any component is marked complete:

```
375px  (Mobile)
□ Single column layout
□ No horizontal overflow / scroll
□ Text readable (16px minimum)
□ Touch targets 44px+
□ All content accessible

768px  (Tablet)
□ Grid transition correct (1→2 cols or as specified)
□ Navigation transformed (hamburger → inline or drawer)
□ Sidebar appears if applicable
□ No awkward half-states

1280px (Desktop)
□ Full layout renders correctly
□ Hover states activate
□ Multi-column grids correct
□ Max-width container respected

1920px (Wide)
□ No stretched layouts
□ Content contained in max-w
□ Whitespace scales gracefully
□ Typography doesn't overflow tokens
```

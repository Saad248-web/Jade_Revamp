---
name: nexus-portfolio
description: "Personal portfolio site and case study system. Case study structure and storytelling framework, project page templates, show-don't-tell methodology, personal brand development, about page, skills showcase, contact conversion, GitHub/Behance/Dribbble integration. For designers, developers, and fullstack engineers. Use when building your own portfolio, case studies, project showcases, or any personal brand site."
triggers: ["portfolio", "case study", "about me", "personal brand", "personal site", "my work", "showcase project", "project page", "show my work", "hire me", "personal website", "developer portfolio", "designer portfolio", "resume site", "work showcase", "project presentation"]
---

# NEXUS PORTFOLIO Engine v3.0
**Show, don't tell. The best portfolio is a product — built with the same craft you claim to have.**

---

## The Core Philosophy

Your portfolio IS the interview. Every spacing decision, every micro-interaction, every loading state is a live demonstration of your skill. A designer whose portfolio has bad spacing or a developer whose site is slow is already failing the test.

**Three rules above all:**
1. **Show don't tell** — "I care about details" means nothing. A pixel-perfect site with correct spacing says it louder.
2. **One unforgettable thing** — What makes you different? Answer in 8 words or less. If you can't — keep thinking.
3. **Context + Problem + Solution + Impact** — Every case study follows this structure. Never just before/after screenshots.

---

## PHASE 1 — Personal Brand Brief (Complete Before Building)

```
IDENTITY
Name/Handle:        [Your name or brand]
Differentiator:     [What makes you different in 8 words or less]
Tone:               [3 adjectives: e.g. "precise, bold, unconventional"]
Target role:        [What job/client are you attracting?]
Anti-pattern:       [What don't you want to signal?]

AESTHETIC DIRECTION
Style:              [Choose from: minimal / bold / editorial / dark luxury / creative]
Primary color:      [One intentional accent]
Font system:        [Display + body pair from typography.md]
Motion style:       [Subtle / cinematic / playful]

CONTENT
Projects to show:   [2–5 best. Quality over quantity always]
Skills to signal:   [Top 5 — be specific, not generic]
Story to tell:      [Career arc in 2 sentences]
Social proof:       [Testimonials, companies, metrics]
```

---

## PHASE 2 — Site Architecture

```
/                   → Hero + Selected Work + Skills Signal + CTA
/work/[slug]        → Case Study (individual project page)
/about              → Story + Skills + Experience + Values + Photo
/contact            → Simple form or booking link
```

**Navigation law:** ≤ 5 nav items. Portfolio sites with 8 links look amateur.

---

## PHASE 3 — Hero Section (Make It Unforgettable)

The hero is the peak moment. The rest of the site either confirms or fails what it promises.

```
Structure:
[Available for work] badge — accent color, pulsing dot
[Name] — display font, hero size
[Differentiator in 8 words] — bold, clear, no jargon
[2-sentence bio] — who you serve and how
[Primary CTA: "View Work"] [Secondary CTA: "Contact Me"]
[Social proof: logos / metric / "Previously at X"]
```

**Entrance animation (mandatory):**
```tsx
// Name fades up first, then differentiator, then bio, then CTAs
// Stagger: 0.1s between each element
// Duration: 600ms, expo-out easing
const heroSequence = [
  { element: 'badge', delay: 0 },
  { element: 'name', delay: 0.1 },
  { element: 'tagline', delay: 0.2 },
  { element: 'bio', delay: 0.35 },
  { element: 'ctas', delay: 0.5 },
  { element: 'social-proof', delay: 0.65 },
];
```

---

## PHASE 4 — Case Study Structure (Show Don't Tell)

Every project page follows this exact structure. Deviation requires justification.

### The 6-Part Case Study Template

```markdown
## 01 — OVERVIEW
[1-paragraph hook. The problem, why it matters, your role.]
[Key metrics if available: "Reduced checkout abandonment by 34%"]

## 02 — THE PROBLEM
[Context: who, what, when, why it was broken]
[Avoid: "the client wanted X" — focus on user/business problem]
[Include: data, pain points, constraints]

## 03 — MY PROCESS
[Show the thinking, not just the output]
[Research → Ideation → Decisions → Rationale]
[Include: sketches, wireframes, decisions you rejected and why]
[This section separates junior from senior]

## 04 — THE SOLUTION
[Design/code decisions and why they work]
[Show: before → after comparisons]
[Show: component breakdowns]
[Show: responsive behavior at multiple viewports]
[Show: interaction patterns (link to prototype or demo)]

## 05 — TECHNICAL DEPTH (for dev/fullstack)
[Stack decisions and why]
[Performance: Lighthouse scores, load times]
[Architecture decisions: why this approach over alternatives]
[Accessibility: what you specifically implemented]

## 06 — IMPACT
[Results, metrics, feedback — be specific]
["Users loved it" = worthless. "Task completion increased 28%" = powerful]
[Testimonial if available]
[What you'd do differently]
```

### Case Study Visual Requirements
```
□ Hero image: full-width project screenshot or mockup
□ Before/after: explicit comparison, not implied
□ Process artifacts: sketches, wireframes, explorations (shows thinking)
□ Final result: multiple viewport sizes shown
□ Detail shots: the micro-interactions, the edge cases, the polish
□ Prototype link: interactive demo if possible
□ No stock photos — your actual work only
```

---

## PHASE 5 — Project Grid (Selected Work)

```tsx
// Project card — minimum required information
interface ProjectCard {
  title: string;           // Project name
  category: string;        // "Product Design" | "Full-Stack" | "Brand"
  tags: string[];          // ["React", "TypeScript", "Figma"] — max 4
  thumbnail: string;       // High quality screenshot or mockup
  slug: string;            // URL to case study
  highlight?: string;      // Optional: one standout metric "34% conversion lift"
}

// Grid: 2 col on tablet, 2 col on desktop (max 3 — quality over quantity)
// Featured project: full-width or 2-col span
// Hover: image zooms slightly (scale 1.05), overlay shows role + CTA
```

**Project selection rule:** Show your best 3–5, never 10+. More projects = more chances to show mediocre work. Every project shown is a vote for the quality of your judgment.

---

## PHASE 6 — Skills Signal Section

Never just a list of technology logos. Signal expertise through evidence.

```
WRONG:
[React logo] [TypeScript logo] [Figma logo]

RIGHT:
"I build with:"
React · TypeScript · Next.js · Tailwind · Framer Motion
↕
"Proven in:"
[Project name] — specific thing you built with this skill
```

**Or quantify:**
```
React        ████████████  4 years
TypeScript   █████████     3 years
UI Design    ██████████    4 years
```

---

## PHASE 7 — About Page

```markdown
# The Story (not the resume)

[Opening hook: the moment you knew this was your path]

[What drives you: specific, genuine, not cliché]

[How you work: process, collaboration style, what you obsess over]

[Where you've been: 3–5 companies/projects, outcome-focused not duty-focused]
"At [Company], I redesigned the onboarding flow and reduced drop-off by 40%"
NOT: "At [Company], I was responsible for UX design"

[What you're looking for: be specific — remote / in-person / type of work / team size]

[Outside work: 1–2 sentences — human, not performative]
```

---

## PHASE 8 — Contact Section (Convert Interest)

```
The goal: make it effortless to reach you.

Required:
□ Email (clickable mailto: link)
□ Response expectation ("I reply within 24 hours")
□ Best for (hiring / freelance / collaboration — pick your focus)

Optional but effective:
□ Calendar link (Calendly / Cal.com) — reduces friction to zero
□ LinkedIn
□ GitHub (for devs)
□ Dribbble / Behance (for designers)

NEVER:
□ Contact form with 8 fields
□ Captcha (signals you don't trust the person reaching out)
□ "Let's connect" with no actual way to connect
```

---

## PHASE 9 — Performance (This IS Your Demo)

A slow portfolio is the most expensive irony. Your site IS your technical demo.

```
Lighthouse targets (mandatory for devs, recommended for all):
□ Performance: 95+
□ Accessibility: 100
□ Best Practices: 100
□ SEO: 90+

□ LCP < 1.5s (hero image/text)
□ CLS = 0 (no layout shift — set image dimensions always)
□ No font flash (font-display: swap)
□ WebP images with dimensions specified
□ Preload critical fonts
```

---

## PHASE 10 — Portfolio-Specific Motion (Always On)

03_MOTION is mandatory for portfolio work. This is what separates entries from memorable ones.

**Signature moments to invest in:**
1. **Hero entrance** — staggered name + tagline + CTA reveal
2. **Project cards** — hover state: image zoom + overlay slide-up + "View Case Study"
3. **Case study reveals** — each section fades up as user scrolls
4. **Page transitions** — smooth fade between pages (100ms out, 200ms in)
5. **Scroll progress** — subtle progress bar for long case studies

**Design spell for portfolio (magnetic project cards):**
```tsx
// Project cards should feel physically attracted to the cursor
// Use MagneticButton pattern from design-spells.md
// Magnetism strength: 0.2 (subtle — not distracting from the work)
```

---

## Delivery Checklist

```
CONTENT
□ Differentiator stated in hero (8 words or less)
□ 2–5 projects max (quality over quantity)
□ Each case study: Problem + Process + Solution + Impact
□ Process artifacts shown (not just final output)
□ At least one metric per case study ("X% improvement")
□ About page tells a story, not a resume

DESIGN
□ Portfolio aesthetic matches the work you want to attract
□ Consistent font system throughout
□ 4-tier responsive verified (375/768/1280/1920)
□ UX laws applied (spacing, hierarchy, one CTA per viewport)
□ Hero is peak moment quality

PERFORMANCE
□ Lighthouse 95+ performance
□ LCP < 1.5s
□ Images: WebP, dimensions set, loading="lazy" below fold
□ No layout shift (CLS = 0)

MOTION
□ Hero entrance sequence animated
□ Project card hover states
□ Scroll reveals on case study sections
□ Page transitions
□ prefers-reduced-motion handled

CONTACT
□ Easy to reach (email or calendar link prominent)
□ Response expectation set
□ Social links functional
```

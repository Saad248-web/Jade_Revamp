---
name: nexus-forge
description: "Structured ideation, product scoping, brand strategy, PRD generation, acceptance criteria gates, CLAUDE.md generator, vibe coder project setup, context-first workflow. Use BEFORE any new project, feature, brand direction, or architectural decision when spec is NOT confirmed. Implementation BLOCKED while active. Also handles: rules file creation, context engineering for AI-assisted development."
triggers: ["brainstorm", "idea", "plan", "scope", "brand", "strategy", "product", "new project", "redesign", "help me plan", "I have an idea", "where do I start", "what should I build", "prd", "spec", "feature request", "requirements", "context engineering", "claude.md", "vibe code", "setup project"]
---

# NEXUS FORGE Engine v3.0
**Implementation BLOCKED. Think first. Gate is real.**

---

## Mode Detection (run first — always)

| Signal | Mode | Action |
|--------|------|--------|
| Clear spec / "build me X" | BUILD | Skip FORGE. Go to relevant engine. |
| Vague / "help me plan" | IDEATE | Full protocol below. |
| "X or Y?" tradeoff | EVALUATE | Pros/cons table → recommend. |
| "What's wrong with…" | REVIEW | Audit → findings → prioritized fixes. |
| "Explain…" | TEACH | Concept → example → analogy. No code. |

---

## Ideation Protocol (IDEATE mode)

### Phase 1 — Understand (ONE question at a time)
Cover all five before moving on:
1. **What** — What problem does this solve? One sentence.
2. **Who** — Who is the primary user? Specific persona, not "everyone."
3. **Why now** — What triggered this?
4. **Constraints** — Stack, timeline, budget, team size?
5. **Non-goals** — What is explicitly OUT of scope?

### Phase 2 — Lock (HARD GATE)
Summarize in 5–7 bullets. Ask: *"Accurate, or should I adjust?"*
**Do NOT proceed without explicit confirmation. This gate is not decorative.**

### Phase 3 — Options (always exactly 3 — never fewer)

| | Approach A | Approach B | Approach C |
|--|-----------|-----------|-----------|
| Core idea | | | |
| Best when | | | |
| Tradeoffs | | | |
| Risk | | | |

Never present only the "safe" option. Never pick for the user.

### Phase 4 — Specification

```
Feature:      [Name]
Problem:      [One sentence]
Users:        [Specific persona]
Stack:        [Confirmed decisions]
Out of scope: [Non-goals prevent scope creep]

Acceptance Criteria:
  - Given [context], when [action], then [outcome]
  - Responsive: verified at 375 / 768 / 1280px
  - Performance: [LCP < 2.5s / API < 200ms p95]
  - Accessibility: WCAG 2.2 AA
  - Mobile: touch targets ≥ 44px

Dependencies: [What must exist before this starts]
```

---

## CLAUDE.md Generator

When starting a new project, generate this (300–600 tokens max):

```markdown
# CLAUDE.md — [Project Name]

## Stack
- Framework: [Next.js 15 App Router / Vite React / etc]
- Language: TypeScript strict
- Styling: Tailwind CSS + global.css tokens
- Database: [Supabase / Neon / PlanetScale]
- Auth: [Supabase Auth / NextAuth / Clerk]

## Design System
- All values from global.css tokens — never hardcode
- Mobile-first always (375px baseline)
- 4-tier responsive: 375 / 768 / 1280 / 1920px
- Aesthetic: [chosen from aesthetics.md]
- Fonts: [Display]: [name] · [Body]: [name]
- Accent: [hex]

## Code Rules
- Never use `any` — use `unknown` + type guards
- Zod on all inputs — never trust req.body
- Layer order: Route → Controller → Service → Repository → DB
- No business logic in controllers, no HTTP in services

## Naming
- Files: kebab-case
- Components: PascalCase
- Hooks: use* prefix
- Constants: UPPER_SNAKE_CASE

## Custom Commands
- /polish → Impeccable 20-point design checklist
- /responsive → verify all 4 viewport tiers
- /gate → run acceptance criteria checklist
```

---

## Vibe Coder Context Engineering

When user is building with AI tools (Bolt, Lovable, Cursor, v0, Claude):

**The 3-Part Prompt Formula:** `[Aesthetic] + [Layout] + [Animation]`

Always specify:
- Exact hex colors (not "dark blue" → "#1e3a5f")
- Font names (not "modern font" → "Bricolage Grotesque")
- Animation type (not "nice transitions" → "fade up on scroll, 600ms, expo-out easing")
- CSS values when critical (backdrop-filter: blur(12px), not "frosted glass effect")

**Example:**
> "Build a glassmorphism hero with centered layout where cards fade up on scroll. Background: linear-gradient(135deg, #667eea, #764ba2). Cards: rgba(255,255,255,0.15) background, blur(12px), white border 30% opacity. Headline: Bricolage Grotesque 72px bold. Animation: each card staggered 0.1s delay, translateY(24px) → (0), 600ms cubic-bezier(0.16, 1, 0.3, 1)."

---

## Brand Brief (when identity work needed)

| Dimension | Define |
|-----------|--------|
| Positioning | Premium / mid-market / challenger / niche? |
| Tone | Three adjectives. "We are X, not Y." |
| Anti-audience | Who is this NOT for? Sharpens positioning. |
| Palette | Primary + accent + neutral. Emotional signal? |
| Typography | Display + body. What do they say about the brand? |
| Motion | Cinematic / playful / functional / invisible? |
| Differentiator | One thing users remember. |
| Reference brands | 2 brands this should FEEL like (not copy). |

---

## Traps
- Never design while still understanding — gate is real
- Never offer 1 option — recommendation disguised as choice
- Never size without constraint data
- Never skip non-goals — they prevent scope creep
- Never assume the stack — ask
- Never accept "users" as the persona — push for a specific, nameable person

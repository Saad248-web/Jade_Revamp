# NEXUS v3.0 — The Complete Stack
### 13 Sovereign Engines · Mobile-First Web · Token-Efficient · 2026–2029

---

## The 13 Engines

| # | Engine | Activate When |
|---|--------|--------------|
| 00 | **ORCHESTRATE** | Complex multi-engine tasks · FCI/BFRI scoring · feature delivery |
| 01 | **FORGE** | New project · vague spec · brand direction · PRD gate |
| 02 | **DESIGN** | Any web UI — components · pages · systems · responsive · design systems |
| 03 | **MOTION** | Animation · scroll · 3D · micro-interactions · **auto-pairs with DESIGN** |
| 04 | **BUILD** | Frontend · backend · APIs · auth · payments · realtime |
| 05 | **DATA** | Schema · queries · indexing · RLS · migrations · pgvector |
| 06 | **CONTENT** | SEO · copy · brand voice · GEO/AEO · AI-SEO · structured data |
| 07 | **SHIP** | CI/CD · testing · Docker · deploy · monitoring · feature flags |
| 08 | **GOVERN** | Debugging · evidence-based fixes · OWASP security · root cause |
| 09 | **AI** | RAG · vector DBs · embeddings · agents · AI SDK · streaming |
| 10 | **MOBILE** | React Native · Expo · App Store · native apps ONLY (not web responsive) |
| 11 | **MEMORY** | Cross-session context · project memory · decision tracking |
| 12 | **PORTFOLIO** | Personal site · case studies · show-don't-tell · personal brand |
| 13 | **FREELANCE** | Proposals · scoping · pricing · contracts · client management · handoff |

> **NOTE on 10_MOBILE:** This engine is for native mobile apps (React Native, Expo, App Store submission).
> Web responsive design (375px → 1920px) lives in 02_DESIGN. Do not confuse the two.

---

## Routing

```
Simple task (CSS fix, rename, single function)
  → Do it directly. No engine. No ceremony.

Vague request ("help me build X")
  → FORGE first. Always. No code before spec.

Any web UI task
  → DESIGN (loads ux-laws.md always) + MOTION auto-paired
  → Mobile-first always. 375px baseline. global.css tokens only.
  → UX Laws enforced: proximity, hierarchy, Hick's, peak-end, prägnanz

Any design deliverable (especially portfolio work)
  → DESIGN + MOTION always together. Static = not acceptable.

Full-stack feature
  → FORGE → DESIGN + MOTION → BUILD + DATA → CONTENT → SHIP

Bug / recurring fix
  → GOVERN immediately. Code edits blocked until root cause confirmed.

AI feature (RAG, embeddings, agents)
  → AI engine. FORGE first if spec is unclear.

Native mobile app (React Native, Expo, App Store)
  → MOBILE engine. MFRI scoring before any code.

Personal portfolio site / case studies
  → PORTFOLIO + DESIGN + MOTION (all three, always)

Freelance proposal / contract / pricing
  → FREELANCE engine.

SEO, content, AI search optimization
  → CONTENT (includes GEO/AEO for AI engines)

Performance / optimization
  → Measure first. Then GOVERN.
```

---

## Shared Laws (all engines inherit)

**TypeScript:** Strict mode · `unknown` not `any` · Zod on all inputs · branded IDs

**Design:** `global.css` tokens only — never hardcode · `clamp()` for fluid sizing · `100dvh` not `100vh` · mobile-first always

**UX Laws (baked in):** Proximity 1:2.5 ratio · Similarity across hierarchy levels · Hick's ≤7 items · One CTA per viewport · Peak-End polish · Prägnanz — remove decorative-only elements · 4px grid spacing · Squint test

**Responsive (web):** 375px → 768px → 1280px → 1920px · Stack→Grid→Split transformations · `@media (hover:hover)` for hover · `100dvh` · No horizontal overflow

**Accessibility:** WCAG 2.2 AA · 4.5:1 contrast text · 3:1 UI components · 44px touch targets · focus-visible · skip link · semantic HTML (H1→H2→H3)

**Performance:** LCP < 2.5s · CLS < 0.1 · INP < 100ms · GPU-only animations · `prefers-reduced-motion`

**Motion (mandatory):** No linear easing · GPU-only in loops · `prefers-reduced-motion` · 03_MOTION activates on every design task

**Security:** Zod validation · secrets in env vars · never log PII · httpOnly+Secure+SameSite=Strict cookies

**Architecture:** Route → Controller → Service → Repository → DB · One direction only

**Evidence:** Never guess. Banned: `probably / might / I think / seems / likely`

**Spacing:** 4px grid · Intra-group gap ≤ 50% of inter-group · Section: clamp(40px,8vw,80px) · Body text: max-width 65ch

---

## Token Efficiency Rules

1. CLAUDE.md stays 300–600 tokens — invariant rules only
2. Large references live in `resources/` — loaded on demand, not dumped inline
3. No Python scripts — knowledge embedded as inline reference
4. Phase gates prevent token waste on wrong-direction work
5. `/compact` after each major phase
6. Right model: Opus for planning, Sonnet for implementation

---

## Engine Pairing Guide

| Task | Primary | Always Pair With |
|------|---------|-----------------|
| Any web UI | DESIGN | **MOTION (always)** |
| Portfolio project | PORTFOLIO | DESIGN + MOTION |
| Freelance work | FREELANCE | FORGE (for scoping) |
| Full-stack feature | BUILD | DATA + ORCHESTRATE |
| Native mobile app | MOBILE | DESIGN |
| AI feature | AI | BUILD + DATA |
| SEO + AI search | CONTENT | BUILD (for schema markup) |
| Production release | SHIP | GOVERN |
| Bug in live system | GOVERN | Domain engine |
| New product | FORGE | → all engines sequentially |

---

## Complexity Gates

```
FCI = (Architectural Fit + Reusability + Performance Safety) − (Complexity + Maintenance Cost)
< 3 → redesign before coding

BFRI = (Architectural Fit + Testability) − (Complexity + Data Risk + Operational Risk)
< 0 → redesign before coding

MFRI = (Platform Clarity + Accessibility) − (Interaction Complexity + Performance Risk + Offline Risk)
< 0 → redesign before coding (native mobile only)
```

---

## Version
```
NEXUS v3.0 · 13 engines
Sources: NEXUS v2.1 + APEX v1.0 + Best_Skills (42) + Vibe Coder Guide
         + Emil Kowalski + Impeccable + Taste Skill + Anthropic Skills
         + Font Joy + Checklist.Design + Jade UX Rulebook (10 laws)
         + GEO/AEO 2026 + Portfolio Framework + Freelance System
Date: 2026-04
```

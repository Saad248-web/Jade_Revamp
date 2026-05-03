---
name: nexus-orchestrate
description: "Sovereign task orchestration. Issue gating, FCI/BFRI scoring, engine selection, feature delivery sequence, git quality gates, pattern memory. Use for complex multi-engine tasks, new features requiring confirmed acceptance criteria, coordinating multi-domain implementations. Brain before hands. Simple tasks bypass entirely."
triggers: ["orchestrate", "complex task", "multi-step", "new feature", "acceptance criteria", "plan feature", "coordinate", "full-stack feature", "multi-domain", "issue gate", "where do I start", "help me plan"]
---

# NEXUS ORCHESTRATE Engine v3.0
**Brain before hands. No criteria = no code. Simple tasks bypass entirely.**

---

## Phase 0 — Guardrail (always first)

| Task type | Action |
|-----------|--------|
| CSS fix, rename, typo, single function | **Solve directly. Skip this engine.** |
| New feature, multi-file, cross-domain | **Continue to Phase 1.** |
| Vague requirements ("make it better") | **Do NOT start. Run Phase 1 first.** |
| Bug that recurs | **Invoke GOVERN immediately.** |

---

## Phase 1 — Issue Gate (No Criteria = No Code)

```markdown
## Problem
[What is broken or missing? One sentence.]

## Goal
[What does success look like? One sentence.]

## Acceptance Criteria
- [ ] Given [context], when [action], then [outcome]
- [ ] Performance: [specific metric]
- [ ] Accessibility: WCAG 2.2 AA
- [ ] Responsive: verified at 375 / 768 / 1280px

## Non-Goals
[What is explicitly NOT in scope]
```

**Gate Rule:** No explicit, testable criteria → execution BLOCKED.

---

## Phase 2 — Feasibility Scoring

```
FCI = (Architectural Fit + Reusability + Performance Safety) − (Complexity + Maintenance Cost)
≥ 6: Proceed | 3–5: Simplify or split | ≤ 2: Redesign

BFRI = (Architectural Fit + Testability) − (Complexity + Data Risk + Operational Risk)
6–10: Safe | 3–5: Add tests + monitoring | 0–2: Refactor first | < 0: Redesign
```

---

## Phase 3 — Engine Selection

Select MINIMUM set. Don't activate all engines by default.

| Task | Primary | Pair With |
|------|---------|-----------|
| UI component / page | DESIGN | MOTION (if animated) |
| Full-stack feature | BUILD | DATA + ORCHESTRATE |
| Mobile screen | MOBILE | DESIGN |
| AI feature | AI | BUILD + DATA |
| Bug in production | GOVERN | Domain engine |
| New product | FORGE | → all sequentially |

---

## Phase 4 — Delivery Sequence (never skip steps)

```
Schema → Repository → Service → Controller → Route → Component → Test → Gate
```

Test-first protocol: write test before implementation — it defines the contract.

---

## Phase 5 — Git Quality Gates

```bash
npm install -D husky lint-staged @commitlint/cli @commitlint/config-conventional
npx husky init
```

```bash
# .husky/pre-commit
npx lint-staged

# .husky/commit-msg
npx --no-install commitlint --edit $1

# .husky/pre-push
npm run type-check && npm run test:unit -- --run --passWithNoTests
```

```js
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['feat','fix','refactor','perf','style','test','docs','chore','revert']],
    'subject-max-length': [2, 'always', 72],
  },
};
// feat(auth): add JWT refresh token rotation
// fix(cart): resolve price calculation error
// perf(db): add composite index on orders(user_id, status)
```

```js
// lint-staged.config.js
export default {
  '*.{ts,tsx,js,jsx}': ['eslint --fix', 'prettier --write'],
  '*.{css,json,md}': ['prettier --write'],
};
```

---

## Token Efficiency

- Use `/compact` after each major delivery phase
- CLAUDE.md stays 300–600 tokens — invariant rules only
- Reference files with `@filename` syntax — never paste entire files
- Right model: Opus for planning hard problems, Sonnet for implementation

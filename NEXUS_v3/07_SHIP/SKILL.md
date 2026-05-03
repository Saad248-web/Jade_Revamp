---
name: nexus-ship
description: "Testing (unit/integration/E2E/a11y), CI/CD pipelines, Docker multi-stage, deployment, monitoring (Sentry), environment management, feature flags (LaunchDarkly/GrowthBook/PostHog), analytics (PostHog/Mixpanel), Storybook component docs, Lighthouse CI, quality gates. Use when shipping to production, setting up quality gates, writing tests, or configuring pipelines. Code without tests is a liability."
triggers: ["test", "deploy", "docker", "ci/cd", "pipeline", "staging", "production", "monitoring", "health check", "vitest", "playwright", "jest", "coverage", "sentry", "lighthouse", "storybook", "feature flag", "analytics", "posthog", "mixpanel", "a/b test", "rollout", "ship", "release", "quality gate", "pre-deploy", "e2e"]
---

# NEXUS SHIP Engine v3.0
**Code without tests is a liability. Untested deploys are hope-driven. Every commit passes a gate.**

---

## Phase 1 — Testing Pyramid

| Layer | Tool | What to test |
|-------|------|-------------|
| Unit | **Vitest** | Pure functions, services, utilities, business logic |
| Component | **Testing Library** | Render, interact, accessibility, user behavior |
| Integration | **Vitest + Supertest** | API endpoints, service boundaries |
| E2E | **Playwright** | Critical user flows in a real browser |
| A11y | **axe-core + Playwright** | Automated WCAG 2.2 AA in CI |
| Visual | **Percy / Chromatic** | Catch unintended visual regressions |

**Test priority — write in this order:**
1. Revenue paths (checkout, payment, signup)
2. Auth flows (login, logout, token refresh)
3. Data mutations (create, update, delete — irreversible)
4. Edge cases (empty states, errors, concurrent access)

**Coverage targets:**
- 80% services and utilities
- 60% components
- 100% revenue-critical paths — no exceptions

---

## Phase 2 — Test Patterns

### Unit (Vitest)
```ts
describe('UserService.create', () => {
  it('rejects duplicate emails', async () => {
    await createUser({ email: 'a@b.com' });
    await expect(createUser({ email: 'a@b.com' }))
      .rejects.toThrow('Email already registered');
  });

  it('hashes password before saving', async () => {
    const user = await createUser({ email: 'b@b.com', password: 'plain123' });
    expect(user.password).not.toBe('plain123');
    expect(user.password).toMatch(/^\$2[aby]/);  // bcrypt prefix
  });
});

// Mocking
vi.mock('../api/stripe', () => ({
  createCheckout: vi.fn().mockResolvedValue({ url: 'https://stripe.com/...' })
}));
```

### Integration (Supertest)
```ts
it('POST /api/v1/users → 201 with valid payload', async () => {
  const res = await request(app).post('/api/v1/users')
    .send({ email: 'test@example.com', password: 'Password1!' });
  expect(res.status).toBe(201);
  expect(res.body.data).toHaveProperty('id');
});
```

### E2E (Playwright)
```ts
test('user completes checkout', async ({ page }) => {
  await page.goto('/products');
  await page.click('[data-testid="product-card"]');
  await page.click('[data-testid="add-to-cart"]');
  await page.click('[data-testid="checkout"]');
  await page.fill('[name="email"]', 'test@example.com');
  await page.click('[data-testid="pay"]');
  await expect(page.locator('[data-testid="order-confirmed"]')).toBeVisible();
});
```

### A11y in CI (axe-core + Playwright)
```ts
import { checkA11y, injectAxe } from 'axe-playwright';

test('homepage meets WCAG 2.2 AA', async ({ page }) => {
  await page.goto('/');
  await injectAxe(page);
  await checkA11y(page, undefined, {
    axeOptions: { runOnly: ['wcag2a', 'wcag2aa', 'wcag22aa'] },
    detailedReport: true,
  });
});
```

### Responsive Testing (Playwright)
```ts
const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

for (const vp of viewports) {
  test(`landing page renders at ${vp.name}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.width, height: vp.height });
    await page.goto('/');
    await expect(page).toHaveScreenshot(`landing-${vp.name}.png`);
    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(scrollWidth).toBeLessThanOrEqual(viewportWidth + 1);
  });
}
```

---

## Phase 3 — CI/CD Pipeline (GitHub Actions)

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test:unit -- --run
      - run: npm audit --audit-level=critical
      - run: npm run build

  a11y:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run test:a11y

  e2e:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npm run test:e2e

  lighthouse:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: treosh/lighthouse-ci-action@v11
        with:
          urls: |
            http://localhost:3000
            http://localhost:3000/pricing
          budgetPath: ./lighthouse-budget.json
          uploadArtifacts: true
```

```json
// lighthouse-budget.json
[{
  "path": "/*",
  "timings": [
    { "metric": "largest-contentful-paint", "budget": 2500 },
    { "metric": "cumulative-layout-shift",  "budget": 0.1 },
    { "metric": "total-blocking-time",      "budget": 300 }
  ],
  "resourceSizes": [
    { "resourceType": "script", "budget": 300 },
    { "resourceType": "image",  "budget": 500 }
  ]
}]
```

---

## Phase 4 — Docker (Multi-Stage Production)

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json .
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
RUN addgroup -S app && adduser -S app -G app    # Non-root user — always
COPY --from=deps    /app/node_modules ./node_modules
COPY --from=builder /app/.next        ./.next
COPY --from=builder /app/public       ./public
ENV NODE_ENV=production
USER app
EXPOSE 3000
CMD ["npm", "start"]
```

```
# .dockerignore
node_modules
.git
.env
.env.*
dist
coverage
*.log
```

---

## Phase 5 — Feature Flags

### PostHog (recommended — analytics + flags combined)
```ts
import PostHog from 'posthog-node';
const posthog = new PostHog(env.POSTHOG_KEY);

// Server-side flag check
const isEnabled = await posthog.isFeatureEnabled('new-checkout', userId);

// Client-side (React)
import { useFeatureFlagEnabled } from 'posthog-js/react';
const showNewCheckout = useFeatureFlagEnabled('new-checkout');
```

### GrowthBook (open-source alternative)
```ts
import { GrowthBook } from '@growthbook/growthbook';

const gb = new GrowthBook({
  apiHost: env.GROWTHBOOK_HOST,
  clientKey: env.GROWTHBOOK_KEY,
  attributes: { id: userId, country: 'US', premium: true },
});
await gb.loadFeatures();

const showFeature = gb.isOn('new-dashboard');
const variant = gb.getFeatureValue('checkout-cta', 'Get Started');
```

---

## Phase 6 — Analytics

### PostHog Event Tracking
```ts
import posthog from 'posthog-js';

// Page views (auto-captured)
posthog.init(env.POSTHOG_KEY, { api_host: 'https://app.posthog.com' });

// Custom events
posthog.capture('checkout_started', {
  plan: 'pro',
  amount: 29,
  currency: 'USD',
});

// User identification
posthog.identify(userId, {
  email: user.email,
  plan: user.plan,
  created_at: user.createdAt,
});
```

**Event taxonomy (define before building):**
```
page_viewed          → { path, referrer }
cta_clicked          → { location, text, destination }
signup_started       → { method: 'email' | 'google' }
signup_completed     → { method, plan }
checkout_started     → { plan, amount }
checkout_completed   → { plan, amount, currency }
feature_used         → { feature_name }
```

---

## Phase 7 — Storybook

```tsx
// components/Button/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  component: Button,
  parameters: { layout: 'centered' },
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;

export const Primary: StoryObj = { args: { variant: 'primary', children: 'Click me' } };
export const Loading: StoryObj = { args: { variant: 'primary', loading: true, children: 'Loading...' } };
export const Disabled: StoryObj = { args: { variant: 'primary', disabled: true, children: 'Disabled' } };
```

---

## Phase 8 — Monitoring

```ts
// Sentry setup (Next.js)
import * as Sentry from '@sentry/nextjs';
Sentry.init({
  dsn: env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  environment: env.NODE_ENV,
});

// Health endpoint (every service — no exceptions)
app.get('/health', async (req, res) => {
  const db = await checkDB();
  res.status(db ? 200 : 503).json({
    status: db ? 'healthy' : 'degraded',
    version: process.env.APP_VERSION,
    uptime: process.uptime(),
  });
});
```

**Alert thresholds:**
```
□ Error rate    > 1%      → alert
□ p95 latency   > 2s      → alert
□ DB pool       > 90%     → alert
□ Disk space    < 10%     → alert
□ SSL cert      < 14 days → alert
```

---

## Pre-Deploy Checklist

```
□ All CI checks green (type-check, lint, unit, a11y, e2e, build, audit)
□ Lighthouse CI: LCP < 2.5s, CLS < 0.1, no regressions
□ Staging deploy verified and smoke tested
□ Responsive tested at 375 / 768 / 1280px
□ DB migrations reversible — rollback tested
□ New env vars set in production
□ No console.log in production paths
□ Error handler strips stack traces from responses
□ Rollback plan written (not just in your head)
□ Previous image/commit tagged for quick rollback
□ Feature flags configured for gradual rollout
□ Monitoring + alerts active
□ Analytics events firing correctly
```

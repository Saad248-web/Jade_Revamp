---
name: nexus-build
description: "Full-stack application code — Next.js, Hono, NestJS, FastAPI. APIs, auth (JWT/OAuth/Passkeys), payments (Stripe), caching (Redis), realtime (WebSocket/SSE), GraphQL, state management (Zustand/Jotai/XState), file uploads (S3/R2), email (Resend/React Email), i18n (next-intl), monorepo (Turborepo). BFRI scoring before complex work. Use when writing any application logic."
triggers: ["api", "endpoint", "route", "controller", "service", "auth", "jwt", "oauth", "payment", "stripe", "webhook", "cache", "redis", "websocket", "realtime", "backend", "frontend", "fullstack", "graphql", "apollo", "state management", "zustand", "jotai", "file upload", "s3", "email", "resend", "i18n", "internationalization", "monorepo", "turborepo", "nestjs", "hono", "fastapi", "next.js"]
---

# NEXUS BUILD Engine v3.0
**Route → Controller → Service → Repository → DB. Never skip layers. BFRI before complex work.**

---

## Phase 0 — BFRI

```
BFRI = (Architectural Fit + Testability) − (Complexity + Data Risk + Operational Risk)
6–10: Safe | 3–5: Add tests + monitoring | 0–2: Refactor first | < 0: Redesign
Simple tasks bypass BFRI.
```

---

## Phase 1 — Framework Selection

| Framework | When |
|-----------|------|
| **Next.js App Router** | Full-stack React, SSR/SSG, SEO-critical |
| **Hono** | Edge APIs, Cloudflare Workers, Bun, ultra-fast BFF |
| **NestJS** | Enterprise, DI, large teams, structured modules |
| **FastAPI** | ML/AI backends, async Python, Pydantic V2 |

---

## Phase 2 — Architecture Law

| Layer | Allowed | Forbidden |
|-------|---------|-----------|
| Controller | Orchestrate, validate input, delegate | Business logic, DB calls |
| Service | Business logic, transactions | HTTP concerns, direct DB |
| Repository | DB access only | Business logic, HTTP |

**One direction only: Controller → Service → Repository → DB. Crossing layers = bug.**

---

## Phase 3 — API Design

```ts
// Response envelope (every endpoint)
{ data: T | null, error: null, meta?: { page, total, nextCursor } }
{ data: null, error: { code: string, message: string } }

// REST standards
GET    /api/v1/users      → 200
POST   /api/v1/users      → 201
PATCH  /api/v1/users/:id  → 200
DELETE /api/v1/users/:id  → 204

// Cursor pagination (never OFFSET)
GET /api/v1/items?cursor=eyJpZCI6MTB9&limit=20
```

---

## Phase 4 — Validation (Zod — mandatory)

```ts
const Schema = z.object({
  email:    z.string().email(),
  password: z.string().min(8).max(72),
  name:     z.string().min(1).max(200).trim(),
  price:    z.number().positive().multipleOf(0.01),
});
type DTO = z.infer<typeof Schema>;

const result = Schema.safeParse(req.body);
if (!result.success) return res.status(400).json({ error: result.error.flatten() });
```

---

## Phase 5 — Auth

| Strategy | When |
|----------|------|
| JWT + refresh rotation | Microservices, mobile, stateless APIs |
| Session + Redis | SSR web apps, instant revocation |
| OAuth 2.0 | Social login, third-party |
| Passkeys / WebAuthn | Passwordless, phishing-resistant |

```ts
// JWT: access 15min in header, refresh 7d in httpOnly cookie
res.cookie('refreshToken', token, {
  httpOnly: true, secure: true, sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api/auth',
});
```

---

## Phase 6 — State Management

| Tool | When |
|------|------|
| **Zustand** | Global UI state, simple stores, < 5 slices |
| **Jotai** | Atomic state, derived state, fine-grained |
| **TanStack Query** | Server state, caching, synchronization |
| **XState** | Complex workflows, multi-step forms, state machines |
| **Context** | Theme, auth user — infrequent updates only |

```ts
// Zustand store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(persist(
  (set) => ({
    user: null,
    theme: 'light',
    setUser: (user) => set({ user }),
    toggleTheme: () => set(s => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
  }),
  { name: 'app-storage' }
));
```

---

## Phase 7 — File Upload (S3 / R2)

```ts
// Presigned URL pattern — client uploads directly to S3
// Server generates presigned URL, never handles file bytes
export async function POST(req: Request) {
  const { fileName, fileType } = await req.json();

  const key = `uploads/${nanoid()}-${fileName}`;
  const command = new PutObjectCommand({
    Bucket: env.S3_BUCKET,
    Key: key,
    ContentType: fileType,
    ContentLength: MAX_FILE_SIZE,
  });

  const url = await getSignedUrl(s3Client, command, { expiresIn: 300 });
  return Response.json({ uploadUrl: url, key });
}

// Client uploads directly
const res = await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type },
});
```

---

## Phase 8 — Email (Resend + React Email)

```tsx
// email/templates/welcome.tsx
import { Html, Head, Body, Container, Text, Button } from '@react-email/components';

export const WelcomeEmail = ({ name, url }: { name: string; url: string }) => (
  <Html>
    <Body style={{ fontFamily: 'sans-serif' }}>
      <Container>
        <Text>Welcome, {name}!</Text>
        <Button href={url}>Get Started</Button>
      </Container>
    </Body>
  </Html>
);

// Send via Resend
import { Resend } from 'resend';
const resend = new Resend(env.RESEND_API_KEY);

await resend.emails.send({
  from: 'noreply@yourdomain.com',
  to: user.email,
  subject: 'Welcome!',
  react: <WelcomeEmail name={user.name} url={`${env.APP_URL}/onboarding`} />,
});
```

---

## Phase 9 — i18n (next-intl)

```ts
// next.config.ts
import createNextIntlPlugin from 'next-intl/plugin';
const withNextIntl = createNextIntlPlugin();
export default withNextIntl({ /* next config */ });

// messages/en.json
{ "hero": { "title": "Welcome", "cta": "Get Started" } }

// In component
import { useTranslations } from 'next-intl';
const t = useTranslations('hero');
// <h1>{t('title')}</h1>

// Middleware for locale detection
export { default } from 'next-intl/middleware';
export const config = { matcher: ['/((?!api|_next|.*\\..*).*)'] };
```

**RTL support:**
```css
[dir="rtl"] .layout { direction: rtl; }
[dir="rtl"] .flex-row { flex-direction: row-reverse; }
```

---

## Phase 10 — GraphQL

```ts
// Code-first with type-graphql
@Resolver(() => User)
class UserResolver {
  @Query(() => [User])
  async users(@Ctx() { db }: Context): Promise<User[]> {
    return db.users.findMany();
  }

  @FieldResolver(() => [Post])
  async posts(@Root() user: User, @Ctx() { loaders }: Context) {
    return loaders.postsByUser.load(user.id);  // DataLoader — N+1 prevention
  }
}

// DataLoader (mandatory for any field resolver)
const postsByUserLoader = new DataLoader<string, Post[]>(async (userIds) => {
  const posts = await db.posts.findMany({ where: { userId: { in: [...userIds] } } });
  return userIds.map(id => posts.filter(p => p.userId === id));
});
```

---

## Phase 11 — Monorepo (Turborepo)

```json
// turbo.json
{
  "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**"] },
    "dev": { "cache": false, "persistent": true },
    "lint": {},
    "type-check": {}
  }
}
```

```
apps/
  web/         ← Next.js app
  api/         ← Hono/Express API
  mobile/      ← Expo app
packages/
  ui/          ← Shared components
  db/          ← Prisma schema + client
  config/      ← ESLint, TypeScript, Tailwind configs
  types/       ← Shared TypeScript types
```

---

## Security Doctrine

| Attack | Defense |
|--------|---------|
| SQL injection | Parameterized queries / ORM only |
| XSS | CSP headers · DOMPurify |
| CSRF | SameSite=Strict + CSRF token |
| Brute force | Rate limit auth: 10 attempts/15min |
| Mass assignment | Zod whitelist — never Object.assign(entity, body) |
| Data leak | Never log PII/tokens · strip stack traces in prod |
| Credentials | Bcrypt 12+ or Argon2 |
| Secrets | Env vars only · npm audit in CI |

---

## ENV Validation (crash-early)

```ts
import { z } from 'zod';
const EnvSchema = z.object({
  DATABASE_URL:      z.string().url(),
  JWT_SECRET:        z.string().min(32),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  NODE_ENV:          z.enum(['development', 'staging', 'production']),
});
export const env = EnvSchema.parse(process.env);
// Process exits immediately on missing/invalid
```

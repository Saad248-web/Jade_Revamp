---
name: nexus-data
description: "Database selection, schema design, query optimization, indexing, RLS, migrations, pgvector for AI features, multi-tenancy patterns, connection pooling, monitoring. PostgreSQL default. Drizzle/Prisma ORM. EXPLAIN ANALYZE before any optimization. Schema is a contract. Use when designing, querying, or optimizing any data layer."
triggers: ["database", "schema", "query", "sql", "postgres", "supabase", "prisma", "drizzle", "index", "migration", "rls", "n+1", "slow query", "explain", "cte", "window function", "transaction", "vacuum", "connection pool", "pgvector", "vector", "multi-tenant", "row level security"]
---

# NEXUS DATA Engine v3.0
**Schema is a contract. Measure before optimizing. Never guess — EXPLAIN ANALYZE first.**

---

## Phase 0 — Database Selection

| Database | When |
|----------|------|
| **PostgreSQL** | Default. Relational data, JSONB, RLS, full-text, pgvector. |
| **Supabase** | PostgreSQL + auth + storage + realtime out of the box. |
| **Neon** | Serverless Postgres, edge-compatible, branching. |
| **Turso (libSQL)** | Edge SQLite, global replication. |
| **Redis** | Cache, sessions, pub/sub — NEVER primary storage. |

**ORM Selection:**
- **Drizzle** — Lightweight, SQL-like, edge-compatible, type-safe. Preferred.
- **Prisma** — Schema-first, migrations included, rapid prototyping.
- **Raw SQL** — Analytics, EXPLAIN tuning, bulk operations.

---

## Phase 1 — Schema Design

```sql
CREATE TABLE users (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  email       TEXT        NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at  TIMESTAMPTZ  -- soft delete (NULL = active)
);

-- updated_at trigger (every mutable table)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

**Data type rules:**
- Money → `NUMERIC(19,4)` (never FLOAT)
- Time → `TIMESTAMPTZ` (never TIMESTAMP without tz)
- Flexible → `JSONB` (never JSON — not indexable)
- Enums → `TEXT CHECK(status IN ('active','paused'))` not Postgres ENUM

**Always index FK columns** — Postgres does NOT auto-create them.

---

## Phase 2 — pgvector (AI Features)

```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE embeddings (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  content   TEXT NOT NULL,
  metadata  JSONB,
  embedding vector(1536)  -- Match OpenAI text-embedding-3-small dimensions
);

-- HNSW index (fast approximate, recommended for production)
CREATE INDEX ON embeddings
  USING hnsw (embedding vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);

-- Similarity search
SELECT content, metadata,
  1 - (embedding <=> $1::vector) AS similarity
FROM embeddings
WHERE 1 - (embedding <=> $1::vector) > 0.75
ORDER BY embedding <=> $1::vector
LIMIT 5;
```

---

## Phase 3 — Indexing Strategy

```sql
-- B-Tree (default) — equality, range, ORDER BY
CREATE INDEX CONCURRENTLY idx_orders_user_id ON orders(user_id);
CREATE INDEX CONCURRENTLY idx_orders_created ON orders(created_at DESC);

-- Partial — only rows you query
CREATE INDEX CONCURRENTLY idx_active_products ON products(category)
  WHERE deleted_at IS NULL AND is_active = TRUE;

-- Composite — most selective column first
CREATE INDEX CONCURRENTLY idx_orders_user_status ON orders(user_id, status);

-- GIN — JSONB and full-text
CREATE INDEX idx_products_fts ON products
  USING GIN (to_tsvector('english', name || ' ' || description));

-- ALWAYS CONCURRENTLY in production — never blocks reads
```

---

## Phase 4 — Query Optimization

```sql
-- EXPLAIN ANALYZE first — always
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM orders WHERE user_id = $1 AND status = 'pending';

-- Fix N+1 with JOIN
SELECT u.id, u.email, json_agg(oi.*) AS items
FROM orders o
LEFT JOIN order_items oi ON oi.order_id = o.id
WHERE o.user_id = $1
GROUP BY o.id;

-- Keyset pagination (never OFFSET)
SELECT * FROM posts
WHERE created_at < $1::timestamptz
ORDER BY created_at DESC LIMIT $2;
```

---

## Phase 5 — Row Level Security

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "read_own"  ON posts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "write_own" ON posts FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "admin_all" ON posts FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Always test with non-admin role
SET ROLE authenticated_user_role;
```

---

## Phase 6 — Multi-Tenancy

```sql
-- Shared schema (recommended for < 1000 tenants)
ALTER TABLE orders ADD COLUMN tenant_id UUID NOT NULL REFERENCES tenants(id);
CREATE INDEX idx_orders_tenant ON orders(tenant_id);

-- RLS enforces tenant isolation
CREATE POLICY "tenant_isolation" ON orders
  USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- Set at connection/session level
SET app.tenant_id = 'tenant-uuid-here';
```

---

## Migration Safety

```
Zero-downtime protocol:
Step 1: ADD COLUMN nullable — deploy
Step 2: Backfill (batched UPDATE, never one giant UPDATE)
Step 3: ADD NOT NULL + DEFAULT — deploy
Step 4: DROP old column — separate deploy after verification

Never:
- ALTER COLUMN TYPE without new column + backfill
- CREATE INDEX (blocks writes) — always CONCURRENTLY
- ADD NOT NULL without default
```

-- ============================================================
--  Jade Host — PostgreSQL Schema
--  Run this once on your Hostinger VPS PostgreSQL instance
--  psql -U jadeuser -d jadehost -f schema.sql
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS bookings (
  id            UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  villa_id      TEXT          NOT NULL,
  villa_name    TEXT          NOT NULL,
  check_in      DATE          NOT NULL,
  check_out     DATE          NOT NULL,
  adults        INTEGER       NOT NULL DEFAULT 1,
  children      INTEGER       NOT NULL DEFAULT 0,
  pets          INTEGER       NOT NULL DEFAULT 0,
  full_name     TEXT          NOT NULL,
  phone         TEXT          NOT NULL,
  email         TEXT          NOT NULL,
  notes         TEXT          NOT NULL DEFAULT '',
  add_ons       TEXT[]        NOT NULL DEFAULT '{}',
  base_price    INTEGER       NOT NULL,
  add_on_total  INTEGER       NOT NULL DEFAULT 0,
  tax_amount    INTEGER       NOT NULL DEFAULT 0,
  total_price   INTEGER       NOT NULL,
  status        TEXT          NOT NULL DEFAULT 'confirmed'
                              CHECK (status IN ('confirmed', 'pending', 'cancelled')),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Speed up availability queries (most frequent read)
CREATE INDEX IF NOT EXISTS idx_bookings_villa_dates
  ON bookings (villa_id, check_in, check_out);

-- Speed up admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_bookings_created_at
  ON bookings (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_bookings_status
  ON bookings (status);

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

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_gateway_state TEXT NOT NULL DEFAULT 'none';

-- ============================================================
--  Partner programme leads (multipart photos via API route)
-- ============================================================

CREATE TABLE IF NOT EXISTS partner_leads (
  id         UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  email      TEXT          NOT NULL,
  payload    JSONB         NOT NULL,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_leads_created_at
  ON partner_leads (created_at DESC);

CREATE TABLE IF NOT EXISTS partner_lead_photos (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_lead_id UUID          NOT NULL REFERENCES partner_leads (id) ON DELETE CASCADE,
  ordinal         SMALLINT      NOT NULL,
  filename        TEXT,
  mime            TEXT          NOT NULL DEFAULT 'application/octet-stream',
  bytes           BYTEA         NOT NULL,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_lead_photos_lead
  ON partner_lead_photos (partner_lead_id);

-- ============================================================
--  Leads & career applications (general / wedding / hiring)
--  Run this block after the bookings table exists.
-- ============================================================

CREATE TABLE IF NOT EXISTS leads (
  id         UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  source     TEXT          NOT NULL
               CHECK (source IN ('general_enquiry', 'wedding_enquiry', 'rathaa_enquiry')),
  payload    JSONB         NOT NULL,
  email      TEXT,
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at
  ON leads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_leads_source
  ON leads (source);

CREATE TABLE IF NOT EXISTS career_applications (
  id              UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id          TEXT          NOT NULL,
  full_name       TEXT          NOT NULL,
  email           TEXT          NOT NULL,
  phone           TEXT          NOT NULL DEFAULT '',
  company         TEXT          NOT NULL DEFAULT '',
  resume_filename TEXT,
  resume_mime     TEXT,
  resume_bytes    BYTEA,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_career_applications_created_at
  ON career_applications (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_career_applications_job_id
  ON career_applications (job_id);

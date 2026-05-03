-- Run once on Postgres that already had the original `leads` CHECK (2 sources only)
-- and lacked partner / payment-gateway columns. Safe to run multiple times where supported.

-- ─── Widen `leads.source` for Rathaa overlay ───────────────────────────
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_source_check;
ALTER TABLE leads
  ADD CONSTRAINT leads_source_check CHECK (
    source IN (
      'general_enquiry',
      'wedding_enquiry',
      'rathaa_enquiry'
    )
  );

-- ─── Partner programme (photos stored separately) ────────────────────────
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

-- ─── Razorpay linkage (optional gateway flow) ─────────────────────────────
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS payment_gateway_state TEXT NOT NULL DEFAULT 'none';

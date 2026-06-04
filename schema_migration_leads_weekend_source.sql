-- Allow weekend getaways enquiries in `leads.source` (API: weekend_getaways_enquiry).
-- Run after schema.sql on existing Postgres (idempotent).

ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_source_check;
ALTER TABLE leads
  ADD CONSTRAINT leads_source_check CHECK (
    source IN (
      'general_enquiry',
      'weekend_getaways_enquiry',
      'wedding_enquiry',
      'rathaa_enquiry'
    )
  );

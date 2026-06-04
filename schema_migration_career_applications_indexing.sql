-- Careers apply indexing: role, page, and entry context for reporting/admin.
-- Run after schema.sql on existing Postgres (idempotent).

ALTER TABLE career_applications
  ADD COLUMN IF NOT EXISTS job_title    TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS source_page  TEXT NOT NULL DEFAULT '/careers',
  ADD COLUMN IF NOT EXISTS apply_context TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS client_path  TEXT NOT NULL DEFAULT '';

-- Backfill titles from job_id for legacy rows (best-effort slugs).
UPDATE career_applications
SET job_title = job_id
WHERE job_title = '' OR job_title IS NULL;

UPDATE career_applications
SET apply_context = 'careers:role:' || job_id
WHERE apply_context = '' OR apply_context IS NULL;

UPDATE career_applications
SET source_page = '/careers'
WHERE source_page = '' OR source_page IS NULL;

CREATE INDEX IF NOT EXISTS idx_career_applications_apply_context
  ON career_applications (apply_context);

CREATE INDEX IF NOT EXISTS idx_career_applications_source_page
  ON career_applications (source_page);

CREATE INDEX IF NOT EXISTS idx_career_applications_job_role_created
  ON career_applications (job_id, created_at DESC);

# Cleanup deletion report

**Date:** 2026-05-04  
**Scope:** Remove one-off audit output, finished migration artifacts, and scratch scripts under `tmp/`. **Preserved:** `audit-report.*`, `WEBDEV-Audit.*`, `WEBDEVAudit.*`, and all scripts wired from `package.json` (build, media, favicons, optimize routes).

---

## Deleted files (8)

| # | Path | Reason |
|---|------|--------|
| 1 | `tmp/audit-links.json` | Generated output from removed audit script (~route/link snapshot); stale dated snapshot. |
| 2 | `tmp/optimize_magnolia.mjs` | Local image pipeline scratch; not referenced by app or `package.json`. |
| 3 | `tmp/convert_images_v2.mjs` | Same — experimental conversion utility. |
| 4 | `tmp/convert_images.mjs` | Same — older variant. |
| 5 | `tmp/optimize_magnolia_v2.js` | Same — Magnolia optimize experiment. |
| 6 | `scripts/audit_project.mjs` | Standalone static audit (walked `src`/`public`, wrote `tmp/audit-links.json`). Redundant with maintained WEBDEV/audit docs + CI. |
| 7 | `spaces-to-experiences-report.md` | One-time move log from `reclassify_spaces_experiences.js` (Spaces → Experiences paths); migration already applied in repo. |
| 8 | `reclassify_spaces_experiences.js` | One-off filesystem migration script; output was item 7; not used by build/runtime. |

**Also removed:** empty directory **`tmp/`** after deleting its contents (repository root). `.gitignore` already ignores **`/tmp/`** to prevent re-committing scratch dumps.

---

## Not deleted (reviewed)

| Path | Reason kept |
|------|-------------|
| `audit-report.html` / `audit-report.md` | Client-facing pack — excluded from cleanup per request. |
| `WEBDEV-Audit.html` / `WEBDEV-Audit.md` | Engineering audit pack — excluded. |
| `WEBDEVAudit.html` / `WEBDEVAudit.md` | Redirect / pointer to canonical audit filenames — excluded. |
| `scripts/generate_media_manifest.mjs`, `generate_favicons.mjs`, `generate_og_default.mjs`, `optimize_*.js`, etc. | Used by **`npm run`** / **`prebuild`** or intentional asset pipelines. |
| `public/Villa_Retreats_Tree.html` | Referenced in audits as media-tree artifact; may still help content ops. |
| `.vscode/settings.json` | Minimal editor setting (`css.lint.unknownAtRules`); harmless for Tailwind. |
| `NEXUS_v3/` | External skill/design pack; not part of app runtime — left intact (large; confirm before removing). |
| `PROMPT_DEMO1_EXTRACTION.md` | Not analyzed as obsolete — delete only if you confirm it is discardable notes. |

---

## Follow-up (optional)

- If **`NEXUS_v3/`** or **`PROMPT_DEMO1_EXTRACTION.md`** are no longer needed locally, delete them in a separate pass after backup.
- Run **`npm run test`** and **`npm run build`** after cleanup — recommended before deploy.

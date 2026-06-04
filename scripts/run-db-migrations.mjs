/**
 * Applies idempotent SQL migrations on an existing local Postgres (Phase 2).
 * Fresh Docker volumes already get schema.sql via docker-compose init.
 *
 *   npm run db:migrate
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const MIGRATION_FILES = [
  "schema_migration_leads_rathaa_partner_payments.sql",
  "schema_migration_leads_weekend_source.sql",
  "schema_migration_career_applications_indexing.sql",
];

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) {
    console.error("Missing .env.local — copy from .env.example first.");
    process.exit(1);
  }
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = value;
  }
}

async function main() {
  loadEnvLocal();

  const config = {
    host: process.env.POSTGRES_HOST ?? "localhost",
    port: Number(process.env.POSTGRES_PORT ?? 5432),
    database: process.env.POSTGRES_DB ?? "jadehost",
    user: process.env.POSTGRES_USER ?? "jadeuser",
    password: process.env.POSTGRES_PASSWORD,
  };

  if (!config.password) {
    console.error("POSTGRES_PASSWORD is not set in .env.local");
    process.exit(1);
  }

  const client = new pg.Client(config);

  try {
    await client.connect();
    console.log(
      `Connected to ${config.user}@${config.host}:${config.port}/${config.database}\n`,
    );

    for (const file of MIGRATION_FILES) {
      const fullPath = path.join(root, file);
      if (!fs.existsSync(fullPath)) {
        console.warn(`Skip (missing): ${file}`);
        continue;
      }
      const sql = fs.readFileSync(fullPath, "utf8");
      console.log(`Applying ${file}…`);
      await client.query(sql);
      console.log(`  ✓ ${file}`);
    }

    const cols = await client.query(`
      SELECT column_name
      FROM information_schema.columns
      WHERE table_schema = 'public'
        AND table_name = 'career_applications'
        AND column_name IN ('job_title', 'source_page', 'apply_context', 'client_path')
      ORDER BY column_name
    `);
    console.log(
      "\nCareer indexing columns:",
      cols.rows.map((r) => r.column_name).join(", ") || "(none — run schema.sql)",
    );

    const leadCheck = await client.query(`
      SELECT pg_get_constraintdef(oid) AS def
      FROM pg_constraint
      WHERE conrelid = 'public.leads'::regclass
        AND conname = 'leads_source_check'
    `);
    if (leadCheck.rows[0]?.def) {
      console.log("leads.source check:", leadCheck.rows[0].def);
    }

    console.log("\nMigrations complete. Next:");
    console.log("  1. Set NEXT_PUBLIC_ENQUIRY_DEMO_MODE=false in .env.local");
    console.log("  2. Set NEXT_PUBLIC_CAREERS_DEMO_MODE=false (optional; follows enquiry when unset)");
    console.log("  3. Restart: npm run dev");
    console.log("  4. Verify: npm run api:smoke");
  } catch (err) {
    if (err?.code === "ECONNREFUSED") {
      console.error(
        "\nPostgreSQL is not running.\n  npm run db:up   (requires Docker Desktop)\n",
      );
    } else {
      console.error(err);
    }
    process.exit(1);
  } finally {
    await client.end().catch(() => {});
  }
}

main();

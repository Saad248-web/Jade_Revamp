/**
 * Wipes all local Jade tables and reapplies schema.sql (empty fresh DB).
 * Uses POSTGRES_* from .env.local. Does not touch production.
 *
 *   npm run db:reset:schema
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

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

  const schemaPath = path.join(root, "schema.sql");
  const schemaSql = fs.readFileSync(schemaPath, "utf8");

  const client = new pg.Client(config);

  try {
    await client.connect();
    console.log(
      `Connected to ${config.user}@${config.host}:${config.port}/${config.database}`,
    );

    console.log("Dropping all tables in public schema…");
    await client.query("DROP SCHEMA public CASCADE");
    await client.query("CREATE SCHEMA public");
    await client.query("GRANT ALL ON SCHEMA public TO public");

    console.log("Applying schema.sql…");
    await client.query(schemaSql);

    const tables = await client.query(`
      SELECT tablename FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename
    `);
    console.log(
      "Done. Fresh database with tables:",
      tables.rows.map((r) => r.tablename).join(", ") || "(none)",
    );
    console.log("\nRestart dev server if running: npm run dev");
    console.log("Admin: http://localhost:3000/admin");
  } catch (err) {
    if (err?.code === "ECONNREFUSED") {
      console.error(
        "\nPostgreSQL is not running on port",
        config.port,
        ".\n\nStart it first:\n  npm run db:up     (Docker Desktop)\n  — or install PostgreSQL and create the jadehost database.\n",
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

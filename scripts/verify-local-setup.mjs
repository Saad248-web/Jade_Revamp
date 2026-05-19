/**
 * Checks what is ready for local Jade dev (run after each setup step).
 *   npm run setup:check
 */
import fs from "node:fs";
import net from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const checks = [];

function pass(label, detail = "") {
  checks.push({ ok: true, label, detail });
}
function fail(label, detail = "") {
  checks.push({ ok: false, label, detail });
}

function hasCommand(cmd) {
  try {
    if (process.platform === "win32") {
      execSync(`where ${cmd}`, { stdio: "ignore" });
    } else {
      execSync(`which ${cmd}`, { stdio: "ignore" });
    }
    return true;
  } catch {
    return false;
  }
}

function portOpen(port, host = "127.0.0.1") {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host }, () => {
      socket.end();
      resolve(true);
    });
    socket.on("error", () => resolve(false));
    socket.setTimeout(2000, () => {
      socket.destroy();
      resolve(false);
    });
  });
}

function loadEnvLocal() {
  const envPath = path.join(root, ".env.local");
  if (!fs.existsSync(envPath)) return null;
  const env = {};
  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

async function main() {
  console.log("\n  Jade ReVamp — local setup check\n");

  if (hasCommand("node")) {
    const v = process.version;
    pass("Node.js installed", v);
  } else fail("Node.js installed", "Install from https://nodejs.org (LTS)");

  if (fs.existsSync(path.join(root, "node_modules"))) {
    pass("npm dependencies", "node_modules present");
  } else {
    fail("npm dependencies", "Run: npm install");
  }

  const env = loadEnvLocal();
  if (env) {
    pass(".env.local exists", path.join(root, ".env.local"));
    if (env.ADMIN_PASSWORD?.length >= 12) {
      pass("ADMIN_PASSWORD set");
    } else {
      fail("ADMIN_PASSWORD set", "Use a long random password in .env.local");
    }
    if (env.POSTGRES_PASSWORD) {
      pass("POSTGRES_* configured");
    } else {
      fail("POSTGRES_* configured", "Add database vars to .env.local");
    }
  } else {
    fail(".env.local exists", "Copy .env.example → .env.local (or use repo template)");
  }

  if (hasCommand("docker")) {
    try {
      execSync("docker info", { stdio: "ignore" });
      pass("Docker Desktop running");
    } catch {
      fail("Docker Desktop running", "Install Docker Desktop and start it");
    }
  } else {
    fail("Docker installed", "Recommended: https://www.docker.com/products/docker-desktop/");
  }

  const pgOpen = await portOpen(5432);
  if (pgOpen) {
    pass("PostgreSQL port 5432", "Something is listening (DB likely up)");
  } else {
    fail("PostgreSQL port 5432", "Run: npm run db:up  (after Docker is installed)");
  }

  console.log("");
  for (const c of checks) {
    const icon = c.ok ? "✓" : "✗";
    const color = c.ok ? "\x1b[32m" : "\x1b[31m";
    console.log(`  ${color}${icon}\x1b[0m  ${c.label}`);
    if (c.detail) console.log(`      ${c.detail}`);
  }

  const failed = checks.filter((c) => !c.ok).length;
  console.log(
    failed
      ? `\n  ${failed} item(s) need attention — open docs/local-dev-setup-guide.html\n`
      : "\n  All checks passed. Run: npm run dev → http://localhost:3000/admin\n",
  );
  process.exit(failed ? 1 : 0);
}

main();

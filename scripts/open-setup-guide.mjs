/**
 * Opens the local setup HTML guide in the default browser.
 *   npm run setup:guide
 */
import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const guide = path.join(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "docs",
  "local-dev-setup-guide.html",
);

const fileUrl = `file:///${guide.replace(/\\/g, "/")}`;

if (process.platform === "win32") {
  execSync(`start "" "${guide}"`, { stdio: "ignore", shell: true });
} else if (process.platform === "darwin") {
  execSync(`open "${guide}"`, { stdio: "ignore" });
} else {
  execSync(`xdg-open "${guide}"`, { stdio: "ignore" });
}

console.log("Opened:", guide);
console.log("Or open in browser:", fileUrl);

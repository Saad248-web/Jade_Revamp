/**
 * Renders hero + intro bands from Wedding_Villa_Overlay SVGs for visual transcription.
 * Output: .cursor/wedding-overlay-crops/{slug}-hero.png, {slug}-intro.png
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";

const ROOT = path.join(process.cwd(), "public", "Wedding_Villa_Overlay");
const OUT = path.join(process.cwd(), ".cursor", "wedding-overlay-crops");
const ZOOM = 1.85;

const VILLAS = [
  { slug: "tranquil", file: "Tranquil.svg" },
  { slug: "magnolia", file: "Magnolia.svg" },
  { slug: "diamond", file: "Daimond.svg" },
  { slug: "dome-villas", file: "Dome.svg" },
  { slug: "haven", file: "The Haven.svg" },
];

const CROPS = {
  card: { top: 0, height: 700 },
  hero: { top: 680, height: 520 },
  intro: { top: 1200, height: 400 },
};

async function renderCrop(svgPath, outPath, region) {
  const meta = await sharp(svgPath).metadata();
  const vw = meta.width ?? 375;
  const vh = meta.height ?? 8000;
  const outW = Math.round(vw * ZOOM);
  const scale = outW / vw;
  const top = Math.round(region.top * scale);
  const height = Math.min(
    Math.round(region.height * scale),
    Math.round(vh * scale) - top,
  );

  await sharp(svgPath, { density: 150 })
    .resize(outW)
    .extract({ left: 0, top, width: outW, height })
    .png()
    .toFile(outPath);
}

fs.mkdirSync(OUT, { recursive: true });

for (const { slug, file } of VILLAS) {
  const svgPath = path.join(ROOT, file);
  if (!fs.existsSync(svgPath)) {
    console.warn("Missing:", file);
    continue;
  }
  for (const [name, region] of Object.entries(CROPS)) {
    const outPath = path.join(OUT, `${slug}-${name}.png`);
    try {
      await renderCrop(svgPath, outPath, region);
      console.log("OK", outPath);
    } catch (e) {
      console.error("FAIL", slug, name, e.message);
    }
  }
}

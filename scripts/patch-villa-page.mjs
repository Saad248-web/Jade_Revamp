import fs from "fs";

const p = "src/app/villas/[id]/page.tsx";
let s = fs.readFileSync(p, "utf8");

if (s.includes("<VillaDetailPerfectForGallery")) {
  console.log("gallery already patched");
  process.exit(0);
}

s = s.replace(
  /      \{\(villa\.perfectForCards\?\.length \?\? 0\) > 0 && \([\s\S]*?        <\/section>\r?\n      \)\}\r?\n\r?\n      \{\/\* FAQ/,
  `      <VillaDetailPerfectForGallery
        cards={villa.perfectForCards ?? []}
        fallbackImage={villa.image}
      />

      {/* FAQ`,
);

fs.writeFileSync(p, s);
console.log("gallery", s.includes("<VillaDetailPerfectForGallery"));

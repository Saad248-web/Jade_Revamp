import fs from "fs";

const p = "src/app/villas/[id]/page.tsx";
let s = fs.readFileSync(p, "utf8");

if (!s.includes("<VillaDetailExperienceCarousel")) {
  s = s.replace(
    /      \{\/\* EXPERIENCES — Green \*\/\}[\s\S]*?      \)\}\r?\n\r?\n      \{\/\* PROPERTY DETAILS/,
    `      {currentActivity ? (
        <VillaDetailExperienceCarousel
          activity={currentActivity}
          slideCount={derivedActivities?.length ?? 0}
          fallbackImage={villa.image}
          onPrev={handlePrevActivity}
          onNext={handleNextActivity}
          onEnquire={() => setEnquireOverlayOpen(true)}
          isValidImage={validImg}
        />
      ) : null}

      {/* PROPERTY DETAILS`,
  );
}

if (!s.includes("<VillaDetailPropertyDetailsList")) {
  s = s.replace(
    /      \{\/\* PROPERTY DETAILS — Green \*\/\}[\s\S]*?      <\/section>\r?\n\r?\n      \{\/\* VIDEO WALKTHROUGH/,
    `      <VillaDetailPropertyDetailsList
        items={villa.propertyDetails ?? []}
        onSeeMore={() => openDrawer("Property Details", villa.propertyDetails || [])}
      />

      {/* VIDEO WALKTHROUGH`,
  );
}

if (!s.includes("<VillaDetailServiceList")) {
  s = s.replace(
    /      \{\/\* SERVICES — Charcoal \*\/\}[\s\S]*?      <\/section>\r?\n\r?\n      <VillaDetailAmenityGrid/,
    `      <VillaDetailServiceList
        services={villa.services ?? []}
        onSeeMore={() => openDrawer("Services", villa.services || [])}
      />

      <VillaDetailAmenityGrid`,
  );
}

fs.writeFileSync(p, s);
console.log("patched sections");

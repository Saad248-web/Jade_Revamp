import fs from "fs";
import path from "path";

const retreatsDir = path.join(process.cwd(), "src/data/retreats");
const files = fs
  .readdirSync(retreatsDir)
  .filter((f) => f.endsWith(".ts") && f !== "index.ts");

function classify(name) {
  const lower = name.toLowerCase();
  if (lower.match(/bed|room|suite|bath|jacuzzi|shower/)) return "Bed & Bath";
  if (
    lower.match(
      /lawn|pool|deck|garden|outdoor|bbq|patio|terrace|exterior|facade|entrance/,
    )
  )
    return "Outdoors";
  return "Indoors";
}

function getAmenities(category) {
  if (category === "Bed & Bath")
    return [
      "King bed",
      "Air conditioning",
      "Room-darkening blinds",
      "Wardrobe",
      "En-suite bathroom",
    ];
  if (category === "Outdoors")
    return [
      "Private pool access",
      "Garden sit-out",
      "Bonfire zone",
      "Barbecue setup",
    ];
  return [
    "Comfortable seating",
    "Ambient lighting",
    "Air conditioning",
    "Entertainment setup",
  ];
}

for (const file of files) {
  const filePath = path.join(retreatsDir, file);
  let content = fs.readFileSync(filePath, "utf8");

  if (content.includes("categorizedSpaces:")) {
    console.log(`Skipping ${file} - already has categorizedSpaces`);
    continue;
  }

  // Extract images array using simple string search
  let allImages = [];
  const imagesStart = content.indexOf("images: [");
  if (imagesStart !== -1) {
    const imagesEnd = content.indexOf("],", imagesStart);
    if (imagesEnd !== -1) {
      const imagesChunk = content.substring(imagesStart + 9, imagesEnd);
      allImages = imagesChunk
        .split(",")
        .map((s) => s.trim().replace(/"/g, "").replace(/'/g, ""))
        .filter((s) => s);
    }
  }

  // Extract spaces array
  const spacesStart = content.indexOf("spaces: [");
  if (spacesStart === -1) {
    console.log(`Could not find spaces in ${file}`);
    continue;
  }
  const spacesEnd = content.indexOf("],", spacesStart);
  if (spacesEnd === -1) continue;

  const rawSpacesText = content.substring(spacesStart + 9, spacesEnd);

  const spaceRegex = /name:\s*["']([^"']+)["'],\s*image:\s*["']([^"']+)["']/g;
  const spaces = [];
  let match;
  while ((match = spaceRegex.exec(rawSpacesText)) !== null) {
    spaces.push({ name: match[1], image: match[2] });
  }

  if (spaces.length === 0) {
    console.log(`No valid spaces parsed for ${file}`);
    const genericImage =
      allImages.length > 0 ? allImages[allImages.length - 1] : "";
    spaces.push({ name: "Main Space", image: genericImage });
  }

  // Build categorized spaces
  const categorizedSpaces = [];
  let availableImages = [...allImages];
  let imageIndex = 0;

  for (let i = 0; i < spaces.length; i++) {
    const space = spaces[i];
    const category = classify(space.name);

    // Assign 1 or 2 images to this space
    const spaceImages = [];
    if (space.image) {
      spaceImages.push(space.image);
    }
    // Add extra images if available, up to 3 per space
    while (imageIndex < allImages.length && spaceImages.length < 3) {
      if (!spaceImages.includes(allImages[imageIndex])) {
        spaceImages.push(allImages[imageIndex]);
      }
      imageIndex++;
    }

    categorizedSpaces.push({
      id: space.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, ""),
      title: space.name,
      category: category,
      amenities: getAmenities(category),
      images: spaceImages,
    });
  }

  // If there are left over images, put them in a final "Additional Spaces"
  if (imageIndex < allImages.length) {
    const leftOvers = allImages.slice(imageIndex);
    categorizedSpaces.push({
      id: "additional-spaces",
      title: "Additional Spaces",
      category: "Outdoors", // most likely outdoors
      amenities: ["Expansive views", "Open area"],
      images: leftOvers,
    });
  }

  let catSpacesStr = JSON.stringify(categorizedSpaces, null, 4);
  catSpacesStr = catSpacesStr.replace(/"([^"]+)":/g, "$1:");
  const insertString = `\n  categorizedSpaces: ${catSpacesStr},`;

  const fullSpacesBlock = content.substring(spacesStart, spacesEnd + 2); // 'spaces: [ ... ],'
  content = content.replace(fullSpacesBlock, fullSpacesBlock + insertString);

  fs.writeFileSync(filePath, content, "utf8");
  console.log(`Updated ${file} with categorizedSpaces.`);
}

console.log("Done.");

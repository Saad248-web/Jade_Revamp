const fs = require("fs");
const path = require("path");

const src1 =
  "C:/Users/Admin/.gemini/antigravity/brain/f90cfdf7-37e4-4635-9e1e-f6a0dcd141e5/uploaded_media_1770832622235.png";
const dest1 =
  "c:/Users/Admin/Desktop/Jade_ReVamp/public/assets/constellation_bg.png";

const src2 =
  "C:/Users/Admin/.gemini/antigravity/brain/f90cfdf7-37e4-4635-9e1e-f6a0dcd141e5/noise_texture_1770829206620.png";
const dest2 = "c:/Users/Admin/Desktop/Jade_ReVamp/public/assets/noise.png";

try {
  if (fs.existsSync(src1)) {
    console.log("Source 1 exists");
    fs.copyFileSync(src1, dest1);
    console.log("Copied bg");
  } else {
    console.log("Source 1 missing");
  }

  if (fs.existsSync(src2)) {
    console.log("Source 2 exists");
    fs.copyFileSync(src2, dest2);
    console.log("Copied noise");
  } else {
    console.log("Source 2 missing");
  }
} catch (e) {
  console.error(e);
}

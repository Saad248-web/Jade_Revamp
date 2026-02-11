const fs = require("fs");

const src1 =
  "C:/Users/Admin/.gemini/antigravity/brain/f90cfdf7-37e4-4635-9e1e-f6a0dcd141e5/uploaded_media_1770832622235.png";
const dest1 =
  "c:/Users/Admin/Desktop/Jade_ReVamp/public/assets/constellation_bg.png";

const src2 =
  "C:/Users/Admin/.gemini/antigravity/brain/f90cfdf7-37e4-4635-9e1e-f6a0dcd141e5/noise_texture_1770829206620.png";
const dest2 = "c:/Users/Admin/Desktop/Jade_ReVamp/public/assets/noise.png";

try {
  if (fs.existsSync(src1)) {
    console.log("Reading source 1...");
    const data1 = fs.readFileSync(src1);
    console.log("Read " + data1.length + " bytes. Writing dest 1...");
    fs.writeFileSync(dest1, data1);
    console.log("Wrote dest 1");
  } else {
    console.log("Source 1 missing");
  }

  if (fs.existsSync(src2)) {
    console.log("Reading source 2...");
    const data2 = fs.readFileSync(src2);
    console.log("Read " + data2.length + " bytes. Writing dest 2...");
    fs.writeFileSync(dest2, data2);
    console.log("Wrote dest 2");
  } else {
    console.log("Source 2 missing");
  }
} catch (e) {
  console.error("Error:", e);
}

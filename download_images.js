const https = require("https");
const fs = require("fs");
const path = require("path");

const urls = {
  "corporate.jpg":
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop",
  "wellness.jpg":
    "https://images.unsplash.com/photo-1544367563-12123d896589?q=80&w=1200&auto=format&fit=crop",
  "caravan.jpg":
    "https://images.unsplash.com/photo-1510312305653-8ed496efae75?q=80&w=1200&auto=format&fit=crop",
  "casual.jpg":
    "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop",
};

const destDir = "c:/Users/Admin/Desktop/Jade_ReVamp/public/assets";

Object.entries(urls).forEach(([filename, url]) => {
  const filePath = path.join(destDir, filename);
  const file = fs.createWriteStream(filePath);

  console.log(`Downloading ${filename}...`);

  https
    .get(url, (response) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log(`Completed ${filename}`);
      });
    })
    .on("error", (err) => {
      fs.unlink(filePath, () => {}); // Delete the file async. (But we don't check result)
      console.error(`Error downloading ${filename}: ${err.message}`);
    });
});

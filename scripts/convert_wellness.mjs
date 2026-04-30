import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const src = "public/Home Page/2-Experiences/Wellness.CR2";
const dst = "public/Home Page/2-Experiences/Wellness.webp";

async function convert() {
    try {
        console.log(`Attempting to convert ${src} to ${dst}...`);
        await sharp(src)
            .resize(2000, null, { withoutEnlargement: true })
            .webp({ quality: 80 })
            .toFile(dst);
        console.log("Success! File converted.");
        
        // If success, we might want to delete the original CR2 if requested, 
        // but for now let's just confirm conversion.
    } catch (err) {
        console.error("Error during conversion:", err.message);
        if (err.message.includes("VipsForeignLoad: file format not supported")) {
            console.error("The CR2 format is not supported by the current sharp/libvips installation.");
        }
    }
}

convert();

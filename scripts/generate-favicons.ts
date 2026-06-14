import fs from "fs";
import path from "path";
import sharp from "sharp";

// Helper to create ICO buffer from PNG buffers
function createIco(pngBuffers: Buffer[], widths: number[], heights: number[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: Icon
  header.writeUInt16LE(pngBuffers.length, 4); // Count of images

  const entries: Buffer[] = [];
  let currentOffset = 6 + 16 * pngBuffers.length;

  for (let i = 0; i < pngBuffers.length; i++) {
    const png = pngBuffers[i];
    const width = widths[i];
    const height = heights[i];
    
    const entry = Buffer.alloc(16);
    entry.writeUInt8(width >= 256 ? 0 : width, 0);
    entry.writeUInt8(height >= 256 ? 0 : height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel (usually 32 for PNG)
    entry.writeUInt32LE(png.length, 8); // Image size
    entry.writeUInt32LE(currentOffset, 12); // Image offset
    
    entries.push(entry);
    currentOffset += png.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function main() {
  const publicDir = path.resolve("./public");
  const logoPath = path.join(publicDir, "logo.png");

  if (!fs.existsSync(logoPath)) {
    console.error(`Error: Logo not found at ${logoPath}`);
    process.exit(1);
  }

  console.log("Found logo.png, generating favicons...");

  // Generate PNG buffers for ICO container (16x16, 32x32, 48x48)
  const sizesForIco = [16, 32, 48];
  const pngBuffersForIco: Buffer[] = [];

  for (const size of sizesForIco) {
    const buf = await sharp(logoPath)
      .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    pngBuffersForIco.push(buf);
  }

  // Create and write favicon.ico
  const icoBuffer = createIco(pngBuffersForIco, sizesForIco, sizesForIco);
  const icoPath = path.join(publicDir, "favicon.ico");
  fs.writeFileSync(icoPath, icoBuffer);
  console.log(`Saved: ${icoPath}`);

  // Write separate PNG files
  const pngsToSave = [
    { size: 16, filename: "favicon-16x16.png" },
    { size: 32, filename: "favicon-32x32.png" },
    { size: 180, filename: "apple-touch-icon.png" }
  ];

  for (const item of pngsToSave) {
    const outputPath = path.join(publicDir, item.filename);
    await sharp(logoPath)
      .resize(item.size, item.size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(outputPath);
    console.log(`Saved: ${outputPath}`);
  }

  // Clean up empty directory app/favicon.ico if exists
  const appFaviconDir = path.resolve("./app/favicon.ico");
  if (fs.existsSync(appFaviconDir) && fs.lstatSync(appFaviconDir).isDirectory()) {
    console.log(`Cleaning up empty directory: ${appFaviconDir}`);
    fs.rmdirSync(appFaviconDir);
  }

  console.log("Favicon generation complete!");
}

main().catch((err) => {
  console.error("Error generating favicons:", err);
  process.exit(1);
});

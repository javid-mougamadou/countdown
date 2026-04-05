/**
 * Génère les assets favicon_io (ABeeZee + « C » blanc sur fond indigo).
 *
 * librsvg (sharp) ne dessine pas le <text> SVG correctement : la glyphe est
 * vectorisée avec opentype.js puis rendue en <path fill="#fff">.
 *
 * docker compose exec web npm run generate:favicon
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, '.cache');
const FONT_FILE = path.join(CACHE_DIR, 'abeezee.ttf');
const OUT_DIR = path.join(__dirname, '../public/assets/favicon_io');
const FONT_URL =
  'https://fonts.gstatic.com/s/abeezee/v22/esDR31xSG-6AGleN6tKukbcHCpE.ttf';

const BG = '#1e1b4b';

async function ensureFontFile() {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
  const res = await fetch(FONT_URL);
  if (!res.ok) throw new Error(`Font fetch failed: ${res.status}`);
  fs.writeFileSync(FONT_FILE, Buffer.from(await res.arrayBuffer()));
}

function buildSvgBuffer() {
  const font = opentype.loadSync(FONT_FILE);
  const fontSize = 320;
  const probe = font.getPath('C', 0, 0, fontSize);
  const bb = probe.getBoundingBox();
  const cx = (bb.x1 + bb.x2) / 2;
  const cy = (bb.y1 + bb.y2) / 2;
  const glyphPath = font.getPath('C', 256 - cx, 256 - cy, fontSize);
  const d = glyphPath.toPathData(2);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="${BG}"/>
  <path fill="#ffffff" d="${d}"/>
</svg>`;
  return Buffer.from(svg);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  await ensureFontFile();
  const svgBuf = buildSvgBuffer();

  const pngJobs = [
    ['favicon-16x16.png', 16],
    ['favicon-32x32.png', 32],
    ['apple-touch-icon.png', 180],
    ['android-chrome-192x192.png', 192],
    ['android-chrome-512x512.png', 512],
  ];

  for (const [name, size] of pngJobs) {
    await sharp(svgBuf).resize(size, size).png().toFile(path.join(OUT_DIR, name));
    console.log('wrote', name);
  }

  const buf16 = await sharp(svgBuf).resize(16, 16).png().toBuffer();
  const buf32 = await sharp(svgBuf).resize(32, 32).png().toBuffer();
  const ico = await pngToIco([buf16, buf32]);
  fs.writeFileSync(path.join(OUT_DIR, 'favicon.ico'), ico);
  console.log('wrote favicon.ico');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

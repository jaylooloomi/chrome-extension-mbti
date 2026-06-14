// Rasterize public/icons/icon-radar.svg to PNGs at the manifest sizes,
// using Playwright's headless Chromium. Run: node e2e/gen-icons.mjs
import { chromium } from '@playwright/test';
import { readFileSync } from 'node:fs';

const svg = readFileSync(new URL('../public/icons/icon-radar.svg', import.meta.url), 'utf8');
const sizes = [16, 32, 48, 128];

const browser = await chromium.launch();
for (const s of sizes) {
  const page = await browser.newPage({ viewport: { width: s, height: s } });
  const sized = svg.replace('width="128" height="128"', `width="${s}" height="${s}"`);
  await page.setContent(`<!doctype html><html><body style="margin:0;padding:0;background:transparent">${sized}</body></html>`);
  await page.locator('svg').screenshot({ path: `public/icons/icon_radar_${s}.png`, omitBackground: true });
  console.log(`wrote public/icons/icon_radar_${s}.png`);
  await page.close();
}
await browser.close();

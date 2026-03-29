import puppeteer from 'puppeteer';
import { mkdir, access } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const url = process.argv[2] || 'http://localhost:3000';
const label = process.argv[3] || '';

const screenshotDir = './temporary screenshots';
if (!existsSync(screenshotDir)) {
  await mkdir(screenshotDir, { recursive: true });
}

let n = 1;
while (existsSync(path.join(screenshotDir, `screenshot-${n}${label ? '-' + label : ''}.png`))) n++;
const filename = `screenshot-${n}${label ? '-' + label : ''}.png`;
const filepath = path.join(screenshotDir, filename);

const browser = await puppeteer.launch({
  executablePath: 'C:/Users/yoeld/.cache/puppeteer/chrome/win64-146.0.7680.153/chrome-win64/chrome.exe',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
await page.screenshot({ path: filepath, fullPage: true });
await browser.close();

console.log(`Screenshot saved: ${filepath}`);

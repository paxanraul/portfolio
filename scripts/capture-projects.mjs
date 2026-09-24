import puppeteer from 'puppeteer-core';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const outputDir = path.resolve('public/images');
const targetSlugs = new Set(process.argv.slice(2));
const deviceScaleFactor = 2;
const settleDelay = Number(process.env.CAPTURE_SETTLE_MS || 2200);
const scrollDelay = Number(process.env.CAPTURE_SCROLL_SETTLE_MS || 500);

const sites = [
  { slug: 'nuit-store', name: 'NUIT', url: 'https://nuit-store.ru', positions: [0, .32, .68] },
  { slug: 'auto-prestige', name: 'Престиж Авто', url: 'https://odintsovo-auto-prestige.ru', positions: [0, .35, .75] },
  { slug: 'oymari', name: 'Oymari', url: 'https://oymari.ru', positions: [0, .42, .88] },
  { slug: 'gunay', name: 'Gunay', url: 'https://gunay-weddingsevents.ru/', positions: [0, .24, .72] },
  { slug: 'sahiba', name: 'Сахиба Годжаева', url: 'https://paxanraul.github.io/sahiba-portfolio/', positions: [0, .34, .78], phoneOnly: true },
  {
    slug: 'elgun-samina', name: 'Elgun & Samina', url: 'https://www.elgunsamina.ru', positions: [0, .4, .78],
    desktopCrop: { left: 360, top: 0, width: 2160, height: 1350 },
  },
  { slug: 'ramik-mariam', name: 'Ramik & Mariam', url: 'https://ramikmariam.ru', positions: [0, .42, .88] },
];

async function preparePage(page, viewport) {
  await page.setViewport(viewport);
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('rm-theme', 'dark');
  });
}

async function loadPage(page, url) {
  await page.goto(url, { waitUntil: 'networkidle2', timeout: 90000 });
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.textContent = `
      html { scroll-behavior: auto !important; }
      * { caret-color: transparent !important; }
      ::-webkit-scrollbar { display: none !important; }
    `;
    document.head.appendChild(style);
  });
  await new Promise((resolve) => setTimeout(resolve, settleDelay));
}

async function scrollToRatio(page, ratio) {
  await page.evaluate((value) => {
    const max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
    window.scrollTo(0, max * value);
  }, ratio);
  await new Promise((resolve) => setTimeout(resolve, scrollDelay));
}

function frameSvg(name, url, shotNumber) {
  const safeName = name.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const host = new URL(url).hostname.replace('www.', '');
  return Buffer.from(`
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000" flood-opacity=".42"/>
        </filter>
      </defs>
      <rect x="0" y="0" width="1280" height="720" fill="none"/>
      <rect x="27" y="75" width="936" height="591" rx="19" fill="none" stroke="#719cff" stroke-opacity=".34" filter="url(#shadow)"/>
      <rect x="1000" y="82" width="254" height="566" rx="30" fill="none" stroke="#8aafff" stroke-opacity=".52" filter="url(#shadow)"/>
      <rect x="1092" y="91" width="70" height="7" rx="4" fill="#101725" stroke="#8aafff" stroke-opacity=".28"/>
      <text x="30" y="42" fill="#edf3ff" font-family="Arial, sans-serif" font-size="19" font-weight="600">${safeName}</text>
      <text x="1250" y="42" fill="#6f88b8" font-family="Arial, sans-serif" font-size="11" text-anchor="end" letter-spacing="1.6">${host.toUpperCase()} · 0${shotNumber}</text>
      <circle cx="45" cy="61" r="3" fill="#6699ff"/>
      <circle cx="57" cy="61" r="3" fill="#31466d"/>
      <circle cx="69" cy="61" r="3" fill="#263552"/>
    </svg>
  `);
}

function phoneFrameSvg(name, url, shotNumber) {
  const safeName = name.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
  const host = new URL(url).hostname.replace('www.', '');
  return Buffer.from(`
    <svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg">
      <text x="48" y="54" fill="#edf3ff" font-family="Arial, sans-serif" font-size="21" font-weight="600">${safeName}</text>
      <text x="1232" y="54" fill="#6f88b8" font-family="Arial, sans-serif" font-size="12" text-anchor="end" letter-spacing="1.6">${host.toUpperCase()} · 0${shotNumber}</text>
      <circle cx="63" cy="76" r="3.5" fill="#6699ff"/>
      <circle cx="77" cy="76" r="3.5" fill="#31466d"/>
      <circle cx="91" cy="76" r="3.5" fill="#263552"/>
      <rect x="484" y="34" width="312" height="652" rx="39" fill="none" stroke="#8aafff" stroke-opacity=".58" stroke-width="2"/>
      <rect x="588" y="43" width="104" height="9" rx="5" fill="#101725" stroke="#8aafff" stroke-opacity=".28"/>
    </svg>
  `);
}

async function compose(site, desktopBuffer, mobileBuffer, index) {
  if (site.phoneOnly) {
    const mobile = await sharp(mobileBuffer).resize(294, 636, { fit: 'cover', position: 'top' }).png().toBuffer();
    await sharp({ create: { width: 1280, height: 720, channels: 4, background: '#080b11' } })
      .composite([
        { input: mobile, left: 493, top: 42 },
        { input: phoneFrameSvg(site.name, site.url, index + 1), left: 0, top: 0 },
      ])
      .png({ compressionLevel: 9 })
      .toFile(path.join(outputDir, `${site.slug}-0${index + 1}.png`));
    return;
  }

  let desktopSource = sharp(desktopBuffer);
  if (site.desktopCrop) desktopSource = desktopSource.extract(site.desktopCrop);

  const [desktop, mobile] = await Promise.all([
    desktopSource.resize(928, 580, { fit: 'cover', position: 'top' }).png().toBuffer(),
    sharp(mobileBuffer).resize(246, 558, { fit: 'cover', position: 'top' }).png().toBuffer(),
  ]);

  await sharp({ create: { width: 1280, height: 720, channels: 4, background: '#080b11' } })
    .composite([
      { input: desktop, left: 31, top: 79 },
      { input: mobile, left: 1004, top: 86 },
      { input: frameSvg(site.name, site.url, index + 1), left: 0, top: 0 },
    ])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outputDir, `${site.slug}-0${index + 1}.png`));
}

await mkdir(outputDir, { recursive: true });
const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: true,
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--hide-scrollbars'],
});

try {
  for (const site of sites.filter((site) => !targetSlugs.size || targetSlugs.has(site.slug))) {
    process.stdout.write(`Capturing ${site.name}... `);
    const desktopPage = site.phoneOnly ? null : await browser.newPage();
    const mobilePage = await browser.newPage();
    if (desktopPage) await preparePage(desktopPage, { width: 1440, height: 900, deviceScaleFactor });
    await preparePage(mobilePage, { width: 390, height: 844, deviceScaleFactor, isMobile: true, hasTouch: true });
    try {
      await Promise.all([desktopPage && loadPage(desktopPage, site.url), loadPage(mobilePage, site.url)]);
      for (let index = 0; index < site.positions.length; index += 1) {
        await Promise.all([desktopPage && scrollToRatio(desktopPage, site.positions[index]), scrollToRatio(mobilePage, site.positions[index])]);
        const [desktop, mobile] = await Promise.all([
          desktopPage ? desktopPage.screenshot({ type: 'png' }) : null,
          mobilePage.screenshot({ type: 'png' }),
        ]);
        await compose(site, desktop, mobile, index);
      }
      console.log('done');
    } catch (error) {
      console.log(`failed: ${error.message}`);
    } finally {
      await desktopPage?.close();
      await mobilePage.close();
    }
  }
} finally {
  await browser.close();
}

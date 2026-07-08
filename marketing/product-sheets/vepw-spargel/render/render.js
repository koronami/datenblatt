const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

(async () => {
  const repoRoot = path.resolve(__dirname, '..');
  const assetsDir = path.join(repoRoot, 'spec');
  const exportsDir = path.join(repoRoot, '..', 'exports');
  if (!fs.existsSync(exportsDir)) fs.mkdirSync(exportsDir, { recursive: true });

  const templatePath = path.join(__dirname, 'template.html');
  const templateUrl = 'file://' + templatePath;

  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  // Set viewport to A4 @ 300dpi --> 2480x3508 px
  await page.setViewport({ width: 2480, height: 3508, deviceScaleFactor: 1 });

  await page.goto(templateUrl, { waitUntil: 'networkidle0' });

  const pngPath = path.join(exportsDir, 'VEPW_Spargeltragetasche_ProductSheet_A4_300dpi.png');
  await page.screenshot({ path: pngPath, fullPage: true });
  console.log('Wrote PNG:', pngPath);

  // Generate PDF (A4). Note: resulting PDF will be RGB. For CMYK/PDF/X conversion use external tools (see README).
  const pdfPath = path.join(exportsDir, 'VEPW_Spargeltragetasche_ProductSheet_A4_300dpi.pdf');
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true, preferCSSPageSize: true, margin: { top: '0in', right: '0in', bottom: '0in', left: '0in' } });
  console.log('Wrote PDF (RGB):', pdfPath);

  await browser.close();
})();

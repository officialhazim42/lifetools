const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '..', 'dist');
const indexPath = path.join(distDir, 'index.html');
const fallbackPath = path.join(distDir, '200.html');
const cnamePath = path.join(distDir, 'CNAME');
const DOMAIN = 'lifetools.surge.sh';

console.log('[Surge Prep] Preparing production distribution for Surge.sh...');

if (!fs.existsSync(distDir)) {
  console.error(`[Surge Prep] ERROR: dist directory not found at ${distDir}`);
  process.exit(1);
}

if (!fs.existsSync(indexPath)) {
  console.error(`[Surge Prep] ERROR: index.html not found in ${distDir}`);
  process.exit(1);
}

// 1. Generate 200.html from index.html for SPA routing on Surge.sh
const indexHtmlContent = fs.readFileSync(indexPath);
fs.writeFileSync(fallbackPath, indexHtmlContent);
const fallbackBytes = fs.statSync(fallbackPath).size;
console.log(`[Surge Prep] ✓ Generated dist/200.html (${fallbackBytes.toLocaleString()} bytes) matching index.html`);

// 2. Ensure dist/CNAME is present with target domain
fs.writeFileSync(cnamePath, DOMAIN + '\n', 'utf8');
const cnameContent = fs.readFileSync(cnamePath, 'utf8').trim();
console.log(`[Surge Prep] ✓ Configured dist/CNAME -> ${cnameContent}`);

// 3. Verify dist/sitemap.xml
const sitemapPath = path.join(distDir, 'sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  const sitemapBytes = fs.statSync(sitemapPath).size;
  console.log(`[Surge Prep] ✓ Verified dist/sitemap.xml (${sitemapBytes.toLocaleString()} bytes)`);
}

console.log(`[Surge Prep] All Surge.sh deployment artifacts successfully verified for domain: ${DOMAIN}`);

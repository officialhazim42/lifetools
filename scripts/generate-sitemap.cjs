const fs = require('fs');

const files = [
  'src/data/toolsRegistry.ts',
  'src/data/templatesData.ts',
  'src/data/webToolsRegistry.ts',
  'src/data/mediaToolsRegistry.ts',
  'src/data/communicationToolsRegistry.ts',
  'src/data/healthToolsRegistry.ts',
  'src/data/travelToolsRegistry.ts',
  'src/data/householdToolsRegistry.ts'
];

const ids = [];
const nonToolIds = new Set([
  'items', 'days', 'periods', 'students', 'chapters', 'hourly', 'weeks',
  'expenses', 'produce', 'pantry', 'itinerary', 'docs', 'clothing', 'tech',
  'habits', 'actionSteps', 'agenda', 'actionItems', 'phases', 'accomplishments'
]);

files.forEach(f => {
  if (fs.existsSync(f)) {
    const content = fs.readFileSync(f, 'utf8');
    const regex = /id:\s*'([^']+)'/g;
    let m;
    while ((m = regex.exec(content))) {
      if (!ids.includes(m[1]) && !nonToolIds.has(m[1]) && isNaN(Number(m[1]))) {
        ids.push(m[1]);
      }
    }
  }
});

const today = new Date().toISOString().split('T')[0];

let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

const DOMAIN = 'https://lifetools.surge.sh';

const baseUrls = [
  { loc: `${DOMAIN}/`, priority: '1.0', changefreq: 'weekly' },
  { loc: `${DOMAIN}/tools`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/calculators`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/converters`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/text`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/developer`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/image`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/generators`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/productivity`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/finance`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/datetime`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/education`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/security`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/files`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/everyday`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/templates`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/web`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/media`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/communication`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/health`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/travel`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/categories/home`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/media`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${DOMAIN}/templates`, priority: '0.9', changefreq: 'weekly' },
  { loc: `${DOMAIN}/workspace`, priority: '0.9', changefreq: 'daily' },
  { loc: `${DOMAIN}/workspace/notes`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/workspace/tasks`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/workspace/expenses`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/workspace/habits`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/workspace/goals`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/workspace/calendar`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/workspace/backups`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/settings`, priority: '0.8', changefreq: 'monthly' },
  { loc: `${DOMAIN}/settings/appearance`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/settings/language`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/settings/privacy`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/settings/storage`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/settings/notifications`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/settings/personalization`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/settings/data`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/settings/about`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/backup`, priority: '0.8', changefreq: 'weekly' },
  { loc: `${DOMAIN}/backup/create`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/backup/restore`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/backup/exports`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/backup/history`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/about`, priority: '0.8', changefreq: 'monthly' },
  { loc: `${DOMAIN}/contact`, priority: '0.7', changefreq: 'monthly' },
  { loc: `${DOMAIN}/privacy`, priority: '0.5', changefreq: 'yearly' },
  { loc: `${DOMAIN}/terms`, priority: '0.5', changefreq: 'yearly' }
];

baseUrls.forEach(u => {
  xml += '  <url>\n';
  xml += `    <loc>${u.loc}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>${u.changefreq}</changefreq>\n`;
  xml += `    <priority>${u.priority}</priority>\n`;
  xml += '  </url>\n';
});

ids.forEach(id => {
  xml += '  <url>\n';
  xml += `    <loc>${DOMAIN}/tool/${id}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>monthly</changefreq>\n`;
  xml += `    <priority>0.7</priority>\n`;
  xml += '  </url>\n';
});

xml += '</urlset>\n';

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
if (fs.existsSync('dist')) {
  fs.writeFileSync('dist/sitemap.xml', xml, 'utf8');
}
console.log(`Generated sitemap with ${baseUrls.length + ids.length} URLs.`);

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

const baseUrls = [
  { loc: 'https://lifetools.app/', priority: '1.0', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/tools', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/calculators', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/converters', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/text', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/developer', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/image', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/generators', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/productivity', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/finance', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/datetime', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/education', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/security', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/files', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/everyday', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/templates', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/web', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/media', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/communication', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/health', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/travel', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/categories/home', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/media', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/templates', priority: '0.9', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/workspace', priority: '0.9', changefreq: 'daily' },
  { loc: 'https://lifetools.app/#/workspace/notes', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/workspace/tasks', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/workspace/expenses', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/workspace/habits', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/workspace/goals', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/workspace/calendar', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/workspace/backups', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/settings', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/settings/appearance', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/settings/language', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/settings/privacy', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/settings/storage', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/settings/notifications', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/settings/personalization', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/settings/data', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/settings/about', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/backup', priority: '0.8', changefreq: 'weekly' },
  { loc: 'https://lifetools.app/#/backup/create', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/backup/restore', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/backup/exports', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/backup/history', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/about', priority: '0.8', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/contact', priority: '0.7', changefreq: 'monthly' },
  { loc: 'https://lifetools.app/#/privacy', priority: '0.5', changefreq: 'yearly' },
  { loc: 'https://lifetools.app/#/terms', priority: '0.5', changefreq: 'yearly' }
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
  xml += `    <loc>https://lifetools.app/#/tool/${id}</loc>\n`;
  xml += `    <lastmod>${today}</lastmod>\n`;
  xml += `    <changefreq>monthly</changefreq>\n`;
  xml += `    <priority>0.7</priority>\n`;
  xml += '  </url>\n';
});

xml += '</urlset>\n';

fs.writeFileSync('public/sitemap.xml', xml, 'utf8');
console.log(`Generated sitemap with ${baseUrls.length + ids.length} URLs.`);

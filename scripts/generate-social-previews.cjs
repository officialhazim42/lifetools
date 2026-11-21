/**
 * LifeTools — Social Media Sharing Preview & Static Route Prerenderer
 *
 * Responsibilities:
 * 1. Loads all 634 tools from src/data/toolsRegistry.ts
 * 2. Generates professional 1200 x 630 px PNG social preview images:
 *    - Main website preview (public/og-preview.png and public/og-previews/home.png)
 *    - All 20 category previews (public/og-previews/categories/*.png)
 *    - All public page previews (public/og-previews/pages/*.png)
 *    - All 634 individual tool previews (public/og-previews/tools/*.png)
 * 3. Prerenders route-specific HTML files in dist/ for 100% social media crawler compatibility
 *    (WhatsApp, Facebook, Twitter/X, LinkedIn, Discord, Telegram, Slack, iMessage)
 *    - Injects unique <title>, <meta name="description">, <link rel="canonical">
 *    - Injects Open Graph tags: og:title, og:description, og:url, og:image, og:image:width, og:image:height, og:image:alt, og:site_name, og:type
 *    - Injects Twitter tags: twitter:card, twitter:title, twitter:description, twitter:image, twitter:image:alt
 *    - Preserves Google Search Console verification tag: <meta name="google-site-verification" content="Qq07av7RQHZyJTnUtPXAR2UHR5bt7VPx_1OOU2AIP6c" />
 * 4. Ensures all preview image URLs are absolute HTTPS URLs targeting https://lifetools.surge.sh
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');
const esbuild = require('esbuild');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const lucide = require('lucide-react');
const { Resvg } = require('@resvg/resvg-js');

const BASE_URL = 'https://lifetools.surge.sh';
const GOOGLE_VERIFICATION = 'Qq07av7RQHZyJTnUtPXAR2UHR5bt7VPx_1OOU2AIP6c';

// Category theme definitions matching LifeTools brand colors
const CATEGORY_THEMES = {
  calculators: { accent: '#10b981', start: '#059669', end: '#047857', label: 'Calculators & Math', icon: 'Calculator' },
  converters: { accent: '#06b6d4', start: '#0891b2', end: '#0e7490', label: 'Unit & Data Converters', icon: 'ArrowLeftRight' },
  text: { accent: '#3b82f6', start: '#2563eb', end: '#1d4ed8', label: 'Text & Writing Tools', icon: 'FileText' },
  developer: { accent: '#6366f1', start: '#4f46e5', end: '#4338ca', label: 'Developer & Code Tools', icon: 'Code' },
  image: { accent: '#ec4899', start: '#db2777', end: '#be185d', label: 'Image Studio & Graphics', icon: 'Image' },
  generators: { accent: '#10b981', start: '#059669', end: '#0f766e', label: 'QR & Code Generators', icon: 'QrCode' },
  productivity: { accent: '#f59e0b', start: '#d97706', end: '#b45309', label: 'Productivity & Planning', icon: 'CheckSquare' },
  finance: { accent: '#10b981', start: '#16a34a', end: '#15803d', label: 'Personal Finance & Money', icon: 'CircleDollarSign' },
  datetime: { accent: '#8b5cf6', start: '#7c3aed', end: '#6d28d9', label: 'Date, Time & Calendars', icon: 'Clock' },
  education: { accent: '#0284c7', start: '#0369a1', end: '#075985', label: 'Education & Learning', icon: 'GraduationCap' },
  security: { accent: '#ef4444', start: '#dc2626', end: '#b91c1c', label: 'Security & Privacy Tools', icon: 'ShieldCheck' },
  files: { accent: '#64748b', start: '#475569', end: '#334155', label: 'File & Document Utilities', icon: 'FolderArchive' },
  everyday: { accent: '#14b8a6', start: '#0d9488', end: '#0f766e', label: 'Everyday Digital Utilities', icon: 'Sparkles' },
  templates: { accent: '#a855f7', start: '#9333ea', end: '#7e22ce', label: 'Document & Work Templates', icon: 'FileSpreadsheet' },
  web: { accent: '#0ea5e9', start: '#0284c7', end: '#0369a1', label: 'Web & Internet Utilities', icon: 'Globe' },
  media: { accent: '#f43f5e', start: '#e11d48', end: '#be123c', label: 'Audio & Media Studio', icon: 'Music' },
  communication: { accent: '#3b82f6', start: '#2563eb', end: '#1d4ed8', label: 'Communication & Social', icon: 'MessageSquare' },
  health: { accent: '#10b981', start: '#059669', end: '#047857', label: 'Health & Wellness Tools', icon: 'Heart' },
  travel: { accent: '#f59e0b', start: '#d97706', end: '#b45309', label: 'Travel & Navigation Planning', icon: 'Compass' },
  home: { accent: '#84cc16', start: '#65a30d', end: '#4d7c0f', label: 'Home & Property Utilities', icon: 'Home' }
};

// Public non-tool pages
const PUBLIC_PAGES = [
  {
    id: 'home',
    route: '/',
    title: 'LifeTools — Everything You Need. All in One Place.',
    description: 'Comprehensive, free, privacy-first digital utility platform featuring 634+ fast client-side tools across 20 categories. Calculators, converters, developer utilities, media studio, QR generators, and personal workspace. 100% client-side, zero server tracking.',
    category: 'everyday',
    iconName: 'Wrench'
  },
  {
    id: 'tools',
    route: '/tools',
    title: 'All Tools Directory — 634+ Free Digital Utilities | LifeTools',
    description: 'Explore the complete directory of 634+ free client-side tools across 20 categories. Instant search, category filters, and zero tracking.',
    category: 'developer',
    iconName: 'LayoutGrid'
  },
  {
    id: 'categories',
    route: '/categories',
    title: 'All Categories Directory — 20 Digital Utility Categories | LifeTools',
    description: 'Explore all 20 specialized tool categories in LifeTools: Calculators, Converters, Media Studio, QR Generators, Health, Travel, Home, and more.',
    category: 'everyday',
    iconName: 'Folders'
  },
  {
    id: 'workspace',
    route: '/workspace',
    title: 'My Workspace — Private Personal Productivity | LifeTools',
    description: 'Private, offline-first personal workspace for notes, task management, expenses, habit streaks, goals, and calendar schedules. Zero cloud storage.',
    category: 'productivity',
    iconName: 'Briefcase'
  },
  {
    id: 'templates',
    route: '/templates',
    title: 'Templates & Document Creator — 40 Free Printable Documents | LifeTools',
    description: 'Create, customize, and print professional invoices, resumes, contracts, planners, attendance sheets, and letters in your browser. 100% client-side.',
    category: 'templates',
    iconName: 'FileSpreadsheet'
  },
  {
    id: 'media',
    route: '/media',
    title: 'Media Studio — 70 Free Browser-Based Audio, Image & Video Tools | LifeTools',
    description: 'Comprehensive client-side media studio: image editing, audio cutters and recorders, video trimmers, GIF animation creators, and media format inspectors.',
    category: 'media',
    iconName: 'Film'
  },
  {
    id: 'about',
    route: '/about',
    title: 'About LifeTools & Developer Hazim Bashir | LifeTools',
    description: 'Learn about LifeTools architecture, privacy guarantees, and developer Hazim Bashir (حازم بشیر), creating free, accessible client-side digital utilities.',
    category: 'developer',
    iconName: 'User'
  },
  {
    id: 'recent',
    route: '/recent',
    title: 'Recently Used Tools | LifeTools',
    description: 'Quickly access your recent tool activity and history, securely stored locally on your device.',
    category: 'productivity',
    iconName: 'Clock'
  },
  {
    id: 'favorites',
    route: '/favorites',
    title: 'Your Favorite Tools | LifeTools',
    description: 'Quick access to your bookmarked and pinned everyday utilities, stored privately in your browser.',
    category: 'everyday',
    iconName: 'Star'
  },
  {
    id: 'settings',
    route: '/settings',
    title: 'Settings Center — Appearance, Privacy & Preferences | LifeTools',
    description: 'Customize appearance, light/dark themes, regional dates and currencies, storage preferences, notifications, and privacy options in LifeTools.',
    category: 'security',
    iconName: 'Settings'
  },
  {
    id: 'backup',
    route: '/backup',
    title: 'Universal Backup & Restore — Private Data Custody | LifeTools',
    description: 'Comprehensive client-side backup and restore system for LifeTools. Export your notes, tasks, expenses, and settings to JSON, ZIP, CSV, or encrypted archives.',
    category: 'security',
    iconName: 'Archive'
  },
  {
    id: 'privacy',
    route: '/privacy',
    title: 'Privacy Policy — Privacy-First Guarantee | LifeTools',
    description: 'LifeTools is built on a privacy-first foundation. Read our clear, transparent guarantees: 100% client-side execution, zero analytics, zero server uploads.',
    category: 'security',
    iconName: 'ShieldCheck'
  },
  {
    id: 'terms',
    route: '/terms',
    title: 'Terms of Use | LifeTools',
    description: 'Review the transparent terms governing the use of the free, client-side LifeTools utility platform.',
    category: 'security',
    iconName: 'FileText'
  },
  {
    id: 'contact',
    route: '/contact',
    title: 'Contact LifeTools & Developer Hazim Bashir | LifeTools',
    description: 'Get in touch with Hazim Bashir (حازم بشیر), creator of LifeTools, for tool suggestions, feature requests, and feedback.',
    category: 'communication',
    iconName: 'Mail'
  }
];

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function wrapText(text, maxChars) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length <= maxChars) {
      cur = (cur + ' ' + w).trim();
    } else {
      if (cur) lines.push(cur);
      cur = w;
      if (lines.length >= 2) break;
    }
  }
  if (cur && lines.length < 2) lines.push(cur);
  if (lines.length === 2 && lines[1].length > maxChars - 3) {
    lines[1] = lines[1].slice(0, maxChars - 3) + '...';
  }
  return lines;
}

function getLucideSvg(iconName, color = '#ffffff', size = 64) {
  try {
    const Component = lucide[iconName] || lucide.Wrench || lucide.AppWindow;
    const markup = renderToStaticMarkup(
      React.createElement(Component, {
        size,
        color,
        strokeWidth: 2
      })
    );
    return markup.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
  } catch {
    const Component = lucide.Wrench;
    const markup = renderToStaticMarkup(React.createElement(Component, { size, color, strokeWidth: 2 }));
    return markup.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
  }
}

/**
 * Generates high-fidelity SVG string for a 1200x630 Open Graph preview image
 */
function createSocialPreviewSvg({ title, description, category, iconName, badgeText = '634+ CLIENT TOOLS' }) {
  const theme = CATEGORY_THEMES[category] || {
    accent: '#10b981',
    start: '#059669',
    end: '#047857',
    label: category || 'Digital Utilities',
    icon: 'Wrench'
  };

  const escapedTitle = escapeXml(title);
  const titleSize = title.length > 34 ? 36 : (title.length > 24 ? 42 : 48);
  const descLines = wrapText(description || 'Fast, private, client-side digital utility on LifeTools.', 68);
  const categoryLabel = escapeXml(theme.label.toUpperCase());

  const iconInner = getLucideSvg(iconName || theme.icon, '#ffffff', 64);
  const watermarkInner = getLucideSvg(iconName || theme.icon, theme.accent, 260);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090d16"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>

    <!-- Category Accent Radial Glow -->
    <radialGradient id="accentGlow" cx="20%" cy="35%" r="60%">
      <stop offset="0%" stop-color="${theme.accent}" stop-opacity="0.18"/>
      <stop offset="60%" stop-color="${theme.accent}" stop-opacity="0.03"/>
      <stop offset="100%" stop-color="${theme.accent}" stop-opacity="0"/>
    </radialGradient>

    <!-- Card Background -->
    <linearGradient id="cardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e293b" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0.85"/>
    </linearGradient>

    <!-- Icon Squircle Gradient -->
    <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${theme.start}"/>
      <stop offset="100%" stop-color="${theme.end}"/>
    </linearGradient>

    <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#059669"/>
    </linearGradient>
  </defs>

  <!-- Canvas Background -->
  <rect width="1200" height="630" fill="url(#bgGrad)"/>
  <rect width="1200" height="630" fill="url(#accentGlow)"/>

  <!-- Subtle Tech Grid Lines -->
  <g stroke="#334155" stroke-opacity="0.15" stroke-width="1">
    <line x1="80" y1="0" x2="80" y2="630"/>
    <line x1="1120" y1="0" x2="1120" y2="630"/>
    <line x1="0" y1="90" x2="1200" y2="90"/>
    <line x1="0" y1="540" x2="1200" y2="540"/>
  </g>

  <!-- Big Decorative Watermark Icon (Right Side) -->
  <g transform="translate(860, 190) scale(1.0)" opacity="0.08" stroke-width="2" stroke="${theme.accent}" fill="none">
    ${watermarkInner}
  </g>

  <!-- Main Card Container -->
  <rect x="80" y="55" width="1040" height="520" rx="28" fill="url(#cardGrad)" stroke="#334155" stroke-width="1.5"/>

  <!-- Top Bar inside Card -->
  <!-- LifeTools Logo & Branding -->
  <g transform="translate(130, 95)">
    <rect x="0" y="0" width="40" height="40" rx="10" fill="url(#logoGrad)"/>
    <path d="M12 20 L18 26 L28 14" stroke="#ffffff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <text x="52" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="800" fill="#ffffff" letter-spacing="-0.5">
      Life<tspan fill="#10b981">Tools</tspan>
    </text>
    <text x="175" y="27" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="500" fill="#64748b">
      • Free Digital Utility Suite
    </text>
  </g>

  <!-- Top Right Platform Pill -->
  <g transform="translate(890, 95)">
    <rect x="0" y="0" width="180" height="34" rx="17" fill="#0f172a" stroke="#334155" stroke-width="1"/>
    <text x="90" y="22" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="600" fill="#38bdf8" text-anchor="middle" letter-spacing="0.5">
      ${escapeXml(badgeText)}
    </text>
  </g>

  <!-- Horizontal Divider -->
  <line x1="130" y1="155" x2="1070" y2="155" stroke="#334155" stroke-opacity="0.6" stroke-width="1"/>

  <!-- Tool Category Pill -->
  <g transform="translate(130, 185)">
    <rect x="0" y="0" width="${categoryLabel.length * 8.5 + 28}" height="28" rx="8" fill="#0f172a" stroke="${theme.accent}" stroke-width="1.2"/>
    <circle cx="14" cy="14" r="4" fill="${theme.accent}"/>
    <text x="26" y="19" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="700" fill="${theme.accent}" letter-spacing="1">
      ${categoryLabel}
    </text>
  </g>

  <!-- Center Content Section -->
  <!-- Tool Icon Squircle Box -->
  <g transform="translate(130, 235)">
    <!-- Glow -->
    <rect x="-4" y="-4" width="118" height="118" rx="28" fill="${theme.accent}" opacity="0.25"/>
    <!-- Box -->
    <rect x="0" y="0" width="110" height="110" rx="24" fill="url(#iconGrad)" stroke="#ffffff" stroke-opacity="0.2" stroke-width="1.5"/>
    <!-- Icon centered inside 110x110 box -->
    <g transform="translate(23, 23)" stroke="#ffffff" stroke-width="2" fill="none">
      ${iconInner}
    </g>
  </g>

  <!-- Tool Title & Description (Adjacent to Icon) -->
  <g transform="translate(270, 275)">
    <!-- Tool Title -->
    <text x="0" y="0" font-family="system-ui, -apple-system, sans-serif" font-size="${titleSize}" font-weight="800" fill="#ffffff" letter-spacing="-0.8">
      ${escapedTitle}
    </text>

    <!-- Tool Description Lines -->
    <text x="0" y="44" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400" fill="#cbd5e1" letter-spacing="-0.2">
      ${escapeXml(descLines[0] || '')}
    </text>
    ${descLines[1] ? `
    <text x="0" y="74" font-family="system-ui, -apple-system, sans-serif" font-size="20" font-weight="400" fill="#cbd5e1" letter-spacing="-0.2">
      ${escapeXml(descLines[1])}
    </text>` : ''}
  </g>

  <!-- Bottom Divider -->
  <line x1="130" y1="475" x2="1070" y2="475" stroke="#334155" stroke-opacity="0.6" stroke-width="1"/>

  <!-- Footer Badges -->
  <g transform="translate(130, 508)">
    <!-- Badge 1: 100% Client-Side -->
    <g transform="translate(0, 0)">
      <circle cx="6" cy="6" r="4" fill="#10b981"/>
      <text x="18" y="10" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#94a3b8">
        100% Client-Side
      </text>
    </g>

    <!-- Badge 2: Zero Server Tracking -->
    <g transform="translate(180, 0)">
      <circle cx="6" cy="6" r="4" fill="#38bdf8"/>
      <text x="18" y="10" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#94a3b8">
        Zero Tracking &amp; No Cloud Storage
      </text>
    </g>

    <!-- Badge 3: Free & Registration-Free -->
    <g transform="translate(480, 0)">
      <circle cx="6" cy="6" r="4" fill="#a855f7"/>
      <text x="18" y="10" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="600" fill="#94a3b8">
        Instant Access • No Login
      </text>
    </g>

    <!-- Domain Branding (Right) -->
    <g transform="translate(790, 0)">
      <text x="150" y="10" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="700" fill="#10b981" text-anchor="end">
        lifetools.surge.sh
      </text>
    </g>
  </g>
</svg>`;
}

/**
 * Extracts TOOLS_REGISTRY from src/data/toolsRegistry.ts using esbuild and Node VM
 */
function extractToolsRegistry() {
  const result = esbuild.buildSync({
    entryPoints: ['src/data/toolsRegistry.ts'],
    bundle: true,
    write: false,
    format: 'cjs',
    platform: 'node',
    external: [
      'react',
      'react-dom',
      'lucide-react',
      'qrcode',
      'diff',
      'pdf-lib',
      'jsqr',
      '../components/*'
    ]
  });

  const ctx = {
    module: { exports: {} },
    exports: {},
    require: (m) => {
      if (m === 'react') return { lazy: (fn) => fn };
      if (m.includes('TemplateRunner')) return { createTemplateComponent: () => () => null };
      return {};
    },
    console
  };

  vm.runInNewContext(result.outputFiles[0].text, ctx);
  const registry = ctx.module.exports.TOOLS_REGISTRY || ctx.exports.TOOLS_REGISTRY;
  if (!registry || !Array.isArray(registry)) {
    throw new Error('Failed to extract TOOLS_REGISTRY array');
  }
  return registry;
}

/**
 * Renders SVG to PNG buffer using @resvg/resvg-js
 */
function renderSvgToPng(svg) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 }
  });
  return resvg.render().asPng();
}

/**
 * Builds metadata tags for HTML injection
 */
function generateMetaTagsHtml({ title, description, canonicalUrl, imageUrl, imageAlt }) {
  const formattedTitle = title.includes('LifeTools') ? title : `${title} — LifeTools`;
  const secureImageUrl = imageUrl.replace(/^http:\/\//, 'https://');

  return `    <!-- Route Metadata -->
    <title>${escapeXml(formattedTitle)}</title>
    <meta name="description" content="${escapeXml(description)}" />
    <link rel="canonical" href="${escapeXml(canonicalUrl)}" />

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="LifeTools" />
    <meta property="og:url" content="${escapeXml(canonicalUrl)}" />
    <meta property="og:title" content="${escapeXml(formattedTitle)}" />
    <meta property="og:description" content="${escapeXml(description)}" />
    <meta property="og:image" content="${escapeXml(secureImageUrl)}" />
    <meta property="og:image:secure_url" content="${escapeXml(secureImageUrl)}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${escapeXml(imageAlt || formattedTitle)}" />

    <!-- Twitter / X -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeXml(formattedTitle)}" />
    <meta name="twitter:description" content="${escapeXml(description)}" />
    <meta name="twitter:image" content="${escapeXml(secureImageUrl)}" />
    <meta name="twitter:image:alt" content="${escapeXml(imageAlt || formattedTitle)}" />`;
}

/**
 * Replaces or injects Open Graph and Twitter tags in HTML content
 */
function injectMetadataIntoHtml(baseHtml, meta) {
  let html = baseHtml;

  // Preserve Google site verification
  const googleTag = `<meta name="google-site-verification" content="${GOOGLE_VERIFICATION}" />`;

  // Strip existing title, canonical, and dynamic meta tags that will be replaced
  html = html.replace(/<title>.*?<\/title>/is, '');
  html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']description["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+property=["']og:[^"']+["'][^>]*>/gi, '');
  html = html.replace(/<meta\s+name=["']twitter:[^"']+["'][^>]*>/gi, '');

  const newMetaHtml = generateMetaTagsHtml(meta);

  // Re-insert right after <head> or before </head>
  if (html.includes('</head>')) {
    html = html.replace('</head>', `${newMetaHtml}\n  </head>`);
  } else {
    html = html.replace('<head>', `<head>\n${newMetaHtml}`);
  }

  // Ensure Google verification tag remains present
  if (!html.includes(GOOGLE_VERIFICATION)) {
    html = html.replace('</head>', `    ${googleTag}\n  </head>`);
  }

  return html;
}

// ==========================================
// MAIN EXECUTION
// ==========================================
async function main() {
  console.log('====================================================');
  console.log('LifeTools Social Media Preview & Prerenderer Engine');
  console.log('====================================================');

  const tools = extractToolsRegistry();
  console.log(`✓ Loaded ${tools.length} registered tools from toolsRegistry.ts`);

  // Directories setup
  const publicDir = path.resolve(__dirname, '..', 'public');
  const distDir = path.resolve(__dirname, '..', 'dist');

  const ogPreviewsDir = path.join(publicDir, 'og-previews');
  const toolsImgDir = path.join(ogPreviewsDir, 'tools');
  const pagesImgDir = path.join(ogPreviewsDir, 'pages');
  const categoriesImgDir = path.join(ogPreviewsDir, 'categories');

  fs.mkdirSync(toolsImgDir, { recursive: true });
  fs.mkdirSync(pagesImgDir, { recursive: true });
  fs.mkdirSync(categoriesImgDir, { recursive: true });

  console.log('\n--- PHASE 1: Generating Social Preview Images (1200x630 PNG) ---');

  const forceRebuild = process.argv.includes('--force');

  // 1. Generate Main Website Preview (public/og-preview.png and public/og-previews/home.png)
  const homeMeta = PUBLIC_PAGES.find(p => p.id === 'home');
  const homePreviewFile = path.join(publicDir, 'og-preview.png');
  if (forceRebuild || !fs.existsSync(homePreviewFile)) {
    const homeSvg = createSocialPreviewSvg({
      title: 'LifeTools — Everything You Need. All in One Place.',
      description: 'Comprehensive, free, privacy-first digital utility platform featuring 634+ fast client-side tools across 20 categories. 100% client-side, zero tracking.',
      category: 'everyday',
      iconName: 'Wrench',
      badgeText: '634+ CLIENT TOOLS'
    });
    const homePng = renderSvgToPng(homeSvg);
    fs.writeFileSync(homePreviewFile, homePng);
    fs.writeFileSync(path.join(ogPreviewsDir, 'home.png'), homePng);
    console.log(`✓ Main website preview: public/og-preview.png & public/og-previews/home.png (${homePng.length.toLocaleString()} bytes)`);
  } else {
    console.log(`✓ Main website preview cached: public/og-preview.png`);
  }

  // 2. Generate Public Page Previews
  let pageImgsCount = 0;
  for (const page of PUBLIC_PAGES) {
    if (page.id === 'home') continue;
    const targetFile = path.join(pagesImgDir, `${page.id}.png`);
    if (forceRebuild || !fs.existsSync(targetFile)) {
      const svg = createSocialPreviewSvg({
        title: page.title.split('—')[0].trim(),
        description: page.description,
        category: page.category,
        iconName: page.iconName,
        badgeText: 'LIFETOOLS PLATFORM'
      });
      const png = renderSvgToPng(svg);
      fs.writeFileSync(targetFile, png);
    }
    pageImgsCount++;
  }
  console.log(`✓ Verified ${pageImgsCount} public page preview images in public/og-previews/pages/`);

  // 3. Generate Category Previews
  let categoryImgsCount = 0;
  for (const [catKey, catTheme] of Object.entries(CATEGORY_THEMES)) {
    const targetFile = path.join(categoriesImgDir, `${catKey}.png`);
    if (forceRebuild || !fs.existsSync(targetFile)) {
      const svg = createSocialPreviewSvg({
        title: `${catTheme.label}`,
        description: `Collection of free, fast client-side ${catTheme.label.toLowerCase()} in LifeTools. 100% private, zero server uploads.`,
        category: catKey,
        iconName: catTheme.icon,
        badgeText: `CATEGORY: ${catKey.toUpperCase()}`
      });
      const png = renderSvgToPng(svg);
      fs.writeFileSync(targetFile, png);
    }
    categoryImgsCount++;
  }
  console.log(`✓ Verified ${categoryImgsCount} category preview images in public/og-previews/categories/`);

  // 4. Generate All 634 Individual Tool Previews
  let toolImgsCount = 0;
  let renderedCount = 0;
  const startTime = Date.now();

  for (const tool of tools) {
    const targetFile = path.join(toolsImgDir, `${tool.id}.png`);
    if (forceRebuild || !fs.existsSync(targetFile)) {
      const svg = createSocialPreviewSvg({
        title: tool.name,
        description: tool.shortDescription,
        category: tool.category,
        iconName: tool.iconName,
        badgeText: '100% CLIENT-SIDE'
      });
      const png = renderSvgToPng(svg);
      fs.writeFileSync(targetFile, png);
      renderedCount++;
    }
    toolImgsCount++;
  }

  const durationMs = Date.now() - startTime;
  if (renderedCount > 0) {
    console.log(`✓ Rendered ${renderedCount} new tool preview images in ${(durationMs / 1000).toFixed(2)}s`);
  } else {
    console.log(`✓ Verified all ${toolImgsCount} tool preview images cached and ready`);
  }

  // --- PHASE 2: Static Route Prerendering (Crawler Compatibility) ---
  if (!fs.existsSync(distDir)) {
    console.log('\n[Notice] dist/ does not exist yet (run vite build first). Skipping HTML prerender step for now.');
    console.log('Images are saved in public/ and will be copied to dist/ on next build.');
    return;
  }

  const indexPath = path.join(distDir, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.log('\n[Notice] dist/index.html not found. Skipping HTML prerender step.');
    return;
  }

  console.log('\n--- PHASE 2: Prerendering Route-Specific HTML for Social Crawlers ---');
  const baseHtml = fs.readFileSync(indexPath, 'utf8');

  // Copy newly generated images directly into dist/og-previews so dist is immediately up to date
  const distOgPreviews = path.join(distDir, 'og-previews');
  fs.cpSync(ogPreviewsDir, distOgPreviews, { recursive: true });
  fs.copyFileSync(path.join(publicDir, 'og-preview.png'), path.join(distDir, 'og-preview.png'));
  console.log('✓ Synchronized all preview images to dist/og-previews/');

  // 1. Update dist/index.html with main site metadata
  const updatedIndexHtml = injectMetadataIntoHtml(baseHtml, {
    title: homeMeta.title,
    description: homeMeta.description,
    canonicalUrl: `${BASE_URL}/`,
    imageUrl: `${BASE_URL}/og-preview.png`,
    imageAlt: homeMeta.title
  });
  fs.writeFileSync(indexPath, updatedIndexHtml, 'utf8');
  console.log('✓ Updated dist/index.html with main Open Graph metadata');

  // 2. Prerender Public Pages
  let prerenderedPages = 0;
  for (const page of PUBLIC_PAGES) {
    if (page.id === 'home') continue;
    const pageHtml = injectMetadataIntoHtml(baseHtml, {
      title: page.title,
      description: page.description,
      canonicalUrl: `${BASE_URL}${page.route}`,
      imageUrl: `${BASE_URL}/og-previews/pages/${page.id}.png`,
      imageAlt: page.title
    });

    const targetDir = path.join(distDir, page.id);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), pageHtml, 'utf8');
    fs.writeFileSync(path.join(distDir, `${page.id}.html`), pageHtml, 'utf8');
    prerenderedPages++;
  }
  console.log(`✓ Prerendered ${prerenderedPages} public page HTML files (dual slash/no-slash)`);

  // 3. Prerender Category Detail Pages
  let prerenderedCategories = 0;
  for (const [catKey, catTheme] of Object.entries(CATEGORY_THEMES)) {
    const catHtml = injectMetadataIntoHtml(baseHtml, {
      title: `${catTheme.label} — Free Online Tools | LifeTools`,
      description: `Collection of free, fast client-side ${catTheme.label.toLowerCase()} in LifeTools. 100% private, zero server uploads.`,
      canonicalUrl: `${BASE_URL}/categories/${catKey}`,
      imageUrl: `${BASE_URL}/og-previews/categories/${catKey}.png`,
      imageAlt: `${catTheme.label} — LifeTools`
    });

    const targetDir = path.join(distDir, 'categories', catKey);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), catHtml, 'utf8');
    fs.writeFileSync(path.join(distDir, 'categories', `${catKey}.html`), catHtml, 'utf8');
    prerenderedCategories++;
  }
  console.log(`✓ Prerendered ${prerenderedCategories} category detail HTML files (dual slash/no-slash)`);

  // 4. Prerender All 634 Individual Tool Pages
  let prerenderedTools = 0;
  for (const tool of tools) {
    const toolHtml = injectMetadataIntoHtml(baseHtml, {
      title: `${tool.name} — LifeTools`,
      description: tool.shortDescription,
      canonicalUrl: `${BASE_URL}/tool/${tool.id}`,
      imageUrl: `${BASE_URL}/og-previews/tools/${tool.id}.png`,
      imageAlt: `${tool.name} — LifeTools`
    });

    const targetDir = path.join(distDir, 'tool', tool.id);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, 'index.html'), toolHtml, 'utf8');
    fs.writeFileSync(path.join(distDir, 'tool', `${tool.id}.html`), toolHtml, 'utf8');
    prerenderedTools++;
  }

  // Prerender known backward-compatibility aliases
  const aliases = [
    { alias: 'image-converter', target: 'image-format-converter' },
    { alias: 'upi-qr-generator', target: 'advanced-upi-qr-generator' }
  ];
  for (const { alias, target } of aliases) {
    const targetFile = path.join(distDir, 'tool', target, 'index.html');
    if (fs.existsSync(targetFile)) {
      const aliasDir = path.join(distDir, 'tool', alias);
      fs.mkdirSync(aliasDir, { recursive: true });
      fs.copyFileSync(targetFile, path.join(aliasDir, 'index.html'));
      fs.copyFileSync(targetFile, path.join(distDir, 'tool', `${alias}.html`));
      // Also copy preview image alias if present
      const targetImg = path.join(toolsImgDir, `${target}.png`);
      const aliasImg = path.join(toolsImgDir, `${alias}.png`);
      if (fs.existsSync(targetImg) && !fs.existsSync(aliasImg)) {
        fs.copyFileSync(targetImg, aliasImg);
      }
      const distAliasImg = path.join(distOgPreviews, 'tools', `${alias}.png`);
      const distTargetImg = path.join(distOgPreviews, 'tools', `${target}.png`);
      if (fs.existsSync(distTargetImg) && !fs.existsSync(distAliasImg)) {
        fs.copyFileSync(distTargetImg, distAliasImg);
      }
    }
  }

  console.log(`✓ Prerendered ${prerenderedTools} individual tool HTML files (dual slash/no-slash plus aliases)`);

  console.log('\n====================================================');
  console.log(`Total Social Preview Images: ${1 + pageImgsCount + categoryImgsCount + toolImgsCount}`);
  console.log(`Total Prerendered HTML Routes: ${1 + prerenderedPages + prerenderedCategories + prerenderedTools}`);
  console.log('All routes fully compatible with social media crawlers!');
  console.log('====================================================');
}

main().catch(err => {
  console.error('[Social Preview Generator] Fatal Error:', err);
  process.exit(1);
});

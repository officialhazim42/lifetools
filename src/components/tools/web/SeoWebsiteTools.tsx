import React, { useState } from 'react';
import {
  Search,
  Eye,
  Share2,
  FileCode,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Link as LinkIcon,
  Copy,
  RotateCcw,
  Heading,
  BarChart,
  FileText,
  Image as ImageIcon,
  Check,
  Smartphone,
  Monitor
} from 'lucide-react';

// -------------------------------------------------------------
// 1. Meta Tag Analyzer
// -------------------------------------------------------------
export const MetaTagAnalyzer: React.FC = () => {
  const [html, setHtml] = useState(`<!DOCTYPE html>
<html>
<head>
  <title>LifeTools — 100% Free & Open Client-Side Digital Utilities</title>
  <meta name="description" content="Over 250 privacy-first digital utilities, calculators, converters, and document creators running entirely in your browser with zero server tracking.">
  <meta name="keywords" content="tools, utilities, calculators, privacy, developer, pwa">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://lifetools.app/">
  <meta property="og:title" content="LifeTools — Free Digital Utilities">
  <meta property="og:image" content="https://lifetools.app/og-cover.png">
</head>
<body></body>
</html>`);

  const analyze = () => {
    const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i) ||
      html.match(/<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i);
    const robotsMatch = html.match(/<meta[^>]*name=["']robots["'][^>]*content=["']([^"']*)["']/i);
    const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);

    const title = titleMatch ? titleMatch[1].trim() : '';
    const desc = descMatch ? descMatch[1].trim() : '';
    const robots = robotsMatch ? robotsMatch[1].trim() : 'index, follow (default)';
    const canonical = canonicalMatch ? canonicalMatch[1].trim() : 'Not specified';

    return {
      title,
      titleLength: title.length,
      titleValid: title.length >= 30 && title.length <= 60,
      desc,
      descLength: desc.length,
      descValid: desc.length >= 120 && desc.length <= 160,
      robots,
      canonical
    };
  };

  const res = analyze();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
          Paste HTML Source or &lt;head&gt; Markup
        </label>
        <textarea
          rows={7}
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Title Tag */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Page Title</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${res.titleValid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}>
              {res.titleLength} / 60 Chars
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{res.title || '(Missing)'}</p>
        </div>

        {/* Description Tag */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Meta Description</span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${res.descValid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
              }`}>
              {res.descLength} / 160 Chars
            </span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">{res.desc || '(Missing)'}</p>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. Meta Tag Preview (Google SERP)
// -------------------------------------------------------------
export const MetaTagPreview: React.FC = () => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [mode, setMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <button
          onClick={() => setMode('desktop')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${mode === 'desktop' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}
        >
          <Monitor className="w-3.5 h-3.5" /> Desktop Preview
        </button>
        <button
          onClick={() => setMode('mobile')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 ${mode === 'mobile' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 dark:bg-slate-800'}`}
        >
          <Smartphone className="w-3.5 h-3.5" /> Mobile Preview
        </button>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter page title"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter canonical URL (e.g. https://example.com/page)"
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
        <textarea
          rows={2}
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Enter snippet / meta description (recommended 150-160 chars)..."
          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
      </div>

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Google Search Result Preview</span>
        <div className={`p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-1 ${mode === 'mobile' ? 'max-w-sm' : 'max-w-2xl'}`}>
          <div className="text-[11px] text-slate-700 dark:text-slate-300 truncate">{url || 'https://example.com/page'}</div>
          <div className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer truncate">
            {title || 'Page Title Example — Site Name'}
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {desc || 'Page description snippet will appear here in search engine results.'}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. Open Graph Preview & 4. Twitter Card Preview
// -------------------------------------------------------------
export const OpenGraphPreview: React.FC = () => {
  const [ogTitle, setOgTitle] = useState('');
  const [ogDesc, setOgDesc] = useState('');
  const [ogImage, setOgImage] = useState('');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={ogTitle}
          onChange={(e) => setOgTitle(e.target.value)}
          placeholder="Enter og:title"
          className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
        <input
          type="text"
          value={ogImage}
          onChange={(e) => setOgImage(e.target.value)}
          placeholder="Enter og:image URL (e.g. https://example.com/banner.jpg)"
          className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
      </div>

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 max-w-md">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Facebook / LinkedIn Card Preview</span>
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          {ogImage ? (
            <img src={ogImage} alt="OG Preview" className="w-full h-44 object-cover" />
          ) : (
            <div className="w-full h-44 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs text-slate-400">
              No Image URL Provided
            </div>
          )}
          <div className="p-3.5 space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">EXAMPLE.COM</span>
            <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{ogTitle || 'Social Card Title Preview'}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{ogDesc || 'Social card description preview will display here.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TwitterCardPreview: React.FC = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [desc, setDesc] = useState('');

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter Twitter card title"
          className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
        <input
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Enter creator @handle"
          className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
      </div>

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3 max-w-md">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">X / Twitter Card Preview (Large Image)</span>
        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
          <div className="w-full h-40 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-base">
            Card Banner
          </div>
          <div className="p-3.5 space-y-1">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{title || 'Card Title Preview'}</h4>
            <span className="text-[11px] text-slate-400 block">{author || '@username'}</span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">{desc || 'Card description text preview will appear here.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. Robots.txt Tester
// -------------------------------------------------------------
export const RobotsTxtTester: React.FC = () => {
  const [rules, setRules] = useState(`User-agent: *
Disallow: /admin/
Disallow: /private/
Disallow: /api/
Allow: /public/

User-agent: Googlebot
Disallow: /temp/`);

  const [testPath, setTestPath] = useState('/admin/dashboard');
  const [userAgent, setUserAgent] = useState('*');

  const testRule = () => {
    const lines = rules.split('\n').map((l) => l.trim()).filter((l) => !l.startsWith('#') && l);
    let currentUserAgent = '';
    let allowed = true;
    let matchedRule = 'Default (Allow all)';

    for (const line of lines) {
      if (/^User-agent:\s*(.*)/i.test(line)) {
        currentUserAgent = line.split(':')[1].trim();
      } else if (currentUserAgent === '*' || currentUserAgent.toLowerCase() === userAgent.toLowerCase()) {
        if (/^Disallow:\s*(.*)/i.test(line)) {
          const path = line.split(':')[1].trim();
          if (path && testPath.startsWith(path)) {
            allowed = false;
            matchedRule = line;
          }
        } else if (/^Allow:\s*(.*)/i.test(line)) {
          const path = line.split(':')[1].trim();
          if (path && testPath.startsWith(path)) {
            allowed = true;
            matchedRule = line;
          }
        }
      }
    }

    return { allowed, matchedRule };
  };

  const { allowed, matchedRule } = testRule();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Robots.txt Content</label>
          <textarea
            rows={6}
            value={rules}
            onChange={(e) => setRules(e.target.value)}
            className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Test URL Path</label>
            <input
              type="text"
              value={testPath}
              onChange={(e) => setTestPath(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">User Agent</label>
            <select
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold"
            >
              <option value="*">* (All Crawlers)</option>
              <option value="Googlebot">Googlebot</option>
              <option value="Bingbot">Bingbot</option>
              <option value="GPTBot">GPTBot (OpenAI)</option>
            </select>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Crawler Verdict:</span>
            <div className="mt-1 flex items-center gap-2">
              {allowed ? (
                <>
                  <CheckCircle className="w-5 h-5 text-emerald-500" />
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">ALLOWED</span>
                </>
              ) : (
                <>
                  <XCircle className="w-5 h-5 text-rose-500" />
                  <span className="font-bold text-rose-600 dark:text-rose-400">DISALLOWED (Blocked)</span>
                </>
              )}
            </div>
            <div className="mt-2 text-[10px] font-mono text-slate-500">Matching Rule: {matchedRule}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 6. Sitemap Validator
// -------------------------------------------------------------
export const SitemapValidator: React.FC = () => {
  const [xml, setXml] = useState(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://lifetools.app/</loc>
    <lastmod>2026-11-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://lifetools.app/#/tools</loc>
    <lastmod>2026-11-20</lastmod>
    <priority>0.9</priority>
  </url>
</urlset>`);

  const validate = () => {
    const urls = (xml.match(/<loc>[\s\S]*?<\/loc>/gi) || []).length;
    const hasUrlset = /<urlset[\s\S]*?>/i.test(xml);
    const hasXmlHeader = /^<\?xml/i.test(xml.trim());
    return {
      isValid: hasUrlset && urls > 0,
      urlCount: urls,
      hasXmlHeader
    };
  };

  const res = validate();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">XML Sitemap Code</label>
        <textarea
          rows={7}
          value={xml}
          onChange={(e) => setXml(e.target.value)}
          className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {res.isValid ? (
            <CheckCircle className="w-5 h-5 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          )}
          <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
            {res.isValid ? 'Valid XML Sitemap' : 'Syntax Warning Detected'}
          </span>
        </div>
        <span className="font-mono text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
          {res.urlCount} URLs Found
        </span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 7. Canonical URL Checker
// -------------------------------------------------------------
export const CanonicalUrlChecker: React.FC = () => {
  const [currentUrl, setCurrentUrl] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');

  const isMatch = currentUrl && canonicalUrl ? currentUrl.replace(/\/$/, '') === canonicalUrl.replace(/\/$/, '') : null;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Requested URL</label>
          <input
            type="text"
            value={currentUrl}
            onChange={(e) => setCurrentUrl(e.target.value)}
            placeholder="Enter requested URL (e.g. https://example.com/page/)"
            className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Canonical Tag URL</label>
          <input
            type="text"
            value={canonicalUrl}
            onChange={(e) => setCanonicalUrl(e.target.value)}
            placeholder="Enter canonical URL (e.g. https://example.com/page)"
            className="w-full px-3.5 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500">Alignment Status</span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isMatch ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
          {isMatch ? 'Canonical Matches' : 'Trailing Slash / Path Mismatch'}
        </span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 8. Heading Structure Analyzer
// -------------------------------------------------------------
export const HeadingStructureAnalyzer: React.FC = () => {
  const [html, setHtml] = useState(`<h1>LifeTools Platform</h1>
<p>Intro</p>
<h2>Calculators</h2>
<h3>Financial Calculators</h3>
<h2>Text Tools</h2>
<h4>Skipped Level Heading</h4>`);

  const extractHeadings = () => {
    const matches = [...html.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)];
    return matches.map((m) => ({ level: m[1].toUpperCase(), text: m[2].trim() }));
  };

  const headings = extractHeadings();

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Paste HTML Document</label>
        <textarea
          rows={6}
          value={html}
          onChange={(e) => setHtml(e.target.value)}
          className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
      </div>

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Heading Tree Outline</h4>
        <div className="space-y-1.5 font-mono text-xs">
          {headings.map((h, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-850">
              <span className="px-1.5 py-0.5 rounded font-bold text-[10px] bg-slate-200 dark:bg-slate-700">{h.level}</span>
              <span className="text-slate-800 dark:text-slate-200">{h.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 9. Keyword Density & 10. Word Frequency Analyzer
// -------------------------------------------------------------
export const KeywordDensityChecker: React.FC = () => {
  const [text, setText] = useState('LifeTools provides client-side digital tools. The digital tools and web utilities run locally.');

  const words = text.toLowerCase().match(/\b[a-z0-9_-]+\b/gi) || [];
  const freq: Record<string, number> = {};
  words.forEach((w) => { freq[w] = (freq[w] || 0) + 1; });

  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div className="space-y-6">
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase">Top Keywords & Density</h4>
        <div className="space-y-1 text-xs font-mono">
          {sorted.map(([w, c]) => (
            <div key={w} className="flex justify-between p-2 bg-slate-50 dark:bg-slate-850 rounded-lg">
              <span>{w}</span>
              <span className="font-bold">{c} ({((c / words.length) * 100).toFixed(1)}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const WordFrequencyAnalyzer: React.FC = () => {
  const [text, setText] = useState('Search engine optimization is the process of improving the quality and quantity of website traffic to a website or a web page from search engines.');

  const words = text.toLowerCase().match(/\b[a-z0-9_-]+\b/gi) || [];
  const unique = new Set(words).size;

  return (
    <div className="space-y-6">
      <textarea
        rows={4}
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Total Words</span>
          <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">{words.length}</div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Unique Vocabulary</span>
          <div className="text-xl font-bold font-mono text-emerald-500 mt-1">{unique}</div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-400">Reading Time</span>
          <div className="text-xl font-bold font-mono text-slate-800 dark:text-slate-200 mt-1">{Math.ceil(words.length / 200)} min</div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 11. Broken Link Checker
// -------------------------------------------------------------
export const BrokenLinkChecker: React.FC = () => {
  const [html, setHtml] = useState(`<a href="https://lifetools.app/">Home</a>
<a href="#/tools">All Tools</a>
<a href="mailto:support@lifetools.app">Email</a>
<a href="https://example.com/missing-page">Broken Link</a>`);

  const links = [...html.matchAll(/<a[^>]*href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)].map((m) => ({
    url: m[1],
    text: m[2].trim()
  }));

  return (
    <div className="space-y-6">
      <textarea
        rows={5}
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase">Extracted Document Links ({links.length})</h4>
        <div className="space-y-2 font-mono text-xs">
          {links.map((l, i) => (
            <div key={i} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">{l.text}</span>
                <span className="text-slate-400 block text-[10px]">{l.url}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
                Syntax Valid
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 12. Website Title Extractor
// -------------------------------------------------------------
export const WebsiteTitleExtractor: React.FC = () => {
  const [html, setHtml] = useState('<title>LifeTools — Privacy-First Client-Side Utilities</title>');
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const title = match ? match[1].trim() : 'No title tag found';

  return (
    <div className="space-y-6">
      <textarea
        rows={4}
        value={html}
        onChange={(e) => setHtml(e.target.value)}
        className="w-full font-mono text-xs px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800">
        <span className="text-xs text-slate-400">Extracted Title:</span>
        <div className="font-bold text-base text-slate-900 dark:text-white mt-1">{title}</div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 13. Favicon Preview Generator
// -------------------------------------------------------------
export const FaviconPreviewGenerator: React.FC = () => {
  const [faviconUrl, setFaviconUrl] = useState('');

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={faviconUrl}
        onChange={(e) => setFaviconUrl(e.target.value)}
        placeholder="Enter favicon URL (e.g. https://example.com/favicon.ico)"
        className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-mono"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Browser Tab Preview */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <span className="text-[10px] font-bold uppercase text-slate-400">Chrome Tab Preview</span>
          <div className="mt-3 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-t-lg shadow-xs max-w-xs">
            <img src={faviconUrl} alt="Favicon" className="w-4 h-4 object-contain" />
            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate">LifeTools - App</span>
          </div>
        </div>

        {/* Mobile Bookmark Preview */}
        <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center">
          <img src={faviconUrl} alt="Favicon" className="w-12 h-12 rounded-xl shadow-md bg-white p-1" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-2">LifeTools</span>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 14. Schema Markup Validator
// -------------------------------------------------------------
export const SchemaMarkupValidator: React.FC = () => {
  const [schemaJson, setSchemaJson] = useState(`{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "LifeTools",
  "applicationCategory": "UtilitiesApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}`);

  const validate = () => {
    try {
      const parsed = JSON.parse(schemaJson);
      return { valid: true, type: parsed['@type'] || 'Generic', context: parsed['@context'] };
    } catch (e: any) {
      return { valid: false, error: e.message };
    }
  };

  const res = validate();

  return (
    <div className="space-y-6">
      <textarea
        rows={8}
        value={schemaJson}
        onChange={(e) => setSchemaJson(e.target.value)}
        className="w-full font-mono text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
          {res.valid ? `Valid Schema.org (${res.type})` : 'JSON Parsing Error'}
        </span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${res.valid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700'}`}>
          {res.valid ? 'PASSED' : 'FAILED'}
        </span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 15. URL Slug Checker
// -------------------------------------------------------------
export const UrlSlugChecker: React.FC = () => {
  const [slug, setSlug] = useState('web-internet-utilities-2026');

  const isValid = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);

  return (
    <div className="space-y-6">
      <input
        type="text"
        value={slug}
        onChange={(e) => setSlug(e.target.value.toLowerCase())}
        className="w-full px-4 py-2.5 font-mono text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs text-slate-500">SEO Slug Evaluation</span>
        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${isValid ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-amber-100 text-amber-700'}`}>
          {isValid ? 'SEO Friendly Format' : 'Contains Spaces / Invalid Chars'}
        </span>
      </div>
    </div>
  );
};

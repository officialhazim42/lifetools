import React, { useState, useEffect, useRef } from 'react';
import {
  Code,
  Eye,
  Play,
  RotateCcw,
  Copy,
  Download,
  Terminal,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  Link,
  Share2,
  FileText
} from 'lucide-react';

// -------------------------------------------------------------
// 1. HTML Live Preview
// -------------------------------------------------------------
export const HtmlLivePreview: React.FC = () => {
  const [code, setCode] = useState(`<div style="font-family: system-ui; text-align: center; padding: 40px; background: #0f172a; color: white; border-radius: 16px;">
  <h2 style="color: #10b981;">Hello from LifeTools Live Preview!</h2>
  <p style="color: #94a3b8;">Edit this HTML code on the left to see instant updates in this isolated sandbox.</p>
  <button style="background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">Interactive Button</button>
</div>`);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            HTML Source Code
          </label>
          <textarea
            rows={12}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">
            Sandboxed Live Output
          </label>
          <div className="w-full h-64 lg:h-[290px] rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 overflow-hidden shadow-xs">
            <iframe
              sandbox="allow-scripts"
              srcDoc={code}
              title="HTML Sandbox"
              className="w-full h-full border-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 2. CSS Live Playground
// -------------------------------------------------------------
export const CssLivePlayground: React.FC = () => {
  const [css, setCss] = useState(`.custom-card {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgba(79, 70, 229, 0.4);
  text-align: center;
  font-family: system-ui, sans-serif;
}`);

  const fullHtml = `<style>${css}</style><div class="custom-card"><h3>Live CSS Component</h3><p>Real-time styling engine with zero page reloads.</p></div>`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">CSS Rules</label>
        <textarea
          rows={10}
          value={css}
          onChange={(e) => setCss(e.target.value)}
          className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
        />
      </div>
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Rendered Component</label>
        <div className="h-60 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-4 flex items-center justify-center">
          <iframe sandbox="allow-scripts" srcDoc={fullHtml} title="CSS Playground" className="w-full h-full border-none" />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 3. JavaScript Playground
// -------------------------------------------------------------
export const JavascriptPlayground: React.FC = () => {
  const [jsCode, setJsCode] = useState(`console.log("LifeTools JS Playground");
const numbers = [1, 2, 3, 4, 5];
const sum = numbers.reduce((a, b) => a + b, 0);
console.log("Array sum:", sum);`);

  const [logs, setLogs] = useState<string[]>([]);

  const runCode = () => {
    const interceptedLogs: string[] = [];
    try {
      // Evaluate in safe isolated Function with intercepted console
      const customConsole = {
        log: (...args: any[]) => interceptedLogs.push(args.map(String).join(' ')),
        warn: (...args: any[]) => interceptedLogs.push('WARN: ' + args.map(String).join(' ')),
        error: (...args: any[]) => interceptedLogs.push('ERR: ' + args.map(String).join(' '))
      };
      const runner = new Function('console', jsCode);
      runner(customConsole);
      setLogs(interceptedLogs.length > 0 ? interceptedLogs : ['Execution finished (no console output).']);
    } catch (err: any) {
      setLogs([`Runtime Error: ${err.message}`]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">JavaScript Source</label>
            <button
              onClick={runCode}
              className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
            >
              <Play className="w-3.5 h-3.5" /> Run Code
            </button>
          </div>
          <textarea
            rows={8}
            value={jsCode}
            onChange={(e) => setJsCode(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Captured Console Output</label>
          <div className="h-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 text-emerald-400 font-mono text-xs p-3 overflow-y-auto space-y-1">
            {logs.length === 0 ? (
              <span className="text-slate-600">Click "Run Code" to view console output...</span>
            ) : (
              logs.map((l, i) => <div key={i}>{l}</div>)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 4. Markdown Live Preview
// -------------------------------------------------------------
export const MarkdownLivePreview: React.FC = () => {
  const [md, setMd] = useState(`# LifeTools Markdown
## Client-Side Real-Time Editor
- **Fast:** Instant DOM updates
- **Secure:** Pure local execution
- *Supported:* Headers, lists, and formatting.`);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <textarea
        rows={10}
        value={md}
        onChange={(e) => setMd(e.target.value)}
        className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 prose prose-sm dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: md.replace(/^# (.*$)/gim, '<h1>$1</h1>').replace(/^## (.*$)/gim, '<h2>$1</h2>').replace(/^\- (.*$)/gim, '<li>$1</li>') }} />
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 5. SVG Viewer & 6. SVG Optimizer
// -------------------------------------------------------------
export const SvgViewer: React.FC = () => {
  const [svg, setSvg] = useState(`<svg width="120" height="120" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
  <circle cx="50" cy="50" r="45" fill="#10b981" />
  <path d="M30 50 L45 65 L70 35" stroke="white" stroke-width="8" stroke-linecap="round" fill="none" />
</svg>`);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <textarea
        rows={8}
        value={svg}
        onChange={(e) => setSvg(e.target.value)}
        className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
      />
      <div className="h-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
        <div dangerouslySetInnerHTML={{ __html: svg }} />
      </div>
    </div>
  );
};

export const SvgOptimizer: React.FC = () => {
  const [rawSvg, setRawSvg] = useState(`<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
  <!-- Creator: SVG Design -->
  <circle cx="50.000" cy="50.000" r="40.000" fill="#2563eb"    />
</svg>`);

  const optimize = () => {
    return rawSvg
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/\s+/g, ' ')
      .replace(/> </g, '><')
      .replace(/\.000/g, '')
      .trim();
  };

  const optimized = optimize();
  const savings = Math.max(0, Math.round(((rawSvg.length - optimized.length) / rawSvg.length) * 100));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Original ({rawSvg.length} bytes)</label>
          <textarea
            rows={6}
            value={rawSvg}
            onChange={(e) => setRawSvg(e.target.value)}
            className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 block mb-1">Optimized ({optimized.length} bytes)</label>
          <textarea
            rows={6}
            readOnly
            value={optimized}
            className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-emerald-500 font-bold"
          />
        </div>
      </div>
      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 text-center">
        Payload Size Reduced by {savings}%
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 7. HTML Email Preview
// -------------------------------------------------------------
export const HtmlEmailPreview: React.FC = () => {
  const [emailHtml, setEmailHtml] = useState(`<table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 8px;">
  <tr>
    <td style="background-color: #059669; padding: 20px; text-align: center; color: white;">
      <h2 style="margin: 0;">Weekly Product Newsletter</h2>
    </td>
  </tr>
  <tr>
    <td style="padding: 30px; color: #334155; line-height: 1.6;">
      <p>Hello valued subscriber,</p>
      <p>Your weekly summary is ready. Click below to view your personalized updates.</p>
      <table cellpadding="0" cellspacing="0" style="margin: 20px auto;">
        <tr>
          <td style="background-color: #059669; border-radius: 6px; text-align: center;">
            <a href="https://lifetools.app" style="color: white; padding: 12px 24px; text-decoration: none; display: inline-block; font-weight: bold;">Access Dashboard</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`);

  return (
    <div className="space-y-4">
      <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 overflow-x-auto flex justify-center">
        <div className="w-full max-w-[600px] bg-white text-slate-900 shadow-lg rounded-xl overflow-hidden p-2">
          <div dangerouslySetInnerHTML={{ __html: emailHtml }} />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 8. Responsive Screen Tester
// -------------------------------------------------------------
export const ResponsiveScreenTester: React.FC = () => {
  const [viewport, setViewport] = useState({ width: 375, height: 667, name: 'iPhone SE / Mobile' });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {[
          { width: 375, height: 667, name: 'Mobile (375px)' },
          { width: 768, height: 1024, name: 'Tablet (768px)' },
          { width: 1280, height: 800, name: 'Desktop (1280px)' }
        ].map((vp) => (
          <button
            key={vp.name}
            onClick={() => setViewport(vp)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold ${viewport.name === vp.name ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-800'}`}
          >
            {vp.name}
          </button>
        ))}
      </div>

      <div className="p-4 bg-slate-200 dark:bg-slate-950 rounded-2xl flex justify-center overflow-x-auto">
        <div style={{ width: `${Math.min(viewport.width, 800)}px`, height: '400px' }} className="bg-white rounded-xl shadow-xl overflow-hidden border border-slate-300">
          <iframe sandbox="allow-scripts" srcDoc="<body style='font-family:system-ui;padding:20px;text-align:center;'><h3>Responsive Test Canvas</h3><p>Testing viewport width</p></body>" className="w-full h-full border-none" title="Screen Tester" />
        </div>
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 9. URL Builder & 10. UTM Link Generator
// -------------------------------------------------------------
export const UrlBuilder: React.FC = () => {
  const [base, setBase] = useState('https://lifetools.app/search');
  const [q, setQ] = useState('calculator');
  const [lang, setLang] = useState('en');

  const finalUrl = `${base}?q=${encodeURIComponent(q)}&lang=${encodeURIComponent(lang)}`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <input type="text" value={base} onChange={(e) => setBase(e.target.value)} placeholder="Base URL" className="px-3 py-2 text-xs rounded-xl border" />
        <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="param q" className="px-3 py-2 text-xs rounded-xl border" />
        <input type="text" value={lang} onChange={(e) => setLang(e.target.value)} placeholder="param lang" className="px-3 py-2 text-xs rounded-xl border" />
      </div>
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 font-mono text-xs break-all font-bold text-emerald-500">
        {finalUrl}
      </div>
    </div>
  );
};

export const UtmLinkGenerator: React.FC = () => {
  const [url, setUrl] = useState('https://lifetools.app');
  const [source, setSource] = useState('twitter');
  const [medium, setMedium] = useState('social');
  const [campaign, setCampaign] = useState('spring_launch');

  const utmUrl = `${url}?utm_source=${encodeURIComponent(source)}&utm_medium=${encodeURIComponent(medium)}&utm_campaign=${encodeURIComponent(campaign)}`;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Target URL" className="px-3 py-2 text-xs rounded-xl border" />
        <input type="text" value={source} onChange={(e) => setSource(e.target.value)} placeholder="utm_source" className="px-3 py-2 text-xs rounded-xl border" />
        <input type="text" value={medium} onChange={(e) => setMedium(e.target.value)} placeholder="utm_medium" className="px-3 py-2 text-xs rounded-xl border" />
        <input type="text" value={campaign} onChange={(e) => setCampaign(e.target.value)} placeholder="utm_campaign" className="px-3 py-2 text-xs rounded-xl border" />
      </div>
      <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl font-mono text-xs break-all font-bold text-emerald-500">
        {utmUrl}
      </div>
    </div>
  );
};

// -------------------------------------------------------------
// 11. Robots.txt Generator & Directives Builder
// -------------------------------------------------------------
export const RobotsTxtBuilder: React.FC = () => {
  const [sitemap, setSitemap] = useState('https://lifetools.app/sitemap.xml');
  const [disallowAi, setDisallowAi] = useState(true);

  const txt = `User-agent: *
Disallow: /admin/
Disallow: /private/
Allow: /

${disallowAi ? `User-agent: GPTBot\nDisallow: /\n\nUser-agent: ClaudeBot\nDisallow: /\n` : ''}Sitemap: ${sitemap}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
          <input type="checkbox" checked={disallowAi} onChange={(e) => setDisallowAi(e.target.checked)} className="rounded text-emerald-500" />
          <span>Block AI Web Crawlers (GPTBot & ClaudeBot)</span>
        </label>
      </div>
      <textarea rows={8} readOnly value={txt} className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
    </div>
  );
};

// -------------------------------------------------------------
// 12. .htaccess Generator
// -------------------------------------------------------------
export const HtaccessGenerator: React.FC = () => {
  const [forceHttps, setForceHttps] = useState(true);
  const [enableGzip, setEnableGzip] = useState(true);

  const htaccess = `# Apache Configuration File
RewriteEngine On

${forceHttps ? `# Redirect HTTP to HTTPS\nRewriteCond %{HTTPS} off\nRewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]\n` : ''}
${enableGzip ? `# Enable GZIP Compression\n<IfModule mod_deflate.c>\n  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript application/json\n</IfModule>\n` : ''}
# Prevent Directory Browsing
Options -Indexes`;

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <label className="text-xs font-bold flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={forceHttps} onChange={(e) => setForceHttps(e.target.checked)} />
          <span>Force HTTPS 301</span>
        </label>
        <label className="text-xs font-bold flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={enableGzip} onChange={(e) => setEnableGzip(e.target.checked)} />
          <span>GZIP Compression</span>
        </label>
      </div>
      <textarea rows={8} readOnly value={htaccess} className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
    </div>
  );
};

// -------------------------------------------------------------
// 13. Web App Manifest Generator
// -------------------------------------------------------------
export const WebManifestGenerator: React.FC = () => {
  const [name, setName] = useState('LifeTools');
  const [theme, setTheme] = useState('#059669');

  const json = JSON.stringify({
    name,
    short_name: name,
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: theme,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }
    ]
  }, null, 2);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="App Name" className="px-3 py-2 text-xs rounded-xl border" />
        <input type="color" value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full h-9 rounded-xl cursor-pointer" />
      </div>
      <textarea rows={9} readOnly value={json} className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900" />
    </div>
  );
};

// -------------------------------------------------------------
// 14. Browser Compatibility Checker
// -------------------------------------------------------------
export const BrowserCompatibilityChecker: React.FC = () => {
  const features = [
    { name: 'Service Worker (Offline)', supported: typeof navigator !== 'undefined' && 'serviceWorker' in navigator },
    { name: 'Web Crypto API', supported: typeof window !== 'undefined' && 'crypto' in window && 'subtle' in window.crypto },
    { name: 'IndexedDB Storage', supported: typeof window !== 'undefined' && 'indexedDB' in window },
    { name: 'Web Audio API', supported: typeof window !== 'undefined' && ('AudioContext' in window || 'webkitAudioContext' in window) },
    { name: 'HTML5 Canvas API', supported: typeof document !== 'undefined' && !!document.createElement('canvas').getContext }
  ];

  return (
    <div className="space-y-3 font-mono text-xs">
      {features.map((f) => (
        <div key={f.name} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <span className="font-semibold text-slate-800 dark:text-slate-200">{f.name}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${f.supported ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : 'bg-rose-100 text-rose-700'}`}>
            {f.supported ? 'SUPPORTED' : 'UNSUPPORTED'}
          </span>
        </div>
      ))}
    </div>
  );
};

// -------------------------------------------------------------
// 15. CSS Unit Converter
// -------------------------------------------------------------
export const CssUnitConverter: React.FC = () => {
  const [pixels, setPixels] = useState(16);
  const baseFont = 16;

  const rem = (pixels / baseFont).toFixed(3);
  const em = (pixels / baseFont).toFixed(3);
  const pt = (pixels * 0.75).toFixed(2);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pixels (px)</label>
        <input
          type="number"
          value={pixels}
          onChange={(e) => setPixels(Number(e.target.value))}
          className="w-full px-4 py-2 font-mono text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 font-bold"
        />
      </div>

      <div className="grid grid-cols-3 gap-3 text-center font-mono">
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border">
          <span className="text-xs text-slate-400">rem</span>
          <div className="text-xl font-bold text-emerald-500 mt-1">{rem} rem</div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border">
          <span className="text-xs text-slate-400">em</span>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{em} em</div>
        </div>
        <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-xl border">
          <span className="text-xs text-slate-400">Points (pt)</span>
          <div className="text-xl font-bold text-slate-800 dark:text-slate-200 mt-1">{pt} pt</div>
        </div>
      </div>
    </div>
  );
};

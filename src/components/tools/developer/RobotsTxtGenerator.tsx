import React, { useState } from 'react';
import { copyToClipboard, downloadFile } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Download } from 'lucide-react';

export const RobotsTxtGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [userAgent, setUserAgent] = useState('*');
  const [allowPath, setAllowPath] = useState('/');
  const [disallowPaths, setDisallowPaths] = useState('/admin/\n/api/\n/tmp/');
  const [sitemapUrl, setSitemapUrl] = useState('https://lifetools.app/sitemap.xml');
  const [crawlDelay, setCrawlDelay] = useState<number | ''>('');

  const generate = () => {
    let output = `User-agent: ${userAgent}\n`;
    if (allowPath) {
      output += `Allow: ${allowPath}\n`;
    }
    disallowPaths
      .split('\n')
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((p) => {
        output += `Disallow: ${p}\n`;
      });

    if (crawlDelay !== '') {
      output += `Crawl-delay: ${crawlDelay}\n`;
    }

    if (sitemapUrl) {
      output += `\nSitemap: ${sitemapUrl}\n`;
    }

    return output;
  };

  const robotsTxt = generate();

  const handleCopy = () => {
    copyToClipboard(robotsTxt);
    showToast('robots.txt content copied!');
  };

  const handleDownload = () => {
    downloadFile(robotsTxt, 'robots.txt');
    showToast('Downloaded robots.txt');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
          Robots Directives Setup
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              User-Agent
            </label>
            <input
              type="text"
              value={userAgent}
              onChange={(e) => setUserAgent(e.target.value)}
              className="input-base text-sm font-mono"
              placeholder="*"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Allowed Path
            </label>
            <input
              type="text"
              value={allowPath}
              onChange={(e) => setAllowPath(e.target.value)}
              className="input-base text-sm font-mono"
              placeholder="/"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Disallow Paths (one per line)
            </label>
            <textarea
              rows={3}
              value={disallowPaths}
              onChange={(e) => setDisallowPaths(e.target.value)}
              className="input-base text-sm font-mono"
              placeholder="/private/"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Sitemap URL
            </label>
            <input
              type="url"
              value={sitemapUrl}
              onChange={(e) => setSitemapUrl(e.target.value)}
              className="input-base text-sm"
              placeholder="https://example.com/sitemap.xml"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Crawl Delay (Seconds, Optional)
            </label>
            <input
              type="number"
              min="0"
              value={crawlDelay}
              onChange={(e) => setCrawlDelay(e.target.value === '' ? '' : Number(e.target.value))}
              className="input-base text-sm"
              placeholder="e.g. 5"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Generated robots.txt
          </label>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary text-xs py-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
            <button onClick={handleDownload} className="btn-secondary text-xs py-1">
              <Download className="w-3.5 h-3.5" /> Download robots.txt
            </button>
          </div>
        </div>
        <textarea
          rows={8}
          readOnly
          value={robotsTxt}
          className="input-base text-xs font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
        />
      </div>
    </div>
  );
};

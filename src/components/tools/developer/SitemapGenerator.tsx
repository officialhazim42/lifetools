import React, { useState } from 'react';
import { copyToClipboard, downloadFile } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Download } from 'lucide-react';

export const SitemapGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [urls, setUrls] = useState('');
  const [changefreq, setChangefreq] = useState('weekly');
  const [priority, setPriority] = useState('0.8');

  const generateSitemap = () => {
    const list = urls.split('\n').map((u) => u.trim()).filter(Boolean);
    const today = new Date().toISOString().split('T')[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${list
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    return xml;
  };

  const sitemapXml = generateSitemap();

  const handleCopy = () => {
    copyToClipboard(sitemapXml);
    showToast('XML sitemap copied!');
  };

  const handleDownload = () => {
    downloadFile(sitemapXml, 'sitemap.xml', 'application/xml');
    showToast('Downloaded sitemap.xml');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
          XML Sitemap Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Change Frequency
            </label>
            <select
              value={changefreq}
              onChange={(e) => setChangefreq(e.target.value)}
              className="input-base text-sm"
            >
              <option value="always">Always</option>
              <option value="hourly">Hourly</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="never">Never</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Default Priority
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="input-base text-sm"
            >
              <option value="1.0">1.0 (Highest)</option>
              <option value="0.8">0.8 (Important)</option>
              <option value="0.6">0.6 (Normal)</option>
              <option value="0.5">0.5 (Default)</option>
              <option value="0.3">0.3 (Low)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Website URLs List (one per line)
            </label>
            <textarea
              rows={5}
              value={urls}
              onChange={(e) => setUrls(e.target.value)}
              className="input-base text-sm font-mono"
              placeholder="https://example.com/page-1"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Generated sitemap.xml
          </label>
          <div className="flex gap-2">
            <button onClick={handleCopy} className="btn-secondary text-xs py-1">
              <Copy className="w-3.5 h-3.5" /> Copy XML
            </button>
            <button onClick={handleDownload} className="btn-secondary text-xs py-1">
              <Download className="w-3.5 h-3.5" /> Download sitemap.xml
            </button>
          </div>
        </div>
        <textarea
          rows={10}
          readOnly
          value={sitemapXml}
          className="input-base text-xs font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
        />
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy } from 'lucide-react';

export const MetaTagGenerator: React.FC = () => {
  const { showToast } = useToast();
  const [siteTitle, setSiteTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [author, setAuthor] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const generateTags = () => {
    return `<!-- Primary Meta Tags -->
<title>${siteTitle || 'My Website'}</title>
<meta name="title" content="${siteTitle}">
<meta name="description" content="${description}">
<meta name="keywords" content="${keywords}">
<meta name="author" content="${author}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${siteUrl}">
<meta property="og:title" content="${siteTitle}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrl}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${siteUrl}">
<meta property="twitter:title" content="${siteTitle}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${imageUrl}">`;
  };

  const code = generateTags();

  const handleCopy = () => {
    copyToClipboard(code);
    showToast('Meta tags copied!');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-subtle space-y-4">
        <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
          Configure Website Metadata
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Site Title
            </label>
            <input
              type="text"
              value={siteTitle}
              onChange={(e) => setSiteTitle(e.target.value)}
              placeholder="Enter site title"
              className="input-base text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Canonical URL
            </label>
            <input
              type="url"
              value={siteUrl}
              onChange={(e) => setSiteUrl(e.target.value)}
              placeholder="Enter canonical URL (e.g. https://example.com)"
              className="input-base text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Description (max 160 chars recommended)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter site description (150-160 chars recommended)..."
              className="input-base text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Keywords (comma-separated)
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords (e.g. web, development, tools)"
              className="input-base text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Author / Brand
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author or company name"
              className="input-base text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Social Share Banner Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter social image URL (e.g. https://example.com/banner.jpg)"
              className="input-base text-sm"
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            Generated HTML Meta Tags
          </label>
          <button onClick={handleCopy} className="btn-secondary text-xs py-1">
            <Copy className="w-3.5 h-3.5" /> Copy Code
          </button>
        </div>
        <textarea
          rows={11}
          readOnly
          value={code}
          className="input-base text-xs font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
        />
      </div>
    </div>
  );
};

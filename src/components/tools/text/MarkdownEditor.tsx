import React, { useState } from 'react';
import { copyToClipboard, downloadFile } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Download, Code, Eye } from 'lucide-react';

export const MarkdownEditor: React.FC = () => {
  const { showToast } = useToast();
  const [markdown, setMarkdown] = useState(
    "# Welcome to LifeTools Markdown Editor\n\nLifeTools offers **100% free**, client-side utilities.\n\n### Key Highlights\n- *No registration* or login\n- Fast browser-based compilation\n- Responsive and offline capable\n\n```javascript\nconsole.log('Hello LifeTools!');\n```\n\n> Simple, elegant, and privacy-first."
  );
  const [activeTab, setActiveTab] = useState<'split' | 'edit' | 'preview'>('split');

  // Lightweight safe client-side markdown to HTML parser
  const parseMarkdownToHtml = (md: string): string => {
    let html = md
      // Escape basic HTML
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Code blocks ```code```
    html = html.replace(/```([\s\S]*?)```/g, '<pre class="bg-slate-900 text-emerald-400 p-3 rounded-lg my-3 overflow-x-auto text-xs font-mono"><code>$1</code></pre>');

    // Inline code `code`
    html = html.replace(/`([^`]+)`/g, '<code class="bg-slate-200 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-xs font-mono">$1</code>');

    // Headings
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-base font-bold text-slate-900 dark:text-white mt-4 mb-2">$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-lg font-bold text-slate-900 dark:text-white mt-5 mb-2">$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-xl font-extrabold text-slate-900 dark:text-white mt-6 mb-3">$1</h1>');

    // Blockquote
    html = html.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-emerald-500 pl-3 my-2 text-slate-600 dark:text-slate-400 italic text-sm">$1</blockquote>');

    // Bold & Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // Unordered lists
    html = html.replace(/^\- (.*$)/gim, '<li class="ml-4 list-disc text-slate-700 dark:text-slate-300 text-sm">$1</li>');

    // Paragraphs
    html = html.replace(/\n\n/g, '<br/><br/>');

    return html;
  };

  const htmlPreview = parseMarkdownToHtml(markdown);

  const handleCopyMarkdown = () => {
    copyToClipboard(markdown);
    showToast('Markdown copied!');
  };

  const handleCopyHtml = () => {
    copyToClipboard(htmlPreview);
    showToast('Compiled HTML copied!');
  };

  const handleDownloadMd = () => {
    downloadFile(markdown, 'document.md');
    showToast('Downloaded document.md');
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-850 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('split')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'split' ? 'bg-white dark:bg-slate-750 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Split View
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'edit' ? 'bg-white dark:bg-slate-750 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Markdown Only
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'preview' ? 'bg-white dark:bg-slate-750 text-emerald-600 dark:text-emerald-400 shadow-sm' : 'text-slate-500'
            }`}
          >
            Preview Only
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={handleCopyMarkdown} className="btn-secondary text-xs py-1">
            <Copy className="w-3.5 h-3.5" /> Copy .md
          </button>
          <button onClick={handleCopyHtml} className="btn-secondary text-xs py-1">
            <Code className="w-3.5 h-3.5" /> Copy HTML
          </button>
          <button onClick={handleDownloadMd} className="btn-secondary text-xs py-1">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Editor */}
        {(activeTab === 'split' || activeTab === 'edit') && (
          <div className={activeTab === 'edit' ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Markdown Source
            </label>
            <textarea
              rows={14}
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="input-base font-mono text-sm leading-relaxed"
              placeholder="Write Markdown here..."
            />
          </div>
        )}

        {/* Live Preview */}
        {(activeTab === 'split' || activeTab === 'preview') && (
          <div className={activeTab === 'preview' ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Live Formatted Preview
            </label>
            <div
              className="w-full h-[375px] overflow-y-auto p-5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-inner prose prose-slate dark:prose-invert max-w-none text-sm"
              dangerouslySetInnerHTML={{ __html: htmlPreview }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

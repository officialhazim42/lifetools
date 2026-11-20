import React, { useState } from 'react';
import { copyToClipboard } from '../../../utils/formatters';
import { useToast } from '../../../context/ToastContext';
import { Copy, Trash2 } from 'lucide-react';

export const XmlFormatter: React.FC = () => {
  const { showToast } = useToast();
  const [xmlInput, setXmlInput] = useState(
    '<root><item id="1"><name>LifeTools</name><features><feature>Fast</feature><feature>Offline</feature></features></item></root>'
  );

  const formatXml = (xml: string): string => {
    let formatted = '';
    let indent = '';
    const tab = '  ';

    xml.split(/>\s*</).forEach((node) => {
      if (node.match(/^\/\w/)) {
        indent = indent.substring(tab.length);
      }
      formatted += indent + '<' + node + '>\r\n';
      if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith('input') && !node.startsWith('!--')) {
        indent += tab;
      }
    });

    return formatted.substring(1, formatted.length - 3);
  };

  const formatted = xmlInput.trim() ? formatXml(xmlInput.trim()) : '';

  const handleCopy = () => {
    copyToClipboard(formatted);
    showToast('Formatted XML copied!');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Raw XML Input</span>
            <button
              onClick={() => setXmlInput('')}
              className="text-rose-500 hover:text-rose-600 flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <textarea
            rows={10}
            value={xmlInput}
            onChange={(e) => setXmlInput(e.target.value)}
            className="input-base text-sm font-mono"
            placeholder="Paste XML..."
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase">
            <span>Pretty Printed XML</span>
            <button onClick={handleCopy} className="text-emerald-500 hover:text-emerald-600 flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <textarea
            rows={10}
            readOnly
            value={formatted}
            className="input-base text-sm font-mono bg-slate-50 dark:bg-slate-850 text-emerald-600 dark:text-emerald-400"
          />
        </div>
      </div>
    </div>
  );
};

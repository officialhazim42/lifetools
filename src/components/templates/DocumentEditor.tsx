import React, { useState, useRef, useEffect } from 'react';
import {
  TemplateDefinition,
  DocumentStyling,
  DocumentSection,
  SavedDocumentDraft,
  PageFormat,
  DocumentFont,
  DocumentFontSize
} from '../../types/templates';
import { DocumentPreview } from './DocumentPreview';
import {
  saveDocumentDraft,
  exportDocumentDraftAsJson,
  recordRecentTemplate
} from '../../utils/documentStorage';
import {
  Printer,
  Download,
  Save,
  RotateCcw,
  Upload,
  Trash2,
  Plus,
  Palette,
  Type,
  Layout,
  FileCode,
  Image as ImageIcon,
  CheckCircle2,
  FileText,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';

interface DocumentEditorProps {
  template: TemplateDefinition;
  initialDraft?: SavedDocumentDraft;
  onSave?: (saved: SavedDocumentDraft) => void;
}

export const DocumentEditor: React.FC<DocumentEditorProps> = ({
  template,
  initialDraft,
  onSave
}) => {
  const [styling, setStyling] = useState<DocumentStyling>(() => {
    return initialDraft?.styling || template.defaultStyling;
  });

  const [data, setData] = useState<Record<string, any>>(() => {
    return initialDraft?.data || { ...template.defaultData };
  });

  const [sections, setSections] = useState<DocumentSection[]>(() => {
    return initialDraft?.sections || JSON.parse(JSON.stringify(template.sections));
  });

  const [draftTitle, setDraftTitle] = useState<string>(() => {
    return initialDraft?.title || `${template.name} - ${new Date().toLocaleDateString()}`;
  });

  const [savedId, setSavedId] = useState<string | null>(() => {
    return initialDraft?.id || null;
  });

  const [activeMobileView, setActiveMobileView] = useState<'editor' | 'preview'>('editor');
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  // Record template in recently used
  useEffect(() => {
    recordRecentTemplate(template.id);
  }, [template.id]);

  // Handle Logo Upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setStyling((prev) => ({
        ...prev,
        showLogo: true,
        logoUrl: result
      }));
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setStyling((prev) => ({
      ...prev,
      showLogo: false,
      logoUrl: undefined
    }));
    if (logoInputRef.current) logoInputRef.current.value = '';
  };

  // Field change handler
  const handleFieldChange = (key: string, value: any) => {
    setData((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  // Section item handlers
  const handleAddItem = (sectionId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          const newItem = {
            id: `item_${Date.now()}`,
            description: 'New Item / Task Description',
            quantity: 1,
            rate: 1000,
            amount: 1000,
            note: 'Standard'
          };
          return {
            ...sec,
            items: [...(sec.items || []), newItem]
          };
        }
        return sec;
      })
    );
  };

  const handleRemoveItem = (sectionId: string, itemId: string) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          return {
            ...sec,
            items: (sec.items || []).filter((i) => i.id !== itemId)
          };
        }
        return sec;
      })
    );
  };

  const handleItemFieldChange = (
    sectionId: string,
    itemId: string,
    field: string,
    val: any
  ) => {
    setSections((prev) =>
      prev.map((sec) => {
        if (sec.id === sectionId) {
          const updatedItems = (sec.items || []).map((item) => {
            if (item.id === itemId) {
              const updated = { ...item, [field]: val };
              if (field === 'quantity' || field === 'rate') {
                const q = Number(field === 'quantity' ? val : item.quantity || 1);
                const r = Number(field === 'rate' ? val : item.rate || 0);
                updated.amount = q * r;
              }
              return updated;
            }
            return item;
          });
          return { ...sec, items: updatedItems };
        }
        return sec;
      })
    );
  };

  // Save draft
  const handleSaveDraft = () => {
    const saved = saveDocumentDraft({
      id: savedId || undefined,
      templateId: template.id,
      title: draftTitle || template.name,
      category: template.category,
      styling,
      data,
      sections
    });

    setSavedId(saved.id);
    setSaveFeedback('Draft saved locally!');
    setTimeout(() => setSaveFeedback(null), 3000);

    if (onSave) {
      onSave(saved);
    }
  };

  // Reset to original template defaults
  const handleReset = () => {
    if (window.confirm('Reset this template to its original defaults? All customized fields will be restored.')) {
      setStyling(template.defaultStyling);
      setData({ ...template.defaultData });
      setSections(JSON.parse(JSON.stringify(template.sections)));
    }
  };

  // Print / Save as PDF
  const handlePrint = () => {
    window.print();
  };

  // Export JSON
  const handleExportJson = () => {
    const draft: SavedDocumentDraft = {
      id: savedId || `doc_${Date.now()}`,
      templateId: template.id,
      title: draftTitle || template.name,
      category: template.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      styling,
      data,
      sections
    };
    exportDocumentDraftAsJson(draft);
  };

  // Accent Color Presets
  const colorPresets = [
    { label: 'Emerald', value: '#059669' },
    { label: 'Blue', value: '#2563eb' },
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Purple', value: '#7c3aed' },
    { label: 'Teal', value: '#0d9488' },
    { label: 'Amber', value: '#d97706' },
    { label: 'Rose', value: '#e11d48' },
    { label: 'Slate', value: '#1e293b' }
  ];

  return (
    <div className="space-y-6">
      {/* Top Header & Action Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
              {template.category}
            </span>
            <span className="text-xs text-slate-400">100% Client-Side</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Document Title..."
              className="text-lg sm:text-xl font-bold bg-transparent text-slate-900 dark:text-white border-b border-transparent hover:border-slate-300 focus:border-emerald-500 focus:outline-hidden py-0.5 px-1 max-w-sm"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {saveFeedback && (
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 animate-fade-in">
              <CheckCircle2 className="w-4 h-4" /> {saveFeedback}
            </span>
          )}

          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4 text-emerald-500" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={handleExportJson}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-600 dark:text-slate-300 text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Download editable JSON draft"
          >
            <FileCode className="w-4 h-4 text-blue-500" />
            <span className="hidden sm:inline">Export JSON</span>
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-850 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
            title="Reset template to factory defaults"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Mobile Tab Toggle (Controls vs Preview) */}
      <div className="lg:hidden flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
        <button
          type="button"
          onClick={() => setActiveMobileView('editor')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeMobileView === 'editor'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Editor Controls</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveMobileView('preview')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5 ${
            activeMobileView === 'preview'
              ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
              : 'text-slate-500'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Document Preview</span>
        </button>
      </div>

      {/* Two-Column Editor Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customization & Fields (Hidden on mobile if preview tab active) */}
        <div
          className={`lg:col-span-5 space-y-6 ${
            activeMobileView === 'preview' ? 'hidden lg:block' : 'block'
          }`}
        >
          {/* 1. Document Styling & Appearance Panel */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-500" />
              Document Style & Format
            </h3>

            {/* Typography selection */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                Font Family
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'inter', label: 'Inter (Sans)' },
                  { id: 'merriweather', label: 'Merriweather' },
                  { id: 'playfair', label: 'Playfair (Serif)' },
                  { id: 'mono', label: 'Monospace' }
                ].map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setStyling((prev) => ({ ...prev, font: f.id as DocumentFont }))}
                    className={`py-1.5 px-2 text-xs rounded-lg border text-center transition-colors ${
                      styling.font === f.id
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color Palette */}
            <div>
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                Accent Theme Color
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {colorPresets.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setStyling((prev) => ({ ...prev, accentColor: c.value }))}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      styling.accentColor === c.value ? 'ring-2 ring-offset-2 ring-slate-400 scale-110' : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
                <input
                  type="color"
                  value={styling.accentColor}
                  onChange={(e) => setStyling((prev) => ({ ...prev, accentColor: e.target.value }))}
                  className="w-6 h-6 rounded-md cursor-pointer border-none p-0 bg-transparent"
                  title="Custom Color"
                />
              </div>
            </div>

            {/* Page Format & Orientation */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Page Layout
                </label>
                <select
                  value={styling.pageFormat}
                  onChange={(e) => setStyling((prev) => ({ ...prev, pageFormat: e.target.value as PageFormat }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200"
                >
                  <option value="a4-portrait">A4 Portrait (210×297mm)</option>
                  <option value="a4-landscape">A4 Landscape (297×210mm)</option>
                  <option value="letter-portrait">Letter (8.5×11 in)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 block mb-1">
                  Text Spacing
                </label>
                <select
                  value={styling.fontSize}
                  onChange={(e) => setStyling((prev) => ({ ...prev, fontSize: e.target.value as DocumentFontSize }))}
                  className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2 text-slate-800 dark:text-slate-200"
                >
                  <option value="compact">Compact (Fit more content)</option>
                  <option value="standard">Standard Balanced</option>
                  <option value="relaxed">Relaxed / Spacious</option>
                </select>
              </div>
            </div>

            {/* Logo Upload */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
              <label className="text-xs font-semibold text-slate-500 block mb-1.5">
                Brand Logo / Seal (Optional)
              </label>
              <input
                ref={logoInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
                >
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{styling.logoUrl ? 'Change Logo' : 'Upload Logo'}</span>
                </button>
                {styling.logoUrl && (
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="text-xs text-rose-500 hover:underline px-2 py-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 2. Document Data Fields Form */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-500" />
              Content & Fields
            </h3>

            <div className="space-y-3">
              {Object.entries(data).map(([key, val]) => {
                const label = key
                  .replace(/([A-Z])/g, ' $1')
                  .replace(/^./, (str) => str.toUpperCase());

                const isLongText =
                  typeof val === 'string' &&
                  (val.length > 50 ||
                    key.toLowerCase().includes('body') ||
                    key.toLowerCase().includes('address') ||
                    key.toLowerCase().includes('summary') ||
                    key.toLowerCase().includes('notes') ||
                    key.toLowerCase().includes('citation') ||
                    key.toLowerCase().includes('experience') ||
                    key.toLowerCase().includes('education'));

                const isNumber = typeof val === 'number';

                const getPlaceholder = (k: string, lbl: string): string => {
                  const lower = k.toLowerCase();
                  if (lower.includes('fullname') || lower === 'name' || lower.includes('sendername') || lower.includes('author')) return 'Enter your full name';
                  if (lower.includes('clientname') || lower.includes('recipientname') || lower.includes('recipient')) return 'Enter recipient name';
                  if (lower.includes('jobtitle') || (lower.includes('title') && !lower.includes('document') && !lower.includes('head'))) return 'Enter your job title';
                  if (lower.includes('company') || lower.includes('organization') || lower.includes('storename')) return 'Enter company name';
                  if (lower.includes('address') || lower.includes('location')) return 'Enter your address';
                  if (lower.includes('email')) return 'Enter email address';
                  if (lower.includes('phone') || lower.includes('contact')) return 'Enter phone number';
                  if (lower.includes('website') || lower.includes('url')) return 'Enter website';
                  if (lower.includes('tax') || lower.includes('tin') || lower.includes('gst')) return 'Enter tax identification number';
                  if (lower.includes('amount') || lower.includes('rate') || lower.includes('price')) return 'Enter amount';
                  if (lower.includes('date')) return 'Enter document date';
                  if (lower.includes('destination')) return 'Enter destination';
                  if (lower.includes('summary')) return 'Enter summary...';
                  if (lower.includes('description') || lower.includes('productdescription')) return 'Enter description...';
                  if (lower.includes('reference') || lower.includes('refnumber')) return 'Enter reference number';
                  if (lower.includes('body')) return 'Enter message body...';
                  return `Enter ${lbl.toLowerCase()}`;
                };

                return (
                  <div key={key}>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                      {label}
                    </label>
                    {isLongText ? (
                      <textarea
                        rows={key.toLowerCase().includes('body') || key.toLowerCase().includes('experience') ? 6 : 3}
                        value={val || ''}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        placeholder={getPlaceholder(key, label)}
                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2.5 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    ) : isNumber ? (
                      <input
                        type="number"
                        value={val !== undefined ? val : ''}
                        onChange={(e) => handleFieldChange(key, parseFloat(e.target.value) || 0)}
                        placeholder={getPlaceholder(key, label)}
                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    ) : (
                      <input
                        type="text"
                        value={val || ''}
                        onChange={(e) => handleFieldChange(key, e.target.value)}
                        placeholder={getPlaceholder(key, label)}
                        className="w-full text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 p-2 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Section Line Items (if present) */}
          {sections.map((section) => (
            <div
              key={section.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-4 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {section.title}
                </h3>
                <button
                  type="button"
                  onClick={() => handleAddItem(section.id)}
                  className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </div>

              <div className="space-y-3">
                {(section.items || []).map((item, idx) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-slate-400 font-bold">#{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(section.id, item.id)}
                        className="text-rose-500 hover:text-rose-700 p-1"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <input
                      type="text"
                      placeholder="Item description..."
                      value={item.description || ''}
                      onChange={(e) => handleItemFieldChange(section.id, item.id, 'description', e.target.value)}
                      className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5"
                    />

                    <div className="grid grid-cols-2 gap-2">
                      {item.quantity !== undefined && (
                        <div>
                          <label className="text-[10px] text-slate-400 block">Quantity</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemFieldChange(section.id, item.id, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5"
                          />
                        </div>
                      )}
                      {item.rate !== undefined && (
                        <div>
                          <label className="text-[10px] text-slate-400 block">Rate / Price</label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemFieldChange(section.id, item.id, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5"
                          />
                        </div>
                      )}
                    </div>

                    {(item.note !== undefined || item.status !== undefined) && (
                      <input
                        type="text"
                        placeholder="Notes or status..."
                        value={item.note || item.status || ''}
                        onChange={(e) => handleItemFieldChange(section.id, item.id, item.note !== undefined ? 'note' : 'status', e.target.value)}
                        className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-1.5"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Live Responsive Document Preview (Hidden on mobile if editor tab active) */}
        <div
          className={`lg:col-span-7 ${
            activeMobileView === 'editor' ? 'hidden lg:block' : 'block'
          }`}
        >
          <div className="sticky top-20 space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-500 px-2">
              <span className="font-semibold uppercase tracking-wider">
                Live Document Preview ({styling.pageFormat})
              </span>
              <span>100% Vector Print Scale</span>
            </div>

            <DocumentPreview
              template={template}
              styling={styling}
              data={data}
              sections={sections}
              previewRef={previewRef}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

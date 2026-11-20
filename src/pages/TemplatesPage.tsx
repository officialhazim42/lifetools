import React, { useState, useEffect } from 'react';
import { SEO } from '../components/common/SEO';
import { TemplateLibrary } from '../components/templates/TemplateLibrary';
import { DocumentEditor } from '../components/templates/DocumentEditor';
import { TemplateDefinition, SavedDocumentDraft } from '../types/templates';
import { TEMPLATES_DATA } from '../data/templatesData';
import {
  FileText,
  Printer,
  ShieldCheck,
  HardDrive,
  ArrowLeft,
  Sparkles,
  Layers
} from 'lucide-react';

interface TemplatesPageProps {
  initialTemplateId?: string;
}

export const TemplatesPage: React.FC<TemplatesPageProps> = ({ initialTemplateId }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDefinition | null>(() => {
    if (initialTemplateId) {
      return TEMPLATES_DATA.find((t) => t.id === initialTemplateId) || null;
    }
    return null;
  });

  const [selectedDraft, setSelectedDraft] = useState<SavedDocumentDraft | undefined>(undefined);

  useEffect(() => {
    if (initialTemplateId) {
      const match = TEMPLATES_DATA.find((t) => t.id === initialTemplateId);
      if (match) setSelectedTemplate(match);
    }
  }, [initialTemplateId]);

  const handleSelectTemplate = (template: TemplateDefinition, draft?: SavedDocumentDraft) => {
    setSelectedTemplate(template);
    setSelectedDraft(draft);
    window.location.hash = `#/templates/${template.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToLibrary = () => {
    setSelectedTemplate(null);
    setSelectedDraft(undefined);
    window.location.hash = '#/templates';
  };

  return (
    <div className="space-y-6 pb-16">
      <SEO
        title={
          selectedTemplate
            ? `${selectedTemplate.name} — Templates & Document Creator | LifeTools`
            : 'Templates & Document Creator — 40 Free Printable Documents | LifeTools'
        }
        description="Create, customize, and print professional invoices, resumes, contracts, planners, attendance sheets, and letters in your browser. 100% free and client-side with zero server storage."
      />

      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-2xl bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-blue-100 border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> 40 Professional Templates
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-blue-100 border border-white/20">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Privacy
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-blue-100 border border-white/20">
              <Printer className="w-3.5 h-3.5" /> A4 & Letter Vector PDF
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            {selectedTemplate ? selectedTemplate.name : 'Templates & Document Creator'}
          </h1>

          <p className="text-blue-100 text-sm leading-relaxed">
            {selectedTemplate
              ? selectedTemplate.shortDescription
              : 'Create beautiful, print-ready documents in seconds. Choose from 40 customizable business, student, personal, and professional templates with local draft saving and instant PDF export.'}
          </p>
        </div>
      </div>

      {/* Navigation Breadcrumb when in Editor */}
      {selectedTemplate && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleBackToLibrary}
            className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Template Catalog</span>
          </button>
        </div>
      )}

      {/* Main View: Editor or Library */}
      <div className="min-h-[500px]">
        {selectedTemplate ? (
          <DocumentEditor
            template={selectedTemplate}
            initialDraft={selectedDraft}
          />
        ) : (
          <TemplateLibrary onSelectTemplate={handleSelectTemplate} />
        )}
      </div>
    </div>
  );
};

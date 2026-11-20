import React, { useState, useEffect, useMemo } from 'react';
import {
  TemplateDefinition,
  TemplateSectionCategory,
  SavedDocumentDraft
} from '../../types/templates';
import { TEMPLATES_DATA } from '../../data/templatesData';
import {
  getSavedDocuments,
  deleteDocumentDraft,
  duplicateDocumentDraft,
  exportDocumentDraftAsJson,
  getFavoriteTemplateIds,
  toggleFavoriteTemplate,
  getRecentTemplateIds
} from '../../utils/documentStorage';
import {
  Search,
  Star,
  Clock,
  LayoutGrid,
  FileText,
  Briefcase,
  GraduationCap,
  User,
  Sliders,
  Trash2,
  Copy,
  Download,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { DynamicIcon } from '../common/DynamicIcon';

interface TemplateLibraryProps {
  onSelectTemplate: (template: TemplateDefinition, draft?: SavedDocumentDraft) => void;
}

export const TemplateLibrary: React.FC<TemplateLibraryProps> = ({ onSelectTemplate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [savedDrafts, setSavedDrafts] = useState<SavedDocumentDraft[]>([]);
  const [activeView, setActiveView] = useState<'catalog' | 'drafts'>('catalog');

  const reloadStorage = () => {
    setFavorites(getFavoriteTemplateIds());
    setRecentIds(getRecentTemplateIds());
    setSavedDrafts(getSavedDocuments());
  };

  useEffect(() => {
    reloadStorage();
  }, []);

  const handleToggleFavorite = (e: React.MouseEvent, templateId: string) => {
    e.stopPropagation();
    toggleFavoriteTemplate(templateId);
    setFavorites(getFavoriteTemplateIds());
  };

  const handleDeleteDraft = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this saved document draft? This cannot be undone.')) {
      deleteDocumentDraft(id);
      setSavedDrafts(getSavedDocuments());
    }
  };

  const handleDuplicateDraft = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    duplicateDocumentDraft(id);
    setSavedDrafts(getSavedDocuments());
  };

  const handleExportDraft = (e: React.MouseEvent, draft: SavedDocumentDraft) => {
    e.stopPropagation();
    exportDocumentDraftAsJson(draft);
  };

  // Filtered Templates
  const filteredTemplates = useMemo(() => {
    return TEMPLATES_DATA.filter((tmpl) => {
      // Category filter
      if (activeCategory === 'favorites') {
        if (!favorites.includes(tmpl.id)) return false;
      } else if (activeCategory === 'recent') {
        if (!recentIds.includes(tmpl.id)) return false;
      } else if (activeCategory !== 'all' && tmpl.category !== activeCategory) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = tmpl.name.toLowerCase().includes(q);
        const matchesDesc = tmpl.shortDescription.toLowerCase().includes(q);
        const matchesTags = tmpl.tags.some((t) => t.toLowerCase().includes(q));
        return matchesName || matchesDesc || matchesTags;
      }

      return true;
    });
  }, [activeCategory, searchQuery, favorites, recentIds]);

  const categories = [
    { id: 'all', label: 'All Templates', count: TEMPLATES_DATA.length, icon: LayoutGrid },
    { id: 'business', label: 'Business', count: TEMPLATES_DATA.filter((t) => t.category === 'business').length, icon: Briefcase },
    { id: 'student', label: 'Student & Academic', count: TEMPLATES_DATA.filter((t) => t.category === 'student').length, icon: GraduationCap },
    { id: 'personal', label: 'Personal & Lifestyle', count: TEMPLATES_DATA.filter((t) => t.category === 'personal').length, icon: User },
    { id: 'professional', label: 'Professional Docs', count: TEMPLATES_DATA.filter((t) => t.category === 'professional').length, icon: FileText },
    { id: 'favorites', label: 'Starred Favorites', count: favorites.length, icon: Star },
    { id: 'recent', label: 'Recently Used', count: recentIds.length, icon: Clock }
  ];

  return (
    <div className="space-y-6">
      {/* View Switcher: Catalog vs Saved Drafts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl self-start">
          <button
            type="button"
            onClick={() => setActiveView('catalog')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${
              activeView === 'catalog'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Template Catalog ({TEMPLATES_DATA.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('drafts')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 ${
              activeView === 'drafts'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <span>My Saved Drafts</span>
            {savedDrafts.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500 text-white">
                {savedDrafts.length}
              </span>
            )}
          </button>
        </div>

        {/* Search Bar */}
        {activeView === 'catalog' && (
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search templates (e.g. invoice, resume, planner)..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-xs text-slate-400 hover:text-slate-600"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {/* CATALOG VIEW */}
      {activeView === 'catalog' && (
        <div className="space-y-6">
          {/* Category Pill Filters */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Templates Grid */}
          {filteredTemplates.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No Matching Templates Found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Try searching for different keywords or select a different category filter.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTemplates.map((template) => {
                const isFav = favorites.includes(template.id);
                return (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template)}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform"
                          style={{ backgroundColor: template.defaultStyling.accentColor }}
                        >
                          <DynamicIcon name={template.iconName} className="w-5 h-5 text-white" />
                        </div>

                        <button
                          type="button"
                          onClick={(e) => handleToggleFavorite(e, template.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isFav
                              ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/50'
                              : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'
                          }`}
                          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Star className={`w-4 h-4 ${isFav ? 'fill-amber-500' : ''}`} />
                        </button>
                      </div>

                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mb-1">
                        {template.category}
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {template.name}
                      </h3>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                        {template.shortDescription}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-mono text-slate-400">
                        {template.defaultPageFormat.toUpperCase()}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-1 text-xs">
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SAVED DRAFTS VIEW */}
      {activeView === 'drafts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Your Locally Saved Document Drafts
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              {savedDrafts.length} {savedDrafts.length === 1 ? 'document' : 'documents'}
            </span>
          </div>

          {savedDrafts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20">
              <FileText className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                No Saved Drafts Yet
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Choose any template from the catalog, customize your fields, and click "Save Draft" to preserve your work locally.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedDrafts.map((draft) => {
                const parentTemplate = TEMPLATES_DATA.find((t) => t.id === draft.templateId);
                return (
                  <div
                    key={draft.id}
                    className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between shadow-xs space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {draft.category}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(draft.updatedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-2">
                        {draft.title}
                      </h4>

                      <p className="text-xs text-slate-500 mt-0.5">
                        Template: {parentTemplate?.name || draft.templateId}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (parentTemplate) {
                            onSelectTemplate(parentTemplate, draft);
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1"
                      >
                        <span>Open & Edit</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => handleDuplicateDraft(e, draft.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                          title="Duplicate draft"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleExportDraft(e, draft)}
                          className="p-1.5 text-slate-400 hover:text-blue-500"
                          title="Export JSON"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteDraft(e, draft.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-500"
                          title="Delete draft"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

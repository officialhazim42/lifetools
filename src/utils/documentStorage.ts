/**
 * Local Document Draft Storage Manager for LifeTools Templates & Document Creator
 * 100% Client-Side Persistence via LocalStorage with Universal Backup Integration.
 */

import {
  SavedDocumentDraft,
  TEMPLATE_STORAGE_KEYS,
  TemplateDefinition
} from '../types/templates';
import { storage } from './storage';

export function getSavedDocuments(): SavedDocumentDraft[] {
  return storage.get<SavedDocumentDraft[]>(TEMPLATE_STORAGE_KEYS.DRAFTS, []);
}

export function getSavedDocumentById(id: string): SavedDocumentDraft | undefined {
  const all = getSavedDocuments();
  return all.find((d) => d.id === id);
}

export function saveDocumentDraft(
  draft: Omit<SavedDocumentDraft, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
): SavedDocumentDraft {
  const all = getSavedDocuments();
  const now = new Date().toISOString();

  let savedItem: SavedDocumentDraft;

  if (draft.id) {
    const existingIndex = all.findIndex((d) => d.id === draft.id);
    if (existingIndex >= 0) {
      savedItem = {
        ...all[existingIndex],
        ...draft,
        id: draft.id,
        updatedAt: now
      };
      all[existingIndex] = savedItem;
    } else {
      savedItem = {
        ...draft,
        id: draft.id,
        createdAt: now,
        updatedAt: now
      };
      all.unshift(savedItem);
    }
  } else {
    savedItem = {
      ...draft,
      id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: now,
      updatedAt: now
    };
    all.unshift(savedItem);
  }

  storage.set(TEMPLATE_STORAGE_KEYS.DRAFTS, all);
  return savedItem;
}

export function deleteDocumentDraft(id: string): boolean {
  const all = getSavedDocuments();
  const filtered = all.filter((d) => d.id !== id);
  if (filtered.length !== all.length) {
    storage.set(TEMPLATE_STORAGE_KEYS.DRAFTS, filtered);
    return true;
  }
  return false;
}

export function duplicateDocumentDraft(id: string): SavedDocumentDraft | undefined {
  const original = getSavedDocumentById(id);
  if (!original) return undefined;

  const duplicate: SavedDocumentDraft = {
    ...original,
    id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    title: `${original.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const all = getSavedDocuments();
  all.unshift(duplicate);
  storage.set(TEMPLATE_STORAGE_KEYS.DRAFTS, all);
  return duplicate;
}

export function exportDocumentDraftAsJson(draft: SavedDocumentDraft): void {
  const jsonStr = JSON.stringify(draft, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = draft.title.toLowerCase().replace(/[^a-z0-9]+/g, '_');
  a.href = url;
  a.download = `lifetools_${safeName}_${draft.id}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importDocumentDraftFromJson(jsonString: string): SavedDocumentDraft {
  const parsed = JSON.parse(jsonString);
  if (!parsed || !parsed.templateId || !parsed.title || !parsed.data) {
    throw new Error('Invalid LifeTools document draft: Missing required schema fields.');
  }

  const newDraft: SavedDocumentDraft = {
    id: `doc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    templateId: parsed.templateId,
    title: parsed.title,
    category: parsed.category || 'business',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    styling: parsed.styling || {
      font: 'inter',
      fontSize: 'standard',
      accentColor: '#059669',
      textColor: '#0f172a',
      pageFormat: 'a4-portrait',
      showLogo: false
    },
    data: parsed.data,
    sections: Array.isArray(parsed.sections) ? parsed.sections : []
  };

  const all = getSavedDocuments();
  all.unshift(newDraft);
  storage.set(TEMPLATE_STORAGE_KEYS.DRAFTS, all);
  return newDraft;
}

/**
 * Recent and Favorite Template Tracker.
 */
export function getRecentTemplateIds(): string[] {
  return storage.get<string[]>(TEMPLATE_STORAGE_KEYS.RECENT, []);
}

export function recordRecentTemplate(templateId: string): void {
  const recent = getRecentTemplateIds();
  const updated = [templateId, ...recent.filter((id) => id !== templateId)].slice(0, 15);
  storage.set(TEMPLATE_STORAGE_KEYS.RECENT, updated);
}

export function getFavoriteTemplateIds(): string[] {
  return storage.get<string[]>(TEMPLATE_STORAGE_KEYS.FAVORITES, []);
}

export function toggleFavoriteTemplate(templateId: string): boolean {
  const favorites = getFavoriteTemplateIds();
  const exists = favorites.includes(templateId);
  const updated = exists
    ? favorites.filter((id) => id !== templateId)
    : [...favorites, templateId];
  storage.set(TEMPLATE_STORAGE_KEYS.FAVORITES, updated);
  return !exists;
}

export function isTemplateFavorite(templateId: string): boolean {
  return getFavoriteTemplateIds().includes(templateId);
}

export function clearAllDrafts(): void {
  storage.set(TEMPLATE_STORAGE_KEYS.DRAFTS, []);
}

// Aliases for unified naming convention
export const getDocumentDrafts = getSavedDocuments;
export const getDocumentDraft = getSavedDocumentById;
export const exportDraftAsJson = exportDocumentDraftAsJson;
export const importDraftFromJson = importDocumentDraftFromJson;
export const toggleTemplateFavorite = toggleFavoriteTemplate;
export const recordTemplateUsage = recordRecentTemplate;
export const getRecentlyUsedTemplateIds = getRecentTemplateIds;

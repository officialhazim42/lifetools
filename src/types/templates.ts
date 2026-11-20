/**
 * Type definitions for LifeTools Templates & Document Creator
 */

export type TemplateSectionCategory = 'business' | 'student' | 'personal' | 'professional';

export type PageFormat = 'a4-portrait' | 'a4-landscape' | 'letter-portrait';

export type DocumentFont = 'inter' | 'roboto' | 'playfair' | 'merriweather' | 'mono';

export type DocumentFontSize = 'compact' | 'standard' | 'relaxed';

export interface DocumentStyling {
  font: DocumentFont;
  fontSize: DocumentFontSize;
  accentColor: string;
  textColor: string;
  pageFormat: PageFormat;
  showLogo: boolean;
  logoUrl?: string; // base64 data URL
  headerTitle?: string;
  footerNote?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity?: number;
  rate?: number;
  amount?: number;
  note?: string;
  status?: string;
}

export interface DocumentSection {
  id: string;
  title: string;
  content?: string;
  fields?: Record<string, string | number | boolean>;
  items?: LineItem[];
}

export interface TemplateDefinition {
  id: string;
  name: string;
  category: TemplateSectionCategory;
  shortDescription: string;
  iconName: string;
  tags: string[];
  defaultPageFormat: PageFormat;
  defaultStyling: DocumentStyling;
  defaultData: Record<string, any>;
  sections: DocumentSection[];
}

export interface SavedDocumentDraft {
  id: string;
  templateId: string;
  title: string;
  category: TemplateSectionCategory;
  createdAt: string;
  updatedAt: string;
  styling: DocumentStyling;
  data: Record<string, any>;
  sections: DocumentSection[];
}

export const TEMPLATE_STORAGE_KEYS = {
  DRAFTS: 'lifetools-document-drafts-v1',
  RECENT: 'lifetools-template-recent',
  FAVORITES: 'lifetools-template-favorites'
};

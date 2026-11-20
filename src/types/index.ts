import { ComponentType } from 'react';

export type ToolCategory =
  | 'calculators'
  | 'converters'
  | 'text'
  | 'developer'
  | 'image'
  | 'generators'
  | 'productivity'
  | 'finance'
  | 'datetime'
  | 'education'
  | 'security'
  | 'files'
  | 'everyday'
  | 'templates'
  | 'web'
  | 'media'
  | 'communication'
  | 'health'
  | 'travel'
  | 'home';

export interface CategoryInfo {
  id: ToolCategory;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  gradient: string;
  count?: number;
}

export interface ToolExample {
  title: string;
  description?: string;
  data: Record<string, any> | string;
}

export interface ToolFaq {
  question: string;
  answer: string;
}

export interface ToolItem {
  id: string;
  name: string;
  shortDescription: string;
  category: ToolCategory;
  iconName: string;
  keywords: string[];
  isPopular?: boolean;
  instructions: string[];
  examples?: ToolExample[];
  faqs?: ToolFaq[];
  relatedTools?: string[];
  disclaimer?: string;
  offlineAvailable?: boolean;
  component: ComponentType<any>;
}

export interface RecentToolEntry {
  toolId: string;
  lastUsed: number;
}

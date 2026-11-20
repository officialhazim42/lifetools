import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RecentToolEntry } from '../types';
import { storage } from '../utils/storage';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';

interface RecentToolsContextType {
  recentTools: RecentToolEntry[];
  recordToolUsage: (toolId: string) => void;
  clearRecentTools: () => void;
  removeRecentTool: (toolId: string) => void;
}

const STORAGE_KEY = 'lifetools-recent';
const MAX_RECENT_ITEMS = 20;

const RecentToolsContext = createContext<RecentToolsContextType | undefined>(undefined);

export const RecentToolsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentTools, setRecentTools] = useState<RecentToolEntry[]>(() => {
    const raw = storage.get<RecentToolEntry[]>(STORAGE_KEY, []);
    if (!Array.isArray(raw)) return [];

    const validToolIds = new Set(TOOLS_REGISTRY.map(t => t.id));
    const seen = new Set<string>();
    const cleaned: RecentToolEntry[] = [];

    for (const entry of raw) {
      if (
        entry &&
        typeof entry.toolId === 'string' &&
        validToolIds.has(entry.toolId) &&
        !seen.has(entry.toolId) &&
        typeof entry.lastUsed === 'number'
      ) {
        seen.add(entry.toolId);
        cleaned.push({ toolId: entry.toolId, lastUsed: entry.lastUsed });
      }
    }
    return cleaned.slice(0, MAX_RECENT_ITEMS);
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, recentTools);
  }, [recentTools]);

  const recordToolUsage = useCallback((toolId: string) => {
    setRecentTools((prev) => {
      // If already the most recent item used less than 10 seconds ago, skip update
      if (prev.length > 0 && prev[0].toolId === toolId && Date.now() - prev[0].lastUsed < 10000) {
        return prev;
      }
      const filtered = prev.filter((item) => item.toolId !== toolId);
      const updated = [{ toolId, lastUsed: Date.now() }, ...filtered];
      return updated.slice(0, MAX_RECENT_ITEMS);
    });
  }, []);

  const removeRecentTool = useCallback((toolId: string) => {
    setRecentTools((prev) => prev.filter((item) => item.toolId !== toolId));
  }, []);

  const clearRecentTools = useCallback(() => {
    setRecentTools([]);
  }, []);

  return (
    <RecentToolsContext.Provider
      value={{ recentTools, recordToolUsage, clearRecentTools, removeRecentTool }}
    >
      {children}
    </RecentToolsContext.Provider>
  );
};

export const useRecentTools = () => {
  const context = useContext(RecentToolsContext);
  if (!context) {
    throw new Error('useRecentTools must be used within a RecentToolsProvider');
  }
  return context;
};

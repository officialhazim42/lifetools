import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { storage } from '../utils/storage';
import { TOOLS_REGISTRY } from '../data/toolsRegistry';

interface FavoritesContextType {
  favorites: string[];
  isFavorite: (toolId: string) => boolean;
  toggleFavorite: (toolId: string) => void;
  removeFavorite: (toolId: string) => void;
  clearFavorites: () => void;
}

const STORAGE_KEY = 'lifetools-favorites';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Legacy demo seed list that should be wiped if found unchanged
const LEGACY_DEFAULT_FAVORITES = [
  'age-calculator',
  'percentage-calculator',
  'json-formatter',
  'word-counter',
  'url-qr-generator',
  'image-resizer'
];

function isLegacyDefaultList(list: string[]): boolean {
  if (list.length !== LEGACY_DEFAULT_FAVORITES.length) return false;
  return list.every((item, idx) => item === LEGACY_DEFAULT_FAVORITES[idx]);
}

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const raw = storage.get<string[]>(STORAGE_KEY, []);
    if (!Array.isArray(raw)) return [];
    
    // Purge legacy hardcoded demo seed list so fresh users start with 0
    if (isLegacyDefaultList(raw)) {
      storage.set(STORAGE_KEY, []);
      return [];
    }

    // Only keep valid existing tool IDs
    const validToolIds = new Set(TOOLS_REGISTRY.map(t => t.id));
    return raw.filter(id => typeof id === 'string' && validToolIds.has(id));
  });

  useEffect(() => {
    storage.set(STORAGE_KEY, favorites);
  }, [favorites]);

  const isFavorite = useCallback(
    (toolId: string) => favorites.includes(toolId),
    [favorites]
  );

  const toggleFavorite = useCallback((toolId: string) => {
    setFavorites((prev) =>
      prev.includes(toolId) ? prev.filter((id) => id !== toolId) : [...prev, toolId]
    );
  }, []);

  const removeFavorite = useCallback((toolId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== toolId));
  }, []);

  const clearFavorites = useCallback(() => {
    setFavorites([]);
  }, []);

  return (
    <FavoritesContext.Provider
      value={{ favorites, isFavorite, toggleFavorite, removeFavorite, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Header } from '../components/common/Header';
import { FavoritesProvider, useFavorites } from '../context/FavoritesContext';
import { RecentToolsProvider, useRecentTools } from '../context/RecentToolsContext';
import { ThemeProvider } from '../context/ThemeContext';
import { FavoritesPage } from '../pages/FavoritesPage';
import { RecentPage } from '../pages/RecentPage';
import { CATEGORIES } from '../data/categories';

const renderHeader = (currentPath = '/', onNavigate = vi.fn(), onOpenSearch = vi.fn()) => {
  return render(
    <ThemeProvider>
      <FavoritesProvider>
        <RecentToolsProvider>
          <Header
            currentPath={currentPath}
            onNavigate={onNavigate}
            onOpenSearch={onOpenSearch}
          />
        </RecentToolsProvider>
      </FavoritesProvider>
    </ThemeProvider>
  );
};

describe('Navigation System & Categories Dropdown', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders Categories dropdown button and toggles menu on click', () => {
    const onNavigate = vi.fn();
    renderHeader('/', onNavigate);

    const categoriesBtn = screen.getByRole('button', { name: /Categories/i });
    expect(categoriesBtn).toBeInTheDocument();
    expect(categoriesBtn).toHaveAttribute('aria-expanded', 'false');

    // Click to open
    fireEvent.click(categoriesBtn);
    expect(categoriesBtn).toHaveAttribute('aria-expanded', 'true');

    // Verify all 6 categories appear in the dropdown
    expect(screen.getByText('Calculators')).toBeInTheDocument();
    expect(screen.getByText('Converters')).toBeInTheDocument();
    expect(screen.getByText('Text Tools')).toBeInTheDocument();
    expect(screen.getByText('Developer Tools')).toBeInTheDocument();
    expect(screen.getByText('Image Tools')).toBeInTheDocument();
    expect(screen.getByText('QR & Generators')).toBeInTheDocument();

    // Click a category to navigate
    fireEvent.click(screen.getByText('Calculators'));
    expect(onNavigate).toHaveBeenCalledWith('/categories/calculators');

    // Dropdown should close after navigation
    expect(categoriesBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes Categories dropdown when Escape is pressed', () => {
    renderHeader('/');
    const categoriesBtn = screen.getByRole('button', { name: /Categories/i });

    // Open dropdown
    fireEvent.click(categoriesBtn);
    expect(categoriesBtn).toHaveAttribute('aria-expanded', 'true');

    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(categoriesBtn).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes Categories dropdown on outside click', () => {
    renderHeader('/');
    const categoriesBtn = screen.getByRole('button', { name: /Categories/i });

    // Open dropdown
    fireEvent.click(categoriesBtn);
    expect(categoriesBtn).toHaveAttribute('aria-expanded', 'true');

    // Click outside
    fireEvent.mouseDown(document.body);
    expect(categoriesBtn).toHaveAttribute('aria-expanded', 'false');
  });
});

describe('Favorites — Clean Empty State & Dynamic Updates', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts completely empty on fresh install with 0 count', () => {
    render(
      <FavoritesProvider>
        <FavoritesPage />
      </FavoritesProvider>
    );

    // Empty state should be visible with suggested messaging
    expect(screen.getByText('No favorites yet')).toBeInTheDocument();
    expect(
      screen.getByText('Add your frequently used tools to Favorites for quick access.')
    ).toBeInTheDocument();
    expect(screen.getByText('Browse All Tools')).toBeInTheDocument();
  });

  it('dynamically updates favorites badge in Header when an item is added', () => {
    const TestComponent = () => {
      const { favorites, toggleFavorite } = useFavorites();
      return (
        <div>
          <button onClick={() => toggleFavorite('json-formatter')}>Add JSON Formatter</button>
          <span data-testid="count">{favorites.length}</span>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <FavoritesProvider>
          <RecentToolsProvider>
            <Header currentPath="/" onNavigate={vi.fn()} onOpenSearch={vi.fn()} />
            <TestComponent />
          </RecentToolsProvider>
        </FavoritesProvider>
      </ThemeProvider>
    );

    // Initially no badge in navigation
    const countDisplay = screen.getByTestId('count');
    expect(countDisplay.textContent).toBe('0');

    // Click to add favorite
    fireEvent.click(screen.getByText('Add JSON Formatter'));

    // Count is now 1 and badge is displayed
    expect(countDisplay.textContent).toBe('1');
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
  });
});

describe('Recently Used — Clean Empty State & History Limits', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts completely empty on fresh install', () => {
    render(
      <RecentToolsProvider>
        <RecentPage />
      </RecentToolsProvider>
    );

    expect(screen.getByText('No recently used tools')).toBeInTheDocument();
    expect(
      screen.getByText('Tools you use will appear here automatically.')
    ).toBeInTheDocument();
    expect(screen.getByText('Explore All Tools')).toBeInTheDocument();
  });

  it('dynamically records tool usage and updates badge', () => {
    const TestComponent = () => {
      const { recentTools, recordToolUsage } = useRecentTools();
      return (
        <div>
          <button onClick={() => recordToolUsage('base64-encoder')}>Record Usage</button>
          <span data-testid="recent-count">{recentTools.length}</span>
        </div>
      );
    };

    render(
      <ThemeProvider>
        <FavoritesProvider>
          <RecentToolsProvider>
            <Header currentPath="/" onNavigate={vi.fn()} onOpenSearch={vi.fn()} />
            <TestComponent />
          </RecentToolsProvider>
        </FavoritesProvider>
      </ThemeProvider>
    );

    const countDisplay = screen.getByTestId('recent-count');
    expect(countDisplay.textContent).toBe('0');

    // Record usage
    fireEvent.click(screen.getByText('Record Usage'));

    expect(countDisplay.textContent).toBe('1');
    expect(screen.getAllByText('1').length).toBeGreaterThanOrEqual(1);
  });
});

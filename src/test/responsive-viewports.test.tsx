import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../context/ToastContext';
import { ThemeProvider } from '../context/ThemeContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { RecentToolsProvider } from '../context/RecentToolsContext';
import { Header } from '../components/common/Header';
import { DeveloperWidget } from '../components/common/DeveloperWidget';
import { DeveloperModal } from '../components/common/DeveloperModal';
import { BackToTop } from '../components/common/BackToTop';

const VIEWPORTS = [320, 360, 375, 390, 414, 768, 1024, 1280, 1366, 1440, 1600, 1920];

describe('Responsive Viewports & Layout Verification', () => {
  VIEWPORTS.forEach((width) => {
    it(`renders developer widget, modal, and back-to-top cleanly at ${width}px`, () => {
      // Set window innerWidth
      window.innerWidth = width;
      window.dispatchEvent(new Event('resize'));

      const { container } = render(
        <ToastProvider>
          <div>
            <DeveloperWidget />
            <BackToTop />
            <DeveloperModal isOpen={true} onClose={() => {}} />
          </div>
        </ToastProvider>
      );

      // Verify developer modal is rendered
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Hazim Bashir')).toBeInTheDocument();

      // Verify floating controls exist
      const aboutBtn = screen.getByRole('button', { name: /About Developer/i });
      expect(aboutBtn).toBeInTheDocument();
      expect(aboutBtn.className).toContain('left-5');

      const topBtn = screen.getByRole('button', { name: /Back to top/i });
      expect(topBtn).toBeInTheDocument();
      expect(topBtn.className).toContain('right-5');
    });

    it(`renders redesigned Header cleanly at ${width}px`, () => {
      window.innerWidth = width;
      window.dispatchEvent(new Event('resize'));

      render(
        <ThemeProvider>
          <FavoritesProvider>
            <RecentToolsProvider>
              <Header currentPath="/" onNavigate={vi.fn()} onOpenSearch={vi.fn()} />
            </RecentToolsProvider>
          </FavoritesProvider>
        </ThemeProvider>
      );

      // Brand Logo should always be present
      expect(screen.getByText('Life')).toBeInTheDocument();
      expect(screen.getByText('Tools')).toBeInTheDocument();

      // Right-side search trigger should always be accessible
      expect(screen.getByRole('button', { name: /Open global tool search/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Switch to/i })).toBeInTheDocument();
    });
  });
});

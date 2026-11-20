import { describe, it, expect } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import { ToastProvider } from '../context/ToastContext';
import { DeveloperWidget } from '../components/common/DeveloperWidget';
import { DeveloperModal } from '../components/common/DeveloperModal';
import { BackToTop } from '../components/common/BackToTop';

const VIEWPORTS = [320, 360, 375, 390, 414, 768, 1024, 1280, 1440, 1920];

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
  });
});

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { DEVELOPER_INFO, SOCIAL_PROFILES } from '../data/developerInfo';
import { DeveloperWidget } from '../components/common/DeveloperWidget';
import { BackToTop } from '../components/common/BackToTop';
import { ToastProvider } from '../context/ToastContext';
import { FavoritesProvider } from '../context/FavoritesContext';
import { RecentToolsProvider } from '../context/RecentToolsContext';
import { ToolDetailPage } from '../pages/ToolDetailPage';
import { Footer } from '../components/common/Footer';

describe('Developer Identity & Metadata Verification', () => {
  it('has exact developer identity details', () => {
    expect(DEVELOPER_INFO.fullName).toBe('Hazim Bashir');
    expect(DEVELOPER_INFO.urduName).toBe('حازم بشیر');
    expect(DEVELOPER_INFO.username).toBe('@officialhazim42');
    expect(DEVELOPER_INFO.discordUsername).toBe('officialhazim42');
    expect(DEVELOPER_INFO.role).toBe('Android Developer & Software Creator');
    expect(DEVELOPER_INFO.location).toBe('Ganderbal, Jammu & Kashmir, India');
    expect(DEVELOPER_INFO.email).toBe('hazimbashir.dev@gmail.com');
  });

  it('contains authentic developer biography and project context', () => {
    expect(DEVELOPER_INFO.bio).toContain('Hazim Bashir (حازم بشیر)');
    expect(DEVELOPER_INFO.bio).toContain('Ganderbal, Jammu & Kashmir, India');
    expect(DEVELOPER_INFO.projectContext).toContain('React 18');
    expect(DEVELOPER_INFO.projectContext).toContain('TypeScript');
    expect(DEVELOPER_INFO.projectContext).toContain('Tailwind CSS');
    expect(DEVELOPER_INFO.projectContext).toContain('Vite');
  });

  it('contains all 10 verified social media profiles with correct destinations', () => {
    expect(SOCIAL_PROFILES).toHaveLength(10);

    const profileMap = Object.fromEntries(SOCIAL_PROFILES.map((p) => [p.platform, p]));

    expect(profileMap['Instagram'].url).toBe('https://instagram.com/officialhazim42');
    expect(profileMap['GitHub'].url).toBe('https://github.com/officialhazim42');
    expect(profileMap['Reddit'].url).toBe('https://www.reddit.com/user/officialhazim42');
    expect(profileMap['Snapchat'].url).toBe('https://www.snapchat.com/add/officialhazim42');
    expect(profileMap['Discord'].url).toBe('https://discord.com/users/officialhazim42');
    expect(profileMap['Threads'].url).toBe('https://www.threads.net/@officialhazim42');
    expect(profileMap['LinkedIn'].url).toBe('https://www.linkedin.com/in/hazim-bashir-faqeer');
    expect(profileMap['X (Twitter)'].url).toBe('https://x.com/officialhazim42');
    expect(profileMap['Telegram'].url).toBe('https://t.me/officialhazim42');
    expect(profileMap['YouTube'].url).toBe('https://youtube.com/@officialhazim42');
  });

  it('includes proper Kashmir developer footer note', () => {
    expect(DEVELOPER_INFO.footerNote).toBe('Crafted with care by Hazim Bashir (حازم بشیر) in Kashmir.');
  });
});

describe('Developer Widget & Profile Modal UI', () => {
  it('renders floating button in bottom-left and opens modal with developer information', async () => {
    render(
      <ToastProvider>
        <DeveloperWidget />
      </ToastProvider>
    );

    const floatingBtn = screen.getByRole('button', { name: /About Developer/i });
    expect(floatingBtn).toBeInTheDocument();
    expect(floatingBtn.className).toContain('bottom-5');
    expect(floatingBtn.className).toContain('left-5');

    // Click to open modal
    fireEvent.click(floatingBtn);

    // Modal should be open with profile information
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Hazim Bashir')).toBeInTheDocument();
    expect(screen.getByText('(حازم بشیر)')).toBeInTheDocument();
    expect(screen.getAllByText('@officialhazim42').length).toBeGreaterThan(0);
    expect(screen.getByText('Android Developer & Software Creator')).toBeInTheDocument();
    expect(screen.getByText('Ganderbal, Jammu & Kashmir, India')).toBeInTheDocument();
    expect(screen.getByText('hazimbashir.dev@gmail.com')).toBeInTheDocument();
    expect(screen.getByText(/Crafted with care by Hazim Bashir/i)).toBeInTheDocument();

    // Close on Escape key
    fireEvent.keyDown(window, { key: 'Escape' });
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});

describe('Back to Top Button UI', () => {
  it('renders in bottom-right corner', () => {
    render(<BackToTop />);
    const btn = screen.getByRole('button', { name: /Back to top/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('bottom-5');
    expect(btn.className).toContain('right-5');
  });
});

describe('Code Generator & Tool Detail Infinite Loop / Scroll Trap Fix', () => {
  it('renders ToolDetailPage without infinite re-render loops or repeated scrollTo calls', () => {
    const scrollToSpy = vi.spyOn(window, 'scrollTo');
    render(
      <FavoritesProvider>
        <RecentToolsProvider>
          <ToastProvider>
            <ToolDetailPage toolId="qr-code-generator" />
          </ToastProvider>
        </RecentToolsProvider>
      </FavoritesProvider>
    );

    expect(screen.getByRole('heading', { name: 'QR Code Generator', level: 1 })).toBeInTheDocument();
    // scrollTo should NOT be called in an infinite loop
    expect(scrollToSpy).toHaveBeenCalledTimes(0);
    scrollToSpy.mockRestore();
  });
});

describe('Website Footer Verification', () => {
  it('renders copyright statement without the year 2026', () => {
    const mockNavigate = vi.fn();
    render(<Footer onNavigate={mockNavigate} />);

    // Must display exact expected string without 2026
    const copyrightParagraph = screen.getByText('© LifeTools. Free and open client-side utilities.');
    expect(copyrightParagraph).toBeInTheDocument();
    expect(copyrightParagraph.textContent).not.toContain('2026');
  });
});

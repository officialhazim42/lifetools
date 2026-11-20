import React, { useState, useEffect, useCallback } from 'react';
import { SettingsProvider } from './context/SettingsContext';
import { ThemeProvider } from './context/ThemeContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { RecentToolsProvider } from './context/RecentToolsContext';
import { ToastProvider } from './context/ToastContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { Router, parseHash } from './router/Router';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { DeveloperWidget } from './components/common/DeveloperWidget';
import { BackToTop } from './components/common/BackToTop';
import { ToastContainer } from './components/common/ToastContainer';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { TOOLS_REGISTRY } from './data/toolsRegistry';

export const AppContent: React.FC = () => {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return parseHash(window.location.hash).path;
  });
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentPath(parseHash(window.location.hash).path);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleNavigate = useCallback((path: string) => {
    const targetHash = path.startsWith('#') ? path : '#' + (path.startsWith('/') ? path : '/' + path);
    window.location.hash = targetHash;
  }, []);

  const handleSelectTool = useCallback((toolId: string) => {
    setIsSearchOpen(false);
    handleNavigate(`/tool/${toolId}`);
  }, [handleNavigate]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors selection:bg-indigo-500/20 selection:text-indigo-600 dark:selection:text-indigo-400">
      {/* Offline Status Banner */}
      <OfflineIndicator />

      {/* Header */}
      <Header
        currentPath={currentPath}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Router onOpenSearch={() => setIsSearchOpen(true)} />
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Interactive Overlays */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        tools={TOOLS_REGISTRY}
        onSelectTool={handleSelectTool}
      />

      {/* Developer Credit Widget (Bottom-Right) */}
      <DeveloperWidget />

      {/* Back to Top Floating Button (Above bottom-right controls) */}
      <BackToTop />

      {/* Toast Notification Stream */}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <SettingsProvider>
      <ThemeProvider>
        <FavoritesProvider>
          <RecentToolsProvider>
            <ToastProvider>
              <AppContent />
            </ToastProvider>
          </RecentToolsProvider>
        </FavoritesProvider>
      </ThemeProvider>
    </SettingsProvider>
  );
};

export default App;

import React, { useState, useEffect, lazy, Suspense } from 'react';
import { HomePage } from '../pages/HomePage';

const AllToolsPage = lazy(() => import('../pages/AllToolsPage').then(m => ({ default: m.AllToolsPage })));
const CategoriesPage = lazy(() => import('../pages/CategoriesPage').then(m => ({ default: m.CategoriesPage })));
const CategoryDetailPage = lazy(() => import('../pages/CategoryDetailPage').then(m => ({ default: m.CategoryDetailPage })));
const FavoritesPage = lazy(() => import('../pages/FavoritesPage').then(m => ({ default: m.FavoritesPage })));
const RecentPage = lazy(() => import('../pages/RecentPage').then(m => ({ default: m.RecentPage })));
const AboutPage = lazy(() => import('../pages/AboutPage').then(m => ({ default: m.AboutPage })));
const PrivacyPolicyPage = lazy(() => import('../pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const TermsPage = lazy(() => import('../pages/TermsPage').then(m => ({ default: m.TermsPage })));
const ContactPage = lazy(() => import('../pages/ContactPage').then(m => ({ default: m.ContactPage })));
const ToolDetailPage = lazy(() => import('../pages/ToolDetailPage').then(m => ({ default: m.ToolDetailPage })));
const WorkspacePage = lazy(() => import('../pages/WorkspacePage').then(m => ({ default: m.WorkspacePage })));
const SettingsPage = lazy(() => import('../pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const BackupRestorePage = lazy(() => import('../pages/BackupRestorePage').then(m => ({ default: m.BackupRestorePage })));
const TemplatesPage = lazy(() => import('../pages/TemplatesPage').then(m => ({ default: m.TemplatesPage })));
const MediaStudioPage = lazy(() => import('../pages/MediaStudioPage').then(m => ({ default: m.MediaStudioPage })));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const PageLoadingFallback: React.FC = () => (
  <div
    className="min-h-[40vh] flex flex-col items-center justify-center gap-3 text-slate-400 py-16"
    aria-busy="true"
    aria-live="polite"
  >
    <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
    <span className="text-xs font-medium tracking-wide">Loading...</span>
  </div>
);

interface RouterProps {
  onOpenSearch: () => void;
}

export interface RouteState {
  path: string;
  route: string;
  param?: string;
}

export function parsePath(raw: string): RouteState {
  // Strip leading hash, leading/trailing slashes, and index.html
  let clean = (raw || '').replace(/^#\/?/, '').trim();
  clean = clean.replace(/^\/+/, '').replace(/\/index\.html$/, '');
  const parts = clean.split('/').filter(Boolean);

  if (parts.length === 0) {
    return { path: '/', route: 'home' };
  }

  const root = parts[0].toLowerCase();

  if (root === 'tools') {
    return { path: '/tools', route: 'tools' };
  }
  if (root === 'categories') {
    if (parts[1]) {
      return { path: `/categories/${parts[1]}`, route: 'category-detail', param: parts[1] };
    }
    return { path: '/categories', route: 'categories' };
  }
  if (root === 'favorites') {
    return { path: '/favorites', route: 'favorites' };
  }
  if (root === 'recent') {
    return { path: '/recent', route: 'recent' };
  }
  if (root === 'about') {
    return { path: '/about', route: 'about' };
  }
  if (root === 'privacy') {
    return { path: '/privacy', route: 'privacy' };
  }
  if (root === 'terms') {
    return { path: '/terms', route: 'terms' };
  }
  if (root === 'contact') {
    return { path: '/contact', route: 'contact' };
  }
  if (root === 'workspace') {
    return { path: '/workspace', route: 'workspace', param: parts[1] };
  }
  if (root === 'settings') {
    return { path: '/settings', route: 'settings', param: parts[1] };
  }
  if (root === 'backup') {
    return { path: '/backup', route: 'backup', param: parts[1] };
  }
  if (root === 'templates') {
    return { path: '/templates', route: 'templates', param: parts[1] };
  }
  if (root === 'media') {
    return { path: '/media', route: 'media', param: parts[1] };
  }
  if (root === 'tool' && parts[1]) {
    return { path: `/tool/${parts[1]}`, route: 'tool-detail', param: parts[1] };
  }

  return { path: '/' + clean, route: '404' };
}

// Backward compatibility alias
export const parseHash = parsePath;

export function getCurrentRouteState(): RouteState {
  if (typeof window === 'undefined') {
    return { path: '/', route: 'home' };
  }

  // 1. Prioritize hash if present and non-empty
  const hash = window.location.hash;
  if (hash && hash !== '#' && hash !== '#/') {
    return parsePath(hash);
  }

  // 2. Fall back to pathname (for direct static/prerendered URLs like /tool/xyz or /about)
  const pathname = window.location.pathname;
  if (pathname && pathname !== '/' && pathname !== '/index.html' && pathname !== '/200.html') {
    return parsePath(pathname);
  }

  return { path: '/', route: 'home' };
}

export const Router: React.FC<RouterProps> = ({ onOpenSearch }) => {
  const [routeState, setRouteState] = useState<RouteState>(() => getCurrentRouteState());

  useEffect(() => {
    const handleLocationChange = () => {
      setRouteState(getCurrentRouteState());
      window.scrollTo({ top: 0, behavior: 'instant' });
    };

    window.addEventListener('hashchange', handleLocationChange);
    window.addEventListener('popstate', handleLocationChange);
    return () => {
      window.removeEventListener('hashchange', handleLocationChange);
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const renderRoute = () => {
    switch (routeState.route) {
      case 'home':
        return <HomePage onOpenSearch={onOpenSearch} />;
      case 'tools':
        return <AllToolsPage />;
      case 'categories':
        return <CategoriesPage />;
      case 'category-detail':
        return <CategoryDetailPage categoryId={routeState.param || ''} />;
      case 'favorites':
        return <FavoritesPage />;
      case 'recent':
        return <RecentPage />;
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPolicyPage />;
      case 'terms':
        return <TermsPage />;
      case 'contact':
        return <ContactPage />;
      case 'workspace':
        return <WorkspacePage initialTab={routeState.param} />;
      case 'settings':
        return <SettingsPage initialSection={routeState.param} />;
      case 'backup':
        return <BackupRestorePage initialTab={routeState.param} />;
      case 'templates':
        return <TemplatesPage initialTemplateId={routeState.param} />;
      case 'media':
        return <MediaStudioPage />;
      case 'tool-detail':
        return <ToolDetailPage toolId={routeState.param || ''} />;
      default:
        return <NotFoundPage onOpenSearch={onOpenSearch} />;
    }
  };

  return (
    <Suspense fallback={<PageLoadingFallback />}>
      {renderRoute()}
    </Suspense>
  );
};

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Logo } from './Logo';
import { useTheme } from '../../context/ThemeContext';
import {
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Star,
  Clock,
  LayoutGrid,
  LayoutDashboard,
  Wrench,
  Info,
  ChevronDown,
  ArrowRight,
  Settings as SettingsIcon,
  Database,
  FileText,
  Film
} from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useRecentTools } from '../../context/RecentToolsContext';
import { CATEGORIES } from '../../data/categories';
import { TOOLS_REGISTRY } from '../../data/toolsRegistry';
import { DynamicIcon } from './DynamicIcon';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const { theme, toggleTheme } = useTheme();
  const { favorites } = useFavorites();
  const { recentTools } = useRecentTools();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoriesDropdownOpen, setIsCategoriesDropdownOpen] = useState(false);
  const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const categoriesRef = useRef<HTMLDivElement>(null);
  const categoriesBtnRef = useRef<HTMLButtonElement>(null);

  // Compute dynamic tool count per category from centralized TOOLS_REGISTRY
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    TOOLS_REGISTRY.forEach((tool) => {
      counts[tool.category] = (counts[tool.category] || 0) + 1;
    });
    return counts;
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle outside click to close desktop categories dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        categoriesRef.current &&
        !categoriesRef.current.contains(e.target as Node)
      ) {
        setIsCategoriesDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCategoriesDropdownOpen) {
        setIsCategoriesDropdownOpen(false);
        categoriesBtnRef.current?.focus();
      }
    };

    if (isCategoriesDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isCategoriesDropdownOpen]);

  // Close menus when navigating
  const handleNav = (path: string) => {
    setIsMobileMenuOpen(false);
    setIsCategoriesDropdownOpen(false);
    onNavigate(path);
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'All Tools', path: '/tools', icon: Wrench },
    {
      label: 'Favorites',
      path: '/favorites',
      icon: Star,
      badge: favorites.length > 0 ? favorites.length : undefined
    },
    {
      label: 'Recently Used',
      path: '/recent',
      icon: Clock,
      badge: recentTools.length > 0 ? recentTools.length : undefined
    },
    { label: 'About', path: '/about', icon: Info }
  ];

  const isCategoriesActive = currentPath.startsWith('/categories');

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 border-b ${
        isScrolled
          ? 'bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-slate-200/80 dark:border-slate-800/80 shadow-subtle'
          : 'bg-white dark:bg-slate-950 border-slate-200/50 dark:border-slate-800/50'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Logo */}
        <a
          href="#/"
          onClick={(e) => {
            e.preventDefault();
            handleNav('/');
          }}
          className="focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg p-1"
        >
          <Logo size="md" />
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Home */}
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentPath === '/'
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <span>Home</span>
          </a>

          {/* All Tools */}
          <a
            href="#/tools"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/tools');
            }}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentPath.startsWith('/tools')
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <Wrench className="w-3.5 h-3.5 opacity-70" />
            <span>All Tools</span>
          </a>

          {/* Categories Dropdown Trigger & Panel */}
          <div ref={categoriesRef} className="relative">
            <button
              ref={categoriesBtnRef}
              onClick={() => setIsCategoriesDropdownOpen(!isCategoriesDropdownOpen)}
              aria-haspopup="true"
              aria-expanded={isCategoriesDropdownOpen}
              className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
                isCategoriesActive || isCategoriesDropdownOpen
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 opacity-70" />
              <span>Categories</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  isCategoriesDropdownOpen ? 'rotate-180 text-emerald-500' : 'opacity-70'
                }`}
              />
            </button>

            {/* Dropdown Menu */}
            {isCategoriesDropdownOpen && (
              <div
                className="absolute top-full left-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-slide-up focus:outline-none"
                role="menu"
                aria-label="Tool Categories"
              >
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 mb-1 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                    Explore Categories
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full">
                    {CATEGORIES.length} Categories
                  </span>
                </div>

                <div className="space-y-1">
                  {CATEGORIES.map((cat) => {
                    const count = categoryCounts[cat.id] || cat.count;
                    const isCatActive = currentPath === `/categories/${cat.id}`;

                    return (
                      <a
                        key={cat.id}
                        href={`#/categories/${cat.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNav(`/categories/${cat.id}`);
                        }}
                        role="menuitem"
                        className={`group flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer ${
                          isCatActive
                            ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                            : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-850 hover:text-emerald-600 dark:hover:text-emerald-400'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                              isCatActive
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:bg-emerald-500/10 group-hover:text-emerald-500'
                            }`}
                          >
                            <DynamicIcon name={cat.iconName} className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="text-xs sm:text-sm font-medium block truncate">
                              {cat.name}
                            </span>
                            <span className="text-[11px] text-slate-400 dark:text-slate-500 block truncate">
                              {cat.tagline}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                            isCatActive
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-emerald-500 group-hover:text-white transition-colors'
                          }`}
                        >
                          {count}
                        </span>
                      </a>
                    );
                  })}
                </div>

                {/* Bottom link to view all categories overview */}
                <div className="pt-2 mt-1 border-t border-slate-100 dark:border-slate-800">
                  <a
                    href="#/categories"
                    onClick={(e) => {
                      e.preventDefault();
                      handleNav('/categories');
                    }}
                    role="menuitem"
                    className="flex items-center justify-between p-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-850 transition-colors"
                  >
                    <span>Browse All Categories Overview</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Workspace */}
          <a
            href="#/workspace"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/workspace');
            }}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentPath.startsWith('/workspace')
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5 opacity-70" />
            <span>Workspace</span>
          </a>

          {/* Templates & Documents */}
          <a
            href="#/templates"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/templates');
            }}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentPath.startsWith('/templates')
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <FileText className="w-3.5 h-3.5 opacity-70" />
            <span>Templates</span>
            <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-semibold px-1.5 py-0.2 rounded-full">
              40
            </span>
          </a>

          {/* Media Studio */}
          <a
            href="#/media"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/media');
            }}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentPath.startsWith('/media')
                ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <Film className="w-3.5 h-3.5 opacity-70" />
            <span>Media Studio</span>
            <span className="text-[10px] bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 font-semibold px-1.5 py-0.2 rounded-full">
              70
            </span>
          </a>

          {/* Favorites */}
          <a
            href="#/favorites"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/favorites');
            }}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentPath.startsWith('/favorites')
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <Star className="w-3.5 h-3.5 opacity-70" />
            <span>Favorites</span>
            {favorites.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500 text-white">
                {favorites.length}
              </span>
            )}
          </a>

          {/* Recently Used */}
          <a
            href="#/recent"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/recent');
            }}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentPath.startsWith('/recent')
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <Clock className="w-3.5 h-3.5 opacity-70" />
            <span>Recently Used</span>
            {recentTools.length > 0 && (
              <span className="ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-emerald-500 text-white">
                {recentTools.length}
              </span>
            )}
          </a>

          {/* About */}
          <a
            href="#/about"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/about');
            }}
            className={`relative px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
              currentPath.startsWith('/about')
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-850'
            }`}
          >
            <Info className="w-3.5 h-3.5 opacity-70" />
            <span>About</span>
          </a>
        </nav>

        {/* Right Action Controls: Search, Theme, Mobile toggle */}
        <div className="flex items-center gap-2">
          {/* Global Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-all text-xs font-medium focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            title="Search tools (Ctrl+K or ⌘+K)"
            aria-label="Open global tool search"
          >
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <span className="hidden sm:inline">Search tools...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] text-slate-500 font-mono">
              <span>Ctrl</span> K
            </kbd>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Backup & Restore Button */}
          <a
            href="#/backup"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/backup');
            }}
            className={`p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
              currentPath.startsWith('/backup')
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            aria-label="Universal Backup & Restore"
            title="Universal Backup & Restore"
          >
            <Database className="w-4 h-4" />
          </a>

          {/* Settings Button */}
          <a
            href="#/settings"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/settings');
            }}
            className={`p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
              currentPath.startsWith('/settings')
                ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500'
                : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
            }`}
            aria-label="Settings Center"
            title="Settings Center"
          >
            <SettingsIcon className="w-4 h-4 transition-transform hover:rotate-45" />
          </a>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:ring-2 focus:ring-emerald-500 cursor-pointer"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-1.5 shadow-lg animate-fade-in max-h-[85vh] overflow-y-auto">
          {/* Home */}
          <a
            href="#/"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPath === '/'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <span>Home</span>
          </a>

          {/* All Tools */}
          <a
            href="#/tools"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/tools');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPath.startsWith('/tools')
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Wrench className="w-4 h-4 opacity-70" />
              <span>All Tools</span>
            </div>
            <span className="text-xs font-mono font-medium text-slate-400">{TOOLS_REGISTRY.length}</span>
          </a>

          {/* Categories Accordion on Mobile */}
          <div className="space-y-1">
            <button
              onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                isCategoriesActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutGrid className="w-4 h-4 opacity-70" />
                <span>Categories</span>
              </div>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isMobileCategoriesOpen ? 'rotate-180 text-emerald-500' : 'text-slate-400'
                }`}
              />
            </button>

            {isMobileCategoriesOpen && (
              <div className="pl-4 pr-1 py-1.5 space-y-1 border-l-2 border-emerald-500/30 ml-4 my-1">
                {CATEGORIES.map((cat) => {
                  const count = categoryCounts[cat.id] || cat.count;
                  const isCatActive = currentPath === `/categories/${cat.id}`;
                  return (
                    <a
                      key={cat.id}
                      href={`#/categories/${cat.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNav(`/categories/${cat.id}`);
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isCatActive
                          ? 'bg-emerald-100/70 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <DynamicIcon name={cat.iconName} className="w-3.5 h-3.5" />
                        <span>{cat.name}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400 font-semibold">
                        {count}
                      </span>
                    </a>
                  );
                })}

                <a
                  href="#/categories"
                  onClick={(e) => {
                    e.preventDefault();
                    handleNav('/categories');
                  }}
                  className="flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline pt-2"
                >
                  <span>View All Categories</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {/* Workspace */}
          <a
            href="#/workspace"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/workspace');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPath.startsWith('/workspace')
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <LayoutDashboard className="w-4 h-4 opacity-70" />
              <span>My Workspace</span>
            </div>
          </a>

          {/* Templates & Documents */}
          <a
            href="#/templates"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/templates');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPath.startsWith('/templates')
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 opacity-70" />
              <span>Templates & Documents</span>
            </div>
            <span className="text-xs font-mono font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded-full">
              40
            </span>
          </a>

          {/* Media Studio */}
          <a
            href="#/media"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/media');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPath.startsWith('/media')
                ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Film className="w-4 h-4 opacity-70" />
              <span>Media Studio</span>
            </div>
            <span className="text-xs font-mono font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2 py-0.5 rounded-full">
              70
            </span>
          </a>

          {/* Favorites */}
          <a
            href="#/favorites"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/favorites');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPath.startsWith('/favorites')
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Star className="w-4 h-4 opacity-70" />
              <span>Favorites</span>
            </div>
            {favorites.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                {favorites.length}
              </span>
            )}
          </a>

          {/* Recently Used */}
          <a
            href="#/recent"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/recent');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPath.startsWith('/recent')
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 opacity-70" />
              <span>Recently Used</span>
            </div>
            {recentTools.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500 text-white">
                {recentTools.length}
              </span>
            )}
          </a>

          {/* About */}
          <a
            href="#/about"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/about');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPath.startsWith('/about')
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Info className="w-4 h-4 opacity-70" />
              <span>About</span>
            </div>
          </a>

          {/* Backup & Restore */}
          <a
            href="#/backup"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/backup');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPath.startsWith('/backup')
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Database className="w-4 h-4 opacity-70" />
              <span>Backup & Restore</span>
            </div>
          </a>

          {/* Settings */}
          <a
            href="#/settings"
            onClick={(e) => {
              e.preventDefault();
              handleNav('/settings');
            }}
            className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
              currentPath.startsWith('/settings')
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-semibold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <SettingsIcon className="w-4 h-4 opacity-70" />
              <span>Settings</span>
            </div>
          </a>
        </div>
      )}
    </header>
  );
};

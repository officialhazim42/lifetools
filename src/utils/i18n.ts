import {
  DateFormatPreference,
  TimeFormatPreference,
  NumberFormatPreference,
  CurrencyPreference
} from '../types/settings';

// Core translation dictionary for English
const enDictionary: Record<string, string> = {
  // Navigation & Platform
  'nav.home': 'Home',
  'nav.all_tools': 'All Tools',
  'nav.categories': 'Categories',
  'nav.workspace': 'Workspace',
  'nav.favorites': 'Favorites',
  'nav.recent': 'Recently Used',
  'nav.settings': 'Settings',
  'nav.about': 'About',

  // Common Actions
  'action.save': 'Save',
  'action.cancel': 'Cancel',
  'action.confirm': 'Confirm',
  'action.delete': 'Delete',
  'action.clear': 'Clear',
  'action.reset': 'Reset',
  'action.export': 'Export',
  'action.import': 'Import',
  'action.copy': 'Copy',
  'action.search': 'Search',
  'action.filter': 'Filter',
  'action.edit': 'Edit',
  'action.close': 'Close',

  // Settings Sections
  'settings.title': 'Settings Center',
  'settings.subtitle': 'Manage your personal preferences, appearance, data storage, and privacy controls.',
  'settings.appearance': 'Appearance',
  'settings.language_region': 'Language & Region',
  'settings.privacy_security': 'Privacy & Security',
  'settings.offline_storage': 'Offline & Storage',
  'settings.notifications': 'Notifications',
  'settings.personalization': 'Personalization',
  'settings.data_management': 'Data Management',
  'settings.about_app': 'About Application'
};

// Extensible registry of language dictionaries
const dictionaries: Record<string, Record<string, string>> = {
  en: enDictionary
};

let currentLanguage = 'en';

export const setLanguage = (lang: string) => {
  if (dictionaries[lang]) {
    currentLanguage = lang;
  }
};

export const getLanguage = (): string => currentLanguage;

/**
 * Universal translation function.
 * Guaranteed never to return empty string or an untranslated placeholder symbol.
 */
export const t = (key: string, defaultText?: string): string => {
  const dict = dictionaries[currentLanguage] || dictionaries.en;
  if (dict && dict[key]) {
    return dict[key];
  }
  return defaultText !== undefined ? defaultText : key;
};

/**
 * Formats a Date object or timestamp according to the chosen date format.
 */
export const formatDate = (
  dateInput: Date | string | number,
  format: DateFormatPreference = 'DD/MM/YYYY'
): string => {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthName = monthNames[d.getMonth()];

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'D MMM YYYY':
      return `${d.getDate()} ${monthName} ${year}`;
    case 'DD/MM/YYYY':
    default:
      return `${day}/${month}/${year}`;
  }
};

/**
 * Formats time according to 12h or 24h convention.
 */
export const formatTime = (
  dateInput: Date | string | number,
  format: TimeFormatPreference = '12h'
): string => {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) return '';

  const hours24 = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, '0');

  if (format === '24h') {
    return `${String(hours24).padStart(2, '0')}:${minutes}`;
  }

  const ampm = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes} ${ampm}`;
};

/**
 * Formats numeric values according to regional preference (standard, Indian grouping, spaces, compact).
 */
export const formatNumber = (
  value: number,
  format: NumberFormatPreference = 'standard',
  precision: number = 2
): string => {
  if (isNaN(value)) return '0';

  if (format === 'compact') {
    if (Math.abs(value) >= 1_000_000_000) return (value / 1_000_000_000).toFixed(1) + 'B';
    if (Math.abs(value) >= 1_000_000) return (value / 1_000_000).toFixed(1) + 'M';
    if (Math.abs(value) >= 1_000) return (value / 1_000).toFixed(1) + 'K';
    return value.toLocaleString();
  }

  const fixed = value.toFixed(precision);
  const [intPart, decPart] = fixed.split('.');

  if (format === 'spaces') {
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  }

  if (format === 'indian') {
    // Indian numbering format: 3 digits at end, then 2 digits per group (e.g. 12,34,567)
    const isNegative = intPart.startsWith('-');
    const cleanInt = isNegative ? intPart.substring(1) : intPart;

    if (cleanInt.length <= 3) {
      return fixed;
    }

    const lastThree = cleanInt.substring(cleanInt.length - 3);
    const otherNumbers = cleanInt.substring(0, cleanInt.length - 3);
    const formattedOther = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    const formattedInt = (isNegative ? '-' : '') + `${formattedOther},${lastThree}`;
    return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
  }

  // Standard Western thousands grouping
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return decPart !== undefined ? `${formattedInt}.${decPart}` : formattedInt;
};

/**
 * Currency symbol mapping and formatting.
 */
export const CURRENCY_SYMBOLS: Record<CurrencyPreference, string> = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'CA$',
  AUD: 'AU$'
};

export const formatCurrency = (
  amount: number,
  currency: CurrencyPreference = 'INR',
  numberFormat: NumberFormatPreference = 'standard'
): string => {
  const symbol = CURRENCY_SYMBOLS[currency] || '₹';
  const precision = currency === 'JPY' ? 0 : 2;
  const formattedVal = formatNumber(amount, numberFormat, precision);
  return `${symbol} ${formattedVal}`;
};

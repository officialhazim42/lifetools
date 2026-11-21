import { CategoryInfo } from '../types';

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'calculators',
    name: 'Calculators',
    tagline: 'Financial, Math & Everyday Formulas',
    description: 'Precision calculators for finance, health, loans, geometry, and daily arithmetic needs.',
    iconName: 'Calculator',
    gradient: 'from-blue-500 to-indigo-600',
    count: 24
  },
  {
    id: 'converters',
    name: 'Converters',
    tagline: 'Measurement, Physical & Data Units',
    description: 'Accurate instant conversions across imperial, metric, digital data, temperature, and cooking measurements.',
    iconName: 'ArrowLeftRight',
    gradient: 'from-emerald-500 to-teal-600',
    count: 15
  },
  {
    id: 'text',
    name: 'Text Tools',
    tagline: 'Writing, Cleaners & Formatting',
    description: 'Comprehensive text analyzers, diff checkers, markdown editors, clean-up tools, and string manipulators.',
    iconName: 'Type',
    gradient: 'from-amber-500 to-orange-600',
    count: 22
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    tagline: 'Encoders, Formatters & Cryptography',
    description: 'Essential web dev utilities including JSON, Base64, Regex, JWT inspector, formatting, and SEO generators.',
    iconName: 'Code2',
    gradient: 'from-violet-500 to-purple-600',
    count: 26
  },
  {
    id: 'image',
    name: 'Image Tools',
    tagline: 'In-Browser Editing & Conversions',
    description: 'Privacy-first client-side image compression, resizing, cropping, format conversions, and metadata inspection.',
    iconName: 'Image',
    gradient: 'from-rose-500 to-pink-600',
    count: 15
  },
  {
    id: 'generators',
    name: 'QR & Generators',
    tagline: 'Interactive QR Codes & Randomizers',
    description: 'Custom QR code generators, Wi-Fi connectors, scanners, secure random passwords, and color palettes.',
    iconName: 'QrCode',
    gradient: 'from-cyan-500 to-blue-600',
    count: 16
  },
  {
    id: 'productivity',
    name: 'Daily Productivity',
    tagline: 'Tasks, Focus & Goal Management',
    description: 'Stay organized with to-do lists, quick notes, Pomodoro focus timers, habits, study plans, and world clocks.',
    iconName: 'CheckSquare',
    gradient: 'from-amber-500 to-yellow-600',
    count: 15
  },
  {
    id: 'finance',
    name: 'Personal Finance',
    tagline: 'Budgets, Expenses & Cash Counters',
    description: 'Track daily expenses, plan monthly budgets, manage savings goals, split bills, and count currency denominations with zero cloud sync.',
    iconName: 'Wallet',
    gradient: 'from-emerald-600 to-green-700',
    count: 15
  },
  {
    id: 'datetime',
    name: 'Date & Time',
    tagline: 'Calendars, Countdowns & Schedules',
    description: 'Generate printable calendars, track work hours, calculate shift times, plan sleep schedules, and countdown to special milestones.',
    iconName: 'CalendarClock',
    gradient: 'from-sky-500 to-blue-600',
    count: 10
  },
  {
    id: 'education',
    name: 'Student & Education',
    tagline: 'GPA, Timetables & Study Flashcards',
    description: 'Calculate CGPA/SGPA, track attendance shortages, generate study timetables, create flashcards, and solve academic formulas.',
    iconName: 'GraduationCap',
    gradient: 'from-indigo-500 to-violet-600',
    count: 15
  },
  {
    id: 'security',
    name: 'Privacy & Security',
    tagline: 'Client-Side Crypto & Safe Redaction',
    description: 'Check password entropy, generate secure PINs, encrypt/decrypt text with Web Crypto AES-GCM, verify file checksums, and inspect QR safety.',
    iconName: 'ShieldCheck',
    gradient: 'from-purple-600 to-fuchsia-700',
    count: 12
  },
  {
    id: 'files',
    name: 'File & Document Utilities',
    tagline: 'PDF Tools, CSV Viewers & File Inspectors',
    description: 'Merge, split, rotate, and extract PDF pages entirely in your browser. Inspect file types, convert CSV to JSON, and inspect file sizes safely.',
    iconName: 'FileSpreadsheet',
    gradient: 'from-teal-500 to-emerald-600',
    count: 17
  },
  {
    id: 'everyday',
    name: 'Everyday Life',
    tagline: 'Routines, Checklists & Lifestyle Utilities',
    description: 'Create grocery checklists, calculate fuel economy, track car maintenance, estimate home electricity usage, and make quick random decisions.',
    iconName: 'Sparkles',
    gradient: 'from-pink-500 to-rose-600',
    count: 15
  },
  {
    id: 'templates',
    name: 'Templates & Documents',
    tagline: 'Business, Student, Personal & Professional Creators',
    description: 'Create, customize, and print high-quality professional documents, invoices, resumes, planners, and letters with local storage.',
    iconName: 'FileText',
    gradient: 'from-blue-600 via-indigo-600 to-purple-600',
    count: 40
  },
  {
    id: 'web',
    name: 'Web & Internet Utilities',
    tagline: 'Website Diagnostics, SEO, Network & Dev Tools',
    description: 'Diagnose website connectivity, preview SEO and social cards, calculate subnets and bandwidth, code in live playgrounds, and generate UTM and social links. 100% client-side privacy.',
    iconName: 'Globe',
    gradient: 'from-cyan-600 via-sky-600 to-blue-700',
    count: 65
  },
  {
    id: 'media',
    name: 'Media Studio',
    tagline: 'Image Studio, Audio Editors, Video Trimmers & GIF Creators',
    description: 'Comprehensive browser-based media studio: edit photos, manipulate audio buffers, trim and compress videos, build animated GIFs, and inspect binary media headers. 100% private, zero uploads.',
    iconName: 'Film',
    gradient: 'from-rose-500 via-pink-600 to-purple-600',
    count: 70
  },
  {
    id: 'communication',
    name: 'Communication & Social',
    tagline: 'Email, Contacts, Messaging & Social Media Utilities',
    description: 'Professional client-side utilities for email drafting, vCard management, social media formatting, SMS calculations, and personal communication organization.',
    iconName: 'MessageSquare',
    gradient: 'from-blue-500 via-indigo-600 to-violet-600',
    count: 47
  },
  {
    id: 'health',
    name: 'Health, Fitness & Wellness',
    tagline: 'Calculators, Workouts, Nutrition, Sleep & Wellness Records',
    description: 'Personal health and fitness suite: scientific body composition calculators, workout planning, nutrition & calorie trackers, sleep timers, and private local health records. 100% private, zero uploads.',
    iconName: 'HeartPulse',
    gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
    count: 70
  },
  {
    id: 'travel',
    name: 'Travel, Navigation & Planning',
    tagline: 'Trip Planners, GPS Nav, Packing Lists & Travel Records',
    description: 'Comprehensive travel management suite: multi-day trip itineraries, great-circle GPS calculators, smart packing checklists, vehicle road trip estimators, and offline travel documents. 100% private, zero tracking.',
    iconName: 'Navigation',
    gradient: 'from-amber-500 via-orange-600 to-rose-600',
    count: 55
  },
  {
    id: 'home',
    name: 'Home, Household & Property',
    tagline: 'Utility Tariffs, Construction, Organization & Real Estate',
    description: 'Everyday household & property utility suite: electricity & water bill estimators, concrete & brick construction formulas, chore planners, inventory managers, home maintenance logs, and regional land converters. 100% client-side privacy.',
    iconName: 'Home',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-700',
    count: 70
  }
];

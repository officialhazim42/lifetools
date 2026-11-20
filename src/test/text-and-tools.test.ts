import { describe, it, expect } from 'vitest';
import { md5 } from '../utils/md5';
import { formatBytes, formatNumber } from '../utils/formatters';
import { TOOLS_REGISTRY, searchTools, getToolsByCategory, getPopularTools } from '../data/toolsRegistry';
import { CATEGORIES } from '../data/categories';

describe('Text, Utilities & Registry Tests', () => {
  it('computes MD5 hashes correctly in pure client-side JS', () => {
    expect(md5('hello world')).toBe('5eb63bbbe01eeed093cb22bb8f5acdc3');
    expect(md5('lifetools')).toBe('85c7bb4caded4b19749a5ba491b27be2');
    expect(md5('')).toBe('d41d8cd98f00b204e9800998ecf8427e');
  });

  it('formats byte quantities into readable strings', () => {
    expect(formatBytes(0)).toBe('0 Bytes');
    expect(formatBytes(1024)).toBe('1 KB');
    expect(formatBytes(1048576)).toBe('1 MB');
    expect(formatBytes(1073741824)).toBe('1 GB');
  });

  it('formats numbers with custom decimal precision', () => {
    expect(formatNumber(1234.5678, 2)).toBe('1,234.57');
    expect(formatNumber(1000000, 0)).toBe('1,000,000');
  });

  it('contains the foundational 117 tools across the original categories and supports expansion', () => {
    expect(TOOLS_REGISTRY.length).toBeGreaterThanOrEqual(117);
    expect(CATEGORIES.length).toBeGreaterThanOrEqual(13);

    const calcTools = getToolsByCategory('calculators');
    const convTools = getToolsByCategory('converters');
    const textTools = getToolsByCategory('text');
    const devTools = getToolsByCategory('developer');
    const imgTools = getToolsByCategory('image');
    const genTools = getToolsByCategory('generators');

    expect(calcTools.length).toBeGreaterThanOrEqual(24);
    expect(convTools.length).toBeGreaterThanOrEqual(15);
    expect(textTools.length).toBeGreaterThanOrEqual(22);
    expect(devTools.length).toBeGreaterThanOrEqual(26);
    expect(imgTools.length).toBeGreaterThanOrEqual(15);
    expect(genTools.length).toBeGreaterThanOrEqual(15);
  });

  it('finds tools using instant multi-keyword search', () => {
    const ageResults = searchTools('age');
    expect(ageResults.some(t => t.id === 'age-calculator')).toBe(true);

    const qrResults = searchTools('wifi');
    expect(qrResults.some(t => t.id === 'wifi-qr-generator')).toBe(true);

    const popular = getPopularTools();
    expect(popular.length).toBeGreaterThan(10);
  });
});

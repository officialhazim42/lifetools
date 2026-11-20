import { describe, it, expect } from 'vitest';
import { TOOLS_REGISTRY, getToolById, getToolsByCategory, searchTools } from '../data/toolsRegistry';
import { CATEGORIES } from '../data/categories';

describe('LifeTools Tools Expansion Registry Suite', () => {
  it('should have exactly 633 registered tools across 20 categories', () => {
    expect(TOOLS_REGISTRY.length).toBe(633);
    expect(CATEGORIES.length).toBe(20);
  });

  it('should have unique IDs for all 633 tools', () => {
    const ids = TOOLS_REGISTRY.map(t => t.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(633);
  });

  it('should correctly partition all 20 categories with expected counts', () => {
    const categoryCounts: Record<string, number> = {};
    for (const tool of TOOLS_REGISTRY) {
      categoryCounts[tool.category] = (categoryCounts[tool.category] || 0) + 1;
    }

    // Original 6 Categories (117 tools)
    expect(categoryCounts['calculators']).toBe(24);
    expect(categoryCounts['converters']).toBe(15);
    expect(categoryCounts['text']).toBe(22);
    expect(categoryCounts['developer']).toBe(26);
    expect(categoryCounts['image']).toBe(15);
    expect(categoryCounts['generators'] || categoryCounts['qr']).toBe(15);

    // 7 Everyday Digital Utility Categories (99 tools)
    expect(categoryCounts['productivity']).toBe(15);
    expect(categoryCounts['finance']).toBe(15);
    expect(categoryCounts['datetime']).toBe(10);
    expect(categoryCounts['education']).toBe(15);
    expect(categoryCounts['security']).toBe(12);
    expect(categoryCounts['files']).toBe(17);
    expect(categoryCounts['everyday']).toBe(15);

    // 14th Category: Templates & Documents (40 tools)
    expect(categoryCounts['templates']).toBe(40);

    // 15th Category: Web & Internet Utilities (65 tools)
    expect(categoryCounts['web']).toBe(65);

    // 16th Category: Media Studio (70 tools)
    expect(categoryCounts['media']).toBe(70);

    // 17th Category: Communication & Social (47 tools)
    expect(categoryCounts['communication']).toBe(47);

    // 18th Category: Health, Fitness & Wellness (70 tools)
    expect(categoryCounts['health']).toBe(70);

    // 19th Category: Travel, Navigation & Planning (55 tools)
    expect(categoryCounts['travel']).toBe(55);

    // 20th Category: Home, Household & Property Utilities (70 tools)
    expect(categoryCounts['home']).toBe(70);

    const totalCalculated = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
    expect(totalCalculated).toBe(633);
  });

  it('should have valid metadata and defined components for all tools', () => {
    for (const tool of TOOLS_REGISTRY) {
      expect(tool.id).toBeTruthy();
      expect(tool.name).toBeTruthy();
      expect(tool.shortDescription).toBeTruthy();
      expect(tool.category).toBeTruthy();
      expect(tool.iconName).toBeTruthy();
      expect(Array.isArray(tool.keywords)).toBe(true);
      expect(tool.keywords.length).toBeGreaterThan(0);
      expect(Array.isArray(tool.instructions)).toBe(true);
      expect(tool.instructions.length).toBeGreaterThan(0);
      expect(tool.component).toBeDefined();
    }
  });

  it('should retrieve tools by id and category accurately', () => {
    const grocery = getToolById('grocery-list-maker');
    expect(grocery).toBeDefined();
    expect(grocery?.category).toBe('everyday');

    const water = getToolById('water-intake-reminder');
    expect(water).toBeDefined();
    expect(water?.category).toBe('everyday');

    const wheel = getToolById('random-decision-maker');
    expect(wheel).toBeDefined();
    expect(wheel?.name).toContain('Random Decision Maker');

    const everydayTools = getToolsByCategory('everyday');
    expect(everydayTools.length).toBe(15);
  });

  it('should support search across keywords and descriptions', () => {
    const carResults = searchTools('maintenance');
    expect(carResults.some(t => t.id === 'car-maintenance-tracker')).toBe(true);

    const mileageResults = searchTools('mileage');
    expect(mileageResults.some(t => t.id === 'fuel-mileage-calculator')).toBe(true);

    const pdfResults = searchTools('compress pdf');
    expect(pdfResults.some(t => t.id === 'pdf-compressor')).toBe(true);
  });
});
